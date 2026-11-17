# UNIFORGE Public Roadmap (`1nsharma-labs / Universal-Engineering-OS`)

## Phase 1 (v1.0.0): Open-Core Foundation, Studios, SDK & Cloud — COMPLETED

### Milestone 1 (Weeks 1–4): Foundation & Governance
- [x] GitHub Organization configuration, `CODEOWNERS`, `dependabot.yml`, Issue/PR templates, CI/CD workflows
- [x] Canonical Open-Source Governance (`LICENSE` Apache-2.0, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `GOVERNANCE.md`, `NOTICE`, RFC Template)
- [x] Monolithic Root Controller (`devhub.py`, `devhub.ps1`, `Makefile`) & `@uniforge/registry-schema`

### Milestone 2 (Weeks 5–8): Operational Studios & Registry
- [x] Live Web Studio Dashboard (`:7000`) connected to FastAPI backend services
- [x] WebSocket PTY Universal Terminal (`/ws/terminal` & `/api/v1/terminal/exec`)
- [x] Monaco LSP Bridge (`/api/v1/lsp/diagnostics`, `/format`, `/complete`) & Embedded API Studio (`/api/v1/api-studio/execute`)
- [x] 60 Verified Technology Profiles across 15 domains (`docs/wiki/profiles/`, `docs/wiki/INDEX.md`)

### Milestone 3 (Weeks 9–12): Plugin SDK & Extensibility
- [x] `@uniforge/plugin-sdk` v1.0.0 (TypeScript SDK, Zero-Trust Capability Sandbox, CLI, Unit Tests)
- [x] 5 Official Plugins: **Docker Manager**, **pgvector Explorer**, **p5.js Studio**, **Spring Boot Controller**, **Ollama AI Studio**

### Milestone 4 (Weeks 13–16): Cloud Platform & Monetization Launch
- [x] UNIFORGE Cloud Multi-Tenant Platform (`cloud/docker-compose.cloud.yml`, PostgreSQL RLS schema, Traefik wildcard TLS proxy, Kubernetes Helm Chart)
- [x] GitHub Sponsors (`SPONSORS.md`, `.github/FUNDING.yml`), Enterprise Edition (`ENTERPRISE.md`, `COMMERCIAL_LICENSE.md`), and Paid Plugin Marketplace (70/30 Rev-Share & HMAC-SHA256 license engine)

---

## Phase 2 (v2.0.0): Self-Evolving Autonomous Engineering OS — COMPLETED

### Milestone 5: Autonomous AI Engineering Team (Self-Coding & Self-Healing)
- [x] Multi-Agent `Architect -> Coder -> Tester` pipeline (`/api/v1/agents/autonomous-build`, `devhub.py agent-build`) with live AST/LSP verification
- [x] Self-Healing SRE Patch Synthesizer (`/api/v1/agents/self-heal`, `devhub.py self-heal`) diagnosing CI/runtime errors and generating unified diff patches

### Milestone 6: Local RAG Brain & Personal Code Memory
- [x] Offline Hybrid TF-IDF Cosine Vector Indexer across all 60 Wiki profiles, cheatsheets & plugins (`/api/v1/rag/index`, `/api/v1/rag/query`, `devhub.py rag`)
- [x] Zero-API-key offline copilot with optional local Ollama LLM synthesis

### Milestone 7: Visual Node-Based Canvas & Live Split-Screen Creative Sandbox
- [x] Visual Node Architecture Compiler (`/api/v1/canvas/compile`) turning node graphs into runnable `docker-compose.yml`, `.env` wiring, and Mermaid topology
- [x] Live Split-Screen Creative Studio in Web UI with interactive real-time physics/color parameter sliders

### Milestone 8: Decentralized Community Hub, One-Click Cloud Deploy & GTM Launch Kit
- [x] Decentralized Community Plugin Registry with schema & capability validation (`/api/v1/community/plugins/submit`)
- [x] Zero-Config One-Click Multi-Cloud Deployer (`devhub.py deploy` / `/api/v1/deploy/plan`) targeting GCP Cloud Run, AWS App Runner, Cloudflare Pages, and UNIFORGE Cloud Helm
- [x] Go-To-Market Launch Kit (`docs/launch/LANDING_PAGE.md`, `PRODUCT_HUNT_HN_KIT.md`, `PITCH_DECK_OUTLINE.md`)

---

## Phase 3 (v2.1.0): Trending Release — Polished, Verified & Published — COMPLETED

### Milestone 9: v2.1.0 Final Release Hardening
- [x] Root controller bumped to `VERSION = "2.1.0"` (`devhub.py version`) with README & Landing Page badges synced
- [x] React + TypeScript Control Center compiles with 0 TS errors (`vite-env.d.ts` hardened)
- [x] GitHub Trending GTM kit refreshed (Show HN, Product Hunt copy, launch checklist)
- [x] Signed Git tag `v2.1.0` published with full release notes on GitHub Releases

### Next Up (v2.2.0 — In Planning)
- [ ] Plugin hot-reload & watch mode in the Studio UI
- [ ] Community registry leaderboard & weekly trending plugins feed
- [ ] Terraform module gallery under `08-devops-cloud-and-iac/`
