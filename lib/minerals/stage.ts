/* One WebGL canvas behind the whole page. It paints the backdrop first, a dark field of slow light with grain,
   lit from below by every stone on screen, then draws each <Mineral> slot into its own scissored viewport,
   so a page with five stones still uses a single context and the stones' light spills past their slots.
   Nothing moves by itself. The field drifts when you scroll or move the pointer, the stones turn toward the pointer
   and ring where they are touched: "nothing happens unless a person does it". */

import * as THREE from "three";
import { build, srgb, MAX_RIPPLES, type MineralKind, type Built } from "./shapes";

type Ripple = { p: THREE.Vector3; t0: number };

type Slot = {
  el: HTMLElement;
  host: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pivot: THREE.Group;
  built: Built;
  aspect: number;
  born: number;
  k: number;
  target: THREE.Vector2;
  rot: THREE.Vector2;
  ripples: Ripple[];
  lastRipple: number;
  off: () => void;
};

const EASE_IN = 1400; // entrance, ms
const RIPPLE_LIFE = 1700; // ms
const MAX_HALOS = 8;

let renderer: THREE.WebGLRenderer | null = null;
let canvas: HTMLCanvasElement | null = null;
let failed = false;
let raf = 0;
let reduce = false;
const slots = new Set<Slot>();
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();

/* ---------- backdrop ---------- */

const BACK_FRAG = /* glsl */ `
  uniform vec2 uRes;
  uniform float uDpr;
  uniform float uScroll;
  uniform vec2 uPtr;
  uniform vec3 uBase;
  uniform vec3 uAcc;
  uniform vec3 uHuman;
  uniform vec4 uHalo[${MAX_HALOS}];
  uniform vec3 uHaloCol[${MAX_HALOS}];
  uniform int uCount;
  uniform float uDay; // 1 on the home page in daytime: the first screen is lit like a morning sky
  uniform float uSkyEnd; // where that sky ends, in page px

  float h12(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float s = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 4; i++) {
      s += a * vnoise(p);
      p = m * p + 7.3;
      a *= 0.5;
    }
    return s;
  }

  void main() {
    vec2 css = gl_FragCoord.xy / uDpr; // CSS px from the bottom left
    vec2 view = uRes / uDpr;
    vec2 p = css / view.y;
    // the field sits a little behind the page: it scrolls at a fraction of the content's speed
    vec2 q = p * 1.25 + vec2(0.0, uScroll / view.y * 0.32) + (uPtr - 0.5) * vec2(0.08, 0.05);

    vec2 w = vec2(fbm(q * 0.8 + 3.1), fbm(q * 0.8 + 8.7));
    float f = fbm(q * 1.05 + w * 1.7);
    float f2 = fbm(q * 0.6 - w * 1.2 + 11.0);

    vec3 col = uBase;
    col += uAcc * smoothstep(0.45, 0.92, f) * 0.085;
    col += uHuman * smoothstep(0.55, 0.95, f2) * 0.035;
    // fine silk in the field, like light through smoke
    col += mix(uAcc, vec3(1.0), 0.5) * pow(smoothstep(0.55, 0.75, fbm(q * 3.2 + w * 2.0)), 3.0) * 0.035;

    // each stone lights the field around it
    vec3 halo = vec3(0.0);
    for (int i = 0; i < ${MAX_HALOS}; i++) {
      if (i >= uCount) break;
      vec4 h = uHalo[i];
      vec2 d = css - h.xy;
      float r = length(d) / h.z;
      float glow = exp(-r * r * 2.2) * 0.3 + exp(-r * 3.2) * 0.1;
      float streak = exp(-abs(d.y) / (h.z * 0.022)) * exp(-abs(d.x) / (h.z * 1.5)) * 0.12;
      float breathe = 0.85 + 0.3 * fbm(d / h.z * 1.4 + q);
      halo += uHaloCol[i] * (glow * breathe + streak) * h.w;
    }

    float vig = smoothstep(1.35, 0.2, length((css / view - 0.5) * vec2(1.0, 1.25)));
    vec3 night = (col + halo) * mix(0.72, 1.0, vig);

    // day: a warm, bright sky over the first screen that sinks into the night field below it
    float docY = uScroll + (view.y - css.y);
    float t = clamp(docY / max(uSkyEnd, 1.0), 0.0, 1.0);
    vec3 sky = mix(vec3(0.988, 0.962, 0.930), vec3(0.972, 0.872, 0.800), t);
    float sd = length(vec2(css.x - view.x * 0.72, docY - uSkyEnd * 0.3)) / view.y;
    sky += vec3(1.0, 0.70, 0.48) * exp(-sd * sd * 4.0) * 0.16;
    sky = mix(sky, sky * vec3(0.95, 0.92, 0.89) + uAcc * 0.05, smoothstep(0.45, 0.92, f) * 0.8);
    sky += (vec3(1.0) - sky) * pow(smoothstep(0.55, 0.75, fbm(q * 3.2 + w * 2.0)), 3.0) * 0.25;
    vec3 day = 1.0 - (1.0 - sky) * (1.0 - clamp(halo * 0.75, 0.0, 1.0));
    float dm = uDay * (1.0 - smoothstep(uSkyEnd - view.y * 0.18, uSkyEnd + view.y * 0.12, docY));
    col = mix(night, day, dm);

    float g = h12(gl_FragCoord.xy) - 0.5;
    col += g * 0.06;
    gl_FragColor = vec4(col, 1.0);
  }
`;

let back: {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  u: {
    uRes: { value: THREE.Vector2 };
    uDpr: { value: number };
    uScroll: { value: number };
    uPtr: { value: THREE.Vector2 };
    uBase: { value: THREE.Color };
    uAcc: { value: THREE.Color };
    uHuman: { value: THREE.Color };
    uHalo: { value: THREE.Vector4[] };
    uHaloCol: { value: THREE.Color[] };
    uCount: { value: number };
    uDay: { value: number };
    uSkyEnd: { value: number };
  };
} | null = null;

const ptr = new THREE.Vector2(0.5, 0.5);
const ptrTarget = new THREE.Vector2(0.5, 0.5);
const accTarget = new THREE.Color();
let pageAcc = new THREE.Color();
let tints: { el: Element; color: THREE.Color }[] = [];
let hero: Element | null = null; // the home hero, when it's daytime (html[data-day], set before paint in the layout)

function backdrop() {
  const u = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
    uScroll: { value: 0 },
    uPtr: { value: ptr },
    uBase: { value: srgb(0x0b0a09) },
    uAcc: { value: srgb(0xff6a3d) },
    uHuman: { value: srgb(0xff6a3d) },
    uHalo: { value: Array.from({ length: MAX_HALOS }, () => new THREE.Vector4()) },
    uHaloCol: { value: Array.from({ length: MAX_HALOS }, () => new THREE.Color()) },
    uCount: { value: 0 },
    uDay: { value: 0 },
    uSkyEnd: { value: 1 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: u,
    vertexShader: /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: BACK_FRAG,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  mesh.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(mesh);
  return { scene, camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), u };
}

function readAcc(el: Element | null, fallback: THREE.Color) {
  if (!el) return fallback.clone();
  const v = getComputedStyle(el).getPropertyValue("--acc").trim();
  const m = /^#([0-9a-f]{6})$/i.exec(v);
  return m ? srgb(parseInt(m[1], 16)) : fallback.clone();
}

/** Re-read the page's colours: its own accent, and the sections ([data-tint]) that tint the field while they're centred. */
export function refresh() {
  if (!renderer || !back) return;
  const human = back.u.uHuman.value;
  pageAcc = readAcc(document.querySelector("#main > [data-p]"), human);
  tints = Array.from(document.querySelectorAll("[data-tint]")).map((el) => ({ el, color: readAcc(el, pageAcc) }));
  hero = document.documentElement.dataset.day === "1" ? document.querySelector(".hh") : null;
  back.u.uDay.value = hero ? 1 : 0;
  if (!hero) delete document.documentElement.dataset.sky;
  invalidate();
}

/* ---------- boot ---------- */

function boot() {
  if (renderer || failed) return !!renderer;
  try {
    canvas = document.createElement("canvas");
    canvas.className = "mineral-stage";
    canvas.setAttribute("aria-hidden", "true");
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    failed = true;
    canvas = null;
    return false;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.autoClear = false;
  back = backdrop();

  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.prepend(canvas);
  document.documentElement.dataset.gl = "on";

  window.addEventListener("scroll", invalidate, { passive: true });
  window.addEventListener("resize", invalidate);
  window.addEventListener(
    "pointermove",
    (e) => {
      ptrTarget.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
      invalidate();
    },
    { passive: true },
  );
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    document.documentElement.dataset.gl = "off";
  });
  canvas.addEventListener("webglcontextrestored", () => {
    document.documentElement.dataset.gl = "on";
    invalidate();
  });
  refresh();
  return true;
}

/** Start the backdrop on pages that have no stones of their own. */
export function mount() {
  if (boot()) refresh();
}

function invalidate() {
  if (!raf && renderer) raf = requestAnimationFrame(frame);
}

/* ---------- stones ---------- */

function fit(s: Slot) {
  const radius = s.built.radius;
  const v = THREE.MathUtils.degToRad(s.camera.fov / 2);
  const h = Math.atan(Math.tan(v) * s.camera.aspect);
  const d = Math.max(radius / Math.sin(v), radius / Math.sin(h));
  s.camera.position.set(0, 0, d);
  s.camera.near = d - radius * 2;
  s.camera.far = d + radius * 2;
  s.camera.updateProjectionMatrix();
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/** Feed live ripples to the shader. Returns true while any is alive. */
function ring(s: Slot, now: number) {
  s.ripples = s.ripples.filter((r) => now - r.t0 < RIPPLE_LIFE);
  const u = s.built.ripples;
  let energy = 0;
  for (let i = 0; i < MAX_RIPPLES; i++) {
    const r = s.ripples[i];
    if (!r) {
      u[i].w = -1;
      continue;
    }
    const age = (now - r.t0) / 1000;
    u[i].set(r.p.x, r.p.y, r.p.z, age);
    energy = Math.max(energy, Math.exp(-age * 3));
  }
  s.built.energy.value = energy;
  return s.ripples.length > 0;
}

function step(s: Slot, now: number) {
  let moving = false;

  const e = reduce ? 1 : Math.min(1, (now - s.born) / EASE_IN);
  if (e < 1) moving = true;
  s.k = easeOut(e);

  const dx = s.target.x - s.rot.x;
  const dy = s.target.y - s.rot.y;
  if (Math.abs(dx) > 1e-4 || Math.abs(dy) > 1e-4) {
    const f = reduce ? 1 : 0.08;
    s.rot.x += dx * f;
    s.rot.y += dy * f;
    moving = true;
  }

  const rest = s.built.rest;
  s.pivot.rotation.set(rest.x + s.rot.y * 0.34, rest.y + s.rot.x * 0.55 + (1 - s.k) * 0.9, rest.z);
  s.pivot.scale.setScalar(0.9 + 0.1 * s.k);
  s.built.fade(s.k);

  if (ring(s, now)) moving = true;
  return moving;
}

function frame(now: number) {
  raf = 0;
  if (!renderer || !canvas || !back) return;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const size = renderer.getSize(new THREE.Vector2());
  if (size.x !== w || size.y !== h) renderer.setSize(w, h, false);
  const dpr = renderer.getPixelRatio();

  let again = false;

  // field colour follows the section in the middle of the screen
  let tint = pageAcc;
  for (const t of tints) {
    const r = t.el.getBoundingClientRect();
    if (r.top < h * 0.55 && r.bottom > h * 0.45) {
      tint = t.color;
      break;
    }
  }
  accTarget.copy(tint);
  const acc = back.u.uAcc.value;
  if (Math.abs(acc.r - accTarget.r) + Math.abs(acc.g - accTarget.g) + Math.abs(acc.b - accTarget.b) > 0.004) {
    acc.lerp(accTarget, reduce ? 1 : 0.06);
    again = true;
  } else acc.copy(accTarget);

  if (ptr.distanceToSquared(ptrTarget) > 1e-6) {
    ptr.lerp(ptrTarget, reduce ? 1 : 0.06);
    again = true;
  }

  // stones first (positions, entrance, ripples), so the halos know where they are
  const visible: { s: Slot; r: DOMRect }[] = [];
  for (const s of slots) {
    const r = s.el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.bottom < -r.height * 0.5 || r.top > h + r.height * 0.5 || r.right < 0 || r.left > w) continue;
    if (step(s, now)) again = true;
    visible.push({ s, r });
  }

  let n = 0;
  for (const { s, r } of visible) {
    if (n >= MAX_HALOS) break;
    const rad = Math.min(r.width, r.height) * 0.42;
    back.u.uHalo.value[n].set(r.left + r.width / 2, h - (r.top + r.height / 2), rad, s.k * (0.85 + s.built.energy.value * 0.9));
    back.u.uHaloCol.value[n].copy(s.built.glow);
    n++;
  }
  back.u.uCount.value = n;
  back.u.uRes.value.set(w * dpr, h * dpr);
  back.u.uDpr.value = dpr;
  back.u.uScroll.value = window.scrollY;
  if (hero) {
    const end = hero.getBoundingClientRect().bottom;
    back.u.uSkyEnd.value = end + window.scrollY;
    // the header reads dark-on-light while it floats over the daytime sky
    const sky = end > 150 ? "day" : "";
    if ((document.documentElement.dataset.sky ?? "") !== sky) {
      if (sky) document.documentElement.dataset.sky = sky;
      else delete document.documentElement.dataset.sky;
    }
  }

  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, w, h);
  renderer.clear();
  renderer.render(back.scene, back.camera);

  renderer.setScissorTest(true);
  for (const { s, r } of visible) {
    if (r.bottom < 0 || r.top > h) continue;
    const aspect = r.width / r.height;
    if (Math.abs(aspect - s.aspect) > 1e-3) {
      s.aspect = aspect;
      s.camera.aspect = aspect;
      fit(s);
    }
    const y = h - r.bottom;
    renderer.setViewport(r.left, y, r.width, r.height);
    renderer.setScissor(r.left, y, r.width, r.height);
    renderer.clearDepth();
    renderer.render(s.scene, s.camera);
  }
  if (again) invalidate();
}

function local(s: Slot, e: PointerEvent) {
  const r = s.el.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 };
}

function strike(s: Slot, e: PointerEvent) {
  if (reduce) return;
  const now = performance.now();
  if (now - s.lastRipple < 140) return;
  const p = local(s, e);
  if (Math.abs(p.x) > 1 || Math.abs(p.y) > 1) return;
  ndc.set(p.x, p.y);
  s.scene.updateMatrixWorld();
  ray.setFromCamera(ndc, s.camera);
  const hit = ray.intersectObject(s.built.core, false)[0];
  if (!hit) return;
  s.lastRipple = now;
  s.ripples.push({ p: s.built.core.worldToLocal(hit.point.clone()), t0: now });
  if (s.ripples.length > MAX_RIPPLES) s.ripples.shift();
  invalidate();
}

export function register(el: HTMLElement, kind: MineralKind): () => void {
  if (!boot()) return () => {};

  const scene = new THREE.Scene();
  const built = build(kind);
  const pivot = new THREE.Group();
  pivot.add(built.group);
  scene.add(pivot);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  const host = (el.closest("[data-mineral-host]") as HTMLElement | null) ?? el;

  const s: Slot = {
    el,
    host,
    scene,
    camera,
    pivot,
    built,
    aspect: 0,
    born: performance.now(),
    k: 0,
    target: new THREE.Vector2(),
    rot: new THREE.Vector2(),
    ripples: [],
    lastRipple: 0,
    off: () => {},
  };

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    s.target.set(
      THREE.MathUtils.clamp((e.clientX - cx) / (r.width / 2), -1, 1),
      THREE.MathUtils.clamp((e.clientY - cy) / (r.height / 2), -1, 1),
    );
    invalidate();
  };
  const onLeave = () => {
    s.target.set(0, 0);
    invalidate();
  };
  const onTouch = (e: PointerEvent) => strike(s, e);

  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);
  el.addEventListener("pointermove", onTouch);
  el.addEventListener("pointerdown", onTouch);
  s.off = () => {
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
    el.removeEventListener("pointermove", onTouch);
    el.removeEventListener("pointerdown", onTouch);
  };

  slots.add(s);
  el.dataset.live = "true";
  invalidate();

  return () => {
    s.off();
    slots.delete(s);
    delete el.dataset.live;
    built.dispose();
    invalidate();
  };
}
