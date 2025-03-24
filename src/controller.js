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
        this.#moveSpeed = 0.05;
        this.#controls = new OrbitControls(this.#camera.perspectiveCamera, renderer.domElement);
        this.#controls.target.set(0, 0.5, 0);
        this.#controls.update();
        this.#controls.enablePan = false;
        this.#controls.enableDamping = true;
        this.#controls.autoRotate = true;
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
    UpdateCharacterPosition() {
        if (this.#character.model) {
            const orientation = this.#character.model.rotation.y;
            if (this.#moveForward) {
                this.#character.model.position.z += (this.#moveSpeed * Math.cos(orientation));
                this.#character.model.position.x += (this.#moveSpeed * Math.sin(orientation));
            }
            if (this.#moveBackward) {
                this.#character.model.position.z -= (this.#moveSpeed * Math.cos(orientation));
                this.#character.model.position.x -= (this.#moveSpeed * Math.sin(orientation));
            }
            if (this.#moveLeft) this.#character.model.rotation.y += this.#moveSpeed;
            if (this.#moveRight) this.#character.model.rotation.y -= this.#moveSpeed;
        }
    }

    #ComputeCameraOffset() {
        const cameraOffset = new THREE.Vector3();
        cameraOffset.copy(this.#camera.thirdPersonCameraOffset);
    
        // Convert euler angle of rotation in quaternion
        const quaternion = new THREE.Quaternion();
        this.#character.model.getWorldQuaternion(quaternion);
    
        cameraOffset.applyQuaternion(quaternion);
        cameraOffset.add(this.#character.model.position);
    
        return cameraOffset;
    }
    
    #ComputeCameraLookat() {
        const cameralLookat = new THREE.Vector3();
        cameralLookat.copy(this.#camera.thirdPersonCameraLookat);

        // Convert euler angle of rotation in quaternion
        const quaternion = new THREE.Quaternion();
        this.#character.model.getWorldQuaternion(quaternion);
    
        cameralLookat.applyQuaternion(quaternion);
        cameralLookat.add(this.#character.model.position);
    
        return cameralLookat;
    }

    // Method for update of camera position
    UpdateCameraPosition() {
        if (this.#character.model) {
            
            // This can be used to make the camera motion smoother
            // const t = 1.0 - Math.pow(0.001, 1);
            // this.#currentPosition.lerp(cameraOffset, t);
            // this.#currentLookat.lerp(cameralLookat, t);
            // this.#camera.perspectiveCamera.position.copy(this._currentPosition);
            // this.#camera.perspectiveCamera.lookAt(this._currentLookat);
            
            const cameraLookat = this.#ComputeCameraLookat();
            const cameraOffset = this.#ComputeCameraOffset();
            this.#camera.perspectiveCamera.position.copy(cameraOffset);
            this.#camera.perspectiveCamera.lookAt(cameraLookat);

        }
    }

    UpdateCharacterAnimation() {
        if(this.#character.model){
            if(this.#moveForward || this.#moveBackward){
                const firstAnimation = this.#character.animations[0]; 
                this.#character.mixer.clipAction(firstAnimation).play(); 
            }
            else{
                this.#character.mixer.stopAllAction();
            }

        }
    }
}