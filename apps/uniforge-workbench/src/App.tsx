import React, { useMemo, useState } from 'react';
import {
  Cloud,
  Code2,
  Download,
  Eye,
  FileCode2,
  Laptop,
  Play,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Terminal,
} from 'lucide-react';
import { useWorkbenchStore, WorkbenchMode } from './store/useWorkbenchStore';
import { composeSrcDoc, runWorkbenchGeneration } from './lib/workbenchEngine';

const STARTER_PROMPTS = [
  'Build an AI SaaS analytics dashboard with FastAPI, React, and PostgreSQL pgvector',
  'Create an interactive generative art studio with live controls and dark glass UI',
  'Build a microservices e-commerce API with Spring Boot, Redis queue, and Docker Compose',
];

export default function App() {
  const {
    mode,
    setMode,
    rightTab,
    setRightTab,
    viewport,
    setViewport,
    files,
    activeFile,
    setActiveFile,
    updateFile,
    mergeFiles,
    messages,
    addMessage,
    isBuilding,
    setIsBuilding,
    previewNonce,
    bumpPreview,
  } = useWorkbenchStore();

  const [promptInput, setPromptInput] = useState('');
  const [lspResult, setLspResult] = useState<string>('');
  const [termCmd, setTermCmd] = useState('python devhub.py version');
  const [termOutput, setTermOutput] = useState('UNIFORGE AI Workbench Terminal connected to Control Plane (:7000).\n');
  const [deployProvider, setDeployProvider] = useState('gcp');
  const [deployPlan, setDeployPlan] = useState<string>('');

  const srcDoc = useMemo(() => composeSrcDoc(files), [files]);

  async function handleSendPrompt(customPrompt?: string) {
    const text = (customPrompt ?? promptInput).trim();
    if (!text || isBuilding) return;
    setPromptInput('');
    addMessage({ role: 'user', content: text });
    setIsBuilding(true);
    try {
      const result = await runWorkbenchGeneration(text, mode);
      mergeFiles(result.files);
      addMessage({
        role: 'assistant',
        content: result.reply,
        filesTouched: Object.keys(result.files),
      });
      setRightTab('preview');
    } finally {
      setIsBuilding(false);
    }
  }

  async function handleLspCheck() {
    const ext = activeFile.split('.').pop()?.toLowerCase() || '';
    const lang =
      ext === 'py' ? 'python' : ext === 'json' ? 'json' : ext === 'yml' || ext === 'yaml' ? 'yaml' : 'javascript';
    try {
      const res = await fetch('/api/v1/lsp/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, code: files[activeFile] || '' }),
      });
      setLspResult(JSON.stringify(await res.json(), null, 2));
    } catch {
      setLspResult('Control Plane (:7000) offline. Start via `python devhub.py studio`.');
    }
  }

  async function handleRunTerminal(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const cmd = termCmd.trim();
    if (!cmd) return;
    setTermOutput((prev) => `${prev}$ ${cmd}\n`);
    try {
      const res = await fetch('/api/v1/terminal/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      setTermOutput(
        (prev) => `${prev}${data.stdout || ''}${data.stderr || ''}[exit=${data.exit_code} | ${data.duration_ms}ms]\n\n`
      );
    } catch {
      setTermOutput((prev) => `${prev}[ERROR] Control Plane (:7000) unreachable. Start via python devhub.py studio.\n\n`);
    }
  }

  async function handleDeployPlan() {
    try {
      const res = await fetch('/api/v1/deploy/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: deployProvider, service_name: 'uniforge-workbench-app', region: 'us-central1' }),
      });
      setDeployPlan(JSON.stringify(await res.json(), null, 2));
    } catch {
      setDeployPlan('Control Plane (:7000) unreachable. Run `python devhub.py deploy --provider ' + deployProvider + '`.');
    }
  }

  function handleExportBundle() {
    const blob = new Blob([JSON.stringify({ platform: 'UNIFORGE AI Workbench', files }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uniforge-workspace-bundle.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const previewWidthClass =
    viewport === 'mobile' ? 'max-w-[390px] mx-auto' : viewport === 'tablet' ? 'max-w-[768px] mx-auto' : 'w-full';

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top UNIFORGE Brand Header */}
      <header className="h-14 shrink-0 px-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-7 h-7">
            <defs>
              <linearGradient id="ufg-hd" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="url(#ufg-hd)" />
            <path
              d="M9 8h4.5v9.5c0 2.2 1.2 3.5 2.5 3.5s2.5-1.3 2.5-3.5V8H23v9.8c0 4.5-2.9 7.2-7 7.2s-7-2.7-7-7.2V8Z"
              fill="#ffffff"
            />
          </svg>
          <span className="text-base font-extrabold tracking-tight text-white">UNIFORGE</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            AI Workbench
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as WorkbenchMode)}
            className="rounded-lg bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-sky-300 font-semibold"
          >
            <option value="factory-5layer">Engine: 5-Layer Software Factory</option>
            <option value="autonomous-team">Engine: Autonomous AI Team</option>
            <option value="local-rag">Engine: Offline Local RAG Brain</option>
          </select>

          <button
            onClick={handleExportBundle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          <button
            onClick={() => setRightTab('deploy')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
          >
            <Cloud className="w-3.5 h-3.5" /> Deploy
          </button>
        </div>
      </header>

      {/* Main Split-Screen Workbench */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT PANE: AI Prompt & Engineering Chat */}
        <aside className="w-full md:w-[400px] lg:w-[440px] shrink-0 border-r border-slate-800 flex flex-col bg-slate-950">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                  m.role === 'user'
                    ? 'bg-blue-600/15 border-blue-500/30 text-blue-100 ml-6'
                    : 'bg-slate-900 border-slate-800 text-slate-200 mr-2'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 font-semibold uppercase">
                  <span>{m.role === 'user' ? 'You' : 'UNIFORGE AI'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
                {m.filesTouched && m.filesTouched.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {m.filesTouched.map((fname) => (
                      <button
                        key={fname}
                        onClick={() => {
                          setActiveFile(fname);
                          setRightTab('code');
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-sky-400"
                      >
                        <FileCode2 className="w-3 h-3" /> {fname}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Starter Prompt Chips */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {STARTER_PROMPTS.map((sp, i) => (
              <button
                key={i}
                onClick={() => handleSendPrompt(sp)}
                className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white truncate max-w-full"
              >
                <Sparkles className="w-3 h-3 inline mr-1 text-sky-400" />
                {sp}
              </button>
            ))}
          </div>

          {/* Prompt Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="p-3 border-t border-slate-800 bg-slate-900/60"
          >
            <div className="flex gap-2">
              <input
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe what UNIFORGE should build..."
                className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isBuilding}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> {isBuilding ? 'Building' : 'Build'}
              </button>
            </div>
          </form>
        </aside>

        {/* RIGHT PANE: Preview / Code Editor / Terminal / Cloud Deploy */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
          {/* Workbench Toolbar */}
          <div className="h-11 shrink-0 px-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {[
                { id: 'preview', label: 'Live Preview', icon: Eye },
                { id: 'code', label: 'Code & LSP', icon: Code2 },
                { id: 'terminal', label: 'Terminal', icon: Terminal },
                { id: 'deploy', label: 'Cloud Deploy', icon: Cloud },
              ].map((t) => {
                const Icon = t.icon;
                const active = rightTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setRightTab(t.id as typeof rightTab)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {t.label}
                  </button>
                );
              })}
            </div>

            {rightTab === 'preview' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  title="Desktop Viewport"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1.5 rounded ${viewport === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  title="Tablet Viewport"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  title="Mobile Viewport"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={bumpPreview}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Reload Live Preview"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {rightTab === 'preview' && (
              <div className="h-full w-full p-3 bg-slate-950">
                <iframe
                  key={previewNonce}
                  title="UNIFORGE Live App Preview"
                  sandbox="allow-scripts allow-forms allow-modals"
                  srcDoc={srcDoc}
                  className={`h-full ${previewWidthClass} rounded-xl border border-slate-800 bg-slate-950 block`}
                />
              </div>
            )}

            {rightTab === 'code' && (
              <div className="h-full flex min-h-0">
                <div className="w-52 shrink-0 border-r border-slate-800 bg-slate-900/50 p-2 overflow-y-auto space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-500 px-2 py-1">Workspace Files</div>
                  {Object.keys(files).map((fname) => (
                    <button
                      key={fname}
                      onClick={() => setActiveFile(fname)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono truncate flex items-center gap-1.5 ${
                        activeFile === fname ? 'bg-blue-600/20 text-sky-300 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <FileCode2 className="w-3.5 h-3.5 shrink-0" /> {fname}
                    </button>
                  ))}
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-sky-400">{activeFile}</span>
                    <button
                      onClick={handleLspCheck}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Run LSP Diagnostics
                    </button>
                  </div>
                  <textarea
                    value={files[activeFile] || ''}
                    onChange={(e) => updateFile(activeFile, e.target.value)}
                    spellCheck={false}
                    className="flex-1 w-full bg-slate-950 text-slate-100 p-4 font-mono text-xs focus:outline-none resize-none"
                  />
                  {lspResult && (
                    <pre className="h-32 overflow-auto border-t border-slate-800 bg-slate-900 p-3 text-[11px] text-emerald-300 font-mono">
                      {lspResult}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {rightTab === 'terminal' && (
              <div className="h-full flex flex-col p-4 gap-3">
                <pre className="flex-1 overflow-auto rounded-xl bg-black border border-slate-800 p-4 text-xs text-emerald-400 font-mono whitespace-pre-wrap">
                  {termOutput}
                </pre>
                <form onSubmit={handleRunTerminal} className="flex gap-2">
                  <input
                    value={termCmd}
                    onChange={(e) => setTermCmd(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white font-mono"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                  >
                    <Play className="w-3.5 h-3.5" /> Execute
                  </button>
                </form>
              </div>
            )}

            {rightTab === 'deploy' && (
              <div className="h-full overflow-y-auto p-6 space-y-4">
                <h2 className="text-lg font-bold text-white">UNIFORGE One-Click Production Cloud Deploy</h2>
                <p className="text-xs text-slate-400">
                  Ship your generated workspace directly to GCP Cloud Run, AWS App Runner, Cloudflare Pages, or UNIFORGE Cloud Kubernetes.
                </p>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={deployProvider}
                    onChange={(e) => setDeployProvider(e.target.value)}
                    className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  >
                    <option value="gcp">GCP Cloud Run</option>
                    <option value="aws">AWS App Runner / ECS</option>
                    <option value="cloudflare">Cloudflare Pages / Workers</option>
                    <option value="uniforge-cloud">UNIFORGE Cloud Helm K8s</option>
                  </select>
                  <button
                    onClick={handleDeployPlan}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                  >
                    Generate Production Deploy Plan
                  </button>
                </div>
                {deployPlan && (
                  <pre className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-xs text-emerald-300 overflow-x-auto">
                    {deployPlan}
                  </pre>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

