'use client'

// ========================================
// HERO SECTION
// ========================================
// Headline + supporting copy + CTAs, plus a floating "live call" UI
// card that sells the product in one glance: a looping, Apple-style
// simulated call — incoming call, answer, waveform, intent detected,
// appointment booked, call ends — then it loops. Motion is deliberately
// restrained everywhere else on the page, but this is the highest
// animation-priority element on the whole site.

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Phone, PhoneOff, Check, MessageSquare } from 'lucide-react'
import { landingConfig, cta } from '@/lib/landing-config'
import { ButtonLink } from './ui/Button'
import { Glow } from './ui/Glow'

// The galaxy is a whole-site background (see GalaxyBackgroundLoader in
// page.tsx), not scoped to the Hero — this section just adds a couple
// of local accent glows on top of it.

const waveformBars = [6, 14, 22, 12, 26, 10, 18, 24, 8, 16, 20, 12, 6]

const PHASES = [
  { key: 'incoming', duration: 2200 },
  { key: 'answer', duration: 2600 },
  { key: 'intent', duration: 2600 },
  { key: 'booked', duration: 2600 },
  { key: 'ended', duration: 1800 },
] as const

type PhaseKey = (typeof PHASES)[number]['key']

function usePhaseCycle() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % PHASES.length)
    }, PHASES[index].duration)
    return () => clearTimeout(timer)
  }, [index])

  return PHASES[index].key as PhaseKey
}

function StatusBar({ phase }: { phase: PhaseKey }) {
  const label =
    phase === 'incoming'
      ? 'Incoming call'
      : phase === 'ended'
        ? 'Call ended'
        : 'Call in progress'
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {phase !== 'ended' && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          )}
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
              phase === 'ended' ? 'bg-void-muted' : 'bg-emerald-400'
            }`}
          />
        </span>
        <span className="text-sm font-semibold text-void-fg">
          {landingConfig.name} AI — {phase === 'ended' ? 'Wrapping up' : 'Online'}
        </span>
      </div>
      <span className="text-[11px] text-void-muted">{label}</span>
    </div>
  )
}

function IncomingPhase() {
  return (
    <motion.div
      key="incoming"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-5 py-6"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-void-accent/15 text-void-accent"
      >
        <Phone size={28} aria-hidden />
      </motion.div>
      <div className="text-center">
        <p className="text-base font-semibold text-void-fg">Unknown Number</p>
        <p className="mt-1 text-xs text-void-muted">Incoming call…</p>
      </div>
    </motion.div>
  )
}

function AnswerPhase() {
  return (
    <motion.div
      key="answer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-6"
    >
      <p className="text-center text-xs font-medium uppercase tracking-wide text-void-accent">
        Agent answered
      </p>
      <div className="mt-5 flex h-12 items-end justify-center gap-1" aria-hidden>
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
      <p className="mt-4 text-center text-sm text-void-muted">
        &ldquo;Thanks for calling — how can I help?&rdquo;
      </p>
    </motion.div>
  )
}

function IntentPhase() {
  const items = ['Intent detected', 'Customer qualified']
  return (
    <motion.div
      key="intent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-6"
    >
      <ul className="space-y-3">
        {items.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.5 }}
            className="flex items-center gap-3 text-sm text-void-fg"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.5, ease: 'backOut' }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-void-accent/20 text-void-accent"
            >
              <Check size={13} />
            </motion.span>
            {s}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

function BookedPhase() {
  return (
    <motion.div
      key="booked"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-3 text-sm text-void-fg"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-void-accent/20 text-void-accent">
          <Check size={13} />
        </span>
        Appointment booked
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
        className="mt-4 flex items-start gap-2.5 rounded-xl border border-void-border bg-white/[0.05] p-3"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
          <MessageSquare size={14} />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-void-muted">
            SMS confirmation sent
          </p>
          <p className="mt-0.5 text-sm text-void-fg">
            You&apos;re booked for Thursday at 2:00 PM. See you then!
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function EndedPhase() {
  return (
    <motion.div
      key="ended"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-3 py-6"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-void-surface-2 text-void-muted">
        <PhoneOff size={22} aria-hidden />
      </div>
      <p className="text-sm font-medium text-void-fg">Call ended · 0:42</p>
    </motion.div>
  )
}

function CallCard() {
  const phase = usePhaseCycle()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[28px] border border-white/10 bg-void-surface/80 p-6 shadow-[0_30px_80px_-20px_rgba(56,189,248,0.3)] backdrop-blur-2xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent"
      />
      <StatusBar phase={phase} />
      <div className="my-4 h-px bg-void-border" />

      <div className="min-h-[176px]">
        <AnimatePresence mode="wait">
          {phase === 'incoming' && <IncomingPhase />}
          {phase === 'answer' && <AnswerPhase />}
          {phase === 'intent' && <IntentPhase />}
          {phase === 'booked' && <BookedPhase />}
          {phase === 'ended' && <EndedPhase />}
        </AnimatePresence>
      </div>

      <div className="mt-4 h-px bg-void-border" />
      <div className="mt-4 flex items-center justify-between text-[11px] text-void-muted">
        <span>{phase === 'ended' ? '0:42 · Ended' : 'Live'}</span>
        <span className="flex gap-1" aria-hidden>
          {PHASES.map((p, i) => (
            <span
              key={p.key}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                PHASES.findIndex((x) => x.key === phase) === i
                  ? 'bg-void-accent'
                  : 'bg-void-accent/25'
              }`}
            />
          ))}
        </span>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  // Subtle parallax depth: the copy drifts up slightly slower than the
  // call card, which drifts up a bit faster — as the hero scrolls out.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const fade = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32"
    >
      <Glow className="-left-40 top-10 h-[420px] w-[420px]" />
      <Glow className="-right-40 top-40 h-[420px] w-[420px]" color="var(--color-void-accent-2)" />

      <motion.div
        style={{ opacity: fade }}
        className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8"
      >
        <motion.div
          style={{ y: copyY }}
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

        <motion.div style={{ y: cardY }}>
          <CallCard />
        </motion.div>
      </motion.div>
    </section>
  )
}
