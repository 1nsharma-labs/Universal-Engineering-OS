import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { studioApi } from '../api/studioClient';
import { Brain, Cloud, Code2, Cpu, Globe, Package, Terminal } from 'lucide-react';

export const IntelligenceView: React.FC = () => {
  const [ragQ, setRagQ] = useState('How do I configure PostgreSQL pgvector HNSW and rootless Docker sandbox?');
  const [buildPrompt, setBuildPrompt] = useState('Build a real-time inventory API with health checks');
  const [stack, setStack] = useState('fastapi');

  const ragMut = useMutation({ mutationFn: () => studioApi.queryRag(ragQ, 4) });
  const buildMut = useMutation({ mutationFn: () => studioApi.autonomousBuild(buildPrompt, stack) });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-sky-400" /> Offline Local RAG Brain (60+ Wiki &amp; Code Memory)
        </h2>
        <div className="flex gap-2">
          <input value={ragQ} onChange={(e) => setRagQ(e.target.value)} className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white" />
          <button onClick={() => ragMut.mutate()} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white">
            Query RAG
          </button>
        </div>
        {ragMut.data && (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
              {ragMut.data.answer}
            </div>
            {(ragMut.data.matches || []).map((m: Record<string, any>) => (
              <div key={m.rank} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span>{m.title}</span>
                  <span className="text-sky-400">score {m.score}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{m.source}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" /> Autonomous AI Team (Architect &rarr; Coder &rarr; Tester)
        </h2>
        <div className="flex gap-2">
          <input value={buildPrompt} onChange={(e) => setBuildPrompt(e.target.value)} className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white" />
          <select value={stack} onChange={(e) => setStack(e.target.value)} className="rounded-xl bg-slate-950 border border-slate-700 px-2 py-2 text-xs text-white">
            <option value="fastapi">FastAPI</option>
            <option value="spring-boot">Spring Boot</option>
            <option value="react">React TS</option>
            <option value="p5js">p5.js</option>
          </select>
          <button onClick={() => buildMut.mutate()} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white">
            Build
          </button>
        </div>
        {buildMut.data && (
          <pre className="max-h-80 overflow-auto rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-emerald-300">
            {JSON.stringify(buildMut.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export const ExecutionStudioView: React.FC = () => {
  const [cmd, setCmd] = useState('python devhub.py version');
  const [code, setCode] = useState('def hello(name: str) -> str:\n    return f"Hello from UNIFORGE, {name}"\n');
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:7000/api/v1/status');

  const termMut = useMutation({ mutationFn: () => studioApi.execTerminal(cmd) });
  const lspMut = useMutation({ mutationFn: () => studioApi.lspDiagnostics('python', code) });
  const apiMut = useMutation({ mutationFn: () => studioApi.executeApi({ url: apiUrl, method: 'GET' }) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" /> Live PTY Terminal
          </h2>
          <div className="flex gap-2">
            <input value={cmd} onChange={(e) => setCmd(e.target.value)} className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono" />
            <button onClick={() => termMut.mutate()} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white">Run</button>
          </div>
          <pre className="h-48 overflow-auto rounded-xl bg-black border border-slate-800 p-3 text-xs text-emerald-400 font-mono">
            {termMut.data ? `${termMut.data.stdout || ''}${termMut.data.stderr || ''}\n[exit=${termMut.data.exit_code} | ${termMut.data.duration_ms}ms]` : 'Click Run to execute via Studio API /api/v1/terminal/exec.'}
          </pre>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-400" /> Polyglot LSP Diagnostics
          </h2>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={5} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-xs text-sky-200 font-mono" />
          <button onClick={() => lspMut.mutate()} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white">Run AST / LSP Check</button>
          {lspMut.data && (
            <pre className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-sky-300 overflow-x-auto">
              {JSON.stringify(lspMut.data, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" /> Embedded API Execution Runner
        </h2>
        <div className="flex gap-2">
          <input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono" />
          <button onClick={() => apiMut.mutate()} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white">Send GET</button>
        </div>
        {apiMut.data && (
          <pre className="max-h-56 overflow-auto rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-sky-300">
            {JSON.stringify(apiMut.data.json || apiMut.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export const TechnologyUniverseView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState('gcp');

  const regQ = useQuery({ queryKey: ['registry', search], queryFn: () => studioApi.getRegistry(search) });
  const plugQ = useQuery({ queryKey: ['plugins'], queryFn: studioApi.getPlugins });
  const deployMut = useMutation({ mutationFn: () => studioApi.deployPlan(provider, 'uniforge-prod', 'us-central1') });
  const execPlugMut = useMutation({
    mutationFn: ({ pid, cid }: { pid: string; cid: string }) => studioApi.execPlugin(pid, cid),
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" /> Official Plugins &amp; 1-Click Cloud Deploy
          </h2>
          <div className="flex gap-2">
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white">
              <option value="gcp">GCP Cloud Run</option>
              <option value="aws">AWS App Runner</option>
              <option value="cloudflare">Cloudflare Pages</option>
              <option value="uniforge-cloud">UNIFORGE Cloud Helm</option>
            </select>
            <button onClick={() => deployMut.mutate()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white">
              <Cloud className="w-3.5 h-3.5" /> Plan Deploy
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {(plugQ.data?.plugins || []).map((p: Record<string, any>) => {
            const m = p.manifest;
            const firstCmd = m.commands?.[0]?.id || 'status';
            return (
              <div key={m.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-2">
                <div>
                  <div className="font-bold text-xs text-white">{m.name}</div>
                  <div className="text-[10px] font-mono text-sky-400 mt-0.5">{m.category} &bull; v{m.version}</div>
                </div>
                <button
                  onClick={() => execPlugMut.mutate({ pid: m.id, cid: firstCmd })}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-[11px] font-semibold text-white"
                >
                  Run {firstCmd}()
                </button>
              </div>
            );
          })}
        </div>
        {(execPlugMut.data || deployMut.data) && (
          <pre className="max-h-48 overflow-auto rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-emerald-300">
            {JSON.stringify(deployMut.data || execPlugMut.data, null, 2)}
          </pre>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white">Technology Universe Registry ({regQ.data?.technologies?.length ?? 0} verified)</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Rust, pgvector, Spring, Three.js, Ollama..."
            className="w-72 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {(regQ.data?.technologies || []).map((t: Record<string, any>) => (
            <div key={t.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{t.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 uppercase">{t.security_status}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{t.type} &bull; {t.language}</div>
              <div className="text-[10px] text-sky-400 font-mono mt-1">{t.domain_id} &bull; {t.license}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

