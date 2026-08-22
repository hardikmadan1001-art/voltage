import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import Loader from '@/components/Loader';
import Navigation from '@/components/Navigation';
import GrainOverlay from '@/components/GrainOverlay';
import Vignette from '@/components/Vignette';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'AXIOM — Engineered for Legends',
  description:
    'AXIOM is the world\'s most exclusive electric guitar. Handcrafted from aerospace-grade materials. Built with obsessive precision. Engineered for legends.',
  keywords: [
    'luxury electric guitar',
    'premium guitar',
    'custom guitar',
    'handcrafted guitar',
    'AXIOM',
  ],
  openGraph: {
    title: 'AXIOM — Engineered for Legends',
    description: 'The future of electric guitars. Handcrafted in California.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="bg-ink-900 text-zinc-100 antialiased">
        <Loader />
        <SmoothScroll>
          <CustomCursor />
          <GrainOverlay />
          <Vignette />
          <Navigation />
          <main className="relative">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
