import React, { useState } from 'react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { GitBranch, History, MessageSquarePlus, RotateCcw, Settings, Trash2, X } from 'lucide-react';

export const SidebarHistory: React.FC = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    sessions,
    activeSessionId,
    createNewSession,
    selectSession,
    deleteSession,
    restoreSnapshot,
    applyFilesRespectingLocks,
    addMessage,
    setSettingsOpen,
    setRightView,
  } = useWorkbenchStore();

  const [repoUrl, setRepoUrl] = useState('https://github.com/1nsharma-labs/Universal-Engineering-OS');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  if (!sidebarOpen) return null;

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  async function handleImportGitHub() {
    if (!repoUrl.trim()) return;
    setImporting(true);
    setImportMsg('');
    try {
      const res = await fetch('/api/v1/workbench/import-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl.trim(), max_files: 10 }),
      });
      const data = await res.json();
      if (data.ok && data.files) {
        const { applied } = applyFilesRespectingLocks(data.files);
        addMessage({
          role: 'assistant',
          content: `Imported **${applied.length} files** from GitHub repository \`${data.repo}\` into your UNIFORGE workspace.`,
        });
        setImportMsg(`Imported ${applied.length} files from ${data.repo}.`);
        setRightView('code');
      } else {
        setImportMsg(data.error || 'Import failed.');
      }
    } catch {
      setImportMsg('Control Plane (:7000) offline.');
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="w-80 max-w-[85vw] h-full bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="font-extrabold text-sm text-white">UNIFORGE Workspaces</span>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 border-b border-slate-800">
          <button
            onClick={() => {
              createNewSession();
              setSidebarOpen(false);
            }}
            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center justify-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" /> New AI Workspace Chat
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase text-slate-500 px-1">Recent Chats ({sessions.length})</div>
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs cursor-pointer ${
                  s.id === activeSessionId
                    ? 'bg-blue-600/15 border-blue-500/40 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
                onClick={() => {
                  selectSession(s.id);
                  setSidebarOpen(false);
                }}
              >
                <div className="min-w-0">
                  <div className="font-semibold truncate">{s.title}</div>
                  <div className="text-[10px] text-slate-500">{s.updatedAt} &bull; {Object.keys(s.files).length} files</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(s.id);
                  }}
                  className="text-slate-500 hover:text-rose-400 shrink-0"
                  title="Delete Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Checkpoints / Snapshots */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase text-slate-500 px-1 flex items-center gap-1">
              <History className="w-3 h-3" /> Workspace Checkpoints ({activeSession.snapshots.length})
            </div>
            {activeSession.snapshots.map((snap) => (
              <div key={snap.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                <div className="min-w-0">
                  <div className="text-slate-200 truncate">{snap.label}</div>
                  <div className="text-[10px] text-slate-500">{snap.createdAt}</div>
                </div>
                <button
                  onClick={() => {
                    restoreSnapshot(snap.id);
                    setSidebarOpen(false);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-200 text-[10px] font-semibold inline-flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" /> Restore
                </button>
              </div>
            ))}
          </div>

          {/* GitHub Repo Importer */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" /> Import GitHub Repository
            </div>
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-[11px] text-white font-mono"
            />
            <button
              onClick={handleImportGitHub}
              disabled={importing}
              className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
            >
              {importing ? 'Importing...' : 'Clone into Workbench'}
            </button>
            {importMsg && <div className="text-[11px] text-sky-400">{importMsg}</div>}
          </div>
        </div>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => {
              setSidebarOpen(false);
              setSettingsOpen(true);
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" /> Providers, Vault &amp; Event Logs
          </button>
        </div>
      </div>
      <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
    </div>
  );
};

