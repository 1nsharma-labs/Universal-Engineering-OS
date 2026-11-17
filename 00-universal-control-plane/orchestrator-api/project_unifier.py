"""
Project Unifier: Analyzes a local folder or GitHub repository URL,
identifies languages/frameworks/databases, maps them to the Universal Technology Registry,
and generates a unified connection manifest for Universal-Dev-Hub.
"""

import re
from pathlib import Path
from typing import Any, Dict, List


STACK_SIGNATURES = {
    "package.json": ("Node.js / JavaScript / TypeScript", "01-frontend"),
    "next.config.js": ("Next.js", "01-frontend"),
    "vite.config.ts": ("Vite + React/Vue/Svelte", "01-frontend"),
    "pom.xml": ("Java (Maven)", "02-backend"),
    "build.gradle.kts": ("Java / Kotlin (Gradle)", "02-backend"),
    "requirements.txt": ("Python", "02-backend"),
    "pyproject.toml": ("Python (Modern)", "02-backend"),
    "go.mod": ("Go", "02-backend"),
    "Cargo.toml": ("Rust", "14-systems"),
    "composer.json": ("PHP / Laravel", "02-backend"),
    "pubspec.yaml": ("Flutter / Dart", "06-mobile"),
    "Dockerfile": ("Docker Container", "07-cloud-devops"),
    "docker-compose.yml": ("Docker Compose Stack", "07-cloud-devops"),
    "main.tf": ("Terraform IaC", "07-cloud-devops"),
}


def unify_project(target: str) -> Dict[str, Any]:
    target = target.strip()
    is_github = bool(re.match(r"^https?://(www\.)?github\.com/[^/]+/[^/]+", target))

    if is_github:
        repo_name = target.rstrip("/").split("/")[-1].replace(".git", "")
        return {
            "source_type": "github_repository",
            "target": target,
            "project_name": repo_name,
            "integration_plan": [
                f"git clone --depth 1 {target} workspaces/{repo_name}",
                f"Run security pre-scan: bash 09-testing-and-security/security-audit.sh",
                "Auto-detect manifests (package.json, pom.xml, requirements.txt, go.mod, Cargo.toml)",
                "Attach to shared Docker network `universal-dev-network` for Postgres, Redis, Ollama & Qdrant access",
                "Launch inside isolated sandbox container with resource quotas"
            ],
            "sandbox_isolation": {
                "network": "restricted_to_hub_bridge",
                "memory_limit": "1g",
                "cpu_limit": "1.5",
                "read_only_root": True
            }
        }

    path = Path(target)
    if not path.exists():
        return {
            "source_type": "unknown",
            "target": target,
            "error": "Path does not exist locally and is not a valid GitHub repository URL."
        }

    detected: List[Dict[str, str]] = []
    for filename, (tech_name, domain) in STACK_SIGNATURES.items():
        matches = list(path.rglob(filename))[:5]
        if matches:
            detected.append({
                "indicator": filename,
                "technology": tech_name,
                "domain": domain,
                "locations": [str(m.relative_to(path)) for m in matches]
            })

    return {
        "source_type": "local_workspace",
        "target": str(path.resolve()),
        "detected_stacks": detected,
        "unified_network": "universal-dev-network",
        "recommended_connectors": [
            "POSTGRES_URL=postgresql://devhub:devhub_secure_pass@localhost:5432/devhub_db",
            "REDIS_URL=redis://:devhub_redis_pass@localhost:6379/0",
            "OLLAMA_BASE_URL=http://localhost:11434",
            "QDRANT_URL=http://localhost:6333"
        ]
    }
