'use client'

// ========================================
// HERO SECTION
// ========================================
// Headline + supporting copy + CTAs, plus a floating "live call" UI
// card that sells the product in one glance. Motion is deliberately
// restrained — this is the highest-animation-priority element on the
// page, but it should still read as calm and premium.

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Check, Phone } from 'lucide-react'
import { landingConfig, cta } from '@/lib/landing-config'
import { ButtonLink } from './ui/Button'
import { Glow } from './ui/Glow'

// Heavy (three.js) and browser-only — never part of the initial bundle,
// never server-rendered. Hero's text/CTAs above render immediately
// regardless of how long this takes to load.
const GalaxyBackground = dynamic(
  () => import('./motion/GalaxyBackground').then((m) => m.GalaxyBackground),
  { ssr: false }
)

const waveformBars = [6, 14, 22, 12, 26, 10, 18, 24, 8, 16, 20, 12, 6]

const statusSteps = ['Intent detected', 'Customer qualified', 'Appointment booked']

function CallCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-sm rounded-2xl border border-void-border bg-void-surface/80 p-5 shadow-[0_30px_80px_-20px_rgba(56,189,248,0.25)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-sm font-semibold text-void-fg">
            {landingConfig.name} AI — Online
          </span>
        </div>
      </div>

      <div className="my-4 h-px bg-void-border" />

      <div className="flex items-center gap-2 text-xs text-void-muted">
        <Phone size={14} />
        Incoming call · Unknown Number
      </div>

      <div className="mt-4 flex h-10 items-end gap-1" aria-hidden>
        {waveformBars.map((h, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-void-accent/70"
            animate={{ height: [h, h * 1.8, h * 0.6, h] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: i * 0.06,
              ease: 'easeInOut',
            }}
            style={{ height: h }}
          />
        ))}
      </div>

      <div className="my-4 h-px bg-void-border" />

      <ul className="space-y-2.5">
        {statusSteps.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1 + i * 0.5 }}
            className="flex items-center gap-2 text-sm text-void-fg"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-void-accent/20 text-void-accent">
              <Check size={11} />
            </span>
            {s}
          </motion.li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between text-[11px] text-void-muted">
        <span>0:42</span>
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-void-accent/60" />
          ))}
        </span>
      </div>
    </motion.div>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="absolute inset-0">
        <GalaxyBackground />
      </div>
      {/* Left-side scrim so the headline stays readable over the galaxy */}
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent md:from-void md:via-void/40 md:to-transparent" />
      <Glow className="-left-40 top-10 h-[420px] w-[420px]" />
      <Glow className="-right-40 top-40 h-[420px] w-[420px]" color="var(--color-void-accent-2)" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-balance font-bold uppercase leading-[0.95] tracking-tight text-void-fg [font-size:clamp(2.8rem,14vw,4.5rem)] md:[font-size:clamp(3.5rem,8vw,7rem)]">
            Your AI employee,
            <br />
            <span className="bg-gradient-to-r from-void-accent to-void-accent-2 bg-clip-text text-transparent">
              on every call.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-void-muted">
            Deploy intelligent voice agents that answer calls, qualify leads,
            book appointments, and handle repetitive customer conversations —
            automatically, 24 hours a day.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="#demo-form" size="lg">
              {cta.primary}
            </ButtonLink>
            <ButtonLink href="#demo" variant="secondary" size="lg">
              {cta.secondary}
            </ButtonLink>
          </div>
        </motion.div>

        <CallCard />
      </div>
    </section>
  )
}
