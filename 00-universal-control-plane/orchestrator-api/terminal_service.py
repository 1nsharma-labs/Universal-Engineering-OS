"""
UNIFORGE Operational Studio — PTY / Interactive Terminal Execution Service
Supports both stateful REST command execution and live WebSocket terminal sessions.
"""

import asyncio
import os
import platform
import subprocess
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List

HUB_ROOT = Path(__file__).resolve().parents[2]
MAX_OUTPUT_CHARS = 32000
DEFAULT_TIMEOUT_SEC = 15

# In-memory session state tracking working directory & command history
_SESSIONS: Dict[str, Dict[str, Any]] = {}


def get_or_create_session(session_id: str = "") -> Dict[str, Any]:
    sid = session_id or str(uuid.uuid4())[:8]
    if sid not in _SESSIONS:
        _SESSIONS[sid] = {
            "session_id": sid,
            "cwd": str(HUB_ROOT),
            "os": platform.system(),
            "shell": "powershell" if platform.system() == "Windows" else os.environ.get("SHELL", "/bin/sh"),
            "history": [],
            "created_at": time.time(),
        }
    return _SESSIONS[sid]


def execute_terminal_command(command: str, session_id: str = "", timeout: int = DEFAULT_TIMEOUT_SEC) -> Dict[str, Any]:
    """Executes a shell command inside the session working directory with timeout safety."""
    session = get_or_create_session(session_id)
    cmd = (command or "").strip()
    if not cmd:
        return {
            "session_id": session["session_id"],
            "cwd": session["cwd"],
            "exit_code": 0,
            "stdout": "",
            "stderr": "",
            "duration_ms": 0,
        }

    # Handle built-in directory changes persistently across commands
    if cmd == "cd" or cmd.startswith("cd "):
        target = cmd[2:].strip().strip('"').strip("'")
        new_path = Path(HUB_ROOT) if not target else (Path(session["cwd"]) / target).resolve()
        if new_path.exists() and new_path.is_dir():
            session["cwd"] = str(new_path)
            session["history"].append(cmd)
            return {
                "session_id": session["session_id"],
                "cwd": session["cwd"],
                "exit_code": 0,
                "stdout": f"Changed directory to {session['cwd']}\n",
                "stderr": "",
                "duration_ms": 1,
            }
        return {
            "session_id": session["session_id"],
            "cwd": session["cwd"],
            "exit_code": 1,
            "stdout": "",
            "stderr": f"Directory not found: {new_path}\n",
            "duration_ms": 1,
        }

    start = time.perf_counter()
    try:
        proc = subprocess.run(
            cmd,
            shell=True,
            cwd=session["cwd"],
            capture_output=True,
            text=True,
            timeout=min(max(timeout, 1), 30),
        )
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        stdout = (proc.stdout or "")[:MAX_OUTPUT_CHARS]
        stderr = (proc.stderr or "")[:MAX_OUTPUT_CHARS]
        session["history"].append(cmd)
        return {
            "session_id": session["session_id"],
            "cwd": session["cwd"],
            "command": cmd,
            "exit_code": proc.returncode,
            "stdout": stdout,
            "stderr": stderr,
            "duration_ms": duration_ms,
        }
    except subprocess.TimeoutExpired:
        return {
            "session_id": session["session_id"],
            "cwd": session["cwd"],
            "command": cmd,
            "exit_code": 124,
            "stdout": "",
            "stderr": f"Command timed out after {timeout}s.\n",
            "duration_ms": timeout * 1000,
        }
    except Exception as exc:
        return {
            "session_id": session["session_id"],
            "cwd": session["cwd"],
            "command": cmd,
            "exit_code": 1,
            "stdout": "",
            "stderr": f"Terminal execution error: {exc}\n",
            "duration_ms": round((time.perf_counter() - start) * 1000, 2),
        }


async def execute_terminal_async(command: str, session_id: str = "") -> Dict[str, Any]:
    return await asyncio.to_thread(execute_terminal_command, command, session_id)


def list_terminal_sessions() -> List[Dict[str, Any]]:
    return [
        {
            "session_id": s["session_id"],
            "cwd": s["cwd"],
            "os": s["os"],
            "shell": s["shell"],
            "commands_run": len(s["history"]),
        }
        for s in _SESSIONS.values()
    ]

