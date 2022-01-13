uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
// uniform float uColorMultiplier;

// varying float vElevation;

// void main() 
// {
//     float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
//     vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);    
//     gl_FragColor = vec4(color, 1.0);
// }
// precision highp float;

varying vec3 vViewPosition;
varying float vElevation;

void main()
{
  float theta = vElevation * uColorOffset;

  vec3 normal = normalize(cross(dFdx(vViewPosition),dFdy(vViewPosition)));
  
  vec3 dir1 = vec3(cos(theta),0,sin(theta)); 
  vec3 dir2 = vec3(sin(theta),0,cos(theta));
  
  float diffuse1 = pow(dot(normal,dir1),2.0);
  float diffuse2 = pow(dot(normal,dir2),2.0);
  
  vec3 col1 = diffuse1 * vec3(uDepthColor);
  vec3 col2 = diffuse2 * vec3(uSurfaceColor);
  
  gl_FragColor = vec4(col1 + col2, 1.0);
}