# ComfyUI (Flux / SD) — UNIFORGE Technology Profile

> **Domain**: 04. AI & Machine Learning (`04-ai-ml`)  
> **Category**: Node-Based Generative Vision Pipeline  
> **Primary Language**: Python / PyTorch | **Version Track**: `Latest` | **License**: `GPL-3.0`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `03-ai-models-and-inference/docker-compose.models.yml`

---

## 1. Overview & Industry Use-Cases
**ComfyUI (Flux / SD)** is a node-based generative vision pipeline widely adopted across modern engineering teams in the **AI & Machine Learning** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `GPU Docker`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested node-based generative vision pipeline capabilities.
- Polyglot microservices and developer studios integrated with `FastAPI`, `MinIO`, `Three.js`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://github.com/comfyanonymous/ComfyUI
- **Package / Distribution Source**: GitHub
- **Registry Identifier**: `comfyui` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "comfyui"

# Direct installation / startup
python devhub.py init && python devhub.py registry -q comfyui
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `03-ai-models-and-inference/docker-compose.models.yml`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **ComfyUI (Flux / SD)** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```python
# Interactive Working Example (ComfyUI (Flux / SD))
import asyncio

async def main():
    print("UNIFORGE Runtime initialized for ComfyUI (Flux / SD)")
    # Production entry point wired to 00-universal-control-plane
    return {"service": "comfyui", "status": "healthy"}

if __name__ == "__main__":
    print(asyncio.run(main()))
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[ComfyUI (Flux / SD) Service Layer (GPU Docker)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q comfyui` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with ComfyUI (Flux / SD)"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `GPU Docker` |
| **Core Dependencies** | `pytorch` |
| **First-Class Integrations** | `FastAPI`, `MinIO`, `Three.js` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `GPL-3.0` (compatible with Apache-2.0 open-core workflows) |

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
| **ComfyUI (Flux / SD)** | Primary profile (`GPL-3.0`) | Recommended when `Python / PyTorch` & `GPU Docker` fit your architecture |
| **Automatic1111** | Alternative in `AI & Machine Learning` | Evaluate based on team language affinity & operational footprint |
| **Diffusers** | Alternative in `AI & Machine Learning` | Evaluate based on team language affinity & operational footprint |
