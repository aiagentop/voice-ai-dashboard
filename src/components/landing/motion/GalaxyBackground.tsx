'use client'

// ========================================
// GALAXY — Hero background
// ========================================
// A living spiral galaxy: 3 arms (Answer / Book / Follow up), a warm
// core fading to the brand's deep blue. Built with three.js's
// WebGPURenderer (which falls back to WebGL2 internally — no manual
// detection needed) and TSL node materials, so the same shader graph
// compiles to WGSL or GLSL depending on what the browser supports.
//
// Perf/UX contract:
// - Mounted only via next/dynamic({ssr:false}) from Hero.tsx.
// - The render loop only runs while this section is intersecting the
//   viewport AND the tab is visible; it's fully paused otherwise.
// - prefers-reduced-motion: render one static frame, no listeners.
// - Mobile (<768px): fewer particles, galaxy recentered.

import { useEffect, useRef } from 'react'

const DESKTOP_PARTICLES = 18000
const MOBILE_PARTICLES = 5000
const BREAKPOINT = 768
const ARMS = 3
const RADIUS = 5
const SPIN_STRENGTH = 3.2 // how tightly the arms twist by radius
const ARM_SPREAD = 0.4 // angular width of each arm
const RANDOMNESS = 0.55
const RANDOMNESS_POWER = 3
const INSIDE_COLOR = '#ffc48a' // warm core
const OUTSIDE_COLOR = '#5b6bf2' // deep brand blue (~--color-void-accent-2)

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
      const baseCameraX = isMobile ? 0 : 1.6
      camera.position.set(baseCameraX, 2.2, 5.2)
      camera.lookAt(isMobile ? 0 : 1.2, 0, 0)

      const galaxyGroup = new THREE.Group()
      galaxyGroup.rotation.x = 0.35
      galaxyGroup.position.x = baseCameraX
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

      material.scaleNode = attribute('aScale', 'float').mul(isMobile ? 0.09 : 0.11)

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
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(container)
      cleanupFns.push(() => resizeObserver.disconnect())

      // ---- interaction state ---------------------------------------
      let targetMouseX = 0
      let targetMouseY = 0
      let mouseX = 0
      let mouseY = 0
      let scrollProgress = 0 // 0 = hero fully in view, 1 = fully scrolled past

      if (!reducedMotion && !isMobile) {
        const onMouseMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect()
          targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
          targetMouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1
        }
        window.addEventListener('mousemove', onMouseMove)
        cleanupFns.push(() => window.removeEventListener('mousemove', onMouseMove))
      }

      if (!reducedMotion) {
        const heroSection = container.closest('section')
        const onScroll = () => {
          if (!heroSection) return
          const rect = heroSection.getBoundingClientRect()
          const progress = 1 - Math.max(0, Math.min(1, rect.bottom / (rect.height + window.innerHeight * 0.5)))
          scrollProgress = Math.max(0, Math.min(1, progress))
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        cleanupFns.push(() => window.removeEventListener('scroll', onScroll))
      }

      // ---- visibility gating (IntersectionObserver + tab visibility) --
      let running = false
      let rafId = 0
      let lastTime = performance.now()

      function frame(now: number) {
        rafId = requestAnimationFrame(frame)
        const delta = Math.min((now - lastTime) / 1000, 0.1)
        lastTime = now

        const speed = 0.06 * (1 + scrollProgress * 2.5)
        uRotation.value += delta * speed

        mouseX += (targetMouseX - mouseX) * 0.04
        mouseY += (targetMouseY - mouseY) * 0.04
        camera.position.x = baseCameraX + mouseX * 0.4
        camera.position.y = 2.2 - mouseY * 0.25

        camera.position.z = 5.2 - scrollProgress * 1.4
        galaxyGroup.rotation.x = 0.35 + scrollProgress * 0.35
        camera.lookAt(baseCameraX, 0, 0)

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
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && document.visibilityState === 'visible') start()
            else stop()
          },
          { threshold: 0.05 }
        )
        observer.observe(container)
        cleanupFns.push(() => observer.disconnect())

        const onVisibility = () => {
          if (document.visibilityState !== 'visible') stop()
          else if (
            container.getBoundingClientRect().bottom > 0 &&
            container.getBoundingClientRect().top < window.innerHeight
          )
            start()
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
