import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { PointLightHelper } from 'three';

var matrix = new THREE.Matrix4();

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//skybox array
let skyboxArray = [];
let texture_ft = new THREE.TextureLoader().load('assets/skyboxx/spacebox_ft.png');
let texture_bk = new THREE.TextureLoader().load('assets/skyboxx/spacebox_bk.png');
let texture_up = new THREE.TextureLoader().load('assets/skyboxx/spacebox_up.png');
let texture_dn = new THREE.TextureLoader().load('assets/skyboxx/spacebox_dn.png');
let texture_rt = new THREE.TextureLoader().load('assets/skyboxx/spacebox_rt.png');
let texture_lf = new THREE.TextureLoader().load('assets/skyboxx/spacebox_lf.png');

skyboxArray.push(new THREE.MeshBasicMaterial({map: texture_ft}));
skyboxArray.push(new THREE.MeshBasicMaterial({map: texture_bk}));
skyboxArray.push(new THREE.MeshBasicMaterial({map: texture_up}));
skyboxArray.push(new THREE.MeshBasicMaterial({map: texture_dn}));
skyboxArray.push(new THREE.MeshBasicMaterial({map: texture_rt}));
skyboxArray.push(new THREE.MeshBasicMaterial({map: texture_lf}));

for(let i = 0; i < 6; i++){
    skyboxArray[i].side = THREE.BackSide;
}

//geometry
const skyboxGeo = new THREE.BoxGeometry(500,500,500);
const tierraGeo = new THREE.SphereGeometry(5,32,16);
const saturnoGeo = new THREE.SphereGeometry(9,32,16);
const anilloSatGeo = new THREE.TorusGeometry(14, 2, 2, 100);
const jupiterGeo = new THREE.SphereGeometry(10, 32, 16);


//materials to map
const solMat = new THREE.TextureLoader().load('https://vignette.wikia.nocookie.net/planet-texture-maps/images/1/11/Sun-0.jpg/revision/latest/scale-to-width-down/555?cb=20180114104709');
const tierraMat = new THREE.TextureLoader().load('https://static.turbosquid.com/Preview/2014/08/01__12_04_02/words10k.jpg4BFEB116-5502-4949-ABF4D77CB50C417B.jpgOriginal.jpg');
const saturnoMat = new THREE.TextureLoader().load('https://tse4.mm.bing.net/th?id=OIP.GFEc1rnPZX09j_rlhSaszQHaDt&pid=Api');
const anilloSatMat = new THREE.TextureLoader().load('https://tse4.mm.bing.net/th?id=OIP.GFEc1rnPZX09j_rlhSaszQHaDt&pid=Api');
const jupiterMat = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/efbcbef1-b203-4367-9335-2720d26f49ec/dbtfk1b-f4544735-d0b1-45ee-bc8b-2a6344ce3c0f.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvZWZiY2JlZjEtYjIwMy00MzY3LTkzMzUtMjcyMGQyNmY0OWVjXC9kYnRmazFiLWY0NTQ0NzM1LWQwYjEtNDVlZS1iYzhiLTJhNjM0NGNlM2MwZi5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.cdM0hNCF4ZqT9U2gCKjHI-jHusnYaz6OAaTo5pnnuVU');

// Mesh
const skybox = new THREE.Mesh(skyboxGeo, skyboxArray);
const sol = new THREE.Mesh(new THREE.SphereGeometry(15,32,16),new THREE.MeshBasicMaterial({map: solMat}))
const tierra = new THREE.Mesh( tierraGeo,new THREE.MeshBasicMaterial({map: tierraMat}))
const saturno = new THREE.Mesh(saturnoGeo, new THREE.MeshBasicMaterial({map: saturnoMat}))
const anilloSat = new THREE.Mesh(anilloSatGeo, new THREE.MeshBasicMaterial({map: anilloSatMat, transparent: true, opacity: 0.7}))
const jupiter = new THREE.Mesh(jupiterGeo, new THREE.MeshBasicMaterial({map: jupiterMat}))

tierra.position.x = 20
tierra.position.z = 20
saturno.position.z = 110
anilloSat.position.z = 110
jupiter.position.x = 70

//add mesh to scene
//scene.add(skybox)
scene.add(sol)
scene.add(tierra)
scene.add(saturno)
scene.add(anilloSat)
scene.add(jupiter)

//add starfield to scene
function addStar() {
  const stargeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starmaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const star = new THREE.Mesh(stargeometry, starmaterial);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(1000).fill().forEach(addStar);

//sprite for glow efffect
/*
var spriteMaterial = new THREE.SpriteMaterial( 
{ 
	map: new THREE.ImageUtils.loadTexture( 'images/glow.png' ), 
	useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center,
	color: 0x0000ff, transparent: false, blending: THREE.AdditiveBlending
});
var sprite = new THREE.Sprite( spriteMaterial );
sprite.scale.set(200, 200, 1.0);
sol.add(sprite);
*/

//raycasting implementation
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event){

    pointer.x = (event.clientX / window.innerWidth)* 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight)*2 +1;

}

//raycasting work in progress
/*function rayRender(){

    //raycaster will cast ray from mouse to camera
    raycaster.setFromCamera( pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for(let i = 0; i < intersects.length; i++){
        intersects[i].object.material.opacity.set(0.5);
    }

}*/

// Lights
var pointLight = new THREE.PointLight(0xFF0000, .5,10, 2)

pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 0
scene.add(pointLight)

var pointLightHelper = new THREE.PointLightHelper(pointLight, 20); 
scene.add( pointLightHelper);

const ambLight = new THREE.AmbientLight()
//scene.add(ambLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 60
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

function animate ()
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sol.rotation.y = .2*elapsedTime
    tierra.rotation.y = 2*elapsedTime
    saturno.rotation.y = 2*elapsedTime
    anilloSat.rotation.z = 2*elapsedTime
    anilloSat.rotation.x = 0.5*elapsedTime
    jupiter.rotation.y = 2*elapsedTime

    matrix.makeRotationY(.01);
    tierra.position.applyMatrix4(matrix);
    saturno.position.applyMatrix4(matrix);
    anilloSat.position.applyMatrix4(matrix);
    jupiter.position.applyMatrix4(matrix);

    // Update Orbital Controls
    // controls.update()

    //rayRender()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)
}

animate()

//window.addEventListener('pointermove', onPointerMove);
//window.requestAnimationFrame(rayRender);