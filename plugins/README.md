# UNIFORGE Official Plugins Suite (v1.0.0)

Built with `@uniforge/plugin-sdk` and validated against the Zero-Trust Capability Permission model.

| Official Plugin | Package ID | Category | Key Capabilities |
| --- | --- | --- | --- |
| **Docker Manager** | `@uniforge/plugin-docker-manager` | Infrastructure | Container ps/up/down, Compose stacks, engine diagnostics |
| **pgvector Explorer** | `@uniforge/plugin-pgvector-explorer` | Database | Cosine/L2/IP SQL builder, vector similarity calculator, HNSW/IVFFlat advisor |
| **p5.js Studio** | `@uniforge/plugin-p5js-studio` | Creative | Live generative art templates, sandboxed HTML canvas compiler |
| **Spring Boot Controller** | `@uniforge/plugin-spring-boot-controller` | Backend | Spring Actuator health/metrics inspection, Maven build controller |
| **Ollama AI Studio** | `@uniforge/plugin-ollama-ai-studio` | AI | Local LLM model manager, prompt playground, embedding generator |

## Validating All Plugins
```bash
python devhub.py plugin verify
```

