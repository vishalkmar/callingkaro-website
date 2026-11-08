// One 3D phone for the whole page. Every chapter has an empty "anchor" box ([data-phone]) beside its text;
// while you scroll, the phone flies from anchor to anchor - position, size, angle - shows that chapter's
// screen and brings that chapter's 3D object. The canvas is fixed behind the text (pointer-events: none).
import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SCREEN_W, SCREEN_H } from './screenArt';
import { drawScreenMode } from './screens';

const PHONE_W = 2.3;
const SCREEN_H3 = PHONE_W * (SCREEN_H / SCREEN_W);
const PHONE_H = SCREEN_H3 + 0.32;
const CAM_Z = 12;
const FOV = 35;
const DEG = Math.PI / 180;

const smooth = x => x * x * x * (x * (x * 6 - 15) + 10); // smootherstep
const lerp = (a, b, t) => a + (b - a) * t;

// ---------- anchors (read from the DOM every frame: cheap, always in sync with layout) ----------
let anchorCache = [];
let anchorAt = 0;
const anchors = () => {
  const now = performance.now();
  if (now - anchorAt > 500 || !anchorCache.length) {
    anchorAt = now;
    anchorCache = [...document.querySelectorAll('[data-phone]')].map(el => ({
      el,
      screen: el.dataset.screen || 'dialpad',
      prop: el.dataset.prop || '',
      rot: (el.dataset.rot || '0,0,0').split(',').map(n => Number(n) * DEG),
    }));
  }
  return anchorCache;
};

/** Where the phone should be right now: blend of the two anchors around the scroll position. */
const target = (vw, vh) => {
  const list = anchors();
  if (!list.length) {
    return null;
  }
  const y = window.scrollY;
  const pts = list.map((a, i) => {
    const r = a.el.getBoundingClientRect();
    const cy = r.top + r.height / 2;
    // scroll at which this anchor is centred in the viewport (the first one is "active" from the top)
    const active = i === 0 ? Math.min(0, y + cy - vh / 2) : y + cy - vh / 2;
    return { ...a, cx: r.left + r.width / 2, cy, h: r.height, w: r.width, active };
  });
  let i = 0;
  while (i < pts.length - 1 && y >= pts[i + 1].active) {
    i += 1;
  }
  const a = pts[i];
  const b = pts[Math.min(i + 1, pts.length - 1)];
  const raw = a === b ? 0 : Math.min(1, Math.max(0, (y - a.active) / (b.active - a.active)));
  const t = smooth(raw);
  return {
    t,
    a,
    b,
    x: lerp(a.cx, b.cx, t),
    y: lerp(a.cy, b.cy, t),
    // the phone fills ~90% of its anchor's height (and never overflows its width)
    hPx: lerp(Math.min(a.h * 0.9, a.w * 1.9), Math.min(b.h * 0.9, b.w * 1.9), t),
    rot: a.rot.map((r, k) => lerp(r, b.rot[k], t)),
    screen: t < 0.5 ? a.screen : b.screen,
  };
};

// ---------- geometry ----------
const roundedRect = (w, h, r) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

const shieldShape = () => {
  const s = new THREE.Shape();
  s.moveTo(0, 1);
  s.bezierCurveTo(0.45, 0.85, 0.75, 0.8, 0.85, 0.75);
  s.bezierCurveTo(0.85, 0.1, 0.6, -0.55, 0, -1);
  s.bezierCurveTo(-0.6, -0.55, -0.85, 0.1, -0.85, 0.75);
  s.bezierCurveTo(-0.75, 0.8, -0.45, 0.85, 0, 1);
  return s;
};

// ---------- 3D props (one per chapter, faded in by weight) ----------
const Waves = ({ weight }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current?.children.forEach((m, i) => {
      const p = (t * 0.45 + i / 3) % 1;
      m.scale.setScalar(0.6 + p * 1.6);
      m.material.opacity = (1 - p) * 0.55 * weight.current;
    });
  });
  return (
    <group ref={ref} position={[0, 0, -0.4]}>
      {[0, 1, 2].map(i => (
        <mesh key={i}>
          <torusGeometry args={[2.2, 0.025, 12, 120]} />
          <meshBasicMaterial color="#FF7A45" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

const Coins = ({ weight }) => {
  const ref = useRef();
  const coins = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        angle: (i / 9) * Math.PI * 2,
        radius: 2.5 + (i % 3) * 0.4,
        y: -2.2 + ((i * 0.55) % 4.4),
        speed: 0.25 + (i % 4) * 0.05,
        size: 0.22 + (i % 3) * 0.06,
      })),
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const w = weight.current;
    ref.current?.children.forEach((m, i) => {
      const c = coins[i];
      const a = c.angle + t * c.speed;
      m.position.set(Math.cos(a) * c.radius, c.y + Math.sin(t + i) * 0.2, Math.sin(a) * c.radius * 0.6 - 0.3);
      m.rotation.x = Math.PI / 2 + Math.sin(t * 1.5 + i) * 0.5;
      m.rotation.z = t * 1.6 + i;
      m.scale.setScalar(Math.max(0.0001, w));
    });
  });
  return (
    <group ref={ref}>
      {coins.map((c, i) => (
        <mesh key={i}>
          <cylinderGeometry args={[c.size, c.size, 0.07, 36]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#3BB54A' : '#FF8A57'}
            metalness={0.6}
            roughness={0.22}
            emissive={i % 3 === 0 ? '#0f3d15' : '#5a1f06'}
          />
        </mesh>
      ))}
    </group>
  );
};

const Gift = ({ weight }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = ref.current;
    if (g) {
      g.rotation.y = t * 0.8;
      g.rotation.x = Math.sin(t * 0.9) * 0.25;
      g.position.y = 1.6 + Math.sin(t * 1.3) * 0.2;
      g.scale.setScalar(Math.max(0.0001, weight.current));
    }
  });
  return (
    <group ref={ref} position={[-2.3, 1.6, 0.4]}>
      <mesh>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color="#7C6CF0" metalness={0.2} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[1.12, 0.18, 1.12]} />
        <meshStandardMaterial color="#9387F5" metalness={0.2} roughness={0.35} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.18, 1.0, 1.02]} />
        <meshStandardMaterial color="#FFB088" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.02, 1.0, 0.18]} />
        <meshStandardMaterial color="#FFB088" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.2, 0.06, 12, 32]} />
        <meshStandardMaterial color="#FF7A45" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
};

const Shield = ({ weight }) => {
  const ref = useRef();
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shieldShape(), { depth: 0.25, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4 });
    g.center();
    return g;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = ref.current;
    if (g) {
      g.rotation.y = -0.5 + Math.sin(t * 0.8) * 0.5;
      g.position.y = -1.4 + Math.sin(t * 1.2) * 0.18;
      g.scale.setScalar(Math.max(0.0001, weight.current) * 0.85);
    }
  });
  return (
    <group ref={ref} position={[2.3, -1.4, 0.5]}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color="#3BB54A" metalness={0.3} roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.02, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.75, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.2, -0.12, 0.2]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.38, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const DownloadArrow = ({ weight }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = ref.current;
    if (g) {
      g.position.y = 1.5 + Math.abs(Math.sin(t * 2)) * -0.35;
      g.rotation.y = t * 0.9;
      g.scale.setScalar(Math.max(0.0001, weight.current));
    }
  });
  return (
    <group ref={ref} position={[-2.2, 1.5, 0.4]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.8, 24]} />
        <meshStandardMaterial color="#FF7A45" metalness={0.4} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.42, 0.55, 32]} />
        <meshStandardMaterial color="#E8622E" metalness={0.4} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.06, 12, 48]} />
        <meshStandardMaterial color="#3BB54A" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
};

const PROPS = { waves: Waves, coins: Coins, gift: Gift, shield: Shield, download: DownloadArrow };

// ---------- the phone ----------
const Rig = () => {
  const rig = useRef();
  const phone = useRef();
  const { size, camera } = useThree();
  const weights = useRef(Object.fromEntries(Object.keys(PROPS).map(k => [k, { current: 0 }]))).current;
  const pointer = useRef({ x: 0, y: 0 });
  const current = useRef(null);
  const lastKey = useRef('');
  const lastScreen = useRef('dialpad');

  const { ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = SCREEN_W;
    c.height = SCREEN_H;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { ctx: c.getContext('2d'), texture: tex };
  }, []);

  const body = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(PHONE_W + 0.16, PHONE_H, 0.42), {
      depth: 0.26,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 6,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, []);
  const screen = useMemo(() => {
    const g = new THREE.ShapeGeometry(roundedRect(PHONE_W, SCREEN_H3, 0.32), 24);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, pos.getX(i) / PHONE_W + 0.5, pos.getY(i) / SCREEN_H3 + 0.5);
    }
    return g;
  }, []);

  useEffect(() => {
    const on = e => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => {
      window.removeEventListener('pointermove', on);
      texture.dispose();
    };
  }, [texture]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const vw = size.width;
    const vh = size.height;
    const tg = target(vw, vh);
    if (!tg || !rig.current) {
      return;
    }
    const visH = 2 * CAM_Z * Math.tan((FOV * DEG) / 2);
    const visW = visH * (vw / vh);
    const mobile = vw < 900;
    // on phones the text spans the width: the phone shrinks while it travels between chapters
    const travel = mobile ? 1 - 0.85 * Math.sin(Math.PI * tg.t) : 1;
    const goal = {
      x: (tg.x / vw - 0.5) * visW,
      y: -(tg.y / vh - 0.5) * visH,
      s: ((tg.hPx / vh) * visH * travel) / PHONE_H,
    };
    const c = current.current || (current.current = { ...goal });
    const k = 0.14;
    c.x = lerp(c.x, goal.x, k);
    c.y = lerp(c.y, goal.y, k);
    c.s = lerp(c.s, goal.s, k);
    rig.current.position.set(c.x, c.y, 0);
    rig.current.scale.setScalar(Math.max(0.0001, c.s));

    const p = pointer.current;
    const ph = phone.current;
    ph.rotation.x = lerp(ph.rotation.x, tg.rot[0] - p.y * 0.12 + Math.sin(time * 0.7) * 0.04, 0.08);
    ph.rotation.y = lerp(ph.rotation.y, tg.rot[1] + p.x * 0.22 + Math.sin(time * 0.5) * 0.06, 0.08);
    ph.rotation.z = lerp(ph.rotation.z, tg.rot[2], 0.08);
    ph.position.y = Math.sin(time * 1.1) * 0.1;

    // chapter objects: the leaving one fades out while the next fades in
    Object.keys(weights).forEach(name => {
      const want = (tg.a.prop === name ? 1 - tg.t : 0) + (tg.b.prop === name ? tg.t : 0);
      weights[name].current = lerp(weights[name].current, Math.min(1, want), 0.1);
    });

    if (tg.screen !== lastScreen.current) {
      lastScreen.current = tg.screen;
      lastKey.current = '';
    }
    const key = drawScreenMode(ctx, tg.screen, time);
    if (key !== lastKey.current) {
      lastKey.current = key;
      texture.needsUpdate = true;
    }
    if (camera.position.z !== CAM_Z) {
      camera.position.z = CAM_Z;
    }
  });

  return (
    <group ref={rig}>
      {Object.entries(PROPS).map(([name, Prop]) => (
        <Prop key={name} weight={weights[name]} />
      ))}
      <group ref={phone}>
        <mesh geometry={body}>
          <meshPhysicalMaterial color="#1a1c22" metalness={0.6} roughness={0.3} clearcoat={1} clearcoatRoughness={0.2} />
        </mesh>
        <mesh geometry={screen} position={[0, 0, 0.196]}>
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, PHONE_H / 2 - 0.27, 0.2]}>
          <circleGeometry args={[0.055, 24]} />
          <meshBasicMaterial color="#0b0c0f" />
        </mesh>
        <mesh position={[PHONE_W / 2 + 0.16, 0.9, 0]}>
          <boxGeometry args={[0.05, 0.6, 0.12]} />
          <meshStandardMaterial color="#2a2d35" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

const StoryScene = ({ onReady }) => (
  <div className="scene" aria-hidden="true">
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, CAM_Z], fov: FOV }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 6]} intensity={1.7} />
      <pointLight position={[-6, -2, 5]} intensity={40} color="#FF7A45" />
      <pointLight position={[6, 3, -2]} intensity={24} color="#9be7a8" />
      <Rig />
    </Canvas>
  </div>
);

export default StoryScene;
