'use client'

import { useState, useEffect } from 'react'

export default function UI() {
  const [showIndicator, setShowIndicator] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Ocultar después de 300px de scroll (aproximadamente después de la primera sección)
      if (window.scrollY > 300) {
        setShowIndicator(false)
      } else {
        setShowIndicator(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!showIndicator) return null

  return (
    <>
      <div className="scroll-indicator">
        <div>Desliza para abajo</div>
        <div className="scroll-line"></div>
      </div>
    </>
  )
}








