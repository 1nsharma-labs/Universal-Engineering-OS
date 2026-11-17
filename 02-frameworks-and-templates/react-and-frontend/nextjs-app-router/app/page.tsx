import React from 'react';

export default function HomePage() {
  return (
    <main style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8' }}>
        Next.js App Router Starter
      </h1>
      <p style={{ marginTop: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
        Server-side rendering, streaming responses, and React Server Components pre-configured for the Universal Dev Hub.
      </p>
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Zero-Latency Edge Architecture</h2>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
          Connects natively to backend APIs, vector databases, and LLM inference endpoints.
        </p>
      </div>
    </main>
  );
}
