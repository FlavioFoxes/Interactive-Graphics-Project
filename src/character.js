import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Character {

    // Private attributes
    #scene;  
    #loader; 
    #model;  
    #mixer;  

    constructor(scene) {
        this.#scene = scene;
        this.#Init();
    }

    // Private method
    #Init() {
        this.#loader = new GLTFLoader();
        this.#model = null;
        this.#mixer = null;
        this.#LoadModel();

    }

    #LoadModel() {
        this.#loader.load('ninja_-_walking/scene.gltf', (gltf) => {
            // Take model and add it to the scene
            this.#model = gltf.scene;
            this.#scene.add(this.#model);
            this.#model.position.set(0, 1, 0);

            // Verify if there are animations
            if (gltf.animations.length > 0) {
                console.log("Animazioni trovate:", gltf.animations);
            } else {
                console.log("Nessuna animazione trovata nel modello.");
            }

            // Create animations mixer
            this.#mixer = new THREE.AnimationMixer(this.#model);
            
            // Reproduce just first animation
            if (gltf.animations.length > 0) {
                const firstAnimation = gltf.animations[0]; 
                this.#mixer.clipAction(firstAnimation).play(); 
            }

        }, undefined, (error) => {
            console.error(error);
        });
    }


    // Getter per accedere al modello
    get model() {
        return this.#model;
    }

    // Getter for model position
    get position() {
        return this.#model ? this.#model.position : null;
    }

    // Getter for model orientation
    get orientation() {
        return this.#model ? this.#model.rotation : null;
    }

    // Getter for mixer
    get mixer() {
        return this.#model ? this.#mixer : null;
    }
}
