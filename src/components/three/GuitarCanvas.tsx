'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Sparkles } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import GuitarModel from './GuitarModel';

type Props = {
  className?: string;
  withEffects?: boolean;
};

export default function GuitarCanvas({ className = '', withEffects = true }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.2, 11.5], fov: 36 }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 8, 18]} />

        <ambientLight intensity={0.15} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.4}
          color="#ffd9a8"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 3, -3]} intensity={0.6} color="#5a8cff" />
        <pointLight position={[2, -2, 3]} intensity={0.8} color="#ff5a00" />
        <pointLight position={[-2, 2, 4]} intensity={0.5} color="#ffb347" />
        <spotLight
          position={[0, 6, 4]}
          angle={0.4}
          penumbra={1}
          intensity={2.2}
          color="#ff8a1c"
        />

        <Suspense fallback={null}>
          {withEffects ? (
            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
              <GuitarModel scrollY={scrollY} mouseX={mouse.x} mouseY={mouse.y} />
            </Float>
          ) : (
            <GuitarModel scrollY={scrollY} mouseX={mouse.x} mouseY={mouse.y} />
          )}

          {withEffects && (
            <>
              <Sparkles
                count={120}
                scale={[8, 8, 4]}
                size={2.5}
                speed={0.4}
                opacity={0.6}
                color="#ff8a1c"
              />
              <Environment preset="studio" />
            </>
          )}

          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={0.7}
            scale={10}
            blur={2.5}
            far={4}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
