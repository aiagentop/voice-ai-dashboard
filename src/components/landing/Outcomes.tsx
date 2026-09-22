'use client'

// ========================================
// BUSINESS OUTCOMES
// ========================================
// Qualitative benefits, not measured statistics — see landing-config.

import { motion } from 'framer-motion'
import { outcomes } from '@/lib/landing-config'

export function Outcomes() {
  return (
    <section className="border-y border-void-border py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {outcomes.map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-void-accent to-void-accent-2 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                {o.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.14em] text-void-muted">
                {o.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
