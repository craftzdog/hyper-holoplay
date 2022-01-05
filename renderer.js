const THREE = (global.THREE = require('three'))
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

exports.init = divTerm => {
  // just a basic three.js scene, nothing special
  const scene = new THREE.Scene()

  // adding some lights to the scene
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(0, 1, 2)
  scene.add(directionalLight)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const term = createCanvasSurface(
    scene,
    divTerm.querySelector('.xterm-text-layer')
  )
  const cursor = createCanvasSurface(
    scene,
    divTerm.querySelector('.xterm-cursor-layer'),
    0.01
  )

  // the holoplay camera should be used like a THREE.PerspectiveCamera
  const camera = new HoloPlay.Camera()

  // the holoplay renderer should act as your THREE.WebGLRenderer
  const renderer = new HoloPlay.Renderer({
    disableFullscreenUi: true
  })

  // add the renderer's canvas to your web page (it will size to fill the page)
  document.body.appendChild(renderer.domElement)

  // set focus to the terminal on clicking the threejs canvas
  renderer.domElement.addEventListener('click', () => {
    divTerm.querySelector('.xterm-helper-textarea').focus()
  })

  return { renderer, term, cursor, scene, camera }
}

exports.update = holo => {
  const { renderer, term, cursor, scene, camera } = holo

  term.texture.needsUpdate = true
  cursor.texture.needsUpdate = true
  //plane.rotation.y += 0.01
  renderer.render(scene, camera)
}
