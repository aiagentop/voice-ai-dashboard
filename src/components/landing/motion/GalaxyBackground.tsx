'use client'

// ========================================
// GALAXY — whole-site background
// ========================================
// A living spiral galaxy: 3 arms (Answer / Book / Follow up), a warm
// core fading to the brand's deep blue. Built with three.js's
// WebGPURenderer (which falls back to WebGL2 internally — no manual
// detection needed) and TSL node materials, so the same shader graph
// compiles to WGSL or GLSL depending on what the browser supports.
//
// Mounted once, fixed behind the entire page (see GalaxyBackgroundLoader
// in page.tsx) — not scoped to the Hero. A flat dark scrim sits between
// this canvas and the page content so text stays readable everywhere.
//
// Perf/UX contract:
// - The render loop only runs while the tab is visible; fully paused
//   otherwise (there's no "in viewport" question — it's always the
//   full viewport).
// - prefers-reduced-motion: render one static frame, no listeners.
// - Mobile (<768px): fewer particles.

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
const INSIDE_COLOR = '#ffc48a' // warm core
const OUTSIDE_COLOR = '#5b6bf2' // deep brand blue (~--color-void-accent-2)
const BASE_SPEED = 0.045
const SCROLL_BOOST = 0.00035 // extra spin per px/frame of scroll velocity
const SCROLL_PARALLAX = 0.45 // max vertical camera drift (world units) from scroll position

export function GalaxyBackground({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

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
      container.appendChild(canvas)

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
      camera.position.set(0, 2.2, 5.2)
      camera.lookAt(0, 0, 0)

      const galaxyGroup = new THREE.Group()
      galaxyGroup.rotation.x = 0.35
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
        return mix(insideColor, outsideColor, t)
      })()

      material.scaleNode = attribute('aScale', 'float').mul(isMobile ? 0.108 : 0.13)

      const points = new THREE.Points(geometry, material)
      galaxyGroup.add(points)

      // ---- sizing -------------------------------------------------------
      function resize() {
        const { clientWidth, clientHeight } = container
        if (!clientWidth || !clientHeight) return
        camera.aspect = clientWidth / clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(clientWidth, clientHeight, false)
      }
      resize()
      window.addEventListener('resize', resize)
      cleanupFns.push(() => window.removeEventListener('resize', resize))

      // ---- interaction state: mouse parallax + a scroll reaction —
      // scrolling briefly speeds up the spin (velocity-based, decays
      // back to base) and drifts the camera a touch, so the whole
      // background feels alive as you move through the page. --------
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

      let lastScrollY = window.scrollY
      let scrollBoost = 0
      let scrollDrift = 0

      if (!reducedMotion) {
        const onScroll = () => {
          const y = window.scrollY
          const velocity = y - lastScrollY
          lastScrollY = y
          scrollBoost += Math.abs(velocity)
          scrollDrift = Math.max(-1, Math.min(1, y * 0.0015))
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        cleanupFns.push(() => window.removeEventListener('scroll', onScroll))
      }

      // ---- render loop, gated on tab visibility only ------------------
      let running = false
      let rafId = 0
      let lastTime = performance.now()

      function frame(now: number) {
        rafId = requestAnimationFrame(frame)
        const delta = Math.min((now - lastTime) / 1000, 0.1)
        lastTime = now

        uRotation.value += delta * (BASE_SPEED + scrollBoost * SCROLL_BOOST)
        scrollBoost *= 0.9 // decays back to just the base spin

        mouseX += (targetMouseX - mouseX) * 0.04
        mouseY += (targetMouseY - mouseY) * 0.04
        camera.position.x = mouseX * 0.55
        camera.position.y = 2.2 - mouseY * 0.34 + scrollDrift * SCROLL_PARALLAX
        camera.lookAt(0, 0, 0)

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

  return <div ref={containerRef} className={`h-full w-full ${className}`} aria-hidden />
}
