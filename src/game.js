import * as THREE from 'three';
import { World } from './world.js';
import { Character } from './character.js';
import { Camera } from './camera.js';
import { Controller } from './controller.js';
import {GameMessage, GameStart} from './gui.js';
import CannonDebugger from 'cannon-es-debugger';


export class Game {
    #previousAnimationLoop;

    constructor(){

    }

    startGame() {
        const gameMessage = new GameMessage();
        const scene = new THREE.Scene();
        const axesHelper = new THREE.AxesHelper( 5 );
        scene.add( axesHelper );
        const world = new World(scene);
        const character = new Character(scene, world);
        const camera = new Camera(scene, character);
        
        // Create Renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        
        // Create Controller to play
        const controller = new Controller(camera, character, renderer, world, gameMessage);
        
        const cannonDebugger = new CannonDebugger(scene, world.physicsWorld, {});
        // Maybe this can be moved somewhere else (maybe in world.js?)
        function animate() {
            world.physicsWorld.fixedStep();
            cannonDebugger.update();
            if (character.mixer) {
            character.mixer.update(0.01); 
            }
            controller.UpdateCharacterPosition();
            controller.UpdateCameraPosition();
            controller.UpdateCharacterAnimation();
            renderer.render(scene, camera.perspectiveCamera); 
        }
        
        renderer.setAnimationLoop(animate);
    }

    pauseGame() {
        this.#previousAnimationLoop = renderer.getAnimationLoop(); // Salva il loop attuale
        renderer.setAnimationLoop(null); // Ferma il rendering
    }
    
    resumeGame() {
        renderer.setAnimationLoop(this.#previousAnimationLoop); // Riprende il loop di animazione
    }
    

    
}