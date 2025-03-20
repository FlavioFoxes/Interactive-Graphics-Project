import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

// Load 3d model and its animations
const loader = new GLTFLoader();
let mixer; // AnimationMixer for controlling animations

loader.load('public/bighorn__carneiro_3d_model_free.glb', function(gltf) {
  // Aggiungi il modello alla scena
  const model = gltf.scene;
  scene.add(model);
  model.position.set(0, 1, 0); // Posiziona il modello

  // Verifica se ci sono animazioni
  if (gltf.animations.length > 0) {
    console.log("Animazioni trovate:", gltf.animations); // Mostra le animazioni
  } else {
    console.log("Nessuna animazione trovata nel modello.");
  }

  // Imposta il mixer di animazione
  mixer = new THREE.AnimationMixer(model);
  
  // Riproduce solo la prima animazione
  if (gltf.animations.length > 0) {
    const firstAnimation = gltf.animations[0]; // Ottieni la prima animazione
    mixer.clipAction(firstAnimation).play(); // Avvia la prima animazione
  }
}, undefined, function(error) {
  console.error(error);
});


// Create orbit control (allows to rotate by mouse around the object)
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

// Create floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60, 10, 10),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
  })
);
floor.castShadow = false;
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, 0);
scene.add(floor);

// Animate function
function animate() {
  if (mixer) {
    mixer.update(0.01); // Update animation mixer (you can adjust the delta time)
  }
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
