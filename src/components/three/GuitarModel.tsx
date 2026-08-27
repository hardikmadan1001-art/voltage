'use client';

import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type GuitarMaterialConfig = {
  bodyFinish: string;      // 'matte' | 'satin' | 'gloss' | 'pearl'
  bodyMaterial: string;    // 'carbon' | 'maple' | 'walnut'
  hardwareFinish: string;  // 'chrome' | 'gold' | 'black' | 'titanium'
};

type Props = {
  scrollYRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  hoveringRef: MutableRefObject<boolean>;
  accent?: string;
  materialConfig?: GuitarMaterialConfig;
};

const BODY_COLORS: Record<string, { color: string; metalness: number; roughness: number; clearcoat: number; iridescence: number }> = {
  carbon:  { color: '#130c08', metalness: 0.55, roughness: 0.30, clearcoat: 0.8,  iridescence: 0.25 },
  maple:   { color: '#5a3a1a', metalness: 0.08, roughness: 0.42, clearcoat: 0.95, iridescence: 0.15 },
  walnut:  { color: '#3a1f0a', metalness: 0.10, roughness: 0.38, clearcoat: 0.90, iridescence: 0.10 },
};

const FINISH_PROPS: Record<string, { clearcoatRoughness: number; sheen: number }> = {
  matte:  { clearcoatRoughness: 0.45, sheen: 0.0 },
  satin:  { clearcoatRoughness: 0.22, sheen: 0.15 },
  gloss:  { clearcoatRoughness: 0.03, sheen: 0.0 },
  pearl:  { clearcoatRoughness: 0.06, sheen: 0.3 },
};

const HW_COLORS: Record<string, string> = {
  chrome:    '#d9d9d8',
  gold:      '#d4af6a',
  black:     '#151518',
  titanium:  '#a0a0a8',
};

export default function GuitarModel({ scrollYRef, pointerRef, hoveringRef, accent = '#d87a26', materialConfig }: Props) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const stringGroup = useRef<THREE.Group>(null);

  const cfg = materialConfig || { bodyFinish: 'matte', bodyMaterial: 'carbon', hardwareFinish: 'chrome' };
  const bodyCfg = BODY_COLORS[cfg.bodyMaterial] || BODY_COLORS.carbon;
  const finishCfg = FINISH_PROPS[cfg.bodyFinish] || FINISH_PROPS.matte;
  const hwColor = HW_COLORS[cfg.hardwareFinish] || HW_COLORS.chrome;

  useFrame((state) => {
    if (!root.current) return;
    const time = state.clock.getElapsedTime();
    const scroll = Math.min(scrollYRef.current * 0.00022, 0.34);
    const pointer = pointerRef.current;
    const intensity = hoveringRef.current ? 1 : 0.32;
    const targetY = -0.34 + Math.sin(time * 0.22) * 0.055 + scroll + pointer.x * 0.5 * intensity;
    const targetX = -0.18 + Math.sin(time * 0.18) * 0.035 - pointer.y * 0.24 * intensity;
    const targetZ = pointer.x * -0.11 * intensity;
    const delta = state.clock.getDelta();
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, targetY, 5.8, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, targetX, 5.8, delta);
    root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, targetZ, 5.8, delta);
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, pointer.x * 0.42 * intensity, 5.8, delta);
    root.current.position.y = -0.15 + Math.sin(time * 0.58) * 0.055 + pointer.y * 0.16 * intensity;
    if (body.current) body.current.rotation.z = Math.sin(time * 0.28) * 0.012;
    stringGroup.current?.children.forEach((string, index) => { string.position.y = Math.sin(time * 3.6 + index * 0.8) * 0.0015; });
  });

  // PBR Body Material — Forged Carbon with iridescent micro-flakes
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: bodyCfg.color,
    metalness: bodyCfg.metalness,
    roughness: bodyCfg.roughness,
    clearcoat: bodyCfg.clearcoat,
    clearcoatRoughness: finishCfg.clearcoatRoughness,
    iridescence: bodyCfg.iridescence,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [100, 400],
    sheen: finishCfg.sheen,
    sheenRoughness: 0.3,
    sheenColor: new THREE.Color(accent),
  }), [bodyCfg, finishCfg, accent]);

  // Figured Maple — parallax-like chatoyancy via clearcoat + sheen
  const mapleMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#5a3a1a',
    metalness: 0.05,
    roughness: 0.45,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    sheen: 0.4,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color('#d4af6a'),
    iridescence: 0.12,
    iridescenceIOR: 1.4,
  }), []);

  // Pickguard — carbon fiber accent
  const carbonMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#19191b',
    metalness: 0.55,
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.14,
  }), []);

  // Hardware — real-time environment reflections
  const metalMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: hwColor,
    metalness: 1.0,
    roughness: cfg.hardwareFinish === 'chrome' ? 0.12 : cfg.hardwareFinish === 'gold' ? 0.18 : 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 2.0,
  }), [hwColor, cfg.hardwareFinish]);

  // Accent material — amber glow
  const accentMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: accent,
    metalness: 0.88,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    emissive: accent,
    emissiveIntensity: 0.06,
  }), [accent]);

  const blackMetal = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#151518',
    metalness: 0.95,
    roughness: 0.28,
  }), []);

  const fretboardMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0c0907',
    metalness: 0.08,
    roughness: 0.38,
    clearcoat: 0.25,
  }), []);

  const bodyShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.18, 1.46);
    shape.bezierCurveTo(-0.7, 1.6, -1.22, 1.3, -1.29, 0.83);
    shape.bezierCurveTo(-1.36, 0.43, -1.1, 0.17, -0.7, 0.02);
    shape.bezierCurveTo(-1.43, -0.16, -1.62, -0.85, -1.37, -1.4);
    shape.bezierCurveTo(-1.09, -1.94, -0.44, -2.06, 0.0, -1.65);
    shape.bezierCurveTo(0.57, -2.06, 1.22, -1.78, 1.42, -1.27);
    shape.bezierCurveTo(1.62, -0.75, 1.33, -0.23, 0.74, 0.03);
    shape.bezierCurveTo(1.04, 0.38, 1.15, 0.73, 1.1, 1.1);
    shape.bezierCurveTo(1.04, 1.51, 0.58, 1.64, 0.24, 1.37);
    shape.lineTo(0.16, 1.65); shape.lineTo(-0.16, 1.65); shape.closePath();
    return shape;
  }, []);

  const pickguardShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.38, 1.07);
    shape.bezierCurveTo(0.15, 1.15, 0.66, 0.9, 0.69, 0.52);
    shape.bezierCurveTo(0.72, -0.05, 0.48, -0.62, -0.01, -1.2);
    shape.bezierCurveTo(-0.28, -1.36, -0.54, -1.08, -0.47, -0.63);
    shape.lineTo(-0.34, 0.57); shape.closePath();
    return shape;
  }, []);

  const sixStrings = Array.from({ length: 6 });
  const frets = Array.from({ length: 22 });

  return (
    <group ref={root} dispose={null} scale={1.03}>
      <group ref={body}>
        {/* Main body extrusion with PBR material */}
        <mesh material={bodyMaterial} castShadow receiveShadow>
          <extrudeGeometry args={[bodyShape, {
            depth: 0.34,
            bevelEnabled: true,
            bevelSegments: 8,
            bevelSize: 0.085,
            bevelThickness: 0.085,
            curveSegments: 42,
          }]} />
        </mesh>
        {/* Top face */}
        <mesh material={bodyMaterial} position={[0, 0, 0.37]}>
          <shapeGeometry args={[bodyShape]} />
        </mesh>
        {/* Pickguard with carbon material */}
        <mesh material={carbonMaterial} position={[0, 0, 0.405]}>
          <shapeGeometry args={[pickguardShape]} />
        </mesh>

        {/* Pickup positions */}
        {[0.42, -0.53].map((y) => (
          <group key={y} position={[-0.08, y, 0.47]}>
            <mesh material={blackMetal}>
              <boxGeometry args={[0.92, 0.19, 0.07]} />
            </mesh>
            {sixStrings.map((_, i) => (
              <mesh key={i} material={metalMaterial} position={[-0.35 + i * 0.14, 0, 0.055]}>
                <cylinderGeometry args={[0.036, 0.036, 0.035, 14]} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Bridge */}
        <group position={[-0.08, -1.02, 0.49]}>
          <mesh material={metalMaterial}>
            <boxGeometry args={[1.04, 0.16, 0.09]} />
          </mesh>
          {sixStrings.map((_, i) => (
            <mesh key={i} material={blackMetal} position={[-0.4 + i * 0.16, 0, 0.075]}>
              <boxGeometry args={[0.075, 0.12, 0.08]} />
            </mesh>
          ))}
        </group>

        {/* Control knobs */}
        {[[0.58, -0.4], [0.83, -0.67], [1.06, -0.92]].map(([x, y]) => (
          <mesh key={`${x}-${y}`} material={metalMaterial} position={[x, y, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 24]} />
          </mesh>
        ))}

        {/* Toggle switch */}
        <mesh material={metalMaterial} position={[0.71, 0.43, 0.57]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
        </mesh>
      </group>

      {/* Neck */}
      <group position={[0, 2.02, 0.07]}>
        <mesh material={bodyMaterial} castShadow>
          <boxGeometry args={[0.47, 3.68, 0.18]} />
        </mesh>
        <mesh material={fretboardMaterial} position={[0, 0, 0.105]}>
          <boxGeometry args={[0.43, 3.68, 0.025]} />
        </mesh>
        {frets.map((_, i) => (
          <mesh key={i} material={metalMaterial} position={[0, 1.73 - i * 0.163, 0.126]}>
            <boxGeometry args={[0.42, 0.011, 0.012]} />
          </mesh>
        ))}
        {[3, 5, 7, 9, 12, 15, 17, 19].map(f => (
          <mesh key={f} material={metalMaterial} position={[0, 1.73 - f * 0.163, 0.133]}>
            <circleGeometry args={[0.038, 16]} />
          </mesh>
        ))}
      </group>

      {/* Headstock */}
      <group position={[0, 4.04, 0.07]}>
        <mesh material={bodyMaterial} castShadow>
          <boxGeometry args={[0.8, 0.97, 0.21]} />
        </mesh>
        {sixStrings.map((_, i) => (
          <group key={i} position={[i < 3 ? -0.45 : 0.45, -0.28 + (i % 3) * 0.28, 0.08]}>
            <mesh material={metalMaterial}>
              <cylinderGeometry args={[0.043, 0.043, 0.13, 12]} />
            </mesh>
            <mesh material={blackMetal} position={[i < 3 ? -0.075 : 0.075, 0, 0]}>
              <boxGeometry args={[0.12, 0.06, 0.055]} />
            </mesh>
          </group>
        ))}
        {/* AXIOM logo on headstock */}
        <mesh material={accentMaterial} position={[0, 0, 0.115]}>
          <boxGeometry args={[0.25, 0.075, 0.008]} />
        </mesh>
      </group>

      {/* Strings */}
      <group ref={stringGroup} position={[0, 1.45, 0.51]}>
        {sixStrings.map((_, i) => (
          <mesh key={i} material={metalMaterial} position={[-0.18 + i * 0.072, 0, 0]}>
            <cylinderGeometry args={[0.0038, 0.0038, 5.34, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
