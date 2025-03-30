import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class Controller {

    // Private attributes
    #camera;
    #character;
    #controls;
    #world;
    #scene;
    #moveForward;
    #moveBackward;
    #moveLeft;
    #moveRight;
    #moveSpeed;
    #gameMessage;
    #isCommandsMessageShown;
    #isCommandSecondRoom;
    #distanceThreshold;
    #holding;
    #heldObject;
    #elapsedTime;

    constructor(camera, character, renderer, world, gameMessage, scene){
        this.#scene = scene;
        this.#camera = camera;
        this.#character = character;
        this.#world = world;
        this.#moveSpeed = 0.1;
        this.#controls = new OrbitControls(this.#camera.perspectiveCamera, renderer.domElement);
        this.#controls.target.set(0, 0.5, 0);
        this.#controls.update();
        this.#controls.enablePan = false;
        this.#controls.enableDamping = true;
        this.#controls.autoRotate = true;
        this.#gameMessage = gameMessage;
        this.#isCommandsMessageShown = false;
        this.#isCommandSecondRoom = false;
        this.#distanceThreshold = 3;
        this.#holding = false;
        this.#heldObject = null;
        this.#elapsedTime = 0;
        this.#Init();
    } 

    #Init() {
        this.#moveForward = false;
        this.#moveBackward = false; 
        this.#moveLeft = false;
        this.#moveRight = false;
        this.#AddWASDListener();
    }

    // Private method for listener of WASD buttons
    #AddWASDListener() {

        document.addEventListener('keydown', (event) => {
            if (event.key === 'w') this.#moveForward = true;
            if (event.key === 's') this.#moveBackward = true;
            if (event.key === 'a') this.#moveLeft = true;
            if (event.key === 'd') this.#moveRight = true;
            if (event.key === 'u') {
                this.#world.setUniverse(!this.#world.isUniverse);
                if(!this.#isCommandsMessageShown){
                    this.#gameMessage.showCommandMessage("Here you are! This is the Xenoverse.<br> The commands are part of this Verse until you didn't discover them.<br> \
                                                         Now I can show you them: <br>\
                                                         WASD: move <br>\
                                                         U: switch between Universe and Xenoverse <br>\
                                                         T: interact with environment (take object / activate something)<br>\
                                                         G: use of telekinetics (after you will obtain the weapon)");
                    this.#isCommandsMessageShown = true;
                }
                if(this.#world.isUniverse){
                    this.UpdateSwitchToUniverse();
                }
                else{
                    this.UpdateSwitchToXenoverse();
                }
                console.warn("is universe:   ", this.#world.isUniverse);
            }
            if (event.key === 't') {
                if (this.#character.model) {
                    let objects;
                    if (this.#world.isUniverse) {
                        objects = this.#world.objectsInUniverse;
                    } else {
                        objects = this.#world.objectsInXenoverse;
                    }
            
                    const character_position = this.#character.model.position;
                    let collectedObject = null;
            
                    for (const obj of objects) {
                        if (obj.model && character_position.distanceTo(obj.model.position) < this.#distanceThreshold) {
                            if (obj.isCollectable) {
                                this.#CollectObject(obj);
                                collectedObject = obj;  
                                break;  
                            }
                            else if(obj.isUsable){
                                if(this.#character.numObjectsCollected < 3){
                                    this.#gameMessage.showUsableMessage("You haven't collected all the necessary objects to use the machinery");
                                }
                                else{
                                    this.#gameMessage.showUsableMessage("You collected all the objects! This telekinetics gun is for you. Now you have to take the plasma to the door generator to reactivate the electricity");
                                    this.#world.AddTelekineticsGun();
                                    this.#character.enableTelekinetic();
                                          
                                }
                                this.#gameMessage.hideObjectsMessage();

                            }
                        }
                    }

                    if(this.#world.door && character_position.distanceTo(this.#world.door.position) < this.#distanceThreshold*5){
                        if(this.#world.doorCanBeOpened){
                            this.#world.OpenDoor();
                        }
                        else{
                            this.#gameMessage.showUsableMessage("The door has no electricity. Reactivate it to open it");
                        }
                    }
                    
                    if (collectedObject) {
                        for (let i = objects.length - 1; i >= 0; i--) {
                            if (objects[i] === collectedObject) {
                                objects.splice(i, 1); 
                                break;
                            }
                        }
                    }
                    console.warn("collected objects:    ", this.#character.numObjectsCollected);
                    
                }
            }
            if(event.key === 'g'){
                if(this.#character.enabledTelekinetic && !this.#holding){
                    const closestObject = this.findClosestObject();
                    if(closestObject){
                        this.#heldObject = closestObject;
                        this.#holding= true;
                        this.#heldObject.disablePhysics();
                    }


                }
            }
            
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'w') this.#moveForward = false;
            if (event.key === 's') this.#moveBackward = false;
            if (event.key === 'a') this.#moveLeft = false;
            if (event.key === 'd') this.#moveRight = false;
            if (event.key === 'g'){
                if(this.#character.enabledTelekinetic){
                    
                    if(this.#heldObject){
                        this.#heldObject.enablePhysics();
                        if(this.#heldObject.physicsBody)
                            this.#heldObject.model.position.copy(this.#heldObject.physicsBody.position);
                    }
                    this.#heldObject = null;
                    this.#holding = false;
                }
            } 
        });
    }
    

    findClosestObject() {
        let closestObject = null;
        let minDistance = 6;
        const objects = (this.#world.isUniverse) ? this.#world.objectsInUniverse : this.#world.objectsInXenoverse;
        for(const obj of objects){
            if(this.#character.model.position.distanceTo(obj.model.position) < minDistance){
                closestObject = obj;
                minDistance = this.#character.model.position.distanceTo(obj.model.position);
            }
        }
        return closestObject;
    }
    
    // Getter for forward motion
    get moveForward() {
        return this.#moveForward;
    }
    // Getter for bacward motion
    get moveBackward() {
        return this.#moveBackward;
    }
    // Getter for left motion
    get moveLeft() {
        return this.#moveLeft;
    }
    // Getter for right motion
    get moveRight() {
        return this.#moveRight;
    }

    // Method for update of character position
    UpdateCharacterPosition() {
        if (this.#character.model) {
            const speed = this.#moveSpeed;

            let movement = new CANNON.Vec3(0, 0, 0);

            if (this.#moveForward) {
                movement.z += speed * Math.cos(this.#character.model.rotation.y);
                movement.x += speed * Math.sin(this.#character.model.rotation.y);
            }
            if (this.#moveBackward) {
                movement.z -= speed * Math.cos(this.#character.model.rotation.y);
                movement.x -= speed * Math.sin(this.#character.model.rotation.y);
            }

            if (this.#moveLeft) this.#character.model.rotation.y += this.#moveSpeed;
            if (this.#moveRight) this.#character.model.rotation.y -= this.#moveSpeed;

            this.#character.physicsBody.position.x += movement.x;
            this.#character.physicsBody.position.z += movement.z;

            this.#character.model.position.copy(this.#character.physicsBody.position);
            this.#character.model.position.y -= 1;  
            this.#world.physicsWorld.step(1 / 60);

            if(this.#character.position.z > 30 && !this.#isCommandSecondRoom){
                this.#gameMessage.showCommandMessage("Take the two spheres inside their corresponding cube at the end of the maze. <br>\
                                                      They are the only objects we discovered to be able to cross the two Verses, <br>\
                                                      so they can go beyond what exists in the Universe and the Xenoverse");
                this.#isCommandSecondRoom = true;
            }
        }
    }
    #ComputeCameraOffset() {
        const cameraOffset = new THREE.Vector3();
        cameraOffset.copy(this.#camera.thirdPersonCameraOffset);
    
        // Convert euler angle of rotation in quaternion
        const quaternion = new THREE.Quaternion();
        this.#character.model.getWorldQuaternion(quaternion);
    
        cameraOffset.applyQuaternion(quaternion);
        cameraOffset.add(this.#character.model.position);
    
        return cameraOffset;
    }
    
    #ComputeCameraLookat() {
        const cameralLookat = new THREE.Vector3();
        cameralLookat.copy(this.#camera.thirdPersonCameraLookat);

        // Convert euler angle of rotation in quaternion
        const quaternion = new THREE.Quaternion();
        this.#character.model.getWorldQuaternion(quaternion);
    
        cameralLookat.applyQuaternion(quaternion);
        cameralLookat.add(this.#character.model.position);
    
        return cameralLookat;
    }

    // Method for update of camera position
    UpdateCameraPosition() {
        if (this.#character.model) {
            
            const cameraLookat = this.#ComputeCameraLookat();
            const cameraOffset = this.#ComputeCameraOffset();
            this.#camera.perspectiveCamera.position.copy(cameraOffset);
            this.#camera.perspectiveCamera.lookAt(cameraLookat);

        }
    }

    UpdateCharacterAnimation() {
        if(this.#character.model){
            if(this.#moveForward || this.#moveBackward){
                const firstAnimation = this.#character.animations[0]; 
                this.#character.mixer.clipAction(firstAnimation).play(); 
            }
            else{
                this.#character.mixer.stopAllAction();
            }

        }
    }

    UpdateSwitchToUniverse(){
        for(const light of this.#world.lights){
            light.color.set(0xffffff);
        }

        for(const obj of this.#world.objectsInUniverse){
            obj.setIsVisible(true);
        }
        for(const obj of this.#world.objectsInXenoverse){
            obj.setIsVisible(false);
        }

        if(this.#world.generator1.model){
            this.#world.generator1.setIsVisible(true);
        }
        if(this.#world.generator2.model){
            this.#world.generator2.setIsVisible(false);
        }

        if(this.#world.doorCanBeOpened){
            this.#world.mazeUniverse.ActivateMaze();
            this.#world.mazeXenoverse.DeactivateMaze();

        }

    }


    UpdateSwitchToXenoverse(){
        for(const light of this.#world.lights){
            light.color.set(0xff0000);
        }
        for(const obj of this.#world.objectsInUniverse){
            obj.setIsVisible(false);
        }
        for(const obj of this.#world.objectsInXenoverse){
            obj.setIsVisible(true);
        }
        if(this.#world.generator1.model){
            this.#world.generator1.setIsVisible(false);
        }
        if(this.#world.generator2.model){
            this.#world.generator2.setIsVisible(true);
        }

        if(this.#world.doorCanBeOpened){
            this.#world.mazeUniverse.DeactivateMaze();
            this.#world.mazeXenoverse.ActivateMaze();
        }
    }

    UpdateInteractionWithObjects(){
        if (this.#character.model){
            let objects;
            if(this.#world.isUniverse){
                objects = this.#world.objectsInUniverse;
            }
            else{
                objects = this.#world.objectsInXenoverse;
            }
            let messageVisible = false;
            const character_position = this.#character.model.position; 
            for(const obj of objects){
                if(obj.model && character_position.distanceTo(obj.model.position) < this.#distanceThreshold){
                    if(obj.isCollectable){
                        this.#gameMessage.showObjectMessage("Take the object");
                        messageVisible = true;
                    }
                    else if(obj.isUsable){
                        this.#gameMessage.showObjectMessage("Use the machinary");
                        messageVisible = true;
                    }
                }
            }
            if(!messageVisible) 
                this.#gameMessage.hideObjectsMessage();
        }
    
    }   

    UpdateTelekineticManagement(){
        if(this.#holding && this.#heldObject){
            const targetPosition = new THREE.Vector3(0,1.5,2.5);
            // Convert euler angle of rotation in quaternion
            const quaternion = new THREE.Quaternion();
            this.#character.model.getWorldQuaternion(quaternion);
            targetPosition.applyQuaternion(quaternion);
            targetPosition.add(this.#character.model.position);

            const smoothFactor = 0.1;
            const tolerance = 0.1;
            if(this.#heldObject.model.position.distanceTo(targetPosition) > tolerance){
                this.#heldObject.model.position.lerp(targetPosition, smoothFactor);
            }
            else{
                this.LevitationAnimation(this.#heldObject, performance.now());
            }
            if(this.#heldObject.physicsBody)
                this.#heldObject.physicsBody.position.copy(this.#heldObject.model.position);

        }

    }

    SynchronizeMeshAndBody(){
        const objects = (this.#world.isUniverse) ? this.#world.objectsInUniverse : this.#world.objectsInXenoverse;
        for(const obj of objects){
            if(obj.model && obj.physicsBody){
                obj.model.position.copy(obj.physicsBody.position);
            }

        }
    }

    UpdateSphere(){
        this.#world.sphere1.lockSphere(this.#world.cube1.position);
        this.#world.sphere2.lockSphere(this.#world.cube2.position);
        
    }

    UpdateCurrentGenerator(){
        this.#world.ActivateGenRotating();
    }

    CheckIfGameEnded(){
        return this.#world.sphere1.isLocked && this.#world.sphere2.isLocked && this.#character.model.position.z > 92;
    }

    LevitationAnimation(obj, time){
        const amplitude = 0.5;
        const frequency = 1;
        const currentTime = performance.now() / 1000;
        // Normalization between 0 and 1
        const delta = (Math.sin(currentTime * Math.PI * 2 * frequency) + 1) / 2; 

        const minY = obj.model.position.y - amplitude;
        const maxY = obj.model.position.y + amplitude;

        const targetPosition = new THREE.Vector3(
        obj.model.position.x,
        THREE.MathUtils.lerp(minY, maxY, delta), 
        obj.model.position.z
        );

        obj.model.position.lerp(targetPosition, 0.01);
    }

    #CollectObject(obj){
        this.#character.incrementObjectsCollected();
        obj.setIsVisible(false);

        this.#gameMessage.showCollectedMessage("Object collected!");

    }
}