import type { Metadata } from 'next'
import { landingConfig } from '@/lib/landing-config'
import { StarFieldLoader } from '@/components/landing/motion/StarFieldLoader'
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { TrustBar } from '@/components/landing/TrustBar'
import { Problem } from '@/components/landing/Problem'
import { Services } from '@/components/landing/Services'
import { VoiceDemo } from '@/components/landing/VoiceDemo'
import { Outcomes } from '@/components/landing/Outcomes'
import { Process } from '@/components/landing/Process'
import { UseCases } from '@/components/landing/UseCases'
import { Integrations } from '@/components/landing/Integrations'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { DemoForm } from '@/components/landing/DemoForm'
import { SectionHeading } from '@/components/landing/ui/SectionHeading'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Agentop — AI Voice Agents That Work 24/7',
  description:
    'Agentop builds intelligent AI voice agents for U.S. service businesses. Automate calls, qualify leads, book appointments, and never miss a customer again.',
  alternates: { canonical: landingConfig.url },
  openGraph: {
    title: 'Agentop — AI Voice Agents That Work 24/7',
    description:
      'Agentop builds intelligent AI voice agents for U.S. service businesses. Automate calls, qualify leads, book appointments, and never miss a customer again.',
    url: landingConfig.url,
    siteName: 'Agentop',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentop — AI Voice Agents That Work 24/7',
    description:
      'Agentop builds intelligent AI voice agents for U.S. service businesses. Automate calls, qualify leads, book appointments, and never miss a customer again.',
  },
}

export default function Home() {
  return (
    <div className="agentop-landing relative min-h-screen">
      <StarFieldLoader />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Services />
        <VoiceDemo />
        <Outcomes />
        <Process />
        <UseCases />
        <Integrations />
        <Pricing />
        <FAQ />

        {/* ======================================== */}
        {/* LEAD CAPTURE — primary conversion section */}
        {/* ======================================== */}
        <section id="demo-form" className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="Get started"
              title="Have my AI call me now."
              subtitle="Fill in your details. Your AI agent calls you within seconds and does a live demo — acting as a receptionist for your business."
            />
            <div className="mt-12">
              <DemoForm />
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  )
}
