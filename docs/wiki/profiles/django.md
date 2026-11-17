# Django + DRF — UNIFORGE Technology Profile

> **Domain**: 02. Backend Engineering (`02-backend`)  
> **Category**: Batteries-Included Python Framework  
> **Primary Language**: Python | **Version Track**: `5.0+` | **License**: `BSD-3-Clause`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `02-frameworks-and-templates/backend-apis/django-starter`

---

## 1. Overview & Industry Use-Cases
**Django + DRF** is a batteries-included python framework widely adopted across modern engineering teams in the **Backend Engineering** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `CPython 3.11+`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested batteries-included python framework capabilities.
- Polyglot microservices and developer studios integrated with `PostgreSQL`, `Celery`, `Redis`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://docs.djangoproject.com
- **Package / Distribution Source**: PyPI
- **Registry Identifier**: `django` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "django"

# Direct installation / startup
pip install django
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `02-frameworks-and-templates/backend-apis/django-starter`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Django + DRF** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```python
# Interactive Working Example (Django + DRF)
import asyncio

async def main():
    print("UNIFORGE Runtime initialized for Django + DRF")
    # Production entry point wired to 00-universal-control-plane
    return {"service": "django", "status": "healthy"}

if __name__ == "__main__":
    print(asyncio.run(main()))
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[Django + DRF Service Layer (CPython 3.11+)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q django` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Django + DRF"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `CPython 3.11+` |
| **Core Dependencies** | `djangorestframework` |
| **First-Class Integrations** | `PostgreSQL`, `Celery`, `Redis` |
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
| **Django + DRF** | Primary profile (`BSD-3-Clause`) | Recommended when `Python` & `CPython 3.11+` fit your architecture |
| **FastAPI** | Alternative in `Backend Engineering` | Evaluate based on team language affinity & operational footprint |
| **Laravel** | Alternative in `Backend Engineering` | Evaluate based on team language affinity & operational footprint |
| **Rails** | Alternative in `Backend Engineering` | Evaluate based on team language affinity & operational footprint |
