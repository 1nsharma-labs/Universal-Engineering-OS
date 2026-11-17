# Flutter — UNIFORGE Technology Profile

> **Domain**: 06. Mobile Development (`06-mobile`)  
> **Category**: Cross-Platform Native UI Toolkit  
> **Primary Language**: Dart | **Version Track**: `3.19+` | **License**: `BSD-3-Clause`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `02-frameworks-and-templates/mobile-desktop/flutter-starter`

---

## 1. Overview & Industry Use-Cases
**Flutter** is a cross-platform native ui toolkit widely adopted across modern engineering teams in the **Mobile Development** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `iOS / Android / Web / Desktop`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested cross-platform native ui toolkit capabilities.
- Polyglot microservices and developer studios integrated with `REST`, `Firebase`, `FastAPI`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://docs.flutter.dev
- **Package / Distribution Source**: GitHub
- **Registry Identifier**: `flutter` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "flutter"

# Direct installation / startup
python devhub.py init && python devhub.py registry -q flutter
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `02-frameworks-and-templates/mobile-desktop/flutter-starter`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Flutter** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```yaml
# Interactive Working Configuration (Flutter)
apiVersion: uniforge.io/v1
kind: WorkloadProfile
metadata:
  name: flutter-service
  labels:
    domain: 06-mobile
spec:
  runtime: "iOS / Android / Web / Desktop"
  replicas: 2
  securityContext:
    runAsNonRoot: true
    readOnlyRootFilesystem: true
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[Flutter Service Layer (iOS / Android / Web / Desktop)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q flutter` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Flutter"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `iOS / Android / Web / Desktop` |
| **Core Dependencies** | `flutter_sdk` |
| **First-Class Integrations** | `REST`, `Firebase`, `FastAPI` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `BSD-3-Clause` (compatible with Apache-2.0 open-core workflows) |

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
| **Flutter** | Primary profile (`BSD-3-Clause`) | Recommended when `Dart` & `iOS / Android / Web / Desktop` fit your architecture |
| **React Native** | Alternative in `Mobile Development` | Evaluate based on team language affinity & operational footprint |
| **Kotlin Multiplatform** | Alternative in `Mobile Development` | Evaluate based on team language affinity & operational footprint |
