import { WebGLRenderer, Scene } from 'three'

export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Scene
export const scene = new Scene()

// Create a second scene that will be rendered to the off-screen buffer
export const bufferScene = new Scene();

const canvas: HTMLElement = document.querySelector('#webgl') as HTMLElement

// Renderer
export const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
})

const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // To avoid performance problems on devices with higher pixel ratio
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  updateRenderer()
})

updateRenderer()

export default { renderer }
