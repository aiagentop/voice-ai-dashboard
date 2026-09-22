'use client'

// ========================================
// NAVBAR
// ========================================
// Fixed, transparent → blurred-opaque on scroll. Desktop links +
// primary CTA; mobile gets a slide-down drawer.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { landingConfig, navLinks, cta } from '@/lib/landing-config'
import { Mark } from './ui/Mark'
import { ButtonLink } from './ui/Button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-void-border bg-void/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8"
      >
        <a href="#top" className="flex items-center gap-2.5">
          <Mark className="h-8 w-8" />
          <span className="text-[17px] font-bold tracking-tight text-void-fg">
            {landingConfig.name}
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-void-muted transition-colors hover:text-void-fg"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/login"
            className="text-sm text-void-muted transition-colors hover:text-void-fg"
          >
            Sign in
          </Link>
          <ButtonLink href="#demo-form" size="md">
            {cta.primary}
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-void-fg md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-void-border bg-void md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-base text-void-muted transition-colors hover:bg-white/[0.04] hover:text-void-fg"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base text-void-muted transition-colors hover:bg-white/[0.04] hover:text-void-fg"
              >
                Sign in
              </Link>
              <ButtonLink href="#demo-form" size="md" className="mt-3 w-full" onClick={() => setOpen(false)}>
                {cta.primary}
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
