# Ollama — UNIFORGE Technology Profile

> **Domain**: 04. AI & Machine Learning (`04-ai-ml`)  
> **Category**: Local LLM Inference Runtime  
> **Primary Language**: Go / C++ | **Version Track**: `Latest` | **License**: `MIT`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `03-ai-models-and-inference/docker-compose.models.yml`

---

## 1. Overview & Industry Use-Cases
**Ollama** is a local llm inference runtime widely adopted across modern engineering teams in the **AI & Machine Learning** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `Local GPU/CPU / Docker`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested local llm inference runtime capabilities.
- Polyglot microservices and developer studios integrated with `LangChain`, `LangGraph`, `n8n`, `MCP`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://ollama.com
- **Package / Distribution Source**: Docker Hub
- **Registry Identifier**: `ollama` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "ollama"

# Direct installation / startup
docker compose up -d  # Managed via UNIFORGE module: 03-ai-models-and-inference/docker-compose.models.yml
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `03-ai-models-and-inference/docker-compose.models.yml`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Ollama** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```go
// Interactive Working Example (Ollama)
package main

import "fmt"

func main() {
    fmt.Println("UNIFORGE Go Runtime Ready: Ollama (Latest)")
}
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[Ollama Service Layer (Local GPU/CPU / Docker)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q ollama` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Ollama"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `Local GPU/CPU / Docker` |
| **Core Dependencies** | `llama.cpp` |
| **First-Class Integrations** | `LangChain`, `LangGraph`, `n8n`, `MCP` |
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
| **Ollama** | Primary profile (`MIT`) | Recommended when `Go / C++` & `Local GPU/CPU / Docker` fit your architecture |
| **vLLM** | Alternative in `AI & Machine Learning` | Evaluate based on team language affinity & operational footprint |
| **LocalAI** | Alternative in `AI & Machine Learning` | Evaluate based on team language affinity & operational footprint |
| **llama.cpp** | Alternative in `AI & Machine Learning` | Evaluate based on team language affinity & operational footprint |
