import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { World } from './src/world.js';
import { Character } from './src/character.js';
import { Camera } from './src/camera.js';
import { Controller } from './src/controller.js';
import {GameMessage, GameStart} from './src/gui.js';
import CannonDebugger from 'cannon-es-debugger';
import { Game } from './src/game.js';

const game = new Game();
// const startMenu = new GameStart(() => game.startGame());
game.startGame();


// function startGame(){
//   const gameMessage = new GameMessage();
//   const scene = new THREE.Scene();
//   const axesHelper = new THREE.AxesHelper( 5 );
//   scene.add( axesHelper );
//   const world = new World(scene);
//   const character = new Character(scene, world);
//   const camera = new Camera(scene, character);
  
//   // Create Renderer
//   const renderer = new THREE.WebGLRenderer();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);
  
//   // Create Controller to play
//   const controller = new Controller(camera, character, renderer, world, gameMessage);
  
//   const cannonDebugger = new CannonDebugger(scene, world.physicsWorld, {});
//   // Maybe this can be moved somewhere else (maybe in world.js?)
//   function animate() {
//     world.physicsWorld.fixedStep();
//     cannonDebugger.update();
//     if (character.mixer) {
//       character.mixer.update(0.01); 
//     }
//     controller.UpdateCharacterPosition();
//     controller.UpdateCameraPosition();
//     controller.UpdateCharacterAnimation();
//     renderer.render(scene, camera.perspectiveCamera); 
//   }
  
//   renderer.setAnimationLoop(animate);
// }
  
  