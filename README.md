# UNIFORGE — The Universal Engineering OS
*(Built on the Modular Polyglot `Universal-Dev-Hub` Monorepo)*

**Build Anything. Connect Everything.**
**Open-Source Technology Ecosystem & Commercial Developer Platform**

Welcome to **UNIFORGE (Universal Engineering OS)** — an open-source engineering ecosystem where programming languages, frameworks, AI agents, creative studios, databases, and cloud infrastructure operate seamlessly together. Rather than cluttering machines with untracked dependencies, this workspace uses declarative manifests, version-managed runtimes, Docker Compose on-demand micro-stacks, Model Context Protocol (MCP) servers, and an extensible Plugin SDK.

### Ecosystem Links & Governance
- **Universal Wiki & 60+ Tech Profiles**: [`docs/wiki/README.md`](docs/wiki/README.md) · [`docs/wiki/INDEX.md`](docs/wiki/INDEX.md)
- **Plugin SDK & Official Plugins**: [`packages/plugin-sdk/`](packages/plugin-sdk/) · [`plugins/README.md`](plugins/README.md)
- **UNIFORGE Cloud & Marketplace**: [`cloud/README.md`](cloud/README.md) · [`marketplace/README.md`](marketplace/README.md)
- **Go-To-Market Launch Kit**: [`docs/launch/LANDING_PAGE.md`](docs/launch/LANDING_PAGE.md) · [`docs/launch/PRODUCT_HUNT_HN_KIT.md`](docs/launch/PRODUCT_HUNT_HN_KIT.md) · [`docs/launch/PITCH_DECK_OUTLINE.md`](docs/launch/PITCH_DECK_OUTLINE.md)
- **Commercial, Enterprise & Sponsors**: [`ENTERPRISE.md`](ENTERPRISE.md) · [`COMMERCIAL_LICENSE.md`](COMMERCIAL_LICENSE.md) · [`SPONSORS.md`](SPONSORS.md)
- **Roadmap (Milestones 1–8 Complete)**: [`ROADMAP.md`](ROADMAP.md)
- **License**: Apache-2.0 ([`LICENSE`](LICENSE) & [`NOTICE`](NOTICE))
- **Community & Governance**: [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`GOVERNANCE.md`](GOVERNANCE.md) · [`SECURITY.md`](SECURITY.md) · [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)

---

## Architectural Map (Modular Monorepo)

```text
Universal-Dev-Hub/ (UNIFORGE — uniforge-os / Universal-Engineering-OS)
├── .github/                        # Org profile, CODEOWNERS, Dependabot, CI/CD & npm release workflows
├── docs/wiki/                      # Universal Wiki (60+ 10-Point Technology Profiles) & RFC templates
├── packages/
│   ├── plugin-sdk/                 # @uniforge/plugin-sdk v1.0.0 (TypeScript SDK, Sandbox, CLI, Tests)
│   └── registry-schema/            # @uniforge/registry-schema TypeScript types
├── plugins/                        # 5 Official Plugins (Docker, pgvector, p5.js, Spring Boot, Ollama)
├── cloud/                          # UNIFORGE Cloud multi-tenant stack (Compose, Traefik, Postgres RLS, Helm)
├── marketplace/                    # Paid Plugin Marketplace catalog & 70/30 Stripe/HMAC billing engine
├── 00-universal-control-plane/     # Control Plane API (Monaco LSP, PTY Terminal, API Studio) & Web Studio UI
├── 01-languages-and-runtimes/      # Multi-version runtimes (Java 8/11/17/21, Node/TS, Python, Rust, Go, C++, PHP, Ruby)
│   ├── devcontainer.json           # Unified VS Code / Cursor DevContainer with compilers & extensions
│   ├── mise.toml                   # Polyglot runtime version manager config
│   └── setup-languages.sh          # Toolchain verification & installation script
├── 02-frameworks-and-templates/    # Production starter boilerplates
│   ├── java-ecosystem/             # Spring Boot 3, Quarkus, Micronaut, JavaFX, Maven & Gradle
│   ├── react-and-frontend/         # Vite React TS, Next.js (App Router), Remix, Vue 3, Svelte
│   ├── creative-coding-and-games/  # p5.js, Three.js, React Three Fiber, D3.js, PixiJS, Phaser, WebGL Shaders
│   ├── backend-apis/               # FastAPI, Django, Express TS, NestJS, Go-Fiber, Laravel
│   └── ai-agents/                  # LangChain, LlamaIndex, CrewAI, AutoGen, LangGraph
├── 03-ai-models-and-inference/     # Local & Cloud LLM, Vision, Audio & Embedding orchestration
│   ├── docker-compose.models.yml   # Ollama, vLLM, LocalAI, Whisper, ComfyUI
│   ├── model-registry.json         # Curated catalog (DeepSeek-R1, Qwen 2.5 Coder, Llama 3.3, Flux)
│   └── download-models.sh          # Model puller script for Ollama & HuggingFace
├── 04-connectors-and-apis/         # SDKs, Database clients & Message Brokers
│   ├── docker-compose.infra.yml    # Postgres (pgvector), MySQL, Mongo, Redis, Qdrant, RabbitMQ, Kafka, MinIO
│   ├── unified-connectors.py       # Python enterprise wrapper for AI, Databases & Cloud APIs
│   └── .env.example                # Master environment variable template
├── 05-mcp-servers-hub/             # Centralized Model Context Protocol hub
│   ├── mcp-config.json             # Master MCP config (Filesystem, GitHub, Postgres, Puppeteer, Docker, K8s)
│   └── install-mcps.sh             # MCP installation & handshake verifier
├── 06-open-source-datasets/        # Fine-tuning, pretraining & benchmark pipelines
│   ├── dataset-catalog.yaml        # Curated index of The Stack v2, FineWeb, OpenHermes, GSM8k
│   └── fetch-datasets.py           # Streaming downloader for HuggingFace & Kaggle
├── 07-programming-knowledge-base/  # Offline docs, cheatsheets, prompts & RAG knowledge
│   ├── prompts-and-rules/          # System prompts, .cursorrules, .windsurfrules, code review gates
│   ├── cheatsheets/                # Java 21, React 19, p5.js, SQL/pgvector, Git, Docker, K8s, Regex
│   └── fetch-devdocs.sh            # Script to pull offline markdown documentation
├── 08-devops-cloud-and-iac/        # Infrastructure-as-Code & Container Orchestration
│   ├── terraform/                  # Starter modules for AWS, GCP, Azure, and Cloudflare
│   ├── kubernetes/                 # K3s cluster config, Helm chart (universal-app), K8s manifests
│   └── github-actions/             # Reusable CI/CD pipelines (matrix testing, security scans, CD)
├── 09-testing-and-security/        # Automated QA, Load Testing & DevSecOps
│   ├── testing-configs/            # JUnit 5, Playwright, Cypress, Pytest, Jest, k6 load testing
│   └── security-audit.sh           # Automated Trivy, Gitleaks, and Semgrep security runner
├── 10-automation-and-workflows/    # Low-Code & Scheduled Data Pipelines
│   └── docker-compose.auto.yml     # Self-hosted n8n, Activepieces, and Apache Airflow
├── 11-ui-ux-and-design-assets/     # Design Systems & Component Tokens
│   └── design-tokens.json          # W3C tokens for Shadcn/UI, Material UI, Radix, Lucide Icons
├── 12-observability-and-logs/      # Metrics, Tracing & LLMOps
│   ├── docker-compose.monitor.yml  # Prometheus, Grafana, OpenTelemetry Collector, Langfuse
│   ├── prometheus.yml              # Scrape target configurations
│   └── otel-collector-config.yaml  # OTLP pipeline processing configuration
├── Makefile                        # Centralized control plane
└── README.md                       # This master manual
```

---

## Quick-Start & Verification Commands

### 1. Launch the UNIFORGE v2.0 Operational Studio Dashboard (`:7000`)
Launch the live Control Plane (**5-Layer AI Software Factory**, Autonomous AI Team, Offline Local RAG Brain, Visual Node Compiler & Live Creative Studio, Monaco LSP, PTY Terminal, API Studio, 60+ Wiki Profiles, Plugins, Marketplace & UNIFORGE Cloud):
```bash
python devhub.py studio
# Windows PowerShell: .\devhub.ps1 studio
```

### 2. Run Phase 2 Autonomous & Factory CLI Commands
```bash
# Run the 5-Layer Self-Assembling AI Software Factory
python devhub.py factory "Build a video editing app in Python and React with AI" --cloud gcp --approve

# Run Autonomous Architect -> Coder -> Tester pipeline
python devhub.py agent-build "Build a telemetry API" --stack fastapi

# Query Offline Local RAG Brain across all 60 Wiki profiles & cheatsheets
python devhub.py rag "PostgreSQL pgvector HNSW index"

# One-Click Multi-Cloud Deploy Planner (gcp | aws | cloudflare | uniforge-cloud)
python devhub.py deploy --provider gcp --service uniforge-prod
```

### 3. Validate All Manifests, Plugins & Run End-to-End Tests
```bash
python devhub.py validate
python devhub.py plugin verify
python devhub.py test
# Or directly with pytest:
python -m pytest 09-testing-and-security/tests/test_milestones_e2e.py
```

### 4. Workspace Initialization
Verify your local toolchains and generate your master environment configuration:
```bash
python devhub.py init
```

### 2. Launch Core Infrastructure
Spin up Postgres (pgvector), MySQL, MongoDB, Redis, Qdrant, RabbitMQ, Kafka, and MinIO:
```bash
make up
```

### 3. Launch Local AI Inference Stack
Start Ollama, vLLM, LocalAI, Whisper, and ComfyUI:
```bash
make models
```
Pull the recommended coding model into Ollama:
```bash
bash 03-ai-models-and-inference/download-models.sh --pull-ollama qwen2.5-coder:7b
```

### 4. Run Polyglot Microservices On-Demand
- **Java Ecosystem**: `make java` (Builds Spring Boot 3, Quarkus, Micronaut)
- **React Dashboard**: `make react` (Runs Vite + React + Zustand + TanStack Query at `http://localhost:3000`)
- **Creative Coding Viewport**: `make creative` (Runs p5.js, Three.js, D3, PixiJS, WebGL at `http://localhost:8088`)
- **FastAPI AI Engine**: `make backend` (Runs async Python backend with Swagger docs at `http://localhost:8000/docs`)
- **Multi-Agent Simulations**: `make agents` (Executes LangChain, LlamaIndex, CrewAI, AutoGen, and LangGraph pipelines)

### 5. Launch Automation & Monitoring
- **Automation Hub**: `make auto` (Access n8n at `:5678`, Activepieces at `:8084`, Airflow at `:8085`)
- **Observability Hub**: `make monitor` (Access Grafana at `:3001`, Prometheus at `:9090`, Langfuse at `:3002`)

### 6. DevSecOps & Security Audits
Run automated secret scanning (Gitleaks), static analysis (Semgrep), and container vulnerability scans (Trivy):
```bash
make audit
```

---

## Port Allocation Matrix

| Service | Port | Category | Description |
|---|---|---|---|
| **UNIFORGE Operational Studio** | `7000` | Control Plane | Web Studio UI, Monaco LSP, PTY Terminal, API Studio, Wiki & Cloud API |
| **Vite React Console** | `3000` | Frontend | React 18, Zustand, TanStack Query |
| **Next.js App Router** | `3001` | Frontend | Server Components & Edge Routes |
| **FastAPI Backend** | `8000` | Backend | High-speed async REST API |
| **Spring Boot 3 API** | `8080` | Backend | Enterprise Java API with Actuator |
| **Quarkus Microservice** | `8081` | Backend | Supersonic subatomic Java |
| **Micronaut Service** | `8082` | Backend | AoT compiled reflection-free service |
| **Go-Fiber Service** | `8083` | Backend | Ultra-fast Golang HTTP service |
| **PostgreSQL (pgvector)**| `5432` | Storage | Relational & vector embeddings |
| **MySQL 8.0** | `3306` | Storage | Relational SQL database |
| **MongoDB 7.0** | `27017` | Storage | Document store |
| **Redis 7.2** | `6379` | Cache/Broker | In-memory key-value cache |
| **Qdrant** | `6333` | Vector Store | Dense vector similarity search |
| **MinIO S3** | `9000 / 9001`| Object Store | S3-compatible asset store & console |
| **RabbitMQ** | `5672 / 15672`| Messaging | AMQP broker & management UI |
| **Apache Kafka** | `9092` | Streaming | Distributed event streaming (KRaft) |
| **Ollama** | `11434` | AI Inference | Local quantized LLM server |
| **vLLM** | `8000` | AI Inference | High-throughput OpenAI-compatible API |
| **ComfyUI** | `8188` | AI Vision | Node-based Stable Diffusion/Flux UI |
| **n8n** | `5678` | Automation | Self-hosted workflow automation |
| **Apache Airflow** | `8085` | Automation | Scheduled Python DAG orchestration |
| **Grafana** | `3001` | Observability | Metrics dashboards |
| **Prometheus** | `9090` | Observability | TSDB metrics scraper |
| **Langfuse** | `3002` | Observability | LLM tracing, evaluation & cost control |

---

## Security & Secrets Management
- All secrets and credentials are fully externalized to `04-connectors-and-apis/.env.example`.
- Never commit `.env` files into source control.
- Run `make audit` frequently to ensure zero credentials are leaked.
