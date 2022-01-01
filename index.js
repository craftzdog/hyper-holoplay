const THREE = global.THREE = require('three')
const HoloPlay = require('holoplay')

function createCanvasSurface(scene, canvas, zoff = 0) {
  // adding three cubes to the scene in different locations
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  })
  const geometry = new THREE.PlaneBufferGeometry(0.15, 0.2)
  const c = 100
  for (let i = 0; i < c; ++i) {
    const m = material.clone()
    if (i === 0) m.opacity = 1
    else m.opacity = ((c - i) / c) * 0.05
    const plane = new THREE.Mesh(geometry, m)
    plane.position.x = 0
    plane.position.y = 0
    plane.position.z = 0.001 * -i + zoff
    scene.add(plane)
  }

  return {
    texture,
    material,
    geometry
  }
}

function run() {

  // just a basic three.js scene, nothing special
  const scene = new THREE.Scene()
  //scene.add(new THREE.GridHelper(10, 10))

  // adding some lights to the scene
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(0, 1, 2)
  scene.add(directionalLight)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const term = createCanvasSurface(scene, document.querySelector('.xterm-text-layer'))
  const cursor = createCanvasSurface(scene, document.querySelector('.xterm-cursor-layer'), 0.01)

  // the holoplay camera should be used like a THREE.PerspectiveCamera
  const camera = new HoloPlay.Camera()

  // the holoplay renderer should act as your THREE.WebGLRenderer
  const renderer = new HoloPlay.Renderer({
    disableFullscreenUi: true
  })

  // add the renderer's canvas to your web page (it will size to fill the page)
  document.body.appendChild(renderer.domElement)

  // the update function gets called every frame, thanks to requestAnimationFrame()
  function update(time) {
    requestAnimationFrame(update)

    term.texture.needsUpdate = true
    cursor.texture.needsUpdate = true
    //plane.rotation.y += 0.01
    // render() draws the scene, just like THREE.WebGLRenderer.render()
    renderer.render(scene, camera)
    document.querySelector('.xterm-helper-textarea').focus()
  }
  requestAnimationFrame(update)

  document.querySelector('.xterm-helper-textarea').focus()
}

exports.onRendererWindow = () => {
  console.log('loaded', { THREE, HoloPlay })
  setTimeout(run, 1000)
}

