"""
UNIFORGE Operational Studio — Live Embedded API Execution Engine
Executes HTTP/REST/GraphQL requests directly from the Control Plane with
timing metrics, response headers, and parsed JSON/text payloads.
"""

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, Optional

ALLOWED_METHODS = {"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
MAX_RESPONSE_BYTES = 262144  # 256 KB preview limit


def execute_api_request(
    url: str,
    method: str = "GET",
    headers: Optional[Dict[str, str]] = None,
    body: Optional[str] = None,
    timeout_sec: float = 10.0,
) -> Dict[str, Any]:
    clean_url = (url or "").strip()
    clean_method = (method or "GET").strip().upper()

    if not clean_url.startswith(("http://", "https://")):
        return {
            "ok": False,
            "error": "URL must begin with http:// or https://",
            "status_code": 0,
            "duration_ms": 0,
        }

    if clean_method not in ALLOWED_METHODS:
        return {
            "ok": False,
            "error": f"Unsupported HTTP method: {clean_method}",
            "status_code": 0,
            "duration_ms": 0,
        }

    req_headers = {"User-Agent": "UNIFORGE-API-Studio/1.0"}
    if headers:
        for k, v in headers.items():
            if k and v is not None:
                req_headers[str(k)] = str(v)

    data_bytes = None
    if body and clean_method not in ("GET", "HEAD"):
        data_bytes = body.encode("utf-8")
        if "Content-Type" not in req_headers and "content-type" not in req_headers:
            req_headers["Content-Type"] = "application/json"

    req = urllib.request.Request(clean_url, data=data_bytes, headers=req_headers, method=clean_method)
    start = time.perf_counter()

    try:
        with urllib.request.urlopen(req, timeout=min(max(timeout_sec, 1.0), 30.0)) as resp:
            raw = resp.read(MAX_RESPONSE_BYTES)
            duration_ms = round((time.perf_counter() - start) * 1000, 2)
            text = raw.decode("utf-8", errors="replace")
            resp_headers = dict(resp.headers.items())
            parsed_json = None
            try:
                parsed_json = json.loads(text)
            except Exception:
                pass
            return {
                "ok": 200 <= resp.status < 400,
                "url": clean_url,
                "method": clean_method,
                "status_code": resp.status,
                "reason": resp.reason,
                "duration_ms": duration_ms,
                "size_bytes": len(raw),
                "headers": resp_headers,
                "body": text,
                "json": parsed_json,
            }
    except urllib.error.HTTPError as err:
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        err_body = err.read(MAX_RESPONSE_BYTES).decode("utf-8", errors="replace")
        return {
            "ok": False,
            "url": clean_url,
            "method": clean_method,
            "status_code": err.code,
            "reason": str(err.reason),
            "duration_ms": duration_ms,
            "size_bytes": len(err_body.encode("utf-8")),
            "headers": dict(err.headers.items()) if err.headers else {},
            "body": err_body,
            "json": None,
        }
    except Exception as exc:
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "ok": False,
            "url": clean_url,
            "method": clean_method,
            "status_code": 0,
            "error": str(exc),
            "duration_ms": duration_ms,
        }

