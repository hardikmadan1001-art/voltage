'use client';

import { useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

type PartId = 'body' | 'neck' | 'pickups' | 'bridge' | 'electronics';

const parts: { id: PartId; code: string; label: string; title: string; description: string; specs: string[] }[] = [
  { id: 'body', code: '01', label: 'Body', title: 'Forged carbon body', description: 'A compression-molded carbon shell is paired with a hand-selected figured maple top for immediate attack and a controlled bloom.', specs: ['Carbon composite', 'Figured maple', '0.002 mm tolerance'] },
  { id: 'neck', code: '02', label: 'Neck', title: 'Roasted maple neck', description: 'Quarter-sawn maple is heat-treated, then hand-finished into a profile that disappears under the thumb.', specs: ['Roasted 96 hours', 'Ebony board', 'Graphite reinforced'] },
  { id: 'pickups', code: '03', label: 'Pickups', title: 'Hand-wound voice', description: 'Each pair is wound, potted and matched as a single set for an articulate response at every gain level.', specs: ['A2 magnets', '42 AWG wire', 'Hand matched'] },
  { id: 'bridge', code: '04', label: 'Bridge', title: 'Titanium bridge', description: 'A grade-five titanium bridge locks in tuning stability while keeping the instrument light and resonant.', specs: ['Grade-5 titanium', 'Mirror polish', '±0.05 mm spacing'] },
  { id: 'electronics', code: '05', label: 'Electronics', title: 'Discrete signal path', description: 'A silent, serviceable circuit with a true passive bypass leaves every decision in the player’s hands.', specs: ['Class-A circuit', 'Custom capacitors', 'True bypass'] },
];

export default function Craftsmanship() {
  const [active, setActive] = useState<PartId>('body');
  const current = parts.find((part) => part.id === active) ?? parts[0];

  return (
    <section id="craftsmanship" data-section="craft" className="relative overflow-hidden bg-ink-900 py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,111,22,.11),transparent_45%)]" />
      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.38em] text-amber-glow"><span>01 / Component explorer</span><i className="h-px flex-1 bg-gradient-to-r from-amber-glow/50 to-transparent" /></div>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><h2 className="font-display text-[clamp(3rem,7vw,7rem)] font-light leading-[.86] tracking-[-.05em]"><span className="chrome-text">Touch the</span><br /><em className="text-zinc-100">instrument.</em></h2></div>
          <p className="max-w-md text-base leading-7 text-zinc-400 lg:col-span-4 lg:pb-2">Hover a component to illuminate its place in the instrument. Every part has a job; together, they become a voice.</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(180px,1fr)_minmax(400px,1.8fr)_minmax(180px,1fr)] lg:items-center">
          <div className="grid gap-3 order-2 lg:order-1">
            {parts.filter((part) => ['body', 'pickups', 'electronics'].includes(part.id)).map((part) => <PartButton key={part.id} part={part} active={active === part.id} onActivate={setActive} align="left" />)}
          </div>

          <div className="order-1 lg:order-2 rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_50%_42%,#221109_0%,#0c0b0b_42%,#070707_78%)] p-4 shadow-[inset_0_0_80px_rgba(255,138,28,.06)] md:p-8">
            <InteractiveGuitar active={active} onActivate={setActive} />
          </div>

          <div className="grid gap-3 order-3">
            {parts.filter((part) => ['neck', 'bridge'].includes(part.id)).map((part) => <PartButton key={part.id} part={part} active={active === part.id} onActivate={setActive} align="right" />)}
          </div>
        </div>

        <motion.div key={current.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .32 }} className="mt-7 grid gap-6 border-t border-white/10 pt-7 md:grid-cols-[1.3fr_2fr_2fr] md:items-start">
          <div><p className="font-mono text-[10px] uppercase tracking-[.35em] text-amber-glow">{current.code} / {current.label}</p><h3 className="mt-2 font-display text-3xl text-zinc-100">{current.title}</h3></div>
          <p className="max-w-xl leading-7 text-zinc-400">{current.description}</p>
          <div className="flex flex-wrap gap-2">{current.specs.map((spec) => <span key={spec} className="rounded-full border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[.18em] text-zinc-300">{spec}</span>)}</div>
        </motion.div>
      </div>
    </section>
  );
}

function PartButton({ part, active, onActivate, align }: { part: typeof parts[number]; active: boolean; onActivate: (id: PartId) => void; align: 'left' | 'right' }) {
  return <button onMouseEnter={() => onActivate(part.id)} onFocus={() => onActivate(part.id)} onClick={() => onActivate(part.id)} className={`group relative rounded-2xl border p-5 ${align === 'left' ? 'text-left' : 'text-right'} transition-all duration-300 ${active ? 'border-amber-glow/70 bg-amber-glow/[.08] shadow-[0_0_28px_rgba(255,138,28,.12)]' : 'border-white/10 bg-black/20 hover:border-white/30'}`}>
    <span className="font-mono text-[9px] uppercase tracking-[.35em] text-amber-glow">{part.code}</span><span className="mt-3 block font-mono text-[9px] uppercase tracking-[.28em] text-zinc-500">Component</span><span className="mt-1 block font-display text-2xl text-zinc-100">{part.label}</span>
  </button>;
}

function InteractiveGuitar({ active, onActivate }: { active: PartId; onActivate: (id: PartId) => void }) {
  const tone = (id: PartId) => active === id ? '#ff8a1c' : '#5f544f';
  const glow = (id: PartId) => active === id ? 'url(#part-glow)' : 'none';
  const choose = (id: PartId) => ({ onMouseEnter: () => onActivate(id), onClick: () => onActivate(id), role: 'button', tabIndex: 0, onKeyDown: (event: KeyboardEvent) => event.key === 'Enter' && onActivate(id) });
  return <svg viewBox="0 0 560 760" className="mx-auto block w-full max-w-[560px]" aria-label="Interactive guitar component explorer">
    <defs><filter id="part-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="guitar-body" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#4a2614"/><stop offset=".45" stopColor="#181312"/><stop offset="1" stopColor="#070707"/></linearGradient></defs>
    <g {...choose('neck')}><rect x="240" y="60" width="80" height="305" rx="12" fill="#201811" stroke={tone('neck')} strokeWidth={active === 'neck' ? 4 : 2} filter={glow('neck')} />{Array.from({length: 17}).map((_,i)=><line key={i} x1="249" x2="311" y1={82+i*15} y2={82+i*15} stroke="#d9d9d9" strokeOpacity=".55"/>)}<rect x="230" y="20" width="100" height="56" rx="14" fill="#15100d" stroke={tone('neck')} strokeWidth="2" /></g>
    <g {...choose('body')}><path d="M250 344 C180 320 112 360 108 434 C104 492 145 528 190 540 C116 574 115 655 165 696 C208 731 256 710 280 681 C314 720 373 728 414 688 C461 642 454 571 379 539 C438 522 465 464 442 409 C418 352 351 326 312 350 L312 331 L250 331Z" fill="url(#guitar-body)" stroke={tone('body')} strokeWidth={active === 'body' ? 5 : 2} filter={glow('body')} /></g>
    <g {...choose('pickups')} filter={glow('pickups')}>{[430, 493].map((y)=><g key={y}><rect x="205" y={y} width="150" height="38" rx="7" fill="#0a0a0b" stroke={tone('pickups')} strokeWidth={active === 'pickups' ? 4 : 2}/>{Array.from({length:6}).map((_,i)=><circle key={i} cx={226+i*25} cy={y+19} r="4.5" fill="#d4d4d8"/>)}</g>)}</g>
    <g {...choose('bridge')} filter={glow('bridge')}><rect x="193" y="570" width="174" height="48" rx="7" fill="#161619" stroke={tone('bridge')} strokeWidth={active === 'bridge' ? 4 : 2}/>{Array.from({length:6}).map((_,i)=><rect key={i} x={210+i*25} y="582" width="14" height="24" rx="2" fill="#dedee0"/>)}</g>
    <g {...choose('electronics')} filter={glow('electronics')}>{[[370,510],[395,540],[412,573]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="17" fill="#c8c8ca" stroke={tone('electronics')} strokeWidth={active === 'electronics' ? 4 : 1}/>)}</g>
    <text x="280" y="742" textAnchor="middle" fill="#ff8a1c" fontFamily="monospace" fontSize="10" letterSpacing="5">HOVER TO INSPECT</text>
  </svg>;
}
