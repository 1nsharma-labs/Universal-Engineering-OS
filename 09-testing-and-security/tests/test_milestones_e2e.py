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
    assert "Monaco LSP Studio" in r_ui.text
    assert "PTY Terminal" in r_ui.text
    assert "API Execution Studio" in r_ui.text

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

