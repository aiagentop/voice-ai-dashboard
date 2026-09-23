// ========================================
// TRUST BAR
// ========================================

import { trustBarIntegrations } from '@/lib/landing-config'
import { Marquee } from './ui/Marquee'

export function TrustBar() {
  return (
    <section className="relative z-10 border-y border-void-border py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-void-muted">
          Built for modern U.S. service businesses
        </p>
      </div>
      <div className="mt-6">
        <Marquee durationS={24}>
          {trustBarIntegrations.map((name) => (
            <span
              key={name}
              className="mx-8 text-[28px] font-semibold text-void-muted/80 transition-colors hover:text-void-fg"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
