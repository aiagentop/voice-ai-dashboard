// ========================================
// TRUST BAR
// ========================================

import { trustBarIntegrations } from '@/lib/landing-config'

export function TrustBar() {
  return (
    <section className="border-y border-void-border py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-void-muted">
          Built for modern U.S. service businesses
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {trustBarIntegrations.map((name) => (
            <li
              key={name}
              className="text-sm font-medium text-void-muted/80 transition-colors hover:text-void-fg"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
