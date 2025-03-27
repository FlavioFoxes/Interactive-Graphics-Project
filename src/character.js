import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Character {
    #scene;  
    #loader; 
    #model;  
    #mixer;  
    #animations;
    #world;
    #physicsBody;
    #numObjectsCollected;
    constructor(scene, world) {
        this.#scene = scene;
        this.#world = world;
        this.#Init();
    }

    #Init() {
        this.#loader = new GLTFLoader();
        this.#model = null;
        this.#mixer = null;
        this.#animations = [];
        this.#LoadModel();
        this.#numObjectsCollected = 0;
    }

    #InitPhysics(){
        this.#physicsBody = new CANNON.Body({
            mass: 1, 
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)),  
            position: new CANNON.Vec3(this.#model.position.x, this.#model.position.y+2, this.#model.position.z),
        });
        this.#physicsBody.linearDamping = 0.99;
        this.#world.physicsWorld.addBody(this.#physicsBody);
    }

    #LoadModel() {
        this.#loader.load('ninja_-_walking/scene.gltf', (gltf) => {
            this.#model = gltf.scene;
            this.#scene.add(this.#model);
            this.#model.position.set(0, 0, 0);

            if (gltf.animations.length > 0) {
                this.#animations = gltf.animations;
                console.log("Animazioni trovate:", gltf.animations);
            } else {
                console.log("Nessuna animazione trovata.");
            }

            this.#mixer = new THREE.AnimationMixer(this.#model);
            this.#InitPhysics();
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

    get physicsBody() {
        return this.#physicsBody;
    }

    get numObjectsCollected(){
        return this.#numObjectsCollected;
    }

    incrementObjectsCollected(){
        this.#numObjectsCollected += 1;
    }

}
