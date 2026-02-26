uniform float uTime;
uniform float uDelta;
uniform float uSpeed;
uniform vec2 uResolution;

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution.xy;

	gl_FragColor = vec4(uv, 0.5 + 0.5 * sin(uTime * uSpeed), 1.0);
}
