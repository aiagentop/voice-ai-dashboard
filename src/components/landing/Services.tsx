'use client'

// ========================================
// SERVICES SECTION
// ========================================

import { motion } from 'framer-motion'
import {
  Headset,
  Target,
  CalendarCheck,
  PhoneOutgoing,
  Moon,
  RefreshCw,
} from 'lucide-react'
import { services, cta } from '@/lib/landing-config'
import { SectionHeading } from './ui/SectionHeading'
import { ButtonLink } from './ui/Button'

const icons = [Headset, Target, CalendarCheck, PhoneOutgoing, Moon, RefreshCw]
const iconColors = ['#38bdf8', '#6366f1', '#34d399', '#ffb37a', '#38bdf8', '#6366f1']

export function Services() {
  return (
    <section id="solutions" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading eyebrow="Solutions" title="What Agentop builds for you" />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[i]
            const color = iconColors[i]
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative h-full overflow-hidden rounded-3xl border border-void-border bg-void-surface/60 p-7"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-15 blur-3xl transition-opacity duration-500 group-hover:opacity-35"
                  style={{ background: color }}
                />
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: `color-mix(in srgb, ${color} 16%, transparent)`,
                    color,
                  }}
                >
                  <Icon size={30} strokeWidth={1.75} aria-hidden />
                </motion.div>
                <h3 className="relative mt-6 text-xl font-bold tracking-tight text-void-fg">
                  {s.title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-void-muted">
                  {s.body}
                </p>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <ButtonLink href="#demo-form" size="lg">
            {cta.primary}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
