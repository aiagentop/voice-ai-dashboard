'use client'

// ========================================
// HOW IT WORKS — animated timeline
// ========================================

import { motion } from 'framer-motion'
import { Search, Hammer, Plug, Rocket } from 'lucide-react'
import { process } from '@/lib/landing-config'
import { SectionHeading } from './ui/SectionHeading'

const icons = [Search, Hammer, Plug, Rocket]
const colors = ['#38bdf8', '#6366f1', '#ffb37a', '#34d399']

export function Process() {
  return (
    <section id="how-it-works" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="From setup to fully automated in days"
        />

        <div className="relative mt-20">
          {/* connecting line — desktop only, fills in as it scrolls into view */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-9 hidden h-px bg-void-border md:block"
          />
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            style={{ transformOrigin: 'left' }}
            className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-void-accent via-void-accent-2 to-emerald-400 md:block"
          />

          <div className="grid gap-10 md:grid-cols-4 md:gap-6">
            {process.map((p, i) => {
              const Icon = icons[i]
              const color = colors[i]
              return (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex gap-4 md:flex-col md:gap-0"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.1, ease: 'backOut' }}
                    className="relative z-10 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border md:mb-6"
                    style={{
                      borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
                      background: `color-mix(in srgb, ${color} 14%, var(--color-void))`,
                      color,
                    }}
                  >
                    <Icon size={30} strokeWidth={1.75} aria-hidden />
                    <span
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-void-border bg-void text-[11px] font-bold text-void-fg"
                    >
                      {p.step}
                    </span>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-void-fg">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-void-muted">{p.body}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
