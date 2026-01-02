'use client'

import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface AmazonModel3DProps {
  scrollProgress: number
}

// Modelo 3D de montañas usando geometría procedimental mejorada que ocupa toda la pantalla
function MountainModel({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRefs = useRef<THREE.Mesh[]>([])

  // Crear múltiples montañas que ocupen toda la pantalla
  const mountains = useMemo(() => {
    const count = 7
    const mountainData = []
    
    for (let i = 0; i < count; i++) {
      const width = 25 + Math.random() * 15
      const height = 12 + Math.random() * 10
      const segments = 64
      
      const geometry = new THREE.ConeGeometry(width, height, segments, segments)
      const positions = geometry.attributes.position.array as Float32Array
      
      // Modificar la geometría para hacerla más orgánica
      for (let j = 0; j < positions.length; j += 3) {
        const x = positions[j]
        const y = positions[j + 1]
        const z = positions[j + 2]
        
        // Agregar variación orgánica
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2
        positions[j] += noise * 0.3
        positions[j + 2] += noise * 0.3
      }
      
      geometry.computeVertexNormals()
      
      mountainData.push({
        geometry,
        position: [
          (i - count/2) * 18 + (Math.random() - 0.5) * 5,
          -8,
          -20 - i * 3 - Math.random() * 5
        ],
        rotation: [0, (Math.random() - 0.5) * 0.3, 0],
        color: i < 3 ? '#2d4a2d' : i < 5 ? '#3a5a3a' : '#4a6a4a'
      })
    }
    
    return mountainData
  }, [])

  useFrame(() => {
    if (meshRefs.current.length > 0) {
      const appearProgress = Math.max(0, Math.min(1, (scrollProgress - 0.7) * 3))
      meshRefs.current.forEach((mesh) => {
        if (mesh) {
          const material = mesh.material as THREE.MeshStandardMaterial
          if (material) {
            material.opacity = appearProgress
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
      {mountains.map((mountain, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) meshRefs.current[index] = el
          }}
          geometry={mountain.geometry}
          position={mountain.position as [number, number, number]}
          rotation={mountain.rotation as [number, number, number]}
        >
          <meshStandardMaterial
            color={mountain.color}
            transparent
            opacity={0}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function AmazonModel3D({ scrollProgress }: AmazonModel3DProps) {
  return (
    <Suspense fallback={null}>
      <MountainModel scrollProgress={scrollProgress} />
    </Suspense>
  )
}

