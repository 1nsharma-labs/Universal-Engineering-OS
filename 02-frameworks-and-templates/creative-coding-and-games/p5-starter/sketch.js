// Generative Interactive Vector Field in p5.js
const particles = [];
const NUM_PARTICLES = 160;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  background(15, 23, 42);

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      acc: createVector(0, 0),
      color: color(random(50, 100), random(150, 255), 255, 180),
      maxSpeed: random(2, 4)
    });
  }
}

function draw() {
  background(15, 23, 42, 25); // Motion blur trail

  const mouse = createVector(mouseX, mouseY);

  for (let p of particles) {
    const force = p5.Vector.sub(mouse, p.pos);
    const distSq = constrain(force.magSq(), 100, 10000);
    const strength = 150 / distSq;
    force.setMag(strength);

    p.acc.add(force);
    p.vel.add(p.acc);
    p.vel.limit(p.maxSpeed);
    p.pos.add(p.vel);
    p.acc.mult(0);

    // Screen wrapping
    if (p.pos.x > width) p.pos.x = 0;
    if (p.pos.x < 0) p.pos.x = width;
    if (p.pos.y > height) p.pos.y = 0;
    if (p.pos.y < 0) p.pos.y = height;

    noStroke();
    fill(p.color);
    circle(p.pos.x, p.pos.y, 4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
