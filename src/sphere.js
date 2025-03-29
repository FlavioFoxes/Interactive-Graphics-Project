import * as THREE from 'three';
import * as CANNON from 'cannon-es';


export class Sphere{
    #isVisibile;
    #isCollectable;
    #isUsable;
    #texture_path;
    #model;
    #scene;
    #isLocked;
    #physicsWorld;
    #physicsBody;
    constructor(texture_path, isVisible, isCollectable, isUsable, scene, physicsWorld, position){
        this.#texture_path = texture_path;
        this.#isVisibile = isVisible;
        this.#isCollectable = isCollectable;
        this.#isUsable = isUsable;
        this.#scene = scene;
        this.#physicsWorld = physicsWorld;
        this.#isLocked = false;
        this.#LoadModel(position);
    }

    #LoadModel(position) {
        const radius = 1;
        const widthSegments = 32;
        const heightSegments = 32;
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(this.#texture_path); 
    
        const material = new THREE.MeshStandardMaterial({
            map: texture,
        });
    
        this.#model = new THREE.Mesh(geometry, material);
    
        this.#scene.add(this.#model);
    
        this.#model.position.set(position.x, position.y, position.z);
    
        // Physics Body
        const boundingBox = new THREE.Box3().setFromObject(this.#model);
        const size = boundingBox.getSize(new THREE.Vector3());
    
        // Creazione del corpo fisico
        this.#physicsBody = new CANNON.Body({
            mass: 10,
            shape: new CANNON.Sphere(radius),  // Usa un corpo sferico per la fisica
            position: new CANNON.Vec3(position.x, position.y, position.z),
        });
    
        // Aggiungi il corpo fisico al mondo
        this.#physicsWorld.addBody(this.#physicsBody);
    
        // Imposta la visibilità, se necessario
        this.setIsVisible(this.#isVisibile);
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

    setIsLocked(){
        this.#isLocked = true;
    }
    get isLocked(){
        return this.#isLocked;
    }

    lockSphere(holePosition) {
        const distance = this.#model.position.distanceTo(holePosition);
        if(distance < 1){
            this.#isLocked = true;
            this.#model.position.lerp(holePosition, 0.01);
            this.#model.material.color.set("yellow");
            this.setIsVisible(true);
        }
    }

    
    
}