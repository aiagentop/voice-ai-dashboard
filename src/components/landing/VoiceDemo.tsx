'use client'

// ========================================
// DEMO INSIDE A DEMO — core differentiator
// ========================================
// The conversation preview plays out live: bubbles appear one at a
// time in sequence, hold, then the whole thing resets and loops —
// so the section always shows something happening rather than a
// static screenshot of a chat.

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, PhoneCall, Sparkles, Check } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { Card } from './ui/Card'
import { Glow } from './ui/Glow'

const steps = [
  { icon: ClipboardList, title: 'You fill out the form' },
  { icon: PhoneCall, title: 'Our AI calls your phone within seconds' },
  { icon: Sparkles, title: 'The AI does a live demo in your industry' },
]

const conversation = [
  {
    who: 'agent' as const,
    text: '"Thank you for calling [Your Company]. This is Sofia. How can I help you today?"',
  },
  {
    who: 'caller' as const,
    text: '"I\'d like to book an appointment."',
  },
  {
    who: 'agent' as const,
    text: '"Absolutely. Let me check availability for you right now…"',
  },
  {
    who: 'caller' as const,
    text: '"Great — anytime Thursday afternoon works."',
  },
  {
    who: 'agent' as const,
    text: '"You\'re all set for Thursday at 2:00 PM. I just texted you a confirmation."',
  },
]

const statusSteps = [
  'Intent detected',
  'Customer qualified',
  'Appointment offered',
  'Booking confirmed',
]

const BUBBLE_INTERVAL_MS = 1500
const HOLD_MS = 2600

function ConversationPreview() {
  const [visible, setVisible] = useState(1)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      const id = setTimeout(() => setVisible(conversation.length), 0)
      return () => clearTimeout(id)
    }

    let timer: ReturnType<typeof setTimeout>

    function step(current: number) {
      if (current < conversation.length) {
        timer = setTimeout(() => {
          setVisible(current + 1)
          step(current + 1)
        }, BUBBLE_INTERVAL_MS)
      } else {
        timer = setTimeout(() => {
          setVisible(1)
          step(1)
        }, HOLD_MS)
      }
    }
    step(1)

    return () => clearTimeout(timer)
  }, [])

  const activeStatusCount = Math.max(0, visible - 1)

  return (
    <Card>
      <div className="min-h-[220px] space-y-4">
        <AnimatePresence initial={false}>
          {conversation.slice(0, visible).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={
                m.who === 'agent'
                  ? 'max-w-[85%] rounded-2xl rounded-tl-sm bg-void-surface-2 px-4 py-3 text-sm text-void-fg'
                  : 'ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-white/[0.06] px-4 py-3 text-sm text-void-fg'
              }
            >
              <span
                className={
                  m.who === 'agent'
                    ? 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-void-accent'
                    : 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-void-muted'
                }
              >
                {m.who === 'agent' ? 'Agentop AI' : 'Caller'}
              </span>
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="my-5 h-px bg-void-border" />

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {statusSteps.map((s, i) => {
          const active = i < activeStatusCount
          return (
            <li
              key={s}
              className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                active ? 'text-void-fg' : 'text-void-muted/50'
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-300 ${
                  active ? 'bg-void-accent/20 text-void-accent' : 'bg-white/5 text-void-muted/40'
                }`}
              >
                <Check size={10} />
              </span>
              {s}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export function VoiceDemo() {
  return (
    <section id="demo" className="relative z-10 overflow-hidden py-24 md:py-32">
      <Glow className="left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Agentop difference"
          title="Experience it before you buy it."
          subtitle="Fill out the form. Your AI calls you in seconds and does a live demo — acting as a receptionist for YOUR industry."
        />

        {/* 3-step flow */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-void-border bg-void-surface text-void-accent">
                <s.icon size={24} aria-hidden />
              </div>
              <p className="mt-4 text-sm font-medium text-void-fg">
                <span className="text-void-accent">Step {i + 1}.</span> {s.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Live conversation preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <ConversationPreview />
        </motion.div>
      </div>
    </section>
  )
}
