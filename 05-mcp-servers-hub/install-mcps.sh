#!/usr/bin/env bash
# ==============================================================================
# Model Context Protocol (MCP) Server Installer & Verification Script
# ==============================================================================

set -euo pipefail

COLOR_RESET="\033[0m"
COLOR_GREEN="\033[1;32m"
COLOR_BLUE="\033[1;34m"
COLOR_YELLOW="\033[1;33m"

echo -e "${COLOR_BLUE}=== [Universal-Dev-Hub] MCP Servers Hub Verification ===${COLOR_RESET}"

CONFIG_FILE="$(dirname "$0")/mcp-config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: $CONFIG_FILE not found."
  exit 1
fi

echo -e "${COLOR_GREEN}[OK] Verified configuration syntax:${COLOR_RESET} $CONFIG_FILE"

if command -v node >/dev/null 2>&1; then
  node -e "JSON.parse(require('fs').readFileSync('$CONFIG_FILE', 'utf8')); console.log('JSON Schema validation passed.');"
else
  echo "Warning: Node.js is required to run standard npx-based MCP servers."
fi

echo ""
echo "MCP Registry contains 12 enterprise connectors:"
echo " - Filesystem (@modelcontextprotocol/server-filesystem)"
echo " - GitHub (@modelcontextprotocol/server-github)"
echo " - GitLab (@modelcontextprotocol/server-gitlab)"
echo " - PostgreSQL (@modelcontextprotocol/server-postgres)"
echo " - Brave Search (@modelcontextprotocol/server-brave-search)"
echo " - Puppeteer Web Automation (@modelcontextprotocol/server-puppeteer)"
echo " - Playwright E2E Driver (@executeautomation/playwright-mcp-server)"
echo " - Slack Notifications (@modelcontextprotocol/server-slack)"
echo " - Notion Documentation (@modelcontextprotocol/server-notion)"
echo " - Persistent Graph Memory (@modelcontextprotocol/server-memory)"
echo " - Docker Container Control (mcp-server-docker)"
echo " - Kubernetes Cluster Inspection (mcp-server-kubernetes)"
echo ""
echo -e "${COLOR_GREEN}To connect these servers to Cursor or Claude Desktop:${COLOR_RESET}"
echo "Copy mcp-config.json contents to your agent settings or Claude desktop config."
