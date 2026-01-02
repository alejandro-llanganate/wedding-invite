'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StarFieldProps {
  scrollProgress: number
}

export default function StarField({ scrollProgress }: StarFieldProps) {
  const starsRef = useRef<THREE.Points>(null)

  const { initialPositions, colors, velocities } = useMemo(() => {
    const count = 10000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const velocities = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribuir estrellas en un área amplia, más concentradas arriba
      const x = (Math.random() - 0.5) * 100
      const y = Math.random() * 60 + 10 // Empezar desde arriba
      const z = (Math.random() - 0.5) * 100

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Velocidad de caída variable para cada estrella (muy lento, como estrellas en neblina)
      velocities[i] = 0.05 + Math.random() * 0.15

      // Colores variados (blanco, azul claro) - más brillantes
      const color = new THREE.Color()
      const intensity = 0.7 + Math.random() * 0.3
      color.setRGB(intensity, intensity, intensity + Math.random() * 0.2)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { initialPositions: positions, colors, velocities }
  }, [])

  useFrame((state, delta) => {
    if (starsRef.current) {
      const geometry = starsRef.current.geometry
      const positionAttribute = geometry.attributes.position as THREE.BufferAttribute
      
      if (positionAttribute) {
        const positions = positionAttribute.array as Float32Array
        
        // Hacer que las estrellas caigan muy lentamente hacia abajo (como en neblina)
        for (let i = 0; i < positions.length; i += 3) {
          const starIndex = i / 3
          // Mover hacia abajo (eje Y negativo) - muy lento, como estrellas en neblina
          positions[i + 1] -= velocities[starIndex] * delta * 0.3
          
          // Si la estrella cae demasiado abajo, reiniciarla arriba
          if (positions[i + 1] < -20) {
            positions[i] = (Math.random() - 0.5) * 100
            positions[i + 1] = 60 + Math.random() * 20
            positions[i + 2] = (Math.random() - 0.5) * 100
          }
        }
        
        // Actualizar la geometría
        positionAttribute.needsUpdate = true
      }
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={initialPositions.length / 3}
          array={initialPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
