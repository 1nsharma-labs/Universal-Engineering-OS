# React + Vite — UNIFORGE Technology Profile

> **Domain**: 01. Frontend Engineering (`01-frontend`)  
> **Category**: UI Library & Bundler  
> **Primary Language**: TypeScript / JavaScript | **Version Track**: `18.x / 19.x` | **License**: `MIT`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `02-frameworks-and-templates/react-and-frontend/vite-react-ts`

---

## 1. Overview & Industry Use-Cases
**React + Vite** is a ui library & bundler widely adopted across modern engineering teams in the **Frontend Engineering** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `Browser`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested ui library & bundler capabilities.
- Polyglot microservices and developer studios integrated with `Tailwind CSS`, `Shadcn/UI`, `REST`, `WebSocket`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://react.dev
- **Package / Distribution Source**: npm Registry
- **Registry Identifier**: `react-vite` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "react-vite"

# Direct installation / startup
npm install react-vite
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `02-frameworks-and-templates/react-and-frontend/vite-react-ts`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **React + Vite** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```typescript
// Interactive Working Example (React + Vite)
export interface ServiceStatus {
  service: string;
  version: string;
  healthy: boolean;
}

export function bootstrapService(): ServiceStatus {
  return {
    service: "react-vite",
    version: "18.x / 19.x",
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
[React + Vite Service Layer (Browser)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q react-vite` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with React + Vite"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `Browser` |
| **Core Dependencies** | `vite`, `zustand`, `@tanstack/react-query` |
| **First-Class Integrations** | `Tailwind CSS`, `Shadcn/UI`, `REST`, `WebSocket` |
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
| **React + Vite** | Primary profile (`MIT`) | Recommended when `TypeScript / JavaScript` & `Browser` fit your architecture |
| **Vue 3** | Alternative in `Frontend Engineering` | Evaluate based on team language affinity & operational footprint |
| **Svelte** | Alternative in `Frontend Engineering` | Evaluate based on team language affinity & operational footprint |
| **SolidJS** | Alternative in `Frontend Engineering` | Evaluate based on team language affinity & operational footprint |
