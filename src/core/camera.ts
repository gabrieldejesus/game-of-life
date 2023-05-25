import { OrthographicCamera } from 'three'
import { scene, sizes } from './renderer'

export const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.updateProjectionMatrix()
})

scene.add(camera)

export default camera
