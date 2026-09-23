'use client'

// ========================================
// AGENT LIBRARY SECTION
// ========================================

import dynamic from 'next/dynamic'
import { SectionHeading } from './ui/SectionHeading'

const AgentLibrary = dynamic(
  () => import('./motion/AgentLibrary').then((m) => m.AgentLibrary),
  { ssr: false }
)

export function AgentLibrarySection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Agent library"
          title="Every capability, one system"
          subtitle="Drag to look around. It cycles through a few views on its own — hover or drag to pause."
        />
        <div className="mt-12">
          <AgentLibrary />
        </div>
      </div>
    </section>
  )
}
