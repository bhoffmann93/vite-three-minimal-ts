uniform float uTime;
uniform float uDelta;
uniform float uSpeed;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
	vec3 light = normalize(vec3(1.0, 1.0, 1.0));
	float diffuse = max(dot(vNormal, light), 0.0);

	vec3 color = vec3(vUv, 0.5 + 0.5 * sin(uTime * uSpeed));
	color *= 0.5 + 0.5 * diffuse;

	gl_FragColor = vec4(color, 1.0);
}
