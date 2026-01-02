'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MountainsProps {
  scrollProgress: number
}

export default function Mountains({ scrollProgress }: MountainsProps) {
  const mountainsRef = useRef<THREE.Group>(null)

  // Crear múltiples montañas
  const mountains = useMemo(() => {
    const mountainCount = 5
    const mountainData = []
    
    for (let i = 0; i < mountainCount; i++) {
      mountainData.push({
        position: [
          (i - 2) * 8,
          -3,
          -10 - i * 3
        ],
        width: 6 + Math.random() * 4,
        height: 4 + Math.random() * 3,
        color: i < 2 ? '#4a5a3a' : '#3a4a2a'
      })
    }
    
    return mountainData
  }, [])

  useFrame(() => {
    if (mountainsRef.current) {
      // Las montañas aparecen gradualmente solo cuando scrollProgress es alto
      const appearProgress = Math.max(0, Math.min(1, (scrollProgress - 0.7) * 3))
      mountainsRef.current.children.forEach((mountain, index) => {
        const material = (mountain as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (material) {
          material.opacity = appearProgress
        }
      })
    }
  })

  return (
    <group ref={mountainsRef}>
      {mountains.map((mountain, index) => (
        <mesh
          key={index}
          position={mountain.position as [number, number, number]}
        >
          <coneGeometry args={[mountain.width, mountain.height, 8]} />
          <meshStandardMaterial
            color={mountain.color}
            transparent
            opacity={0}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

