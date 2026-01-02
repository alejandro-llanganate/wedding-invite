'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Mountains2DProps {
  scrollProgress: number
}

export default function Mountains2D({ scrollProgress }: Mountains2DProps) {
  const mountainsRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (mountainsRef.current) {
      const appearProgress = Math.max(0, Math.min(1, (scrollProgress - 0.7) * 3))
      mountainsRef.current.children.forEach((mountain) => {
        const material = (mountain as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (material) {
          material.opacity = appearProgress
        }
      })
    }
  })

  return (
    <group ref={mountainsRef} position={[0, -3, -12]}>
      {/* Montaña izquierda */}
      <mesh position={[-8, 0, 0]}>
        <planeGeometry args={[12, 8, 1, 1]} />
        <meshStandardMaterial
          color="#2d4a2d"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Montaña centro */}
      <mesh position={[0, 1, -1]}>
        <planeGeometry args={[14, 10, 1, 1]} />
        <meshStandardMaterial
          color="#3a5a3a"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Montaña derecha */}
      <mesh position={[8, 0, -2]}>
        <planeGeometry args={[10, 7, 1, 1]} />
        <meshStandardMaterial
          color="#2d4a2d"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

