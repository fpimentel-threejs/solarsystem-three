import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { PointLightHelper } from 'three';
import {GUI} from 'dat.gui';

var matrix = new THREE.Matrix4();
var matrix2 = new THREE.Matrix4();
var matrix3 = new THREE.Matrix4();
var matrix4 = new THREE.Matrix4();
var matrix5 = new THREE.Matrix4();
var matrix6 = new THREE.Matrix4();

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
{
  const color = 0xFFFFFF;  // white
  const near = 10;
  const far = 100;
  //scene.fog = new THREE.Fog(color, near, far);
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    //antialias: true,
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 60
scene.add(camera)

const vertexShader = `
    uniform vec3 viewVector;
    uniform float c;
    uniform float p;
    varying float intensity;
    void main()
    {
        vec3 vNormal = normalize( normalMatrix * normal );
        vec3 vNormel = normalize( normalMatrix * viewVector );
        intensity = pow( c - dot(vNormal, vNormel), p );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`;

const fragmentShader = `
    uniform vec3 glowColor;
    varying float intensity;
    void main() 
    {
        vec3 glow = glowColor * intensity;
        gl_FragColor = vec4( glow, 1.0 );
    }`;

const solglowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        "c":   { type: "f", value: 1.75 },
        "p":   { type: "f", value: 3.5 },
        glowColor: { type: "c", value: new THREE.Color(0xfada5e) },
        viewVector: { type: "v3", value: camera.position }
    },
    vertexShader:   vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
});

const tierraglowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        "c":   { type: "f", value: 1.5 },
        "p":   { type: "f", value: 3 },
        glowColor: { type: "c", value: new THREE.Color(0x85a4ff) },
        viewVector: { type: "v3", value: camera.position }
    },
    vertexShader:   vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
});

const tierraGlow = new THREE.Mesh( new THREE.SphereGeometry(4.5, 32, 16), tierraglowMaterial);
tierraGlow.scale.multiplyScalar(1.2);
tierraGlow.position.x = 40;
tierraGlow.position.z = 40;
scene.add(tierraGlow);

const moonGlow = new THREE.Mesh( new THREE.SphereGeometry(15,32,16), solglowMaterial);
moonGlow.scale.multiplyScalar(1.2);
//scene.add( moonGlow );

//skybox array
/*
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
}*/

//geometry
const tierraGeo = new THREE.SphereGeometry(5,32,16);
const saturnoGeo = new THREE.SphereGeometry(9,32,16);
const anilloSatGeo = new THREE.TorusGeometry(14, 2, 2, 16);
const galaxyGeo = new THREE.TorusGeometry(7.847, 8.1774, 3, 16, 6.28318);
const particlesGeometry = new THREE.BufferGeometry;
const jupiterGeo = new THREE.SphereGeometry(10, 32, 16);

const particlesCnt = 4000;
const posArray = new Float32Array(particlesCnt * 3);

for(let i = 0; i < particlesCnt * 3; i++){
    posArray[i] = (Math.random() - 0.5)*(Math.random() * 5)
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

//materials to map
const solMat = new THREE.TextureLoader().load('https://vignette.wikia.nocookie.net/planet-texture-maps/images/1/11/Sun-0.jpg/revision/latest/scale-to-width-down/555?cb=20180114104709');
const venusMat = new THREE.TextureLoader().load('https://vignette.wikia.nocookie.net/planet-texture-maps/images/8/80/Venusclouds.jpg/revision/latest/scale-to-width-down/466?cb=20180114085726');
const mercurioMat = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/6e527eb9-99dc-4554-9ea2-dd0e84e79860/dcklc0u-feeae0dc-f164-436a-8e75-5c9a7f3e3c71.png/v1/fill/w_1264,h_632,q_70,strp/mercury_texture_map_used_by_solar_walk_2_by_bob3studios_dcklc0u-pre.jpg')
const tierraMat = new THREE.TextureLoader().load('https://static.turbosquid.com/Preview/2014/08/01__12_04_02/words10k.jpg4BFEB116-5502-4949-ABF4D77CB50C417B.jpgOriginal.jpg');
const saturnoMat = new THREE.TextureLoader().load('https://tse4.mm.bing.net/th?id=OIP.GFEc1rnPZX09j_rlhSaszQHaDt&pid=Api');
const anilloSatMat = new THREE.TextureLoader().load('https://tse4.mm.bing.net/th?id=OIP.GFEc1rnPZX09j_rlhSaszQHaDt&pid=Api');
const jupiterMat = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/efbcbef1-b203-4367-9335-2720d26f49ec/dbtfk1b-f4544735-d0b1-45ee-bc8b-2a6344ce3c0f.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvZWZiY2JlZjEtYjIwMy00MzY3LTkzMzUtMjcyMGQyNmY0OWVjXC9kYnRmazFiLWY0NTQ0NzM1LWQwYjEtNDVlZS1iYzhiLTJhNjM0NGNlM2MwZi5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.cdM0hNCF4ZqT9U2gCKjHI-jHusnYaz6OAaTo5pnnuVU');
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05
})
// Mesh
const sol = new THREE.Mesh(new THREE.SphereGeometry(15,32,16),new THREE.MeshBasicMaterial({map: solMat}))
const mercurio = new THREE.Mesh(new THREE.SphereGeometry(1.5,32,16), new THREE.MeshBasicMaterial({map: mercurioMat}))
const venus = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 16), new THREE.MeshBasicMaterial({map: venusMat}))
const tierra = new THREE.Mesh( tierraGeo,new THREE.MeshBasicMaterial({map: tierraMat}))
const saturno = new THREE.Mesh(saturnoGeo, new THREE.MeshBasicMaterial({map: saturnoMat}))
const anilloSat = new THREE.Mesh(anilloSatGeo, new THREE.MeshBasicMaterial({map: anilloSatMat, transparent: true, opacity: 0.7}))
const jupiter = new THREE.Mesh(jupiterGeo, new THREE.MeshBasicMaterial({map: jupiterMat}))
const galaxy = new THREE.Points(galaxyGeo, particlesMaterial)
mercurio.position.x = -20
mercurio.position.z = 4
venus.position.x = 27
venus.position.z = 20
tierra.position.x = 40
tierra.position.z = 40
saturno.position.z = 150
anilloSat.position.z = 150
jupiter.position.x = -90

//add mesh to scene
//scene.add(skybox)
scene.add(sol)
scene.add(mercurio)
scene.add(venus)
scene.add(tierra)
scene.add(saturno)
scene.add(anilloSat)
scene.add(jupiter)
scene.add(galaxy)

//gui controls
gui.add(sol.scale, 'z', 0, 2).name('Scale Z Axis');
gui.add(sol.material, 'wireframe');

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
pointLight.position.y = 100
pointLight.position.z = 0
scene.add(pointLight)

var pointLightHelper = new THREE.PointLightHelper(pointLight, 20); 
scene.add( pointLightHelper);

//bloom pass
const renderScene = new RenderPass(scene,camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 2;
bloomPass.radius = 0;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const color = new THREE.Color('#FDB813');
const geometry = new THREE.IcosahedronGeometry(1, 15);
const material = new THREE.MeshBasicMaterial({color: color});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0,0,0);
//sphere.layers.set(1);
//scene.add(sphere);

const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientlight);

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

    bloomComposer.setSize(window.innerWidth, window.innerHeight);
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Animate
 */

const clock = new THREE.Clock()

function animate ()
{

    //camera.layers.set(1);
    bloomComposer.render();

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sol.rotation.y = .2*elapsedTime
    mercurio.rotation.y = 2*elapsedTime
    venus.rotation.y = 2*elapsedTime
    tierra.rotation.y = 2*elapsedTime
    saturno.rotation.y = 2*elapsedTime
    anilloSat.rotation.z = 2*elapsedTime
    anilloSat.rotation.x = 0.5*elapsedTime
    jupiter.rotation.y = 2*elapsedTime

    matrix.makeRotationY(.01);
    matrix2.makeRotationY(.1);
    matrix3.makeRotationY(.1)
    matrix4.makeRotationY(.1)
    matrix5.makeRotationY(.1)
    matrix6.makeRotationY(.1)
    mercurio.position.applyMatrix4(matrix2);
    venus.position.applyMatrix4(matrix);
    tierra.position.applyMatrix4(matrix);
    saturno.position.applyMatrix4(matrix);
    anilloSat.position.applyMatrix4(matrix);
    jupiter.position.applyMatrix4(matrix);
    tierraGlow.position.applyMatrix4(matrix);

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