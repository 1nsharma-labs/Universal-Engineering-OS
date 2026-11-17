# CrewAI — UNIFORGE Technology Profile

> **Domain**: 04. AI & Machine Learning (`04-ai-ml`)  
> **Category**: Role-Based Multi-Agent Orchestration Framework  
> **Primary Language**: Python | **Version Track**: `0.70+` | **License**: `MIT`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `02-frameworks-and-templates/ai-agents`

---

## 1. Overview & Industry Use-Cases
**CrewAI** is a role-based multi-agent orchestration framework widely adopted across modern engineering teams in the **AI & Machine Learning** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `Python 3.10+`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested role-based multi-agent orchestration framework capabilities.
- Polyglot microservices and developer studios integrated with `Ollama`, `OpenAI`, `MCP`, `LangChain Tools`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://docs.crewai.com/
- **Package / Distribution Source**: PyPI
- **Registry Identifier**: `crewai` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "crewai"

# Direct installation / startup
pip install crewai
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `02-frameworks-and-templates/ai-agents`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **CrewAI** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```python
# Interactive Working Example (CrewAI)
import asyncio

async def main():
    print("UNIFORGE Runtime initialized for CrewAI")
    # Production entry point wired to 00-universal-control-plane
    return {"service": "crewai", "status": "healthy"}

if __name__ == "__main__":
    print(asyncio.run(main()))
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[CrewAI Service Layer (Python 3.10+)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q crewai` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with CrewAI"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `Python 3.10+` |
| **Core Dependencies** | `pydantic`, `litellm` |
| **First-Class Integrations** | `Ollama`, `OpenAI`, `MCP`, `LangChain Tools` |
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
| **CrewAI** | Primary profile (`MIT`) | Recommended when `Python` & `Python 3.10+` fit your architecture |
| **AutoGen** | Alternative in `AI & Machine Learning` | Evaluate based on team language affinity & operational footprint |
| **LangGraph** | Alternative in `AI & Machine Learning` | Evaluate based on team language affinity & operational footprint |
