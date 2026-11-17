import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studioApi } from './api/studioClient';
import { ConsoleTab, useHubStore } from './store/useStore';
import { CommandPalette } from './components/CommandPalette';
import { EventsAndObservabilityView, FactoryView, IdentityAndSecretsView, OverviewView } from './components/CoreViews';
import { ExecutionStudioView, IntelligenceView, TechnologyUniverseView } from './components/StudioViews';
import {
  Activity,
  Brain,
  Command,
  Factory,
  Layers,
  Lock,
  Package,
  Terminal,
} from 'lucide-react';

const NAV_ITEMS: Array<{ id: ConsoleTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'overview', label: '15-System OS Map', icon: Layers },
  { id: 'factory', label: '5-Layer Software Factory', icon: Factory },
  { id: 'intelligence', label: 'AI Brain & Local RAG', icon: Brain },
  { id: 'execution', label: 'PTY, LSP & API Studio', icon: Terminal },
  { id: 'events-obs', label: 'Event Bus & Observability', icon: Activity },
  { id: 'identity-secrets', label: 'Identity, RBAC & Vault', icon: Lock },
  { id: 'universe', label: 'Tech Universe & Deploy', icon: Package },
];

export default function App() {
  const { activeTab, setActiveTab, activeProfile, setProfile, activeRole, setActiveRole, setCommandPaletteOpen } = useHubStore();
  const statusQ = useQuery({ queryKey: ['status'], queryFn: studioApi.getStatus, retry: 1 });

  const isConnected = statusQ.isSuccess && statusQ.data?.status === 'OPERATIONAL';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <CommandPalette />

      {/* Top Architecture Flow Ribbon */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-1.5 text-slate-400">
          <span className="text-sky-400 font-semibold">Engineer</span>
          <span>&rarr;</span>
          <span className="text-white font-semibold">React Console (:3000)</span>
          <span>&rarr;</span>
          <span className={isConnected ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
            Studio API (:7000 {isConnected ? 'CONNECTED' : 'OFFLINE'})
          </span>
          <span>&rarr;</span>
          <span className="text-purple-400">Identity ({activeRole})</span>
          <span>&rarr;</span>
          <span className="text-sky-400">Event Bus</span>
          <span>&rarr;</span>
          <span className="text-emerald-400">Shared SQLite DB + Observability</span>
        </div>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
        >
          <Command className="w-3 h-3" /> Ctrl+K Palette
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-6">
        {/* Main Header */}
        <header className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Layers className="w-6 h-6" />
              </span>
              UNIFORGE Master Web Control Center
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                v{statusQ.data?.version || '2.1.0'}
              </span>
            </h1>
            <p className="text-slate-400 mt-1 text-xs">
              React 18 + TypeScript + Zustand Console State + TanStack Query &bull; Live Connected to Studio API (:7000)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as typeof activeRole)}
              className="rounded-lg bg-slate-900 border border-purple-500/40 px-3 py-1.5 text-xs font-semibold text-purple-300"
              title="Switch Active RBAC Identity Persona"
            >
              <option value="admin">Role: Platform Admin</option>
              <option value="architect">Role: Principal Architect</option>
              <option value="coder-agent">Role: Coder Agent (AI)</option>
              <option value="qa-agent">Role: QA / SRE Agent (AI)</option>
              <option value="viewer">Role: Read-Only Viewer</option>
            </select>

            {(['Local-Dev', 'Staging', 'Production'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeProfile === p
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </header>

        {/* Navigation Bar */}
        <nav className="flex flex-wrap gap-2 mb-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Active View */}
        <main>
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'factory' && <FactoryView />}
          {activeTab === 'intelligence' && <IntelligenceView />}
          {activeTab === 'execution' && <ExecutionStudioView />}
          {activeTab === 'events-obs' && <EventsAndObservabilityView />}
          {activeTab === 'identity-secrets' && <IdentityAndSecretsView />}
          {activeTab === 'universe' && <TechnologyUniverseView />}
        </main>
      </div>
    </div>
  );
}
