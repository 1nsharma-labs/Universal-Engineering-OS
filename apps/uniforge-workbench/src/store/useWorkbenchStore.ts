import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  filesTouched?: string[];
  timestamp: string;
}

export type WorkbenchMode = 'factory-5layer' | 'autonomous-team' | 'local-rag';
export type RightTab = 'preview' | 'code' | 'terminal' | 'deploy';
export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const INITIAL_FILES: Record<string, string> = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UNIFORGE Live Preview</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="hero">
    <span class="badge">UNIFORGE AI WORKBENCH • LIVE SANDBOX</span>
    <h1>Build Anything. Ship Everywhere.</h1>
    <p>Describe any web app, SaaS dashboard, interactive canvas, or microservice in the left panel. UNIFORGE generates the code, microservices compose file, and live preview instantly.</p>
    <div class="grid">
      <div class="card"><h3>5-Layer Software Factory</h3><p>Registry &rarr; AI Router &rarr; Ephemeral Workers &rarr; QA Gate &rarr; Cloud Deploy</p></div>
      <div class="card"><h3>Live Code + Preview</h3><p>Edit HTML, CSS, JS, Python or Compose and watch changes update in real time.</p></div>
      <div class="card"><h3>100% Owned Brand</h3><p>Zero vendor lock-in. Runs locally or self-hosted under Apache-2.0.</p></div>
    </div>
    <button id="demo-btn">Run Live Interaction Test</button>
    <div id="demo-out" class="out"></div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
  'styles.css': `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: Inter, system-ui, -apple-system, sans-serif;
  background: radial-gradient(circle at top right, #0f172a, #020617 70%);
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.hero { max-width: 820px; text-align: center; }
.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.16);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.35);
  margin-bottom: 1rem;
}
h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.75rem; background: linear-gradient(90deg, #60a5fa, #34d399); -webkit-background-clip: text; color: transparent; }
p { color: #94a3b8; font-size: 0.98rem; line-height: 1.6; margin-bottom: 1.75rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem; margin-bottom: 1.75rem; text-align: left; }
.card { background: rgba(15, 23, 42, 0.85); border: 1px solid #1e293b; border-radius: 14px; padding: 1.1rem; }
.card h3 { font-size: 0.95rem; color: #f8fafc; margin-bottom: 0.4rem; }
.card p { font-size: 0.82rem; margin: 0; }
button {
  background: linear-gradient(90deg, #2563eb, #10b981);
  color: #fff; border: none; padding: 0.75rem 1.5rem;
  border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.9rem;
}
button:hover { opacity: 0.92; }
.out { margin-top: 1rem; font-family: monospace; color: #34d399; font-size: 0.85rem; }`,
  'app.js': `let clicks = 0;
document.getElementById('demo-btn')?.addEventListener('click', () => {
  clicks += 1;
  const out = document.getElementById('demo-out');
  if (out) out.textContent = '[UNIFORGE Runtime] Interactive sandbox verified (' + clicks + ' click' + (clicks === 1 ? '' : 's') + ')';
});`,
};

interface WorkbenchState {
  mode: WorkbenchMode;
  rightTab: RightTab;
  viewport: ViewportSize;
  files: Record<string, string>;
  activeFile: string;
  messages: ChatMessage[];
  isBuilding: boolean;
  previewNonce: number;
  setMode: (mode: WorkbenchMode) => void;
  setRightTab: (tab: RightTab) => void;
  setViewport: (vp: ViewportSize) => void;
  setActiveFile: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  mergeFiles: (newFiles: Record<string, string>) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setIsBuilding: (val: boolean) => void;
  bumpPreview: () => void;
}

export const useWorkbenchStore = create<WorkbenchState>((set) => ({
  mode: 'factory-5layer',
  rightTab: 'preview',
  viewport: 'desktop',
  files: INITIAL_FILES,
  activeFile: 'index.html',
  messages: [
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Welcome to **UNIFORGE AI Workbench** — your 100% self-owned full-stack builder inside Universal Engineering OS. Enter any app idea below to generate live interactive code, microservices Docker Compose, and cloud deployment plans.',
      filesTouched: ['index.html', 'styles.css', 'app.js'],
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  isBuilding: false,
  previewNonce: 1,
  setMode: (mode) => set({ mode }),
  setRightTab: (rightTab) => set({ rightTab }),
  setViewport: (viewport) => set({ viewport }),
  setActiveFile: (activeFile) => set({ activeFile }),
  updateFile: (path, content) =>
    set((s) => ({
      files: { ...s.files, [path]: content },
    })),
  mergeFiles: (newFiles) =>
    set((s) => ({
      files: { ...s.files, ...newFiles },
      previewNonce: s.previewNonce + 1,
    })),
  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        {
          ...msg,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    })),
  setIsBuilding: (isBuilding) => set({ isBuilding }),
  bumpPreview: () => set((s) => ({ previewNonce: s.previewNonce + 1 })),
}));

