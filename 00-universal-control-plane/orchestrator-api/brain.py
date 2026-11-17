"""
Universal Engineering Brain & AI Architecture Orchestrator
- Breaks user requirements into concrete engineering tasks
- Selects minimal, non-bloated technologies from the 15-Domain Technology Registry
- Explains the exact rationale ('why') for every chosen technology
- Maps choices directly to executable Universal-Dev-Hub modules and Docker stacks
- Supports optional live LLM refinement (Ollama / OpenAI / Anthropic / Gemini)
"""

import json
from pathlib import Path
from typing import Any, Dict, List

REGISTRY_PATH = Path(__file__).resolve().parents[1] / "technology-registry" / "technology-registry.json"


def load_registry() -> Dict[str, Any]:
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def search_registry(query: str = "", domain: str = "") -> List[Dict[str, Any]]:
    reg = load_registry()
    results = []
    q = query.strip().lower()
    d = domain.strip().lower()
    for tech in reg["technologies"]:
        if d and d not in tech["domain_id"].lower():
            continue
        if q:
            haystack = " ".join([
                tech["id"], tech["name"], tech["type"], tech["language"],
                tech["domain_id"], " ".join(tech.get("integrations", [])),
                " ".join(tech.get("alternatives", []))
            ]).lower()
            if q not in haystack:
                continue
        results.append(tech)
    return results


def architect_solution(prompt: str, deployment_mode: str = "hybrid-local-cloud") -> Dict[str, Any]:
    """
    Analyze a natural-language product vision and produce an explicit, reasoned,
    non-bloated architecture blueprint mapped to Universal-Dev-Hub modules.
    """
    reg = load_registry()
    tech_by_id = {t["id"]: t for t in reg["technologies"]}
    text = prompt.lower()

    selected: List[Dict[str, Any]] = []
    tasks: List[Dict[str, str]] = []
    docker_stacks: List[str] = ["04-connectors-and-apis/docker-compose.infra.yml"]

    def pick(tech_id: str, role: str, reason: str):
        tech = tech_by_id.get(tech_id)
        if not tech:
            return
        if any(s["id"] == tech_id for s in selected):
            return
        selected.append({
            "id": tech["id"],
            "name": tech["name"],
            "domain": tech["domain_id"],
            "role": role,
            "reason": reason,
            "license": tech["license"],
            "hub_module": tech["hub_module"],
        })

    # 1. Detect Frontend / UI needs
    if any(k in text for k in ["mobile", "ios", "android", "flutter"]):
        if "flutter" in text:
            pick("flutter", "Mobile Frontend", "Single Dart codebase delivering native iOS/Android performance.")
        else:
            pick("react-native", "Mobile Frontend", "Shares TypeScript/React patterns with web control plane.")
        tasks.append({"step": "1", "domain": "Mobile", "task": "Scaffold cross-platform mobile UI & API client."})
    elif any(k in text for k in ["desktop", "tauri", "electron", "offline app"]):
        pick("tauri-rust", "Desktop Shell", "Ultra-low memory footprint Rust shell wrapping web UI securely.")
        pick("react-vite", "Desktop UI", "Fast HMR TypeScript UI embedded inside Tauri WebView.")
        tasks.append({"step": "1", "domain": "Desktop", "task": "Build Tauri Rust core + React frontend."})
    else:
        if any(k in text for k in ["saas", "seo", "ssr", "dashboard", "login", "auth", "web", "app", "portal"]):
            pick("nextjs", "Primary Web Frontend", "Supports SSR, App Router, Auth middleware, and SEO out of the box.")
        else:
            pick("react-vite", "Primary Web Frontend", "Minimal, fast SPA bundler without unnecessary server complexity.")
        tasks.append({"step": "1", "domain": "Frontend", "task": "Build responsive UI, authentication views, and API hooks."})

    # 2. Detect Backend needs
    if any(k in text for k in ["java", "spring", "enterprise", "banking", "erp"]):
        pick("spring-boot", "Core Backend API", "Strong JVM typing, virtual threads, and enterprise security ecosystem.")
    elif any(k in text for k in ["high throughput", "golang", "go ", "proxy", "gateway"]):
        pick("go-fiber", "Core Backend API", "Compiled single-binary concurrency with minimal memory overhead.")
    else:
        pick("fastapi", "Core Backend & AI Orchestration API", "Async Python integrates natively with AI/ML models, Pydantic validation, and OpenAPI docs.")
    tasks.append({"step": "2", "domain": "Backend", "task": "Implement REST/WebSocket APIs, auth guards, and async job triggers."})

    # 3. Detect Database & Storage needs
    pick("postgresql-pgvector", "Primary Relational + Vector DB", "Single ACID database handles users, metadata, AND semantic vector embeddings without adding extra DBs early.")
    if any(k in text for k in ["video", "image", "upload", "file", "download", "media", "pdf", "storage", "s3"]):
        pick("minio", "S3-Compatible Object Storage", "Handles large media/video uploads and presigned downloads locally or synced to cloud S3.")
        tasks.append({"step": "3", "domain": "Storage", "task": "Configure MinIO buckets with presigned upload/download URLs."})
    if any(k in text for k in ["queue", "async", "video", "realtime", "cache", "job", "background", "worker"]):
        pick("redis", "Cache & Async Job Queue", "Decouples long-running AI/media processing jobs from HTTP request timeouts.")

    # 4. Detect AI / ML / Video / Agents needs
    if any(k in text for k in ["ai", "llm", "agent", "rag", "chat", "gpt", "model", "understand", "analyze", "summarize"]):
        pick("ollama", "Local-First LLM Inference", "Zero-API-cost local inference with OpenAI-compatible fallback for privacy and offline control.")
        pick("langgraph", "Agentic Workflow Orchestrator", "Stateful graph execution with retries and deterministic tool routing.")
        docker_stacks.append("03-ai-models-and-inference/docker-compose.models.yml")
        tasks.append({"step": "4", "domain": "AI/ML", "task": "Wire local Ollama + cloud fallback connectors and agent state graph."})
    if any(k in text for k in ["video", "audio", "speech", "transcribe", "voice"]):
        pick("whisper", "Audio/Video Transcription Engine", "Extracts accurate timestamped transcripts from uploaded video/audio locally.")
        if "03-ai-models-and-inference/docker-compose.models.yml" not in docker_stacks:
            docker_stacks.append("03-ai-models-and-inference/docker-compose.models.yml")
    if any(k in text for k in ["image gen", "diffusion", "flux", "render art"]):
        pick("comfyui", "Generative Visual Pipeline", "Programmable graph-based local image generation API.")
        if "03-ai-models-and-inference/docker-compose.models.yml" not in docker_stacks:
            docker_stacks.append("03-ai-models-and-inference/docker-compose.models.yml")

    # 5. Detect 3D / Creative / Game needs
    if any(k in text for k in ["3d", "three.js", "visual", "shader", "webgl", "vr", "ar", "blender"]):
        pick("threejs", "3D Visual & WebGL Engine", "Industry-standard browser 3D rendering with React Three Fiber integration.")
        tasks.append({"step": "5", "domain": "Creative/3D", "task": "Build interactive Three.js / R3F viewport and scene exporter."})
    elif any(k in text for k in ["game", "arcade", "physics", "2d"]):
        pick("phaser-pixi", "2D Game Engine", "Hardware-accelerated 2D canvas/WebGL physics and sprite engine.")
        tasks.append({"step": "5", "domain": "Game", "task": "Build game loop, physics colliders, and HUD scenes."})
    elif any(k in text for k in ["generative", "p5", "creative coding", "canvas"]):
        pick("p5js", "Creative Coding Canvas", "Expressive generative visuals and real-time interactive sketches.")

    # 6. Detect Automation / Scraping / Data pipelines
    if any(k in text for k in ["automat", "workflow", "n8n", "schedule", "cron", "webhook", "pipeline", "etl"]):
        pick("n8n-activepieces", "Workflow Automation Engine", "Visual webhook & scheduled integrations connected directly to local APIs and LLMs.")
        docker_stacks.append("10-automation-and-workflows/docker-compose.auto.yml")

    # 7. Always enforce Security, Testing & Sandboxed Execution (Core OS Principles)
    pick("docker-compose", "Sandboxed Execution & Deployment", "Guarantees isolated, resource-limited containers across both Local and Self-Hosted Cloud.")
    pick("devsecops-suite", "Security & Secret Scanning", "Automated Trivy, Gitleaks, and Semgrep gates prevent credential leaks and CVEs.")
    pick("playwright-k6-pytest", "Quality & Load Verification", "Automated API, browser E2E, and p95 latency regression checks.")

    tasks.append({"step": str(len(tasks) + 1), "domain": "Security & Sandbox", "task": "Enforce JWT/OIDC auth, container resource limits, and run Gitleaks/Trivy audit."})
    tasks.append({"step": str(len(tasks) + 1), "domain": "Delivery", "task": "Deploy via Docker Compose locally and mirror to Self-Hosted Cloud via hybrid-sync."})

    return {
        "input_prompt": prompt,
        "deployment_mode": deployment_mode,
        "principle": "Minimalist non-bloated stack: every selected technology has an explicit engineering justification.",
        "selected_stack_count": len(selected),
        "selected_technologies": selected,
        "engineering_tasks": tasks,
        "required_docker_stacks": docker_stacks,
        "security_guarantees": [
            "User-submitted code executes only inside rootless, read-only, network-isolated Docker sandboxes.",
            "All credentials strictly injected from 04-connectors-and-apis/.env (never hardcoded).",
            "Automated Gitleaks + Semgrep + Trivy scan runs before deployment."
        ],
        "next_commands": [
            "python devhub.py init",
            "python devhub.py up",
            "python devhub.py validate"
        ]
    }
