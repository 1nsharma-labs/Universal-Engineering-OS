"""
UNIFORGE (Universal Engineering OS) — Control Plane & Operational Studio Server (Port 7000)
Provides:
  - AI Engineering Brain & 15-Domain Technology Registry (60+ Techs)
  - Live PTY / Interactive Terminal (WebSocket /ws/terminal + REST /api/v1/terminal/exec)
  - Monaco LSP Bridge (Diagnostics, Completions, Formatting)
  - Embedded API Execution Studio (Live HTTP/REST/GraphQL Runner)
  - Universal Wiki 60+ Technology Profiles Server
  - Official Plugins & Paid Plugin Marketplace (70/30 Rev-Share & License Engine)
  - UNIFORGE Cloud Multi-Tenant Workspace Control Plane
Runs natively with FastAPI/Uvicorn if installed, or falls back to Python's built-in ThreadingHTTPServer.
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict, Optional
from urllib.parse import parse_qs, urlparse

CURRENT_DIR = Path(__file__).resolve().parent
CONTROL_PLANE_DIR = CURRENT_DIR.parent
STUDIO_HTML_PATH = CONTROL_PLANE_DIR / "studio-ui" / "index.html"
HUB_ROOT = CONTROL_PLANE_DIR.parent

if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from api_studio_service import execute_api_request
from brain import architect_solution, load_registry, search_registry
from lsp_service import analyze_diagnostics, format_code, get_completions
from project_unifier import unify_project
from sandbox_runner import execute_in_sandbox
from studio_services import (
    check_marketplace_license,
    create_cloud_tenant,
    execute_plugin_command,
    get_cloud_overview,
    get_marketplace_catalog,
    get_wiki_profile,
    list_installed_plugins,
    list_wiki_profiles,
    run_marketplace_checkout,
)
from terminal_service import (
    execute_terminal_async,
    execute_terminal_command,
    list_terminal_sessions,
)


def get_system_overview() -> Dict[str, Any]:
    reg = load_registry()
    modules = sorted([p.name for p in HUB_ROOT.iterdir() if p.is_dir() and p.name[:2].isdigit()])
    wiki_info = list_wiki_profiles()
    plugins_info = list_installed_plugins()
    cloud_info = get_cloud_overview()
    return {
        "platform": "UNIFORGE — Universal Engineering OS",
        "organization": "uniforge-os / Universal-Engineering-OS",
        "version": "1.0.0",
        "mode": "Local + UNIFORGE Cloud (Hybrid Multi-Tenant)",
        "modules_count": len(modules),
        "modules": modules,
        "domains_count": len(reg["domains"]),
        "registered_technologies": len(reg["technologies"]),
        "wiki_profiles_count": wiki_info["total"],
        "official_plugins_count": plugins_info["count"],
        "cloud_tenants_count": cloud_info["tenant_count"],
        "hidden_stack_layers": len(reg["hidden_stack"]),
        "services": {
            "pty_terminal": "READY",
            "monaco_lsp": "READY",
            "api_studio": "READY",
            "plugin_host": "READY",
            "marketplace_billing": "READY",
            "cloud_control_plane": "READY",
        },
        "status": "OPERATIONAL",
    }


try:
    from fastapi import FastAPI, WebSocket, WebSocketDisconnect
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import HTMLResponse
    from pydantic import BaseModel

    app = FastAPI(
        title="UNIFORGE — Universal Engineering OS Control Plane",
        version="1.0.0",
        description="AI Orchestrator, PTY Terminal, Monaco LSP, API Studio, 60+ Wiki Profiles, Plugin Host & UNIFORGE Cloud API",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class ArchitectRequest(BaseModel):
        prompt: str
        deployment_mode: str = "hybrid-local-cloud"

    class UnifyRequest(BaseModel):
        target: str

    class SandboxRequest(BaseModel):
        language: str = "python"
        code: str = "print('Hello from isolated sandbox')"
        dry_run: bool = True

    class TerminalExecRequest(BaseModel):
        command: str
        session_id: str = ""
        timeout: int = 15

    class LspCodeRequest(BaseModel):
        language: str = "python"
        code: str = ""

    class ApiStudioRequest(BaseModel):
        url: str
        method: str = "GET"
        headers: Optional[Dict[str, str]] = None
        body: Optional[str] = None
        timeout_sec: float = 10.0

    class PluginExecRequest(BaseModel):
        plugin_id: str
        command_id: str
        payload: Dict[str, Any] = {}

    class CloudTenantRequest(BaseModel):
        organization_name: str
        plan_tier: str = "pro"
        region: str = "us-central1"

    class MarketplaceCheckoutRequest(BaseModel):
        tenant_id: str = "tnt-uniforge-core"
        plugin_id: str

    class LicenseVerifyRequest(BaseModel):
        license_key: str
        tenant_id: str
        plugin_id: str
        tier: str = "paid_monthly"

    @app.get("/", response_class=HTMLResponse)
    def serve_studio():
        return STUDIO_HTML_PATH.read_text(encoding="utf-8")

    @app.get("/api/v1/status")
    def api_status():
        return get_system_overview()

    @app.get("/api/v1/registry")
    def api_registry(q: str = "", domain: str = ""):
        reg = load_registry()
        return {
            "domains": reg["domains"],
            "hidden_stack": reg["hidden_stack"],
            "sources": reg["sources"],
            "technologies": search_registry(query=q, domain=domain),
        }

    @app.post("/api/v1/orchestrate/architect")
    def api_architect(req: ArchitectRequest):
        return architect_solution(req.prompt, req.deployment_mode)

    @app.post("/api/v1/projects/unify")
    def api_unify(req: UnifyRequest):
        return unify_project(req.target)

    @app.post("/api/v1/sandbox/execute")
    def api_sandbox(req: SandboxRequest):
        return execute_in_sandbox(req.language, req.code, dry_run=req.dry_run)

    # --- Milestone 2: PTY Terminal, Monaco LSP, API Execution, Universal Wiki ---
    @app.get("/api/v1/terminal/sessions")
    def api_terminal_sessions():
        return {"sessions": list_terminal_sessions()}

    @app.post("/api/v1/terminal/exec")
    def api_terminal_exec(req: TerminalExecRequest):
        return execute_terminal_command(req.command, session_id=req.session_id, timeout=req.timeout)

    @app.websocket("/ws/terminal")
    async def ws_terminal(websocket: WebSocket):
        await websocket.accept()
        session_id = websocket.query_params.get("session_id", "")
        init_res = execute_terminal_command("", session_id=session_id)
        session_id = init_res["session_id"]
        await websocket.send_json({
            "type": "ready",
            "session_id": session_id,
            "cwd": init_res["cwd"],
            "banner": "UNIFORGE PTY Terminal connected. Type any command (e.g. `python devhub.py validate`).",
        })
        try:
            while True:
                raw = await websocket.receive_text()
                try:
                    msg = json.loads(raw)
                    cmd = msg.get("command", "")
                except Exception:
                    cmd = raw
                result = await execute_terminal_async(cmd, session_id=session_id)
                await websocket.send_json({"type": "output", **result})
        except WebSocketDisconnect:
            pass

    @app.post("/api/v1/lsp/diagnostics")
    def api_lsp_diagnostics(req: LspCodeRequest):
        return analyze_diagnostics(req.language, req.code)

    @app.post("/api/v1/lsp/format")
    def api_lsp_format(req: LspCodeRequest):
        return format_code(req.language, req.code)

    @app.get("/api/v1/lsp/complete")
    def api_lsp_complete(language: str = "python", prefix: str = ""):
        return get_completions(language, prefix)

    @app.post("/api/v1/api-studio/execute")
    def api_studio_execute(req: ApiStudioRequest):
        return execute_api_request(
            url=req.url,
            method=req.method,
            headers=req.headers,
            body=req.body,
            timeout_sec=req.timeout_sec,
        )

    @app.get("/api/v1/wiki/profiles")
    def api_wiki_profiles(q: str = ""):
        return list_wiki_profiles(query=q)

    @app.get("/api/v1/wiki/profiles/{slug}")
    def api_wiki_profile(slug: str):
        return get_wiki_profile(slug)

    # --- Milestone 3: Official Plugins ---
    @app.get("/api/v1/plugins")
    def api_plugins():
        return list_installed_plugins()

    @app.post("/api/v1/plugins/execute")
    def api_plugin_execute(req: PluginExecRequest):
        return execute_plugin_command(req.plugin_id, req.command_id, req.payload)

    # --- Milestone 4: UNIFORGE Cloud & Paid Marketplace ---
    @app.get("/api/v1/cloud/overview")
    def api_cloud_overview():
        return get_cloud_overview()

    @app.post("/api/v1/cloud/tenants")
    def api_cloud_create_tenant(req: CloudTenantRequest):
        return create_cloud_tenant(req.organization_name, req.plan_tier, req.region)

    @app.get("/api/v1/marketplace/catalog")
    def api_marketplace_catalog(q: str = "", tier: str = ""):
        return get_marketplace_catalog(query=q, tier=tier)

    @app.post("/api/v1/marketplace/checkout")
    def api_marketplace_checkout(req: MarketplaceCheckoutRequest):
        return run_marketplace_checkout(req.tenant_id, req.plugin_id)

    @app.post("/api/v1/marketplace/verify-license")
    def api_marketplace_verify(req: LicenseVerifyRequest):
        return check_marketplace_license(req.license_key, req.tenant_id, req.plugin_id, req.tier)

    FASTAPI_AVAILABLE = True
except ImportError:
    app = None
    FASTAPI_AVAILABLE = False


class FallbackHandler(BaseHTTPRequestHandler):
    def _send_json(self, data: Any, status: int = 200):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)
        if parsed.path == "/":
            html = STUDIO_HTML_PATH.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(html)))
            self.end_headers()
            self.wfile.write(html)
            return
        if parsed.path == "/api/v1/status":
            return self._send_json(get_system_overview())
        if parsed.path == "/api/v1/registry":
            reg = load_registry()
            return self._send_json({
                "domains": reg["domains"],
                "hidden_stack": reg["hidden_stack"],
                "sources": reg["sources"],
                "technologies": search_registry(query=qs.get("q", [""])[0], domain=qs.get("domain", [""])[0]),
            })
        if parsed.path == "/api/v1/terminal/sessions":
            return self._send_json({"sessions": list_terminal_sessions()})
        if parsed.path == "/api/v1/lsp/complete":
            return self._send_json(get_completions(qs.get("language", ["python"])[0], qs.get("prefix", [""])[0]))
        if parsed.path == "/api/v1/wiki/profiles":
            return self._send_json(list_wiki_profiles(query=qs.get("q", [""])[0]))
        if parsed.path.startswith("/api/v1/wiki/profiles/"):
            slug = parsed.path.split("/api/v1/wiki/profiles/", 1)[1]
            return self._send_json(get_wiki_profile(slug))
        if parsed.path == "/api/v1/plugins":
            return self._send_json(list_installed_plugins())
        if parsed.path == "/api/v1/cloud/overview":
            return self._send_json(get_cloud_overview())
        if parsed.path == "/api/v1/marketplace/catalog":
            return self._send_json(get_marketplace_catalog(query=qs.get("q", [""])[0], tier=qs.get("tier", [""])[0]))
        return self._send_json({"error": "Not found"}, 404)

    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8") if length else "{}"
        payload = json.loads(raw)
        if self.path == "/api/v1/orchestrate/architect":
            return self._send_json(architect_solution(payload.get("prompt", ""), payload.get("deployment_mode", "hybrid-local-cloud")))
        if self.path == "/api/v1/projects/unify":
            return self._send_json(unify_project(payload.get("target", "")))
        if self.path == "/api/v1/sandbox/execute":
            return self._send_json(execute_in_sandbox(payload.get("language", "python"), payload.get("code", ""), dry_run=payload.get("dry_run", True)))
        if self.path == "/api/v1/terminal/exec":
            return self._send_json(execute_terminal_command(payload.get("command", ""), payload.get("session_id", ""), int(payload.get("timeout", 15))))
        if self.path == "/api/v1/lsp/diagnostics":
            return self._send_json(analyze_diagnostics(payload.get("language", "python"), payload.get("code", "")))
        if self.path == "/api/v1/lsp/format":
            return self._send_json(format_code(payload.get("language", "python"), payload.get("code", "")))
        if self.path == "/api/v1/api-studio/execute":
            return self._send_json(execute_api_request(payload.get("url", ""), payload.get("method", "GET"), payload.get("headers"), payload.get("body")))
        if self.path == "/api/v1/plugins/execute":
            return self._send_json(execute_plugin_command(payload.get("plugin_id", ""), payload.get("command_id", ""), payload.get("payload", {})))
        if self.path == "/api/v1/cloud/tenants":
            return self._send_json(create_cloud_tenant(payload.get("organization_name", "New Org"), payload.get("plan_tier", "pro"), payload.get("region", "us-central1")))
        if self.path == "/api/v1/marketplace/checkout":
            return self._send_json(run_marketplace_checkout(payload.get("tenant_id", "tnt-uniforge-core"), payload.get("plugin_id", "")))
        if self.path == "/api/v1/marketplace/verify-license":
            return self._send_json(check_marketplace_license(payload.get("license_key", ""), payload.get("tenant_id", ""), payload.get("plugin_id", ""), payload.get("tier", "paid_monthly")))
        return self._send_json({"error": "Not found"}, 404)


def run_server(port: int = 7000, host: str = "0.0.0.0"):
    if FASTAPI_AVAILABLE:
        import uvicorn
        print(f"[UNIFORGE Control Plane] Starting FastAPI Operational Studio at http://localhost:{port}")
        uvicorn.run(app, host=host, port=port)
    else:
        print(f"[UNIFORGE Control Plane] Starting Built-in Studio Server at http://localhost:{port}")
        server = ThreadingHTTPServer((host, port), FallbackHandler)
        server.serve_forever()


if __name__ == "__main__":
    run_server(int(os.getenv("CONTROL_PLANE_PORT", "7000")))
