# Contributing to UNIFORGE (`uniforge-os / Universal-Engineering-OS`)

Thank you for your interest in contributing to **UNIFORGE** — the open-source Universal Engineering OS! We welcome engineers, architects, plugin authors, technical writers, security researchers, and educators from around the world.

---

## 1. Ways to Contribute

1. **Control Plane & Studios (`00-universal-control-plane/`)**: Enhance the AI Engineering Brain, Monaco LSP bridge, PTY terminal, API execution engine, or Web Studio UI.
2. **Plugin SDK & Official Plugins (`packages/plugin-sdk/`, `plugins/`)**: Build or improve TypeScript plugins using `@uniforge/plugin-sdk`.
3. **Universal Wiki & Technology Registry (`docs/wiki/`, `00-universal-control-plane/technology-registry/`)**: Expand technology profiles following the 10-Point Documentation Standard.
4. **Cloud & DevOps Infrastructure (`cloud/`, `08-devops-cloud-and-iac/`)**: Improve Helm charts, Terraform modules, multi-tenant isolation, and observability stacks.
5. **Security & Testing (`09-testing-and-security/`)**: Add unit/E2E tests, strengthen sandbox container policies, and audit dependencies.
6. **RFCs (`docs/rfcs/`)**: Propose major architectural changes before writing implementation code.

---

## 2. Local Development Setup

### Prerequisites

- **Python 3.11+** (with `fastapi`, `uvicorn`, `pydantic`, `pyyaml`, `pytest`)
- **Node.js 20+** and **npm 10+** (for `@uniforge/plugin-sdk` and official plugins)
- **Docker & Docker Compose** (optional for container stacks & Zero-Trust Sandbox execution)
- **Git**

### Quick Bootstrap

```bash
# 1. Fork & clone the repository
git clone https://github.com/1nsharma-labs/Universal-Engineering-OS.git
cd Universal-Engineering-OS

# 2. Initialize environment templates and inspect local toolchains
python devhub.py init
# Windows PowerShell: .\devhub.ps1 init

# 3. Validate all JSON/YAML manifests across all modules
python devhub.py validate

# 4. Run automated test suite
python devhub.py test

# 5. Launch the Universal Control Plane & Operational Studio on http://localhost:7000
python devhub.py studio --port 7000
```

---

## 3. Branching & Commit Conventions

We follow **[Conventional Commits 1.0.0](https://www.conventionalcommits.org/)**:

- `feat(studio): add live Monaco LSP diagnostics endpoint`
- `fix(sandbox): enforce read-only root filesystem on Alpine runners`
- `docs(wiki): add Rust Axum 10-point technology profile`
- `chore(sdk): bump @uniforge/plugin-sdk to 1.0.0`
- `security(cloud): tighten tenant NetworkPolicy egress rules`

Branch naming: `feat/<topic>`, `fix/<issue-id>-<topic>`, `docs/<topic>`, `rfc/<number>-<topic>`.

---

## 4. Pull Request Process

1. Ensure `python devhub.py validate` and `python devhub.py test` pass with zero errors.
2. Build and test TypeScript packages if touching `packages/plugin-sdk/` or `plugins/`:

   ```bash
   make plugin-sdk
   make plugins
   ```

3. Run the security hygiene check (`make audit`) to guarantee zero leaked secrets.
4. Open a Pull Request using `.github/PULL_REQUEST_TEMPLATE.md` and link any related issue or RFC.
5. At least one maintainer from `.github/CODEOWNERS` must approve before merge.

---

## 5. Developer Certificate of Origin (DCO) & Licensing

All contributions are licensed under the **Apache License, Version 2.0** (`LICENSE`).
By submitting a Pull Request, you certify via `git commit -s` (`Signed-off-by: Name <email>`) that you have the legal right to submit the contribution under Apache-2.0.

---

## 6. Code of Conduct

Participation in UNIFORGE is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all community members with respect.
