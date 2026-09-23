// ========================================
// INTEGRATIONS
// ========================================

import { integrations } from '@/lib/landing-config'
import { SectionHeading } from './ui/SectionHeading'
import { Marquee } from './ui/Marquee'

export function Integrations() {
  return (
    <section id="integrations" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading eyebrow="Integrations" title="Works with your stack" />
      </div>

      <div className="mt-14">
        <Marquee durationS={30}>
          {integrations.map((name) => (
            <span
              key={name}
              className="mx-4 rounded-full border border-void-border bg-void-surface px-10 py-5 text-xl font-medium text-void-fg"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>

      <p className="mt-8 text-center text-xs uppercase tracking-[0.16em] text-void-muted">
        Available integrations — more on request.
      </p>
    </section>
  )
}
