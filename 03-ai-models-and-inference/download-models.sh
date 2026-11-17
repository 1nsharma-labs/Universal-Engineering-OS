#!/usr/bin/env bash
# ==============================================================================
# Model Downloader CLI for Ollama & HuggingFace
# ==============================================================================

set -euo pipefail

REGISTRY_FILE="$(dirname "$0")/model-registry.json"

show_help() {
  echo "Usage: bash download-models.sh [options]"
  echo ""
  echo "Options:"
  echo "  --list                List curated models in catalog"
  echo "  --pull-ollama <tag>   Pull a specific model into Ollama (e.g. qwen2.5-coder:7b)"
  echo "  --pull-hf <repo_id>   Download HuggingFace repo via huggingface-cli"
  echo "  --default-stack       Pull essential recommended local dev models"
  echo "  --help                Display this manual"
}

list_models() {
  if command -v jq >/dev/null 2>&1; then
    echo "=== Curated LLMs ==="
    jq -r '.models.large_language_models[] | " - \(.name) | Ollama: \(.ollama_tag) | VRAM: \(.vram_recommended_gb)GB"' "$REGISTRY_FILE"
    echo ""
    echo "=== Curated Embeddings ==="
    jq -r '.models.text_embeddings[] | " - \(.name) | Tag: \(.ollama_tag) | Dim: \(.dimension)"' "$REGISTRY_FILE"
  else
    cat "$REGISTRY_FILE"
  fi
}

pull_ollama() {
  local tag="$1"
  echo "Pulling model '$tag' into Ollama container..."
  if docker ps --format '{{.Names}}' | grep -q 'devhub-ollama'; then
    docker exec -it devhub-ollama ollama pull "$tag"
  elif command -v ollama >/dev/null 2>&1; then
    ollama pull "$tag"
  else
    echo "Error: Neither running devhub-ollama container nor local ollama CLI found."
    exit 1
  fi
}

pull_hf() {
  local repo="$1"
  echo "Downloading HuggingFace weights for '$repo'..."
  if command -v huggingface-cli >/dev/null 2>&1; then
    huggingface-cli download "$repo" --local-dir "./models/$repo"
  else
    echo "Error: huggingface-cli not installed. Run: pip install huggingface_hub"
    exit 1
  fi
}

if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

case "$1" in
  --list)
    list_models
    ;;
  --pull-ollama)
    pull_ollama "$2"
    ;;
  --pull-hf)
    pull_hf "$2"
    ;;
  --default-stack)
    echo "Pulling recommended baseline stack: nomic-embed-text & qwen2.5-coder:7b..."
    pull_ollama "nomic-embed-text"
    pull_ollama "qwen2.5-coder:7b"
    ;;
  --help)
    show_help
    ;;
  *)
    echo "Unknown option: $1"
    show_help
    exit 1
    ;;
esac
