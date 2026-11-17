import { definePlugin, PluginManifest } from '@uniforge/plugin-sdk';
import manifestJson from '../uniforge-plugin.json';

const manifest = manifestJson as unknown as PluginManifest;

const METRIC_OPS: Record<string, string> = {
  cosine: '<=>',
  l2: '<->',
  inner_product: '<#>',
};

function computeCosine(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) {
    throw new Error('Vectors must be non-empty and have identical dimensions.');
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : Number((dot / denom).toFixed(6));
}

export const pgvectorExplorerPlugin = definePlugin({
  manifest,

  activate(ctx) {
    ctx.log('pgvector Explorer plugin activated.');

    ctx.registerCommand('buildSimilarityQuery', (payload) => {
      const table = String(payload.table || 'documents').replace(/[^a-zA-Z0-9_]/g, '');
      const column = String(payload.column || 'embedding').replace(/[^a-zA-Z0-9_]/g, '');
      const metric = String(payload.metric || 'cosine');
      const limit = Math.min(Math.max(Number(payload.limit || 10), 1), 500);
      const op = METRIC_OPS[metric] || '<=>';

      const sql = [
        `SELECT id, content, 1 - (${column} ${op} $1::vector) AS similarity_score`,
        `FROM ${table}`,
        `ORDER BY ${column} ${op} $1::vector`,
        `LIMIT ${limit};`,
      ].join('\n');

      return { ok: true, metric, operator: op, sql };
    });

    ctx.registerCommand('cosineSimilarity', (payload) => {
      const vecA = (payload.vectorA as number[]) || [0.1, 0.2, 0.3];
      const vecB = (payload.vectorB as number[]) || [0.1, 0.25, 0.28];
      const score = computeCosine(vecA, vecB);
      return {
        ok: true,
        dimensions: vecA.length,
        cosineSimilarity: score,
        cosineDistance: Number((1 - score).toFixed(6)),
      };
    });

    ctx.registerCommand('indexRecommendations', (payload) => {
      const rows = Number(payload.rows || 100000);
      const dims = Number(payload.dimensions || 1536);
      const table = String(payload.table || 'documents').replace(/[^a-zA-Z0-9_]/g, '');
      const useHnsw = rows <= 2000000;
      const ddl = useHnsw
        ? `CREATE INDEX CONCURRENTLY idx_${table}_embedding_hnsw ON ${table} USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);`
        : `CREATE INDEX CONCURRENTLY idx_${table}_embedding_ivfflat ON ${table} USING ivfflat (embedding vector_cosine_ops) WITH (lists = ${Math.round(Math.sqrt(rows))});`;
      return {
        ok: true,
        recommendedIndex: useHnsw ? 'HNSW' : 'IVFFlat',
        dimensions: dims,
        estimatedRows: rows,
        ddl,
      };
    });
  },
});

export default pgvectorExplorerPlugin;

