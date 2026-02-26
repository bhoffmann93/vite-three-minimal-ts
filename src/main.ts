import * as THREE from 'three';
import { Pane } from 'tweakpane';
import Stats from 'stats.js';
import vertexShader from '../glsl/default.vert';
import fragmentShader from '../glsl/default.frag';

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

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
  depthTest: false,
  depthWrite: false,
});

const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(quad);

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
  material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'g' || e.key === 'p') {
    pane.hidden = !pane.hidden;
    stats.dom.style.display = stats.dom.style.display === 'none' ? 'block' : 'none';
  }
});

function animate() {
  requestAnimationFrame(animate);

  stats.begin();

  const delta = clock.getDelta();

  material.uniforms.uTime.value += delta;
  material.uniforms.uDelta.value = delta;

  renderer.render(scene, camera);

  stats.end();
}

animate();
