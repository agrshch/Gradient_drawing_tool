precision highp float;
varying vec2 vTexCoord;

#define MAX 1000

uniform vec3 u_pts [MAX];
uniform int u_pts_n;
uniform vec2 u_resolution;
uniform vec3 u_colors[6];

vec2 pointOnLineWithX(float x, vec2 a, vec2 b) {
   float m = (b.y - a.y) / (b.x - a.x);
   float y = m * (x - a.x) + a.y;
   return vec2(x, y);
}

vec3 getColorByIndex(float val){
  int index = int(mod(val,6.));
  for(int i = 0; i < 6; i++){
    if(i == index) return u_colors[i];
  }
  return(vec3(0.0));
}

void main() {
  vec2 pix = vTexCoord;
  pix.y = 1.0 - pix.y;

  // 01. see if line segment shares x coord with pixel at some point
  // 02. if yes — find the closest intersection
  // 03. find is the interesection higher or lower
  // 04. check the distance from pixel to intersection, save the record values/point
  vec2  topClosest = vec2 (pix.x, 0.0), 
        bottomClosest = vec2 (pix.x, 1.0);
  float topRecord = pix.y, 
        bottomRecord = 1.0 - pix.y;
  float colorIndex = 0.0;
  for (int i = 1; i < MAX; i++){
    if(i>=u_pts_n) break;
    if (u_pts[i-1].z != u_pts[i].z) continue;
    // define the line segment
    vec2 a = u_pts[i-1].xy / u_resolution;
    vec2 b = u_pts[i].xy / u_resolution;
    // if no intersections - skip
    if(!(a.x < pix.x && b.x > pix.x) && !(a.x > pix.x && b.x < pix.x)) continue; 
    // find the intersection point
    vec2 intersection = pointOnLineWithX(pix.x, a, b);
    // is it higher or lower?
    if (intersection.y <= pix.y) { // higher
      // colorIndex +=2.; // color is changing depending on number of intersections
      //if it hits the record
      if(pix.y - intersection.y < topRecord) {
        topRecord = pix.y - intersection.y;
        topClosest = intersection;
        colorIndex = u_pts[i].z; // color is changing from line to line
      }
    } else { // lower
      //if it hits the record
      if(intersection.y - pix.y < bottomRecord) {
        bottomRecord = intersection.y - pix.y;
        bottomClosest = intersection;
      }
    }
  }
  
  // 06. save the distances in dist1 and dist2
  float distTop = pix.y - topClosest.y;
  float distBottom = bottomClosest.y - pix.y;
  
  // 07. find t = dist1 / (dist1+dist2)
  float t = distTop / (distTop+distBottom);

  // 08. interpolate between two colors using t
  vec3 c1 = getColorByIndex(colorIndex) / 255.;
  vec3 c2 = getColorByIndex(colorIndex+1.0) / 255.;
  vec3 gradient = mix(c1, c2, t);

  gl_FragColor = vec4(gradient, 1.0 );
}
