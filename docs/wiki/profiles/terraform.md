# Terraform — UNIFORGE Technology Profile

> **Domain**: 07. Cloud & DevOps (`07-cloud-devops`)  
> **Category**: Multi-Cloud Infrastructure as Code  
> **Primary Language**: HCL | **Version Track**: `1.7+` | **License**: `BSL-1.1 / OpenTofu MPL`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `08-devops-cloud-and-iac/terraform`

---

## 1. Overview & Industry Use-Cases
**Terraform** is a multi-cloud infrastructure as code widely adopted across modern engineering teams in the **Cloud & DevOps** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `CLI Binary`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested multi-cloud infrastructure as code capabilities.
- Polyglot microservices and developer studios integrated with `AWS`, `GCP`, `Azure`, `Cloudflare`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://developer.hashicorp.com/terraform
- **Package / Distribution Source**: Official Documentation
- **Registry Identifier**: `terraform` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "terraform"

# Direct installation / startup
python devhub.py init && python devhub.py registry -q terraform
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `08-devops-cloud-and-iac/terraform`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Terraform** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```yaml
# Interactive Working Configuration (Terraform)
apiVersion: uniforge.io/v1
kind: WorkloadProfile
metadata:
  name: terraform-service
  labels:
    domain: 07-cloud-devops
spec:
  runtime: "CLI Binary"
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
[Terraform Service Layer (CLI Binary)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q terraform` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Terraform"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `CLI Binary` |
| **Core Dependencies** | Standard Runtime |
| **First-Class Integrations** | `AWS`, `GCP`, `Azure`, `Cloudflare` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `BSL-1.1 / OpenTofu MPL` (compatible with Apache-2.0 open-core workflows) |

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
| **Terraform** | Primary profile (`BSL-1.1 / OpenTofu MPL`) | Recommended when `HCL` & `CLI Binary` fit your architecture |
| **OpenTofu** | Alternative in `Cloud & DevOps` | Evaluate based on team language affinity & operational footprint |
| **Pulumi** | Alternative in `Cloud & DevOps` | Evaluate based on team language affinity & operational footprint |
