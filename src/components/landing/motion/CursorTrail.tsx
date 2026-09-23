'use client'

// ========================================
// CURSOR — glowing comet trail
// ========================================
// A small glowing core with a comet-style trail of fading, glowing
// dots (plus the occasional stray "stardust" sparkle) — fits the
// site's space theme. A thin glowing ring replaces the core over
// links/buttons. The trail's color follows whichever <section> is
// under the cursor (same 4-color palette as the Agent Library).
// Desktop (fine pointer) only — the native cursor stays, and
// pointer-events are never intercepted, so nothing about clicking or
// touch scrolling changes.

import { useEffect, useRef } from 'react'

const MAX_POINTS = 16
const POINT_LIFETIME_MS = 420
const SPARK_LIFETIME_MS = 650
const SECTION_COLORS = ['#38bdf8', '#6366f1', '#ffb37a', '#34d399']

type Point = { x: number; y: number; t: number }
type Spark = { x: number; y: number; t: number; vx: number; vy: number; r: number }

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const isDesktopWidth = window.innerWidth >= 1024
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isFinePointer || !isDesktopWidth || reducedMotion) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let points: Point[] = []
    let sparks: Spark[] = []
    let mouseX = -9999
    let mouseY = -9999
    let lastMoveX = -9999
    let lastMoveY = -9999
    let hovering = false
    let currentColor = SECTION_COLORS[0]
    let lastScrollY = window.scrollY
    let rafId = 0
    let running = false
    let sections: HTMLElement[] = []
    let sinceLastSpark = 0

    function collectSections() {
      sections = Array.from(document.querySelectorAll('section'))
    }
    collectSections()

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()

    function colorForY(viewportY: number) {
      const pageY = viewportY + window.scrollY
      let index = 0
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= pageY) index = i
      }
      return SECTION_COLORS[index % SECTION_COLORS.length]
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      currentColor = colorForY(mouseY)
      points.push({ x: mouseX, y: mouseY, t: performance.now() })
      if (points.length > MAX_POINTS) points.shift()

      // Occasionally peel off a little stardust that drifts on its own.
      const dx = mouseX - lastMoveX
      const dy = mouseY - lastMoveY
      const speed = Math.hypot(dx, dy)
      lastMoveX = mouseX
      lastMoveY = mouseY
      if (speed > 6 && sinceLastSpark > 55) {
        sinceLastSpark = 0
        const angle = Math.random() * Math.PI * 2
        sparks.push({
          x: mouseX,
          y: mouseY,
          t: performance.now(),
          vx: Math.cos(angle) * (0.3 + Math.random() * 0.5),
          vy: Math.sin(angle) * (0.3 + Math.random() * 0.5) - 0.2,
          r: 0.8 + Math.random() * 1.1,
        })
        if (sparks.length > 24) sparks.shift()
      }

      const target = e.target as Element | null
      hovering = !!target?.closest('a, button, [role="button"], input, select, textarea')
    }

    function onScroll() {
      const dy = window.scrollY - lastScrollY
      lastScrollY = window.scrollY
      if (dy !== 0) {
        points = points.map((p) => ({ ...p, y: p.y - dy }))
        sparks = sparks.map((s) => ({ ...s, y: s.y - dy }))
      }
    }

    function onLeave() {
      mouseX = -9999
      mouseY = -9999
      points = []
    }

    function onWindowMouseOut(e: MouseEvent) {
      if (!e.relatedTarget) onLeave()
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    window.addEventListener('mouseout', onWindowMouseOut)

    function glowDot(x: number, y: number, radius: number, alpha: number, blur: number) {
      ctx!.globalAlpha = alpha
      ctx!.shadowColor = currentColor
      ctx!.shadowBlur = blur
      ctx!.fillStyle = currentColor
      ctx!.beginPath()
      ctx!.arc(x, y, radius, 0, Math.PI * 2)
      ctx!.fill()
    }

    function frame(now: number) {
      rafId = requestAnimationFrame(frame)
      sinceLastSpark += 16
      points = points.filter((p) => now - p.t < POINT_LIFETIME_MS)
      sparks = sparks.filter((s) => now - s.t < SPARK_LIFETIME_MS)

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Comet trail: glowing dots, oldest (small/faint) to newest.
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const age = (now - p.t) / POINT_LIFETIME_MS
        const life = Math.max(0, 1 - age)
        glowDot(p.x, p.y, 1 + life * 2.6, life * 0.5, 8 * life)
      }

      // Stardust sparkles drifting off the trail.
      for (const s of sparks) {
        const age = (now - s.t) / SPARK_LIFETIME_MS
        const life = Math.max(0, 1 - age)
        const dt = now - s.t
        glowDot(s.x + s.vx * dt * 0.06, s.y + s.vy * dt * 0.06, s.r * life, life * 0.7, 6)
      }

      ctx!.shadowBlur = 0

      // The core dot (or a thin glowing ring over interactive elements).
      if (mouseX > -100) {
        if (hovering) {
          ctx!.globalAlpha = 0.9
          ctx!.shadowColor = currentColor
          ctx!.shadowBlur = 10
          ctx!.strokeStyle = currentColor
          ctx!.lineWidth = 1.5
          ctx!.beginPath()
          ctx!.arc(mouseX, mouseY, 14, 0, Math.PI * 2)
          ctx!.stroke()
        } else {
          const pulse = 1 + Math.sin(now * 0.006) * 0.22
          glowDot(mouseX, mouseY, 2.6 * pulse, 1, 12)
        }
      }
      ctx!.shadowBlur = 0
      ctx!.globalAlpha = 1
    }

    function start() {
      if (running) return
      running = true
      rafId = requestAnimationFrame(frame)
    }
    function stop() {
      running = false
      cancelAnimationFrame(rafId)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') start()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    start()
    // Section offsets can shift as content/images settle in.
    const recollect = () => collectSections()
    window.addEventListener('load', recollect)
    const recollectTimer = setTimeout(recollect, 1500)

    return () => {
      stop()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mouseout', onWindowMouseOut)
      window.removeEventListener('load', recollect)
      document.removeEventListener('visibilitychange', onVisibility)
      clearTimeout(recollectTimer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block"
    />
  )
}
