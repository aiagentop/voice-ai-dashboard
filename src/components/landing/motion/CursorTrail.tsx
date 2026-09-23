'use client'

// ========================================
// CURSOR — fine light trail
// ========================================
// A tiny bright dot with a short, fast-fading trail. A thin ring
// replaces the glow over links/buttons. The trail's color follows
// whichever <section> is under the cursor (same 4-color palette as
// the Agent Library, for visual consistency). Desktop (fine pointer)
// only — the native cursor stays, and pointer-events are never
// intercepted, so nothing about clicking or touch scrolling changes.

import { useEffect, useRef } from 'react'

const MAX_POINTS = 14
const POINT_LIFETIME_MS = 320
const SECTION_COLORS = ['#38bdf8', '#6366f1', '#ffb37a', '#34d399']

type Point = { x: number; y: number; t: number }

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
    let mouseX = -9999
    let mouseY = -9999
    let hovering = false
    let currentColor = SECTION_COLORS[0]
    let lastScrollY = window.scrollY
    let rafId = 0
    let running = false
    let sections: HTMLElement[] = []

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

      const target = e.target as Element | null
      hovering = !!target?.closest('a, button, [role="button"], input, select, textarea')
    }

    function onScroll() {
      const dy = window.scrollY - lastScrollY
      lastScrollY = window.scrollY
      if (dy !== 0) {
        points = points.map((p) => ({ ...p, y: p.y - dy }))
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

    function frame() {
      rafId = requestAnimationFrame(frame)
      const now = performance.now()
      points = points.filter((p) => now - p.t < POINT_LIFETIME_MS)

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Trail: fading segments from oldest to newest.
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1]
        const p1 = points[i]
        const age = (now - p1.t) / POINT_LIFETIME_MS
        const alpha = Math.max(0, 1 - age) * 0.35
        ctx!.strokeStyle = currentColor
        ctx!.globalAlpha = alpha
        ctx!.lineWidth = Math.max(0.5, 2.2 * (1 - age))
        ctx!.lineCap = 'round'
        ctx!.beginPath()
        ctx!.moveTo(p0.x, p0.y)
        ctx!.lineTo(p1.x, p1.y)
        ctx!.stroke()
      }

      // The dot itself (or a thin ring over interactive elements).
      if (mouseX > -100) {
        ctx!.globalAlpha = 1
        if (hovering) {
          ctx!.strokeStyle = currentColor
          ctx!.lineWidth = 1.4
          ctx!.beginPath()
          ctx!.arc(mouseX, mouseY, 13, 0, Math.PI * 2)
          ctx!.stroke()
        } else {
          ctx!.fillStyle = currentColor
          ctx!.beginPath()
          ctx!.arc(mouseX, mouseY, 3, 0, Math.PI * 2)
          ctx!.fill()
        }
      }
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
