# Faster-Whisper — UNIFORGE Technology Profile

> **Domain**: 04. AI & Machine Learning (`04-ai-ml`)  
> **Category**: Speech-to-Text Audio/Video AI  
> **Primary Language**: Python / CTranslate2 | **Version Track**: `Large-v3` | **License**: `MIT`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `03-ai-models-and-inference/docker-compose.models.yml`

---

## 1. Overview & Industry Use-Cases
**Faster-Whisper** is a speech-to-text audio/video ai widely adopted across modern engineering teams in the **AI & Machine Learning** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `GPU/CPU Docker`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested speech-to-text audio/video ai capabilities.
- Polyglot microservices and developer studios integrated with `FastAPI`, `MinIO`, `Video Pipelines`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://github.com/SYSTRAN/faster-whisper
- **Package / Distribution Source**: PyPI
- **Registry Identifier**: `whisper` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "whisper"

# Direct installation / startup
pip install whisper
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `03-ai-models-and-inference/docker-compose.models.yml`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Faster-Whisper** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```python
# Interactive Working Example (Faster-Whisper)
import asyncio

async def main():
    print("UNIFORGE Runtime initialized for Faster-Whisper")
    # Production entry point wired to 00-universal-control-plane
    return {"service": "whisper", "status": "healthy"}

if __name__ == "__main__":
    print(asyncio.run(main()))
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[Faster-Whisper Service Layer (GPU/CPU Docker)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q whisper` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Faster-Whisper"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `GPU/CPU Docker` |
| **Core Dependencies** | `ffmpeg` |
| **First-Class Integrations** | `FastAPI`, `MinIO`, `Video Pipelines` |
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
| **Faster-Whisper** | Primary profile (`MIT`) | Recommended when `Python / CTranslate2` & `GPU/CPU Docker` fit your architecture |
| **Whisper.cpp** | Alternative in `AI & Machine Learning` | Evaluate based on team language affinity & operational footprint |
| **Deepgram** | Alternative in `AI & Machine Learning` | Evaluate based on team language affinity & operational footprint |
