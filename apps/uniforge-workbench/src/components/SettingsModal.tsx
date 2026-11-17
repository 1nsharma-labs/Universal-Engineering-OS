import React, { useEffect, useState } from 'react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { KeyRound, Radio, Settings, ShieldCheck, X } from 'lucide-react';

interface ProviderInfo {
  id: string;
  name: string;
  requiresKey: boolean;
  envKey?: string;
  models: string[];
  description: string;
  configured: boolean;
}

export const SettingsModal: React.FC = () => {
  const { settingsOpen, setSettingsOpen, provider, model, apiKey, ollamaUrl, setProviderConfig } = useWorkbenchStore();
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [events, setEvents] = useState<Array<{ id: string; topic: string; source: string; actor: string }>>([]);
  const [vaultStatus, setVaultStatus] = useState('');
  const [tab, setTab] = useState<'providers' | 'events'>('providers');

  useEffect(() => {
    if (!settingsOpen) return;
    fetch('/api/v1/workbench/providers')
      .then((r) => r.json())
      .then((d) => setProviders(d.providers || []))
      .catch(() => {});
    fetch('/api/v1/events?limit=20')
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => {});
  }, [settingsOpen]);

  if (!settingsOpen) return null;

  const activeProvider = providers.find((p) => p.id === provider);

  async function saveKeyToVault() {
    if (!apiKey.trim() || !activeProvider?.envKey) return;
    try {
      const res = await fetch('/api/v1/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: activeProvider.envKey, value: apiKey.trim(), scope: 'workbench', actor: 'admin' }),
      });
      const data = await res.json();
      setVaultStatus(data.ok ? `Saved ${data.key} (${data.masked_preview}) to UNIFORGE Secrets Vault.` : data.error);
    } catch {
      setVaultStatus('Control Plane (:7000) offline; API key will be sent directly with requests.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Settings className="w-4 h-4 text-sky-400" /> UNIFORGE AI Workbench Settings
          </div>
          <button onClick={() => setSettingsOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pt-3 flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setTab('providers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${tab === 'providers' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            LLM Providers &amp; Vault
          </button>
          <button
            onClick={() => setTab('events')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${tab === 'events' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Live Event Bus Logs
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          {tab === 'providers' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Active LLM Provider</label>
                  <select
                    value={provider}
                    onChange={(e) => {
                      const nextP = providers.find((x) => x.id === e.target.value);
                      setProviderConfig({ provider: e.target.value, model: nextP?.models[0] || '' });
                    }}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
                  >
                    {(providers.length
                      ? providers
                      : [{ id: 'uniforge-local', name: 'UNIFORGE Native Engine (Offline)', models: ['uniforge-architect-v2'] }]
                    ).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Model</label>
                  <select
                    value={model}
                    onChange={(e) => setProviderConfig({ model: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono"
                  >
                    {(activeProvider?.models || [model]).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {provider === 'ollama' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Local Ollama Base URL</label>
                  <input
                    value={ollamaUrl}
                    onChange={(e) => setProviderConfig({ ollamaUrl: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              )}

              {activeProvider?.requiresKey && (
                <div className="space-y-2">
                  <label className="block text-xs text-slate-400">
                    Provider API Key ({activeProvider.envKey})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setProviderConfig({ apiKey: e.target.value })}
                      placeholder="Paste API key (stored masked in UNIFORGE Secrets Vault)..."
                      className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={saveKeyToVault}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Save to Vault
                    </button>
                  </div>
                  {vaultStatus && <div className="text-xs text-emerald-400">{vaultStatus}</div>}
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                Zero-Trust Mode: If no external API key or Ollama daemon is reachable, UNIFORGE automatically falls back to its built-in Offline 5-Layer Synthesizer.
              </div>
            </>
          )}

          {tab === 'events' && (
            <div className="space-y-2">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-400" /> Recent UNIFORGE Universal Event Bus Stream
              </div>
              {events.map((ev) => (
                <div key={ev.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex justify-between font-mono">
                  <span className="text-sky-400">{ev.topic}</span>
                  <span className="text-slate-500">{ev.source} &bull; {ev.actor}</span>
                </div>
              ))}
              {events.length === 0 && <div className="text-xs text-slate-500">No events recorded yet.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

