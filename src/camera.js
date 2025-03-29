import * as THREE from 'three';


export class Camera {

    // Private attributes
    #scene;
    #perspectiveCamera;
    #character;
    #thirdPersonCameraOffset;
    #thirdPersonCameraLookat;
    #firstPersonCameraOffset;
    #isFirstPersonView;

    constructor(scene, character){
        this.#scene = scene;
        this.#character = character;
        this.#Init();
    }
    
    #Init() {
        this.#isFirstPersonView = false;
        this.#thirdPersonCameraOffset = new THREE.Vector3(0, 2, -3);
        this.#thirdPersonCameraLookat = new THREE.Vector3(0, 1, 5);

        this.#firstPersonCameraOffset = new THREE.Vector3(0, 2, -3);
        this.#perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.#scene.add(this.#perspectiveCamera);
    }

    // Getter for third person view offset
    get thirdPersonCameraOffset () {
        return this.#thirdPersonCameraOffset;
    }

    get thirdPersonCameraLookat() {
        return this.#thirdPersonCameraLookat;
    }

    // Getter for perspective camera (actually the real camera)
    get perspectiveCamera() {
        return this.#perspectiveCamera;
    }

}