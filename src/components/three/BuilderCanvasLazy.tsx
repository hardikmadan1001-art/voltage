'use client';

import dynamic from 'next/dynamic';
import { type GuitarMaterialConfig } from './GuitarModel';

const BuilderCanvas = dynamic(() => import('./BuilderCanvas'), {
  ssr: false,
  loading: () => null,
});

export default function BuilderCanvasLazy(props: { className?: string; materialConfig: GuitarMaterialConfig }) {
  return <BuilderCanvas {...props} />;
}
