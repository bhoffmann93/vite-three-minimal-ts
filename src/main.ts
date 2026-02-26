import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Pane } from 'tweakpane';
import Stats from 'stats.js';
import vertexShader from '../glsl/default.vert';
import fragmentShader from '../glsl/default.frag';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const controls = new OrbitControls(camera, renderer.domElement);

const params = {
  uSpeed: 1.0,
};

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uDelta: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uSpeed: { value: params.uSpeed },
  },
  vertexShader,
  fragmentShader,
});

const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(mesh);

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const pane = new Pane({ title: 'Controls' });
pane.addBinding(params, 'uSpeed', { min: 0, max: 5, step: 0.01, label: 'speed' }).on('change', ({ value }) => {
  material.uniforms.uSpeed.value = value;
});

const clock = new THREE.Clock();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'g' || e.key === 'p') {
    pane.hidden = !pane.hidden;
    stats.dom.style.display = stats.dom.style.display === 'none' ? 'block' : 'none';
  }
  if (e.key === 'h') controls.reset();
});

function animate() {
  requestAnimationFrame(animate);

  stats.begin();

  const delta = clock.getDelta();

  material.uniforms.uTime.value += delta;
  material.uniforms.uDelta.value = delta;

  mesh.rotateX(delta);
  mesh.rotateY(delta);

  controls.update();
  renderer.render(scene, camera);

  stats.end();
}

animate();
