#!/usr/bin/env bash
# ==============================================================================
# Universal-Dev-Hub: Hybrid Sync (Local Workstation <-> Self-Hosted Cloud)
# ==============================================================================

set -euo pipefail

MODE="${1:-status}"
CLOUD_HOST="${CLOUD_HUB_HOST:-}"
REMOTE_DIR="${CLOUD_HUB_DIR:-/opt/Universal-Dev-Hub}"

case "$MODE" in
  status)
    echo "=== Universal-Dev-Hub Hybrid Sync Status ==="
    echo "Local Mode      : ACTIVE (Offline-First)"
    echo "Self-Hosted Host: ${CLOUD_HOST:-Not configured (set CLOUD_HUB_HOST in .env)}"
    echo "Sync Config     : 00-universal-control-plane/hybrid-sync/hybrid-sync.config.yaml"
    ;;
  push)
    if [ -z "$CLOUD_HOST" ]; then
      echo "Error: Set CLOUD_HUB_HOST before running hybrid push."
      exit 1
    fi
    echo "Syncing Universal-Dev-Hub configs & code to $CLOUD_HOST:$REMOTE_DIR (excluding secrets)..."
    rsync -avz --exclude '.env' --exclude 'node_modules' --exclude '.git' --exclude '__pycache__' ./ "$CLOUD_HOST:$REMOTE_DIR/"
    echo "[OK] Hybrid push complete."
    ;;
  pull)
    if [ -z "$CLOUD_HOST" ]; then
      echo "Error: Set CLOUD_HUB_HOST before running hybrid pull."
      exit 1
    fi
    echo "Pulling updates from $CLOUD_HOST:$REMOTE_DIR..."
    rsync -avz --exclude '.env' --exclude 'node_modules' --exclude '.git' "$CLOUD_HOST:$REMOTE_DIR/" ./
    echo "[OK] Hybrid pull complete."
    ;;
  *)
    echo "Usage: bash sync-hybrid.sh [status|push|pull]"
    exit 1
    ;;
esac
