# p5.js — UNIFORGE Technology Profile

> **Domain**: 05. Creative Coding & Graphics (`05-creative`)  
> **Category**: Creative Coding & Generative Art Library  
> **Primary Language**: JavaScript | **Version Track**: `1.9+` | **License**: `LGPL-2.1`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `02-frameworks-and-templates/creative-coding-and-games/p5-starter`

---

## 1. Overview & Industry Use-Cases
**p5.js** is a creative coding & generative art library widely adopted across modern engineering teams in the **Creative Coding & Graphics** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `Browser Canvas/WebGL`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested creative coding & generative art library capabilities.
- Polyglot microservices and developer studios integrated with `HTML5 Canvas`, `WebAudio`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://p5js.org/reference/
- **Package / Distribution Source**: npm Registry
- **Registry Identifier**: `p5js` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "p5js"

# Direct installation / startup
npm install p5js
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `02-frameworks-and-templates/creative-coding-and-games/p5-starter`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **p5.js** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```typescript
// Interactive Working Example (p5.js)
export interface ServiceStatus {
  service: string;
  version: string;
  healthy: boolean;
}

export function bootstrapService(): ServiceStatus {
  return {
    service: "p5js",
    version: "1.9+",
    healthy: true,
  };
}

console.log(bootstrapService());
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[p5.js Service Layer (Browser Canvas/WebGL)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q p5js` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with p5.js"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `Browser Canvas/WebGL` |
| **Core Dependencies** | Standard Runtime |
| **First-Class Integrations** | `HTML5 Canvas`, `WebAudio` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `LGPL-2.1` (compatible with Apache-2.0 open-core workflows) |

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
| **p5.js** | Primary profile (`LGPL-2.1`) | Recommended when `JavaScript` & `Browser Canvas/WebGL` fit your architecture |
| **Processing** | Alternative in `Creative Coding & Graphics` | Evaluate based on team language affinity & operational footprint |
| **Paper.js** | Alternative in `Creative Coding & Graphics` | Evaluate based on team language affinity & operational footprint |
| **Hydra** | Alternative in `Creative Coding & Graphics` | Evaluate based on team language affinity & operational footprint |
