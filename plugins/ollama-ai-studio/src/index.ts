import { definePlugin, PluginManifest } from '@uniforge/plugin-sdk';
import manifestJson from '../uniforge-plugin.json';

const manifest = manifestJson as unknown as PluginManifest;

export const ollamaAiStudioPlugin = definePlugin({
  manifest,

  activate(ctx) {
    ctx.log('Ollama AI Studio plugin activated.');

    ctx.registerCommand('listModels', async (payload) => {
      const host = String(payload.host || 'http://localhost:11434').replace(/\/$/, '');
      try {
        const res = await ctx.httpRequest({ url: `${host}/api/tags`, method: 'GET', timeoutMs: 5000 });
        return { ok: res.status === 200, status: res.status, data: JSON.parse(res.body) };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
          hint: 'Start local Ollama via `python devhub.py models` or `ollama serve`.',
        };
      }
    });

    ctx.registerCommand('generate', async (payload) => {
      const host = String(payload.host || 'http://localhost:11434').replace(/\/$/, '');
      const model = String(payload.model || 'llama3.2');
      const prompt = String(payload.prompt || 'Summarize UNIFORGE Universal Engineering OS in one sentence.');
      try {
        const res = await ctx.httpRequest({
          url: `${host}/api/generate`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt, stream: false }),
          timeoutMs: 30000,
        });
        return { ok: res.status === 200, model, data: JSON.parse(res.body) };
      } catch (err) {
        return { ok: false, model, error: err instanceof Error ? err.message : String(err) };
      }
    });

    ctx.registerCommand('embed', async (payload) => {
      const host = String(payload.host || 'http://localhost:11434').replace(/\/$/, '');
      const model = String(payload.model || 'nomic-embed-text');
      const prompt = String(payload.text || 'UNIFORGE vector search test');
      try {
        const res = await ctx.httpRequest({
          url: `${host}/api/embeddings`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt }),
          timeoutMs: 15000,
        });
        return { ok: res.status === 200, model, data: JSON.parse(res.body) };
      } catch (err) {
        return { ok: false, model, error: err instanceof Error ? err.message : String(err) };
      }
    });
  },
});

export default ollamaAiStudioPlugin;

