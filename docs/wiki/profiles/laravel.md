# Laravel — UNIFORGE Technology Profile

> **Domain**: 02. Backend Engineering (`02-backend`)  
> **Category**: PHP Web Application Framework  
> **Primary Language**: PHP 8.3 | **Version Track**: `11.x` | **License**: `MIT`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `02-frameworks-and-templates/backend-apis/laravel-starter`

---

## 1. Overview & Industry Use-Cases
**Laravel** is a php web application framework widely adopted across modern engineering teams in the **Backend Engineering** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `PHP-FPM / Swoole`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested php web application framework capabilities.
- Polyglot microservices and developer studios integrated with `MySQL`, `PostgreSQL`, `Redis`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://laravel.com/docs
- **Package / Distribution Source**: Packagist
- **Registry Identifier**: `laravel` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "laravel"

# Direct installation / startup
python devhub.py init && python devhub.py registry -q laravel
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `02-frameworks-and-templates/backend-apis/laravel-starter`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Laravel** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```yaml
# Interactive Working Configuration (Laravel)
apiVersion: uniforge.io/v1
kind: WorkloadProfile
metadata:
  name: laravel-service
  labels:
    domain: 02-backend
spec:
  runtime: "PHP-FPM / Swoole"
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
[Laravel Service Layer (PHP-FPM / Swoole)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q laravel` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Laravel"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `PHP-FPM / Swoole` |
| **Core Dependencies** | `composer` |
| **First-Class Integrations** | `MySQL`, `PostgreSQL`, `Redis` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `MIT` (compatible with Apache-2.0 open-core workflows) |

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
| **Laravel** | Primary profile (`MIT`) | Recommended when `PHP 8.3` & `PHP-FPM / Swoole` fit your architecture |
| **Symfony** | Alternative in `Backend Engineering` | Evaluate based on team language affinity & operational footprint |
| **Django** | Alternative in `Backend Engineering` | Evaluate based on team language affinity & operational footprint |
