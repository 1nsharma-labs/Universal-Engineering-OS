# Redis — UNIFORGE Technology Profile

> **Domain**: 03. Databases & Storage (`03-databases`)  
> **Category**: In-Memory Cache & Queue  
> **Primary Language**: C | **Version Track**: `7.2` | **License**: `RSALv2 / Valkey BSD`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `04-connectors-and-apis/docker-compose.infra.yml`

---

## 1. Overview & Industry Use-Cases
**Redis** is a in-memory cache & queue widely adopted across modern engineering teams in the **Databases & Storage** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `Docker / Linux`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested in-memory cache & queue capabilities.
- Polyglot microservices and developer studios integrated with `FastAPI`, `Celery`, `BullMQ`, `Activepieces`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://redis.io/docs/
- **Package / Distribution Source**: Docker Hub
- **Registry Identifier**: `redis` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "redis"

# Direct installation / startup
docker compose up -d  # Managed via UNIFORGE module: 04-connectors-and-apis/docker-compose.infra.yml
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `04-connectors-and-apis/docker-compose.infra.yml`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Redis** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```yaml
# Interactive Working Configuration (Redis)
apiVersion: uniforge.io/v1
kind: WorkloadProfile
metadata:
  name: redis-service
  labels:
    domain: 03-databases
spec:
  runtime: "Docker / Linux"
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
[Redis Service Layer (Docker / Linux)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q redis` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Redis"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `Docker / Linux` |
| **Core Dependencies** | Standard Runtime |
| **First-Class Integrations** | `FastAPI`, `Celery`, `BullMQ`, `Activepieces` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `RSALv2 / Valkey BSD` (compatible with Apache-2.0 open-core workflows) |

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
| **Redis** | Primary profile (`RSALv2 / Valkey BSD`) | Recommended when `C` & `Docker / Linux` fit your architecture |
| **Valkey** | Alternative in `Databases & Storage` | Evaluate based on team language affinity & operational footprint |
| **Memcached** | Alternative in `Databases & Storage` | Evaluate based on team language affinity & operational footprint |
