'use client'

// ========================================
// GALAXY — whole-site background + scroll journey
// ========================================
// A living spiral galaxy: 3 arms (Answer / Book / Follow up), a warm
// core fading to the brand's deep blue. Built with three.js's
// WebGPURenderer (falls back to WebGL2 internally) and TSL node
// materials.
//
// On top of the base look, the CAMERA runs a scroll-driven journey:
// each top-level <section> under <main> has a "stop" (camera
// distance/height/orbit-yaw, galaxy Z-tilt, brightness, horizontal
// view offset). The stop's anchor is the scrollY at which that
// section's center crosses the viewport center (the hero is pinned to
// scrollY 0). Between anchors, every value is smoothstep-interpolated
// to a per-frame target; the actually-rendered ("live") values then
// chase that target with frame-rate-independent exponential smoothing
// so the camera never jumps, only settles. See STOPS below — it's
// index-matched 1:1 to `main > section` in page.tsx, in order.
//
// Perf/UX contract:
// - Desktop: render loop runs whenever the tab is visible (same as
//   before).
// - Mobile: render loop only runs while scrolling, plus a short idle
//   tail, then pauses — the journey has no horizontal view-offset on
//   mobile.
// - prefers-reduced-motion: one static frame at the Hero stop, no
//   scroll journey, no listeners.

import { useEffect, useRef } from 'react'

const DESKTOP_PARTICLES = 18900
const MOBILE_PARTICLES = 5250
const BREAKPOINT = 768
const ARMS = 3
const RADIUS = 5
const SPIN_STRENGTH = 3.2 // how tightly the arms twist by radius
const ARM_SPREAD = 0.4 // angular width of each arm
const RANDOMNESS = 0.55
const RANDOMNESS_POWER = 3
const INSIDE_COLOR = '#ffd199' // warm core
const OUTSIDE_COLOR = '#7c8bff' // brand blue/violet
const BASE_SPEED = 0.045
const SCROLL_BOOST = 0.00035 // extra particle-spin per px/frame of scroll velocity

const SMOOTH_RATE = 4.5 // live-value exponential smoothing rate (higher = snappier)
const MOBILE_IDLE_MS = 1000 // mobile: keep rendering this long after the last scroll event
// Scrim opacity = brightness * this. On mobile there's no horizontal view
// offset to steer the bright core away from text (offset is disabled), so
// this needs enough headroom to keep the brightest stops (hero/library/
// final, brightness up to 1.0) readable even with the core dead-center.
const SCRIM_BRIGHTNESS_FACTOR = 0.42

type Stop = {
  dist: number
  height: number
  yaw: number // absolute, cumulative — not a delta
  tilt: number
  brightness: number
  offset: number
}

// One entry per `main > section`, in document order. See the plan this
// was built from: Hero is pinned; "content" sections ramp continuously
// (dist/height/tilt/offset lerp across the 5 of them, yaw +0.35 each);
// "quiet" sections (thin/minor: trust bar, stats, integrations,
// pricing, faq, demo form) share one calmer look; Agent Library and
// the final CTA each get a bespoke pulled-back framing.
const STOPS: Stop[] = [
  { dist: 7.4, height: 3.2, yaw: 0.0, tilt: 0.0, brightness: 1.0, offset: -0.2 }, // Hero
  { dist: 3.6, height: 1.0, yaw: 0.0, tilt: -0.28, brightness: 0.3, offset: 0 }, // TrustBar
  { dist: 4.4, height: 1.5, yaw: 0.35, tilt: 0.22, brightness: 0.3, offset: -0.12 }, // Problem
  { dist: 4.0, height: 1.3, yaw: 0.7, tilt: 0.27, brightness: 0.3, offset: -0.09 }, // Services
  { dist: 9.5, height: 7.5, yaw: 0.7, tilt: 0.0, brightness: 0.72, offset: 0 }, // Agent Library
  { dist: 3.6, height: 1.1, yaw: 1.05, tilt: 0.32, brightness: 0.3, offset: -0.06 }, // VoiceDemo
  { dist: 3.6, height: 1.0, yaw: 1.05, tilt: -0.28, brightness: 0.3, offset: 0 }, // Outcomes
  { dist: 3.2, height: 0.9, yaw: 1.4, tilt: 0.37, brightness: 0.3, offset: -0.03 }, // Process
  { dist: 2.8, height: 0.7, yaw: 1.75, tilt: 0.42, brightness: 0.3, offset: 0 }, // UseCases
  { dist: 3.6, height: 1.0, yaw: 1.75, tilt: -0.28, brightness: 0.3, offset: 0 }, // Integrations
  { dist: 3.6, height: 1.0, yaw: 1.75, tilt: -0.28, brightness: 0.3, offset: 0 }, // Pricing
  { dist: 3.6, height: 1.0, yaw: 1.75, tilt: -0.28, brightness: 0.3, offset: 0 }, // FAQ
  { dist: 3.6, height: 1.0, yaw: 1.75, tilt: -0.28, brightness: 0.3, offset: 0 }, // demo-form
  { dist: 12.5, height: 4.2, yaw: 1.75, tilt: 0.08, brightness: 1.0, offset: 0 }, // Final CTA
]

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpStop(a: Stop, b: Stop, t: number): Stop {
  return {
    dist: lerp(a.dist, b.dist, t),
    height: lerp(a.height, b.height, t),
    yaw: lerp(a.yaw, b.yaw, t),
    tilt: lerp(a.tilt, b.tilt, t),
    brightness: lerp(a.brightness, b.brightness, t),
    offset: lerp(a.offset, b.offset, t),
  }
}

export function GalaxyBackground({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let cleanupFns: Array<() => void> = []

    async function setup(container: HTMLDivElement) {
      // Everything three.js-related is dynamically imported too, so its
      // (fairly large) parser/runtime never ships in the initial bundle.
      const THREE = await import('three/webgpu')
      const {
        Fn,
        uniform,
        attribute,
        color: tslColor,
        mix,
        vec3,
        sin,
        cos,
        clamp,
      } = await import('three/tsl')

      if (disposed) return

      const isMobile = window.innerWidth < BREAKPOINT
      const particleCount = isMobile ? MOBILE_PARTICLES : DESKTOP_PARTICLES

      const canvas = document.createElement('canvas')
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.display = 'block'
      // Insert before the (JSX-rendered) scrim div, not append, so the
      // scrim stays painted on top of the canvas.
      container.insertBefore(canvas, container.firstChild)

      const renderer = new THREE.WebGPURenderer({
        canvas,
        antialias: true,
        alpha: true,
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      await renderer.init()
      if (disposed) {
        renderer.dispose()
        canvas.remove()
        return
      }

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)

      const galaxyGroup = new THREE.Group()
      galaxyGroup.rotation.x = 0.35 // fixed base tilt — the journey's `tilt` adds a Z rotation on top
      scene.add(galaxyGroup)

      // ---- geometry: one attribute set per particle -----------------
      const positions = new Float32Array(particleCount * 3)
      const aRadius = new Float32Array(particleCount)
      const aAngle = new Float32Array(particleCount)
      const aRandomness = new Float32Array(particleCount * 3)
      const aScale = new Float32Array(particleCount)

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * RADIUS
        const armIndex = i % ARMS
        const armBase = (armIndex / ARMS) * Math.PI * 2
        const armJitter = (Math.random() - 0.5) * ARM_SPREAD
        const spinAngle = radius * SPIN_STRENGTH
        const angle = armBase + armJitter + spinAngle

        const randomPow = () =>
          Math.pow(Math.random(), RANDOMNESS_POWER) *
          (Math.random() < 0.5 ? 1 : -1) *
          RANDOMNESS *
          radius

        const rx = randomPow()
        const ry = randomPow() * 0.4
        const rz = randomPow()

        aRadius[i] = radius
        aAngle[i] = angle
        aRandomness[i * 3] = rx
        aRandomness[i * 3 + 1] = ry
        aRandomness[i * 3 + 2] = rz
        aScale[i] = 0.5 + Math.random()

        // Approximate baseline position for bounding-sphere purposes —
        // the shader overrides the real per-frame position below.
        positions[i * 3] = Math.cos(angle) * radius + rx
        positions[i * 3 + 1] = ry
        positions[i * 3 + 2] = Math.sin(angle) * radius + rz
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('aRadius', new THREE.BufferAttribute(aRadius, 1))
      geometry.setAttribute('aAngle', new THREE.BufferAttribute(aAngle, 1))
      geometry.setAttribute('aRandomness', new THREE.BufferAttribute(aRandomness, 3))
      geometry.setAttribute('aScale', new THREE.BufferAttribute(aScale, 1))
      geometry.computeBoundingSphere()

      // ---- TSL node material -----------------------------------------
      const uRotation = uniform(0)
      const uBrightness = uniform(1)
      const insideColor = tslColor(INSIDE_COLOR)
      const outsideColor = tslColor(OUTSIDE_COLOR)

      const material = new THREE.PointsNodeMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })

      material.positionNode = Fn(() => {
        const radius = attribute('aRadius', 'float')
        const baseAngle = attribute('aAngle', 'float')
        const rnd = attribute('aRandomness', 'vec3')
        const angle = baseAngle.add(uRotation)
        const x = cos(angle).mul(radius).add(rnd.x)
        const z = sin(angle).mul(radius).add(rnd.z)
        const y = rnd.y
        return vec3(x, y, z)
      })()

      material.colorNode = Fn(() => {
        const radius = attribute('aRadius', 'float')
        const t = clamp(radius.div(RADIUS), 0, 1)
        return mix(insideColor, outsideColor, t).mul(uBrightness)
      })()

      material.scaleNode = attribute('aScale', 'float').mul(isMobile ? 0.122 : 0.148)

      const points = new THREE.Points(geometry, material)
      galaxyGroup.add(points)

      // ---- scroll journey: per-section anchors --------------------------
      let anchors: number[] = []
      function computeAnchors() {
        const sections = Array.from(document.querySelectorAll('main > section')) as HTMLElement[]
        anchors = sections.map((el, i) => {
          if (i === 0) return 0
          const rect = el.getBoundingClientRect()
          return rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2
        })
      }
      computeAnchors()
      // Section heights can still shift slightly after fonts/images
      // settle in — recheck once, shortly after mount.
      const anchorRecheckTimer = setTimeout(computeAnchors, 1200)
      cleanupFns.push(() => clearTimeout(anchorRecheckTimer))

      function targetForScroll(scrollY: number): Stop {
        const n = Math.min(anchors.length, STOPS.length)
        if (n === 0) return STOPS[0]
        if (scrollY <= anchors[0]) return STOPS[0]
        for (let i = 0; i < n - 1; i++) {
          if (scrollY <= anchors[i + 1]) {
            const span = anchors[i + 1] - anchors[i]
            const t = span > 0 ? smoothstep((scrollY - anchors[i]) / span) : 1
            return lerpStop(STOPS[i], STOPS[i + 1], t)
          }
        }
        return STOPS[n - 1]
      }

      const live: Stop = { ...STOPS[0] }

      // ---- sizing -------------------------------------------------------
      function resize() {
        const { clientWidth, clientHeight } = container
        if (!clientWidth || !clientHeight) return
        camera.aspect = clientWidth / clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(clientWidth, clientHeight, false)
        computeAnchors()
      }
      resize()
      window.addEventListener('resize', resize)
      cleanupFns.push(() => window.removeEventListener('resize', resize))

      // ---- mouse parallax — unchanged, stays additive on top of the
      // journey's own camera placement. -----------------------------------
      let targetMouseX = 0
      let targetMouseY = 0
      let mouseX = 0
      let mouseY = 0

      if (!reducedMotion && !isMobile) {
        const onMouseMove = (e: MouseEvent) => {
          targetMouseX = (e.clientX / window.innerWidth) * 2 - 1
          targetMouseY = (e.clientY / window.innerHeight) * 2 - 1
        }
        window.addEventListener('mousemove', onMouseMove)
        cleanupFns.push(() => window.removeEventListener('mousemove', onMouseMove))
      }

      // ---- scroll: velocity-based spin boost (unchanged) + mobile's
      // scroll-triggered render-on/idle-off. -------------------------------
      let lastScrollY = window.scrollY
      let scrollBoost = 0
      let lastScrollTime = performance.now()

      if (!reducedMotion) {
        const onScroll = () => {
          const y = window.scrollY
          scrollBoost += Math.abs(y - lastScrollY)
          lastScrollY = y
          lastScrollTime = performance.now()
          if (isMobile) start()
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        cleanupFns.push(() => window.removeEventListener('scroll', onScroll))
      }

      // ---- render loop ----------------------------------------------------
      let running = false
      let rafId = 0
      let lastTime = performance.now()

      function frame(now: number) {
        rafId = requestAnimationFrame(frame)
        const delta = Math.min((now - lastTime) / 1000, 0.1)
        lastTime = now

        uRotation.value += delta * (BASE_SPEED + scrollBoost * SCROLL_BOOST)
        scrollBoost *= 0.9 // decays back to just the base spin

        const target = targetForScroll(window.scrollY)
        const k = 1 - Math.exp(-delta * SMOOTH_RATE)
        live.dist += (target.dist - live.dist) * k
        live.height += (target.height - live.height) * k
        live.yaw += (target.yaw - live.yaw) * k
        live.tilt += (target.tilt - live.tilt) * k
        live.brightness += (target.brightness - live.brightness) * k
        live.offset += (target.offset - live.offset) * k

        mouseX += (targetMouseX - mouseX) * 0.04
        mouseY += (targetMouseY - mouseY) * 0.04

        camera.position.x = live.dist * Math.sin(live.yaw) + mouseX * 0.55
        camera.position.y = live.height - mouseY * 0.34
        camera.position.z = live.dist * Math.cos(live.yaw)
        camera.lookAt(0, 0, 0)

        galaxyGroup.rotation.z = live.tilt
        uBrightness.value = live.brightness

        const { clientWidth: w, clientHeight: h } = container
        if (w && h) {
          const effectiveOffset = isMobile ? 0 : live.offset
          camera.setViewOffset(w, h, effectiveOffset * w, 0, w, h)
          camera.updateProjectionMatrix()
        }

        if (scrimRef.current) {
          scrimRef.current.style.opacity = String(live.brightness * SCRIM_BRIGHTNESS_FACTOR)
        }

        // Mobile: only keep rendering while scrolling (+ a short tail).
        if (isMobile && now - lastScrollTime > MOBILE_IDLE_MS) {
          stop()
          return
        }

        renderer.render(scene, camera)
      }

      function start() {
        if (running || disposed) return
        running = true
        lastTime = performance.now()
        rafId = requestAnimationFrame(frame)
      }
      function stop() {
        running = false
        cancelAnimationFrame(rafId)
      }

      if (reducedMotion) {
        const hero = STOPS[0]
        camera.position.set(hero.dist * Math.sin(hero.yaw), hero.height, hero.dist * Math.cos(hero.yaw))
        camera.lookAt(0, 0, 0)
        galaxyGroup.rotation.z = hero.tilt
        uBrightness.value = hero.brightness
        if (scrimRef.current) scrimRef.current.style.opacity = String(hero.brightness * SCRIM_BRIGHTNESS_FACTOR)
        renderer.render(scene, camera)
      } else {
        start()
        const onVisibility = () => {
          if (document.visibilityState === 'visible') start()
          else stop()
        }
        document.addEventListener('visibilitychange', onVisibility)
        cleanupFns.push(() => document.removeEventListener('visibilitychange', onVisibility))
      }

      cleanupFns.push(() => {
        stop()
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        canvas.remove()
      })
    }

    setup(container).catch((err) => {
      // WebGPURenderer already falls back to WebGL2 internally; if setup
      // still fails (very old browser, canvas blocked, etc.) we simply
      // leave the decorative background empty rather than throw.
      console.error('[galaxy] failed to initialize', err)
    })

    return () => {
      disposed = true
      cleanupFns.forEach((fn) => fn())
      cleanupFns = []
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`} aria-hidden>
      <div
        ref={scrimRef}
        className="pointer-events-none absolute inset-0 bg-void"
        style={{ opacity: SCRIM_BRIGHTNESS_FACTOR }}
      />
    </div>
  )
}
