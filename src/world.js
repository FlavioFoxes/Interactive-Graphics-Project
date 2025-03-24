import * as THREE from 'three';
import * as CANNON from 'cannon-es';
export class World {
    
    // Private attributes
    #scene;  
    #ambientLight;
    #floors;
    #walls;
    #physicsWalls;
    #physicsFloor;
    #physicsWorld; 

    constructor(scene) {
        this.#scene = scene;
        this.#floors = [];
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

        this.#AddFloorsPhysics();
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
        const textureLoader = new THREE.TextureLoader();
        const floor1Texture = textureLoader.load("Poliigon_ConcreteWallCladding_7856_BaseColor.jpg"); // Sostituisci con il percorso corretto
    
        floor1Texture.wrapS = THREE.RepeatWrapping;
        floor1Texture.wrapT = THREE.RepeatWrapping;
    
        // Numero di ripetizioni basato sulle dimensioni del pavimento
        const repeatX = 60 / 10; // Adatta il valore "10" in base alla dimensione della texture
        const repeatZ = 60 / 10;
    
        floor1Texture.repeat.set(repeatX, repeatZ);
    
        const floor1 = new THREE.Mesh(
            new THREE.PlaneGeometry(60, 60),
            new THREE.MeshStandardMaterial({ map: floor1Texture })
        );
    
        floor1.rotation.x = -Math.PI / 2;
        floor1.receiveShadow = true;
        this.#floors.push(floor1);
        this.#scene.add(floor1);

        // floor 2
        const floor2Texture = textureLoader.load("Poliigon_ConcreteWallCladding_7856_Preview1.png"); // Sostituisci con il percorso corretto
    
        floor2Texture.wrapS = THREE.RepeatWrapping;
        floor2Texture.wrapT = THREE.RepeatWrapping;
        floor2Texture.repeat.set(repeatX, repeatZ);

        const floor2 = new THREE.Mesh(
            new THREE.PlaneGeometry(60, 60),
            new THREE.MeshStandardMaterial({ map: floor2Texture })
        );
    
        floor2.rotation.x = -Math.PI / 2;
        floor2.position.z = 60;
        floor2.receiveShadow = true;
        this.#floors.push(floor2);
        this.#scene.add(floor2);

    }
    
    #AddFloorsPhysics(){

        for(const floor of this.#floors){
            const floorShape = new CANNON.Plane();
            this.#physicsFloor = new CANNON.Body({
                mass: 0,  
                shape: floorShape,
                material: new CANNON.Material("floorMaterial")
            });
            this.#physicsFloor.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
            this.#physicsWorld.addBody(this.#physicsFloor);

        }

    }
    

    #AddWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    
        const wallHeight = 5;
        const wallThickness = 1;
        const floorSize = 60;
    
        // Parete sinistra
        const leftWallR1 = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            wallMaterial
        );
        leftWallR1.position.set(-floorSize / 2, wallHeight / 2, 0);
        this.#scene.add(leftWallR1);
        this.#walls.push(leftWallR1);
    
        // Parete destra
        const rightWallR1 = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            wallMaterial
        );
        rightWallR1.position.set(floorSize / 2, wallHeight / 2, 0);
        this.#scene.add(rightWallR1);
        this.#walls.push(rightWallR1);
    
        // Parete posteriore
        const backWallR1 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize, wallHeight, wallThickness),
            wallMaterial
        );
        backWallR1.position.set(0, wallHeight / 2, -floorSize / 2);
        this.#scene.add(backWallR1);
        this.#walls.push(backWallR1);
    
        // Parete frontale con fessura
        const frontWallLeftR1 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize, wallHeight, wallThickness), // Ridotto di "doorWidth" per fare spazio alla porta
            wallMaterial
        );
        frontWallLeftR1.position.set(floorSize/2, wallHeight / 2, floorSize / 2);  // Posizionato alla metà del lato frontale
        this.#scene.add(frontWallLeftR1);
        this.#walls.push(frontWallLeftR1);
    
           // Parete frontale con fessura
        const frontWallRightR1 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize, wallHeight, wallThickness), // Ridotto di "doorWidth" per fare spazio alla porta
            wallMaterial    
        );
        frontWallRightR1.position.set(-floorSize/1.8, wallHeight / 2, floorSize / 2);  // Posizionato alla metà del lato frontale
        this.#scene.add(frontWallRightR1);
        this.#walls.push(frontWallRightR1);

        ///////////////////////////////////////////////
        // Parete sinistra
        const leftWallR2 = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            wallMaterial
        );
        leftWallR2.position.set(-floorSize / 2, wallHeight / 2, floorSize);
        this.#scene.add(leftWallR2);
        this.#walls.push(leftWallR2);
    
        // Parete destra
        const rightWallR2 = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            wallMaterial
        );
        rightWallR2.position.set(floorSize / 2, wallHeight / 2, floorSize);
        this.#scene.add(rightWallR2);
        this.#walls.push(rightWallR2);
    
        // Parete frontale con fessura
        const frontWallLeftR2 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize/2, wallHeight, wallThickness), // Ridotto di "doorWidth" per fare spazio alla porta
            wallMaterial
        );
        frontWallLeftR2.position.set(floorSize/3.5, wallHeight / 2, floorSize*1.5);  // Posizionato alla metà del lato frontale
        this.#scene.add(frontWallLeftR2);
        this.#walls.push(frontWallLeftR2);
    
            // Parete frontale con fessura
        const frontWallRightR2 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize/2, wallHeight, wallThickness), // Ridotto di "doorWidth" per fare spazio alla porta
            wallMaterial    
        );
        frontWallRightR2.position.set(-floorSize/3.5, wallHeight / 2, floorSize*1.5);  // Posizionato alla metà del lato frontale
        this.#scene.add(frontWallRightR2);
        this.#walls.push(frontWallRightR2);
        
    }
    

    #AddWallsPhysics(){
        for (const wall of this.#walls) {
            const boundingBox = new THREE.Box3().setFromObject(wall); 
            const size = boundingBox.getSize(new THREE.Vector3()); 

            const wallBody = new CANNON.Body({
                mass: 0, 
                shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)), 
                position: new CANNON.Vec3(wall.position.x, wall.position.y, wall.position.z), 
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
