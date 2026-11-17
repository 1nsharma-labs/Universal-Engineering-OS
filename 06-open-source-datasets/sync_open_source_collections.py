#!/usr/bin/env python3
"""
UNIFORGE Open-Source Internet Data & Collection Syncer
Fetches live, real-time open-source metadata from public APIs (PyPI, npm, Hugging Face Hub, GitHub)
and writes structured JSON + Markdown collections into:
  - 06-open-source-datasets/synced-open-source-hub.json
  - 07-programming-knowledge-base/OPEN_SOURCE_LIVE_COLLECTION.md
Zero API keys required; gracefully skips any unreachable endpoint.
"""

import concurrent.futures
import json
import time
import urllib.request
from pathlib import Path
from typing import Any, Dict, List

HUB_ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = HUB_ROOT / "06-open-source-datasets" / "synced-open-source-hub.json"
OUT_MD = HUB_ROOT / "07-programming-knowledge-base" / "OPEN_SOURCE_LIVE_COLLECTION.md"

PYPI_PACKAGES = [
    "fastapi", "uvicorn", "pydantic", "httpx", "pytest",
    "langchain", "qdrant-client", "duckdb", "transformers", "chromadb",
]

NPM_PACKAGES = [
    "react", "next", "vite", "typescript", "tailwindcss",
    "zustand", "@tanstack/react-query", "three", "p5", "astro",
]

HF_DATASETS = [
    "openai/gsm8k",
    "HuggingFaceFW/fineweb",
    "teknium/OpenHermes-2.5",
    "bigcode/the-stack-v2",
    "tatsu-lab/alpaca",
]

HF_MODELS = [
    "Qwen/Qwen2.5-Coder-7B-Instruct",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    "meta-llama/Llama-3.2-3B-Instruct",
    "openai/whisper-large-v3",
    "nomic-ai/nomic-embed-text-v1.5",
]

GITHUB_REPOS = [
    "fastapi/fastapi",
    "vercel/next.js",
    "ollama/ollama",
    "qdrant/qdrant",
    "pgvector/pgvector",
    "langchain-ai/langgraph",
]


def _fetch_json(url: str, timeout: float = 8.0) -> Any:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "UNIFORGE-OpenSource-Sync/2.1 (+https://github.com/1nsharma-labs/Universal-Engineering-OS)",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def fetch_pypi(pkg: str) -> Dict[str, Any]:
    try:
        data = _fetch_json(f"https://pypi.org/pypi/{pkg}/json")
        info = data.get("info", {})
        return {
            "name": pkg,
            "version": info.get("version", "unknown"),
            "summary": (info.get("summary") or "")[:160],
            "license": (info.get("license") or info.get("license_expression") or "Open Source")[:48],
            "url": info.get("package_url", f"https://pypi.org/project/{pkg}/"),
            "ok": True,
        }
    except Exception as exc:
        return {"name": pkg, "ok": False, "error": str(exc)}


def fetch_npm(pkg: str) -> Dict[str, Any]:
    try:
        encoded = pkg.replace("/", "%2F")
        data = _fetch_json(f"https://registry.npmjs.org/{encoded}/latest")
        return {
            "name": pkg,
            "version": data.get("version", "unknown"),
            "description": (data.get("description") or "")[:160],
            "license": str(data.get("license", "MIT"))[:48],
            "url": f"https://www.npmjs.com/package/{pkg}",
            "ok": True,
        }
    except Exception as exc:
        return {"name": pkg, "ok": False, "error": str(exc)}


def fetch_hf_dataset(ds_id: str) -> Dict[str, Any]:
    try:
        data = _fetch_json(f"https://huggingface.co/api/datasets/{ds_id}")
        return {
            "id": ds_id,
            "downloads": data.get("downloads", 0),
            "likes": data.get("likes", 0),
            "tags": (data.get("tags") or [])[:6],
            "url": f"https://huggingface.co/datasets/{ds_id}",
            "ok": True,
        }
    except Exception as exc:
        return {"id": ds_id, "ok": False, "error": str(exc)}


def fetch_hf_model(model_id: str) -> Dict[str, Any]:
    try:
        data = _fetch_json(f"https://huggingface.co/api/models/{model_id}")
        return {
            "id": model_id,
            "pipeline_tag": data.get("pipeline_tag", "text-generation"),
            "downloads": data.get("downloads", 0),
            "likes": data.get("likes", 0),
            "library": data.get("library_name", "transformers"),
            "url": f"https://huggingface.co/{model_id}",
            "ok": True,
        }
    except Exception as exc:
        return {"id": model_id, "ok": False, "error": str(exc)}


def fetch_github(repo: str) -> Dict[str, Any]:
    try:
        data = _fetch_json(f"https://api.github.com/repos/{repo}")
        return {
            "repo": repo,
            "stars": data.get("stargazers_count", 0),
            "forks": data.get("forks_count", 0),
            "language": data.get("language", ""),
            "license": (data.get("license") or {}).get("spdx_id", "Open Source"),
            "description": (data.get("description") or "")[:160],
            "url": data.get("html_url", f"https://github.com/{repo}"),
            "ok": True,
        }
    except Exception as exc:
        return {"repo": repo, "ok": False, "error": str(exc)}


def run_sync() -> Dict[str, Any]:
    t0 = time.perf_counter()
    print("=== UNIFORGE Open-Source Internet Collection Sync ===")
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        pypi_res = list(pool.map(fetch_pypi, PYPI_PACKAGES))
        npm_res = list(pool.map(fetch_npm, NPM_PACKAGES))
        ds_res = list(pool.map(fetch_hf_dataset, HF_DATASETS))
        model_res = list(pool.map(fetch_hf_model, HF_MODELS))
        gh_res = list(pool.map(fetch_github, GITHUB_REPOS))

    payload = {
        "schemaVersion": "1.0.0",
        "synced_at_epoch": int(time.time()),
        "duration_sec": round(time.perf_counter() - t0, 2),
        "counts": {
            "pypi_ok": sum(1 for x in pypi_res if x["ok"]),
            "npm_ok": sum(1 for x in npm_res if x["ok"]),
            "hf_datasets_ok": sum(1 for x in ds_res if x["ok"]),
            "hf_models_ok": sum(1 for x in model_res if x["ok"]),
            "github_ok": sum(1 for x in gh_res if x["ok"]),
        },
        "pypi_packages": pypi_res,
        "npm_packages": npm_res,
        "huggingface_datasets": ds_res,
        "huggingface_models": model_res,
        "github_repositories": gh_res,
    }

    OUT_JSON.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    # Generate Markdown reference so Local RAG Brain indexes live internet data automatically
    md_lines: List[str] = [
        "# UNIFORGE Live Open-Source Internet Collection",
        "",
        f"Synced live from **PyPI**, **npm**, **Hugging Face Hub**, and **GitHub** in `{payload['duration_sec']}s`.",
        "",
        "## 1. Live Python (PyPI) Open-Source Packages",
        "| Package | Latest Version | Summary |",
        "| --- | --- | --- |",
    ]
    for p in pypi_res:
        if p["ok"]:
            md_lines.append(f"| `{p['name']}` | `{p['version']}` | {p['summary'].replace('|', '/')} |")

    md_lines += [
        "",
        "## 2. Live JavaScript / TypeScript (npm) Packages",
        "| Package | Latest Version | License | Description |",
        "| --- | --- | --- | --- |",
    ]
    for p in npm_res:
        if p["ok"]:
            md_lines.append(f"| `{p['name']}` | `{p['version']}` | `{p['license']}` | {p['description'].replace('|', '/')} |")

    md_lines += [
        "",
        "## 3. Live Hugging Face Open-Source AI Models",
        "| Model ID | Pipeline | Downloads | Likes |",
        "| --- | --- | --- | --- |",
    ]
    for m in model_res:
        if m["ok"]:
            md_lines.append(f"| `{m['id']}` | `{m['pipeline_tag']}` | {m['downloads']:,} | {m['likes']:,} |")

    md_lines += [
        "",
        "## 4. Live Hugging Face Open-Source Datasets",
        "| Dataset ID | Downloads | Likes |",
        "| --- | --- | --- |",
    ]
    for d in ds_res:
        if d["ok"]:
            md_lines.append(f"| `{d['id']}` | {d['downloads']:,} | {d['likes']:,} |")

    md_lines += [
        "",
        "## 5. Live GitHub Core Ecosystem Repositories",
        "| Repository | Stars | Forks | Language | License |",
        "| --- | --- | --- | --- | --- |",
    ]
    for g in gh_res:
        if g["ok"]:
            md_lines.append(f"| [{g['repo']}]({g['url']}) | {g['stars']:,} | {g['forks']:,} | `{g['language']}` | `{g['license']}` |")

    OUT_MD.write_text("\n".join(md_lines) + "\n", encoding="utf-8")
    print(f"[OK] Synced live open-source hub -> {OUT_JSON.name} & {OUT_MD.name}")
    print(json.dumps(payload["counts"], indent=2))
    return payload


if __name__ == "__main__":
    run_sync()

