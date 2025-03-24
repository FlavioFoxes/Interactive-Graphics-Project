import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Character {
    #scene;  
    #loader; 
    #model;  
    #mixer;  
    #animations;

    constructor(scene) {
        this.#scene = scene;
        this.#Init();
    }

    #Init() {
        this.#loader = new GLTFLoader();
        this.#model = null;
        this.#mixer = null;
        this.#animations = [];
        this.#LoadModel();
    }

    #LoadModel() {
        this.#loader.load('ninja_-_walking/scene.gltf', (gltf) => {
            this.#model = gltf.scene;
            this.#scene.add(this.#model);
            this.#model.position.set(0, 0, 1);

            if (gltf.animations.length > 0) {
                this.#animations = gltf.animations;
                console.log("Animazioni trovate:", gltf.animations);
            } else {
                console.log("Nessuna animazione trovata.");
            }

            // Inizializza il mixer dopo il caricamento
            this.#mixer = new THREE.AnimationMixer(this.#model);

        }, undefined, (error) => {
            console.error("Errore nel caricamento del modello:", error);
        });
    }

    get model() {
        return this.#model;
    }

    get position() {
        return this.#model ? this.#model.position : null;
    }

    get orientation() {
        return this.#model ? this.#model.rotation : null;
    }

    get mixer() {
        return this.#mixer;
    }

    get animations() {
        return this.#animations;
    }
}
