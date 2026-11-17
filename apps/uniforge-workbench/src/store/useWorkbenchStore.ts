import { create } from 'zustand';
import { QuickActionItem, UniforgeArtifact } from '../lib/artifactParser';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  artifacts?: UniforgeArtifact[];
  quickActions?: QuickActionItem[];
  providerMeta?: string;
  timestamp: string;
}

export interface WorkspaceSnapshot {
  id: string;
  label: string;
  createdAt: string;
  files: Record<string, string>;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
  files: Record<string, string>;
  baselineFiles: Record<string, string>;
  snapshots: WorkspaceSnapshot[];
}

export interface TerminalTab {
  id: string;
  title: string;
  output: string;
}

export type RightView = 'code' | 'diff' | 'preview';
export type ViewportSize = 'desktop' | 'tablet' | 'mobile';
export type ChatMode = 'build' | 'discuss';

const STORAGE_KEY = 'uniforge_workbench_v2_state';

const INITIAL_FILES: Record<string, string> = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UNIFORGE AI Workbench</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="hero">
    <span class="badge">UNIFORGE AI WORKBENCH v2 • UNIVERSAL ENGINEERING OS</span>
    <h1>Prompt. Stream. Inspect. Ship.</h1>
    <p>100% self-owned full-stack AI IDE with native &lt;uniforgeArtifact&gt; streaming, multi-provider LLMs, live diff view, element inspector, checkpoints, and 1-click cloud deploy.</p>
    <div class="grid">
      <div class="card"><h3>8 LLM Providers + Offline</h3><p>Ollama, OpenAI, Claude, Gemini, DeepSeek, Groq, OpenRouter &amp; UNIFORGE Native Engine.</p></div>
      <div class="card"><h3>Code &bull; Diff &bull; Preview</h3><p>Inspect elements visually, review line-by-line diffs, lock files &amp; restore checkpoints.</p></div>
      <div class="card"><h3>GitHub &amp; Cloud Ready</h3><p>Import any GitHub repo, run terminal commands &amp; ship to GCP, AWS, Cloudflare or K8s.</p></div>
    </div>
    <button id="demo-btn">Test Interactive Runtime</button>
    <div id="demo-out" class="out"></div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
  'styles.css': `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Inter, system-ui, sans-serif; background: radial-gradient(circle at top right, #0f172a, #020617 70%); color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
.hero { max-width: 840px; text-align: center; }
.badge { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; padding: 6px 14px; border-radius: 999px; background: rgba(37, 99, 235, 0.16); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.35); margin-bottom: 1rem; }
h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.75rem; background: linear-gradient(90deg, #60a5fa, #34d399); -webkit-background-clip: text; color: transparent; }
p { color: #94a3b8; font-size: 0.96rem; line-height: 1.6; margin-bottom: 1.75rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.75rem; text-align: left; }
.card { background: rgba(15, 23, 42, 0.85); border: 1px solid #1e293b; border-radius: 14px; padding: 1.1rem; }
.card h3 { font-size: 0.95rem; color: #f8fafc; margin-bottom: 0.4rem; }
.card p { font-size: 0.82rem; margin: 0; }
button { background: linear-gradient(90deg, #2563eb, #10b981); color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.9rem; }
.out { margin-top: 1rem; font-family: monospace; color: #34d399; font-size: 0.85rem; }`,
  'app.js': `let count = 0;
document.getElementById('demo-btn')?.addEventListener('click', () => {
  count += 1;
  const el = document.getElementById('demo-out');
  if (el) el.textContent = '[UNIFORGE Runtime] Verified live DOM event #' + count;
});`,
};

function makeInitialSession(): ChatSession {
  return {
    id: `sess-${Date.now()}`,
    title: 'UNIFORGE Starter Workspace',
    updatedAt: new Date().toLocaleTimeString(),
    messages: [
      {
        id: 'welcome-v2',
        role: 'assistant',
        content:
          'Welcome to **UNIFORGE AI Workbench v2** — reverse-engineered for full-stack speed under 100% UNIFORGE ownership. Choose any LLM provider (or run offline), toggle **Build / Discuss**, inspect live preview elements, review diffs, and deploy to any cloud.',
        quickActions: [
          { type: 'message', label: 'SaaS Analytics Dashboard', message: 'Build an AI SaaS analytics dashboard with KPI cards, filters, and theme toggle' },
          { type: 'message', label: 'Interactive Particle Canvas', message: 'Build an interactive particle canvas visualization with speed, node count, and hue sliders' },
        ],
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
    files: { ...INITIAL_FILES },
    baselineFiles: { ...INITIAL_FILES },
    snapshots: [
      {
        id: 'snap-init',
        label: 'Initial Starter Snapshot',
        createdAt: new Date().toLocaleTimeString(),
        files: { ...INITIAL_FILES },
      },
    ],
  };
}

function loadPersisted(): { sessions: ChatSession[]; activeSessionId: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.sessions) && parsed.sessions.length > 0) {
        return {
          sessions: parsed.sessions,
          activeSessionId: parsed.activeSessionId || parsed.sessions[0].id,
        };
      }
    }
  } catch {
    // ignore corrupted local storage
  }
  const initial = makeInitialSession();
  return { sessions: [initial], activeSessionId: initial.id };
}

function persistSessions(sessions: ChatSession[], activeSessionId: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions: sessions.slice(0, 15), activeSessionId }));
  } catch {
    // ignore storage quota
  }
}

interface WorkbenchState {
  sessions: ChatSession[];
  activeSessionId: string;
  activeFile: string;
  lockedFiles: string[];
  rightView: RightView;
  viewport: ViewportSize;
  chatMode: ChatMode;
  provider: string;
  model: string;
  apiKey: string;
  ollamaUrl: string;
  inspectorEnabled: boolean;
  sidebarOpen: boolean;
  settingsOpen: boolean;
  deployOpen: boolean;
  terminalOpen: boolean;
  terminalTabs: TerminalTab[];
  activeTerminalId: string;
  isBuilding: boolean;
  previewNonce: number;

  // Derived helper getters via actions
  setRightView: (v: RightView) => void;
  setViewport: (vp: ViewportSize) => void;
  setChatMode: (m: ChatMode) => void;
  setProviderConfig: (cfg: { provider?: string; model?: string; apiKey?: string; ollamaUrl?: string }) => void;
  setActiveFile: (path: string) => void;
  toggleLockFile: (path: string) => void;
  toggleInspector: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setDeployOpen: (open: boolean) => void;
  setTerminalOpen: (open: boolean) => void;
  setIsBuilding: (val: boolean) => void;
  bumpPreview: () => void;

  // Session & Snapshot operations
  createNewSession: () => void;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  saveSnapshot: (label: string) => void;
  restoreSnapshot: (snapshotId: string) => void;

  // File System operations
  updateFile: (path: string, content: string) => void;
  createFile: (path: string, content?: string) => void;
  deleteFile: (path: string) => void;
  applyFilesRespectingLocks: (incoming: Record<string, string>) => { applied: string[]; skipped: string[] };
  revertFileToBaseline: (path: string) => void;

  // Multi-tab Terminal operations
  addTerminalTab: () => void;
  closeTerminalTab: (id: string) => void;
  setActiveTerminalId: (id: string) => void;
  appendTerminalOutput: (id: string, text: string) => void;
}

const boot = loadPersisted();

export const useWorkbenchStore = create<WorkbenchState>((set, get) => {
  const updateActiveSession = (updater: (s: ChatSession) => ChatSession) => {
    set((state) => {
      const next = state.sessions.map((s) => (s.id === state.activeSessionId ? updater(s) : s));
      persistSessions(next, state.activeSessionId);
      return { sessions: next };
    });
  };

  return {
    sessions: boot.sessions,
    activeSessionId: boot.activeSessionId,
    activeFile: 'index.html',
    lockedFiles: [],
    rightView: 'preview',
    viewport: 'desktop',
    chatMode: 'build',
    provider: 'uniforge-local',
    model: 'uniforge-architect-v2',
    apiKey: '',
    ollamaUrl: 'http://localhost:11434',
    inspectorEnabled: false,
    sidebarOpen: false,
    settingsOpen: false,
    deployOpen: false,
    terminalOpen: false,
    terminalTabs: [
      { id: 'term-1', title: 'UNIFORGE Shell', output: 'UNIFORGE Multi-Tab Terminal ready (backed by /api/v1/terminal/exec).\n' },
    ],
    activeTerminalId: 'term-1',
    isBuilding: false,
    previewNonce: 1,

    setRightView: (rightView) => set({ rightView }),
    setViewport: (viewport) => set({ viewport }),
    setChatMode: (chatMode) => set({ chatMode }),
    setProviderConfig: (cfg) => set((s) => ({ ...s, ...cfg })),
    setActiveFile: (activeFile) => set({ activeFile }),
    toggleLockFile: (path) =>
      set((s) => ({
        lockedFiles: s.lockedFiles.includes(path)
          ? s.lockedFiles.filter((f) => f !== path)
          : [...s.lockedFiles, path],
      })),
    toggleInspector: () => set((s) => ({ inspectorEnabled: !s.inspectorEnabled, previewNonce: s.previewNonce + 1 })),
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
    setDeployOpen: (deployOpen) => set({ deployOpen }),
    setTerminalOpen: (terminalOpen) => set({ terminalOpen }),
    setIsBuilding: (isBuilding) => set({ isBuilding }),
    bumpPreview: () => set((s) => ({ previewNonce: s.previewNonce + 1 })),

    createNewSession: () => {
      const fresh = makeInitialSession();
      set((s) => {
        const next = [fresh, ...s.sessions];
        persistSessions(next, fresh.id);
        return { sessions: next, activeSessionId: fresh.id, activeFile: 'index.html', previewNonce: s.previewNonce + 1 };
      });
    },
    selectSession: (id) => {
      const target = get().sessions.find((s) => s.id === id);
      if (!target) return;
      persistSessions(get().sessions, id);
      const firstFile = Object.keys(target.files)[0] || 'index.html';
      set((s) => ({ activeSessionId: id, activeFile: firstFile, previewNonce: s.previewNonce + 1 }));
    },
    deleteSession: (id) => {
      set((s) => {
        const remaining = s.sessions.filter((x) => x.id !== id);
        const finalList = remaining.length > 0 ? remaining : [makeInitialSession()];
        const nextActive = s.activeSessionId === id ? finalList[0].id : s.activeSessionId;
        persistSessions(finalList, nextActive);
        return { sessions: finalList, activeSessionId: nextActive };
      });
    },

    addMessage: (msg) =>
      updateActiveSession((sess) => ({
        ...sess,
        title: msg.role === 'user' && sess.messages.length <= 1 ? msg.content.slice(0, 42) : sess.title,
        updatedAt: new Date().toLocaleTimeString(),
        messages: [
          ...sess.messages,
          {
            ...msg,
            id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      })),

    saveSnapshot: (label) =>
      updateActiveSession((sess) => ({
        ...sess,
        baselineFiles: { ...sess.files },
        snapshots: [
          {
            id: `snap-${Date.now()}`,
            label: label.slice(0, 44),
            createdAt: new Date().toLocaleTimeString(),
            files: { ...sess.files },
          },
          ...sess.snapshots,
        ].slice(0, 12),
      })),

    restoreSnapshot: (snapshotId) => {
      updateActiveSession((sess) => {
        const snap = sess.snapshots.find((x) => x.id === snapshotId);
        if (!snap) return sess;
        return { ...sess, files: { ...snap.files }, updatedAt: new Date().toLocaleTimeString() };
      });
      set((s) => ({ previewNonce: s.previewNonce + 1 }));
    },

    updateFile: (path, content) =>
      updateActiveSession((sess) => ({
        ...sess,
        files: { ...sess.files, [path]: content },
      })),

    createFile: (path, content = '') => {
      const clean = path.trim().replace(/^\/+/, '');
      if (!clean) return;
      updateActiveSession((sess) => ({
        ...sess,
        files: { ...sess.files, [clean]: content },
      }));
      set({ activeFile: clean, rightView: 'code' });
    },

    deleteFile: (path) =>
      updateActiveSession((sess) => {
        const copy = { ...sess.files };
        delete copy[path];
        return { ...sess, files: copy };
      }),

    applyFilesRespectingLocks: (incoming) => {
      const locked = new Set(get().lockedFiles);
      const applied: string[] = [];
      const skipped: string[] = [];
      updateActiveSession((sess) => {
        const merged = { ...sess.files };
        for (const [k, v] of Object.entries(incoming)) {
          if (locked.has(k)) {
            skipped.push(k);
          } else {
            merged[k] = v;
            applied.push(k);
          }
        }
        return { ...sess, files: merged };
      });
      set((s) => ({ previewNonce: s.previewNonce + 1 }));
      return { applied, skipped };
    },

    revertFileToBaseline: (path) => {
      updateActiveSession((sess) => {
        const copy = { ...sess.files };
        if (path in sess.baselineFiles) {
          copy[path] = sess.baselineFiles[path];
        } else {
          delete copy[path];
        }
        return { ...sess, files: copy };
      });
      set((s) => ({ previewNonce: s.previewNonce + 1 }));
    },

    addTerminalTab: () =>
      set((s) => {
        const id = `term-${Date.now()}`;
        const tab: TerminalTab = {
          id,
          title: `Shell ${s.terminalTabs.length + 1}`,
          output: `UNIFORGE Shell ${s.terminalTabs.length + 1} initialized.\n`,
        };
        return { terminalTabs: [...s.terminalTabs, tab], activeTerminalId: id, terminalOpen: true };
      }),

    closeTerminalTab: (id) =>
      set((s) => {
        const rest = s.terminalTabs.filter((t) => t.id !== id);
        if (rest.length === 0) return { terminalOpen: false };
        return {
          terminalTabs: rest,
          activeTerminalId: s.activeTerminalId === id ? rest[0].id : s.activeTerminalId,
        };
      }),

    setActiveTerminalId: (activeTerminalId) => set({ activeTerminalId }),

    appendTerminalOutput: (id, text) =>
      set((s) => ({
        terminalTabs: s.terminalTabs.map((t) => (t.id === id ? { ...t, output: t.output + text } : t)),
      })),
  };
});
