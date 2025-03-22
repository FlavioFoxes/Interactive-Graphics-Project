import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

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

let model;
loader.load('ninja_-_walking/scene.gltf', function(gltf) {
  // Aggiungi il modello alla scena
  model = gltf.scene;
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
/*
const fbxLoader = new FBXLoader()
fbxLoader.load(
    'bighorn/A_C_BigHornRam_01_05.fbx',
    (object) => {
        
      scene.add(object);
      object.position.set(0,1,0);
      object.color='red';
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
*/
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
    if (model) {
        if (moveForward) model.position.z += moveSpeed;
        if (moveBackward) model.position.z -= moveSpeed;
        if (moveLeft) model.position.x += moveSpeed;
        if (moveRight) model.position.x -= moveSpeed;
    }
}

// CAMERA
const cameraOffset = new THREE.Vector3(0, 2, -3); // Offset della camera dietro il personaggio

function updateCameraPosition() {
    if (model) {
        // Posiziona la camera dietro al personaggio
        camera.position.copy(model.position).add(cameraOffset);
        camera.lookAt(model.position);  // La camera guarda sempre il personaggio
    }
}


// Animate function
function animate() {
  if (mixer) {
    mixer.update(0.01); // Update animation mixer (you can adjust the delta time)
  }
  updateCharacterPosition();
  updateCameraPosition();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
