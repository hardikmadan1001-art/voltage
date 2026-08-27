'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import GuitarModel, { type GuitarMaterialConfig } from './GuitarModel';

type Props = {
  className?: string;
  materialConfig: GuitarMaterialConfig;
};

type Pointer = { x: number; y: number };

function BuilderStudio({ materialConfig }: { materialConfig: GuitarMaterialConfig }) {
  const keyLight = useRef<THREE.SpotLight>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (keyLight.current) {
      keyLight.current.position.x = 3.6 + Math.sin(time * 0.32) * 1.15;
      keyLight.current.position.y = 6;
      keyLight.current.intensity = 120 + Math.sin(time * 0.7) * 16;
    }
  });

  const scrollY = useRef(0);
  const hovering = useRef(false);

  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight ref={keyLight} position={[4, 6, 5]} angle={0.5} penumbra={0.9} intensity={120} color="#ffd8b0" />
      <spotLight position={[-5, 2, 2]} angle={0.65} penumbra={1} intensity={60} color="#4d6fff" />
      <pointLight position={[0, -1.5, 4]} intensity={20} distance={9} color="#ff5a00" />
      <pointLight position={[-2, 3, 3]} intensity={14} distance={8} color="#ffbc75" />

      <GuitarModel
        scrollYRef={scrollY}
        pointerRef={pointer}
        hoveringRef={hovering}
        materialConfig={materialConfig}
      />

      <Environment preset="studio" environmentIntensity={0.85} />
      <ContactShadows position={[0, -2.25, 0]} opacity={0.72} scale={9} blur={2.6} far={4.5} color="#000000" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.8}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={4}
        maxDistance={16}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function BuilderCanvas({ className = '', materialConfig }: Props) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMappingExposure: 1.2 }}
        camera={{ position: [0, 1.05, 10], fov: 34 }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 8, 18]} />
        <Suspense fallback={null}>
          <BuilderStudio materialConfig={materialConfig} />
        </Suspense>
      </Canvas>
    </div>
  );
}
