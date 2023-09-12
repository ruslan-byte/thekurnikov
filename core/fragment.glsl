uniform float time;
uniform float progress;
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;

uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

void main() {
    vec2 newUV = (vUv - vec2(1)) * resolution.zw + vec2(1);
    vec4 offset = texture2D(uDataTexture, vUv);
    float smoothedAlpha = smoothstep(progress - 0.1, progress + 0.1, offset.a);
    float edge = smoothstep(0.0, 0.05, smoothedAlpha);
    vec4 atlasColor = texture2D(uTexture, newUV);
    vec4 finalColor = mix(vec4(1.0, 1.0, 1.0, 0.0), atlasColor, edge);
    vec2 distortedUV = newUV - 0.05 * offset.rg;
    vec4 distortedColor = texture2D(uTexture, distortedUV);
    finalColor = mix(finalColor, distortedColor, offset.a);
    gl_FragColor = finalColor;
}
