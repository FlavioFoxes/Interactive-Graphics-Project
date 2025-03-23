import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Character {
    #scene;  // Proprietà privata
    #loader;  // Proprietà privata
    #model;  // Proprietà privata
    #mixer;  // Proprietà privata

    constructor(scene) {
        this.#scene = scene;  // Assegna il valore alla proprietà privata
        this.#Init();
    }

    // private method
    #Init() {
        this.#loader = new GLTFLoader();
        this.#model = null;
        this.#mixer = null;
        this.#LoadModel();

    }

    #LoadModel() {
        this.#loader.load('ninja_-_walking/scene.gltf', (gltf) => {
            // Aggiungi il modello alla scena
            this.#model = gltf.scene;
            this.#scene.add(this.#model);
            this.#model.position.set(0, 1, 0); // Posiziona il modello

            // Verifica se ci sono animazioni
            if (gltf.animations.length > 0) {
                console.log("Animazioni trovate:", gltf.animations); // Mostra le animazioni
            } else {
                console.log("Nessuna animazione trovata nel modello.");
            }

            // Imposta il mixer di animazione
            this.#mixer = new THREE.AnimationMixer(this.#model);
            
            // Riproduce solo la prima animazione
            if (gltf.animations.length > 0) {
                const firstAnimation = gltf.animations[0]; // Ottieni la prima animazione
                this.#mixer.clipAction(firstAnimation).play(); // Avvia la prima animazione
            }

            // Notifica che  il modello è stato caricato
            if(this.isModelLoaded){
                this.isModelLoaded();
            }
        }, undefined, (error) => {
            console.error(error);
        });
    }


    // Getter per accedere al modello
    get model() {
        return this.#model;
    }

    // Getter per la posizione del modello
    get position() {
        return this.#model ? this.#model.position : null;
    }

    // Getter per l'orientamento del modello
    get orientation() {
        return this.#model ? this.#model.rotation : null; // Uso `rotation` al posto di `orientation`
    }

    get mixer() {
        return this.#model ? this.#mixer : null;
    }
}
