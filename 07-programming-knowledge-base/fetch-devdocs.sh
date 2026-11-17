#!/usr/bin/env bash
# ==============================================================================
# Fetch Offline Developer Documentation & Cheatsheets for Local RAG
# ==============================================================================

set -euo pipefail

DOCS_DIR="$(dirname "$0")/offline-docs"
mkdir -p "$DOCS_DIR"

echo "=== Fetching Developer References for Local RAG Indexing ==="

fetch_doc() {
  local name="$1"
  local url="$2"
  echo "Downloading $name reference..."
  curl -sSL "$url" -o "$DOCS_DIR/${name}.md" || echo "Warning: Failed to fetch $name"
}

# Pull authoritative standard references
fetch_doc "docker-cheatsheet" "https://raw.githubusercontent.com/wsargent/docker-cheat-sheet/master/README.md"
fetch_doc "awesome-bash" "https://raw.githubusercontent.com/awesome-lists/awesome-bash/master/README.md"

echo "Offline documentation populated in $DOCS_DIR"
