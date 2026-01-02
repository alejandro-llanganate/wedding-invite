'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RealisticMountainsProps {
  scrollProgress: number
}

export default function RealisticMountains({ scrollProgress }: RealisticMountainsProps) {
  const mountainsRef = useRef<THREE.Group>(null)

  // Crear montañas realistas usando noise
  const mountains = useMemo(() => {
    const mountainCount = 3
    const mountainData = []
    
    for (let i = 0; i < mountainCount; i++) {
      const segments = 64
      const geometry = new THREE.PlaneGeometry(20, 15, segments, segments)
      const positions = geometry.attributes.position.array as Float32Array
      
      // Aplicar noise para crear forma de montaña realista
      for (let j = 0; j < positions.length; j += 3) {
        const x = positions[j]
        const z = positions[j + 1]
        
        // Crear forma de montaña con múltiples picos usando funciones de distancia
        const centerX = (i - 1) * 12
        const distance = Math.sqrt((x - centerX) ** 2 + z ** 2)
        
        // Altura base de la montaña
        let height = Math.max(0, 6 - distance * 0.4)
        
        // Agregar variación con noise
        const noise1 = Math.sin(x * 0.2 + i) * Math.cos(z * 0.2) * 1.5
        const noise2 = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.8
        const noise3 = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2
        
        height += noise1 + noise2 + noise3
        
        // Crear picos más pronunciados
        if (distance < 3) {
          height += (3 - distance) * 1.5
        }
        
        positions[j + 2] = height
      }
      
      geometry.computeVertexNormals()
      
      mountainData.push({
        geometry,
        position: [(i - 1) * 12, -5, -15 - i * 2],
        color: i === 1 ? '#2d4a2d' : '#3a5a3a'
      })
    }
    
    return mountainData
  }, [])

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
    <group ref={mountainsRef}>
      {mountains.map((mountain, index) => (
        <mesh
          key={index}
          geometry={mountain.geometry}
          position={mountain.position as [number, number, number]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial
            color={mountain.color}
            transparent
            opacity={0}
            roughness={0.9}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}







