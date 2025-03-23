import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { World } from './src/world.js';
import { Character } from './src/character.js';
import { Camera } from './src/camera.js';

// Scene and camera
const scene = new THREE.Scene();
const world = new World(scene);

const character = new Character(scene);
const camera = new Camera(scene, character);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ora possiamo creare OrbitControls, perché camera esiste
const controls = new OrbitControls(camera.perspectiveCamera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

// WASD controls
const moveSpeed = 0.1; // Velocità di movimento

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') moveForward = true;
    if (event.key === 's') moveBackward = true;
    if (event.key === 'a') moveLeft = true;
    if (event.key === 'd') moveRight = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') moveForward = false;
    if (event.key === 's') moveBackward = false;
    if (event.key === 'a') moveLeft = false;
    if (event.key === 'd') moveRight = false;
});

function updateCharacterPosition() {
    if (character.model) {
        if (moveForward) character.model.position.z += moveSpeed;
        if (moveBackward) character.model.position.z -= moveSpeed;
        if (moveLeft) character.model.position.x += moveSpeed;
        if (moveRight) character.model.position.x -= moveSpeed;
    }
}

function animate() {
  if (character.mixer) {
    character.mixer.update(0.01); // Update animation mixer
  }
  updateCharacterPosition();
  camera.updateCameraPosition();
  renderer.render(scene, camera.perspectiveCamera); // Usa camera.camera qui
}

renderer.setAnimationLoop(animate);
