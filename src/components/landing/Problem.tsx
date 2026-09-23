'use client'

// ========================================
// PROBLEM SECTION
// ========================================

import { motion } from 'framer-motion'
import { PhoneMissed, Clock, MoonStar } from 'lucide-react'
import { problems } from '@/lib/landing-config'
import { SectionHeading } from './ui/SectionHeading'

const icons = [PhoneMissed, Clock, MoonStar]
const iconColors = ['#38bdf8', '#ffb37a', '#6366f1']

export function Problem() {
  return (
    <section className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          title={
            <>
              Your customers don&apos;t wait.
              <br />
              Your competitors pick up.
            </>
          }
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => {
            const Icon = icons[i]
            const color = iconColors[i]
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-void-border bg-void-surface/60 p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: color }}
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-2xl"
                  style={{
                    background: `color-mix(in srgb, ${color} 16%, transparent)`,
                    color,
                  }}
                >
                  <Icon size={38} strokeWidth={1.75} aria-hidden />
                </motion.div>
                <h3 className="relative mt-7 text-2xl font-bold tracking-tight text-void-fg">
                  {p.title}
                </h3>
                <p className="relative mt-3 text-base leading-relaxed text-void-muted">
                  {p.body}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
