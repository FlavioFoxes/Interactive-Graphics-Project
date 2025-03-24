import * as THREE from 'three';
import * as CANNON from 'cannon-es';
export class World {
    
    // Private attributes
    #scene;  
    #ambientLight;
    #floor;
    #walls;
    #physicsWalls;
    #physicsFloor;
    #physicsWorld; 

    constructor(scene) {
        this.#scene = scene;
        this.#walls = [];
        this.#physicsWalls = [];
        this.#Init();
    }
    
    // Private method
    #Init() {
        this.#AddLights();     
        this.#AddFloor();   
        this.#AddWalls();
        this.#InitPhysics();
    }

    #InitPhysics(){
        this.#physicsWorld = new CANNON.World();
        this.#physicsWorld.gravity.set(0, -9.81, 0);

        this.#AddFloorPhysics();
        this.#AddWallsPhysics();
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
            new THREE.PlaneGeometry(60, 60),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        this.#floor.rotation.x = -Math.PI / 2;
        this.#floor.receiveShadow = true;
        this.#scene.add(this.#floor);
    
        
    }

    #AddFloorPhysics(){
        const floorShape = new CANNON.Plane();
        this.#physicsFloor = new CANNON.Body({
            mass: 0,  
            shape: floorShape,
            material: new CANNON.Material("floorMaterial")
        });
        this.#physicsFloor.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.#physicsWorld.addBody(this.#physicsFloor);

    }
    

    #AddWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    
        const wallHeight = 5;
        const wallThickness = 1;
        const floorSize = 60;
    
        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            wallMaterial
        );
        leftWall.position.set(-floorSize / 2, wallHeight / 2, 0);
        this.#scene.add(leftWall);
        this.#walls.push(leftWall);
    
        const rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            wallMaterial
        );
        rightWall.position.set(floorSize / 2, wallHeight / 2, 0);
        this.#scene.add(rightWall);
        this.#walls.push(rightWall);
    }

    #AddWallsPhysics(){
        for (const wall of this.#walls) {
            const boundingBox = new THREE.Box3().setFromObject(wall); 
            const size = boundingBox.getSize(new THREE.Vector3()); 

            const wallBody = new CANNON.Body({
                mass: 0, 
                shape: new CANNON.Box(new CANNON.Vec3(size.x, size.y, size.z)), 
                position: new CANNON.Vec3(wall.position.x, wall.position.y + size.y / 2, wall.position.z), 
            });
            this.#physicsWorld.addBody(wallBody);
            this.#physicsWalls.push(wallBody);
        }
    }
    // Getter for ambient light
    get ambientLight(){
        return this.#ambientLight;
    }

    get walls() {
        return this.#walls;
    }

    get physicsWorld(){
        return this.#physicsWorld;
    }
}
