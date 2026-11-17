import React, { useMemo, useState } from 'react';
import { computeLineDiff } from '../lib/diffEngine';
import { FileDiff, RotateCcw } from 'lucide-react';

interface DiffViewProps {
  baselineFiles: Record<string, string>;
  currentFiles: Record<string, string>;
  onRevertFile: (path: string) => void;
}

export const DiffView: React.FC<DiffViewProps> = ({ baselineFiles, currentFiles, onRevertFile }) => {
  const allPaths = useMemo(
    () => Array.from(new Set([...Object.keys(baselineFiles), ...Object.keys(currentFiles)])).sort(),
    [baselineFiles, currentFiles]
  );

  const changedPaths = useMemo(
    () => allPaths.filter((p) => (baselineFiles[p] ?? '') !== (currentFiles[p] ?? '')),
    [allPaths, baselineFiles, currentFiles]
  );

  const [selected, setSelected] = useState<string>(changedPaths[0] || allPaths[0] || '');
  const activePath = changedPaths.includes(selected) ? selected : changedPaths[0] || allPaths[0] || '';

  const diff = useMemo(
    () => computeLineDiff(baselineFiles[activePath] ?? '', currentFiles[activePath] ?? ''),
    [baselineFiles, currentFiles, activePath]
  );

  return (
    <div className="h-full flex min-h-0 bg-slate-950">
      <div className="w-56 shrink-0 border-r border-slate-800 bg-slate-900/50 p-2 overflow-y-auto space-y-1">
        <div className="text-[10px] font-bold uppercase text-slate-500 px-2 py-1">
          Modified Files ({changedPaths.length})
        </div>
        {changedPaths.length === 0 && (
          <div className="px-2 py-3 text-xs text-slate-500">No changes since last checkpoint.</div>
        )}
        {changedPaths.map((p) => (
          <button
            key={p}
            onClick={() => setSelected(p)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono truncate flex items-center gap-1.5 ${
              activePath === p ? 'bg-blue-600/20 text-sky-300 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileDiff className="w-3.5 h-3.5 shrink-0 text-amber-400" /> {p}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-white font-semibold">{activePath || '—'}</span>
            <span className="text-emerald-400">+{diff.additions}</span>
            <span className="text-rose-400">-{diff.deletions}</span>
          </div>
          {activePath && changedPaths.includes(activePath) && (
            <button
              onClick={() => onRevertFile(activePath)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-600 text-xs text-slate-200 font-semibold transition"
            >
              <RotateCcw className="w-3 h-3" /> Revert File
            </button>
          )}
        </div>
        <div className="flex-1 overflow-auto font-mono text-[11px] leading-5">
          {diff.lines.map((ln, idx) => {
            const bg =
              ln.type === 'added'
                ? 'bg-emerald-500/15 text-emerald-200'
                : ln.type === 'removed'
                ? 'bg-rose-500/15 text-rose-200'
                : 'text-slate-400';
            const prefix = ln.type === 'added' ? '+' : ln.type === 'removed' ? '-' : ' ';
            return (
              <div key={idx} className={`flex px-3 ${bg}`}>
                <span className="w-8 shrink-0 text-slate-600 select-none">{ln.oldLine ?? ''}</span>
                <span className="w-8 shrink-0 text-slate-600 select-none">{ln.newLine ?? ''}</span>
                <span className="w-4 shrink-0 font-bold select-none">{prefix}</span>
                <span className="whitespace-pre">{ln.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

