'use client'

import { useRef, Suspense, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AmazonLandscapeProps {
  scrollProgress: number
}

// Modelo de montañas/terreno usando geometría procedimental mejorada
function TerrainModel({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Crear terreno más grande y detallado
  const terrainGeometry = useMemo(() => {
    const width = 60
    const height = 50
    const segmentsW = 100
    const segmentsH = 80
    const geometry = new THREE.PlaneGeometry(width, height, segmentsW, segmentsH)
    const positions = geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 1]
      
      // Crear múltiples sistemas montañosos
      let y = 0
      
      // Montaña principal 1
      const dist1 = Math.sqrt((x - 8) ** 2 + (z - 5) ** 2)
      y += Math.max(0, 10 - dist1 * 0.4) * 0.9
      
      // Montaña principal 2
      const dist2 = Math.sqrt((x + 8) ** 2 + (z + 3) ** 2)
      y += Math.max(0, 9 - dist2 * 0.38) * 0.8
      
      // Montaña principal 3 (centro)
      const dist3 = Math.sqrt(x ** 2 + (z - 2) ** 2)
      y += Math.max(0, 11 - dist3 * 0.42) * 1.0
      
      // Montañas secundarias
      const dist4 = Math.sqrt((x - 15) ** 2 + (z + 8) ** 2)
      y += Math.max(0, 7 - dist4 * 0.35) * 0.6
      
      const dist5 = Math.sqrt((x + 15) ** 2 + (z - 8) ** 2)
      y += Math.max(0, 8 - dist5 * 0.36) * 0.7
      
      // Noise detallado para textura
      const noise1 = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 2.5
      const noise2 = Math.sin(x * 0.25) * Math.cos(z * 0.25) * 1.2
      const noise3 = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 4
      const noise4 = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.8
      
      y += noise1 + noise2 + noise3 + noise4
      
      // Suavizar bordes
      const edgeX = Math.min(Math.abs(x + width/2), Math.abs(x - width/2))
      const edgeZ = Math.min(Math.abs(z + height/2), Math.abs(z - height/2))
      const edgeDist = Math.min(edgeX, edgeZ)
      if (edgeDist < 5) {
        y *= edgeDist / 5
      }
      
      positions[i + 2] = y
    }
    
    geometry.computeVertexNormals()
    return geometry
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      const appearProgress = Math.max(0, Math.min(1, (scrollProgress - 0.7) * 3))
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      if (material) {
        material.opacity = appearProgress
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, -12, -30]} scale={[1.8, 1.8, 1.8]}>
      {/* Terreno base */}
      <mesh
        ref={meshRef}
        geometry={terrainGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#2d4a2d"
          transparent
          opacity={0}
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Capa de vegetación densa */}
      <mesh
        geometry={terrainGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.2, 0]}
      >
        <meshStandardMaterial
          color="#1a3a1a"
          transparent
          opacity={0.5}
          roughness={0.95}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Capa superior de árboles/vegetación */}
      <mesh
        geometry={terrainGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.4, 0]}
      >
        <meshStandardMaterial
          color="#0f2a0f"
          transparent
          opacity={0.3}
          roughness={1}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function AmazonLandscape({ scrollProgress }: AmazonLandscapeProps) {
  return (
    <Suspense fallback={null}>
      <TerrainModel scrollProgress={scrollProgress} />
    </Suspense>
  )
}
