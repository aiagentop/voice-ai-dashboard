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
import { Card } from './ui/Card'
import { ButtonLink } from './ui/Button'

const icons = [Headset, Target, CalendarCheck, PhoneOutgoing, Moon, RefreshCw]

export function Services() {
  return (
    <section id="solutions" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading eyebrow="Solutions" title="What Agentop builds for you" />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-void-accent/10 text-void-accent transition-colors group-hover:bg-void-accent/20">
                    <Icon size={20} aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-void-fg">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-void-muted">{s.body}</p>
                </Card>
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
