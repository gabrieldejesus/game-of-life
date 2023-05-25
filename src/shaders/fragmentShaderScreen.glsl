precision mediump float;
// my input texture
uniform sampler2D uTexture; 
varying vec2 vUvs;

void main() {
  // special method to sample from texture
  vec4 initTexture = texture2D(uTexture, vUvs);
  vec3 colour = initTexture.rgb;
  gl_FragColor = vec4(colour, 1.0);
}