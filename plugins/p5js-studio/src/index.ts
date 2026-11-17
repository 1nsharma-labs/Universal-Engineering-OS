import { definePlugin, PluginManifest } from '@uniforge/plugin-sdk';
import manifestJson from '../uniforge-plugin.json';

const manifest = manifestJson as unknown as PluginManifest;

const TEMPLATES: Record<string, { title: string; code: string }> = {
  'flow-field': {
    title: 'Perlin Noise Flow Field',
    code: `let particles = [];
function setup() {
  createCanvas(640, 420);
  background(10, 14, 28);
  for (let i = 0; i < 350; i++) particles.push(createVector(random(width), random(height)));
}
function draw() {
  fill(10, 14, 28, 12);
  noStroke();
  rect(0, 0, width, height);
  stroke(56, 189, 248, 180);
  for (let p of particles) {
    let angle = noise(p.x * 0.005, p.y * 0.005, frameCount * 0.004) * TWO_PI * 2;
    p.x += cos(angle) * 1.6;
    p.y += sin(angle) * 1.6;
    point(p.x, p.y);
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) p.set(random(width), random(height));
  }
}`,
  },
  'orbital-rings': {
    title: 'Orbital Harmonic Geometry',
    code: `function setup() {
  createCanvas(640, 420);
  noFill();
}
function draw() {
  background(6, 10, 22);
  translate(width / 2, height / 2);
  for (let i = 1; i <= 18; i++) {
    stroke(99 + i * 7, 102 + i * 5, 241, 180);
    strokeWeight(1.5);
    rotate(frameCount * 0.002 * (i % 2 === 0 ? 1 : -1));
    ellipse(0, 0, i * 18, i * 12 + sin(frameCount * 0.03 + i) * 20);
  }
}`,
  },
};

export const p5jsStudioPlugin = definePlugin({
  manifest,

  activate(ctx) {
    ctx.log('p5.js Studio plugin activated.');

    ctx.registerCommand('listTemplates', () => {
      return {
        ok: true,
        templates: Object.entries(TEMPLATES).map(([id, tpl]) => ({
          id,
          title: tpl.title,
          code: tpl.code,
        })),
      };
    });

    ctx.registerCommand('generateSketchHtml', (payload) => {
      const tplId = String(payload.templateId || 'flow-field');
      const code = String(payload.code || TEMPLATES[tplId]?.code || TEMPLATES['flow-field'].code);
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
  <style>body{margin:0;background:#020617;display:flex;justify-content:center;align-items:center;min-height:100vh;}</style>
</head>
<body>
<script>
${code}
</script>
</body>
</html>`;
      return { ok: true, templateId: tplId, html };
    });
  },
});

export default p5jsStudioPlugin;

