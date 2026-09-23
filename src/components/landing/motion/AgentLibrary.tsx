'use client'

// ========================================
// AGENT LIBRARY — 3D card table
// ========================================
// Real HTML cards (glassy, glowing in their category color) placed in
// 3D space with three.js's CSS3DRenderer — same technique as the
// periodic-table example. The whole group spins continuously, and
// the layout swaps sphere <-> helix every ~2.5s regardless of
// hovering/dragging. Dragging only responds to mouse input, so it
// can never intercept a touch scroll — it just adds extra spin on
// top of the idle rotation.

import { useEffect, useRef } from 'react'
import { agentLibrary, agentLibraryCategories, type AgentLibraryCategory } from '@/lib/landing-config'

const LAYOUTS = ['sphere', 'helix'] as const
type Layout = (typeof LAYOUTS)[number]

const CYCLE_MS = 2500
const TWEEN_MS = 1000
const SPHERE_RADIUS = 430
const HELIX_RADIUS = 430
const HELIX_Y_STEP = 52
const HELIX_THETA_STEP = 0.5
const IDLE_SPIN_SPEED = 0.12 // rad/s — always spinning, cycle or no cycle

export function AgentLibrary({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    const cleanupFns: Array<() => void> = []

    async function setup(mount: HTMLDivElement) {
      const THREE = await import('three')
      const { CSS3DRenderer, CSS3DObject } = await import(
        'three/examples/jsm/renderers/CSS3DRenderer.js'
      )
      const TWEEN = await import('three/examples/jsm/libs/tween.module.js')

      if (disposed) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, 1, 1, 6000)
      camera.position.z = 900

      const renderer = new CSS3DRenderer()
      renderer.domElement.style.position = 'absolute'
      renderer.domElement.style.inset = '0'
      mount.appendChild(renderer.domElement)

      const group = new THREE.Group()
      scene.add(group)

      // ---- build one DOM card per library item ----------------------
      const objects: InstanceType<typeof CSS3DObject>[] = []
      const targets: Record<Layout, InstanceType<typeof THREE.Vector3>[]> = {
        sphere: [],
        helix: [],
      }
      const rotationTargets: Record<Layout, InstanceType<typeof THREE.Euler>[]> = {
        sphere: [],
        helix: [],
      }

      const total = agentLibrary.length

      agentLibrary.forEach((item, i) => {
        const cat = agentLibraryCategories[item.category as AgentLibraryCategory]
        const el = document.createElement('div')
        el.className = 'agentop-card'
        el.style.setProperty('--cat-color', cat.color)
        el.innerHTML = `
          <div class="agentop-card-n">${item.n}</div>
          <div class="agentop-card-symbol">${item.symbol}</div>
          <div class="agentop-card-name">${item.name}</div>
          <div class="agentop-card-cat">${cat.label}</div>
        `
        const object = new CSS3DObject(el)
        group.add(object)
        objects.push(object)

        // Sphere: even Fibonacci-style distribution, cards face outward
        const phi = Math.acos(-1 + (2 * i) / total)
        const theta = Math.sqrt(total * Math.PI) * phi
        const spherePos = new THREE.Vector3().setFromSphericalCoords(SPHERE_RADIUS, phi, theta)
        targets.sphere.push(spherePos)
        const dummy = new THREE.Object3D()
        dummy.position.copy(spherePos)
        dummy.lookAt(spherePos.clone().multiplyScalar(2))
        rotationTargets.sphere.push(dummy.rotation.clone())

        // Helix: winds upward, cards face outward from the axis
        const hTheta = i * HELIX_THETA_STEP
        const y = -(i * HELIX_Y_STEP) + (total * HELIX_Y_STEP) / 2
        const helixPos = new THREE.Vector3(
          HELIX_RADIUS * Math.cos(hTheta),
          y,
          HELIX_RADIUS * Math.sin(hTheta)
        )
        targets.helix.push(helixPos)
        const dummy2 = new THREE.Object3D()
        dummy2.position.copy(helixPos)
        dummy2.lookAt(new THREE.Vector3(helixPos.x * 2, helixPos.y, helixPos.z * 2))
        rotationTargets.helix.push(dummy2.rotation.clone())
      })

      function applyLayout(layout: Layout, animate: boolean) {
        objects.forEach((object, i) => {
          const pos = targets[layout][i]
          const rot = rotationTargets[layout][i]
          if (!animate) {
            object.position.copy(pos)
            object.rotation.copy(rot)
            return
          }
          new TWEEN.Tween(object.position)
            .to({ x: pos.x, y: pos.y, z: pos.z }, TWEEN_MS)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
          new TWEEN.Tween(object.rotation)
            .to({ x: rot.x, y: rot.y, z: rot.z }, TWEEN_MS)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
        })
      }

      applyLayout('sphere', false)

      // ---- sizing -----------------------------------------------------
      function resize() {
        const { clientWidth, clientHeight } = mount
        if (!clientWidth || !clientHeight) return
        camera.aspect = clientWidth / clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(clientWidth, clientHeight)
        // Pull the camera back a bit on narrow viewports so nothing clips.
        const isMobile = clientWidth < 640
        camera.position.z = isMobile ? 1150 : 900
      }
      resize()
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(mount)
      cleanupFns.push(() => resizeObserver.disconnect())

      // ---- drag adds extra spin on top of the idle rotation (mouse
      // only — never intercepts touch) ---------------------------------
      let dragging = false
      let lastX = 0
      let lastY = 0
      let dragPitch = 0
      const ROTATE_SPEED = 0.006

      function onPointerDown(e: PointerEvent) {
        if (e.pointerType !== 'mouse') return
        dragging = true
        lastX = e.clientX
        lastY = e.clientY
      }
      function onPointerMove(e: PointerEvent) {
        if (!dragging) return
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        lastX = e.clientX
        lastY = e.clientY
        group.rotation.y += dx * ROTATE_SPEED
        dragPitch = Math.max(-0.6, Math.min(0.6, dragPitch + dy * ROTATE_SPEED))
        group.rotation.x = dragPitch
        if (reducedMotion) renderer.render(scene, camera)
      }
      function onPointerUp() {
        dragging = false
      }
      mount.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      cleanupFns.push(() => {
        mount.removeEventListener('pointerdown', onPointerDown)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      })

      // ---- auto-cycle: sphere <-> helix, every CYCLE_MS, always —
      // never pauses for hover or drag. ---------------------------------
      let layoutIndex = 0
      let cycleTimer: ReturnType<typeof setTimeout> | null = null

      function tick() {
        cycleTimer = setTimeout(() => {
          layoutIndex = (layoutIndex + 1) % LAYOUTS.length
          applyLayout(LAYOUTS[layoutIndex], true)
          tick()
        }, CYCLE_MS)
      }
      function startCycle() {
        if (cycleTimer || reducedMotion) return
        tick()
      }
      function stopCycle() {
        if (cycleTimer) clearTimeout(cycleTimer)
        cycleTimer = null
      }

      // ---- render loop, gated on viewport + tab visibility -----------
      let running = false
      let rafId = 0
      let lastTime = performance.now()
      function frame(now: number) {
        rafId = requestAnimationFrame(frame)
        const delta = Math.min((now - lastTime) / 1000, 0.1)
        lastTime = now
        group.rotation.y += delta * IDLE_SPIN_SPEED
        TWEEN.update()
        renderer.render(scene, camera)
      }
      function start() {
        if (running || disposed) return
        running = true
        lastTime = performance.now()
        rafId = requestAnimationFrame(frame)
        if (!reducedMotion) startCycle()
      }
      function stop() {
        running = false
        cancelAnimationFrame(rafId)
        stopCycle()
      }

      if (reducedMotion) {
        renderer.render(scene, camera)
      } else {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && document.visibilityState === 'visible') start()
            else stop()
          },
          { threshold: 0.1 }
        )
        observer.observe(mount)
        cleanupFns.push(() => observer.disconnect())

        const onVisibility = () => {
          if (document.visibilityState !== 'visible') stop()
        }
        document.addEventListener('visibilitychange', onVisibility)
        cleanupFns.push(() => document.removeEventListener('visibilitychange', onVisibility))
      }

      cleanupFns.push(() => {
        stop()
        renderer.domElement.remove()
      })
    }

    setup(mount).catch((err) => {
      console.error('[agent-library] failed to initialize', err)
    })

    return () => {
      disposed = true
      cleanupFns.forEach((fn) => fn())
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div ref={mountRef} className="relative h-[640px] w-full sm:h-[720px]" />

      {/* Crawlable/accessible fallback — same content, not visual */}
      <ul className="sr-only">
        {agentLibrary.map((item) => (
          <li key={item.n}>
            {item.n}. {item.symbol} — {item.name} ({agentLibraryCategories[item.category].label})
          </li>
        ))}
      </ul>
    </div>
  )
}
