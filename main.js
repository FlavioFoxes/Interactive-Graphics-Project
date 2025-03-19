import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

// Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;


// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Light
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

// Cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshLambertMaterial( { color: 0x00ff00, emissive: 'purple' } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(10, 10, 10);
scene.add( cube );


// Create orbit control (allows to rotate by mouse around the object)
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60, 10, 10),
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
    })
);
floor.castShadow = false;
floor.receiveShadow = true;
floor.rotation.x = 0;
scene.add(floor);
// Animate function
function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

// const gui = new GUI();
// gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
// gui.add(light, 'intensity', 0, 5, 0.01);