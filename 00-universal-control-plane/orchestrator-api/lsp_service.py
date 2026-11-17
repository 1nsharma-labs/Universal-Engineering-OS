"""
UNIFORGE Operational Studio — Polyglot Monaco LSP Bridge
Provides real syntax diagnostics, code completions, and formatting for
Python, JSON, YAML, TypeScript/JavaScript, and SQL.
"""

import ast
import json
import re
from typing import Any, Dict, List

COMPLETION_CATALOG: Dict[str, List[Dict[str, str]]] = {
    "python": [
        {"label": "FastAPI", "kind": "Class", "detail": "FastAPI application instance", "insertText": "app = FastAPI(title='UNIFORGE Service')"},
        {"label": "async def", "kind": "Snippet", "detail": "Async coroutine function", "insertText": "async def handler():\n    return {'status': 'ok'}"},
        {"label": "BaseModel", "kind": "Class", "detail": "Pydantic v2 schema model", "insertText": "class Payload(BaseModel):\n    name: str"},
        {"label": "import json", "kind": "Module", "detail": "Python JSON library", "insertText": "import json"},
    ],
    "typescript": [
        {"label": "definePlugin", "kind": "Function", "detail": "@uniforge/plugin-sdk plugin builder", "insertText": "definePlugin({\n  manifest,\n  activate(ctx) {\n    ctx.log('Ready');\n  }\n})"},
        {"label": "interface", "kind": "Keyword", "detail": "TypeScript interface declaration", "insertText": "export interface ServiceConfig {\n  port: number;\n}"},
        {"label": "async function", "kind": "Snippet", "detail": "Async TypeScript function", "insertText": "export async function run(): Promise<void> {\n  \n}"},
    ],
    "sql": [
        {"label": "SELECT pgvector", "kind": "Snippet", "detail": "Cosine similarity vector search", "insertText": "SELECT id, 1 - (embedding <=> $1::vector) AS score\nFROM documents\nORDER BY embedding <=> $1::vector\nLIMIT 10;"},
        {"label": "CREATE INDEX HNSW", "kind": "Snippet", "detail": "pgvector HNSW index", "insertText": "CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);"},
    ],
    "json": [
        {"label": "uniforge-plugin", "kind": "Snippet", "detail": "UNIFORGE Plugin Manifest v1.0.0", "insertText": "{\n  \"schemaVersion\": \"1.0.0\",\n  \"id\": \"@uniforge/my-plugin\",\n  \"name\": \"My Plugin\",\n  \"version\": \"1.0.0\"\n}"},
    ],
}


def analyze_diagnostics(language: str, code: str) -> Dict[str, Any]:
    """Runs language-aware static syntax analysis returning Monaco MarkerData objects."""
    lang = (language or "python").strip().lower()
    diagnostics: List[Dict[str, Any]] = []

    if lang == "python":
        try:
            tree = ast.parse(code)
            # Check for risky eval/exec anti-patterns as security warnings
            for node in ast.walk(tree):
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in ("eval", "exec"):
                    diagnostics.append({
                        "startLineNumber": node.lineno,
                        "startColumn": node.col_offset + 1,
                        "endLineNumber": node.lineno,
                        "endColumn": node.col_offset + 5,
                        "severity": "warning",
                        "source": "uniforge-sec-lsp",
                        "message": f"Security warning: avoid `{node.func.id}()` outside Zero-Trust Docker sandboxes.",
                    })
        except SyntaxError as e:
            diagnostics.append({
                "startLineNumber": e.lineno or 1,
                "startColumn": e.offset or 1,
                "endLineNumber": e.lineno or 1,
                "endColumn": (e.offset or 1) + 4,
                "severity": "error",
                "source": "python-ast-lsp",
                "message": f"SyntaxError: {e.msg}",
            })

    elif lang == "json":
        try:
            json.loads(code)
        except json.JSONDecodeError as e:
            diagnostics.append({
                "startLineNumber": e.lineno,
                "startColumn": e.colno,
                "endLineNumber": e.lineno,
                "endColumn": e.colno + 2,
                "severity": "error",
                "source": "json-lsp",
                "message": e.msg,
            })

    elif lang == "yaml":
        try:
            import yaml
            list(yaml.safe_load_all(code))
        except Exception as e:
            line = getattr(getattr(e, "problem_mark", None), "line", 0) + 1
            col = getattr(getattr(e, "problem_mark", None), "column", 0) + 1
            diagnostics.append({
                "startLineNumber": line,
                "startColumn": col,
                "endLineNumber": line,
                "endColumn": col + 2,
                "severity": "error",
                "source": "yaml-lsp",
                "message": str(e),
            })

    elif lang in ("typescript", "javascript"):
        # Check balanced braces/brackets/parens & detect common issues
        stack: List[tuple] = []
        pairs = {")": "(", "]": "[", "}": "{"}
        for lineno, line in enumerate(code.splitlines(), start=1):
            for col, ch in enumerate(line, start=1):
                if ch in "([{":
                    stack.append((ch, lineno, col))
                elif ch in ")]}":
                    if not stack or stack[-1][0] != pairs[ch]:
                        diagnostics.append({
                            "startLineNumber": lineno,
                            "startColumn": col,
                            "endLineNumber": lineno,
                            "endColumn": col + 1,
                            "severity": "error",
                            "source": "ts-lsp",
                            "message": f"Unmatched closing token '{ch}'.",
                        })
                    else:
                        stack.pop()
            if "console.log(" in line:
                diagnostics.append({
                    "startLineNumber": lineno,
                    "startColumn": line.index("console.log(") + 1,
                    "endLineNumber": lineno,
                    "endColumn": line.index("console.log(") + 12,
                    "severity": "info",
                    "source": "ts-lsp",
                    "message": "Tip: Prefer ctx.log() inside UNIFORGE plugins for structured telemetry.",
                })
        for ch, lineno, col in stack:
            diagnostics.append({
                "startLineNumber": lineno,
                "startColumn": col,
                "endLineNumber": lineno,
                "endColumn": col + 1,
                "severity": "error",
                "source": "ts-lsp",
                "message": f"Unclosed delimiter '{ch}'.",
            })

    elif lang == "sql":
        upper = code.upper()
        if "DELETE FROM" in upper and "WHERE" not in upper:
            diagnostics.append({
                "startLineNumber": 1,
                "startColumn": 1,
                "endLineNumber": 1,
                "endColumn": 12,
                "severity": "warning",
                "source": "sql-safety-lsp",
                "message": "Safety warning: DELETE statement missing WHERE clause.",
            })

    error_count = sum(1 for d in diagnostics if d["severity"] == "error")
    return {
        "language": lang,
        "valid": error_count == 0,
        "error_count": error_count,
        "diagnostic_count": len(diagnostics),
        "diagnostics": diagnostics,
    }


def format_code(language: str, code: str) -> Dict[str, Any]:
    lang = (language or "python").strip().lower()
    if lang == "json":
        try:
            formatted = json.dumps(json.loads(code), indent=2) + "\n"
            return {"ok": True, "language": lang, "formatted": formatted}
        except Exception as exc:
            return {"ok": False, "language": lang, "formatted": code, "error": str(exc)}

    if lang == "sql":
        keywords = ["select", "from", "where", "order by", "group by", "limit", "insert into", "values", "create table", "create index"]
        formatted = code
        for kw in keywords:
            formatted = re.sub(rf"\b{kw}\b", kw.upper(), formatted, flags=re.IGNORECASE)
        return {"ok": True, "language": lang, "formatted": formatted.strip() + "\n"}

    # Clean trailing whitespace and normalize line endings
    lines = [ln.rstrip() for ln in code.replace("\r\n", "\n").split("\n")]
    return {"ok": True, "language": lang, "formatted": "\n".join(lines).rstrip() + "\n"}


def get_completions(language: str, prefix: str = "") -> Dict[str, Any]:
    lang = (language or "python").strip().lower()
    items = COMPLETION_CATALOG.get(lang, COMPLETION_CATALOG["python"])
    if prefix:
        p = prefix.lower()
        items = [i for i in items if p in i["label"].lower() or p in i["detail"].lower()]
    return {"language": lang, "suggestions": items}

