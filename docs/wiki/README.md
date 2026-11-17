# UNIFORGE Universal Wiki & Engineering Encyclopedia

Welcome to the **UNIFORGE Universal Wiki** — the community-driven, living technical encyclopedia covering **60+ verified technology profiles** across **15 engineering domains**: languages, frameworks, AI architectures, database engines, creative technology, observability, and cloud infrastructure.

👉 **[Browse the Complete 60+ Technology Profiles Index](INDEX.md)**

---

## Knowledge Architecture

### 1. Getting Started
- Architecture Overview & System Design (`00-universal-control-plane/`)
- Local Polyglot Setup with Docker, Mise, and `devhub.py`
- DevContainer Setup & IDE Integration

### 2. Polyglot Programming Languages & Frameworks
- **Frontend Engineering (`01-frontend`)**: Next.js, React + Vite, Vue 3, Svelte, Remix, Astro, SolidJS
- **Backend Engineering (`02-backend`)**: FastAPI, Spring Boot 3, Quarkus, Go Fiber, Gin, Rust Axum, NestJS, Django + DRF, Laravel, Express.js
- **Mobile & Desktop (`06-mobile`, `14-systems`)**: Flutter, React Native, Tauri (Rust)

### 3. Storage, AI & Creative Technology
- **Databases & Vector Search (`03-databases`)**: PostgreSQL + pgvector, Redis, Qdrant, Milvus, ChromaDB, Weaviate, MinIO, MongoDB, SQLite
- **AI, LLMs & Agents (`04-ai-ml`)**: Ollama, vLLM, LangGraph, LangChain, LlamaIndex, CrewAI, AutoGen, Hugging Face Transformers, Whisper, ComfyUI, MCP
- **Creative Coding & Games (`05-creative`, `10-games`)**: p5.js, Three.js, Babylon.js, WebGL GLSL, Phaser / PixiJS

### 4. Cloud, Data, Security & Testing
- **Cloud & DevOps (`07-cloud-devops`)**: Docker Compose, Kubernetes (k3s), Helm, Terraform, Prometheus + Grafana, OpenTelemetry
- **Data, Networking & Security (`08-security` .. `15-testing`)**: Apache Spark, DuckDB, gRPC + Protobuf, Kafka/RabbitMQ, DevSecOps Suite, Playwright/k6/Pytest

---

## 10-Point Documentation Standard
Every profile inside [`docs/wiki/profiles/`](profiles/) strictly includes:
1. Overview & Industry Use-Cases
2. Official Specification & Docs Links
3. Quick Install & Environment Setup
4. Beginner to Advanced Tutorials
5. Interactive Working Code Example
6. Production Architecture Example
7. API / Command Reference
8. Compatibility & Dependencies Matrix
9. Security, Auditing & Best Practices
10. Alternatives & Comparison Matrix

---

## Interactive Browsing
Launch the Universal Control Plane Studio (`python devhub.py studio --port 7000`) and open the **Universal Wiki** tab, or query via REST API:
- `GET /api/v1/wiki/profiles?q=rust`
- `GET /api/v1/wiki/profiles/{tech_id}`
