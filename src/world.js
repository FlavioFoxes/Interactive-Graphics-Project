import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Object } from './object';
import { Sphere } from './sphere';
import { MazeUniverse, MazeXenoverse } from './maze'

export class World {
    
    // Private attributes
    #scene;  
    #ambientLight;
    #floors;
    #walls;
    #ceilings;
    #physicsWalls;
    #physicsFloor;
    #physicsWorld; 
    #door;
    #physicsDoor;
    #doorAnimation;
    #doorMixer;
    #doorDimensions;
    #lights;
    #objectsInUniverse;
    #objectsInXenoverse;
    #isUniverse;
    #doorCanBeOpened;
    #mazeUniverse;
    #mazeXenoverse;

    constructor(scene) {
        this.#scene = scene;
        this.#floors = [];
        this.#ceilings = [];
        this.#walls = [];
        this.#physicsWalls = [];
        this.#lights = [];
        this.#doorDimensions = new THREE.Vector3();
        this.#objectsInUniverse = [];
        this.#objectsInXenoverse = [];
        this.#isUniverse = true;
        this.#doorCanBeOpened = false;
        this.#Init();
    }
    
    // Private method
    #Init() {
        this.#AddLights();     
        this.#AddFloor();   
        this.#AddWalls();
        this.#AddCeilings();
        this.#AddDoor();
        this.#InitPhysics();

        // this.#CreateUniverseMaze();
        // this.#CreateXenoverseMaze();
        // this.#mazeXenoverse.DeactivateMaze();

    }
    
    #InitPhysics(){
        this.#physicsWorld = new CANNON.World();
        this.#physicsWorld.gravity.set(0, -9.81, 0);
        
        this.#AddFloorsPhysics();
        this.#AddCeilingsPhysics();
        this.#AddWallsPhysics();
        
        
        this.#AddObjectsFirstRoom();
    }

    #AddDoor() {
        const loader = new GLTFLoader();
        loader.load('sci-fi_door/scene.gltf', (gltf) => {
            this.#door = gltf.scene;
            this.#scene.add(this.#door);
            this.#door.position.set(0, -1, 29.5);
            // this.#door.scale.set(1,1,1);
            this.#door.scale.set(0.04, 0.04, 0.04);
            // Calcola le dimensioni del modello direttamente da this.#door
            this.#door.updateMatrixWorld(); // Assicurati che la matrice del mondo sia aggiornata
            const box = new THREE.Box3().setFromObject(this.#door);
            box.getSize(this.#doorDimensions);
            this.#doorDimensions.z = 4;
            this.#doorDimensions.x -= 14;
            if (gltf.animations.length > 0) {
                this.#doorAnimation = gltf.animations;
                console.warn("Animazioni per porta:", this.#doorAnimation);
            } else {
                console.warn("Nessuna animazione trovata per la porta.");
            }

            this.#doorMixer = new THREE.AnimationMixer(this.#door);
            this.#AddDoorPhysics();

        })
    }

    #AddDoorPhysics(){
        const size = this.#doorDimensions; 

        this.#physicsDoor = new CANNON.Body({
            mass: 0.1, 
            shape: new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2)), 
            position: new CANNON.Vec3(this.#door.position.x, this.#door.position.y, this.#door.position.z), 
        });
        this.#physicsWorld.addBody(this.#physicsDoor);
        
    }

    // Private method
    #AddLights() {
        const color = 0xffffff; //0xff0000;
        
        this.#ambientLight = new THREE.AmbientLight(color, 0.7); // Aumentata l'intensità
        this.#scene.add(this.#ambientLight);
        this.#lights.push(this.#ambientLight);
        const lightIntensity = 5; 
        const lightDistance = 30; 
        const decay = 1.5; 
        const numLightsX = 10; 
        const numLightsZ = 10; 
        const spacing = 60 / (numLightsX + 1); 
    
        for (let i = 1; i <= numLightsX; i++) {
            for (let j = 1; j <= numLightsZ; j++) {
                const light = new THREE.PointLight(color, lightIntensity, lightDistance, decay);
                light.position.set(-30 + i * spacing, 10 - 0.2, -30 + j * spacing); 
                light.castShadow = true;
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024;
                light.shadow.bias = -0.005; 
                this.#scene.add(light);
                this.#lights.push(light);
            }
        }
    }
    
    // Private method
    #AddFloor() {
        const textureLoader = new THREE.TextureLoader();
        const floor1Texture = textureLoader.load("x.avif"); 
    
        floor1Texture.wrapS = THREE.RepeatWrapping;
        floor1Texture.wrapT = THREE.RepeatWrapping;
    
        const repeatX = 100 / 5;
        const repeatZ = 100 / 5;
    
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
        const floor2Texture = textureLoader.load("textures/terreno.jpg"); 
    
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
    
    #AddCeilings() {
        const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const textureLoader = new THREE.TextureLoader();
        const ceiling1Texture = textureLoader.load("metal-panel.avif"); 
        ceiling1Texture.wrapS = THREE.RepeatWrapping;
        ceiling1Texture.wrapT = THREE.RepeatWrapping;
        const repeatX = 60 / 10; 
        const repeatZ = 60 / 10;
    
        ceiling1Texture.repeat.set(repeatX, repeatZ);
    
        const ceiling1 = new THREE.Mesh(
            new THREE.PlaneGeometry(60, 60),
            new THREE.MeshStandardMaterial({ map: ceiling1Texture })

        );
        ceiling1.rotation.x = Math.PI / 2; 
        ceiling1.position.y = 10; 
        ceiling1.position.z = 0; 
        this.#scene.add(ceiling1);
        this.#ceilings.push(ceiling1);
    
        const ceiling2 = new THREE.Mesh(
            new THREE.PlaneGeometry(60, 60),
            ceilingMaterial
        );
        ceiling2.rotation.x = Math.PI / 2;
        ceiling2.position.y = 10;
        ceiling2.position.z = 60;
        this.#scene.add(ceiling2);
        this.#ceilings.push(ceiling2);
    }
    
    #AddCeilingsPhysics() {
        for (const ceiling of this.#ceilings) {
            const ceilingShape = new CANNON.Plane(); 
    
            const ceilingBody = new CANNON.Body({
                mass: 0, 
                shape: ceilingShape,
                material: new CANNON.Material("ceilingMaterial")
            });
    
            ceilingBody.position.set(ceiling.position.x, ceiling.position.y, ceiling.position.z);
            ceilingBody.quaternion.setFromEuler(Math.PI / 2, 0, 0);
    
            this.#physicsWorld.addBody(ceilingBody);
        }
    }
    
    #AddWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const textureLoader = new THREE.TextureLoader();
        const wallTexture = textureLoader.load("metal-panel.avif"); 
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        const repeatX = 60 / 20; 
        const repeatZ = 60 / 20;
    
        wallTexture.repeat.set(repeatX, repeatZ);
    
        const wallHeight = 10;
        const wallThickness = 1;
        const floorSize = 60;
    
        // Parete sinistra
        const leftWallR1 = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })

        );
        leftWallR1.position.set(-floorSize / 2, wallHeight / 2, 0);
        this.#scene.add(leftWallR1);
        this.#walls.push(leftWallR1);
    
        // Parete destra
        const rightWallR1 = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        rightWallR1.position.set(floorSize / 2, wallHeight / 2, 0);
        this.#scene.add(rightWallR1);
        this.#walls.push(rightWallR1);
    
        // Parete posteriore
        const backWallR1 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize, wallHeight, wallThickness),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        backWallR1.position.set(0, wallHeight / 2, -floorSize / 2);
        this.#scene.add(backWallR1);
        this.#walls.push(backWallR1);
    
        // Parete frontale con fessura
        const frontWallLeftR1 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize/2, wallHeight, wallThickness), // Ridotto di "doorWidth" per fare spazio alla porta
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        frontWallLeftR1.position.set(floorSize/2.3, wallHeight / 2, floorSize / 2);  // Posizionato alla metà del lato frontale
        this.#scene.add(frontWallLeftR1);
        this.#walls.push(frontWallLeftR1);
    
           // Parete frontale con fessura
        const frontWallRightR1 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize/2, wallHeight, wallThickness), // Ridotto di "doorWidth" per fare spazio alla porta
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        frontWallRightR1.position.set(-floorSize/2.3, wallHeight / 2, floorSize / 2);  // Posizionato alla metà del lato frontale
        this.#scene.add(frontWallRightR1);
        this.#walls.push(frontWallRightR1);

        ///////////////////////////////////////////////
        const wall2Texture = textureLoader.load("textures/muro.jpg"); 
        wall2Texture.wrapS = THREE.RepeatWrapping;
        wall2Texture.wrapT = THREE.RepeatWrapping;
        const repeat2X = 120 / 20; 
        const repeat2Z = 40 / 20;
        wall2Texture.repeat.set(repeat2X, repeat2Z);

        // Parete sinistra
        const leftWallR2 = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            new THREE.MeshStandardMaterial({ map: wall2Texture })
        );
        leftWallR2.position.set(-floorSize / 2, wallHeight / 2, floorSize);
        this.#scene.add(leftWallR2);
        this.#walls.push(leftWallR2);
    
        // Parete destra
        const rightWallR2 = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, floorSize),
            new THREE.MeshStandardMaterial({ map: wall2Texture })
        );
        rightWallR2.position.set(floorSize / 2, wallHeight / 2, floorSize);
        this.#scene.add(rightWallR2);
        this.#walls.push(rightWallR2);
    
        // Parete frontale con fessura
        const frontWallLeftR2 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize/2, wallHeight, wallThickness), // Ridotto di "doorWidth" per fare spazio alla porta
            new THREE.MeshStandardMaterial({ map: wall2Texture })
        );
        frontWallLeftR2.position.set(floorSize/3.5, wallHeight / 2, floorSize*1.5);  // Posizionato alla metà del lato frontale
        this.#scene.add(frontWallLeftR2);
        this.#walls.push(frontWallLeftR2);
    
            // Parete frontale con fessura
        const frontWallRightR2 = new THREE.Mesh(
            new THREE.BoxGeometry(floorSize/2, wallHeight, wallThickness), // Ridotto di "doorWidth" per fare spazio alla porta
            new THREE.MeshStandardMaterial({ map: wall2Texture })    
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

    #AddObjectsFirstRoom() {
        const generator_position = new THREE.Vector3(25, 1, 0);
        const generator_scale = new THREE.Vector3(0.01, 0.01, 0.01);
        const generator = new Object('sci-fi_power_generator_free/scene.gltf', 
                                     true, false, false, this.#scene, this.#physicsWorld, generator_position, generator_scale);
        this.#objectsInUniverse.push(generator);
    
        const lowpoly_position = new THREE.Vector3(-25, 1, 10);
        const lowpoly_scale = new THREE.Vector3(0.01,0.01,0.01);
        const lowpoly = new Object('scifi_generator/scene.gltf', 
                                     false, false, true, this.#scene, this.#physicsWorld, lowpoly_position, lowpoly_scale);
        this.#objectsInXenoverse.push(lowpoly);
    
        // Si può aggiungere effetto lievitazione
        const cube_position = new THREE.Vector3(-10, 1, 15);
        const cube_scale = new THREE.Vector3(0.001, 0.001, 0.001);
        const cube = new Object('generator3/scene.gltf', 
                                    false, true, false, this.#scene, this.#physicsWorld, cube_position, cube_scale);
        this.#objectsInUniverse.push(cube);
        

        const plasma_position = new THREE.Vector3(-20, 1, -27);
        const plasma_scale = new THREE.Vector3(0.001,0.001,0.001);
        const plasma = new Object('plasma/scene.gltf', 
                                    false, true, false, this.#scene, this.#physicsWorld, plasma_position, plasma_scale);
        this.#objectsInXenoverse.push(plasma);
    
        const ring_position = new THREE.Vector3(-10, 1, -18);
        const ring_scale = new THREE.Vector3(0.1,0.1,0.1);
        const ring = new Object('ring/scene.gltf', 
                                    true, true, false, this.#scene, this.#physicsWorld, ring_position, ring_scale);
        this.#objectsInUniverse.push(ring);
    
        const disk_position = new THREE.Vector3(16, 1, -10);
        const disk_scale = new THREE.Vector3(0.002,0.002,0.002);
        const disk = new Object('disk/scene.gltf', 
                                    false, true, false, this.#scene, this.#physicsWorld, disk_position, disk_scale);
        this.#objectsInXenoverse.push(disk);

        // TODO
        // La sfera viene creata correttamente. Controlla nella classe se tutti gli attributi sono necessari.
        // Crea altre sfere
        const sphere_position = new THREE.Vector3(10, 1, 10);
        const sphere_scale = new THREE.Vector3(1,1,1);
        const sphere = new Sphere("x.avif", true, false, false, this.#scene, this.#physicsWorld, sphere_position, sphere_scale);    
    }


    // Getter for ambient light
    get ambientLight(){
        return this.#ambientLight;
    }

    get lights(){
        return this.#lights;
    }
    get walls() {
        return this.#walls;
    }

    get door(){
        return this.#door;
    }

    get doorMixer() {
        return this.#doorMixer;
    }

    get physicsWorld(){
        return this.#physicsWorld;
    }

    get isUniverse() {
        return this.#isUniverse;
    }

    get objectsInUniverse(){
        return this.#objectsInUniverse;
    }
    get objectsInXenoverse(){
        return this.#objectsInXenoverse;
    }

    setUniverse(value){
        this.#isUniverse = value;
    }

    get doorCanBeOpened(){
        return this.#doorCanBeOpened;
    }

    setDoorCanBeOpened(value){
        this.#doorCanBeOpened = value;
    }

    OpenDoor() {
        const firstAnimation = this.#doorAnimation[0]; 
        const action = this.#doorMixer.clipAction(firstAnimation);
        // Loops just once
        action.setLoop(THREE.LoopOnce, 1);
        action.reset().play();
        // Ensures the animation does not come at the beginning
        action.clampWhenFinished = true;

        this.#physicsWorld.removeBody(this.#physicsDoor);
    }
    

    AddTelekineticsGun(){
        const gun_position = new THREE.Vector3(-20, 1.1, 10);
        const gun_scale = new THREE.Vector3(0.5,0.5,0.5);
        const gun = new Object('laser-gun/scene.gltf', 
                                     false, true, false, this.#scene, this.#physicsWorld, gun_position, gun_scale);
        this.#objectsInUniverse.push(gun);
    
    }

    CreateUniverseMaze(){
        this.#mazeUniverse = new MazeUniverse(this.#scene, this.#physicsWorld);
    }

    get mazeUniverse(){
        return this.#mazeUniverse;
    }

    CreateXenoverseMaze(){
        this.#mazeXenoverse = new MazeXenoverse(this.#scene, this.#physicsWorld);
    }
    get mazeXenoverse(){
        return this.#mazeXenoverse;
    }


}
