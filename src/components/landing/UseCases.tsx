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
    <section id="use-cases" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading eyebrow="Use cases" title="Built for your industry" />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={u.industry}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-void-accent/10 text-void-accent">
                    <Icon size={20} aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-void-fg">{u.industry}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-void-muted">{u.body}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
