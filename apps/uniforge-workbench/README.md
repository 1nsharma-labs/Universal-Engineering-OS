# UNIFORGE AI Workbench (`apps/uniforge-workbench`)

100% original, Apache-2.0 licensed split-screen AI coding workbench built natively inside **UNIFORGE (`Universal-Engineering-OS`)** — zero third-party branding.

## Features
- **Split-Screen AI Builder**: Left prompt chat wired directly to UNIFORGE Control Plane (`5-Layer Software Factory`, `Autonomous AI Team`, `Offline Local RAG Brain`).
- **Live Sandboxed Preview**: Real-time `<iframe>` preview with Desktop, Tablet, and Mobile responsive viewports.
- **Code Editor + Polyglot LSP Diagnostics**: Edit any generated file and run live AST/LSP checks via `/api/v1/lsp/diagnostics`.
- **Live Terminal & 1-Click Cloud Deploy**: Execute shell commands via `/api/v1/terminal/exec` and generate production deploy plans (`GCP`, `AWS`, `Cloudflare`, `UNIFORGE Cloud`).
- **Production Container Stack**: Multi-stage Node 22 → Nginx Alpine `Dockerfile`, `nginx.conf`, and `docker-compose.workbench.yml`.

## Quick Start
```bash
# Development (port 5173 -> proxies /api and /ws to :7000)
python devhub.py workbench

# Production Build & Preview
python devhub.py workbench --prod

# Production Docker Stack (Control Plane :7000 + Workbench :5173)
docker compose -f apps/uniforge-workbench/docker-compose.workbench.yml up -d --build
```

