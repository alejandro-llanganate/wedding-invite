'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FogProps {
  scrollProgress: number
}

export default function Fog({ scrollProgress }: FogProps) {
  const fogRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (fogRef.current) {
      // La neblina se disipa con el scroll, pero más gradualmente
      const fadeProgress = Math.max(0, Math.min(1, scrollProgress * 1.5))
      const material = fogRef.current.material as THREE.MeshStandardMaterial
      // La neblina empieza más visible y se disipa gradualmente, pero menos opaca
      material.opacity = 0.3 * (1 - fadeProgress * 0.7)
    }
  })

  return (
    <mesh ref={fogRef} position={[0, 0, -5]}>
      <planeGeometry args={[50, 30]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

