import * as THREE from 'three'
import { renderer, scene, bufferScene, sizes } from './core/renderer'
import camera from './core/camera'

import './style.css'

// Shaders
import vertexShader from '/@/shaders/vertex.glsl'
import fragmentShaderScreen from '/@/shaders/fragmentShaderScreen.glsl'
import fragmentShaderBuffer from '/@/shaders/fragmentShaderBuffer.glsl'

// create random noisy texture
const createDataTexture = () => {
  // create a buffer with color data
  let size = sizes.width * sizes.height;
  let data = new Uint8Array(4 * size);

  for (let i = 0; i < size; i++) {
    let stride = i * 4;

    if (Math.random() < 0.5) {
      data[stride] = 255;
      data[stride + 1] = 255;
      data[stride + 2] = 255;
      data[stride + 3] = 255;
    } else {
      data[stride] = 0;
      data[stride + 1] = 0;
      data[stride + 2] = 0;
      data[stride + 3] = 255;
    }
  }

  // used the buffer to create a DataTexture
  let texture = new THREE.DataTexture(
    data,
    sizes.width,
    sizes.height,
    THREE.RGBAFormat
  );

  // just a weird thing that Three.js wants you to do after you set the data for the texture
  texture.needsUpdate = true;
  return texture;
}

// The generated noise texture
const dataTexture = createDataTexture();

// Geometry
const geometry = new THREE.PlaneGeometry(2, 2);

// Screen resolution
const resolution = new THREE.Vector3(sizes.width, sizes.height, window.devicePixelRatio);

// Screen Material
const quadMaterial = new THREE.ShaderMaterial({
	uniforms: {
        //Now the screen material won't get a texture initially
        //The idea is that this texture will be rendered off-screen
		uTexture: { value: null },
		uResolution: {
			value: resolution
		}
	},
	vertexShader,
	fragmentShader: fragmentShaderScreen
});

// Create a new framebuffer we will use to render to
// the GPU memory
let renderBufferA = new THREE.WebGLRenderTarget(
  sizes.width,
  sizes.height,
  {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    stencilBuffer: false
  }
)

let renderBufferB = new THREE.WebGLRenderTarget(
  sizes.width,
  sizes.height,
  {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    stencilBuffer: false
  }
)

// off-screen Framebuffer will receive a new ShaderMaterial
// Buffer Material
const bufferMaterial = new THREE.ShaderMaterial({
	uniforms: {
		uTexture: { value: dataTexture },
		uResolution: {
			value: resolution
		}
	},
	vertexShader,
	fragmentShader: fragmentShaderBuffer,
});

// Meshes
const mesh = new THREE.Mesh(geometry, quadMaterial);
scene.add(mesh);

const bufferMesh = new THREE.Mesh(geometry, bufferMaterial);
bufferScene.add(bufferMesh)

const loop = () => {
  // Explicitly set renderBufferA as the framebuffer to render to
  //the output of this rendering pass will be stored in the texture associated with renderBufferA
  renderer.setRenderTarget(renderBufferA)
  // This will contain the ping-pong accumulated texture
  renderer.render(bufferScene, camera)

  mesh.material.uniforms.uTexture.value = renderBufferA.texture;
  //This will set the default framebuffer (i.e. the screen) back to being the output
  renderer.setRenderTarget(null)
  //Render to screen
  renderer.render(scene, camera);

  // Ping-pong the framebuffers by swapping them
  // at the end of each frame render
  // Now prepare for the next cycle by swapping renderBufferA and renderBufferB
  // so that the previous frame's *output* becomes the next frame's *input*
  const temp = renderBufferA
  renderBufferA = renderBufferB
  renderBufferB = temp
  bufferMaterial.uniforms.uTexture.value = renderBufferB.texture;

  // update uniforms
  quadMaterial.uniforms.uResolution.value.x = sizes.width
  quadMaterial.uniforms.uResolution.value.y = sizes.height

  // Call tick again on the next frame
  requestAnimationFrame(loop)
}

loop()
