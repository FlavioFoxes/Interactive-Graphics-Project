import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CSG } from 'three-csg-ts';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class MazeUniverse{
    #wallSize;
    #wallHeight;
    #walls;
    #physicsWalls;
    #scene;
    #physicsWorld;
    #lights;
    #lights_model;

    constructor(scene, physicsWorld){
        this.#scene = scene;
        this.#physicsWorld = physicsWorld;
        this.#wallSize = 1;
        this.#wallHeight = 10;
        this.#walls = [];
        this.#physicsWalls = [];
        this.#lights = [];
        this.#lights_model = [];
        this.#CreateWalls();
        this.#AddWallsPhysics();
        this.#AddLights();  
    }

    #CreateWalls(){
        // Texture
        const textureLoader = new THREE.TextureLoader();
        const wallTexture = textureLoader.load("textures/bricks.jpg"); 
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        const repeatX = 15/5; 
        const repeatZ = 20/5;
        const repeatY = 10/5;
        
        wallTexture.repeat.set(repeatX, repeatY, repeatZ);

        const wall1 = new THREE.Mesh(
            new THREE.BoxGeometry(40, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })

        );
        wall1.position.set(0, this.#wallHeight / 2, 40);
        this.#scene.add(wall1);
        this.#walls.push(wall1);

        const wall2 = new THREE.Mesh(
            new THREE.BoxGeometry(this.#wallSize, this.#wallHeight, 41),
            new THREE.MeshStandardMaterial({ map: wallTexture })

        );
        wall2.position.set(20, this.#wallHeight / 2, 60);
        this.#scene.add(wall2);
        this.#walls.push(wall2);


        const wall3 = new THREE.Mesh(
            new THREE.BoxGeometry(40, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall3.position.set(0, this.#wallHeight / 2, 80);
        this.#scene.add(wall3);
        this.#walls.push(wall3);
    
        const wall4 = new THREE.Mesh(
            new THREE.BoxGeometry(this.#wallSize, this.#wallHeight, 40),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall4.position.set(0, this.#wallHeight / 2, 60);
        this.#scene.add(wall4);
        this.#walls.push(wall4);

        const wall5 = new THREE.Mesh(
            new THREE.BoxGeometry(10, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall5.position.set(25, this.#wallHeight / 2, 50);
        this.#scene.add(wall5);
        this.#walls.push(wall5);

        const wall6 = new THREE.Mesh(
            new THREE.BoxGeometry(this.#wallSize, this.#wallHeight, 11),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall6.position.set(-20, this.#wallHeight / 2, 45);
        this.#scene.add(wall6);
        this.#walls.push(wall6);

        const wall7 = new THREE.Mesh(
            new THREE.BoxGeometry(10, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall7.position.set(-25, this.#wallHeight / 2, 50);
        this.#scene.add(wall7);
        this.#walls.push(wall7);

        const wall8 = new THREE.Mesh(
            new THREE.BoxGeometry(this.#wallSize, this.#wallHeight, 11),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall8.position.set(-20, this.#wallHeight / 2, 85);
        this.#scene.add(wall8);
        this.#walls.push(wall8);
    }

    #AddLights(){
        const lightPositions = [
            { x: 0, y: this.#wallHeight - 2, z: 40 },
            { x: 29, y: this.#wallHeight - 2, z: 35 },
            { x: -29, y: this.#wallHeight - 2, z: 35 },
            { x: 29, y: this.#wallHeight - 2, z: 45 },
            { x: -29, y: this.#wallHeight - 2, z: 45 },
            { x: 29, y: this.#wallHeight - 2, z: 55 },
            { x: -29, y: this.#wallHeight - 2, z: 55 },
            { x: 29, y: this.#wallHeight - 2, z: 65 },
            { x: -29, y: this.#wallHeight - 2, z: 65 },
            { x: 29, y: this.#wallHeight - 2, z: 75 },
            { x: -29, y: this.#wallHeight - 2, z: 75 },
            { x: 29, y: this.#wallHeight - 2, z: 85 },
            { x: -29, y: this.#wallHeight - 2, z: 85 },
            { x: 19, y: this.#wallHeight - 2, z: 45 },
            { x: 19, y: this.#wallHeight - 2, z: 75 },
            { x: 1, y: this.#wallHeight - 2, z: 45 },
            { x: 1, y: this.#wallHeight - 2, z: 75 },
            { x: -1, y: this.#wallHeight - 2, z: 45 },
            { x: -1, y: this.#wallHeight - 2, z: 75 },
            
        ];

        const lightIntensity = 5; 
        const lightDistance = 30; 
        const decay = 1.5; 
        
        const loader = new GLTFLoader();
        
        lightPositions.forEach(pos => {
            const light = new THREE.PointLight(0xffa500, lightIntensity, lightDistance, decay);
            light.position.set(pos.x, pos.y, pos.z);
            light.castShadow = true;
            let model;
            loader.load("torch/scene.gltf", (gltf) => {
                model = gltf.scene;
                this.#scene.add(model);
                model.position.set(light.position.x, light.position.y, light.position.z);
                if(model.position.x > 0){
                    model.rotation.y = -Math.PI/2;
                }
                else{
                    model.rotation.y = Math.PI/2;
                }
                model.updateMatrixWorld(); // Assicurati che la matrice del mondo sia aggiornata
                this.#lights_model.push(model);
    
            })
            
            this.#scene.add(light);
            this.#lights.push(light);
        });
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


    ActivateMaze(){
        for(const wall of this.#walls){
            wall.visible = true;
        }

        for(const wallBody of this.#physicsWalls){
            this.#physicsWorld.addBody(wallBody);
        }

        for(const light of this.#lights){
            light.visible = true;
        }

        for(const light_model of this.#lights_model){
            light_model.visible = true;
        }
    }
    DeactivateMaze(){
        for(const wall of this.#walls){
            wall.visible = false;
        }

        for(const wallBody of this.#physicsWalls){
            this.#physicsWorld.removeBody(wallBody);
        }

        for(const light of this.#lights){
            light.visible = false;
        }

        for(const light_model of this.#lights_model){
            light_model.visible = false;
        }
    }
    
}

export class MazeXenoverse{
    #wallSize;
    #wallHeight;
    #walls;
    #physicsWalls;
    #scene;
    #physicsWorld;
    #lights;
    #lights_model;

    constructor(scene, physicsWorld){
        this.#scene = scene;
        this.#physicsWorld = physicsWorld;
        this.#wallSize = 1;
        this.#wallHeight = 10;
        this.#walls = [];
        this.#physicsWalls = [];
        this.#lights = [];
        this.#lights_model = [];
        this.#CreateWalls();
        this.#AddWallsPhysics();
        this.#AddLights();
        this.DeactivateMaze();
    }

    #CreateWalls(){
        // Texture
        const textureLoader = new THREE.TextureLoader();
        const wallTexture = textureLoader.load("textures/bricks.jpg"); 
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        const repeatX = 15/5; 
        const repeatZ = 20/5;
        const repeatY = 10/5;
        
        wallTexture.repeat.set(repeatX, repeatY, repeatZ);

        const wall1 = new THREE.Mesh(
            new THREE.BoxGeometry(20, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })

        );
        wall1.position.set(20, this.#wallHeight / 2, 40);
        this.#scene.add(wall1);
        this.#walls.push(wall1);

        const wall2 = new THREE.Mesh(
            new THREE.BoxGeometry(this.#wallSize, this.#wallHeight, 20),
            new THREE.MeshStandardMaterial({ map: wallTexture })

        );
        wall2.position.set(10, this.#wallHeight / 2, 50);
        this.#scene.add(wall2);
        this.#walls.push(wall2);


        const wall3 = new THREE.Mesh(
            new THREE.BoxGeometry(20, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall3.position.set(0, this.#wallHeight / 2, 60);
        this.#scene.add(wall3);
        this.#walls.push(wall3);
    
        const wall4 = new THREE.Mesh(
            new THREE.BoxGeometry(this.#wallSize, this.#wallHeight, 20),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall4.position.set(-10, this.#wallHeight / 2, 50);
        this.#scene.add(wall4);
        this.#walls.push(wall4);

        const wall5 = new THREE.Mesh(
            new THREE.BoxGeometry(20, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall5.position.set(-20, this.#wallHeight / 2, 40);
        this.#scene.add(wall5);
        this.#walls.push(wall5);

        const wall6 = new THREE.Mesh(
            new THREE.BoxGeometry(10, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall6.position.set(25, this.#wallHeight / 2, 50);
        this.#scene.add(wall6);
        this.#walls.push(wall6);

        const wall7 = new THREE.Mesh(
            new THREE.BoxGeometry(this.#wallSize, this.#wallHeight, 20),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall7.position.set(20, this.#wallHeight / 2, 60);
        this.#scene.add(wall7);
        this.#walls.push(wall7);

        const wall8 = new THREE.Mesh(
            new THREE.BoxGeometry(40, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall8.position.set(0, this.#wallHeight / 2, 70);
        this.#scene.add(wall8);
        this.#walls.push(wall8);

        const wall9 = new THREE.Mesh(
            new THREE.BoxGeometry(this.#wallSize, this.#wallHeight, 20),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall9.position.set(-20, this.#wallHeight / 2, 60);
        this.#scene.add(wall9);
        this.#walls.push(wall9);

        const wall10 = new THREE.Mesh(
            new THREE.BoxGeometry(10, this.#wallHeight, this.#wallSize),
            new THREE.MeshStandardMaterial({ map: wallTexture })
        );
        wall10.position.set(-25, this.#wallHeight / 2, 50);
        this.#scene.add(wall10);
        this.#walls.push(wall10);
    }

    #AddLights(){
        const lightPositions = [
            { x: 0, y: this.#wallHeight - 2, z: 40 },
            { x: 29, y: this.#wallHeight - 2, z: 35 },
            { x: -29, y: this.#wallHeight - 2, z: 35 },
            { x: 29, y: this.#wallHeight - 2, z: 45 },
            { x: -29, y: this.#wallHeight - 2, z: 45 },
            { x: 29, y: this.#wallHeight - 2, z: 55 },
            { x: -29, y: this.#wallHeight - 2, z: 55 },
            { x: 29, y: this.#wallHeight - 2, z: 65 },
            { x: -29, y: this.#wallHeight - 2, z: 65 },
            { x: 29, y: this.#wallHeight - 2, z: 75 },
            { x: -29, y: this.#wallHeight - 2, z: 75 },
            { x: 29, y: this.#wallHeight - 2, z: 85 },
            { x: -29, y: this.#wallHeight - 2, z: 85 },
            { x: 19, y: this.#wallHeight - 2, z: 45 },
            { x: 19, y: this.#wallHeight - 2, z: 75 },
            { x: 1, y: this.#wallHeight - 2, z: 45 },
            { x: 1, y: this.#wallHeight - 2, z: 75 },
            { x: -1, y: this.#wallHeight - 2, z: 45 },
            { x: -1, y: this.#wallHeight - 2, z: 75 },
            
        ];

        const lightIntensity = 5; 
        const lightDistance = 30; 
        const decay = 1.5; 
        
        const loader = new GLTFLoader();
        
        lightPositions.forEach(pos => {
            const light = new THREE.PointLight(0xffa500, lightIntensity, lightDistance, decay);
            light.position.set(pos.x, pos.y, pos.z);
            light.castShadow = true;
            let model;
            loader.load("torch/scene.gltf", (gltf) => {
                model = gltf.scene;
                this.#scene.add(model);
                model.position.set(light.position.x, light.position.y, light.position.z);
                if(model.position.x > 0){
                    model.rotation.y = -Math.PI/2;
                }
                else{
                    model.rotation.y = Math.PI/2;
                }
                model.updateMatrixWorld(); // Assicurati che la matrice del mondo sia aggiornata
                this.#lights_model.push(model);
    
            })
            
            this.#scene.add(light);
            this.#lights.push(light);
        });
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

    ActivateMaze(){
        for(const wall of this.#walls){
            wall.visible = true;
        }

        for(const wallBody of this.#physicsWalls){
            this.#physicsWorld.addBody(wallBody);
        }

        for(const light of this.#lights){
            light.visible = true;
        }

        for(const light_model of this.#lights_model){
            light_model.visible = true;
        }
    }
    DeactivateMaze(){
        for(const wall of this.#walls){
            wall.visible = false;
        }

        for(const wallBody of this.#physicsWalls){
            this.#physicsWorld.removeBody(wallBody);
        }

        for(const light of this.#lights){
            light.visible = false;
        }

        for(const light_model of this.#lights_model){
            light_model.visible = false;
        }
    }
    
}