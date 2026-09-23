'use client'

// ========================================
// STICKY BOTTOM BAR
// ========================================
// Appears once the visitor has scrolled past the hero, offering the
// two lowest-friction next steps. Hidden again near the very bottom
// of the page so it never fights with the footer.

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, PhoneCall } from 'lucide-react'
import { landingConfig, isPlaceholder } from '@/lib/landing-config'

export function StickyBar() {
  const [visible, setVisible] = useState(false)
  const hasBooking = !isPlaceholder(landingConfig.bookingUrl)

  useEffect(() => {
    function onScroll() {
      const scrolledPastHero = window.scrollY > window.innerHeight * 0.9
      const nearBottom =
        window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 260
      setVisible(scrolledPastHero && !nearBottom)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-void-border bg-void/85 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <p className="hidden text-sm text-void-muted sm:block">
              Ready to see it work for your business?
            </p>
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
              {hasBooking && (
                <a
                  href={landingConfig.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-void-border bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-void-fg transition-colors hover:bg-white/[0.08]"
                >
                  <CalendarClock size={16} aria-hidden />
                  Book a Strategy Call
                </a>
              )}
              <a
                href="#demo-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-void-accent to-void-accent-2 px-5 py-2.5 text-sm font-semibold text-void shadow-[0_8px_24px_-8px_rgba(56,189,248,0.5)] transition-transform hover:scale-[1.02]"
              >
                <PhoneCall size={16} aria-hidden />
                Try the Agent
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
