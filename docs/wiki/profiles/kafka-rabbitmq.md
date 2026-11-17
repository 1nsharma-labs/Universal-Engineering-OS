# Kafka (KRaft) & RabbitMQ — UNIFORGE Technology Profile

> **Domain**: 09. Networking & Protocols (`09-networking`)  
> **Category**: Event Streaming & AMQP Messaging  
> **Primary Language**: Java / Erlang | **Version Track**: `3.7 / 3.13` | **License**: `Apache-2.0 / MPL-2.0`  
> **Security Audit Status**: `VERIFIED` | **UNIFORGE Module**: `04-connectors-and-apis/docker-compose.infra.yml`

---

## 1. Overview & Industry Use-Cases
**Kafka (KRaft) & RabbitMQ** is a event streaming & amqp messaging widely adopted across modern engineering teams in the **Networking & Protocols** domain. Within the UNIFORGE Universal Engineering OS, it provides deterministic local development parity and seamless production scaling on `Docker`.

**Key Industry Use-Cases:**
- Production workloads requiring battle-tested event streaming & amqp messaging capabilities.
- Polyglot microservices and developer studios integrated with `Spring Boot`, `FastAPI`, `Airflow`.
- Hybrid local-first and UNIFORGE Cloud multi-tenant deployments.

---

## 2. Official Specification & Docs Links
- **Official Documentation**: https://kafka.apache.org/documentation/
- **Package / Distribution Source**: Docker Hub
- **Registry Identifier**: `kafka-rabbitmq` (`00-universal-control-plane/technology-registry/technology-registry.json`)

---

## 3. Quick Install & Environment Setup
Bootstrap via the UNIFORGE monolithic root controller or directly via package tooling:

```bash
# Verify local toolchain & register environment
python devhub.py init
python devhub.py registry --query "kafka-rabbitmq"

# Direct installation / startup
docker compose up -d  # Managed via UNIFORGE module: 04-connectors-and-apis/docker-compose.infra.yml
```

---

## 4. Beginner to Advanced Tutorials
1. **Beginner**: Initialize the starter configuration in `04-connectors-and-apis/docker-compose.infra.yml`, run `python devhub.py validate`, and execute the working example in the Studio Monaco LSP Editor.
2. **Intermediate**: Connect **Kafka (KRaft) & RabbitMQ** to shared UNIFORGE infrastructure (`PostgreSQL + pgvector`, `Redis`, `MinIO`, `Ollama`) using environment variables from `04-connectors-and-apis/.env`.
3. **Advanced**: Instrument distributed tracing via OpenTelemetry, enforce Zero-Trust container isolation (`--read-only`, `--cap-drop ALL`), and deploy multi-tenant replicas via `cloud/helm/uniforge-cloud`.

---

## 5. Interactive Working Code Example
Paste directly into the **UNIFORGE Operational Code Studio (Monaco LSP)** or execute in the **Zero-Trust Sandbox**:

```java
// Interactive Working Example (Kafka (KRaft) & RabbitMQ)
package io.uniforge.demo;

public class ServiceBootstrap {
    public static void main(String[] args) {
        System.out.println("UNIFORGE JVM Runtime Ready: Kafka (KRaft) & RabbitMQ (3.7 / 3.13)");
    }
}
```

---

## 6. Production Architecture Example
```text
[Client / Studio UI]
        │  HTTPS / WebSocket (TLS 1.3 + Traefik Edge)
        ▼
[Kafka (KRaft) & RabbitMQ Service Layer (Docker)]
        ├── Metrics & Traces ──▶ OpenTelemetry Collector ──▶ Prometheus / Grafana
        ├── Persistence      ──▶ PostgreSQL (pgvector) / Redis / MinIO
        └── Automation & AI  ──▶ UNIFORGE Control Plane (:7000) + MCP Hub
```

---

## 7. API / Command Reference
| Operation | Command / Endpoint | Description |
| --- | --- | --- |
| Registry Lookup | `python devhub.py registry -q kafka-rabbitmq` | Inspect metadata, dependencies, and module path |
| Architecture Plan | `python devhub.py architect "Build with Kafka (KRaft) & RabbitMQ"` | Generate justified full-stack blueprint |
| Manifest Validation | `python devhub.py validate` | Verify all JSON & YAML schemas |
| Sandbox Dry-Run | `python devhub.py sandbox -l python` | Preview rootless Docker execution policy |

---

## 8. Compatibility & Dependencies Matrix
| Dimension | Specification |
| --- | --- |
| **Runtime Target** | `Docker` |
| **Core Dependencies** | Standard Runtime |
| **First-Class Integrations** | `Spring Boot`, `FastAPI`, `Airflow` |
| **Container Isolation** | Compatible with UNIFORGE Rootless Docker & Kubernetes Pods |
| **License Compatibility** | `Apache-2.0 / MPL-2.0` (compatible with Apache-2.0 open-core workflows) |

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
| **Kafka (KRaft) & RabbitMQ** | Primary profile (`Apache-2.0 / MPL-2.0`) | Recommended when `Java / Erlang` & `Docker` fit your architecture |
| **NATS** | Alternative in `Networking & Protocols` | Evaluate based on team language affinity & operational footprint |
| **Redpanda** | Alternative in `Networking & Protocols` | Evaluate based on team language affinity & operational footprint |
