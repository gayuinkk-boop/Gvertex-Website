'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Suppress THREE.Clock warnings
if (typeof window !== 'undefined') {
  const originalWarn = console.warn
  console.warn = (...args) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('THREE.Clock') || args[0].includes('THREE.Timer'))
    ) {
      return
    }
    originalWarn(...args)
  }
}

// 3D Cyber Blueprint Terrain Grid
function CyberTerrain() {
  const meshRef = useRef<THREE.LineSegments>(null)
  const pointsRef = useRef<THREE.Points>(null)

  // Track cursor coordinates for interactive displacement waves
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Create a mesh plane for coordinates
  const widthSegments = 30
  const heightSegments = 30
  const width = 45
  const height = 45

  const [positions, indices] = useMemo(() => {
    const pos = []
    const idx = []

    // Generate grid vertices
    for (let j = 0; j <= heightSegments; j++) {
      const y = (j / heightSegments) * height - height / 2
      for (let i = 0; i <= widthSegments; i++) {
        const x = (i / widthSegments) * width - width / 2
        pos.push(x, y, 0)
      }
    }

    // Connect vertical and horizontal lines for cyber-grid layout
    for (let j = 0; j < heightSegments; j++) {
      for (let i = 0; i < widthSegments; i++) {
        const row1 = j * (widthSegments + 1)
        const row2 = (j + 1) * (widthSegments + 1)

        // Horizontal line connection
        idx.push(row1 + i, row1 + i + 1)
        // Vertical line connection
        idx.push(row1 + i, row2 + i)
      }
    }

    return [new Float32Array(pos), new Uint16Array(idx)]
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (!meshRef.current || !pointsRef.current) return

    const lineGeo = meshRef.current.geometry
    const pointsGeo = pointsRef.current.geometry

    const linePos = lineGeo.attributes.position.array as Float32Array
    const pointsPos = pointsGeo.attributes.position.array as Float32Array

    const totalPoints = (widthSegments + 1) * (heightSegments + 1)

    for (let idx = 0; idx < totalPoints; idx++) {
      const x = pointsPos[idx * 3]
      const y = pointsPos[idx * 3 + 1]

      // Futuristic radar sweeps combined with a multi-layered wave formula
      let z = Math.sin(x * 0.25 + time * 0.4) * Math.cos(y * 0.25 + time * 0.4) * 1.5
      z += Math.sin(x * 0.08 - time * 0.2) * 1.0 // Deep swell
      z += Math.cos(y * 0.4 + time * 0.8) * 0.3  // High-frequency ripple

      // Mouse interactive warp (depresses the landscape slightly near pointer)
      const dx = x - mouse.current.x * 12
      const dy = y - mouse.current.y * 8
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 6) {
        z += (6 - dist) * 0.4 // Lift/warp terrain near cursor
      }

      // Write values back to attributes
      pointsPos[idx * 3 + 2] = z
    }

    // Synchronize lines with points geometry
    let lineIdx = 0
    for (let idx = 0; idx < totalPoints; idx++) {
      linePos[idx * 3] = pointsPos[idx * 3]
      linePos[idx * 3 + 1] = pointsPos[idx * 3 + 1]
      linePos[idx * 3 + 2] = pointsPos[idx * 3 + 2]
    }

    lineGeo.attributes.position.needsUpdate = true
    pointsGeo.attributes.position.needsUpdate = true
  })

  return (
    <group position={[0, -4, -4]} rotation={[-Math.PI / 2.3, 0, 0]}>
      {/* 1. Futuristic Glowing Grid Lines */}
      <lineSegments ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
            itemSize={3}
            array={positions}
          />
          <bufferAttribute
            attach="index"
            args={[indices, 1]}
            count={indices.length}
            itemSize={1}
            array={indices}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0E7C7B"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 2. Cyber Coordinates Dot Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#8FE3D0"
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

// Drifting vertical data nodes (simulating data flowing through cloud pipelines)
function FloatingDataStreams({ count = 150 }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const phs = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35      // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20  // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5 // Z
      spd[i] = 0.02 + Math.random() * 0.04
      phs[i] = Math.random() * Math.PI * 2
    }
    return [pos, spd, phs]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const posArr = geo.attributes.position.array as Float32Array
    const time = state.clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] -= speeds[i] // downward flow
      posArr[i * 3] += Math.sin(time * 0.3 + phases[i]) * 0.005 // drift

      // Recycle at top
      if (posArr[i * 3 + 1] < -10) {
        posArr[i * 3 + 1] = 10
        posArr[i * 3] = (Math.random() - 0.5) * 35
      }
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#8FE3D0"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Camera parallax manager based on page scroll
function ParallaxCamera() {
  const scrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame((state) => {
    // Parallax scroll targets
    const targetY = -scrollY.current * 0.003
    const targetZ = 8 + scrollY.current * 0.001

    // Smooth camera movements
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)
    state.camera.lookAt(0, -2, -3)
  })

  return null
}

export default function CanvasBackground() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full bg-transparent overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        {/* Parallax scroll camera controller */}
        <ParallaxCamera />

        {/* 3D Cyber blueprint terrain landscape */}
        <CyberTerrain />

        {/* Floating background data bits */}
        <FloatingDataStreams count={150} />
      </Canvas>
    </div>
  )
}
