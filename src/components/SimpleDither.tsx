
'use client';

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = vec2(fx.x*fx.x*fx.x*(fx.x*(fx.x*6.0-15.0)+10.0), fy.x*fy.x*fy.x*(fy.x*(fy.x*6.0-15.0)+10.0));
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < 4; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p - fbm(p + fbm(p2)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  
  float f = pattern(uv * 2.0);
  
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f += 0.3 * effect;
  }
  
  // Simple dithering effect
  vec2 pixelPos = floor(gl_FragCoord.xy / 4.0);
  float dither = mod(pixelPos.x + pixelPos.y, 2.0);
  f = step(0.5 + dither * 0.1, f);
  
  vec3 col = mix(vec3(0.0), waveColor, f);
  gl_FragColor = vec4(col, f * 0.8);
}
`;

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  enableMouseInteraction,
  mouseRadius,
}: {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  enableMouseInteraction: boolean;
  mouseRadius: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { viewport, size, gl } = useThree();

  const waveUniformsRef = useRef({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius),
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const w = Math.floor(size.width * dpr);
    const h = Math.floor(size.height * dpr);
    const res = waveUniformsRef.current.resolution.value;
    if (res.x !== w || res.y !== h) {
      res.set(w, h);
    }
  }, [size, gl]);

  useFrame(({ clock }) => {
    const u = waveUniformsRef.current;
    u.time.value = clock.getElapsedTime();
    u.waveSpeed.value = waveSpeed;
    u.waveFrequency.value = waveFrequency;
    u.waveAmplitude.value = waveAmplitude;
    u.waveColor.value.set(...waveColor);
    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    u.mouseRadius.value = mouseRadius;
    if (enableMouseInteraction) {
      u.mousePos.value.set(mousePos.x, mousePos.y);
    }
  });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    setMousePos({
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    });
  };

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniformsRef.current}
          transparent
        />
      </mesh>

      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

interface SimpleDitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

export default function SimpleDither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.024, 0.714, 0.831],
  enableMouseInteraction = true,
  mouseRadius = 0.8,
}: SimpleDitherProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6] }}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
        gl={{ antialias: false, alpha: true }}
      >
        <DitheredWaves
          waveSpeed={waveSpeed}
          waveFrequency={waveFrequency}
          waveAmplitude={waveAmplitude}
          waveColor={waveColor}
          enableMouseInteraction={enableMouseInteraction}
          mouseRadius={mouseRadius}
        />
      </Canvas>
    </div>
  );
}