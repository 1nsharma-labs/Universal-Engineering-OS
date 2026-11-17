# p5.js Cheatsheet

## Setup & Animate Loop
```javascript
function setup() {
  createCanvas(800, 600);
  background(20);
}

function draw() {
  fill(0, 150, 255);
  noStroke();
  circle(mouseX, mouseY, 30);
}
```

## Vector Arithmetic
```javascript
let pos = createVector(100, 100);
let vel = createVector(2.5, 3.0);
pos.add(vel);
```
