# Tauri (Rust + WebView) — UNIFORGE Technology Profile

> **Domain**: 14. Systems & Language Engineering (`14-systems`)  
> **Category**: Ultra-Lightweight Native Desktop Engine  
> **Primary Language**: Rust / TypeScript | **Version Track**: `1.6 / 2.0` | **License**: `MIT / Apache-2.0`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `02-frameworks-and-templates/mobile-desktop/tauri-starter`

---

## 1. Overview & Industry Use-Cases
**Tauri (Rust + WebView)** is a ultra-lightweight native desktop engine widely adopted across modern engineering teams in the **Systems & Language Engineering** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `Windows / macOS / Linux`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested ultra-lightweight native desktop engine capabilities.
- Polyglot microservices and developer studios integrated with `React`, `Vite`, `Local APIs`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://tauri.app
- **Package / Distribution Source**: crates.io
- **Registry Identifier**: `tauri-rust` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "tauri-rust"

# Direct installation / startup
cargo add tauri-rust
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `02-frameworks-and-templates/mobile-desktop/tauri-starter`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Tauri (Rust + WebView)** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```typescript
// Interactive Working Example (Tauri (Rust + WebView))
export interface ServiceStatus {
  service: string;
  version: string;
  healthy: boolean;
}

export function bootstrapService(): ServiceStatus {
  return {
    service: "tauri-rust",
    version: "1.6 / 2.0",
    healthy: true,
  };
}

console.log(bootstrapService());
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[Tauri (Rust + WebView) Service Layer (Windows / macOS / Linux)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q tauri-rust` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Tauri (Rust + WebView)"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `Windows / macOS / Linux` |
| **Core Dependencies** | `cargo`, `tauri` |
| **First-Class Integrations** | `React`, `Vite`, `Local APIs` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `MIT / Apache-2.0` (compatible with Apache-2.0 open-core workflows) |

---

## 9. Security, Auditing & Best Practices
- **Secret Hygiene**: Inject all API keys, DSNs, and tokens via `04-connectors-and-apis/.env` or Kubernetes Secrets; never hardcode credentials.
- **Least Privilege**: Run production containers as non-root (`UID 65534` / `runAsNonRoot: true`) with read-only root filesystems.
- **Continuous Scanning**: Execute `make audit` (Gitleaks, Semgrep, Trivy) in CI prior to container promotion.
- **Dependency Pinning**: Lock exact dependency versions and review Dependabot advisories weekly.

---

## 10. Alternatives & Comparison Matrix
| Technology | Positioning | Selection Guidance |
| --- | --- | --- |
| **Tauri (Rust + WebView)** | Primary profile (`MIT / Apache-2.0`) | Recommended when `Rust / TypeScript` & `Windows / macOS / Linux` fit your architecture |
| **Electron** | Alternative in `Systems & Language Engineering` | Evaluate based on team language affinity & operational footprint |
| **JavaFX** | Alternative in `Systems & Language Engineering` | Evaluate based on team language affinity & operational footprint |
