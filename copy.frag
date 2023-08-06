precision highp float;
varying vec2 vTexCoord;

uniform sampler2D u_source;

void main() {
  vec2 pix = vTexCoord;
  pix.y = 1.0 - pix.y;
  gl_FragColor = texture2D(u_source,pix);
}
