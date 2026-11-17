"""
UNIFORGE Cognitive Brain Engine
Unifies 5 core autonomous intelligence pillars into one persistent operating service:
  1. Long-Term Brain Memory (SQLite ACID episodic/semantic/crawled memory with relevance recall)
  2. Modular Skills Registry (8 built-in + custom toggleable engineering skills)
  3. Live Internet Web Crawler & Open Web Research (clean HTML parser, metadata & link extraction)
  4. Full Disk-Backed Project Handler (create, inspect, read/write files safely, LSP-check workspaces)
  5. Multi-LLM Cognitive Orchestrator (Memory + Skills + Web Crawl + RAG + Project -> Multi-Provider LLM)
"""

import json
import re
import sqlite3
import threading
import time
import urllib.parse
import urllib.request
import uuid
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Dict, List, Optional

from core_os_layer import STATE_DB_PATH, create_project, publish_event
from lsp_service import analyze_diagnostics
from rag_brain_service import query_rag_brain

HUB_ROOT = Path(__file__).resolve().parents[2]
PROJECTS_WORKSPACE_DIR = HUB_ROOT / "workspaces" / "projects"
_LOCK = threading.Lock()

DEFAULT_SKILLS = [
    {
        "id": "fullstack-architect",
        "name": "Full-Stack Microservices Architect",
        "category": "architecture",
        "enabled": 1,
        "instructions": "Design minimal, non-bloated polyglot architectures with clean API boundaries, PostgreSQL pgvector, Redis, and Docker Compose.",
    },
    {
        "id": "zero-trust-security",
        "name": "Zero-Trust Security Auditor",
        "category": "security",
        "enabled": 1,
        "instructions": "Enforce non-root containers (UID 65534), read-only filesystems, zero hardcoded secrets, and explicit RBAC permission checks.",
    },
    {
        "id": "rag-knowledge-researcher",
        "name": "Local RAG & Wiki Researcher",
        "category": "knowledge",
        "enabled": 1,
        "instructions": "Ground architectural answers in UNIFORGE's 60-profile Universal Wiki, local cheatsheets, and long-term Brain Memory.",
    },
    {
        "id": "web-research-crawler",
        "name": "Live Internet Web Crawler",
        "category": "research",
        "enabled": 1,
        "instructions": "Automatically fetch live documentation URLs, extract structured headings and facts, and persist key knowledge to Brain Memory.",
    },
    {
        "id": "react-ui-craftsman",
        "name": "Modern React & Design Craftsman",
        "category": "frontend",
        "enabled": 1,
        "instructions": "Craft responsive dark-glass UIs with clear visual hierarchy, accessible keyboard navigation, and zero broken layouts.",
    },
    {
        "id": "project-lifecycle-handler",
        "name": "Workspace Project Handler",
        "category": "engineering",
        "enabled": 1,
        "instructions": "Manage project directories safely on disk, validate syntax via LSP/AST before saving, and maintain clean Git structure.",
    },
    {
        "id": "sre-self-healer",
        "name": "Self-Healing SRE Troubleshooter",
        "category": "devops",
        "enabled": 1,
        "instructions": "Diagnose runtime stack traces and CI failures immediately and synthesize minimal verified remediation patches.",
    },
    {
        "id": "multi-cloud-deployer",
        "name": "One-Click Multi-Cloud Deployer",
        "category": "cloud",
        "enabled": 1,
        "instructions": "Generate zero-config production deployments targeting GCP Cloud Run, AWS App Runner, Cloudflare Pages, and Kubernetes Helm.",
    },
]


def _conn() -> sqlite3.Connection:
    STATE_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    c = sqlite3.connect(str(STATE_DB_PATH), check_same_thread=False)
    c.row_factory = sqlite3.Row
    return c


def init_cognitive_brain_tables() -> None:
    with _LOCK:
        c = _conn()
        try:
            c.executescript(
                """
                CREATE TABLE IF NOT EXISTS brain_memories (
                    id TEXT PRIMARY KEY,
                    namespace TEXT NOT NULL DEFAULT 'global',
                    category TEXT NOT NULL DEFAULT 'semantic',
                    content TEXT NOT NULL,
                    tags TEXT NOT NULL DEFAULT '',
                    importance INTEGER NOT NULL DEFAULT 5,
                    created_at INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS brain_skills (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL DEFAULT 'general',
                    enabled INTEGER NOT NULL DEFAULT 1,
                    instructions TEXT NOT NULL,
                    updated_at INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS web_crawl_cache (
                    id TEXT PRIMARY KEY,
                    url TEXT UNIQUE NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    excerpt TEXT NOT NULL,
                    headings_json TEXT NOT NULL,
                    links_count INTEGER NOT NULL DEFAULT 0,
                    crawled_at INTEGER NOT NULL
                );
                """
            )
            now = int(time.time())
            for sk in DEFAULT_SKILLS:
                c.execute(
                    "INSERT OR IGNORE INTO brain_skills (id, name, category, enabled, instructions, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                    (sk["id"], sk["name"], sk["category"], sk["enabled"], sk["instructions"], now),
                )
            # Seed 2 foundational OS memories if empty
            if c.execute("SELECT COUNT(*) AS cnt FROM brain_memories").fetchone()["cnt"] == 0:
                c.execute(
                    "INSERT INTO brain_memories (id, namespace, category, content, tags, importance, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (
                        "mem-core-os",
                        "global",
                        "architecture",
                        "UNIFORGE Universal Engineering OS runs Control Plane on :7000, AI Workbench v2 on :5173, React Console on :3000, PostgreSQL pgvector on :5432, and Redis on :6379.",
                        "uniforge,architecture,ports",
                        10,
                        now,
                    ),
                )
                c.execute(
                    "INSERT INTO brain_memories (id, namespace, category, content, tags, importance, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (
                        "mem-brand-rule",
                        "global",
                        "preference",
                        "Always build under 100% UNIFORGE brand using native <uniforgeArtifact> and <uniforgeAction> tags; never modify external bin/ folders.",
                        "brand,rules,workbench",
                        10,
                        now,
                    ),
                )
            c.commit()
        finally:
            c.close()


init_cognitive_brain_tables()


# ---------------------------------------------------------------------------
# 1. Persistent Long-Term Brain Memory
# ---------------------------------------------------------------------------
def remember_memory(
    content: str,
    category: str = "semantic",
    tags: str = "",
    namespace: str = "global",
    importance: int = 5,
) -> Dict[str, Any]:
    text = (content or "").strip()
    if not text:
        return {"ok": False, "error": "Memory content cannot be empty."}
    item = {
        "id": f"mem-{uuid.uuid4().hex[:8]}",
        "namespace": namespace.strip() or "global",
        "category": category.strip() or "semantic",
        "content": text,
        "tags": tags.strip(),
        "importance": min(max(int(importance), 1), 10),
        "created_at": int(time.time()),
    }
    with _LOCK:
        c = _conn()
        try:
            c.execute(
                "INSERT INTO brain_memories (id, namespace, category, content, tags, importance, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (item["id"], item["namespace"], item["category"], item["content"], item["tags"], item["importance"], item["created_at"]),
            )
            c.commit()
        finally:
            c.close()
    publish_event("brain.memory_stored", "cognitive-brain", {"id": item["id"], "category": item["category"]}, actor="brain")
    return {"ok": True, "memory": item}


def recall_memories(query: str = "", namespace: str = "", limit: int = 12) -> Dict[str, Any]:
    with _LOCK:
        c = _conn()
        try:
            if namespace:
                rows = c.execute(
                    "SELECT * FROM brain_memories WHERE namespace = ? ORDER BY importance DESC, created_at DESC",
                    (namespace,),
                ).fetchall()
            else:
                rows = c.execute("SELECT * FROM brain_memories ORDER BY importance DESC, created_at DESC").fetchall()
            items = [dict(r) for r in rows]
        finally:
            c.close()

    q = (query or "").strip().lower()
    if q:
        terms = [t for t in re.findall(r"[a-z0-9_-]{2,}", q)]
        scored = []
        for it in items:
            hay = f"{it['content']} {it['tags']} {it['category']}".lower()
            hits = sum(1 for t in terms if t in hay)
            if hits > 0 or q in hay:
                scored.append((hits * 10 + it["importance"], it))
        scored.sort(key=lambda pair: pair[0], reverse=True)
        matched = [pair[1] for pair in scored[:limit]]
        return {"count": len(matched), "total_stored": len(items), "memories": matched}

    return {"count": len(items[:limit]), "total_stored": len(items), "memories": items[:limit]}


def forget_memory(memory_id: str) -> Dict[str, Any]:
    with _LOCK:
        c = _conn()
        try:
            cur = c.execute("DELETE FROM brain_memories WHERE id = ?", (memory_id,))
            c.commit()
            deleted = cur.rowcount > 0
        finally:
            c.close()
    return {"ok": deleted, "id": memory_id}


# ---------------------------------------------------------------------------
# 2. Modular Skills System
# ---------------------------------------------------------------------------
def list_skills(only_enabled: bool = False) -> Dict[str, Any]:
    with _LOCK:
        c = _conn()
        try:
            sql = "SELECT * FROM brain_skills WHERE enabled = 1 ORDER BY category, name" if only_enabled else "SELECT * FROM brain_skills ORDER BY category, name"
            rows = [dict(r) for r in c.execute(sql).fetchall()]
        finally:
            c.close()
    for r in rows:
        r["enabled"] = bool(r["enabled"])
    return {"count": len(rows), "skills": rows}


def upsert_skill(skill_id: str, name: str, instructions: str, category: str = "custom", enabled: bool = True) -> Dict[str, Any]:
    sid = re.sub(r"[^a-z0-9-]+", "-", (skill_id or name).lower()).strip("-")[:40]
    if not sid or not instructions.strip():
        return {"ok": False, "error": "Skill id/name and instructions are required."}
    now = int(time.time())
    with _LOCK:
        c = _conn()
        try:
            c.execute(
                "INSERT OR REPLACE INTO brain_skills (id, name, category, enabled, instructions, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                (sid, name.strip() or sid, category.strip() or "custom", 1 if enabled else 0, instructions.strip(), now),
            )
            c.commit()
        finally:
            c.close()
    publish_event("brain.skill_updated", "cognitive-brain", {"skill_id": sid, "enabled": enabled}, actor="admin")
    return {"ok": True, "skill": {"id": sid, "name": name, "category": category, "enabled": enabled, "instructions": instructions}}


def toggle_skill(skill_id: str, enabled: bool) -> Dict[str, Any]:
    with _LOCK:
        c = _conn()
        try:
            cur = c.execute(
                "UPDATE brain_skills SET enabled = ?, updated_at = ? WHERE id = ?",
                (1 if enabled else 0, int(time.time()), skill_id),
            )
            c.commit()
            updated = cur.rowcount > 0
        finally:
            c.close()
    return {"ok": updated, "id": skill_id, "enabled": enabled}


# ---------------------------------------------------------------------------
# 3. Live Internet Web Crawler & Open Web Search
# ---------------------------------------------------------------------------
class _CleanHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self._skip = 0
        self._in_title = False
        self._heading_tag: Optional[str] = None
        self.title = ""
        self.description = ""
        self.headings: List[str] = []
        self.text_parts: List[str] = []
        self.links: List[str] = []

    def handle_starttag(self, tag: str, attrs: List[tuple]):
        t = tag.lower()
        attr_map = dict(attrs)
        if t in ("script", "style", "noscript", "svg"):
            self._skip += 1
            return
        if t == "title":
            self._in_title = True
        elif t in ("h1", "h2", "h3"):
            self._heading_tag = t
        elif t == "meta" and attr_map.get("name", "").lower() == "description":
            self.description = (attr_map.get("content") or "").strip()
        elif t == "a" and attr_map.get("href"):
            href = attr_map["href"].strip()
            if href.startswith(("http://", "https://")):
                self.links.append(href)

    def handle_endtag(self, tag: str):
        t = tag.lower()
        if t in ("script", "style", "noscript", "svg") and self._skip > 0:
            self._skip -= 1
        elif t == "title":
            self._in_title = False
        elif t == self._heading_tag:
            self._heading_tag = None

    def handle_data(self, data: str):
        if self._skip > 0:
            return
        clean = " ".join(data.split())
        if not clean:
            return
        if self._in_title:
            self.title += (" " if self.title else "") + clean
        if self._heading_tag and len(self.headings) < 25:
            self.headings.append(clean[:120])
        self.text_parts.append(clean)


def crawl_web_url(url: str, save_to_memory: bool = True, timeout_sec: float = 10.0) -> Dict[str, Any]:
    clean_url = (url or "").strip()
    if not clean_url.startswith(("http://", "https://")):
        return {"ok": False, "error": "URL must begin with http:// or https://"}

    start = time.perf_counter()
    try:
        req = urllib.request.Request(
            clean_url,
            headers={
                "User-Agent": "UNIFORGE-WebCrawler/2.1 (+https://github.com/1nsharma-labs/Universal-Engineering-OS)",
                "Accept": "text/html,application/json,text/plain;q=0.9,*/*;q=0.8",
            },
        )
        with urllib.request.urlopen(req, timeout=min(max(timeout_sec, 2.0), 20.0)) as resp:
            ctype = resp.headers.get("Content-Type", "")
            raw_bytes = resp.read(250000)
            decoded = raw_bytes.decode("utf-8", errors="replace")

        if "json" in ctype.lower():
            title = clean_url
            desc = "JSON API payload"
            headings: List[str] = []
            excerpt = decoded[:3000]
            links: List[str] = []
        else:
            parser = _CleanHTMLParser()
            parser.feed(decoded)
            title = (parser.title or clean_url)[:160]
            desc = parser.description[:300]
            headings = parser.headings[:15]
            excerpt = " ".join(parser.text_parts)[:3500]
            links = list(dict.fromkeys(parser.links))[:25]

        now = int(time.time())
        crawl_id = f"crw-{uuid.uuid4().hex[:8]}"
        with _LOCK:
            c = _conn()
            try:
                c.execute(
                    "INSERT OR REPLACE INTO web_crawl_cache (id, url, title, description, excerpt, headings_json, links_count, crawled_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    (crawl_id, clean_url, title, desc, excerpt, json.dumps(headings), len(links), now),
                )
                c.commit()
            finally:
                c.close()

        saved_mem = None
        if save_to_memory and excerpt:
            summary = f"[Web Crawl: {title} ({clean_url})] {desc or excerpt[:320]}"
            saved_mem = remember_memory(summary, category="crawled_fact", tags="webcrawl,internet", importance=7)

        publish_event("brain.web_crawled", "web-crawler", {"url": clean_url, "title": title, "links": len(links)}, actor="brain")
        return {
            "ok": True,
            "id": crawl_id,
            "url": clean_url,
            "title": title,
            "description": desc,
            "headings": headings,
            "excerpt": excerpt[:1800],
            "links": links,
            "duration_ms": round((time.perf_counter() - start) * 1000, 2),
            "saved_to_memory": bool(saved_mem and saved_mem.get("ok")),
        }
    except Exception as exc:
        return {"ok": False, "url": clean_url, "error": str(exc)}


def search_open_web(query: str) -> Dict[str, Any]:
    """Performs live zero-key open web lookup via DuckDuckGo Instant Answer + Wikipedia OpenSearch API."""
    q = (query or "").strip()
    if not q:
        return {"ok": False, "error": "Query cannot be empty."}
    results: List[Dict[str, str]] = []
    encoded = urllib.parse.quote_plus(q)

    # 1. DuckDuckGo Instant Answer JSON API
    try:
        req = urllib.request.Request(
            f"https://api.duckduckgo.com/?q={encoded}&format=json&no_html=1&skip_disambig=1",
            headers={"User-Agent": "UNIFORGE-WebSearch/2.1"},
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            ddg = json.loads(resp.read().decode("utf-8", errors="replace"))
            if ddg.get("AbstractText"):
                results.append({
                    "source": "DuckDuckGo",
                    "title": ddg.get("Heading") or q,
                    "snippet": ddg["AbstractText"][:320],
                    "url": ddg.get("AbstractURL", ""),
                })
            for rt in (ddg.get("RelatedTopics") or [])[:4]:
                if isinstance(rt, dict) and rt.get("Text"):
                    results.append({
                        "source": "DuckDuckGo",
                        "title": rt["Text"].split(" - ")[0][:80],
                        "snippet": rt["Text"][:240],
                        "url": rt.get("FirstURL", ""),
                    })
    except Exception:
        pass

    # 2. Wikipedia OpenSearch API
    try:
        req = urllib.request.Request(
            f"https://en.wikipedia.org/w/api.php?action=opensearch&search={encoded}&limit=4&namespace=0&format=json",
            headers={"User-Agent": "UNIFORGE-WebSearch/2.1"},
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            wiki = json.loads(resp.read().decode("utf-8", errors="replace"))
            titles, descs, urls = wiki[1], wiki[2], wiki[3]
            for t, d, u in zip(titles, descs, urls):
                results.append({"source": "Wikipedia", "title": t, "snippet": d or t, "url": u})
    except Exception:
        pass

    return {"ok": True, "query": q, "count": len(results), "results": results}


def list_crawled_pages(limit: int = 15) -> Dict[str, Any]:
    with _LOCK:
        c = _conn()
        try:
            rows = [dict(r) for r in c.execute("SELECT id, url, title, description, links_count, crawled_at FROM web_crawl_cache ORDER BY crawled_at DESC LIMIT ?", (limit,)).fetchall()]
        finally:
            c.close()
    return {"count": len(rows), "pages": rows}


# ---------------------------------------------------------------------------
# 4. Full Disk-Backed Project Handler
# ---------------------------------------------------------------------------
def _safe_project_dir(slug: str) -> Path:
    clean_slug = re.sub(r"[^a-z0-9-]+", "-", (slug or "").lower()).strip("-")[:48]
    if not clean_slug:
        raise ValueError("Invalid project slug.")
    target = (PROJECTS_WORKSPACE_DIR / clean_slug).resolve()
    if not str(target).startswith(str(PROJECTS_WORKSPACE_DIR.resolve())):
        raise ValueError("Path traversal blocked.")
    return target


def create_managed_project(name: str, stack: str = "React + FastAPI", files: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
    slug = re.sub(r"[^a-z0-9-]+", "-", name.lower()).strip("-")[:40] or f"proj-{uuid.uuid4().hex[:6]}"
    proj_dir = _safe_project_dir(slug)
    proj_dir.mkdir(parents=True, exist_ok=True)

    initial_files = files or {
        "README.md": f"# {name}\n\nManaged by UNIFORGE Project Handler.\nStack: `{stack}`\n",
        "uniforge.project.json": json.dumps({"name": name, "slug": slug, "stack": stack, "created_at": int(time.time())}, indent=2) + "\n",
    }

    written = []
    for rel_path, content in initial_files.items():
        safe_rel = Path(rel_path.lstrip("/\\"))
        dest = (proj_dir / safe_rel).resolve()
        if not str(dest).startswith(str(proj_dir)):
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(content, encoding="utf-8")
        written.append(str(safe_rel).replace("\\", "/"))

    create_project(name=name, stack=stack, repo_url=f"workspace://projects/{slug}", owner_role="admin")
    remember_memory(f"Created managed project '{name}' (slug={slug}, stack={stack}, files={len(written)}).", category="project_context", tags=f"project,{slug}", importance=8)
    publish_event("project.workspace_created", "project-handler", {"slug": slug, "files": len(written)}, actor="admin")
    return {
        "ok": True,
        "slug": slug,
        "name": name,
        "stack": stack,
        "path": str(proj_dir.relative_to(HUB_ROOT)).replace("\\", "/"),
        "files_written": written,
    }


def list_managed_projects() -> Dict[str, Any]:
    PROJECTS_WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)
    out = []
    for d in sorted(PROJECTS_WORKSPACE_DIR.iterdir()):
        if not d.is_dir():
            continue
        files = [str(f.relative_to(d)).replace("\\", "/") for f in d.rglob("*") if f.is_file()]
        meta = {}
        meta_file = d / "uniforge.project.json"
        if meta_file.exists():
            try:
                meta = json.loads(meta_file.read_text(encoding="utf-8"))
            except Exception:
                pass
        out.append({
            "slug": d.name,
            "name": meta.get("name", d.name),
            "stack": meta.get("stack", "polyglot"),
            "file_count": len(files),
            "files": files[:30],
        })
    return {"count": len(out), "projects": out}


def write_managed_project_file(slug: str, file_path: str, content: str) -> Dict[str, Any]:
    proj_dir = _safe_project_dir(slug)
    proj_dir.mkdir(parents=True, exist_ok=True)
    safe_rel = Path(file_path.lstrip("/\\"))
    dest = (proj_dir / safe_rel).resolve()
    if not str(dest).startswith(str(proj_dir)):
        return {"ok": False, "error": "Invalid file path (path traversal blocked)."}
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content, encoding="utf-8")

    ext = dest.suffix.lower()
    lang = {".py": "python", ".json": "json", ".yml": "yaml", ".yaml": "yaml", ".js": "javascript", ".ts": "typescript"}.get(ext, "")
    diagnostics = analyze_diagnostics(lang, content) if lang else {"valid": True, "error_count": 0}
    return {
        "ok": True,
        "slug": slug,
        "file_path": str(safe_rel).replace("\\", "/"),
        "bytes": len(content.encode("utf-8")),
        "lsp": diagnostics,
    }


def read_managed_project_file(slug: str, file_path: str) -> Dict[str, Any]:
    proj_dir = _safe_project_dir(slug)
    dest = (proj_dir / Path(file_path.lstrip("/\\"))).resolve()
    if not str(dest).startswith(str(proj_dir)) or not dest.exists():
        return {"ok": False, "error": f"File '{file_path}' not found in project '{slug}'."}
    return {"ok": True, "slug": slug, "file_path": file_path, "content": dest.read_text(encoding="utf-8", errors="replace")}


# ---------------------------------------------------------------------------
# 5. Unified Cognitive Brain Think & Act Orchestrator
# ---------------------------------------------------------------------------
def cognitive_brain_think(
    prompt: str,
    provider: str = "uniforge-local",
    model: str = "uniforge-architect-v2",
    chat_mode: str = "build",
    api_key: str = "",
    ollama_url: str = "http://localhost:11434",
    project_slug: str = "",
    auto_crawl_urls: bool = True,
    web_search: bool = False,
    files: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    """
    Full Cognitive Loop:
      Recall Memory + Active Skills + Local RAG + Live Web Crawl/Search + Project Context -> Multi-LLM Router.
    """
    from workbench_llm_service import run_workbench_chat

    t0 = time.perf_counter()

    # 1. Recall long-term memories & local RAG
    recalled = recall_memories(query=prompt, limit=6)
    rag_res = query_rag_brain(prompt, top_k=3)
    active_skills = list_skills(only_enabled=True)["skills"]

    # 2. Auto-crawl any URLs present in the prompt
    crawled_results = []
    if auto_crawl_urls:
        urls = re.findall(r"https?://[^\s)\"'>]+", prompt)
        for u in urls[:2]:
            cr = crawl_web_url(u, save_to_memory=True)
            if cr.get("ok"):
                crawled_results.append(cr)

    # 3. Optional open web search
    web_results = search_open_web(prompt)["results"][:3] if web_search else []

    # 4. Assemble rich cognitive context prefix for the LLM
    ctx_blocks = []
    if active_skills:
        ctx_blocks.append("ACTIVE SKILLS:\n" + "\n".join(f"- {s['name']}: {s['instructions']}" for s in active_skills[:6]))
    if recalled["memories"]:
        ctx_blocks.append("RECALLED BRAIN MEMORIES:\n" + "\n".join(f"- [{m['category']}] {m['content']}" for m in recalled["memories"][:4]))
    if rag_res.get("matches"):
        ctx_blocks.append("LOCAL RAG KNOWLEDGE:\n" + "\n".join(f"- ({m['source']}) {m['snippet'][:180]}" for m in rag_res["matches"][:2]))
    if crawled_results:
        ctx_blocks.append("LIVE CRAWLED WEB DOCS:\n" + "\n".join(f"- {c['title']} ({c['url']}): {c['excerpt'][:350]}" for c in crawled_results))
    if web_results:
        ctx_blocks.append("LIVE WEB SEARCH:\n" + "\n".join(f"- {w['title']}: {w['snippet']}" for w in web_results))

    enriched_prompt = prompt
    if ctx_blocks and provider != "uniforge-local":
        enriched_prompt = f"{prompt}\n\n---\nUNIFORGE COGNITIVE CONTEXT:\n" + "\n\n".join(ctx_blocks)

    llm_out = run_workbench_chat(
        prompt=enriched_prompt,
        provider=provider,
        model=model,
        chat_mode=chat_mode,
        api_key=api_key,
        ollama_url=ollama_url,
        files=files,
    )

    # 5. If a managed project slug is attached, optionally persist generated files into it
    saved_to_project = []
    if project_slug and chat_mode == "build":
        for m in re.finditer(r'<uniforgeAction[^>]*type=["\']file["\'][^>]*filePath=["\']([^"\']+)["\'][^>]*>([\s\S]*?)</uniforgeAction>', llm_out.get("response", ""), re.I):
            fpath, fbody = m.group(1), m.group(2).strip()
            wr = write_managed_project_file(project_slug, fpath, fbody)
            if wr.get("ok"):
                saved_to_project.append(fpath)

    publish_event(
        "brain.think_completed",
        "cognitive-brain",
        {
            "provider": llm_out["provider"],
            "skills_used": len(active_skills),
            "memories_recalled": recalled["count"],
            "urls_crawled": len(crawled_results),
            "project_slug": project_slug or None,
        },
        actor="brain",
    )

    return {
        "ok": True,
        "duration_ms": round((time.perf_counter() - t0) * 1000, 2),
        "cognitive_trace": {
            "active_skills_count": len(active_skills),
            "memories_recalled": recalled["memories"],
            "rag_sources": [m["source"] for m in rag_res.get("matches", [])],
            "crawled_urls": [{"url": c["url"], "title": c["title"]} for c in crawled_results],
            "web_search_hits": web_results,
            "saved_to_project_files": saved_to_project,
        },
        **llm_out,
    }

