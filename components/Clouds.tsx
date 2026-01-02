'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CloudsProps {
  scrollProgress: number
}

export default function Clouds({ scrollProgress }: CloudsProps) {
  const cloudsRef = useRef<THREE.Group>(null)

  // Crear múltiples nubes
  const clouds = useMemo(() => {
    const cloudCount = 8
    const cloudData = []
    
    for (let i = 0; i < cloudCount; i++) {
      cloudData.push({
        position: [
          (Math.random() - 0.5) * 30,
          Math.random() * 10 + 5,
          (Math.random() - 0.5) * 20 - 10
        ],
        scale: 2 + Math.random() * 3,
        opacity: 0.6 + Math.random() * 0.3
      })
    }
    
    return cloudData
  }, [])

  useFrame(() => {
    if (cloudsRef.current) {
      // Las nubes se abren/separan con el scroll
      const openProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) * 2))
      cloudsRef.current.children.forEach((cloudGroup, index) => {
        const originalPos = clouds[index].position
        const spread = openProgress * 15
        cloudGroup.position.x = originalPos[0] + (index % 2 === 0 ? spread : -spread)
        cloudGroup.position.y = originalPos[1] - openProgress * 3
        
        // Acceder a los meshes hijos del grupo para cambiar la opacidad
        cloudGroup.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const material = child.material as THREE.MeshStandardMaterial
            if (material.opacity !== undefined) {
              material.opacity = clouds[index].opacity * (1 - openProgress * 0.8)
            }
          }
        })
      })
    }
  })

  return (
    <group ref={cloudsRef}>
      {clouds.map((cloud, index) => {
        const cloudSpheres = []
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            cloudSpheres.push(
              <mesh
                key={`${index}-${i}-${j}`}
                position={[
                  (i - 1) * 0.8,
                  (j - 1) * 0.3,
                  (i - 1) * 0.3
                ]}
                scale={0.6 + Math.random() * 0.4}
              >
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial
                  color="#ffffff"
                  transparent
                  opacity={cloud.opacity}
                  roughness={0.95}
                  metalness={0}
                />
              </mesh>
            )
          }
        }
        return (
          <group
            key={index}
            position={cloud.position as [number, number, number]}
            scale={cloud.scale}
          >
            {cloudSpheres}
          </group>
        )
      })}
    </group>
  )
}

