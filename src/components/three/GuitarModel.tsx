'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Props = {
  scrollY?: number;
  mouseX?: number;
  mouseY?: number;
  accent?: string;
};

export default function GuitarModel({ scrollY = 0, mouseX = 0, mouseY = 0, accent = '#ff5a00' }: Props) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const neck = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const strings = useRef<THREE.Group>(null);
  const bridge = useRef<THREE.Group>(null);
  const pickup1 = useRef<THREE.Group>(null);
  const pickup2 = useRef<THREE.Group>(null);
  const knob1 = useRef<THREE.Mesh>(null);
  const knob2 = useRef<THREE.Mesh>(null);
  const knob3 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!root.current) return;
    const t = state.clock.getElapsedTime();

    // Idle rotation + scroll/mouse reactivity
    const scrollFactor = scrollY * 0.0006;
    const targetRotY = -0.22 + Math.sin(t * 0.2) * 0.1 + scrollFactor * 1.1 + mouseX * 0.22;
    const targetRotX = -0.25 + Math.sin(t * 0.15) * 0.05 - mouseY * 0.2;

    root.current.rotation.y += (targetRotY - root.current.rotation.y) * 0.06;
    root.current.rotation.x += (targetRotX - root.current.rotation.x) * 0.06;
    root.current.position.y = Math.sin(t * 0.6) * 0.08 - 0.2;

    // Component subtle animations
    if (body.current) {
      body.current.rotation.z = Math.sin(t * 0.3) * 0.02;
    }
    if (strings.current) {
      strings.current.children.forEach((s, i) => {
        s.position.y = Math.sin(t * 4 + i * 0.5) * 0.002;
      });
    }
  });

  // Materials
  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#1a0f08'),
        metalness: 0.25,
        roughness: 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        reflectivity: 0.9,
      }),
    []
  );

  const accentMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(accent),
        metalness: 0.9,
        roughness: 0.18,
        clearcoat: 1,
        emissive: new THREE.Color(accent),
        emissiveIntensity: 0.15,
      }),
    [accent]
  );

  const metalMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#d4d4d8'),
        metalness: 1,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
    []
  );

  const darkMetalMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#2a2a2e'),
        metalness: 0.95,
        roughness: 0.3,
      }),
    []
  );

  const fretMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#e4e4e7'),
        metalness: 1,
        roughness: 0.15,
      }),
    []
  );

  const stringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f4f4f5'),
        metalness: 1,
        roughness: 0.25,
      }),
    []
  );

  // A true double-cut electric guitar outline — the silhouette does most of the
  // visual work before the lighting and hardware details come into play.
  const guitarBodyShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.22, 1.42);
    shape.bezierCurveTo(-0.68, 1.56, -1.12, 1.34, -1.22, 0.95);
    shape.bezierCurveTo(-1.33, 0.55, -1.06, 0.22, -0.72, 0.06);
    shape.bezierCurveTo(-1.35, -0.16, -1.58, -0.74, -1.4, -1.26);
    shape.bezierCurveTo(-1.24, -1.78, -0.6, -1.98, -0.05, -1.64);
    shape.bezierCurveTo(0.46, -2.03, 1.16, -1.82, 1.38, -1.33);
    shape.bezierCurveTo(1.61, -0.82, 1.36, -0.24, 0.76, 0.05);
    shape.bezierCurveTo(0.98, 0.34, 1.16, 0.7, 1.14, 1.08);
    shape.bezierCurveTo(1.11, 1.45, 0.69, 1.62, 0.3, 1.38);
    shape.lineTo(0.2, 1.65);
    shape.lineTo(-0.16, 1.65);
    shape.closePath();
    return shape;
  }, []);

  const pickguardShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.38, 1.02);
    shape.bezierCurveTo(0.1, 1.15, 0.62, 0.94, 0.7, 0.58);
    shape.bezierCurveTo(0.8, 0.1, 0.55, -0.64, 0.04, -1.15);
    shape.bezierCurveTo(-0.18, -1.35, -0.56, -1.12, -0.5, -0.72);
    shape.lineTo(-0.34, 0.62);
    shape.closePath();
    return shape;
  }, []);

  const fretboardMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#100b08'),
        metalness: 0.08,
        roughness: 0.48,
        clearcoat: 0.25,
      }),
    []
  );

  const inlayMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f4f4f5'),
        metalness: 0.6,
        roughness: 0.3,
        transmission: 0.4,
        ior: 1.5,
      }),
    []
  );

  return (
    <group ref={root} dispose={null}>
      {/* Body — asymmetrical double-cut silhouette, carved with a deep bevel */}
      <group ref={body} position={[0, 0, 0]}>
        <mesh material={bodyMat} castShadow receiveShadow>
          <extrudeGeometry
            args={[
              guitarBodyShape,
              { depth: 0.3, bevelEnabled: true, bevelSegments: 10, bevelSize: 0.1, bevelThickness: 0.1, curveSegments: 48 },
            ]}
          />
        </mesh>

        {/* Contoured pickguard — intentionally follows the body, never a rectangle */}
        <mesh material={accentMat} position={[0, 0, 0.44]}>
          <shapeGeometry args={[pickguardShape]} />
        </mesh>

        {/* Pickups */}
        <group ref={pickup1} position={[-0.1, 0.4, 0.49]}>
          <mesh material={darkMetalMat}>
            <boxGeometry args={[0.9, 0.18, 0.06]} />
          </mesh>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} material={metalMat} position={[-0.35 + i * 0.14, 0, 0.04]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
            </mesh>
          ))}
        </group>

        <group ref={pickup2} position={[-0.1, -0.55, 0.49]}>
          <mesh material={darkMetalMat}>
            <boxGeometry args={[0.9, 0.18, 0.06]} />
          </mesh>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} material={metalMat} position={[-0.35 + i * 0.14, 0, 0.04]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
            </mesh>
          ))}
        </group>

        {/* Bridge */}
        <group ref={bridge} position={[-0.1, -1.0, 0.49]}>
          <mesh material={metalMat}>
            <boxGeometry args={[1.0, 0.16, 0.08]} />
          </mesh>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} material={darkMetalMat} position={[-0.4 + i * 0.16, 0, 0.06]}>
              <boxGeometry args={[0.08, 0.12, 0.08]} />
            </mesh>
          ))}
        </group>

        {/* Knobs */}
        {[
          { ref: knob1, x: 0.6, y: -0.4 },
          { ref: knob2, x: 0.85, y: -0.65 },
          { ref: knob3, x: 1.1, y: -0.9 },
        ].map((k, i) => (
          <mesh key={i} ref={k.ref} material={metalMat} position={[k.x, k.y, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 24]} />
          </mesh>
        ))}

        {/* Toggle switch */}
        <mesh material={metalMat} position={[0.68, 0.48, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
        </mesh>

        {/* Output jack */}
        <mesh material={metalMat} position={[1.03, 0.04, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.16, 16]} />
        </mesh>
      </group>

      {/* Neck */}
      <group ref={neck} position={[0, 2.0, 0.05]}>
        <mesh material={bodyMat} castShadow>
          <boxGeometry args={[0.45, 3.6, 0.18]} />
        </mesh>
        {/* Fretboard */}
        <mesh material={fretboardMat} position={[0, 0, 0.1]}>
          <boxGeometry args={[0.42, 3.6, 0.02]} />
        </mesh>
        {/* Frets */}
        {[...Array(22)].map((_, i) => (
          <mesh
            key={i}
            material={fretMat}
            position={[0, 1.7 - i * 0.16, 0.115]}
          >
            <boxGeometry args={[0.4, 0.012, 0.012]} />
          </mesh>
        ))}
        {/* Inlays */}
        {[3, 5, 7, 9, 12, 15, 17, 19].map((f, i) => (
          <mesh key={i} material={inlayMat} position={[0, 1.7 - f * 0.16, 0.12]}>
            <boxGeometry args={[0.08, 0.08, 0.005]} />
          </mesh>
        ))}
      </group>

      {/* Headstock */}
      <group ref={head} position={[0, 4.0, 0.05]}>
        <mesh material={bodyMat} castShadow>
          <boxGeometry args={[0.78, 0.95, 0.2]} />
        </mesh>
        {/* Tuning pegs */}
        {[...Array(6)].map((_, i) => (
          <group
            key={i}
            position={[i < 3 ? -0.43 : 0.43, -0.27 + (i % 3) * 0.27, 0.08]}
          >
            <mesh material={metalMat}>
              <cylinderGeometry args={[0.045, 0.045, 0.13, 12]} />
            </mesh>
            <mesh material={darkMetalMat} position={[i < 3 ? -0.07 : 0.07, 0, 0]}>
              <boxGeometry args={[0.11, 0.06, 0.05]} />
            </mesh>
          </group>
        ))}
        {/* Brand emblem */}
        <mesh material={accentMat} position={[0, 0, 0.1]}>
          <boxGeometry args={[0.25, 0.08, 0.005]} />
        </mesh>
      </group>

      {/* Strings */}
      <group ref={strings} position={[0, 1.45, 0.5]}>
        {[...Array(6)].map((_, i) => {
          const x = -0.18 + i * 0.07;
          return (
            <mesh key={i} material={stringMat} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 5.3, 6]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
