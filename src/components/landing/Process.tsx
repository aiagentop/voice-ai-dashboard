'use client'

// ========================================
// HOW IT WORKS
// ========================================

import { motion } from 'framer-motion'
import { process } from '@/lib/landing-config'
import { SectionHeading } from './ui/SectionHeading'

export function Process() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="From setup to fully automated in days"
        />

        <div className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* connecting line — desktop only */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px bg-void-border md:block"
          />

          {process.map((p, i) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex gap-4 md:flex-col md:gap-0"
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-void-border bg-void text-sm font-bold text-void-accent md:mb-5">
                {p.step}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-void-fg">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-void-muted">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
