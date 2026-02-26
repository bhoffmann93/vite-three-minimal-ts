import * as THREE from 'three';
import { Pane } from 'tweakpane';
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
  if (e.key === 'g' || e.key === 'p') pane.hidden = !pane.hidden;
});

function animate() {
  requestAnimationFrame(animate);

  material.uniforms.uTime.value = clock.getElapsedTime();

  renderer.render(scene, camera);
}

animate();
