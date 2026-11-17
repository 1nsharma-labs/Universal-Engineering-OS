# n8n & Activepieces — UNIFORGE Technology Profile

> **Domain**: 13. Automation & Workflow (`13-automation`)  
> **Category**: Self-Hosted Workflow & AI Automation  
> **Primary Language**: TypeScript | **Version Track**: `Latest` | **License**: `Sustainable Use / MIT`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `10-automation-and-workflows/docker-compose.auto.yml`

---

## 1. Overview & Industry Use-Cases
**n8n & Activepieces** is a self-hosted workflow & ai automation widely adopted across modern engineering teams in the **Automation & Workflow** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `Docker`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested self-hosted workflow & ai automation capabilities.
- Polyglot microservices and developer studios integrated with `Ollama`, `Webhooks`, `Slack`, `GitHub`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://docs.n8n.io
- **Package / Distribution Source**: Docker Hub
- **Registry Identifier**: `n8n-activepieces` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "n8n-activepieces"

# Direct installation / startup
docker compose up -d  # Managed via UNIFORGE module: 10-automation-and-workflows/docker-compose.auto.yml
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `10-automation-and-workflows/docker-compose.auto.yml`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **n8n & Activepieces** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```typescript
// Interactive Working Example (n8n & Activepieces)
export interface ServiceStatus {
  service: string;
  version: string;
  healthy: boolean;
}

export function bootstrapService(): ServiceStatus {
  return {
    service: "n8n-activepieces",
    version: "Latest",
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
[n8n & Activepieces Service Layer (Docker)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q n8n-activepieces` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with n8n & Activepieces"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `Docker` |
| **Core Dependencies** | `postgres`, `redis` |
| **First-Class Integrations** | `Ollama`, `Webhooks`, `Slack`, `GitHub` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `Sustainable Use / MIT` (compatible with Apache-2.0 open-core workflows) |

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
| **n8n & Activepieces** | Primary profile (`Sustainable Use / MIT`) | Recommended when `TypeScript` & `Docker` fit your architecture |
| **Temporal** | Alternative in `Automation & Workflow` | Evaluate based on team language affinity & operational footprint |
| **Windmill** | Alternative in `Automation & Workflow` | Evaluate based on team language affinity & operational footprint |
