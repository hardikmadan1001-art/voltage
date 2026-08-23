'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, OrbitControls, Sparkles } from '@react-three/drei';
import { Suspense, useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import GuitarModel from './GuitarModel';

type Props = {
  className?: string;
  withEffects?: boolean;
};

type Pointer = { x: number; y: number };

function Studio({ pointer, scrollY, withEffects }: {
  pointer: MutableRefObject<Pointer>;
  scrollY: MutableRefObject<number>;
  withEffects: boolean;
}) {
  const keyLight = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (keyLight.current) {
      keyLight.current.position.x = 3.6 + Math.sin(time * 0.32) * 1.15;
      keyLight.current.intensity = 110 + Math.sin(time * 0.7) * 16;
    }
  });

  return (
    <>
      <ambientLight intensity={0.16} />
      <spotLight ref={keyLight} position={[4, 6, 5]} angle={0.5} penumbra={0.9} intensity={110} color="#ffd8b0" />
      <spotLight position={[-5, 2, 2]} angle={0.65} penumbra={1} intensity={60} color="#4d6fff" />
      <pointLight position={[0, -1.5, 4]} intensity={20} distance={9} color="#ff5a00" />
      <pointLight position={[-2, 3, 3]} intensity={14} distance={8} color="#ffbc75" />
      <Float speed={1.05} rotationIntensity={0.13} floatIntensity={0.32} floatingRange={[-0.08, 0.12]}>
        <GuitarModel scrollYRef={scrollY} pointerRef={pointer} />
      </Float>
      {withEffects && (
        <>
          <Sparkles count={72} scale={[8, 8, 3]} size={1.8} speed={0.22} opacity={0.4} color="#ffaf65" />
          <Environment preset="studio" environmentIntensity={0.75} />
        </>
      )}
      <ContactShadows position={[0, -2.25, 0]} opacity={0.72} scale={9} blur={2.6} far={4.5} color="#000000" />
      <OrbitControls autoRotate autoRotateSpeed={0.42} enableDamping dampingFactor={0.08} enablePan={false} enableZoom={false} minPolarAngle={Math.PI * 0.38} maxPolarAngle={Math.PI * 0.62} minAzimuthAngle={-0.7} maxAzimuthAngle={0.7} rotateSpeed={0.45} />
    </>
  );
}

export default function GuitarCanvas({ className = '', withEffects = true }: Props) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const scrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMappingExposure: 1.15 }}
        camera={{ position: [0, 1.05, 11.8], fov: 34 }}
        onPointerMove={(event) => {
          pointer.current = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -((event.clientY / window.innerHeight) * 2 - 1),
          };
        }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 8, 18]} />
        <Suspense fallback={null}>
          <Studio pointer={pointer} scrollY={scrollY} withEffects={withEffects} />
        </Suspense>
      </Canvas>
    </div>
  );
}
