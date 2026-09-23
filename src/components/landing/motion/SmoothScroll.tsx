'use client'

// ========================================
// SMOOTH SCROLL — Figma-style lerp/ease scrolling
// ========================================
// Lenis intercepts the native scroll and eases it toward its target,
// so the whole page glides instead of jumping frame-to-frame. On top
// of that, on wide desktop viewports only, a light "gravity" nudges
// the page to the nearest section edge once the user stops scrolling
// close to one — a soft version of scroll-snapping that never fights
// an in-progress scroll or touch/trackpad flick.
//
// Disabled entirely under prefers-reduced-motion, and the snap nudge
// is desktop-only so it never interferes with mobile scrolling.

import { useEffect } from 'react'

const IDLE_MS = 140
const SNAP_ZONE_PX = 90 // only nudge if within this many px of a section edge

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let lenis: import('lenis').default | null = null
    let rafId = 0
    let disposed = false

    import('lenis').then(({ default: Lenis }) => {
      if (disposed) return
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
      })

      function raf(time: number) {
        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)

      // ---- soft desktop-only section gravity -------------------------
      const isDesktop = window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024
      if (isDesktop) {
        let idleTimer: ReturnType<typeof setTimeout>
        lenis.on('scroll', (l: import('lenis').default) => {
          clearTimeout(idleTimer)
          idleTimer = setTimeout(() => {
            if (Math.abs(l.velocity) > 0.05) return
            const sections = Array.from(document.querySelectorAll('main > section'))
            const y = window.scrollY
            let nearest: HTMLElement | null = null
            let nearestDist = Infinity
            for (const el of sections) {
              const dist = Math.abs((el as HTMLElement).offsetTop - y)
              if (dist < nearestDist) {
                nearestDist = dist
                nearest = el as HTMLElement
              }
            }
            if (nearest && nearestDist > 4 && nearestDist < SNAP_ZONE_PX) {
              lenis?.scrollTo(nearest, { duration: 0.5, lock: false, force: false })
            }
          }, IDLE_MS)
        })
      }
    })

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

  return null
}
