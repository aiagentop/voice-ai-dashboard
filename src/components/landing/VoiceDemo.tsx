'use client'

// ========================================
// DEMO INSIDE A DEMO — core differentiator
// ========================================

import { motion } from 'framer-motion'
import { ClipboardList, PhoneCall, Sparkles, Check } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { Card } from './ui/Card'
import { Glow } from './ui/Glow'

const steps = [
  { icon: ClipboardList, title: 'You fill out the form' },
  { icon: PhoneCall, title: 'Our AI calls your phone within seconds' },
  { icon: Sparkles, title: 'The AI does a live demo in your industry' },
]

const statusSteps = [
  'Intent detected',
  'Customer qualified',
  'Appointment offered',
  'Booking confirmed',
]

export function VoiceDemo() {
  return (
    <section id="demo" className="relative overflow-hidden py-24 md:py-32">
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

        {/* Conversation preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <Card>
            <div className="space-y-4">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-void-surface-2 px-4 py-3 text-sm text-void-fg">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-void-accent">
                  Agentop AI
                </span>
                &ldquo;Thank you for calling [Your Company]. This is Sofia. How can I help
                you today?&rdquo;
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-white/[0.06] px-4 py-3 text-sm text-void-fg">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-void-muted">
                  Caller
                </span>
                &ldquo;I&apos;d like to book an appointment.&rdquo;
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-void-surface-2 px-4 py-3 text-sm text-void-fg">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-void-accent">
                  Agentop AI
                </span>
                &ldquo;Absolutely. Let me check availability for you right now…&rdquo;
              </div>
            </div>

            <div className="my-5 h-px bg-void-border" />

            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {statusSteps.map((s) => (
                <li key={s} className="flex items-center gap-2 text-xs text-void-fg">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-void-accent/20 text-void-accent">
                    <Check size={10} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
