import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Cloud,
  Code2,
  Crosshair,
  Download,
  Eye,
  FileCode2,
  FileDiff,
  FilePlus,
  Laptop,
  Lock,
  Menu,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Terminal,
  Trash2,
  Unlock,
  Wand2,
  X,
} from 'lucide-react';
import { composePreviewHtml, parseUniforgeResponse } from './lib/artifactParser';
import { useWorkbenchStore } from './store/useWorkbenchStore';
import { DiffView } from './components/DiffView';
import { SettingsModal } from './components/SettingsModal';
import { SidebarHistory } from './components/SidebarHistory';

export default function App() {
  const store = useWorkbenchStore();
  const activeSession = store.sessions.find((s) => s.id === store.activeSessionId) || store.sessions[0];
  const files = activeSession.files;

  const [promptInput, setPromptInput] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [fileSearch, setFileSearch] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [lspResult, setLspResult] = useState('');
  const [termCmd, setTermCmd] = useState('python devhub.py version');
  const [deployProvider, setDeployProvider] = useState('gcp');
  const [deployPlan, setDeployPlan] = useState('');

  const srcDoc = useMemo(
    () => composePreviewHtml(files, store.inspectorEnabled),
    [files, store.inspectorEnabled]
  );

  // Listen to live Element Inspector selections from the sandboxed preview iframe
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (ev.data?.type === 'UNIFORGE_INSPECT_SELECT') {
        const { tag, className, text } = ev.data;
        const selector = className ? `<${tag} class="${className}">` : `<${tag}>`;
        setPromptInput((prev) =>
          `${prev ? prev + ' ' : ''}Update element ${selector}${text ? ` ("${text}")` : ''} to: `
        );
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  async function handleEnhancePrompt() {
    if (!promptInput.trim() || enhancing) return;
    setEnhancing(true);
    try {
      const res = await fetch('/api/v1/workbench/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput }),
      });
      const data = await res.json();
      if (data.ok && data.enhanced) setPromptInput(data.enhanced);
    } finally {
      setEnhancing(false);
    }
  }

  async function handleSendPrompt(overridePrompt?: string) {
    const text = (overridePrompt ?? promptInput).trim();
    if (!text || store.isBuilding) return;
    setPromptInput('');
    store.saveSnapshot(`Before: ${text.slice(0, 32)}`);
    store.addMessage({ role: 'user', content: text });
    store.setIsBuilding(true);

    try {
      const res = await fetch('/api/v1/workbench/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          provider: store.provider,
          model: store.model,
          chat_mode: store.chatMode,
          api_key: store.apiKey,
          ollama_url: store.ollamaUrl,
          files,
        }),
      });
      const data = await res.json();
      const parsed = parseUniforgeResponse(data.response || '');

      const incomingFiles: Record<string, string> = {};
      for (const art of parsed.artifacts) {
        for (const act of art.actions) {
          if (act.type === 'file' && act.filePath) {
            incomingFiles[act.filePath] = act.content;
          }
        }
      }

      if (Object.keys(incomingFiles).length > 0) {
        const { skipped } = store.applyFilesRespectingLocks(incomingFiles);
        for (const art of parsed.artifacts) {
          for (const act of art.actions) {
            if (act.filePath && skipped.includes(act.filePath)) {
              act.status = 'skipped-locked';
            }
          }
        }
        store.setRightView('preview');
      }

      const meta = `${data.provider}/${data.model} • ${data.duration_ms}ms${data.fallback_note ? ` • ${data.fallback_note}` : ''}`;
      store.addMessage({
        role: 'assistant',
        content: parsed.displayMarkdown || 'Workspace updated.',
        artifacts: parsed.artifacts,
        quickActions: parsed.quickActions,
        providerMeta: meta,
      });
    } catch {
      store.addMessage({
        role: 'assistant',
        content: 'UNIFORGE Control Plane (`:7000`) is unreachable. Start it with `python devhub.py studio`.',
      });
    } finally {
      store.setIsBuilding(false);
    }
  }

  async function handleLspCheck() {
    const ext = store.activeFile.split('.').pop()?.toLowerCase() || '';
    const lang = ext === 'py' ? 'python' : ext === 'json' ? 'json' : ext === 'yml' || ext === 'yaml' ? 'yaml' : 'javascript';
    try {
      const res = await fetch('/api/v1/lsp/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, code: files[store.activeFile] || '' }),
      });
      setLspResult(JSON.stringify(await res.json(), null, 2));
    } catch {
      setLspResult('Control Plane (:7000) offline.');
    }
  }

  async function handleRunTerminal(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const cmd = termCmd.trim();
    if (!cmd) return;
    const tid = store.activeTerminalId;
    store.appendTerminalOutput(tid, `$ ${cmd}\n`);
    try {
      const res = await fetch('/api/v1/terminal/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      store.appendTerminalOutput(tid, `${data.stdout || ''}${data.stderr || ''}[exit=${data.exit_code} | ${data.duration_ms}ms]\n\n`);
    } catch {
      store.appendTerminalOutput(tid, '[ERROR] Control Plane (:7000) unreachable.\n\n');
    }
  }

  async function handleDeployPlan() {
    try {
      const res = await fetch('/api/v1/deploy/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: deployProvider, service_name: 'uniforge-prod-app', region: 'us-central1' }),
      });
      setDeployPlan(JSON.stringify(await res.json(), null, 2));
    } catch {
      setDeployPlan('Control Plane (:7000) offline.');
    }
  }

  function handleExportBundle() {
    const blob = new Blob([JSON.stringify({ platform: 'UNIFORGE AI Workbench v2', session: activeSession.title, files }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uniforge-project-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredFileNames = Object.keys(files)
    .sort()
    .filter((f) => f.toLowerCase().includes(fileSearch.toLowerCase()));

  const modifiedCount = Object.keys(files).filter((k) => files[k] !== activeSession.baselineFiles[k]).length;
  const activeTerminal = store.terminalTabs.find((t) => t.id === store.activeTerminalId) || store.terminalTabs[0];

  const previewWidthClass =
    store.viewport === 'mobile' ? 'max-w-[390px] mx-auto' : store.viewport === 'tablet' ? 'max-w-[768px] mx-auto' : 'w-full';

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      <SidebarHistory />
      <SettingsModal />

      {/* 1-Click Cloud Deploy Modal */}
      {store.deployOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white flex items-center gap-2 text-sm">
                <Cloud className="w-4 h-4 text-emerald-400" /> UNIFORGE One-Click Production Deploy
              </div>
              <button onClick={() => store.setDeployOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={deployProvider}
                onChange={(e) => setDeployProvider(e.target.value)}
                className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
              >
                <option value="gcp">GCP Cloud Run</option>
                <option value="aws">AWS App Runner / ECS</option>
                <option value="cloudflare">Cloudflare Pages / Workers</option>
                <option value="uniforge-cloud">UNIFORGE Cloud Kubernetes (Helm)</option>
              </select>
              <button onClick={handleDeployPlan} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white">
                Generate Plan
              </button>
            </div>
            {deployPlan && (
              <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-emerald-300">
                {deployPlan}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Top UNIFORGE Brand Header */}
      <header className="h-13 shrink-0 px-3 py-2 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => store.setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
            title="Workspaces, Checkpoints & GitHub Import"
          >
            <Menu className="w-4 h-4" />
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
            <defs>
              <linearGradient id="ufg-v2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="url(#ufg-v2)" />
            <path d="M9 8h4.5v9.5c0 2.2 1.2 3.5 2.5 3.5s2.5-1.3 2.5-3.5V8H23v9.8c0 4.5-2.9 7.2-7 7.2s-7-2.7-7-7.2V8Z" fill="#fff" />
          </svg>
          <span className="text-sm font-extrabold tracking-tight text-white">UNIFORGE</span>
          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Workbench v2
          </span>
          <span className="hidden lg:inline text-xs text-slate-400 truncate max-w-xs pl-2 border-l border-slate-800">
            {activeSession.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => store.setSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-sky-300 border border-slate-700"
          >
            <Settings className="w-3.5 h-3.5" /> {store.provider}
          </button>
          <button
            onClick={() => store.setTerminalOpen(!store.terminalOpen)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
              store.terminalOpen ? 'bg-slate-800 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Terminal
          </button>
          <button
            onClick={handleExportBundle}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            onClick={() => store.setDeployOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
          >
            <Cloud className="w-3.5 h-3.5" /> Deploy
          </button>
        </div>
      </header>

      {/* Main Split-Screen IDE */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT PANE: Chat + Inline Artifact Cards */}
        <aside className="w-full md:w-[390px] lg:w-[430px] shrink-0 border-r border-slate-800 flex flex-col bg-slate-950">
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {activeSession.messages.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl text-xs leading-relaxed border space-y-2.5 ${
                  m.role === 'user'
                    ? 'bg-blue-600/15 border-blue-500/30 text-blue-100 ml-6'
                    : 'bg-slate-900 border-slate-800 text-slate-200 mr-1'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
                  <span>{m.role === 'user' ? 'Engineer' : 'UNIFORGE AI'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Inline <uniforgeArtifact> Cards */}
                {m.artifacts?.map((art) => (
                  <div key={art.id} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
                      <span className="font-bold text-white text-[11px]">{art.title}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">{art.actions.length} actions</span>
                    </div>
                    <div className="p-2 space-y-1">
                      {art.actions.map((act) => (
                        <button
                          key={act.id}
                          onClick={() => {
                            if (act.filePath) {
                              store.setActiveFile(act.filePath);
                              store.setRightView('code');
                            }
                          }}
                          className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-900 flex items-center justify-between text-[11px] font-mono"
                        >
                          <span className="flex items-center gap-1.5 text-sky-400 truncate">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            {act.type === 'file' ? act.filePath : `${act.type}: ${act.content}`}
                          </span>
                          <span className="text-[10px] text-slate-500">{act.status}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* <uniforge-quick-actions> chips */}
                {m.quickActions && m.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.quickActions.map((qa, idx) => (
                      <button
                        key={idx}
                        onClick={() => qa.message && handleSendPrompt(qa.message)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/40 text-[11px] text-sky-300 transition"
                      >
                        <Sparkles className="w-3 h-3" /> {qa.label}
                      </button>
                    ))}
                  </div>
                )}

                {m.providerMeta && <div className="text-[10px] text-slate-500 font-mono">{m.providerMeta}</div>}
              </div>
            ))}
          </div>

          {/* Prompt Composer with Build/Discuss toggle & Enhance Prompt */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="p-3 border-t border-slate-800 bg-slate-900/60 space-y-2"
          >
            <div className="flex items-center justify-between text-[11px]">
              <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                <button
                  type="button"
                  onClick={() => store.setChatMode('build')}
                  className={`px-2.5 py-1 rounded-md font-semibold ${store.chatMode === 'build' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  Build
                </button>
                <button
                  type="button"
                  onClick={() => store.setChatMode('discuss')}
                  className={`px-2.5 py-1 rounded-md font-semibold ${store.chatMode === 'discuss' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                >
                  Discuss
                </button>
              </div>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={enhancing || !promptInput.trim()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-300 font-semibold"
              >
                <Wand2 className="w-3 h-3" /> {enhancing ? 'Enhancing...' : 'Enhance Prompt'}
              </button>
            </div>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt();
                  }
                }}
                placeholder={
                  store.chatMode === 'build'
                    ? 'What would you like UNIFORGE to build? (Enter to send)'
                    : 'Ask UNIFORGE an architecture or debugging question...'
                }
                className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={store.isBuilding}
                className="px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> {store.isBuilding ? '...' : 'Run'}
              </button>
            </div>
          </form>
        </aside>

        {/* RIGHT PANE: 3-Way Slider (Code | Diff | Preview) + Bottom Multi-Tab Terminal */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
          {/* Top 3-Way Workbench Toolbar */}
          <div className="h-11 shrink-0 px-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2">
            <div className="inline-flex rounded-xl bg-slate-950 p-0.5 border border-slate-800">
              {[
                { id: 'code', label: 'Code', icon: Code2 },
                { id: 'diff', label: `Diff${modifiedCount ? ` (${modifiedCount})` : ''}`, icon: FileDiff },
                { id: 'preview', label: 'Preview', icon: Eye },
              ].map((t) => {
                const Icon = t.icon;
                const active = store.rightView === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => store.setRightView(t.id as typeof store.rightView)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {t.label}
                  </button>
                );
              })}
            </div>

            {store.rightView === 'preview' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={store.toggleInspector}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    store.inspectorEnabled
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Click any element in Preview to inspect & edit with UNIFORGE AI"
                >
                  <Crosshair className="w-3.5 h-3.5" /> Inspect
                </button>
                <button onClick={() => store.setViewport('desktop')} className={`p-1.5 rounded ${store.viewport === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => store.setViewport('tablet')} className={`p-1.5 rounded ${store.viewport === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => store.setViewport('mobile')} className={`p-1.5 rounded ${store.viewport === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button onClick={store.bumpPreview} className="p-1.5 rounded text-slate-400 hover:text-white">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Active Workbench View */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {store.rightView === 'preview' && (
              <div className="h-full w-full p-3 bg-slate-950">
                <iframe
                  key={store.previewNonce}
                  title="UNIFORGE Live Preview"
                  sandbox="allow-scripts allow-forms allow-modals"
                  srcDoc={srcDoc}
                  className={`h-full ${previewWidthClass} rounded-xl border border-slate-800 bg-slate-950 block`}
                />
              </div>
            )}

            {store.rightView === 'diff' && (
              <DiffView
                baselineFiles={activeSession.baselineFiles}
                currentFiles={files}
                onRevertFile={store.revertFileToBaseline}
              />
            )}

            {store.rightView === 'code' && (
              <div className="h-full flex min-h-0">
                {/* File Tree + Search + Create + Lock */}
                <div className="w-60 shrink-0 border-r border-slate-800 bg-slate-900/50 p-2 flex flex-col gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                    <input
                      value={fileSearch}
                      onChange={(e) => setFileSearch(e.target.value)}
                      placeholder="Filter files..."
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 pl-8 pr-2 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="flex gap-1">
                    <input
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="new-file.ts"
                      className="flex-1 min-w-0 rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-[11px] text-white font-mono"
                    />
                    <button
                      onClick={() => {
                        if (newFileName.trim()) {
                          store.createFile(newFileName.trim());
                          setNewFileName('');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200"
                      title="Create File"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {filteredFileNames.map((fname) => {
                      const isLocked = store.lockedFiles.includes(fname);
                      return (
                        <div
                          key={fname}
                          className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                            store.activeFile === fname
                              ? 'bg-blue-600/20 text-sky-300 border border-blue-500/30'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                          onClick={() => store.setActiveFile(fname)}
                        >
                          <span className="truncate flex items-center gap-1.5">
                            <FileCode2 className="w-3.5 h-3.5 shrink-0" /> {fname}
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                store.toggleLockFile(fname);
                              }}
                              title={isLocked ? 'Unlock file for AI edits' : 'Lock file from AI overwrites'}
                              className={isLocked ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'}
                            >
                              {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                store.deleteFile(fname);
                              }}
                              className="text-slate-600 hover:text-rose-400"
                              title="Delete file"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Code Editor + LSP Diagnostics */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-sky-400">{store.activeFile}</span>
                    <button
                      onClick={handleLspCheck}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> LSP Check
                    </button>
                  </div>
                  <textarea
                    value={files[store.activeFile] || ''}
                    onChange={(e) => store.updateFile(store.activeFile, e.target.value)}
                    spellCheck={false}
                    className="flex-1 w-full bg-slate-950 text-slate-100 p-4 font-mono text-xs focus:outline-none resize-none"
                  />
                  {lspResult && (
                    <pre className="h-28 overflow-auto border-t border-slate-800 bg-slate-900 p-3 text-[11px] text-emerald-300 font-mono">
                      {lspResult}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Bottom Multi-Tab Terminal Drawer */}
          {store.terminalOpen && (
            <div className="h-56 shrink-0 border-t border-slate-800 bg-black flex flex-col">
              <div className="px-2 py-1 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {store.terminalTabs.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => store.setActiveTerminalId(t.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer ${
                        t.id === store.activeTerminalId ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Terminal className="w-3 h-3" /> {t.title}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          store.closeTerminalTab(t.id);
                        }}
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button onClick={store.addTerminalTab} className="p-1 text-slate-400 hover:text-white" title="New Terminal Tab">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => store.setTerminalOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="flex-1 overflow-auto p-3 text-xs text-emerald-400 font-mono whitespace-pre-wrap">
                {activeTerminal?.output}
              </pre>
              <form onSubmit={handleRunTerminal} className="p-2 border-t border-slate-800 flex gap-2 bg-slate-950">
                <input
                  value={termCmd}
                  onChange={(e) => setTermCmd(e.target.value)}
                  className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs text-white font-mono"
                />
                <button type="submit" className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white">
                  <Play className="w-3 h-3" /> Run
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
