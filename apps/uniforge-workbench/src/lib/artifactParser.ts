/**
 * UNIFORGE Native Streaming Artifact & Action Protocol Parser
 * Parses <uniforgeArtifact>, <uniforgeAction type="file|shell|start">,
 * and <uniforge-quick-actions> blocks cleanly into executable workbench operations.
 */

export type UniforgeActionType = 'file' | 'shell' | 'start';

export interface UniforgeAction {
  id: string;
  type: UniforgeActionType;
  filePath?: string;
  content: string;
  status: 'complete' | 'running' | 'skipped-locked' | 'error';
}

export interface UniforgeArtifact {
  id: string;
  title: string;
  actions: UniforgeAction[];
}

export interface QuickActionItem {
  type: 'message' | 'link';
  label: string;
  message?: string;
  href?: string;
}

export interface ParsedWorkbenchResponse {
  displayMarkdown: string;
  artifacts: UniforgeArtifact[];
  quickActions: QuickActionItem[];
}

function stripOuterFence(raw: string): string {
  const trimmed = raw.trim();
  const match = trimmed.match(/^```[\w-]*\n([\s\S]*?)\n```$/);
  return match ? match[1] : trimmed;
}

function extractAttr(attrs: string, name: string): string | undefined {
  const re = new RegExp(`${name}=["']([^"']+)["']`, 'i');
  const m = attrs.match(re);
  return m ? m[1] : undefined;
}

export function parseUniforgeResponse(rawInput: string): ParsedWorkbenchResponse {
  const artifacts: UniforgeArtifact[] = [];
  const quickActions: QuickActionItem[] = [];
  let display = rawInput;

  // 1. Parse <uniforgeArtifact ...>...</uniforgeArtifact>
  const artifactRe = /<uniforgeArtifact([^>]*)>([\s\S]*?)<\/uniforgeArtifact>/gi;
  let artIdx = 0;
  display = display.replace(artifactRe, (_full, attrs: string, inner: string) => {
    artIdx += 1;
    const id = extractAttr(attrs, 'id') || `artifact-${artIdx}`;
    const title = extractAttr(attrs, 'title') || 'UNIFORGE Workspace Update';
    const actions: UniforgeAction[] = [];

    const actionRe = /<uniforgeAction([^>]*)>([\s\S]*?)<\/uniforgeAction>/gi;
    let actMatch: RegExpExecArray | null;
    let actIdx = 0;
    while ((actMatch = actionRe.exec(inner)) !== null) {
      actIdx += 1;
      const aAttrs = actMatch[1];
      const aBody = stripOuterFence(actMatch[2]);
      const rawType = (extractAttr(aAttrs, 'type') || 'file').toLowerCase();
      const type: UniforgeActionType =
        rawType === 'shell' ? 'shell' : rawType === 'start' ? 'start' : 'file';
      const filePath = extractAttr(aAttrs, 'filePath');
      actions.push({
        id: `${id}-act-${actIdx}`,
        type,
        filePath,
        content: aBody,
        status: 'complete',
      });
    }

    artifacts.push({ id, title, actions });
    return '';
  });

  // 2. Parse <uniforge-quick-actions>...</uniforge-quick-actions>
  const qaBlockRe = /<uniforge-quick-actions>([\s\S]*?)<\/uniforge-quick-actions>/gi;
  display = display.replace(qaBlockRe, (_full, inner: string) => {
    const itemRe = /<uniforge-quick-action([^>]*)>([\s\S]*?)<\/uniforge-quick-action>/gi;
    let m: RegExpExecArray | null;
    while ((m = itemRe.exec(inner)) !== null) {
      const attrs = m[1];
      const label = m[2].replace(/&amp;/g, '&').trim();
      const type = extractAttr(attrs, 'type') === 'link' ? 'link' : 'message';
      quickActions.push({
        type,
        label,
        message: extractAttr(attrs, 'message'),
        href: extractAttr(attrs, 'href'),
      });
    }
    return '';
  });

  return {
    displayMarkdown: display.trim(),
    artifacts,
    quickActions,
  };
}

/**
 * Composes live preview HTML with optional interactive Element Inspector script injected.
 */
export function composePreviewHtml(files: Record<string, string>, inspectorEnabled: boolean): string {
  const html = files['index.html'] || '<h1>No index.html in workspace</h1>';
  const css = files['styles.css'] || '';
  const js = files['app.js'] || '';

  const inspectorScript = inspectorEnabled
    ? `<script>
(function(){
  let lastEl = null;
  document.addEventListener('mouseover', function(e){
    if(lastEl) lastEl.style.outline = '';
    lastEl = e.target;
    if(lastEl && lastEl.style) lastEl.style.outline = '2px solid #38bdf8';
  }, true);
  document.addEventListener('click', function(e){
    e.preventDefault(); e.stopPropagation();
    const el = e.target;
    const tag = el.tagName ? el.tagName.toLowerCase() : 'div';
    const cls = (el.className && typeof el.className === 'string') ? el.className.trim() : '';
    const txt = (el.innerText || '').trim().slice(0, 80);
    window.parent.postMessage({ type: 'UNIFORGE_INSPECT_SELECT', tag, className: cls, text: txt }, '*');
  }, true);
})();
</script>`
    : '';

  return html
    .replace('<link rel="stylesheet" href="styles.css" />', `<style>${css}</style>`)
    .replace('<script src="app.js"></script>', `<script>${js}</script>${inspectorScript}`);
}

