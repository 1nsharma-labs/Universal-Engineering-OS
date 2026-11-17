"""
Zero-Trust Sandboxed Execution Engine
Builds hardened Docker execution specs so untrusted/generated user code
NEVER executes directly on the host OS or main control-plane server.
"""

import shutil
import subprocess
from typing import Any, Dict, List


RUNTIME_IMAGES = {
    "python": ("python:3.11-alpine", ["python3", "-c"]),
    "node": ("node:20-alpine", ["node", "-e"]),
    "go": ("golang:1.22-alpine", ["sh", "-c"]),
    "bash": ("alpine:3.19", ["sh", "-c"]),
}


def build_sandbox_command(language: str, code: str, memory: str = "256m", cpus: str = "0.5") -> Dict[str, Any]:
    lang = language.lower().strip()
    if lang not in RUNTIME_IMAGES:
        raise ValueError(f"Unsupported sandbox language '{language}'. Supported: {list(RUNTIME_IMAGES.keys())}")

    image, entrypoint = RUNTIME_IMAGES[lang]
    docker_cmd: List[str] = [
        "docker", "run", "--rm",
        "--network", "none",                 # No internet or host LAN access
        "--read-only",                       # Immutable root filesystem
        "--tmpfs", "/tmp:rw,noexec,nosuid,size=32m",
        "--memory", memory,                  # Hard RAM cap
        "--cpus", cpus,                      # Hard CPU cap
        "--pids-limit", "64",                # Prevent fork bombs
        "--cap-drop", "ALL",                 # Drop all Linux kernel capabilities
        "--security-opt", "no-new-privileges:true",
        "--user", "65534:65534",             # Run as unprivileged nobody user
        image,
        *entrypoint,
        code,
    ]
    return {
        "language": lang,
        "image": image,
        "security_policy": {
            "network_disabled": True,
            "read_only_rootfs": True,
            "capabilities_dropped": "ALL",
            "non_root_uid": 65534,
            "memory_limit": memory,
            "cpu_limit": cpus,
            "pids_limit": 64
        },
        "command": docker_cmd
    }


def execute_in_sandbox(language: str, code: str, dry_run: bool = True, timeout_sec: int = 10) -> Dict[str, Any]:
    spec = build_sandbox_command(language, code)
    if dry_run or not shutil.which("docker"):
        spec["executed"] = False
        spec["mode"] = "dry_run_policy_preview" if dry_run else "docker_cli_unavailable"
        return spec

    try:
        proc = subprocess.run(
            spec["command"],
            capture_output=True,
            text=True,
            timeout=timeout_sec,
            check=False,
        )
        spec["executed"] = True
        spec["exit_code"] = proc.returncode
        spec["stdout"] = proc.stdout
        spec["stderr"] = proc.stderr
    except subprocess.TimeoutExpired:
        spec["executed"] = True
        spec["exit_code"] = 124
        spec["stderr"] = f"Sandbox execution terminated after {timeout_sec}s timeout."
    return spec
