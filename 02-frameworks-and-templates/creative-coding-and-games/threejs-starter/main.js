import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0f1d);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x38bdf8, 2, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const secondaryLight = new THREE.PointLight(0xa855f7, 2, 50);
secondaryLight.position.set(-5, -5, 3);
scene.add(secondaryLight);

// Torus Knot Geometry
const geometry = new THREE.TorusKnotGeometry(2, 0.6, 128, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x1e40af,
  roughness: 0.2,
  metalness: 0.8,
  wireframe: false
});

const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

function animate(time) {
  requestAnimationFrame(animate);

  const t = time * 0.001;
  torusKnot.rotation.x = t * 0.5;
  torusKnot.rotation.y = t * 0.7;

  pointLight.position.x = Math.sin(t) * 6;
  pointLight.position.y = Math.cos(t) * 6;

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate(0);
