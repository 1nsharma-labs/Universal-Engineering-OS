import React, { useEffect, useState } from 'react';
import { Brain, FolderGit2, Globe, Plus, Search, Sparkles, Trash2, X } from 'lucide-react';

interface CognitiveBrainModalProps {
  open: boolean;
  onClose: () => void;
  activeProjectSlug: string;
  onSelectProjectSlug: (slug: string) => void;
  currentFiles: Record<string, string>;
}

export const CognitiveBrainModal: React.FC<CognitiveBrainModalProps> = ({
  open,
  onClose,
  activeProjectSlug,
  onSelectProjectSlug,
  currentFiles,
}) => {
  const [tab, setTab] = useState<'memory' | 'skills' | 'webcrawl' | 'projects'>('memory');

  // Memory state
  const [memories, setMemories] = useState<Array<Record<string, any>>>([]);
  const [memInput, setMemInput] = useState('');
  const [memCat, setMemCat] = useState('preference');

  // Skills state
  const [skills, setSkills] = useState<Array<Record<string, any>>>([]);
  const [skillName, setSkillName] = useState('');
  const [skillInst, setSkillInst] = useState('');

  // Web Crawler & Search state
  const [crawlUrl, setCrawlUrl] = useState('https://fastapi.tiangolo.com/');
  const [crawlResult, setCrawlResult] = useState<Record<string, any> | null>(null);
  const [webQuery, setWebQuery] = useState('PostgreSQL pgvector');
  const [webHits, setWebHits] = useState<Array<Record<string, any>>>([]);
  const [crawling, setCrawling] = useState(false);

  // Managed Projects state
  const [projects, setProjects] = useState<Array<Record<string, any>>>([]);
  const [projName, setProjName] = useState('');
  const [projStack, setProjStack] = useState('React + FastAPI + PostgreSQL pgvector');

  async function refreshAll() {
    try {
      const [m, s, p] = await Promise.all([
        fetch('/api/v1/brain/memory').then((r) => r.json()),
        fetch('/api/v1/brain/skills').then((r) => r.json()),
        fetch('/api/v1/brain/projects').then((r) => r.json()),
      ]);
      setMemories(m.memories || []);
      setSkills(s.skills || []);
      setProjects(p.projects || []);
    } catch {
      // control plane offline
    }
  }

  useEffect(() => {
    if (open) refreshAll();
  }, [open]);

  if (!open) return null;

  async function handleAddMemory() {
    if (!memInput.trim()) return;
    await fetch('/api/v1/brain/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: memInput, category: memCat, importance: 8 }),
    });
    setMemInput('');
    refreshAll();
  }

  async function handleDeleteMemory(id: string) {
    await fetch(`/api/v1/brain/memory/${encodeURIComponent(id)}`, { method: 'DELETE' });
    refreshAll();
  }

  async function handleToggleSkill(id: string, enabled: boolean) {
    await fetch(`/api/v1/brain/skills/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    refreshAll();
  }

  async function handleCreateSkill() {
    if (!skillName.trim() || !skillInst.trim()) return;
    await fetch('/api/v1/brain/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: skillName, instructions: skillInst, category: 'custom', enabled: true }),
    });
    setSkillName('');
    setSkillInst('');
    refreshAll();
  }

  async function handleCrawl() {
    if (!crawlUrl.trim()) return;
    setCrawling(true);
    try {
      const res = await fetch('/api/v1/brain/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: crawlUrl.trim(), save_to_memory: true }),
      });
      setCrawlResult(await res.json());
      refreshAll();
    } finally {
      setCrawling(false);
    }
  }

  async function handleWebSearch() {
    if (!webQuery.trim()) return;
    setCrawling(true);
    try {
      const res = await fetch('/api/v1/brain/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: webQuery.trim() }),
      });
      const data = await res.json();
      setWebHits(data.results || []);
    } finally {
      setCrawling(false);
    }
  }

  async function handleCreateProject() {
    if (!projName.trim()) return;
    const res = await fetch('/api/v1/brain/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: projName.trim(), stack: projStack, files: currentFiles }),
    });
    const data = await res.json();
    if (data.ok && data.slug) {
      onSelectProjectSlug(data.slug);
    }
    setProjName('');
    refreshAll();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-white text-sm">
            <Brain className="w-5 h-5 text-sky-400" />
            UNIFORGE Cognitive Brain — Memory &bull; Skills &bull; Internet Web Crawler &bull; Project Handler
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-slate-800 flex flex-wrap gap-2 bg-slate-950/60">
          {[
            { id: 'memory', label: `Brain Memory (${memories.length})`, icon: Brain },
            { id: 'skills', label: `AI Skills (${skills.filter((s) => s.enabled).length}/${skills.length})`, icon: Sparkles },
            { id: 'webcrawl', label: 'Internet Web Crawler & Search', icon: Globe },
            { id: 'projects', label: `Project Handler (${projects.length})`, icon: FolderGit2 },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  tab === t.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === 'memory' && (
            <>
              <div className="flex flex-wrap gap-2">
                <input
                  value={memInput}
                  onChange={(e) => setMemInput(e.target.value)}
                  placeholder="Teach UNIFORGE Brain a persistent rule, preference, or architecture fact..."
                  className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
                />
                <select value={memCat} onChange={(e) => setMemCat(e.target.value)} className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white">
                  <option value="preference">Preference</option>
                  <option value="architecture">Architecture</option>
                  <option value="code_pattern">Code Pattern</option>
                  <option value="project_context">Project Context</option>
                </select>
                <button onClick={handleAddMemory} className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white">
                  <Plus className="w-3.5 h-3.5" /> Remember
                </button>
              </div>
              <div className="space-y-2">
                {memories.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-sky-400 text-[10px] font-bold uppercase mr-2">{m.category}</span>
                      <span className="text-slate-200">{m.content}</span>
                    </div>
                    <button onClick={() => handleDeleteMemory(m.id)} className="text-slate-500 hover:text-rose-400 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'skills' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="New Skill Name (e.g. Rust Axum Expert)" className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white" />
                <input value={skillInst} onChange={(e) => setSkillInst(e.target.value)} placeholder="Skill system instructions..." className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white" />
                <button onClick={handleCreateSkill} className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white">Add Custom Skill</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.map((sk) => (
                  <div key={sk.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{sk.name}</span>
                      <button
                        onClick={() => handleToggleSkill(sk.id, !sk.enabled)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${sk.enabled ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}
                      >
                        {sk.enabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">{sk.instructions}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'webcrawl' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-bold text-white">Live Internet URL Crawler (Extracts Clean Docs &amp; Saves to Brain Memory)</div>
                <div className="flex gap-2">
                  <input value={crawlUrl} onChange={(e) => setCrawlUrl(e.target.value)} className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono" />
                  <button onClick={handleCrawl} disabled={crawling} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white">
                    {crawling ? 'Crawling...' : 'Crawl & Learn'}
                  </button>
                </div>
                {crawlResult && (
                  <pre className="max-h-48 overflow-auto rounded-xl bg-slate-950 border border-slate-800 p-3 text-[11px] text-emerald-300">
                    {JSON.stringify(crawlResult, null, 2)}
                  </pre>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-sky-400" /> Open Internet Knowledge Search (DuckDuckGo + Wikipedia)
                </div>
                <div className="flex gap-2">
                  <input value={webQuery} onChange={(e) => setWebQuery(e.target.value)} className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white" />
                  <button onClick={handleWebSearch} disabled={crawling} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white">Search Web</button>
                </div>
                <div className="space-y-2">
                  {webHits.map((h, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div className="font-bold text-sky-400">{h.title} <span className="text-[10px] text-slate-500">({h.source})</span></div>
                      <p className="text-slate-300 text-[11px] mt-0.5">{h.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'projects' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input value={projName} onChange={(e) => setProjName(e.target.value)} placeholder="Project Name (saves current files to disk)..." className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white" />
                <input value={projStack} onChange={(e) => setProjStack(e.target.value)} className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white" />
                <button onClick={handleCreateProject} className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white">Save Workspace to Disk</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projects.map((p) => {
                  const selected = p.slug === activeProjectSlug;
                  return (
                    <div key={p.slug} className={`p-3.5 rounded-xl border text-xs ${selected ? 'bg-blue-600/15 border-blue-500/40' : 'bg-slate-950 border-slate-800'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{p.name}</span>
                        <button
                          onClick={() => onSelectProjectSlug(selected ? '' : p.slug)}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${selected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white'}`}
                        >
                          {selected ? 'ATTACHED TO BRAIN' : 'Attach Project'}
                        </button>
                      </div>
                      <div className="text-[11px] text-sky-400 mt-1">{p.stack} &bull; {p.file_count} files on disk</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

