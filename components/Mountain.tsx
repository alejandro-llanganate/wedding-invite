'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MountainProps {
  scrollProgress: number
}

export default function Mountain({ scrollProgress }: MountainProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Crear geometría de montaña más realista
  const geometry = useMemo(() => {
    const segments = 80
    const geometry = new THREE.PlaneGeometry(30, 30, segments, segments)
    
    const positions = geometry.attributes.position.array as Float32Array
    
    // Crear forma de montaña con múltiples picos
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 1]
      
      // Múltiples picos de montaña
      const distance1 = Math.sqrt((x - 3) * (x - 3) + (z - 2) * (z - 2))
      const height1 = Math.max(0, 8 - distance1 * 0.4)
      
      const distance2 = Math.sqrt((x + 4) * (x + 4) + (z + 3) * (z + 3))
      const height2 = Math.max(0, 6 - distance2 * 0.35)
      
      const distance3 = Math.sqrt((x - 2) * (x - 2) + (z + 5) * (z + 5))
      const height3 = Math.max(0, 7 - distance3 * 0.38)
      
      // Combinar alturas y agregar variación
      const baseHeight = Math.max(height1, height2, height3)
      const noise = (Math.sin(x * 0.3) * Math.cos(z * 0.3) + 
                     Math.sin(x * 0.7) * Math.cos(z * 0.7) * 0.5) * 1.5
      
      positions[i + 2] = baseHeight + noise
    }
    
    geometry.computeVertexNormals()
    return geometry
  }, [])

  useFrame(() => {
    if (groupRef.current && meshRef.current) {
      // La montaña aparece gradualmente con el scroll
      const targetY = -8 + scrollProgress * 5
      groupRef.current.position.y = targetY
      
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.opacity = Math.max(0, Math.min(1, (scrollProgress - 0.2) * 1.5))
    }
  })

  return (
    <group ref={groupRef} position={[0, -8, 0]}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#e8f4f8"
          transparent
          opacity={0}
          roughness={0.9}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Capa adicional para nieve en los picos */}
      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.1, 0]}
      >
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

