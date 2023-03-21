uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main(){  
  vTexCoord = aTexCoord;

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.y = 1.0 - positionVec4.y;

  vec4 viewModelPosition = uModelViewMatrix * positionVec4;
  gl_Position = uProjectionMatrix * viewModelPosition;
}
