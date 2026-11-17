import React from 'react';
import { useHubStore } from './store/useStore';
import { Activity, Cpu, Database, Layers, ShieldCheck, Terminal } from 'lucide-react';

export default function App() {
  const { connectedNodes, toggleNode, activeProfile, setProfile } = useHubStore();

  const services = [
    { id: 'spring-api', name: 'Spring Boot 3 API', port: '8080', icon: Cpu, type: 'Backend' },
    { id: 'fastapi', name: 'FastAPI AI Engine', port: '8000', icon: Terminal, type: 'AI Service' },
    { id: 'postgres', name: 'PostgreSQL + pgvector', port: '5432', icon: Database, type: 'Data' },
    { id: 'grafana', name: 'Observability & Metrics', port: '3001', icon: Activity, type: 'Telemetry' },
    { id: 'qdrant', name: 'Qdrant Vector DB', port: '6333', icon: Layers, type: 'Vector Store' },
    { id: 'langfuse', name: 'Langfuse Tracing', port: '3002', icon: ShieldCheck, type: 'LLM Ops' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Layers className="w-7 h-7" />
            </span>
            Universal Dev Hub Console
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Unified Polyglot Architecture &bull; Full-Stack React + Zustand + TanStack Query
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          {['Production', 'Staging', 'Local-Dev'].map((p) => (
            <button
              key={p}
              onClick={() => setProfile(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
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

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => {
          const Icon = svc.icon;
          const isOnline = connectedNodes.includes(svc.id);
          return (
            <div
              key={svc.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-800/40 backdrop-blur hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60 text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isOnline
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  {isOnline ? 'Active' : 'Standby'}
                </span>
              </div>
              <h2 className="text-base font-semibold text-white">{svc.name}</h2>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Port: :{svc.port}</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{svc.type}</span>
              </div>
              <button
                onClick={() => toggleNode(svc.id)}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white transition"
              >
                {isOnline ? 'Toggle Standby' : 'Connect Service'}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
