#!/usr/bin/env bash
# ==============================================================================
# Universal Dev Hub: Automated DevSecOps Security Audit Runner
# Runs: Gitleaks (Secrets), Semgrep (SAST), Trivy (Vulnerabilities)
# ==============================================================================

set -euo pipefail

COLOR_RESET="\033[0m"
COLOR_GREEN="\033[1;32m"
COLOR_YELLOW="\033[1;33m"
COLOR_RED="\033[1;31m"
COLOR_BLUE="\033[1;34m"

echo -e "${COLOR_BLUE}==============================================================================${COLOR_RESET}"
echo -e "${COLOR_GREEN}           Universal Dev Hub - Multi-Engine Security Audit            ${COLOR_RESET}"
echo -e "${COLOR_BLUE}==============================================================================${COLOR_RESET}"

REPORT_DIR="$(dirname "$0")/audit-reports"
mkdir -p "$REPORT_DIR"

# 1. Gitleaks Secret Detection
echo -e "${COLOR_BLUE}[1/3] Running Gitleaks Secret Scan...${COLOR_RESET}"
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect --source . --verbose --report-path "$REPORT_DIR/gitleaks-report.json" || true
  echo -e "${COLOR_GREEN}[OK] Gitleaks scan completed.${COLOR_RESET}"
else
  echo -e "${COLOR_YELLOW}[SKIP] gitleaks CLI not installed. Running via Docker...${COLOR_RESET}"
  docker run --rm -v "$(pwd):/path" zricethezav/gitleaks:latest detect --source="/path" --verbose || true
fi

# 2. Semgrep Static Application Security Testing (SAST)
echo -e "${COLOR_BLUE}[2/3] Running Semgrep Code Analysis...${COLOR_RESET}"
if command -v semgrep >/dev/null 2>&1; then
  semgrep scan --config auto --output "$REPORT_DIR/semgrep-report.json" --json . || true
  echo -e "${COLOR_GREEN}[OK] Semgrep analysis completed.${COLOR_RESET}"
else
  echo -e "${COLOR_YELLOW}[SKIP] Semgrep CLI not installed. (pip install semgrep)${COLOR_RESET}"
fi

# 3. Trivy Filesystem Vulnerability & Misconfig Scan
echo -e "${COLOR_BLUE}[3/3] Running Trivy Filesystem & Container Scan...${COLOR_RESET}"
if command -v trivy >/dev/null 2>&1; then
  trivy fs --severity HIGH,CRITICAL . || true
else
  echo -e "${COLOR_YELLOW}[SKIP] Trivy CLI not installed. Running via Docker...${COLOR_RESET}"
  docker run --rm -v "$(pwd):/app" aquasec/trivy:latest fs --severity HIGH,CRITICAL /app || true
fi

echo -e "${COLOR_GREEN}Security audit sweep complete. Reports stored in: $REPORT_DIR${COLOR_RESET}"
