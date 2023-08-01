precision highp float;
varying vec2 vTexCoord;

#define MAX 99

uniform sampler2D u_data;
uniform vec4 u_colors[MAX];

vec4 getColorByIndex(int index){
  for(int i = 0; i < MAX; i++){
    if(i == index) return u_colors[i];
  }
  return(vec4(0.0));
}

void main() {
  vec2 pix = vTexCoord;
  pix.y = 1.0 - pix.y;

  // 1. load the data
  vec4 data = texture2D(u_data,pix);
  float top = data.r,
        bottom = data.g;
  // int index = int(data.b);
  // vec4 cTop = getColorByIndex(index*3);
  // vec4 cBot = getColorByIndex(index*3+1);
  // vec4 cMid = getColorByIndex(index*3+2);

  vec4 cTop = u_colors[0];
  vec4 cBot = u_colors[1];
  vec4 cMid = u_colors[2];

  vec3 outColor;
  float t = top / (top+bottom);

  // 2. see is there any third color
  if(cMid.a < 0.){
    // if no 3rd color:    
    outColor = mix(cTop.rgb/255., cBot.rgb/255., t);
  } else {
    // if 3rd color exists:
    // a. save 3rd color position
    float n = cMid.a;
    // b. check between which colorstops situated the pixel
    if(t <= n){ 
      // between top and middle
      t = t/n;
      outColor = mix(cTop.rgb/255., cMid.rgb/255., t);
    } else {
      // between middle and bottom
      t = (t-n)/(1.-n);
      outColor = mix(cMid.rgb/255., cBot.rgb/255., t);
    }
  }


  gl_FragColor = vec4(outColor, 1.0 );
}
