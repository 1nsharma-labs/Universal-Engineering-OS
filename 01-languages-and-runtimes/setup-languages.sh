#!/usr/bin/env bash
# ==============================================================================
# Universal Dev Hub: Polyglot Language & Runtime Verification Script
# Supports: Linux, macOS, WSL2
# ==============================================================================

set -euo pipefail

COLOR_RESET="\033[0m"
COLOR_GREEN="\033[1;32m"
COLOR_YELLOW="\033[1;33m"
COLOR_RED="\033[1;31m"
COLOR_BLUE="\033[1;34m"

log_info() { echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"; }
log_success() { echo -e "${COLOR_GREEN}[OK]${COLOR_RESET} $1"; }
log_warn() { echo -e "${COLOR_YELLOW}[WARN]${COLOR_RESET} $1"; }
log_error() { echo -e "${COLOR_RED}[ERROR]${COLOR_RESET} $1"; }

check_tool() {
  local tool_cmd="$1"
  local display_name="$2"
  local version_flag="${3:---version}"

  if command -v "$tool_cmd" >/dev/null 2>&1; then
    local version_output
    version_output=$("$tool_cmd" $version_flag 2>&1 | head -n 1 || true)
    log_success "$display_name is installed: $version_output"
    return 0
  else
    log_warn "$display_name ($tool_cmd) is NOT detected in PATH."
    return 1
  fi
}

echo -e "${COLOR_BLUE}==============================================================================${COLOR_RESET}"
echo -e "${COLOR_GREEN}      Universal Dev Hub - Language & Runtime Toolchain Audit         ${COLOR_RESET}"
echo -e "${COLOR_BLUE}==============================================================================${COLOR_RESET}"

missing_count=0

log_info "Verifying Polyglot Compilers & Virtual Machines..."
check_tool java "Java JDK" "-version" || ((missing_count++))
check_tool mvn "Apache Maven" "--version" || ((missing_count++))
check_tool gradle "Gradle Build Tool" "--version" || ((missing_count++))
check_tool node "Node.js Engine" "-v" || ((missing_count++))
check_tool npm "NPM Package Manager" "-v" || ((missing_count++))
check_tool pnpm "PNPM Package Manager" "-v" || ((missing_count++))
check_tool python3 "Python 3 Interpreter" "--version" || ((missing_count++))
check_tool pip3 "Pip Package Manager" "--version" || ((missing_count++))
check_tool rustc "Rust Compiler" "--version" || ((missing_count++))
check_tool cargo "Cargo Package Manager" "--version" || ((missing_count++))
check_tool go "Go Compiler" "version" || ((missing_count++))
check_tool g++ "GNU C++ Compiler" "--version" || ((missing_count++))
check_tool php "PHP CLI" "-v" || ((missing_count++))
check_tool ruby "Ruby Runtime" "-v" || ((missing_count++))

log_info "Verifying Containerization & Orchestration Engines..."
check_tool docker "Docker Engine" "--version" || ((missing_count++))
check_tool docker-compose "Docker Compose" "version" || check_tool "docker compose" "Docker Compose Plugin" "version" || true

echo -e "${COLOR_BLUE}------------------------------------------------------------------------------${COLOR_RESET}"

if [ "$missing_count" -gt 0 ]; then
  log_warn "Detected $missing_count missing or unconfigured toolchain components."
  log_info "Recommendation: To manage all versions seamlessly without system pollution,"
  log_info "install 'mise' (https://mise.jdx.dev) and run:"
  echo -e "   curl https://mise.run | sh"
  echo -e "   mise install"
else
  log_success "All primary polyglot runtimes and package managers are ready!"
fi
