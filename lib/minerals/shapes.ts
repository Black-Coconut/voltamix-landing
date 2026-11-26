/* The specimens. Each product is a mineral whose habit says something about it:
   quartz (Honenuki)     clear prisms: the noise is out, the material is left
   fluorite (Volta Voice) one octahedral form that shows a different colour under different light: same take, new voice
   pyrite (Agentic DAW)  intergrown cubes on a grid: tracks, faders, parameters
   sulfur (Just Use)     the common yellow mineral that is everywhere and costs nothing
   resonator (home)      a smoky double-terminated crystal with an ember inside, and the four specimens on one orbit

   Every stone uses one custom shader (STONE_VERT / STONE_FRAG): facets blended toward smooth normals so they read soft,
   a cloudy interior that shifts with the view, a lit core, a pale sheen at the rim, glints that catch as the stone turns,
   and film grain. The ring a touch sets off runs on the GPU too: a wave of light and a small swell along the surface. */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type MineralKind = "resonator" | "quartz" | "fluorite" | "pyrite" | "sulfur";

export const MAX_RIPPLES = 5;

export type Built = {
  group: THREE.Group;
  core: THREE.Mesh; // the body that rings when touched
  ripples: THREE.Vector4[]; // xyz in core space, w = age in seconds (< 0: unused); shared by the core's materials
  energy: { value: number };
  ringAmp: number;
  rest: THREE.Vector3;
  radius: number;
  glow: THREE.Color; // halo colour the stage paints behind this stone (sRGB)
  fade: (k: number) => void;
  dispose: () => void;
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const keyOf = (x: number, y: number, z: number) => `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;

/** Nudge every corner a little, the same way wherever that corner is shared, so faces stay closed. */
function jitter(g: THREE.BufferGeometry, amt: number, seed: number) {
  const p = g.attributes.position as THREE.BufferAttribute;
  const r = rng(seed);
  const seen = new Map<string, [number, number, number]>();
  for (let i = 0; i < p.count; i++) {
    const key = keyOf(p.getX(i), p.getY(i), p.getZ(i));
    let o = seen.get(key);
    if (!o) {
      o = [(r() - 0.5) * 2 * amt, (r() - 0.5) * 2 * amt, (r() - 0.5) * 2 * amt];
      seen.set(key, o);
    }
    p.setXYZ(i, p.getX(i) + o[0], p.getY(i) + o[1], p.getZ(i) + o[2]);
  }
  return g;
}

/** Non-indexed, position only. Flat facets come from screen derivatives in the shader. */
function facet(g: THREE.BufferGeometry) {
  const n = g.index ? g.toNonIndexed() : g;
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", n.attributes.position.clone());
  if (n !== g) n.dispose();
  g.dispose();
  return out;
}

function lathe(profile: [number, number][], sides: number) {
  return new THREE.LatheGeometry(
    profile.map(([x, y]) => new THREE.Vector2(x, y)),
    sides,
  );
}

function place(g: THREE.BufferGeometry, s: number, rot: [number, number, number], pos: [number, number, number]) {
  const m = new THREE.Matrix4().compose(
    new THREE.Vector3(...pos),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)),
    new THREE.Vector3(s, s, s),
  );
  g.applyMatrix4(m);
  return g;
}

function merge(parts: THREE.BufferGeometry[]) {
  const faceted = parts.map(facet);
  const g = mergeGeometries(faceted, false)!;
  faceted.forEach((f) => f.dispose());
  return g;
}

/** Area-weighted normals averaged over every corner that shares a position: the "soft" direction of the stone,
    and the direction the surface swells when it rings (so faces never crack apart). */
function smooth(g: THREE.BufferGeometry) {
  const p = g.attributes.position.array as Float32Array;
  const acc = new Map<string, THREE.Vector3>();
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < p.length; i += 9) {
    a.fromArray(p, i);
    b.fromArray(p, i + 3);
    c.fromArray(p, i + 6);
    const n = b.clone().sub(a).cross(c.clone().sub(a));
    for (let k = 0; k < 9; k += 3) {
      const key = keyOf(p[i + k], p[i + k + 1], p[i + k + 2]);
      const v = acc.get(key);
      if (v) v.add(n);
      else acc.set(key, n.clone());
    }
  }
  acc.forEach((v) => v.normalize());
  const out = new Float32Array(p.length);
  for (let i = 0; i < p.length; i += 3) acc.get(keyOf(p[i], p[i + 1], p[i + 2]))!.toArray(out, i);
  g.setAttribute("aSmooth", new THREE.BufferAttribute(out, 3));
  return acc;
}

/** The crystal's edges (where facets meet at an angle), carrying the same soft normals so they swell with the surface. */
function edgesOf(g: THREE.BufferGeometry, normals: Map<string, THREE.Vector3>) {
  const e = new THREE.EdgesGeometry(g, 24);
  const p = e.attributes.position.array as Float32Array;
  const out = new Float32Array(p.length);
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < p.length; i += 3) (normals.get(keyOf(p[i], p[i + 1], p[i + 2])) ?? up).toArray(out, i);
  e.setAttribute("aSmooth", new THREE.BufferAttribute(out, 3));
  return e;
}

/* ---------- habits ---------- */

const GEO: Record<Exclude<MineralKind, "resonator">, () => THREE.BufferGeometry> = {
  quartz: () => {
    const prism = (seed: number) => jitter(lathe([[0, -1.1], [0.4, -1.1], [0.4, 0.55], [0, 1.22]], 6), 0.035, seed);
    return merge([
      prism(3),
      place(prism(5), 0.62, [0.15, 0.4, -0.62], [0.42, -0.38, 0.12]),
      place(prism(8), 0.46, [-0.25, 0.9, 0.72], [-0.38, -0.56, -0.08]),
    ]);
  },
  fluorite: () =>
    merge([
      jitter(new THREE.OctahedronGeometry(1, 0), 0.03, 11),
      place(jitter(new THREE.OctahedronGeometry(1, 0), 0.03, 12), 0.5, [0.4, 0.78, 0.2], [0.72, -0.5, 0.25]),
    ]),
  pyrite: () =>
    merge([
      place(new THREE.BoxGeometry(1, 1, 1), 1, [0.08, 0.16, 0.04], [0, 0, 0]),
      place(new THREE.BoxGeometry(1, 1, 1), 0.7, [0.35, 0.82, 0.12], [0.6, 0.4, 0.2]),
      place(new THREE.BoxGeometry(1, 1, 1), 0.54, [0.55, 0.3, 0.7], [-0.55, 0.42, -0.22]),
      place(new THREE.BoxGeometry(1, 1, 1), 0.4, [0.2, 0.5, 0.3], [0.22, -0.6, 0.48]),
    ]),
  sulfur: () => {
    const bipyramid = (seed: number) =>
      jitter(lathe([[0, -1.35], [0.48, -0.26], [0.6, 0], [0.48, 0.26], [0, 1.35]], 4), 0.03, seed).applyMatrix4(
        new THREE.Matrix4().makeScale(1, 1, 0.62),
      );
    return merge([bipyramid(21), place(bipyramid(22), 0.46, [0.3, 0.5, -0.9], [0.5, -0.62, 0.2])]);
  },
};

/* ---------- looks (all colours sRGB hex) ---------- */

type Look = {
  deep: number; // shadowed body
  body: number; // lit body
  glow: number; // core light, ring, halo
  sheen: number; // rim
  soft: number; // 0 = hard facets, 1 = round
  metal: number;
  irid: number; // how far the rim shifts toward the glow colour by angle
  glint: number; // share of sparkle cells
  glintScale: number;
  coreFall: number; // how tight the inner light is
  coreAmt: number;
  veil: number; // how much of the glow colour hangs in the body as cloud
  halo: number; // strength of the light it throws on the backdrop
  edge: number; // edge line strength
  seed: number;
};

const LOOK: Record<MineralKind, Look> = {
  resonator: { deep: 0x2f2723, body: 0xf7f1ea, glow: 0xff6a3d, sheen: 0xffffff, soft: 0.34, metal: 0.05, irid: 0.3, glint: 0.12, glintScale: 9, coreFall: 3.2, coreAmt: 0.55, veil: 0.12, halo: 0.55, edge: 0.34, seed: 1 },
  quartz: { deep: 0x1f5e5a, body: 0xd8fff6, glow: 0x7fe6d4, sheen: 0xf2fffb, soft: 0.42, metal: 0, irid: 0.5, glint: 0.14, glintScale: 11, coreFall: 0.8, coreAmt: 0.9, veil: 1, halo: 1, edge: 0.32, seed: 2 },
  fluorite: { deep: 0x1c3f8f, body: 0xc8e4ff, glow: 0x6fd6ff, sheen: 0xeaf6ff, soft: 0.45, metal: 0, irid: 1, glint: 0.14, glintScale: 10, coreFall: 0.9, coreAmt: 0.95, veil: 1, halo: 1, edge: 0.3, seed: 3 },
  pyrite: { deep: 0x5a3c10, body: 0xffe2a0, glow: 0xffb547, sheen: 0xfff4d6, soft: 0.22, metal: 0.85, irid: 0.25, glint: 0.22, glintScale: 13, coreFall: 1.4, coreAmt: 0.35, veil: 0.6, halo: 0.9, edge: 0.22, seed: 4 },
  sulfur: { deep: 0x8f6c00, body: 0xfff6a8, glow: 0xffe14a, sheen: 0xfffbe0, soft: 0.55, metal: 0, irid: 0.4, glint: 0.12, glintScale: 10, coreFall: 0.9, coreAmt: 1, veil: 0.9, halo: 1, edge: 0.24, seed: 5 },
};

const REST: Record<MineralKind, [number, number, number]> = {
  resonator: [0.08, 0.3, 0.16],
  quartz: [0.12, 0.5, -0.18],
  fluorite: [0.34, 0.62, 0.05],
  pyrite: [0.42, 0.6, 0],
  sulfur: [0.18, 0.55, 0.3],
};

/* ---------- shaders ---------- */

const RIPPLE = /* glsl */ `
  uniform vec4 uRip[${MAX_RIPPLES}];
  uniform float uRipAmp;
  attribute vec3 aSmooth;

  // the same travelling ring the first version ran on the CPU: a front moving out from the touch, fading
  vec2 ripple(vec3 p) {
    float d = 0.0;
    float light = 0.0;
    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      vec4 r = uRip[i];
      if (r.w < 0.0) continue;
      float dist = length(p - r.xyz);
      float fall = exp(-r.w * 2.4) * exp(-abs(dist - r.w * 2.6) * 3.2);
      d += fall * sin(dist * 22.0 - r.w * 30.0);
      light += fall;
    }
    return vec2(d, light);
  }
`;

const STONE_VERT = /* glsl */ `
  ${RIPPLE}
  varying vec3 vObj;
  varying vec3 vView;
  varying vec3 vSmooth;
  varying float vRing;

  void main() {
    vec2 rp = ripple(position);
    vec3 p = position + aSmooth * rp.x * uRipAmp;
    vObj = position;
    vRing = rp.y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = mv.xyz;
    vSmooth = normalize(normalMatrix * aSmooth);
    gl_Position = projectionMatrix * mv;
  }
`;

const NOISE = /* glsl */ `
  float h13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }
  float h12(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(h13(i), h13(i + vec3(1, 0, 0)), f.x), mix(h13(i + vec3(0, 1, 0)), h13(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(h13(i + vec3(0, 0, 1)), h13(i + vec3(1, 0, 1)), f.x), mix(h13(i + vec3(0, 1, 1)), h13(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      s += a * vnoise(p);
      p = p * 2.03 + 17.1;
      a *= 0.5;
    }
    return s;
  }
`;

const STONE_FRAG = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uBody;
  uniform vec3 uGlow;
  uniform vec3 uSheen;
  uniform float uSoft;
  uniform float uMetal;
  uniform float uIrid;
  uniform float uGlint;
  uniform float uGlintScale;
  uniform float uCoreFall;
  uniform float uCoreAmt;
  uniform float uVeil;
  uniform float uSeed;
  uniform float uOpacity;
  uniform float uEnergy;
  varying vec3 vObj;
  varying vec3 vView;
  varying vec3 vSmooth;
  varying float vRing;
  ${NOISE}

  void main() {
    vec3 V = normalize(-vView);
    vec3 Nf = normalize(cross(dFdx(vView), dFdy(vView)));
    if (dot(Nf, V) < 0.0) Nf = -Nf;
    vec3 Ns = normalize(vSmooth);
    vec3 N = normalize(mix(Nf, Ns, uSoft));
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fres = pow(1.0 - ndv, 2.6);
    float facetId = h13(floor(Nf * 6.0 + 0.5) + uSeed * 3.7); // each facet its own tone

    vec3 L1 = normalize(vec3(-0.5, 0.7, 0.55)); // key, upper left
    vec3 L2 = normalize(vec3(0.75, 0.1, -0.4)); // from behind, right
    float wrap = clamp((dot(N, L1) + 0.6) / 1.6, 0.0, 1.0);

    // the inside: two layers of cloud seen through the surface, so they slide as the stone turns
    vec3 Rr = refract(-V, N, 0.67);
    float cloud = fbm(vObj * 1.6 + Rr * 0.6 + uSeed);
    float veil = fbm(vObj * 3.8 - Rr * 0.35 + uSeed * 2.0);

    float tone = clamp(wrap * 0.85 + cloud * 0.5 + facetId * 0.3 - 0.36, 0.0, 1.0);
    vec3 col = mix(uDeep, uBody, smoothstep(0.0, 1.0, tone));

    // the light inside: a lit core, a glowing veil, and fine fractures that flash as the view crosses them
    float core = exp(-dot(vObj, vObj) * uCoreFall);
    col += uGlow * core * 0.7 * uCoreAmt + uGlow * pow(veil, 2.2) * 0.6 * uVeil;
    float crack = 1.0 - abs(fbm(vObj * 2.3 + Rr * 0.9 + uSeed * 4.0) * 2.0 - 1.0);
    col += mix(uGlow, uSheen, 0.6) * pow(crack, 14.0) * 0.9 * (0.4 + fres);
    col += mix(uSheen, uGlow, uVeil) * pow(max(dot(N, L2), 0.0), 2.0) * 0.45 * (1.0 - uMetal * 0.5);
    // light pooling at the far side of the stone, as if it carried light through
    col += uGlow * pow(1.0 - max(dot(Ns, V), 0.0), 1.5) * 0.25 * (1.0 - uMetal) * uVeil;

    // facet highlights, crisp on the flat face plus a soft bloom on the rounded one
    vec3 H = normalize(L1 + V);
    float spec = pow(max(dot(Nf, H), 0.0), mix(48.0, 110.0, uMetal)) * (1.1 + uMetal * 1.8);
    spec += pow(max(dot(N, H), 0.0), 10.0) * 0.28;
    vec3 specCol = mix(vec3(1.0), uBody, uMetal * 0.65);

    // metal: a soft studio sky in the reflection
    vec3 R = reflect(-V, N);
    vec3 sky = mix(uDeep * 0.7, uBody * 1.15, smoothstep(-0.4, 0.7, R.y)) + uSheen * pow(max(R.y, 0.0), 6.0) * 0.9;
    col = mix(col, sky, uMetal * 0.6);

    // the rim: pale sheen that leans toward the glow colour by angle and facet
    float t = fract(ndv * 1.25 + facetId * 0.55 + cloud * 0.35);
    vec3 shift = mix(mix(uSheen, uGlow, smoothstep(0.0, 0.5, t)), uSheen, smoothstep(0.5, 1.0, t));
    col += mix(uSheen, shift, uIrid) * fres * 1.25;
    col += specCol * spec;

    // glints: a few cells catch the key light when the stone turns to them
    // each sparkle is a point in a cell of the stone: round, tiny, and only lit while its tilted face meets the light
    vec3 gp = vObj * uGlintScale;
    vec3 cell = floor(gp);
    float pick = step(1.0 - uGlint, h13(cell + uSeed * 9.1));
    vec3 tilt = vec3(h13(cell + 1.3), h13(cell + 2.7), h13(cell + 5.1)) - 0.5;
    vec3 at = vec3(h13(cell + 7.7), h13(cell + 3.3), h13(cell + 9.9)) * 0.6 + 0.2;
    float dot3 = smoothstep(0.16, 0.0, length(fract(gp) - at));
    float catchL = pow(max(dot(normalize(N + tilt * 1.2), H), 0.0), 24.0);
    float glint = pick * dot3 * catchL * 9.0;
    col += glint * mix(vec3(1.0), uSheen, 0.4);

    // the ring: a band of light running out from the touch
    col += uGlow * (vRing * 1.7 + uEnergy * 0.35);

    // grain
    float g = h12(gl_FragCoord.xy + uSeed * 61.0) - 0.5;
    col *= 1.0 + g * 0.28;
    col += g * 0.03;

    gl_FragColor = vec4(max(col, 0.0), uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const EDGE_VERT = /* glsl */ `
  ${RIPPLE}
  varying float vRing;
  varying float vFacing;

  void main() {
    vec2 rp = ripple(position);
    vec3 p = position + aSmooth * rp.x * uRipAmp;
    vRing = rp.y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec3 n = normalize(normalMatrix * aSmooth);
    vFacing = clamp(dot(n, normalize(-mv.xyz)), 0.0, 1.0);
    mv.xyz += normalize(-mv.xyz) * 0.006; // sit just in front of the faces they bound
    gl_Position = projectionMatrix * mv;
  }
`;

const EDGE_FRAG = /* glsl */ `
  uniform vec3 uGlow;
  uniform vec3 uSheen;
  uniform float uOpacity;
  uniform float uEdge;
  varying float vRing;
  varying float vFacing;

  void main() {
    vec3 c = mix(uSheen, uGlow, 0.35) * (uEdge * (0.35 + vFacing * 0.65) + vRing * 1.2);
    gl_FragColor = vec4(c * uOpacity, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const lin = (hex: number) => new THREE.Color(hex); // THREE.Color converts sRGB hex to the linear working space
/** Raw sRGB components, unconverted: for the backdrop shader, which works in display space like the CSS. */
export const srgb = (hex: number) =>
  new THREE.Color().setRGB(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255, THREE.LinearSRGBColorSpace);

type Shared = { uRip: { value: THREE.Vector4[] }; uRipAmp: { value: number }; uOpacity: { value: number }; uEnergy: { value: number } };

function sharedUniforms(amp: number): Shared {
  return {
    uRip: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, 0, -1)) },
    uRipAmp: { value: amp },
    uOpacity: { value: 0 },
    uEnergy: { value: 0 },
  };
}

function stoneMat(l: Look, s: Shared) {
  return new THREE.ShaderMaterial({
    vertexShader: STONE_VERT,
    fragmentShader: STONE_FRAG,
    transparent: true,
    uniforms: {
      ...s,
      uDeep: { value: lin(l.deep) },
      uBody: { value: lin(l.body) },
      uGlow: { value: lin(l.glow) },
      uSheen: { value: lin(l.sheen) },
      uSoft: { value: l.soft },
      uMetal: { value: l.metal },
      uIrid: { value: l.irid },
      uGlint: { value: l.glint },
      uGlintScale: { value: l.glintScale },
      uCoreFall: { value: l.coreFall },
      uCoreAmt: { value: l.coreAmt },
      uVeil: { value: l.veil },
      uSeed: { value: l.seed },
    },
  });
}

function edgeMat(l: Look, s: Shared) {
  return new THREE.ShaderMaterial({
    vertexShader: EDGE_VERT,
    fragmentShader: EDGE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uRip: s.uRip,
      uRipAmp: s.uRipAmp,
      uOpacity: s.uOpacity,
      uGlow: { value: lin(l.glow) },
      uSheen: { value: lin(l.sheen) },
      uEdge: { value: l.edge },
    },
  });
}

/** One stone: its body and its edges, sharing the ripple and fade uniforms. */
function specimen(kind: MineralKind, geo: THREE.BufferGeometry, amp: number) {
  const l = LOOK[kind];
  const normals = smooth(geo);
  const s = sharedUniforms(amp);
  const core = new THREE.Mesh(geo, stoneMat(l, s));
  const edges = new THREE.LineSegments(edgesOf(geo, normals), edgeMat(l, s));
  edges.renderOrder = 1;
  return { core, edges, s };
}

function finish(group: THREE.Group, core: THREE.Mesh, s: Shared, all: Shared[], kind: MineralKind, radius: number, amp: number): Built {
  const r = REST[kind];
  return {
    group,
    core,
    ripples: s.uRip.value,
    energy: s.uEnergy,
    ringAmp: amp,
    rest: new THREE.Vector3(r[0], r[1], r[2]),
    radius,
    glow: srgb(LOOK[kind].glow).multiplyScalar(LOOK[kind].halo),
    fade: (k) => {
      for (const u of all) u.uOpacity.value = k;
    },
    dispose: () => {
      const geos = new Set<THREE.BufferGeometry>();
      const mats = new Set<THREE.Material>();
      group.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) geos.add(mesh.geometry);
        if (mesh.material) mats.add(mesh.material as THREE.Material);
      });
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
    },
  };
}

function resonator(): Built {
  const radius = 2.3;
  const amp = 0.03 * radius;
  const geo = facet(jitter(lathe([[0, -1.72], [0.46, -1.02], [0.46, 1.02], [0, 1.72]], 6), 0.028, 31).rotateZ(0.06));
  const main = specimen("resonator", geo, amp);
  const group = new THREE.Group();
  group.add(main.core, main.edges);
  const all = [main.s];

  // one orbit, tilted, with the four specimens resting on it
  const orbit = new THREE.Group();
  orbit.rotation.set(1.22, 0, 0.22);
  const R = 1.78;
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffe6cf,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  orbit.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.006, 6, 260), ringMat));
  const notes: [Exclude<MineralKind, "resonator">, number, number][] = [
    ["quartz", 0.35, 0.3],
    ["fluorite", 1.95, 0.24],
    ["pyrite", 3.3, 0.22],
    ["sulfur", 4.75, 0.26],
  ];
  notes.forEach(([kind, a, sc], i) => {
    const g = GEO[kind]();
    g.center();
    const sp = specimen(kind, g, 0);
    all.push(sp.s);
    const holder = new THREE.Group();
    holder.add(sp.core, sp.edges);
    holder.scale.setScalar(sc);
    holder.position.set(Math.cos(a) * R, 0, Math.sin(a) * R);
    holder.rotation.set(0.4 + i * 0.9, i * 1.3, -1.22 + i * 0.4);
    orbit.add(holder);
  });
  group.add(orbit);

  const built = finish(group, main.core, main.s, all, "resonator", radius, amp);
  const fadeStones = built.fade;
  built.fade = (k) => {
    fadeStones(k);
    ringMat.opacity = 0.55 * k;
  };
  return built;
}

export function build(kind: MineralKind): Built {
  if (kind === "resonator") return resonator();
  const g = GEO[kind]();
  g.center();
  g.computeBoundingSphere();
  const radius = g.boundingSphere!.radius * 1.04;
  const amp = 0.03 * radius;
  const sp = specimen(kind, g, amp);
  const group = new THREE.Group();
  group.add(sp.core, sp.edges);
  return finish(group, sp.core, sp.s, [sp.s], kind, radius, amp);
}
