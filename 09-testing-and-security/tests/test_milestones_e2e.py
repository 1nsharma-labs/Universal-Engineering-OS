"""
UNIFORGE End-to-End Verification Test Suite (Milestones 1 through 4)
"""

import hashlib
import hmac
import json
import sys
import time
from pathlib import Path

HUB_ROOT = Path(__file__).resolve().parents[2]
ORCH_DIR = HUB_ROOT / "00-universal-control-plane" / "orchestrator-api"
MARKETPLACE_DIR = HUB_ROOT / "marketplace"

for p in (str(ORCH_DIR), str(MARKETPLACE_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)


# ==============================================================================
# Milestone 1 (Weeks 1-4): Foundation, Governance & Root Controller
# ==============================================================================
def test_milestone1_governance_files_exist():
    required_files = [
        "LICENSE",
        "CONTRIBUTING.md",
        "SECURITY.md",
        "CODE_OF_CONDUCT.md",
        "GOVERNANCE.md",
        "NOTICE",
        "devhub.py",
        "devhub.ps1",
        "Makefile",
        ".github/profile/README.md",
        ".github/CODEOWNERS",
        ".github/FUNDING.yml",
        ".github/dependabot.yml",
        ".github/workflows/ci.yml",
        ".github/workflows/release-sdk.yml",
        ".github/workflows/cloud-deploy.yml",
        "docs/rfcs/0000-template.md",
    ]
    for rel in required_files:
        path = HUB_ROOT / rel
        assert path.exists(), f"Missing Milestone 1 artifact: {rel}"
        assert path.stat().st_size > 50, f"Artifact appears empty: {rel}"

    license_text = (HUB_ROOT / "LICENSE").read_text(encoding="utf-8")
    assert "Apache License" in license_text and "Version 2.0, January 2004" in license_text


# ==============================================================================
# Milestone 2 (Weeks 5-8): Operational Studios & 60+ Wiki Profiles
# ==============================================================================
def test_milestone2_registry_and_wiki_50_plus():
    reg_path = HUB_ROOT / "00-universal-control-plane" / "technology-registry" / "technology-registry.json"
    reg = json.loads(reg_path.read_text(encoding="utf-8"))
    assert len(reg["domains"]) == 15
    assert len(reg["technologies"]) >= 50, f"Expected >=50 technologies, got {len(reg['technologies'])}"

    profiles_dir = HUB_ROOT / "docs" / "wiki" / "profiles"
    profiles = list(profiles_dir.glob("*.md"))
    assert len(profiles) >= 50, f"Expected >=50 wiki profiles, got {len(profiles)}"

    # Verify 10-point documentation standard in sample profile
    sample = (profiles_dir / "nextjs.md").read_text(encoding="utf-8")
    for heading in (
        "## 1. Overview",
        "## 5. Interactive Working Code Example",
        "## 9. Security, Auditing & Best Practices",
        "## 10. Alternatives & Comparison Matrix",
    ):
        assert heading in sample


def test_milestone2_backend_services():
    from lsp_service import analyze_diagnostics, format_code, get_completions
    from terminal_service import execute_terminal_command

    # Monaco LSP Diagnostics: valid Python
    ok_res = analyze_diagnostics("python", "def greet(name: str) -> str:\n    return f'Hello {name}'\n")
    assert ok_res["valid"] is True
    assert ok_res["error_count"] == 0

    # Monaco LSP Diagnostics: syntax error detection
    bad_res = analyze_diagnostics("python", "def broken(:\n    pass")
    assert bad_res["valid"] is False
    assert bad_res["error_count"] == 1

    # Monaco LSP Formatter
    fmt = format_code("json", '{"a":1,"b":2}')
    assert fmt["ok"] is True
    assert '"a": 1' in fmt["formatted"]

    # Monaco LSP Completions
    comp = get_completions("typescript", "define")
    assert len(comp["suggestions"]) >= 1

    # Live PTY Terminal Execution
    term = execute_terminal_command("python --version")
    assert term["exit_code"] == 0
    assert "Python" in (term["stdout"] + term["stderr"])


def test_milestone2_fastapi_routes():
    from fastapi.testclient import TestClient
    import main as control_plane

    client = TestClient(control_plane.app)

    r_status = client.get("/api/v1/status")
    assert r_status.status_code == 200
    body = r_status.json()
    assert body["status"] == "OPERATIONAL"
    assert body["registered_technologies"] >= 50
    assert body["wiki_profiles_count"] >= 50
    assert body["official_plugins_count"] == 5

    r_ui = client.get("/")
    assert r_ui.status_code == 200
    assert "Monaco LSP" in r_ui.text
    assert "PTY Terminal" in r_ui.text
    assert "API Execution Studio" in r_ui.text
    assert "Autonomous AI Team" in r_ui.text
    assert "Local RAG Brain" in r_ui.text

    r_lsp = client.post("/api/v1/lsp/diagnostics", json={"language": "json", "code": '{"valid": true}'})
    assert r_lsp.status_code == 200
    assert r_lsp.json()["valid"] is True

    r_wiki = client.get("/api/v1/wiki/profiles?q=fastapi")
    assert r_wiki.status_code == 200
    assert r_wiki.json()["total"] >= 1


# ==============================================================================
# Milestone 3 (Weeks 9-12): Plugin SDK & 5 Official Plugins
# ==============================================================================
def test_milestone3_sdk_and_five_official_plugins():
    sdk_pkg = json.loads((HUB_ROOT / "packages" / "plugin-sdk" / "package.json").read_text(encoding="utf-8"))
    assert sdk_pkg["name"] == "@uniforge/plugin-sdk"
    assert (HUB_ROOT / "packages" / "plugin-sdk" / "dist" / "index.js").exists()
    assert (HUB_ROOT / "packages" / "plugin-sdk" / "dist" / "index.d.ts").exists()
    assert (HUB_ROOT / "packages" / "plugin-sdk" / "dist" / "cli.js").exists()

    expected_plugins = [
        "docker-manager",
        "pgvector-explorer",
        "p5js-studio",
        "spring-boot-controller",
        "ollama-ai-studio",
    ]
    for folder in expected_plugins:
        manifest_path = HUB_ROOT / "plugins" / folder / "uniforge-plugin.json"
        assert manifest_path.exists(), f"Missing official plugin manifest: {folder}"
        m = json.loads(manifest_path.read_text(encoding="utf-8"))
        assert m["schemaVersion"] == "1.0.0"
        assert m["id"].startswith("@uniforge/plugin-")
        assert (HUB_ROOT / "plugins" / folder / "src" / "index.ts").exists()

    from studio_services import execute_plugin_command
    pg_res = execute_plugin_command("@uniforge/plugin-pgvector-explorer", "cosineSimilarity", {"vectorA": [1, 0], "vectorB": [1, 0]})
    assert pg_res["ok"] is True
    assert pg_res["cosine_similarity"] == 1.0


# ==============================================================================
# Milestone 4 (Weeks 13-16): UNIFORGE Cloud & Monetization Launch
# ==============================================================================
def test_milestone4_cloud_enterprise_and_marketplace():
    for rel in (
        "cloud/docker-compose.cloud.yml",
        "cloud/db/multi_tenant_schema.sql",
        "cloud/traefik/dynamic.yml",
        "cloud/helm/uniforge-cloud/Chart.yaml",
        "cloud/helm/uniforge-cloud/values.yaml",
        "SPONSORS.md",
        "ENTERPRISE.md",
        "COMMERCIAL_LICENSE.md",
        "marketplace/catalog.json",
        "marketplace/billing.py",
    ):
        assert (HUB_ROOT / rel).exists(), f"Missing Milestone 4 artifact: {rel}"

    import billing
    from studio_services import create_cloud_tenant, get_cloud_overview

    # 70/30 revenue share check
    split = billing.calculate_revenue_split(100.0)
    assert split["developer_share_usd"] == 70.0
    assert split["platform_share_usd"] == 30.0

    # Cryptographic license issuance & verification
    lic = billing.issue_license_key("tnt-test", "@uniforge-pro/k8s-cost-autopilot", tier="paid_monthly")
    assert billing.verify_license_key(lic["license_key"], "tnt-test", "@uniforge-pro/k8s-cost-autopilot", tier="paid_monthly") is True
    assert billing.verify_license_key(lic["license_key"], "tnt-other", "@uniforge-pro/k8s-cost-autopilot", tier="paid_monthly") is False

    # Stripe webhook HMAC signature check
    secret = "whsec_test_123"
    ts = str(int(time.time()))
    raw = b'{"type":"checkout.session.completed"}'
    sig = hmac.new(secret.encode(), f"{ts}.".encode() + raw, hashlib.sha256).hexdigest()
    assert billing.verify_stripe_webhook_signature(raw, f"t={ts},v1={sig}", secret) is True
    assert billing.verify_stripe_webhook_signature(raw, f"t={ts},v1=bad", secret) is False

    # Multi-tenant Cloud Provisioning
    res = create_cloud_tenant("Quantum Robotics Inc", "enterprise", "us-east1")
    assert res["ok"] is True
    assert res["tenant"]["rls_enforced"] is True
    assert get_cloud_overview()["tenant_count"] >= 3


# ==============================================================================
# Phase 2 (Milestones 5-8): Autonomous AI Team, Local RAG, Visual Canvas & Deploy
# ==============================================================================
def test_milestone5_autonomous_team_and_self_healing():
    from autonomous_team_service import run_autonomous_build, run_self_healing_sre

    build = run_autonomous_build("Build a real-time analytics API", stack="fastapi", write_to_disk=False)
    assert build["status"] == "PASSED"
    assert "main.py" in build["generated_files"]
    assert len(build["agents_trace"]) == 3

    heal = run_self_healing_sre("ModuleNotFoundError: No module named 'httpx'", service_name="ci-runner")
    assert heal["ok"] is True
    assert heal["incident_type"] == "MISSING_PYTHON_DEPENDENCY"
    assert "httpx" in heal["remediation_command"]


def test_milestone6_local_rag_brain():
    from rag_brain_service import build_rag_index, query_rag_brain

    stats = build_rag_index()
    assert stats["ok"] is True
    assert stats["documents_indexed"] >= 60
    assert stats["chunks_indexed"] >= 100

    res = query_rag_brain("PostgreSQL pgvector HNSW similarity search", top_k=5)
    assert res["ok"] is True
    assert len(res["matches"]) >= 1
    assert any("pgvector" in m["source"] or "pgvector" in m["snippet"].lower() for m in res["matches"])


def test_milestone7_visual_node_canvas():
    from visual_canvas_service import compile_visual_graph

    compiled = compile_visual_graph(
        nodes=[
            {"id": "web", "type": "react"},
            {"id": "api", "type": "fastapi"},
            {"id": "db", "type": "postgres"},
            {"id": "llm", "type": "ollama"},
        ],
        edges=[
            {"source": "web", "target": "api"},
            {"source": "api", "target": "db"},
            {"source": "api", "target": "llm"},
        ],
    )
    assert compiled["ok"] is True
    assert "pgvector/pgvector:pg16" in compiled["docker_compose_yaml"]
    assert "DATABASE_URL" in compiled["docker_compose_yaml"]
    assert "OLLAMA_HOST" in compiled["docker_compose_yaml"]
    assert "flowchart LR" in compiled["mermaid"]


def test_milestone8_deploy_community_hub_and_launch_kit():
    from fastapi.testclient import TestClient
    import main as control_plane

    client = TestClient(control_plane.app)

    r_dep = client.post("/api/v1/deploy/plan", json={"provider": "gcp", "service_name": "uniforge-prod"})
    assert r_dep.status_code == 200
    assert r_dep.json()["ok"] is True
    assert "gcloud run deploy" in " ".join(r_dep.json()["commands"])

    r_rag = client.post("/api/v1/rag/query", json={"query": "Docker rootless sandbox", "top_k": 3})
    assert r_rag.status_code == 200
    assert r_rag.json()["ok"] is True

    for rel in (
        "docs/launch/LANDING_PAGE.md",
        "docs/launch/PRODUCT_HUNT_HN_KIT.md",
        "docs/launch/PITCH_DECK_OUTLINE.md",
    ):
        assert (HUB_ROOT / rel).exists(), f"Missing launch kit doc: {rel}"


def test_five_layer_software_factory_pipeline():
    from fastapi.testclient import TestClient
    import main as control_plane

    client = TestClient(control_plane.app)

    r_asm = client.post(
        "/api/v1/factory/assemble",
        json={"prompt": "Build a video editing app in Python and React with AI", "target_cloud": "gcp"},
    )
    assert r_asm.status_code == 200
    job = r_asm.json()
    assert job["ok"] is True
    assert len(job["layers"]) == 5
    assert job["pipeline_status"] == "AWAITING_HUMAN_APPROVAL"
    assert len(job["layers"][2]["ephemeral_workers"]) == 3
    assert "services:" in job["layers"][2]["docker_compose_yaml"]

    r_app = client.post(
        "/api/v1/factory/approve",
        json={"job_id": job["job_id"], "approver": "architect-reviewer"},
    )
    assert r_app.status_code == 200
    dist = r_app.json()
    assert dist["ok"] is True
    assert dist["pipeline_status"] == "DISTRIBUTED_LIVE"
    assert dist["layer5_distribution"]["status"] == "DISTRIBUTED"


def test_core_operating_layer_five_subsystems():
    from fastapi.testclient import TestClient
    import main as control_plane

    client = TestClient(control_plane.app)

    # 1. Universal Event Bus
    r_ev = client.post(
        "/api/v1/events/publish",
        json={"topic": "console.test_event", "source": "pytest", "actor": "admin", "payload": {"ok": True}},
    )
    assert r_ev.status_code == 200
    assert r_ev.json()["topic"] == "console.test_event"
    assert client.get("/api/v1/events").json()["count"] >= 1

    # 2. Identity & RBAC Policy Engine
    allow_res = client.post("/api/v1/identity/check", json={"role": "admin", "action": "secrets:write"}).json()
    deny_res = client.post("/api/v1/identity/check", json={"role": "coder-agent", "action": "secrets:write"}).json()
    assert allow_res["allowed"] is True
    assert deny_res["allowed"] is False

    # 3. Shared Data Layer (SQLite Projects)
    p_res = client.post(
        "/api/v1/projects",
        json={"name": "React Control Plane Test", "stack": "React + FastAPI", "owner_role": "admin"},
    ).json()
    assert p_res["ok"] is True
    assert client.get("/api/v1/projects").json()["count"] >= 1

    # 4. Secrets Vault (Masked & RBAC-enforced)
    s_deny = client.post("/api/v1/secrets", json={"key": "TEST_KEY", "value": "supersecret123", "actor": "coder-agent"}).json()
    assert s_deny["ok"] is False
    s_ok = client.post("/api/v1/secrets", json={"key": "TEST_KEY", "value": "supersecret123", "actor": "admin"}).json()
    assert s_ok["ok"] is True
    assert "supersecret123" not in s_ok["masked_preview"]
    client.delete("/api/v1/secrets/TEST_KEY?actor=admin")

    # 5. Observability Engine
    obs = client.get("/api/v1/observability/metrics").json()
    assert obs["status"] == "HEALTHY"
    assert len(obs["subsystems"]) == 15
    assert obs["requests_total"] >= 1


def test_uniforge_workbench_v2_reverse_engineered_engine():
    from fastapi.testclient import TestClient
    import main as control_plane

    client = TestClient(control_plane.app)

    # 1. Multi-provider catalog
    provs = client.get("/api/v1/workbench/providers").json()
    assert len(provs["providers"]) >= 8
    assert any(p["id"] == "ollama" for p in provs["providers"])

    # 2. Prompt Enhancer
    enh = client.post("/api/v1/workbench/enhance-prompt", json={"prompt": "Build a SaaS dashboard"}).json()
    assert enh["ok"] is True
    assert "Engineering & UX Requirements" in enh["enhanced"]

    # 3. Native <uniforgeArtifact> + <uniforgeAction> build generation (zero Bolt branding)
    chat = client.post(
        "/api/v1/workbench/chat",
        json={"prompt": "Build an interactive SaaS analytics dashboard", "provider": "uniforge-local", "chat_mode": "build"},
    ).json()
    assert chat["ok"] is True
    assert "<uniforgeArtifact" in chat["response"]
    assert "<uniforgeAction" in chat["response"]
    assert "<uniforge-quick-actions>" in chat["response"]
    assert "bolt" not in chat["response"].lower()


def test_cognitive_brain_memory_skills_crawler_project_handler():
    from fastapi.testclient import TestClient
    import main as control_plane

    client = TestClient(control_plane.app)

    # 1. Persistent Long-Term Memory
    m_add = client.post(
        "/api/v1/brain/memory",
        json={"content": "Use PostgreSQL pgvector with HNSW for RAG retrieval", "category": "architecture", "tags": "pgvector,rag"},
    ).json()
    assert m_add["ok"] is True
    mem_id = m_add["memory"]["id"]
    m_rec = client.get("/api/v1/brain/memory?q=pgvector").json()
    assert m_rec["count"] >= 1

    # 2. Modular AI Skills
    sk_list = client.get("/api/v1/brain/skills").json()
    assert sk_list["count"] >= 8
    sk_custom = client.post(
        "/api/v1/brain/skills",
        json={"name": "Rust Systems Expert", "instructions": "Prefer zero-copy safe Rust patterns.", "category": "systems"},
    ).json()
    assert sk_custom["ok"] is True

    # 3. Managed Disk Project Handler
    proj = client.post(
        "/api/v1/brain/projects",
        json={"name": "Brain Test Workspace", "stack": "FastAPI + React", "files": {"hello.py": "def hi():\n    return 'ok'\n"}},
    ).json()
    assert proj["ok"] is True
    slug = proj["slug"]
    read_back = client.get(f"/api/v1/brain/projects/{slug}/files?path=hello.py").json()
    assert read_back["ok"] is True
    assert "def hi()" in read_back["content"]

    # 4. Unified Cognitive Brain Think + Auto-Save to Project
    thought = client.post(
        "/api/v1/brain/think",
        json={
            "prompt": "Build a modern SaaS telemetry dashboard with pgvector",
            "provider": "uniforge-local",
            "project_slug": slug,
            "auto_crawl_urls": False,
        },
    ).json()
    assert thought["ok"] is True
    assert thought["cognitive_trace"]["active_skills_count"] >= 8
    assert len(thought["cognitive_trace"]["saved_to_project_files"]) >= 1
    assert "<uniforgeArtifact" in thought["response"]

    # Cleanup test memory
    client.delete(f"/api/v1/brain/memory/{mem_id}")

