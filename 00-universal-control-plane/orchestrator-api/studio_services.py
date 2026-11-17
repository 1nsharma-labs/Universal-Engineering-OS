"""
UNIFORGE Operational Studio — Wiki, Official Plugins, Cloud Multi-Tenancy & Marketplace Services
"""

import json
import math
import subprocess
import sys
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List

HUB_ROOT = Path(__file__).resolve().parents[2]
WIKI_PROFILES_DIR = HUB_ROOT / "docs" / "wiki" / "profiles"
PLUGINS_DIR = HUB_ROOT / "plugins"
MARKETPLACE_DIR = HUB_ROOT / "marketplace"

if str(MARKETPLACE_DIR) not in sys.path:
    sys.path.insert(0, str(MARKETPLACE_DIR))

from billing import (  # noqa: E402
    create_checkout_preview,
    load_catalog,
    search_marketplace,
    verify_license_key,
)


# ---------------------------------------------------------------------------
# 1. Universal Wiki (60+ Technology Profiles)
# ---------------------------------------------------------------------------
def list_wiki_profiles(query: str = "") -> Dict[str, Any]:
    q = (query or "").strip().lower()
    profiles = []
    if WIKI_PROFILES_DIR.exists():
        for md_file in sorted(WIKI_PROFILES_DIR.glob("*.md")):
            slug = md_file.stem
            first_line = md_file.read_text(encoding="utf-8").splitlines()[0].lstrip("# ").strip()
            if q and q not in slug.lower() and q not in first_line.lower():
                continue
            profiles.append({
                "slug": slug,
                "title": first_line,
                "path": f"docs/wiki/profiles/{md_file.name}",
                "size_bytes": md_file.stat().st_size,
            })
    return {
        "total": len(profiles),
        "profiles": profiles,
    }


def get_wiki_profile(slug: str) -> Dict[str, Any]:
    safe_slug = "".join(c for c in slug if c.isalnum() or c in ("-", "_"))
    target = WIKI_PROFILES_DIR / f"{safe_slug}.md"
    if not target.exists():
        return {"ok": False, "error": f"Wiki profile '{safe_slug}' not found."}
    return {
        "ok": True,
        "slug": safe_slug,
        "path": f"docs/wiki/profiles/{target.name}",
        "markdown": target.read_text(encoding="utf-8"),
    }


# ---------------------------------------------------------------------------
# 2. Official Plugins Discovery & Execution
# ---------------------------------------------------------------------------
def list_installed_plugins() -> Dict[str, Any]:
    plugins = []
    if PLUGINS_DIR.exists():
        for manifest_path in sorted(PLUGINS_DIR.glob("*/uniforge-plugin.json")):
            try:
                manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
                plugins.append({
                    "folder": manifest_path.parent.name,
                    "manifest": manifest,
                    "status": "ACTIVE",
                })
            except Exception as exc:
                plugins.append({
                    "folder": manifest_path.parent.name,
                    "error": str(exc),
                    "status": "INVALID",
                })
    return {"count": len(plugins), "plugins": plugins}


def execute_plugin_command(plugin_id: str, command_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Executes built-in studio actions for the 5 official UNIFORGE plugins."""
    pid = plugin_id.strip()
    cid = command_id.strip()

    if pid == "@uniforge/plugin-docker-manager":
        if cid == "systemInfo":
            try:
                res = subprocess.run(["docker", "--version"], capture_output=True, text=True, timeout=5)
                return {"ok": res.returncode == 0, "plugin": pid, "command": cid, "output": res.stdout.strip() or res.stderr.strip()}
            except FileNotFoundError:
                return {"ok": False, "plugin": pid, "command": cid, "output": "Docker CLI not installed on host."}
        return {"ok": True, "plugin": pid, "command": cid, "stacks": ["docker-compose.infra.yml", "docker-compose.models.yml", "docker-compose.cloud.yml"]}

    if pid == "@uniforge/plugin-pgvector-explorer":
        if cid == "cosineSimilarity":
            a = payload.get("vectorA", [0.85, 0.12, 0.44])
            b = payload.get("vectorB", [0.80, 0.19, 0.41])
            dot = sum(x * y for x, y in zip(a, b))
            na = math.sqrt(sum(x * x for x in a))
            nb = math.sqrt(sum(y * y for y in b))
            score = round(dot / (na * nb), 6) if na and nb else 0.0
            return {"ok": True, "plugin": pid, "command": cid, "cosine_similarity": score, "cosine_distance": round(1 - score, 6)}
        table = str(payload.get("table", "documents"))
        return {
            "ok": True,
            "plugin": pid,
            "command": cid,
            "sql": f"SELECT id, content, 1 - (embedding <=> $1::vector) AS score FROM {table} ORDER BY embedding <=> $1::vector LIMIT 10;",
            "recommended_index": f"CREATE INDEX CONCURRENTLY idx_{table}_hnsw ON {table} USING hnsw (embedding vector_cosine_ops);",
        }

    if pid == "@uniforge/plugin-p5js-studio":
        return {
            "ok": True,
            "plugin": pid,
            "command": cid,
            "templates": ["flow-field", "orbital-rings", "audio-reactive-grid"],
            "preview_url": "http://localhost:8088",
        }

    if pid == "@uniforge/plugin-spring-boot-controller":
        return {
            "ok": True,
            "plugin": pid,
            "command": cid,
            "project_pom": "02-frameworks-and-templates/java-ecosystem/pom.xml",
            "actuator_endpoints": ["/actuator/health", "/actuator/metrics", "/actuator/beans", "/actuator/prometheus"],
        }

    if pid == "@uniforge/plugin-ollama-ai-studio":
        return {
            "ok": True,
            "plugin": pid,
            "command": cid,
            "endpoint": payload.get("host", "http://localhost:11434"),
            "recommended_models": ["llama3.2", "qwen2.5-coder:7b", "nomic-embed-text"],
        }

    return {"ok": False, "error": f"Unknown plugin '{pid}'"}


# ---------------------------------------------------------------------------
# 3. UNIFORGE Cloud Multi-Tenant Workspace Control Plane
# ---------------------------------------------------------------------------
_CLOUD_TENANTS: List[Dict[str, Any]] = [
    {
        "id": "tnt-uniforge-core",
        "slug": "uniforge-core",
        "organization_name": "UNIFORGE Core Engineering",
        "plan_tier": "enterprise",
        "sso_provider": "Okta SAML 2.0",
        "region": "us-central1",
        "rls_enforced": True,
        "quotas": {"max_workspaces": 25, "cpu_millicores": 16000, "memory_mb": 32768},
        "workspaces": [
            {"id": "ws-01", "name": "polyglot-control-plane", "subdomain": "core.workspaces.uniforge.io", "status": "RUNNING"},
            {"id": "ws-02", "name": "ai-rag-sandbox", "subdomain": "ai-rag.workspaces.uniforge.io", "status": "RUNNING"},
        ],
    },
    {
        "id": "tnt-acme-labs",
        "slug": "acme-labs",
        "organization_name": "Acme Robotics Labs",
        "plan_tier": "pro",
        "sso_provider": "GitHub OIDC",
        "region": "europe-west1",
        "rls_enforced": True,
        "quotas": {"max_workspaces": 10, "cpu_millicores": 8000, "memory_mb": 16384},
        "workspaces": [
            {"id": "ws-03", "name": "sim-studio", "subdomain": "acme-sim.workspaces.uniforge.io", "status": "RUNNING"},
        ],
    },
]


def get_cloud_overview() -> Dict[str, Any]:
    return {
        "platform": "UNIFORGE Cloud Multi-Tenant Platform",
        "version": "1.0.0",
        "isolation_controls": ["PostgreSQL RLS", "Kubernetes NetworkPolicy", "Rootless Containers (UID 65534)", "Traefik TLS 1.3 Wildcard Edge"],
        "enterprise_features": ["SAML 2.0 / Okta SSO", "SOC 2 Type II Audit Streams", "Dedicated VPC", "99.95% SLA"],
        "sponsors_enabled": True,
        "tenant_count": len(_CLOUD_TENANTS),
        "workspace_count": sum(len(t["workspaces"]) for t in _CLOUD_TENANTS),
        "tenants": _CLOUD_TENANTS,
    }


def create_cloud_tenant(organization_name: str, plan_tier: str = "pro", region: str = "us-central1") -> Dict[str, Any]:
    slug = "".join(c if c.isalnum() else "-" for c in organization_name.lower()).strip("-")[:32] or f"org-{uuid.uuid4().hex[:6]}"
    tier = plan_tier if plan_tier in ("free", "pro", "team", "enterprise") else "pro"
    quotas = {
        "free": {"max_workspaces": 3, "cpu_millicores": 2000, "memory_mb": 4096},
        "pro": {"max_workspaces": 10, "cpu_millicores": 8000, "memory_mb": 16384},
        "team": {"max_workspaces": 20, "cpu_millicores": 16000, "memory_mb": 32768},
        "enterprise": {"max_workspaces": 100, "cpu_millicores": 64000, "memory_mb": 131072},
    }[tier]
    tenant = {
        "id": f"tnt-{uuid.uuid4().hex[:8]}",
        "slug": slug,
        "organization_name": organization_name,
        "plan_tier": tier,
        "sso_provider": "SAML 2.0 / OIDC" if tier == "enterprise" else "GitHub OAuth",
        "region": region,
        "rls_enforced": True,
        "quotas": quotas,
        "workspaces": [
            {
                "id": f"ws-{uuid.uuid4().hex[:6]}",
                "name": "default-studio",
                "subdomain": f"{slug}.workspaces.uniforge.io",
                "status": "PROVISIONED",
            }
        ],
        "created_at": int(time.time()),
    }
    _CLOUD_TENANTS.append(tenant)
    return {"ok": True, "tenant": tenant}


# ---------------------------------------------------------------------------
# 4. Marketplace Facade
# ---------------------------------------------------------------------------
def get_marketplace_catalog(query: str = "", tier: str = "") -> Dict[str, Any]:
    catalog = load_catalog()
    return {
        "marketplaceVersion": catalog["marketplaceVersion"],
        "revenueSharePolicy": catalog["revenueSharePolicy"],
        "plugins": search_marketplace(query=query, tier=tier),
    }


def run_marketplace_checkout(tenant_id: str, plugin_id: str) -> Dict[str, Any]:
    return create_checkout_preview(tenant_id=tenant_id, plugin_id=plugin_id)


def check_marketplace_license(license_key: str, tenant_id: str, plugin_id: str, tier: str = "paid_monthly") -> Dict[str, Any]:
    valid = verify_license_key(license_key, tenant_id, plugin_id, tier=tier)
    return {"valid": valid, "tenant_id": tenant_id, "plugin_id": plugin_id, "tier": tier}

