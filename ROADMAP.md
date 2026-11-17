# UNIFORGE Public Roadmap (`uniforge-os / Universal-Engineering-OS`)

## Milestone 1 (Weeks 1–4): Foundation & Governance — COMPLETED
- [x] Establish GitHub Organization configuration (`uniforge-os / Universal-Engineering-OS`, `.github/profile/README.md`, `CODEOWNERS`, `dependabot.yml`, Issue/PR templates, CI/CD workflows)
- [x] Canonical Open-Source Governance Suite (`LICENSE` full Apache-2.0, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `GOVERNANCE.md`, `NOTICE`, RFC Template)
- [x] Finalize Monolithic Root Controller (`devhub.py`, `devhub.ps1`, `Makefile`)
- [x] Technology Registry Schema & TypeScript Index (`packages/registry-schema/`)

## Milestone 2 (Weeks 5–8): Operational Studios & Registry — COMPLETED
- [x] Connect Web Studio Dashboard (`00-universal-control-plane/studio-ui/index.html`) to live FastAPI backend services
- [x] Live PTY Universal Terminal (`/ws/terminal` WebSocket + `/api/v1/terminal/exec` stateful runner)
- [x] Live Monaco LSP Code Studio (`/api/v1/lsp/diagnostics`, `/api/v1/lsp/format`, `/api/v1/lsp/complete`)
- [x] Embedded API Execution Studio (`/api/v1/api-studio/execute` HTTP/REST/GraphQL runner)
- [x] 60+ Verified Technology Profiles across 15 domains in Universal Wiki (`docs/wiki/profiles/`, `docs/wiki/INDEX.md`)

## Milestone 3 (Weeks 9–12): Plugin SDK & Extensibility — COMPLETED
- [x] Production `@uniforge/plugin-sdk` v1.0.0 ready for npm (`packages/plugin-sdk/` with TypeScript build, CLI, Zero-Trust Capability Sandbox, and automated tests)
- [x] Official Plugin 1: **Docker Manager** (`plugins/docker-manager/`)
- [x] Official Plugin 2: **pgvector Explorer** (`plugins/pgvector-explorer/`)
- [x] Official Plugin 3: **p5.js Studio** (`plugins/p5js-studio/`)
- [x] Official Plugin 4: **Spring Boot Controller** (`plugins/spring-boot-controller/`)
- [x] Official Plugin 5: **Ollama AI Studio** (`plugins/ollama-ai-studio/`)

## Milestone 4 (Weeks 13–16): Cloud Platform & Monetization Launch — COMPLETED
- [x] Multi-Tenant Hosted Platform (`UNIFORGE Cloud`: `cloud/docker-compose.cloud.yml`, PostgreSQL RLS schema, Traefik wildcard TLS proxy, Kubernetes Helm Chart with `NetworkPolicy` & `ResourceQuota`)
- [x] GitHub Sponsors & Open Collective activation (`.github/FUNDING.yml`, `SPONSORS.md`)
- [x] Enterprise Edition & Commercial Licensing (`ENTERPRISE.md`, `COMMERCIAL_LICENSE.md`)
- [x] Paid Plugin Marketplace with 70/30 Developer Revenue Share & HMAC-SHA256 Cryptographic License Verification (`marketplace/catalog.json`, `marketplace/billing.py`)
