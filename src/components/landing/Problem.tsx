'use client'

// ========================================
// PROBLEM SECTION
// ========================================

import { motion } from 'framer-motion'
import { PhoneMissed, Clock, MoonStar } from 'lucide-react'
import { problems } from '@/lib/landing-config'
import { SectionHeading } from './ui/SectionHeading'
import { Card } from './ui/Card'

const icons = [PhoneMissed, Clock, MoonStar]

export function Problem() {
  return (
    <section className="py-24 md:py-32">
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
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-void-accent/10 text-void-accent">
                    <Icon size={20} aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-void-fg">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-void-muted">{p.body}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
