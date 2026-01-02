'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import StarField from './StarField'
import AmazonModel3D from './AmazonModel3D'
import Sunset from './Sunset'

function CameraController({ cameraY, cameraZ }: { cameraY: number; cameraZ: number }) {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(0, cameraY, cameraZ)
    camera.lookAt(0, cameraY - 2, 0)
  }, [camera, cameraY, cameraZ])
  
  return null
}

interface SceneProps {
  scrollY: number
  windowHeight: number
}

export default function Scene({ scrollY, windowHeight }: SceneProps) {
  // Calcular cuándo deben aparecer las montañas y el atardecer
  const imageStart = windowHeight * 0.5
  const imageFadeIn = 400
  const imageFixedStart = imageStart + imageFadeIn
  const imageFixedEnd = imageFixedStart + windowHeight
  const imageFadeOut = 600
  const fogTransitionStart = imageFixedEnd + imageFadeOut
  const mountainsStart = fogTransitionStart + 400
  
  // Solo mostrar montañas y atardecer después de que empiecen a aparecer
  const shouldShowMountains = scrollY >= mountainsStart - 200
  
  // Calcular posición de la cámara basada en el scroll
  const maxScroll = windowHeight * 8
  const scrollProgress = Math.min(scrollY / maxScroll, 1)
  
  // La cámara se mueve desde arriba (vista del cielo) hacia abajo
  const cameraY = 10 - scrollProgress * 8
  const cameraZ = 5 + scrollProgress * 3

  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      camera={{ position: [0, cameraY, cameraZ], fov: 75, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
    >
      <CameraController cameraY={cameraY} cameraZ={cameraZ} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      {shouldShowMountains && <pointLight position={[0, 8, -15]} intensity={2} color="#ffaa44" />}
      
      <StarField scrollProgress={scrollProgress} />
      {shouldShowMountains && (
        <>
          <Sunset scrollProgress={scrollProgress} />
          <AmazonModel3D scrollProgress={scrollProgress} />
        </>
      )}
    </Canvas>
  )
}

