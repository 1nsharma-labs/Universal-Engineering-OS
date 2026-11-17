# Kubernetes (K3s + Helm) — UNIFORGE Technology Profile

> **Domain**: 07. Cloud & DevOps (`07-cloud-devops`)  
> **Category**: Container Cluster Orchestrator  
> **Primary Language**: YAML / Go | **Version Track**: `1.29+` | **License**: `Apache-2.0`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `08-devops-cloud-and-iac/kubernetes`

---

## 1. Overview & Industry Use-Cases
**Kubernetes (K3s + Helm)** is a container cluster orchestrator widely adopted across modern engineering teams in the **Cloud & DevOps** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `Linux Cluster`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested container cluster orchestrator capabilities.
- Polyglot microservices and developer studios integrated with `Terraform`, `Prometheus`, `GitHub Actions`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://kubernetes.io/docs/
- **Package / Distribution Source**: GitHub
- **Registry Identifier**: `kubernetes-k3s` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "kubernetes-k3s"

# Direct installation / startup
python devhub.py init && python devhub.py registry -q kubernetes-k3s
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `08-devops-cloud-and-iac/kubernetes`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Kubernetes (K3s + Helm)** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```go
// Interactive Working Example (Kubernetes (K3s + Helm))
package main

import "fmt"

func main() {
    fmt.Println("UNIFORGE Go Runtime Ready: Kubernetes (K3s + Helm) (1.29+)")
}
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[Kubernetes (K3s + Helm) Service Layer (Linux Cluster)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q kubernetes-k3s` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Kubernetes (K3s + Helm)"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `Linux Cluster` |
| **Core Dependencies** | `helm`, `kubectl` |
| **First-Class Integrations** | `Terraform`, `Prometheus`, `GitHub Actions` |
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
| **Kubernetes (K3s + Helm)** | Primary profile (`Apache-2.0`) | Recommended when `YAML / Go` & `Linux Cluster` fit your architecture |
| **Nomad** | Alternative in `Cloud & DevOps` | Evaluate based on team language affinity & operational footprint |
| **Docker Swarm** | Alternative in `Cloud & DevOps` | Evaluate based on team language affinity & operational footprint |
