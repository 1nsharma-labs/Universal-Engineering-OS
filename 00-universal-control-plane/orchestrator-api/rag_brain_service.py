"""
UNIFORGE Milestone 6 — Local RAG Brain & Personal Code Memory
Indexes all 60+ Universal Wiki profiles, 07-programming-knowledge-base cheatsheets/prompts,
and official plugin manifests into a fast, 100% offline-capable hybrid TF-IDF / Cosine vector store
with optional live Ollama LLM synthesis.
"""

import json
import math
import re
import time
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List

HUB_ROOT = Path(__file__).resolve().parents[2]
STOPWORDS = {
    "the", "and", "for", "with", "that", "this", "from", "are", "was", "were",
    "have", "has", "had", "not", "but", "you", "your", "can", "all", "any",
    "into", "use", "using", "via", "will", "should", "must", "its", "their",
}

_RAG_STATE: Dict[str, Any] = {
    "indexed_at": None,
    "documents_count": 0,
    "chunks": [],
    "idf": {},
    "vocab_size": 0,
}


def _tokenize(text: str) -> List[str]:
    tokens = re.findall(r"[a-zA-Z0-9_+#.-]{2,}", text.lower())
    return [t for t in tokens if t not in STOPWORDS]


def _chunk_markdown(text: str, max_chars: int = 900) -> List[str]:
    sections = re.split(r"\n(?=##\s)", text)
    chunks: List[str] = []
    for sec in sections:
        sec = sec.strip()
        if not sec:
            continue
        if len(sec) <= max_chars:
            chunks.append(sec)
        else:
            for i in range(0, len(sec), max_chars):
                chunks.append(sec[i : i + max_chars].strip())
    return chunks or [text[:max_chars]]


def build_rag_index() -> Dict[str, Any]:
    """Indexes Universal Wiki profiles, programming cheatsheets, governance docs, and plugins."""
    start = time.perf_counter()
    sources: List[Path] = []

    wiki_dir = HUB_ROOT / "docs" / "wiki" / "profiles"
    if wiki_dir.exists():
        sources.extend(sorted(wiki_dir.glob("*.md")))

    kb_dir = HUB_ROOT / "07-programming-knowledge-base"
    if kb_dir.exists():
        sources.extend(sorted(kb_dir.rglob("*.md")))

    plugins_dir = HUB_ROOT / "plugins"
    if plugins_dir.exists():
        sources.extend(sorted(plugins_dir.glob("*/uniforge-plugin.json")))

    for doc_name in ("README.md", "ROADMAP.md", "ENTERPRISE.md", "SECURITY.md"):
        p = HUB_ROOT / doc_name
        if p.exists():
            sources.append(p)

    chunks: List[Dict[str, Any]] = []
    df: Counter = Counter()

    for src in sources:
        try:
            raw = src.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        rel_path = str(src.relative_to(HUB_ROOT)).replace("\\", "/")
        title = raw.splitlines()[0].lstrip("# ").strip() if raw.splitlines() else src.name
        category = "wiki" if "docs/wiki/" in rel_path else "plugin" if rel_path.startswith("plugins/") else "knowledge-base"

        for idx, chunk_text in enumerate(_chunk_markdown(raw)):
            toks = _tokenize(f"{title} {rel_path} {chunk_text}")
            if not toks:
                continue
            tf = Counter(toks)
            for term in tf.keys():
                df[term] += 1
            chunks.append({
                "id": f"{rel_path}#c{idx}",
                "source": rel_path,
                "title": title,
                "category": category,
                "snippet": chunk_text[:360].strip(),
                "tf": tf,
            })

    total_chunks = max(len(chunks), 1)
    idf = {term: math.log((1 + total_chunks) / (1 + freq)) + 1.0 for term, freq in df.items()}

    # Precompute normalized TF-IDF vectors for instant cosine search
    for ch in chunks:
        vec = {term: (1 + math.log(count)) * idf.get(term, 1.0) for term, count in ch["tf"].items()}
        norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
        ch["vec"] = vec
        ch["norm"] = norm
        del ch["tf"]

    _RAG_STATE["indexed_at"] = int(time.time())
    _RAG_STATE["documents_count"] = len(sources)
    _RAG_STATE["chunks"] = chunks
    _RAG_STATE["idf"] = idf
    _RAG_STATE["vocab_size"] = len(idf)

    return {
        "ok": True,
        "documents_indexed": len(sources),
        "chunks_indexed": len(chunks),
        "vocab_size": len(idf),
        "duration_ms": round((time.perf_counter() - start) * 1000, 2),
        "vector_engine": "UNIFORGE Local Hybrid TF-IDF Cosine Engine (Qdrant/Ollama Compatible)",
    }


def get_rag_stats() -> Dict[str, Any]:
    if not _RAG_STATE["chunks"]:
        build_rag_index()
    return {
        "indexed_at": _RAG_STATE["indexed_at"],
        "documents_indexed": _RAG_STATE["documents_count"],
        "chunks_indexed": len(_RAG_STATE["chunks"]),
        "vocab_size": _RAG_STATE["vocab_size"],
        "offline_ready": True,
    }


def query_rag_brain(query: str, top_k: int = 5, use_ollama: bool = False, model: str = "llama3.2") -> Dict[str, Any]:
    """Retrieves top-K semantically relevant chunks from local memory and synthesizes an answer."""
    if not _RAG_STATE["chunks"]:
        build_rag_index()

    start = time.perf_counter()
    q_tokens = _tokenize(query)
    if not q_tokens:
        return {"ok": False, "error": "Please enter a non-empty question or keyword."}

    idf = _RAG_STATE["idf"]
    q_tf = Counter(q_tokens)
    q_vec = {t: (1 + math.log(c)) * idf.get(t, 1.0) for t, c in q_tf.items()}
    q_norm = math.sqrt(sum(v * v for v in q_vec.values())) or 1.0

    scored = []
    for ch in _RAG_STATE["chunks"]:
        dot = sum(qv * ch["vec"].get(t, 0.0) for t, qv in q_vec.items())
        if dot > 0:
            score = dot / (q_norm * ch["norm"])
            scored.append((score, ch))

    scored.sort(key=lambda pair: pair[0], reverse=True)
    matches = [
        {
            "rank": idx + 1,
            "score": round(score, 4),
            "source": ch["source"],
            "title": ch["title"],
            "category": ch["category"],
            "snippet": ch["snippet"],
        }
        for idx, (score, ch) in enumerate(scored[: min(max(top_k, 1), 15)])
    ]

    llm_synthesis = None
    synthesis_mode = "offline-extractive-copilot"

    if use_ollama and matches:
        context_block = "\n\n".join(f"[{m['source']}]\n{m['snippet']}" for m in matches[:3])
        payload = json.dumps({
            "model": model,
            "prompt": f"Answer concisely using this UNIFORGE workspace context:\n{context_block}\n\nQuestion: {query}",
            "stream": False,
        }).encode("utf-8")
        try:
            req = urllib.request.Request(
                "http://localhost:11434/api/generate",
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                llm_synthesis = data.get("response")
                synthesis_mode = f"local-ollama:{model}"
        except Exception:
            synthesis_mode = "offline-extractive-copilot (ollama offline fallback)"

    if not llm_synthesis:
        if matches:
            top_sources = ", ".join(dict.fromkeys(m["source"] for m in matches[:3]))
            llm_synthesis = (
                f"Found {len(matches)} high-relevance memory chunks across `{top_sources}`. "
                f"Top match ({matches[0]['title']}, score={matches[0]['score']}): {matches[0]['snippet'][:240]}..."
            )
        else:
            llm_synthesis = "No direct local memory hits found. Try broadening your technical keywords."

    return {
        "ok": True,
        "query": query,
        "mode": synthesis_mode,
        "duration_ms": round((time.perf_counter() - start) * 1000, 2),
        "total_chunks_searched": len(_RAG_STATE["chunks"]),
        "answer": llm_synthesis,
        "matches": matches,
    }
