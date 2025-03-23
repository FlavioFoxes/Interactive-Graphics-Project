import * as THREE from 'three';

export class World {
    
    // Private attributes
    #scene;  
    #ambientLight;
    #floor;

    constructor(scene) {
        this.#scene = scene;
        this.#Init();
    }
    
    // Private method
    #Init() {
        this.#AddLights();     
        this.#AddFloor();   
    }

    // Private method
    #AddLights() {
        const color = 0xFFFFFF;
        const intensity = 1;
        this.#ambientLight = new THREE.AmbientLight(color, intensity);
        this.#scene.add(this.#ambientLight);
    }

    // Private method
    #AddFloor() {
        this.#floor = new THREE.Mesh(
          new THREE.PlaneGeometry(60, 60, 10, 10),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
          })
        );
        this.#floor.castShadow = false;
        this.#floor.receiveShadow = true;
        this.#floor.rotation.x = -Math.PI / 2;
        this.#floor.position.set(0, 0, 0);

        this.#scene.add(this.#floor);
    }

    // Getter for ambient light
    get ambientLight(){
        return this.#ambientLight;
    }
}
