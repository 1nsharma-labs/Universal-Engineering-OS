import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studioApi } from '../api/studioClient';
import { useHubStore } from '../store/useStore';
import { Activity, CheckCircle2, Database, Factory, KeyRound, Lock, Plus, Radio, ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { activeRole } = useHubStore();
  const qc = useQueryClient();
  const statusQ = useQuery({ queryKey: ['status'], queryFn: studioApi.getStatus });
  const obsQ = useQuery({ queryKey: ['observability'], queryFn: studioApi.getObservability, refetchInterval: 8000 });
  const projQ = useQuery({ queryKey: ['projects'], queryFn: studioApi.listProjects });

  const [projName, setProjName] = useState('');
  const [projStack, setProjStack] = useState('React + FastAPI + PostgreSQL pgvector');

  const createProj = useMutation({
    mutationFn: () => studioApi.createProject({ name: projName, stack: projStack, owner_role: activeRole }),
    onSuccess: () => {
      setProjName('');
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const status = statusQ.data;
  const obs = obsQ.data;

  return (
    <div className="space-y-6">
      {/* Live Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Core Tech Registry', value: status?.registered_technologies ?? '—', sub: '15 Domains' },
          { label: 'Universal Wiki', value: status?.wiki_profiles_count ?? '—', sub: '10-Point Profiles' },
          { label: 'Official Plugins', value: status?.official_plugins_count ?? '—', sub: '@uniforge/plugin-sdk' },
          { label: 'API Latency (p95)', value: obs ? `${obs.p95_latency_ms} ms` : '—', sub: `${obs?.requests_total ?? 0} reqs` },
          { label: 'Local AI Spend', value: '$0.00', sub: '100% Local-First' },
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">{m.label}</div>
            <div className="text-2xl font-extrabold text-white mt-1">{m.value}</div>
            <div className="text-[11px] text-sky-400 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* 15 Interconnected OS Subsystems */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            15 Interconnected UNIFORGE OS Subsystems (Live Health)
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {obs?.subsystems.length ?? 15} / 15 ONLINE
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(obs?.subsystems || []).map((s) => (
            <div key={s.id} className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-200">{s.name}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Data Layer: Persistent Projects */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-400" />
            Shared Data Layer — Persistent Projects ({projQ.data?.count ?? 0})
          </h2>
          <span className="text-xs text-slate-400 font-mono">SQLite ACID Store: {obs?.shared_db_path ?? '.uniforge-state.db'}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            value={projName}
            onChange={(e) => setProjName(e.target.value)}
            placeholder="New Project Name (e.g. AI Video Editor)..."
            className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
          />
          <input
            value={projStack}
            onChange={(e) => setProjStack(e.target.value)}
            placeholder="Tech Stack..."
            className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
          />
          <button
            onClick={() => projName.trim() && createProj.mutate()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white"
          >
            <Plus className="w-3.5 h-3.5" /> Create Project (as {activeRole})
          </button>
        </div>
        {createProj.data && !createProj.data.ok && (
          <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
            {createProj.data.error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(projQ.data?.projects || []).map((p) => (
            <div key={p.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{p.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">{p.status}</span>
              </div>
              <div className="text-xs text-sky-400 mt-1">{p.stack}</div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">ID: {p.id} &bull; Owner: {p.owner_role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FactoryView: React.FC = () => {
  const { activeRole } = useHubStore();
  const qc = useQueryClient();
  const [prompt, setPrompt] = useState('Build a video editing AI web app in Python FastAPI and React with PostgreSQL');
  const [cloud, setCloud] = useState('gcp');
  const [job, setJob] = useState<Record<string, any> | null>(null);
  const [dist, setDist] = useState<Record<string, any> | null>(null);

  const assembleMut = useMutation({
    mutationFn: () => studioApi.assembleFactory(prompt, cloud),
    onSuccess: (data) => {
      setJob(data);
      setDist(null);
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const approveMut = useMutation({
    mutationFn: () => studioApi.approveFactory(job!.job_id, activeRole),
    onSuccess: (data) => {
      setDist(data);
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Factory className="w-5 h-5 text-emerald-400" />
              5-Layer Self-Assembling AI Software Factory
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Central Hub &rarr; AI Router &rarr; 3 Ephemeral Containers &rarr; Automated QA &amp; Human Gate &rarr; Global Cloud Distribution
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="md:col-span-2 rounded-xl bg-slate-950 border border-slate-700 px-4 py-2.5 text-sm text-white"
          />
          <select value={cloud} onChange={(e) => setCloud(e.target.value)} className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white">
            <option value="gcp">GCP Cloud Run</option>
            <option value="aws">AWS App Runner</option>
            <option value="cloudflare">Cloudflare Edge</option>
            <option value="uniforge-cloud">UNIFORGE Cloud K8s</option>
          </select>
          <button
            onClick={() => assembleMut.mutate()}
            disabled={assembleMut.isPending}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            {assembleMut.isPending ? 'Assembling...' : 'Run 5-Layer Factory'}
          </button>
        </div>

        {job && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {(job.layers as Array<Record<string, any>>).map((l) => {
                const statusText = l.layer === 5 && dist ? 'DISTRIBUTED' : l.status;
                const ok = statusText.includes('COMPLETED') || statusText.includes('DISTRIBUTED');
                return (
                  <div key={l.layer} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[11px] font-mono text-sky-400">LAYER {l.layer}</div>
                    <div className="text-xs font-bold text-white">{l.name}</div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${ok ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-300'}`}>
                      {statusText}
                    </span>
                  </div>
                );
              })}
            </div>

            {!dist && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-amber-200">
                  <strong>Human-in-the-Loop Gate (Layer 4):</strong> Staging preview ready at{' '}
                  <span className="font-mono text-sky-300">{job.layers[3].staging_preview_url}</span>
                </div>
                <button
                  onClick={() => approveMut.mutate()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Approve &amp; Distribute Globally (Layer 5)
                </button>
              </div>
            )}

            {dist && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Distributed live to <span className="font-mono text-white">{dist.layer5_distribution?.cdn_edge_url}</span> (Image:{' '}
                <span className="font-mono">{dist.layer5_distribution?.production_container_image}</span>)
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-emerald-300">
                {job.layers[2].docker_compose_yaml}
              </pre>
              <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-sky-300">
                {JSON.stringify(dist || job.layers[2].ephemeral_workers, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const EventsAndObservabilityView: React.FC = () => {
  const { activeRole } = useHubStore();
  const qc = useQueryClient();
  const eventsQ = useQuery({ queryKey: ['events'], queryFn: () => studioApi.listEvents(30), refetchInterval: 5000 });
  const obsQ = useQuery({ queryKey: ['observability'], queryFn: studioApi.getObservability, refetchInterval: 5000 });
  const [topic, setTopic] = useState('deployment.canary_verified');

  const pubMut = useMutation({
    mutationFn: () =>
      studioApi.publishEvent({
        topic,
        source: 'react-console',
        actor: activeRole,
        payload: { origin: 'React+TS Control Center', status: 'ok' },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400" /> Universal Event Bus
          </h2>
          <span className="text-xs text-slate-400">{eventsQ.data?.count ?? 0} recent events</span>
        </div>
        <div className="flex gap-2">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono" />
          <button onClick={() => pubMut.mutate()} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white">
            Publish Event
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {(eventsQ.data?.events || []).map((ev) => (
            <div key={ev.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="font-mono font-bold text-sky-400">{ev.topic}</span>
                <span className="text-slate-500">{ev.source} &bull; {ev.actor}</span>
              </div>
              <pre className="text-[11px] text-slate-400 mt-1 overflow-x-auto">{JSON.stringify(ev.payload)}</pre>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" /> Observability Engine Telemetry
        </h2>
        {obsQ.data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Uptime</div>
                <div className="text-lg font-bold text-white">{obsQ.data.uptime_seconds}s</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Error Rate</div>
                <div className="text-lg font-bold text-emerald-400">{obsQ.data.error_rate_percent}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Avg Latency</div>
                <div className="text-lg font-bold text-sky-400">{obsQ.data.avg_latency_ms} ms</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">p95 Latency</div>
                <div className="text-lg font-bold text-amber-300">{obsQ.data.p95_latency_ms} ms</div>
              </div>
            </div>
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-1.5">
              <div className="text-xs font-semibold text-slate-400 uppercase">Top Hot API Endpoints</div>
              {obsQ.data.top_endpoints.map((ep) => (
                <div key={ep.path} className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{ep.path}</span>
                  <span className="text-sky-400">{ep.hits} hits</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const IdentityAndSecretsView: React.FC = () => {
  const { activeRole } = useHubStore();
  const qc = useQueryClient();
  const policiesQ = useQuery({ queryKey: ['policies'], queryFn: studioApi.getIdentityPolicies });
  const secretsQ = useQuery({ queryKey: ['secrets'], queryFn: studioApi.listSecrets });

  const [testAction, setTestAction] = useState('secrets:write');
  const [permResult, setPermResult] = useState<Record<string, any> | null>(null);
  const [secKey, setSecKey] = useState('OPENAI_API_KEY');
  const [secVal, setSecVal] = useState('');

  const checkMut = useMutation({
    mutationFn: () => studioApi.checkPermission(activeRole, testAction),
    onSuccess: (res) => {
      setPermResult(res);
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const setSecMut = useMutation({
    mutationFn: () => studioApi.setSecret({ key: secKey, value: secVal, scope: 'workspace', actor: activeRole }),
    onSuccess: () => {
      setSecVal('');
      qc.invalidateQueries({ queryKey: ['secrets'] });
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const delSecMut = useMutation({
    mutationFn: (key: string) => studioApi.deleteSecret(key, activeRole),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['secrets'] }),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Identity &amp; RBAC Policy Engine
        </h2>
        <div className="flex gap-2">
          <select value={testAction} onChange={(e) => setTestAction(e.target.value)} className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono">
            <option value="secrets:write">secrets:write</option>
            <option value="factory:approve">factory:approve</option>
            <option value="factory:assemble">factory:assemble</option>
            <option value="sandbox:exec">sandbox:exec</option>
            <option value="projects:write">projects:write</option>
            <option value="rag:query">rag:query</option>
          </select>
          <button onClick={() => checkMut.mutate()} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white">
            Test Policy ({activeRole})
          </button>
        </div>
        {permResult && (
          <div className={`p-3 rounded-xl text-xs border flex items-center gap-2 ${permResult.allowed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
            {permResult.allowed ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {permResult.reason}
          </div>
        )}
        <div className="space-y-2">
          {(policiesQ.data?.roles || []).map((r) => (
            <div key={r.role} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{r.label}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-mono">{r.type}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{r.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" /> Secrets Vault (Masked &amp; Audited)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input value={secKey} onChange={(e) => setSecKey(e.target.value)} placeholder="KEY_NAME" className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono" />
          <input type="password" value={secVal} onChange={(e) => setSecVal(e.target.value)} placeholder="Secret value..." className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white" />
          <button onClick={() => secVal && setSecMut.mutate()} className="rounded-xl bg-amber-600 hover:bg-amber-500 px-3 py-2 text-xs font-semibold text-white">
            Store Secret
          </button>
        </div>
        {setSecMut.data && !setSecMut.data.ok && (
          <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{setSecMut.data.error}</div>
        )}
        <div className="space-y-2">
          {(secretsQ.data?.secrets || []).map((s) => (
            <div key={s.key} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-mono font-bold text-white flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" /> {s.key}
                </div>
                <div className="text-slate-400 font-mono mt-0.5">{s.masked_preview} &bull; by {s.updated_by}</div>
              </div>
              <button onClick={() => delSecMut.mutate(s.key)} className="text-slate-500 hover:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(secretsQ.data?.secrets?.length ?? 0) === 0 && (
            <div className="text-xs text-slate-500 italic">No secrets stored yet. Add an API key above (stored masked, audited on the Event Bus).</div>
          )}
        </div>
      </div>
    </div>
  );
};

