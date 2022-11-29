import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
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

//earth atmosphere shader
const tierraglowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        "c":   { type: "f", value: .05 },
        "p":   { type: "f", value: .005 },
        glowColor: { type: "c", value: new THREE.Color(0x85a4ff) },
        viewVector: { type: "v3", value: camera.position }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
});

const tierraGlow = new THREE.Mesh( new THREE.SphereGeometry(.6371, 32, 16), tierraglowMaterial);
tierraGlow.scale.multiplyScalar(1.2);
tierraGlow.position.x = 150;
scene.add(tierraGlow);

const moonGlow = new THREE.Mesh( new THREE.SphereGeometry(15,32,16), solglowMaterial);
moonGlow.scale.multiplyScalar(1.2);
//scene.add( moonGlow );

//geometry
const solGeo = new THREE.SphereGeometry(6.96,32,16);
const mercurioGeo = new THREE.SphereGeometry(.244,32,16);
const venusGeo = new THREE.SphereGeometry( .6052, 32, 16);
const tierraGeo = new THREE.SphereGeometry(.6371,32,16);
const jupiterGeo = new THREE.SphereGeometry(6.9911, 32, 16);
const saturnoGeo = new THREE.SphereGeometry(.58232,32,16);
const anilloSatGeo = new THREE.TorusGeometry(.95, .15, 2, 16);
const galaxyGeo = new THREE.TorusGeometry(7.847, 8.1774, 3, 16, 6.28318);
const particlesGeometry = new THREE.BufferGeometry;

const particlesCnt = 4000;
const posArray = new Float32Array(particlesCnt * 3);

for(let i = 0; i < particlesCnt * 3; i++){
    posArray[i] = (Math.random() - 0.5)*(Math.random() * 5)
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

//sun shader


const solMat = new THREE.TextureLoader().load('https://vignette.wikia.nocookie.net/planet-texture-maps/images/1/11/Sun-0.jpg/revision/latest/scale-to-width-down/555?cb=20180114104709');


//materials to map
const venusMat = new THREE.TextureLoader().load('https://vignette.wikia.nocookie.net/planet-texture-maps/images/8/80/Venusclouds.jpg/revision/latest/scale-to-width-down/466?cb=20180114085726');
const mercurioMat = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/6e527eb9-99dc-4554-9ea2-dd0e84e79860/dcklc0u-feeae0dc-f164-436a-8e75-5c9a7f3e3c71.png/v1/fill/w_1264,h_632,q_70,strp/mercury_texture_map_used_by_solar_walk_2_by_bob3studios_dcklc0u-pre.jpg')
const tierraMat = new THREE.TextureLoader().load('https://static.turbosquid.com/Preview/2014/08/01__12_04_02/words10k.jpg4BFEB116-5502-4949-ABF4D77CB50C417B.jpgOriginal.jpg');
const saturnoMat = new THREE.TextureLoader().load('https://tse4.mm.bing.net/th?id=OIP.GFEc1rnPZX09j_rlhSaszQHaDt&pid=Api');
const anilloSatMat = new THREE.TextureLoader().load('https://tse4.mm.bing.net/th?id=OIP.GFEc1rnPZX09j_rlhSaszQHaDt&pid=Api');
const jupiterMat = new THREE.TextureLoader().load('https://thumbs.dreamstime.com/b/texture-surface-jupiter-elements-image-furnished-nasa-152406745.jpg');
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05
})
// Mesh
const sol = new THREE.Mesh( solGeo, new THREE.MeshBasicMaterial({map: solMat}))
const mercurio = new THREE.Mesh( mercurioGeo, new THREE.MeshBasicMaterial({map: mercurioMat}))
const venus = new THREE.Mesh(venusGeo, new THREE.MeshBasicMaterial({map: venusMat}))
const tierra = new THREE.Mesh( tierraGeo,new THREE.MeshBasicMaterial({map: tierraMat}))
const saturno = new THREE.Mesh(saturnoGeo, new THREE.MeshBasicMaterial({map: saturnoMat}))
const anilloSat = new THREE.Mesh(anilloSatGeo, new THREE.MeshBasicMaterial({map: anilloSatMat, transparent: true, opacity: 0.7}))
const jupiter = new THREE.Mesh(jupiterGeo, new THREE.MeshBasicMaterial({map: jupiterMat}))
const galaxy = new THREE.Points(galaxyGeo, particlesMaterial)
mercurio.position.x = 57
venus.position.x = 108
tierra.position.x = 150
saturno.position.x = 1430
anilloSat.position.x = 1430
anilloSat.rotation.x = 90* Math.PI / 180
anilloSat.rotation.y = 15* Math.PI / 180
jupiter.position.x = 779

//add mesh to scene
scene.add(sol)
scene.add(mercurio)
scene.add(venus)
scene.add(tierra)
scene.add(saturno)
scene.add(anilloSat)
scene.add(jupiter)
scene.add(galaxy)

//gui vars
const planetBools = {
    mercury: false,
    venus: false,
    earth: false,
    jupiter: false,
    saturn: false,
    reset: false
}

function setChecked( prop ){
    for (let param in planetBools){
        planetBools[param] = false;
    }
    planetBools[prop] = true;
}

//gui controls
gui.add(planetBools, 'mercury').name('Mercury').listen().onChange(function(){setChecked("mercury")});
gui.add(planetBools, 'venus').name('Venus').listen().onChange(function(){setChecked("venus")});
gui.add(planetBools, 'earth').name('Earth').listen().onChange(function(){setChecked("earth")});
gui.add(planetBools, 'jupiter').name('Jupiter').listen().onChange(function(){setChecked("jupiter")});
gui.add(planetBools, 'saturn').name('Saturn').listen().onChange(function(){setChecked("saturn")});
gui.add(planetBools, 'reset').name('Free Cam').listen().onChange(function(){setChecked("reset")});;


//add starfield to scene
function addStar() {
  const stargeometry = new THREE.SphereGeometry(0.5, 24, 24);
  const starmaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const star = new THREE.Mesh(stargeometry, starmaterial);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(3000));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(6000).fill().forEach(addStar);

// Lights
var pointLight = new THREE.PointLight(0xFF0000, .5,10, 2)

pointLight.position.x = 0
pointLight.position.y = 100
pointLight.position.z = 0
scene.add(pointLight)

var pointLightHelper = new THREE.PointLightHelper(pointLight, 20); 
//scene.add( pointLightHelper);

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
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Animate
 */

export function updateCamera(){
    {alert('hello!')}
}

const clock = new THREE.Clock()

function animate ()
{

    //camera.layers.set(1);

    const elapsedTime = clock.getElapsedTime()

    //update camera
    if (planetBools.mercury == true){

        let offset = new THREE.Vector3(mercurio.position.x , mercurio.position.y, mercurio.position.z);

        camera.position.lerp(offset, .2);

        camera.lookAt(mercurio.position);
    }

    if (planetBools.venus == true){

        let offset = new THREE.Vector3(venus.position.x , venus.position.y, venus.position.z);

        camera.position.lerp(offset, .2);

        camera.lookAt(venus.position);
    }

    if (planetBools.earth == true){

        let offset = new THREE.Vector3(tierra.position.x , tierra.position.y, tierra.position.z);

        camera.position.lerp(offset, .2);

        camera.lookAt(tierra.position);
    }

    if (planetBools.jupiter == true){

        let offset = new THREE.Vector3(jupiter.position.x , jupiter.position.y, jupiter.position.z);

        camera.position.lerp(offset, .05);

        camera.lookAt(jupiter.position);
    }

    if (planetBools.saturn == true){

        let offset = new THREE.Vector3(saturno.position.x , saturno.position.y, saturno.position.z);

        camera.position.lerp(offset, .98);

        camera.lookAt(saturno.position);
    }

    // Update objects
    sol.rotation.y = .02*elapsedTime
    mercurio.rotation.y = .1083*elapsedTime
    venus.rotation.y = .0652*elapsedTime
    tierra.rotation.y = .01574*elapsedTime
    saturno.rotation.y = .36840*elapsedTime
    anilloSat.rotation.z = .4*elapsedTime
    jupiter.rotation.y = .45583*elapsedTime

    matrix.makeRotationY(.004787);
    matrix2.makeRotationY(.003502);
    matrix3.makeRotationY(.002978)
    matrix4.makeRotationY(.0024077)
    matrix5.makeRotationY(.001307)
    matrix6.makeRotationY(.000969)
    mercurio.position.applyMatrix4(matrix);
    venus.position.applyMatrix4(matrix2);
    tierra.position.applyMatrix4(matrix3);
    saturno.position.applyMatrix4(matrix4);
    anilloSat.position.applyMatrix4(matrix4);
    jupiter.position.applyMatrix4(matrix5);
    tierraGlow.position.applyMatrix4(matrix3);

    // Update Orbital Controls

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)
}

animate()