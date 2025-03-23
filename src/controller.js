import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


export class Controller {

    // Private attributes
    #camera;
    #character;
    #controls;
    #moveForward;
    #moveBackward;
    #moveLeft;
    #moveRight;
    #moveSpeed;

    constructor(camera, character, renderer){
        this.#camera = camera;
        this.#character = character;
        this.#moveSpeed = 0.1;
        this.#controls = new OrbitControls(this.#camera.perspectiveCamera, renderer.domElement);
        this.#controls.target.set(0, 0.5, 0);
        this.#controls.update();
        this.#controls.enablePan = false;
        this.#controls.enableDamping = true;
        this.#Init();
    } 

    #Init() {
        this.#moveForward = false;
        this.#moveBackward = false; 
        this.#moveLeft = false;
        this.#moveRight = false;
        
        this.#AddWASDListener();
    }

    // Private method for listener of WASD buttons
    #AddWASDListener() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'w') this.#moveForward = true;
            if (event.key === 's') this.#moveBackward = true;
            if (event.key === 'a') this.#moveLeft = true;
            if (event.key === 'd') this.#moveRight = true;
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'w') this.#moveForward = false;
            if (event.key === 's') this.#moveBackward = false;
            if (event.key === 'a') this.#moveLeft = false;
            if (event.key === 'd') this.#moveRight = false;
        });
    }

    // Getter for forward motion
    get moveForward() {
        return this.#moveForward;
    }
    // Getter for bacward motion
    get moveBackward() {
        return this.#moveBackward;
    }
    // Getter for left motion
    get moveLeft() {
        return this.#moveLeft;
    }
    // Getter for right motion
    get moveRight() {
        return this.#moveRight;
    }

    // Method for update of character position
    updateCharacterPosition() {
        if (this.#character.model) {
            if (this.#moveForward) this.#character.model.position.z += this.#moveSpeed;
            if (this.#moveBackward) this.#character.model.position.z -= this.#moveSpeed;
            if (this.#moveLeft) this.#character.model.position.x += this.#moveSpeed;
            if (this.#moveRight) this.#character.model.position.x -= this.#moveSpeed;
        }
    }

    // Method for update of camera position
    updateCameraPosition() {
        if (this.#character.model) {
            this.#camera.perspectiveCamera.position.copy(this.#character.model.position).add(this.#camera.thirdPersonCameraOffset);
            this.#camera.perspectiveCamera.lookAt(this.#character.model.position);
        }
    }
}