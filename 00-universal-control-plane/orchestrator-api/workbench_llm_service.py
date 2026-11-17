"""
UNIFORGE AI Workbench v2 — Multi-Provider LLM Router, Native <uniforgeArtifact> Synthesizer,
Prompt Enhancer, and GitHub Repository Importer.
Supports: UNIFORGE Local Engine (zero-key offline), Ollama (local), OpenAI, Anthropic, Gemini,
DeepSeek, Groq, and OpenRouter.
"""

import base64
import json
import os
import re
import time
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional

from core_os_layer import publish_event
from software_factory_service import run_software_factory

PROVIDERS_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "uniforge-local",
        "name": "UNIFORGE Native Engine (Offline)",
        "requiresKey": False,
        "models": ["uniforge-architect-v2", "uniforge-factory-5layer"],
        "description": "Zero-API-key local multi-file app & microservices generator built into UNIFORGE OS.",
    },
    {
        "id": "ollama",
        "name": "Ollama (Local LLM)",
        "requiresKey": False,
        "defaultBaseUrl": "http://localhost:11434",
        "models": ["qwen2.5-coder:7b", "llama3.2", "deepseek-r1:8b", "codellama:7b"],
        "description": "Private local inference running on your own CPU/GPU via Ollama.",
    },
    {
        "id": "openai",
        "name": "OpenAI",
        "requiresKey": True,
        "envKey": "OPENAI_API_KEY",
        "models": ["gpt-4o", "gpt-4.1", "o3-mini"],
        "description": "OpenAI GPT-4o / GPT-4.1 / o3-mini models.",
    },
    {
        "id": "anthropic",
        "name": "Anthropic Claude",
        "requiresKey": True,
        "envKey": "ANTHROPIC_API_KEY",
        "models": ["claude-3-7-sonnet-latest", "claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"],
        "description": "Anthropic Claude coding & architecture models.",
    },
    {
        "id": "gemini",
        "name": "Google Gemini",
        "requiresKey": True,
        "envKey": "GOOGLE_GENERATIVE_AI_API_KEY",
        "models": ["gemini-2.5-flash", "gemini-2.5-pro"],
        "description": "Google Gemini 2.5 Flash & Pro models.",
    },
    {
        "id": "deepseek",
        "name": "DeepSeek",
        "requiresKey": True,
        "envKey": "DEEPSEEK_API_KEY",
        "models": ["deepseek-chat", "deepseek-reasoner"],
        "description": "DeepSeek V3 / R1 high-efficiency coding models.",
    },
    {
        "id": "groq",
        "name": "Groq",
        "requiresKey": True,
        "envKey": "GROQ_API_KEY",
        "models": ["llama-3.3-70b-versatile", "qwen-2.5-coder-32b"],
        "description": "Ultra-fast LPU inference via Groq.",
    },
    {
        "id": "openrouter",
        "name": "OpenRouter",
        "requiresKey": True,
        "envKey": "OPEN_ROUTER_API_KEY",
        "models": ["anthropic/claude-3.7-sonnet", "openai/gpt-4o", "google/gemini-2.5-flash"],
        "description": "Unified gateway to 100+ frontier models.",
    },
]

UNIFORGE_SYSTEM_PROMPT = """You are UNIFORGE AI, the autonomous principal software engineer inside UNIFORGE (Universal Engineering OS).
When asked to build or modify an application, emit clean, complete, production-ready code wrapped strictly inside a single <uniforgeArtifact> XML block:

<uniforgeArtifact id="unique-kebab-id" title="Short Descriptive Title">
<uniforgeAction type="file" filePath="index.html">
...complete file content...
</uniforgeAction>
<uniforgeAction type="file" filePath="styles.css">
...complete file content...
</uniforgeAction>
<uniforgeAction type="file" filePath="app.js">
...complete file content...
</uniforgeAction>
</uniforgeArtifact>

<uniforge-quick-actions>
<uniforge-quick-action type="message" message="Add dark/light theme toggle and keyboard shortcuts">Add Theme & Shortcuts</uniforge-quick-action>
<uniforge-quick-action type="message" message="Generate FastAPI backend and Docker Compose stack">Add Backend & Docker</uniforge-quick-action>
</uniforge-quick-actions>

Rules:
- Never use placeholder comments like `// rest of code`. Always output complete runnable files.
- Prioritize modern, responsive, accessible dark glassmorphism UI in `index.html`, `styles.css`, and `app.js`.
- If the user is in `discuss` mode, answer concisely in Markdown without emitting `<uniforgeArtifact>` unless requested.
"""


def get_workbench_providers() -> Dict[str, Any]:
    out = []
    for p in PROVIDERS_CATALOG:
        env_key = p.get("envKey")
        out.append({
            **p,
            "configured": (not p["requiresKey"]) or bool(env_key and os.getenv(env_key)),
        })
    return {"providers": out}


def enhance_workbench_prompt(prompt: str) -> Dict[str, Any]:
    raw = (prompt or "").strip()
    if not raw:
        return {"ok": False, "enhanced": ""}
    enhanced = (
        f"{raw}\n\n"
        "Engineering & UX Requirements:\n"
        "- Modern responsive dark UI with crisp typography, glass cards, smooth micro-interactions, and mobile support.\n"
        "- Clean modular separation across `index.html`, `styles.css`, and `app.js` with persistent `localStorage` state.\n"
        "- Include interactive controls, real-time filtering/metrics, empty/error states, and zero console errors.\n"
        "- Provide production `docker-compose.factory.yml` wiring and health-checkable backend entrypoint."
    )
    return {"ok": True, "original": raw, "enhanced": enhanced}


def _http_post_json(url: str, headers: Dict[str, str], payload: Dict[str, Any], timeout: float = 25.0) -> Dict[str, Any]:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", **headers},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def _synthesize_offline_artifact(prompt: str, chat_mode: str = "build", existing_files: Optional[Dict[str, str]] = None) -> str:
    low = prompt.lower()
    if chat_mode == "discuss":
        return (
            f"### UNIFORGE Architectural Guidance\n\n"
            f"For **\"{prompt}\"**, recommended UNIFORGE stack:\n"
            f"- **Frontend**: Modular HTML/CSS/JS or React + TypeScript with local state persistence\n"
            f"- **Backend**: FastAPI (`:8000`) or Spring Boot 3 (`:8080`) with strict Pydantic/DTO validation\n"
            f"- **Data & AI**: PostgreSQL + `pgvector` for relational + vector search, Redis for async queues, Ollama for local inference\n"
            f"- **Security**: Zero-Trust non-root containers (`UID 65534`, `--read-only`, `--cap-drop ALL`)\n\n"
            f"<uniforge-quick-actions>\n"
            f"<uniforge-quick-action type=\"message\" message=\"Build this complete app now with live preview and Docker Compose\">Switch to Build Mode &amp; Generate</uniforge-quick-action>\n"
            f"</uniforge-quick-actions>"
        )

    slug = re.sub(r"[^a-z0-9]+", "-", low).strip("-")[:28] or "uniforge-app"
    safe_title = prompt[:64].replace("<", "").replace(">", "").replace('"', "")
    factory_job = run_software_factory(prompt, target_cloud="gcp", write_artifacts=False)
    compose_yaml = factory_job["layers"][2]["docker_compose_yaml"]
    backend_files = factory_job.get("generated_files_content", {})

    # Detect specialized interactive templates based on prompt intent
    is_creative = any(k in low for k in ("p5", "canvas", "art", "particle", "3d", "game", "visual", "shader"))
    is_dashboard = any(k in low for k in ("dashboard", "saas", "analytics", "crm", "finance", "metric", "admin", "monitor"))

    if is_creative:
        index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{safe_title} — UNIFORGE</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="hud">
    <div class="title"><span class="dot"></span> {safe_title}</div>
    <div class="controls">
      <label>Speed <input id="speed" type="range" min="1" max="10" value="4" /></label>
      <label>Nodes <input id="count" type="range" min="20" max="140" value="75" /></label>
      <label>Hue <input id="hue" type="range" min="0" max="360" value="200" /></label>
      <button id="burst">Pulse</button>
    </div>
  </div>
  <canvas id="stage"></canvas>
  <script src="app.js"></script>
</body>
</html>"""
        styles_css = """* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #020617; color: #f8fafc; font-family: Inter, system-ui, sans-serif; overflow: hidden; }
.hud { position: fixed; top: 14px; left: 14px; right: 14px; z-index: 10; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 14px; background: rgba(15,23,42,0.82); backdrop-filter: blur(12px); border: 1px solid #1e293b; }
.title { font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 8px; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; }
.controls { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-size: 12px; color: #94a3b8; }
button { background: linear-gradient(90deg, #2563eb, #10b981); border: none; color: #fff; font-weight: 700; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 12px; }
canvas { display: block; width: 100vw; height: 100vh; }"""
        app_js = """const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
let nodes = [];
function seed(n) {
  nodes = Array.from({ length: n }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6, r: 2 + Math.random() * 2.5
  }));
}
seed(75);
document.getElementById('count').addEventListener('input', (e) => seed(Number(e.target.value)));
document.getElementById('burst').addEventListener('click', () => nodes.forEach(p => { p.vx *= 2.2; p.vy *= 2.2; }));
function loop() {
  const speed = Number(document.getElementById('speed').value) * 0.35;
  const hue = Number(document.getElementById('hue').value);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.22)';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    a.x = (a.x + a.vx * speed + w) % w;
    a.y = (a.y + a.vy * speed + h) % h;
    a.vx *= 0.995; a.vy *= 0.995;
    if (Math.abs(a.vx) < 0.4) a.vx += (Math.random() - 0.5) * 0.3;
    if (Math.abs(a.vy) < 0.4) a.vy += (Math.random() - 0.5) * 0.3;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) {
        ctx.strokeStyle = `hsla(${(hue + d) % 360}, 85%, 60%, ${(1 - d / 130) * 0.5})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    ctx.fillStyle = `hsl(${hue}, 90%, 68%)`;
    ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
  }
  requestAnimationFrame(loop);
}
loop();"""
    else:
        kpi_block = (
            """<section class="kpis">
      <div class="kpi"><div class="k-label">Active Workspaces</div><div class="k-val" id="k-ws">24</div><div class="k-delta">+18% this week</div></div>
      <div class="kpi"><div class="k-label">API Latency (p95)</div><div class="k-val">14.2 ms</div><div class="k-delta">99.98% uptime</div></div>
      <div class="kpi"><div class="k-label">Zero-Trust Gate</div><div class="k-val ok">PASSED</div><div class="k-delta">Rootless Sandbox</div></div>
    </section>"""
            if is_dashboard
            else ""
        )
        index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{safe_title} — UNIFORGE</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="nav">
    <div class="logo-wrap"><span class="logo-box">U</span><span>UNIFORGE App</span></div>
    <button id="theme-btn" class="ghost">Toggle Theme</button>
  </header>
  <main class="wrap">
    <section class="panel">
      <span class="pill">GENERATED BY UNIFORGE AI WORKBENCH</span>
      <h1>{safe_title}</h1>
      <p>Full-stack interactive application with persistent browser storage, filterable workflows, and ready-to-deploy microservices.</p>
      {kpi_block}
      <form id="item-form" class="row">
        <input id="item-input" placeholder="Create new record, task, or feature..." required />
        <select id="item-tag"><option>Core</option><option>AI</option><option>Urgent</option></select>
        <button type="submit" class="primary">Add</button>
      </form>
      <div class="row filter-row">
        <input id="search-input" placeholder="Filter records..." />
        <span id="counter" class="muted"></span>
      </div>
      <ul id="items" class="list"></ul>
    </section>
  </main>
  <script src="app.js"></script>
</body>
</html>"""
        styles_css = """:root { --bg: #020617; --card: #0f172a; --line: #1e293b; --txt: #f8fafc; --sub: #94a3b8; }
body.light { --bg: #f8fafc; --card: #ffffff; --line: #e2e8f0; --txt: #0f172a; --sub: #475569; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Inter, system-ui, sans-serif; background: var(--bg); color: var(--txt); min-height: 100vh; transition: background 0.2s; }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; border-bottom: 1px solid var(--line); background: var(--card); }
.logo-wrap { display: flex; align-items: center; gap: 10px; font-weight: 800; }
.logo-box { width: 28px; height: 28px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2563eb, #10b981); color: #fff; font-weight: 900; }
.wrap { max-width: 860px; margin: 28px auto; padding: 0 18px; }
.panel { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 26px; display: grid; gap: 16px; }
.pill { justify-self: start; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: rgba(37,99,235,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
h1 { font-size: 1.75rem; font-weight: 800; }
p { color: var(--sub); font-size: 0.92rem; line-height: 1.5; }
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
.kpi { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; padding: 14px; }
.k-label { font-size: 11px; color: var(--sub); }
.k-val { font-size: 1.35rem; font-weight: 800; margin-top: 4px; }
.k-val.ok { color: #10b981; }
.k-delta { font-size: 11px; color: #38bdf8; margin-top: 2px; }
.row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
input, select { flex: 1; min-width: 140px; background: var(--bg); color: var(--txt); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; font-size: 0.88rem; }
select { flex: 0 0 110px; }
button.primary { background: linear-gradient(90deg, #2563eb, #10b981); color: #fff; border: none; border-radius: 10px; padding: 10px 18px; font-weight: 700; cursor: pointer; }
button.ghost { background: transparent; color: var(--txt); border: 1px solid var(--line); border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
.list { list-style: none; display: grid; gap: 8px; }
.list li { background: var(--bg); border: 1px solid var(--line); border-radius: 11px; padding: 11px 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 0.9rem; }
.tag { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 999px; background: rgba(16,185,129,0.15); color: #34d399; }
.muted { font-size: 12px; color: var(--sub); }
.done { text-decoration: line-through; opacity: 0.55; }"""
        app_js = f"""const STORAGE_KEY = 'uniforge_app_{slug}';
let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || [
  {{ id: 1, text: 'Initialize UNIFORGE Microservices & Control Plane', tag: 'Core', done: true }},
  {{ id: 2, text: 'Connect PostgreSQL pgvector & Local RAG Memory', tag: 'AI', done: false }},
  {{ id: 3, text: 'Verify Zero-Trust Sandbox & Deploy to Cloud', tag: 'Urgent', done: false }}
];
const listEl = document.getElementById('items');
const counterEl = document.getElementById('counter');
const searchEl = document.getElementById('search-input');

function save() {{ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }}
function render() {{
  const q = (searchEl.value || '').toLowerCase();
  const visible = items.filter(it => it.text.toLowerCase().includes(q) || it.tag.toLowerCase().includes(q));
  counterEl.textContent = visible.length + ' of ' + items.length + ' items';
  listEl.innerHTML = visible.map(it => `
    <li>
      <div style="display:flex;align-items:center;gap:10px">
        <input type="checkbox" style="min-width:16px;flex:0" ${{it.done ? 'checked' : ''}} onchange="toggleItem(${{it.id}})" />
        <span class="${{it.done ? 'done' : ''}}">${{it.text}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="tag">${{it.tag}}</span>
        <button class="ghost" onclick="removeItem(${{it.id}})">Delete</button>
      </div>
    </li>
  `).join('');
}}
window.toggleItem = (id) => {{ items = items.map(i => i.id === id ? {{ ...i, done: !i.done }} : i); save(); render(); }};
window.removeItem = (id) => {{ items = items.filter(i => i.id !== id); save(); render(); }};
document.getElementById('item-form').addEventListener('submit', (e) => {{
  e.preventDefault();
  const inp = document.getElementById('item-input');
  const tag = document.getElementById('item-tag').value;
  if (!inp.value.trim()) return;
  items.unshift({{ id: Date.now(), text: inp.value.trim(), tag, done: false }});
  inp.value = '';
  save(); render();
}});
searchEl.addEventListener('input', render);
document.getElementById('theme-btn').addEventListener('click', () => document.body.classList.toggle('light'));
render();"""

    extra_actions = []
    for fname, content in backend_files.items():
        extra_actions.append(f'<uniforgeAction type="file" filePath="backend/{fname}">\n{content.strip()}\n</uniforgeAction>')
    extra_actions.append(f'<uniforgeAction type="file" filePath="docker-compose.factory.yml">\n{compose_yaml.strip()}\n</uniforgeAction>')
    extra_xml = "\n".join(extra_actions)

    return f"""I've engineered **{safe_title}** using the **UNIFORGE 5-Layer Software Factory** with live frontend preview, persistent state, backend service files, and isolated microservices Docker Compose wiring.

<uniforgeArtifact id="{slug}" title="{safe_title}">
<uniforgeAction type="file" filePath="index.html">
{index_html}
</uniforgeAction>
<uniforgeAction type="file" filePath="styles.css">
{styles_css}
</uniforgeAction>
<uniforgeAction type="file" filePath="app.js">
{app_js}
</uniforgeAction>
{extra_xml}
<uniforgeAction type="start">
preview
</uniforgeAction>
</uniforgeArtifact>

<uniforge-quick-actions>
<uniforge-quick-action type="message" message="Convert this into an interactive particle canvas visualization with speed and hue controls">Switch to Interactive Canvas</uniforge-quick-action>
<uniforge-quick-action type="message" message="Add real-time analytics KPI cards and SaaS telemetry dashboard metrics">Upgrade to SaaS Dashboard</uniforge-quick-action>
</uniforge-quick-actions>"""


def run_workbench_chat(
    prompt: str,
    provider: str = "uniforge-local",
    model: str = "uniforge-architect-v2",
    chat_mode: str = "build",
    api_key: str = "",
    ollama_url: str = "http://localhost:11434",
    files: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    """Routes workbench chat to live external/local LLM providers or UNIFORGE Native Engine."""
    t0 = time.perf_counter()
    prov = (provider or "uniforge-local").strip().lower()
    used_provider = prov
    raw_reply = ""
    fallback_note = ""

    file_context = ""
    if files:
        snippet_list = [f"--- {k} ---\n{v[:1200]}" for k, v in list(files.items())[:4]]
        file_context = "\nCurrent Workspace Files:\n" + "\n".join(snippet_list)

    user_msg = f"[MODE: {chat_mode.upper()}]\n{prompt}{file_context}"

    if prov == "ollama":
        try:
            res = _http_post_json(
                f"{ollama_url.rstrip('/')}/api/chat",
                {},
                {
                    "model": model or "qwen2.5-coder:7b",
                    "stream": False,
                    "messages": [
                        {"role": "system", "content": UNIFORGE_SYSTEM_PROMPT},
                        {"role": "user", "content": user_msg},
                    ],
                },
                timeout=30.0,
            )
            raw_reply = res.get("message", {}).get("content", "")
        except Exception as exc:
            fallback_note = f"Ollama unreachable ({exc}); fell back to UNIFORGE Native Engine."
            used_provider = "uniforge-local"

    elif prov in ("openai", "deepseek", "groq", "openrouter"):
        endpoint_map = {
            "openai": ("https://api.openai.com/v1/chat/completions", "OPENAI_API_KEY"),
            "deepseek": ("https://api.deepseek.com/chat/completions", "DEEPSEEK_API_KEY"),
            "groq": ("https://api.groq.com/openai/v1/chat/completions", "GROQ_API_KEY"),
            "openrouter": ("https://openrouter.ai/api/v1/chat/completions", "OPEN_ROUTER_API_KEY"),
        }
        url, env_name = endpoint_map[prov]
        key = api_key or os.getenv(env_name, "")
        if key:
            try:
                res = _http_post_json(
                    url,
                    {"Authorization": f"Bearer {key}"},
                    {
                        "model": model,
                        "messages": [
                            {"role": "system", "content": UNIFORGE_SYSTEM_PROMPT},
                            {"role": "user", "content": user_msg},
                        ],
                        "temperature": 0.2,
                    },
                )
                raw_reply = res["choices"][0]["message"]["content"]
            except Exception as exc:
                fallback_note = f"{prov} API error ({exc}); fell back to UNIFORGE Native Engine."
                used_provider = "uniforge-local"
        else:
            fallback_note = f"No {env_name} supplied; used UNIFORGE Native Engine."
            used_provider = "uniforge-local"

    elif prov == "anthropic":
        key = api_key or os.getenv("ANTHROPIC_API_KEY", "")
        if key:
            try:
                res = _http_post_json(
                    "https://api.anthropic.com/v1/messages",
                    {"x-api-key": key, "anthropic-version": "2023-06-01"},
                    {
                        "model": model or "claude-3-7-sonnet-latest",
                        "max_tokens": 4096,
                        "system": UNIFORGE_SYSTEM_PROMPT,
                        "messages": [{"role": "user", "content": user_msg}],
                    },
                )
                raw_reply = "".join(b.get("text", "") for b in res.get("content", []) if b.get("type") == "text")
            except Exception as exc:
                fallback_note = f"Anthropic API error ({exc}); fell back to UNIFORGE Native Engine."
                used_provider = "uniforge-local"
        else:
            fallback_note = "No ANTHROPIC_API_KEY supplied; used UNIFORGE Native Engine."
            used_provider = "uniforge-local"

    elif prov == "gemini":
        key = api_key or os.getenv("GOOGLE_GENERATIVE_AI_API_KEY", "")
        if key:
            try:
                m = model or "gemini-2.5-flash"
                res = _http_post_json(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={key}",
                    {},
                    {
                        "systemInstruction": {"parts": [{"text": UNIFORGE_SYSTEM_PROMPT}]},
                        "contents": [{"role": "user", "parts": [{"text": user_msg}]}],
                    },
                )
                raw_reply = res["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as exc:
                fallback_note = f"Gemini API error ({exc}); fell back to UNIFORGE Native Engine."
                used_provider = "uniforge-local"
        else:
            fallback_note = "No GOOGLE_GENERATIVE_AI_API_KEY supplied; used UNIFORGE Native Engine."
            used_provider = "uniforge-local"

    if not raw_reply:
        raw_reply = _synthesize_offline_artifact(prompt, chat_mode=chat_mode, existing_files=files)

    duration_ms = round((time.perf_counter() - t0) * 1000, 2)
    publish_event(
        "workbench.chat_completed",
        "uniforge-workbench",
        {"provider": used_provider, "model": model, "mode": chat_mode, "duration_ms": duration_ms},
        actor="engineer",
    )
    return {
        "ok": True,
        "provider": used_provider,
        "model": model,
        "mode": chat_mode,
        "duration_ms": duration_ms,
        "fallback_note": fallback_note,
        "response": raw_reply,
    }


def import_github_repository(repo_url: str, max_files: int = 12) -> Dict[str, Any]:
    """Imports key source files from any public GitHub repository into the UNIFORGE Workbench VFS."""
    m = re.search(r"github\.com/([^/]+)/([^/?#]+)", repo_url.strip())
    if not m:
        return {"ok": False, "error": "Please enter a valid GitHub URL (e.g. https://github.com/owner/repo)."}

    owner, repo = m.group(1), m.group(2).removesuffix(".git")
    headers = {"User-Agent": "UNIFORGE-Workbench/2.1", "Accept": "application/vnd.github+json"}
    try:
        req = urllib.request.Request(
            f"https://api.github.com/repos/{owner}/{repo}/git/trees/HEAD?recursive=1",
            headers=headers,
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            tree = json.loads(resp.read().decode("utf-8")).get("tree", [])

        allowed_ext = (".html", ".css", ".js", ".ts", ".tsx", ".py", ".json", ".md", ".yml", ".yaml")
        candidates = [
            item["path"]
            for item in tree
            if item.get("type") == "blob"
            and item.get("size", 0) < 40000
            and item["path"].lower().endswith(allowed_ext)
            and not any(skip in item["path"] for skip in ("node_modules/", "dist/", "package-lock.json", ".min."))
        ][:max_files]

        imported: Dict[str, str] = {}
        for fpath in candidates:
            try:
                f_req = urllib.request.Request(
                    f"https://api.github.com/repos/{owner}/{repo}/contents/{fpath}",
                    headers=headers,
                )
                with urllib.request.urlopen(f_req, timeout=8) as f_resp:
                    f_data = json.loads(f_resp.read().decode("utf-8"))
                    if f_data.get("encoding") == "base64":
                        imported[fpath] = base64.b64decode(f_data["content"]).decode("utf-8", errors="replace")
            except Exception:
                continue

        publish_event(
            "workbench.github_imported",
            "uniforge-workbench",
            {"repo": f"{owner}/{repo}", "files_imported": len(imported)},
            actor="engineer",
        )
        return {"ok": True, "repo": f"{owner}/{repo}", "count": len(imported), "files": imported}
    except Exception as exc:
        return {"ok": False, "error": f"GitHub import failed: {exc}"}

