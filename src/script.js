import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import beamVertexShader from './shaders/beam/vertex.glsl'
import beamFragmentShader from './shaders/beam/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340, name: "Parameters" })
const debugObject = {}

debugObject.depthColor = "#ff0000"
debugObject.surfaceColor = "#00004c"
debugObject.backgroundColor = "#000000"
debugObject.wireframe = false
debugObject.size = 30
debugObject.vertices = 1064
debugObject.cameraPos = {x: 12, y: 1.8, z: 6}
debugObject.cameraRot = {x: 0, y: 0, z: 0}
debugObject.view = {x: 0, y: 0, z: 0}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
// scene.fog = new THREE.Fog('#262837', 1, 15)

/**
 * Generate Waves
 */

// Geometry
const waterGeometry = new THREE.PlaneGeometry(debugObject.size, debugObject.size, debugObject.vertices, debugObject.vertices)

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: beamVertexShader,
    fragmentShader: beamFragmentShader,
    wireframe: debugObject.wireframe,
    uniforms: 
    {
        uTime: {value: 0},
        uBigWavesElevation: { value: 0.7},
        uBigWavesFrequency: { value: new THREE.Vector2(5, 1)},
        uBigWavesSpeed: { value: 0.3},
        uBigWavesNoise: {value: 0.0},

        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: { value: 2.00 },
        uColorMultiplier: { value: 1 },
    }
})

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

// Debug

const Waves  = gui.addFolder('Waves');
const Colors  = gui.addFolder('Colors');
const Canvas  = gui.addFolder('Canvas');
const Camera  = gui.addFolder('Camera');

Waves.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('Wave Elevation')
Waves.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('Wave Width')
Waves.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('Wave Length')
Waves.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('Wave Speed')
Waves.add(waterMaterial.uniforms.uBigWavesNoise, 'value').min(0).max(4).step(0.001).name('Wave Noise')

Colors.addColor(debugObject, 'depthColor').onChange(() => {waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)}).name('Surface Color')
Colors.addColor(debugObject, 'surfaceColor').onChange(() => {waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)}).name('Depth Color')
Colors.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(10).step(0.001).name('Color Offset')

Canvas.addColor(debugObject, 'backgroundColor').onChange((value) => {renderer.setClearColor(value)}).name('Background Color')
Canvas.add(debugObject, 'wireframe').onChange(() => {waterMaterial.setValues({wireframe: !debugObject.wireframe})}).name('Wireframe')

Camera.add(debugObject.cameraPos, 'x').onChange((value) => {camera.position.set(value, debugObject.cameraPos.y, debugObject.cameraPos.z)}).name('X Position').min(-20).max(20).step(0.1)
Camera.add(debugObject.cameraPos, 'y').onChange((value) => {camera.position.set(debugObject.cameraPos.x, value, debugObject.cameraPos.z)}).name('Y Position').min(-20).max(20).step(0.1)
Camera.add(debugObject.cameraPos, 'z').onChange((value) => {camera.position.set(debugObject.cameraPos.x, debugObject.cameraPos.y, value)}).name('Z Position').min(-20).max(20).step(0.1)

Camera.add(debugObject.cameraRot, 'x').onChange((value) => {camera.rotation.set(value * Math.PI, debugObject.cameraRot.y, debugObject.cameraRot.z)}).name('X Rotation').min(-2).max(2).step(0.001)
Camera.add(debugObject.cameraRot, 'y').onChange((value) => {camera.rotation.set(debugObject.cameraRot.x, value * Math.PI, debugObject.cameraRot.z)}).name('Y Rotation').min(-2).max(2).step(0.001)
Camera.add(debugObject.cameraRot, 'z').onChange((value) => {camera.rotation.set(debugObject.cameraRot.x, debugObject.cameraRot.y, value * Math.PI,)}).name('Z Rotation').min(-2).max(2).step(0.001)


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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(12, 1.8, 6)
camera.lookAt(new THREE.Vector3(0, -9, 0))
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(debugObject.background, 1)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    waterMaterial.uniforms.uTime.value = elapsedTime
    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()