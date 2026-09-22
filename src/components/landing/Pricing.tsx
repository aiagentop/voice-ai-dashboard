// ========================================
// PRICING — custom, no tiers
// ========================================

import { cta } from '@/lib/landing-config'
import { ButtonLink } from './ui/Button'
import { SectionHeading } from './ui/SectionHeading'

export function Pricing() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Custom AI solutions"
          subtitle="Every business has a different call flow. We'll design the right setup for your operation — and have it live within days."
        />
        <div className="mt-9 flex justify-center">
          <ButtonLink href="#demo-form" size="lg">
            {cta.tertiary}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
