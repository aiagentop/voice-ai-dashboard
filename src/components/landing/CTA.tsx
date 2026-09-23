// ========================================
// FINAL CTA
// ========================================

import { cta, landingConfig, isPlaceholder } from '@/lib/landing-config'
import { ButtonLink } from './ui/Button'
import { Glow } from './ui/Glow'
import { CalendlyEmbed } from './CalendlyEmbed'

export function CTA() {
  const hasBooking = !isPlaceholder(landingConfig.bookingUrl)

  return (
    <section className="relative overflow-hidden border-t border-void-border py-24 md:py-32">
      <Glow className="left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2" />

      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-balance text-3xl font-bold uppercase tracking-tight text-void-fg sm:text-4xl md:text-5xl">
          Ready to put your calls on autopilot?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-void-muted sm:text-lg">
          Let AI handle the conversations that keep your team busy — and your
          leads waiting.
        </p>
        <div className="mt-9 flex justify-center">
          <ButtonLink href="#demo-form" size="lg">
            {cta.primary}
          </ButtonLink>
        </div>

        {hasBooking && (
          <div className="mt-14 text-left">
            <p className="mb-4 text-center text-[11px] uppercase tracking-[0.2em] text-void-muted">
              Or {cta.booking.toLowerCase()}
            </p>
            <CalendlyEmbed />
          </div>
        )}
      </div>
    </section>
  )
}
