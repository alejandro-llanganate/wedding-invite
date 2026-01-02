'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SunsetProps {
  scrollProgress: number
}

export default function Sunset({ scrollProgress }: SunsetProps) {
  const sunRef = useRef<THREE.Mesh>(null)
  const skyRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (sunRef.current && skyRef.current) {
      // El sol se mueve hacia abajo (atardecer) solo cuando scrollProgress es alto
      const sunsetProgress = Math.max(0, Math.min(1, (scrollProgress - 0.7) * 2))
      sunRef.current.position.y = 8 - sunsetProgress * 12
      const sunMaterial = sunRef.current.material as THREE.MeshStandardMaterial
      sunMaterial.opacity = sunsetProgress > 0 ? (1 - sunsetProgress * 0.3) : 0
      
      const skyMaterial = skyRef.current.material as THREE.MeshStandardMaterial
      skyMaterial.opacity = sunsetProgress * 0.3
    }
  })

  return (
    <>
      {/* Sol */}
      <mesh ref={sunRef} position={[0, 8, -15]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#ffaa44"
          emissive="#ff8844"
          emissiveIntensity={1}
          transparent
          opacity={0}
        />
      </mesh>
      
      {/* Gradiente de cielo para atardecer */}
      <mesh ref={skyRef} position={[0, 0, -20]}>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial
          color="#ff8844"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}

