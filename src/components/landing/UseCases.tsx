'use client'

// ========================================
// USE CASES BY INDUSTRY
// ========================================

import { motion } from 'framer-motion'
import {
  Stethoscope,
  Home,
  Scale,
  Wrench,
  Car,
  UtensilsCrossed,
} from 'lucide-react'
import { useCases } from '@/lib/landing-config'
import { SectionHeading } from './ui/SectionHeading'
import { Card } from './ui/Card'

const icons = [Stethoscope, Home, Scale, Wrench, Car, UtensilsCrossed]

export function UseCases() {
  return (
    <section id="use-cases" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading eyebrow="Use cases" title="Built for your industry" />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {useCases.map((u, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={u.industry}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.12 }}
              >
                <Card className="h-full">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-void-accent/10 text-void-accent">
                      <Icon size={20} aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold text-void-fg">{u.industry}</h3>
                  </div>

                  <div className="mt-5 space-y-3.5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-red-300/80">
                        The pain point
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-void-muted">{u.painPoint}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-void-accent">
                        How Agentop solves it
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-void-muted">{u.solution}</p>
                    </div>
                    <div className="rounded-xl border border-void-border bg-white/[0.03] p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400/80">
                        Illustrative example
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-void-fg">{u.example}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
