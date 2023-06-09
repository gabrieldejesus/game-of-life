precision mediump float;
// my input texture
uniform sampler2D uTexture; 
uniform vec2 uResolution;

varying vec2 vUvs;

float GetNeighbours(vec2 p) {
  float count = 0.0;

  for(float y = -1.0; y <= 1.0; y++) {
    for(float x = -1.0; x <= 1.0; x++) {
      if(x == 0.0 && y == 0.0)
          continue;

      // Scale the offset down
      vec2 offset = vec2(x, y) / uResolution.xy;	
      // Apply offset and sample texture	 
      vec4 lookup = texture2D(uTexture, p + offset); 
        // Accumulate the result
      count += lookup.r > 0.5 ? 1.0 : 0.0;
    }
  }

  return count;
}

void main() {
  /* Using a tempoary variable for the output value for clarity.
  it is just passed to fragColor at the end of the function. */
  vec3 color = vec3(0.0);

  /*
    Time to count the population of the neighborhood!
    We count all the live cells in a 3 wide, 3 tall area
    centered on this cell.
      _ _ _
    |_|_|_|     [-1, -1], [0, -1], [1, -1],
    |_|_|_|  =  [-1,  0], [0,  0], [1,  0],
    |_|_|_|     [-1,  1], [0,  1], [1,  1],

    Since each cell only should hold a value of either 0 (dead) or 1 (alive),
    the count yields an integer value, but since the
    texture sampling returns a float, we will use that instead.
  */ 
float neighbors = 0.0;
  neighbors += GetNeighbours(vUvs);

  bool alive = texture2D(uTexture, vUvs).x > 0.5;

  if(alive && (neighbors == 2.0 || neighbors == 3.0)) { // cell is alive
    // Any live cell with two or three live neighbours lives on to the next generation.
    color = vec3(1.0, 0.0, 1.0);
    // 0.,0.49,0.906
  // cell is dead
  } else if(!alive && (neighbors == 3.0)) { 
  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    color = vec3(1.0, 0.0, 1.0);
  }
  // vec3(0.,0.49,0.906)

  gl_FragColor = vec4(color, 1.0);
}