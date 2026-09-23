'use client'

// ========================================
// STARFIELD — ambient background for the whole page
// ========================================
// A very light canvas2D star field, fixed behind every section (the
// Hero's own Galaxy sits on top of it, unaffected — this just gives
// the rest of the page the same "living sky" feeling once the galaxy
// itself has scrolled away).
//
// Deliberately NOT three.js: this runs behind the entire page for the
// whole session, so it has to be cheap. A couple hundred canvas2D
// arcs redrawn each frame is negligible next to the Hero's WebGPU
// scene, which is the one part of the page allowed to be expensive.

import { useEffect, useRef } from 'react'

const BREAKPOINT = 768
const DESKTOP_STARS = 220
const MOBILE_STARS = 110

type Star = {
  x: number
  y: number
  radius: number
  baseAlpha: number
  twinkleSpeed: number
  phase: number
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let rafId = 0
    let running = false

    function makeStars() {
      const isMobile = window.innerWidth < BREAKPOINT
      const count = isMobile ? MOBILE_STARS : DESKTOP_STARS
      const w = window.innerWidth
      const h = window.innerHeight
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.1 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.25,
        twinkleSpeed: Math.random() * 1.2 + 0.4,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = '100%'
      canvas!.style.height = '100%'
      ctx!.scale(dpr, dpr)
      makeStars()
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const s of stars) {
        ctx!.globalAlpha = s.baseAlpha
        ctx!.fillStyle = '#f8fafc'
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1
    }

    function frame(time: number) {
      rafId = requestAnimationFrame(frame)
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.001 * s.twinkleSpeed + s.phase)
        ctx!.globalAlpha = s.baseAlpha * (0.5 + 0.5 * twinkle)
        ctx!.fillStyle = '#f8fafc'
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx!.fill()
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

    resize()

    if (reducedMotion) {
      drawStatic()
    } else {
      start()
      const onVisibility = () => {
        if (document.visibilityState === 'visible') start()
        else stop()
      }
      document.addEventListener('visibilitychange', onVisibility)
      window.addEventListener('resize', resize)
      return () => {
        stop()
        document.removeEventListener('visibilitychange', onVisibility)
        window.removeEventListener('resize', resize)
      }
    }

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
