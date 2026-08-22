'use client';

import dynamic from 'next/dynamic';

const GuitarCanvas = dynamic(() => import('./GuitarCanvas'), {
  ssr: false,
  loading: () => null,
});

export default function GuitarCanvasLazy(props: { className?: string; withEffects?: boolean }) {
  return <GuitarCanvas {...props} />;
}
