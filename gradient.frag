precision highp float;
varying vec2 vTexCoord;

#define MAX 99
#define GRAIN_STEPS 10.0

uniform sampler2D u_data;
uniform vec4 u_colors[MAX];
uniform bool u_grain;

vec4 getColorByIndex(int index){
  for(int i = 0; i < MAX; i++){
    if(i == index) return u_colors[i];
  }
  return(vec4(0.0));
}

float hash12(vec2 p){
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 pix = vTexCoord;
  pix.y = 1.0 - pix.y;

  // 1. load the data
  vec4 data = texture2D(u_data,pix);
  float top = data.r,
        bottom = data.g;

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
      if(u_grain){
        float sum = 0.0;
        for(float i = 0.0; i < GRAIN_STEPS; i++){
          float H = hash12(gl_FragCoord.xy + i*1000.);
          H = (H<t)?1.0:0.0;
          sum += H;
        }
        t = sum / GRAIN_STEPS;
      }
      outColor = mix(cTop.rgb/255., cMid.rgb/255., t);
    } else {
      // between middle and bottom
      t = (t-n)/(1.-n);
      if(u_grain){
        float sum = 0.0;
        for(float i = 0.0; i < GRAIN_STEPS; i++){
          float H = hash12(gl_FragCoord.xy + i*1000.);
          H = (t>H)?1.0:0.0;
          sum += H;
        }
        t = sum / GRAIN_STEPS;
      }
      outColor = mix(cMid.rgb/255., cBot.rgb/255., t);
    }
  }

  gl_FragColor = vec4(outColor, 1.0 );
}
