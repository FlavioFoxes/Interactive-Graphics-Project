import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export class Object{
    #loader;
    #isVisibile;
    #isCollectable;
    #isUsable;
    #path;
    #model;
    #scene;
    #physicsWorld;
    #physicsBody;
    #animations;
    #mixer;
    constructor(path, isVisible, isCollectable, isUsable, scene, physicsWorld, position, scale, mass){
        this.#path = path;
        this.#isVisibile = isVisible;
        this.#isCollectable = isCollectable;
        this.#isUsable = isUsable;
        this.#scene = scene;
        this.#physicsWorld = physicsWorld;
        this.#LoadModel(position, scale, mass);
    }

    #LoadModel(position, scale, mass){
        const loader = new GLTFLoader();
        loader.load(this.#path, (gltf) => {
            this.#model = gltf.scene;
            this.#scene.add(this.#model);
            this.#model.position.set(position.x, position.y/2, position.z);
            this.#model.scale.set(scale.x, scale.y, scale.z);
            this.#model.updateMatrixWorld(); 

            if (gltf.animations.length > 0) {
                this.#animations = gltf.animations;
                this.#mixer = new THREE.AnimationMixer(this.#model);
                console.log("Animazioni trovate:", gltf.animations);
            } else {
                console.log("Nessuna animazione trovata.");
            }

            
            const boundingBox = new THREE.Box3().setFromObject(this.#model); 
            const size = boundingBox.getSize(new THREE.Vector3()); 

            this.#physicsBody = new CANNON.Body({
                mass: mass, 
                shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)), 
                position: new CANNON.Vec3(this.#model.position.x, this.#model.position.y, this.#model.position.z), 
            });
            this.#physicsWorld.addBody(this.#physicsBody);
            this.setIsVisible(this.#isVisibile);
        })

    }

    get isVisible(){
        return this.#isVisibile;
    }

    get isUsable(){
        return this.#isUsable;
    }

    get isCollectable(){
        return this.#isCollectable;
    }

    get model(){
        return this.#model;
    }

    get mixer(){
        if(this.#mixer) 
            return this.#mixer;
    }

    get animations(){
        if(this.#animations)
            return this.#animations;
    }
    get physicsBody(){
        return this.#physicsBody;
    }

    disablePhysics(){
        this.#physicsWorld.removeBody(this.#physicsBody);
    }

    enablePhysics(){
        this.#physicsWorld.addBody(this.#physicsBody);
    }
    
    setIsVisible(value){
        this.#model.visible = value;
        this.#isVisibile = value;
        if(value){
            this.#physicsWorld.addBody(this.#physicsBody);
        }
        else{
            this.#physicsWorld.removeBody(this.#physicsBody);
        }
    }
    
}