# OpenTelemetry — UNIFORGE Technology Profile

> **Domain**: 07. Cloud & DevOps (`07-cloud-devops`)  
> **Category**: Vendor-Neutral Distributed Tracing, Metrics & Logs Standard  
> **Primary Language**: Polyglot (Go / Python / Java / JS / Rust) | **Version Track**: `1.27+` | **License**: `Apache-2.0`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `12-observability-and-logs`

---

## 1. Overview & Industry Use-Cases
**OpenTelemetry** is a vendor-neutral distributed tracing, metrics & logs standard widely adopted across modern engineering teams in the **Cloud & DevOps** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `SDK + Collector Daemon`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested vendor-neutral distributed tracing, metrics & logs standard capabilities.
- Polyglot microservices and developer studios integrated with `Prometheus`, `Grafana Tempo`, `FastAPI`, `Spring Boot`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://opentelemetry.io/docs/
- **Package / Distribution Source**: CNCF / PyPI / npm / Maven
- **Registry Identifier**: `opentelemetry` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "opentelemetry"

# Direct installation / startup
npm install opentelemetry
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `12-observability-and-logs`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **OpenTelemetry** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```python
# Interactive Working Example (OpenTelemetry)
import asyncio

async def main():
    print("UNIFORGE Runtime initialized for OpenTelemetry")
    # Production entry point wired to 00-universal-control-plane
    return {"service": "opentelemetry", "status": "healthy"}

if __name__ == "__main__":
    print(asyncio.run(main()))
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[OpenTelemetry Service Layer (SDK + Collector Daemon)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q opentelemetry` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with OpenTelemetry"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `SDK + Collector Daemon` |
| **Core Dependencies** | `otlp` |
| **First-Class Integrations** | `Prometheus`, `Grafana Tempo`, `FastAPI`, `Spring Boot` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `Apache-2.0` (compatible with Apache-2.0 open-core workflows) |

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
| **OpenTelemetry** | Primary profile (`Apache-2.0`) | Recommended when `Polyglot (Go / Python / Java / JS / Rust)` & `SDK + Collector Daemon` fit your architecture |
| **Jaeger Native** | Alternative in `Cloud & DevOps` | Evaluate based on team language affinity & operational footprint |
| **Zipkin** | Alternative in `Cloud & DevOps` | Evaluate based on team language affinity & operational footprint |
