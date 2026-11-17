import React, { useEffect, useState } from 'react';
import { ConsoleTab, useHubStore } from '../store/useStore';
import { Command, Search, X } from 'lucide-react';

const COMMANDS: Array<{ id: string; title: string; subtitle: string; tab: ConsoleTab }> = [
  { id: 'overview', title: '15-System OS Overview & Shared Projects', subtitle: 'Control Plane health, Architecture Flow & SQLite Projects', tab: 'overview' },
  { id: 'factory', title: '5-Layer Self-Assembling Software Factory', subtitle: 'Prompt -> Ephemeral Containers -> Human Gate -> Global Distribution', tab: 'factory' },
  { id: 'intelligence', title: 'AI Brain, Autonomous Team & Local RAG', subtitle: 'Architecture planner, multi-agent coder & offline vector search', tab: 'intelligence' },
  { id: 'execution', title: 'Execution Studio (PTY, LSP & API Runner)', subtitle: 'Run shell commands, lint code & test REST APIs live', tab: 'execution' },
  { id: 'events-obs', title: 'Universal Event Bus & Observability Engine', subtitle: 'Live event stream, request latency, error rates & AI cost tracker', tab: 'events-obs' },
  { id: 'identity-secrets', title: 'Identity / RBAC Policy & Secrets Vault', subtitle: 'Test human/agent permissions & manage masked credentials', tab: 'identity-secrets' },
  { id: 'universe', title: 'Technology Universe, Plugins & 1-Click Deploy', subtitle: '60+ technologies, 5 official plugins, marketplace & cloud deploy', tab: 'universe' },
];

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveTab } = useHubStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filtered = COMMANDS.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search className="w-4 h-4 text-sky-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any UNIFORGE subsystem (Event Bus, Factory, RAG, Vault, Terminal)..."
            className="flex-1 bg-transparent text-sm text-white focus:outline-none"
          />
          <button onClick={() => setCommandPaletteOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => {
                setActiveTab(cmd.tab);
                setCommandPaletteOpen(false);
                setQuery('');
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between transition"
            >
              <div>
                <div className="text-sm font-semibold text-white">{cmd.title}</div>
                <div className="text-xs text-slate-400">{cmd.subtitle}</div>
              </div>
              <Command className="w-3.5 h-3.5 text-slate-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

