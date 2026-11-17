(async () => {
  const app = new PIXI.Application();
  await app.init({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x0f172a });
  document.body.appendChild(app.canvas);

  const particles = [];
  for (let i = 0; i < 60; i++) {
    const graphic = new PIXI.Graphics();
    graphic.circle(0, 0, 8 + Math.random() * 8);
    graphic.fill({ color: 0x38bdf8, alpha: 0.8 });
    graphic.x = Math.random() * window.innerWidth;
    graphic.y = Math.random() * window.innerHeight;
    graphic.vx = (Math.random() - 0.5) * 4;
    graphic.vy = (Math.random() - 0.5) * 4;
    app.stage.addChild(graphic);
    particles.push(graphic);
  }

  app.ticker.add(() => {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
    }
  });
})();
