'use client'

// ========================================
// INTEGRATIONS
// ========================================

import { motion } from 'framer-motion'
import { integrations } from '@/lib/landing-config'
import { SectionHeading } from './ui/SectionHeading'

export function Integrations() {
  return (
    <section id="integrations" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading eyebrow="Integrations" title="Works with your stack" />

        <div className="mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-3">
          {integrations.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="rounded-full border border-void-border bg-void-surface px-5 py-2.5 text-sm font-medium text-void-fg"
            >
              {name}
            </motion.span>
          ))}
        </div>

        <p className="mt-8 text-center text-xs uppercase tracking-[0.16em] text-void-muted">
          Available integrations — more on request.
        </p>
      </div>
    </section>
  )
}
