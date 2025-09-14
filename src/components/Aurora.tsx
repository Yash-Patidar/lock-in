import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

import './Aurora.css';

const vertexShader = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  float time = uTime * 0.5;
  
  float noise1 = snoise(vec3(uv * 2.0, time * 0.1)) * uAmplitude;
  float noise2 = snoise(vec3(uv * 4.0, time * 0.2)) * uAmplitude * 0.5;
  float noise3 = snoise(vec3(uv * 8.0, time * 0.3)) * uAmplitude * 0.25;
  
  float totalNoise = noise1 + noise2 + noise3;
  
  vec3 color1 = uColorStops[0];
  vec3 color2 = uColorStops[1];
  vec3 color3 = uColorStops[2];
  
  vec3 finalColor = mix(color1, color2, smoothstep(-1.0, 0.0, totalNoise));
  finalColor = mix(finalColor, color3, smoothstep(0.0, 1.0, totalNoise));
  
  float alpha = smoothstep(-0.5, 0.5, totalNoise) * 0.8;
  
  fragColor = vec4(finalColor, alpha * uBlend);
}
`;

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
}

export default function Aurora({
  colorStops = ["#06b6d4", "#3b82f6", "#8b5cf6"],
  amplitude = 1.0,
  blend = 1.0
}: AuroraProps) {
  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      antialias: false,
      depth: false,
    });

    const gl = renderer.gl;
    gl.canvas.style.position = "absolute";
    gl.canvas.style.top = "0";
    gl.canvas.style.left = "0";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.pointerEvents = "none";
    gl.canvas.style.backgroundColor = 'transparent';

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uColorStops: { value: colorStops.map(hex => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        }) },
        uAmplitude: { value: amplitude },
        uBlend: { value: blend },
      },
      transparent: true,
    });

    function resize() {
      if (!ctn) return;
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value = [ctn.offsetWidth, ctn.offsetHeight];
    }

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t: number) => {
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uAmplitude.value = amplitude;
      program.uniforms.uBlend.value = blend;
      
      renderer.render({ scene: mesh });
      animateId = requestAnimationFrame(update);
    };

    resize();
    window.addEventListener("resize", resize);
    animateId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animateId);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, blend, colorStops]);

  return <div ref={ctnDom} className="aurora-container" />;
}