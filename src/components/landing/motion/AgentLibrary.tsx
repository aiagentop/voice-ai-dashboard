'use client'

// ========================================
// AGENT LIBRARY — 3D card table
// ========================================
// Real HTML cards (glassy, glowing in their category color) placed in
// 3D space with three.js's CSS3DRenderer — same technique as the
// periodic-table example. The layout auto-cycles table -> sphere ->
// helix -> grid -> table. Camera distance is computed per layout (not
// hardcoded) from each layout's actual bounding radius, so nothing
// clips regardless of card count/size/viewport — see computeCameraZ().
// Dragging only responds to mouse input, so it can never intercept a
// touch scroll — it just adds extra spin on top of the idle rotation.

import { useEffect, useRef } from 'react'
import { agentLibrary, agentLibraryCategories, type AgentLibraryCategory } from '@/lib/landing-config'

const LAYOUTS = ['table', 'sphere', 'helix', 'grid'] as const
type Layout = (typeof LAYOUTS)[number]

const CYCLE_MS = 4000
const TWEEN_MS = 1600
const IDLE_SPIN_SPEED = 0.04 // rad/s — sphere/helix only

const FOV = 40
const FILL_FRACTION = 0.85 // layout fills ~85% of the stage's visible height/width
const CARD_HEIGHT = 168
const CARD_HALF_HEIGHT = CARD_HEIGHT / 2

const SPHERE_RADIUS = 460
const HELIX_RADIUS = 520
const HELIX_THETA_STEP = 0.42
const HELIX_Y_STEP = 22

const TABLE_SPACING_X = 150
const TABLE_SPACING_Y = 190
const TABLE_COLS_DESKTOP = 8
const TABLE_COLS_MOBILE = 4

const GRID_COLS = 4
const GRID_ROWS = 3
const GRID_SPACING = 260
const GRID_DEPTH_GAP = 700

const MOBILE_BREAKPOINT = 640

type LayoutGeometry = { boundingRadius: number; maxForwardZ: number }

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
      const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 6000)

      const renderer = new CSS3DRenderer()
      renderer.domElement.style.position = 'absolute'
      renderer.domElement.style.inset = '0'
      mount.appendChild(renderer.domElement)

      const group = new THREE.Group()
      scene.add(group)

      // ---- build one DOM card per library item -----------------------
      const objects: InstanceType<typeof CSS3DObject>[] = []
      const total = agentLibrary.length

      agentLibrary.forEach((item) => {
        const cat = agentLibraryCategories[item.category as AgentLibraryCategory]
        const el = document.createElement('div')
        el.className = 'agentop-card'
        el.style.setProperty('--cat-color', cat.color)
        el.innerHTML = `
          <div class="agentop-card-inner">
            <div class="agentop-card-n">${item.n}</div>
            <div class="agentop-card-symbol">${item.symbol}</div>
            <div class="agentop-card-name">${item.name}</div>
            <div class="agentop-card-cat">${cat.label}</div>
          </div>
        `
        const object = new CSS3DObject(el)
        group.add(object)
        objects.push(object)
      })

      // ---- per-layout target positions/rotations + bounding geometry —
      // rebuilt whenever the mobile/desktop table column count changes.
      function buildTargets(isMobile: boolean) {
        const targets: Record<Layout, InstanceType<typeof THREE.Vector3>[]> = {
          table: [],
          sphere: [],
          helix: [],
          grid: [],
        }
        const rotationTargets: Record<Layout, InstanceType<typeof THREE.Euler>[]> = {
          table: [],
          sphere: [],
          helix: [],
          grid: [],
        }
        const IDENTITY = new THREE.Euler(0, 0, 0)

        // -- table: flat grid, cards face the camera directly ----------
        const tableCols = isMobile ? TABLE_COLS_MOBILE : TABLE_COLS_DESKTOP
        const tableRows = Math.ceil(total / tableCols)
        const tableW = (tableCols - 1) * TABLE_SPACING_X
        const tableH = (tableRows - 1) * TABLE_SPACING_Y
        for (let i = 0; i < total; i++) {
          const col = i % tableCols
          const row = Math.floor(i / tableCols)
          const x = col * TABLE_SPACING_X - tableW / 2
          const y = -(row * TABLE_SPACING_Y - tableH / 2)
          targets.table.push(new THREE.Vector3(x, y, 0))
          rotationTargets.table.push(IDENTITY.clone())
        }

        // -- sphere: even Fibonacci-style distribution, faces outward --
        for (let i = 0; i < total; i++) {
          const phi = Math.acos(-1 + (2 * i) / total)
          const theta = Math.sqrt(total * Math.PI) * phi
          const pos = new THREE.Vector3().setFromSphericalCoords(SPHERE_RADIUS, phi, theta)
          targets.sphere.push(pos)
          const dummy = new THREE.Object3D()
          dummy.position.copy(pos)
          dummy.lookAt(pos.clone().multiplyScalar(2))
          rotationTargets.sphere.push(dummy.rotation.clone())
        }

        // -- helix: winds upward, centered vertically, faces outward ---
        for (let i = 0; i < total; i++) {
          const hTheta = i * HELIX_THETA_STEP
          const y = -(i * HELIX_Y_STEP) + (total * HELIX_Y_STEP) / 2
          const pos = new THREE.Vector3(
            HELIX_RADIUS * Math.cos(hTheta),
            y,
            HELIX_RADIUS * Math.sin(hTheta)
          )
          targets.helix.push(pos)
          const dummy = new THREE.Object3D()
          dummy.position.copy(pos)
          dummy.lookAt(new THREE.Vector3(pos.x * 2, pos.y, pos.z * 2))
          rotationTargets.helix.push(dummy.rotation.clone())
        }

        // -- grid: 4x3, two depth layers, cards face the camera --------
        const perLayer = GRID_COLS * GRID_ROWS
        const gridW = (GRID_COLS - 1) * GRID_SPACING
        const gridH = (GRID_ROWS - 1) * GRID_SPACING
        for (let i = 0; i < total; i++) {
          const layer = Math.floor(i / perLayer)
          const j = i % perLayer
          const col = j % GRID_COLS
          const row = Math.floor(j / GRID_COLS)
          const x = col * GRID_SPACING - gridW / 2
          const y = -(row * GRID_SPACING - gridH / 2)
          const z = GRID_DEPTH_GAP / 2 - layer * GRID_DEPTH_GAP
          targets.grid.push(new THREE.Vector3(x, y, z))
          rotationTargets.grid.push(IDENTITY.clone())
        }

        const geometry = {} as Record<Layout, LayoutGeometry>
        for (const layout of LAYOUTS) {
          let maxDist = 0
          let maxForwardZ = 0
          for (const pos of targets[layout]) {
            maxDist = Math.max(maxDist, pos.length())
            maxForwardZ = Math.max(maxForwardZ, pos.z)
          }
          geometry[layout] = {
            boundingRadius: maxDist + CARD_HALF_HEIGHT,
            maxForwardZ: Math.max(0, maxForwardZ),
          }
        }

        return { targets, rotationTargets, geometry }
      }

      function computeCameraZ(geo: LayoutGeometry, aspect: number) {
        const fovRad = (FOV * Math.PI) / 180
        const zFit = geo.boundingRadius / (FILL_FRACTION * Math.tan(fovRad / 2) * Math.min(1, aspect))
        return zFit + geo.maxForwardZ
      }

      let isMobile = mount.clientWidth > 0 && mount.clientWidth < MOBILE_BREAKPOINT
      let layoutData = buildTargets(isMobile)
      let layoutIndex = 0
      let dragPitch = 0

      function currentLayout(): Layout {
        return LAYOUTS[layoutIndex]
      }

      function applyLayout(layout: Layout, animate: boolean) {
        const { clientWidth, clientHeight } = mount
        const aspect = clientWidth && clientHeight ? clientWidth / clientHeight : 1
        const geo = layoutData.geometry[layout]
        const newCameraZ = computeCameraZ(geo, aspect)
        const flat = layout === 'table' || layout === 'grid'

        objects.forEach((object, i) => {
          const pos = layoutData.targets[layout][i]
          const rot = layoutData.rotationTargets[layout][i]
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

        if (!animate) {
          camera.position.z = newCameraZ
        } else {
          new TWEEN.Tween(camera.position)
            .to({ z: newCameraZ }, TWEEN_MS)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
        }

        // Table/grid are flat and must read as centered, not tilted —
        // settle the group back to the nearest full turn on y, and
        // level out any pitch picked up from dragging.
        if (flat) {
          const nearestTurn = Math.round(group.rotation.y / (Math.PI * 2)) * Math.PI * 2
          dragPitch = 0
          if (!animate) {
            group.rotation.set(0, nearestTurn, 0)
          } else {
            new TWEEN.Tween(group.rotation)
              .to({ x: 0, y: nearestTurn }, TWEEN_MS)
              .easing(TWEEN.Easing.Exponential.InOut)
              .start()
          }
        }
      }

      applyLayout(currentLayout(), false)

      // ---- sizing -----------------------------------------------------
      function resize() {
        const { clientWidth, clientHeight } = mount
        if (!clientWidth || !clientHeight) return

        const nowMobile = clientWidth < MOBILE_BREAKPOINT
        if (nowMobile !== isMobile) {
          isMobile = nowMobile
          layoutData = buildTargets(isMobile)
        }

        camera.aspect = clientWidth / clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(clientWidth, clientHeight)

        // applyLayout recomputes camera z itself (using the now-current
        // aspect/layoutData), so it also covers the plain resize case.
        applyLayout(currentLayout(), false)
      }
      resize()
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(mount)
      cleanupFns.push(() => resizeObserver.disconnect())

      // Item 6: render one frame synchronously right after setup, so
      // the cards exist in the DOM immediately — not only once the
      // first requestAnimationFrame happens to fire.
      renderer.render(scene, camera)

      // ---- drag adds extra spin on top of the idle rotation (mouse
      // only — never intercepts touch) ---------------------------------
      let dragging = false
      let lastX = 0
      let lastY = 0
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

      // ---- auto-cycle: table -> sphere -> helix -> grid -> table,
      // every CYCLE_MS, always — never pauses for hover or drag. -------
      let cycleTimer: ReturnType<typeof setTimeout> | null = null

      function tick() {
        cycleTimer = setTimeout(() => {
          layoutIndex = (layoutIndex + 1) % LAYOUTS.length
          applyLayout(currentLayout(), true)
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
        const spinning = currentLayout() === 'sphere' || currentLayout() === 'helix'
        if (spinning) group.rotation.y += delta * IDLE_SPIN_SPEED
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
