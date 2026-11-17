# Quarkus — UNIFORGE Technology Profile

> **Domain**: 02. Backend Engineering (`02-backend`)  
> **Category**: Cloud-Native Java Framework  
> **Primary Language**: Java 21 | **Version Track**: `3.8+` | **License**: `Apache-2.0`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `02-frameworks-and-templates/java-ecosystem/quarkus-starter`

---

## 1. Overview & Industry Use-Cases
**Quarkus** is a cloud-native java framework widely adopted across modern engineering teams in the **Backend Engineering** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `JVM / GraalVM Native`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested cloud-native java framework capabilities.
- Polyglot microservices and developer studios integrated with `Kubernetes`, `Kafka`, `PostgreSQL`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://quarkus.io
- **Package / Distribution Source**: Maven Central
- **Registry Identifier**: `quarkus` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "quarkus"

# Direct installation / startup
python devhub.py init && python devhub.py registry -q quarkus
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `02-frameworks-and-templates/java-ecosystem/quarkus-starter`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Quarkus** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```java
// Interactive Working Example (Quarkus)
package io.uniforge.demo;

public class ServiceBootstrap {
    public static void main(String[] args) {
        System.out.println("UNIFORGE JVM Runtime Ready: Quarkus (3.8+)");
    }
}
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[Quarkus Service Layer (JVM / GraalVM Native)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q quarkus` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Quarkus"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `JVM / GraalVM Native` |
| **Core Dependencies** | `quarkus-resteasy-reactive` |
| **First-Class Integrations** | `Kubernetes`, `Kafka`, `PostgreSQL` |
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
| **Quarkus** | Primary profile (`Apache-2.0`) | Recommended when `Java 21` & `JVM / GraalVM Native` fit your architecture |
| **Spring Boot** | Alternative in `Backend Engineering` | Evaluate based on team language affinity & operational footprint |
| **Micronaut** | Alternative in `Backend Engineering` | Evaluate based on team language affinity & operational footprint |
