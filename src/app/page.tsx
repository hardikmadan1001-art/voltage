import Hero from '@/components/sections/Hero';
import Craftsmanship from '@/components/sections/Craftsmanship';
import Materials from '@/components/sections/Materials';
import SoundVisualization from '@/components/sections/SoundVisualization';
import Performance from '@/components/sections/Performance';
import Collection from '@/components/sections/Collection';
import Builder from '@/components/sections/Builder';
import Artists from '@/components/sections/Artists';
import Manufacturing from '@/components/sections/Manufacturing';
import Manifesto from '@/components/sections/Manifesto';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Craftsmanship />
      <Materials />
      <SoundVisualization />
      <Performance />
      <Collection />
      <Builder />
      <Artists />
      <Manufacturing />
      <Footer />
    </>
  );
}
