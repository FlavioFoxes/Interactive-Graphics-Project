import * as THREE from 'three';


export class Camera {

    // private attributes
    #scene;
    #perspectiveCamera;
    #character;
    #thirdPersonCameraOffset;
    #firstPersonCameraOffset;
    #isFirstPersonView;

    constructor(scene, character){
        this.#scene = scene;
        this.#character = character;
        this.#Init();
        // this.#character = character;
        // this.#character.isModelLoaded = this.#Init.bind(this);
    }
    
    #Init() {
        this.#isFirstPersonView = false;
        this.#thirdPersonCameraOffset = new THREE.Vector3(0, 2, -3);
        this.#firstPersonCameraOffset = new THREE.Vector3(0, 2, -3);
        this.#perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // this.#camera.position.copy(this.#character.model.position).add(this.#thirdPersonCameraOffset);
        // this.#camera.lookAt(this.#character.model.position);
        this.#scene.add(this.#perspectiveCamera);
    }

    get thirdPersonCameraOffset () {
        return this.#thirdPersonCameraOffset;
    }
    get perspectiveCamera() {
        return this.#perspectiveCamera;
    }

    updateCameraPosition() {
        if (this.#character.model) {
            this.#perspectiveCamera.position.copy(this.#character.model.position).add(this.#thirdPersonCameraOffset);
            this.#perspectiveCamera.lookAt(this.#character.model.position);
        }
    }

}