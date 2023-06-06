precision highp float;
varying vec2 vTexCoord;

uniform sampler2D u_prevState;
uniform vec3  u_ptA;
uniform vec3  u_ptB;
uniform float u_colorIndex;
uniform vec2  u_res;


vec2 pointOnLineWithX(float x, vec2 a, vec2 b) {
   float m = (b.y - a.y) / (b.x - a.x);
   float y = m * (x - a.x) + a.y;
   return vec2(x, y);
}

void main() {
  vec2 pix = vTexCoord;
  pix.y = 1.0 - pix.y;
  vec2 a = u_ptA.xy / u_res;
  vec2 b = u_ptB.xy / u_res;

  // 0. save previuos state info
  vec4 prev = texture2D(u_prevState,pix);
  float top    = min(prev.r, pix.y),
        bottom = min(prev.g, 1.-pix.y),
        index  = prev.b;
  prev = vec4(top,bottom,index,1.);

  // 1. Check if two points have equal Z index
  if(u_ptA.z != u_ptB.z) {
    gl_FragColor = prev;
    return;
  }

  if(a.x<0. || a.y<0. || b.x<0. || b.y<0.) {
    gl_FragColor = prev;
    return;
  }

  // 2. Check if the pixel is in the right column
  if((pix.x > a.x && pix.x > b.x) ||  (pix.x < a.x && pix.x < b.x)) {
    gl_FragColor = prev;
    return;
  }

  // 4. find intersection
  vec2 intersection = pointOnLineWithX(pix.x, a, b);

  // 5. is it lower or higher than pixel?
  if (intersection.y <= pix.y) { 
    // if higher — compare to top record
    if(pix.y-intersection.y < top){
      top = pix.y-intersection.y;
      index = u_colorIndex;
    }
  } else {
    // if lower — compare to bottom record
    if(intersection.y-pix.y < bottom){
      bottom = intersection.y-pix.y;
    }
  }

  gl_FragColor = vec4(top, bottom, index, 1.);
}
