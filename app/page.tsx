'use client'

import { Suspense, useState, useEffect } from 'react'
import Scene from '@/components/Scene'
import UI from '@/components/UI'
import Image from 'next/image'
import { 
  FaGift,
  FaHotel,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa'
import { 
  GiFlowerEmblem,
  GiBeveledStar
} from 'react-icons/gi'

// Componente de carrusel para vestimenta
function DressCodeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  
  const images = [
    { src: '/persons/3.png', alt: 'Ejemplo vestimenta 1' },
    { src: '/persons/4.png', alt: 'Ejemplo vestimenta 2' },
    { src: '/persons/5.png', alt: 'Ejemplo vestimenta 3' },
  ]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  // Manejo de gestos táctiles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextImage()
    }
    if (isRightSwipe) {
      prevImage()
    }
  }

  return (
    <div className="dress-code-carousel">
      <div 
        className="carousel-container"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div key={index} className="carousel-item">
            <Image
              src={image.src}
              alt={image.alt}
              width={600}
              height={800}
              style={{ objectFit: 'contain' }}
              priority={index === 0}
              quality={90}
            />
          </div>
        ))}
      </div>
      <div className="carousel-controls">
        <button 
          className="carousel-button"
          onClick={prevImage}
          aria-label="Imagen anterior"
          type="button"
        >
          ‹
        </button>
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
              aria-label={`Ir a imagen ${index + 1}`}
              type="button"
            />
          ))}
        </div>
        <button 
          className="carousel-button"
          onClick={nextImage}
          aria-label="Siguiente imagen"
          type="button"
        >
          ›
        </button>
      </div>
      <div style={{ 
        textAlign: 'center', 
        marginTop: '0.5rem', 
        fontSize: '0.875rem', 
        color: '#8b7355',
        fontWeight: 500
      }}>
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800

  // El texto inicial aparece al inicio (opacidad 1) y desaparece al hacer scroll
  const textOpacity = Math.max(0, 1 - scrollY / 500)

  // La imagen aparece, se mantiene fija durante un scroll completo, y desaparece con la niebla
  const imageStart = windowHeight * 0.5
  const imageFadeIn = 400 // Tiempo para aparecer
  const imageFixedStart = imageStart + imageFadeIn // Empieza a estar fija aquí
  const imageFixedEnd = imageFixedStart + windowHeight // Se mantiene fija durante un viewport height completo

  // Imagen 2.png aparece primero sobre la imagen y título después de cierto scroll
  const image2Start = imageFixedStart + 300 // Aparece después de que la imagen esté fija
  const image2FadeIn = 400
  const image2Duration = windowHeight * 1.2 // Duración visible
  const image2FadeOutStart = image2Start + image2FadeIn + image2Duration

  // Imagen 1.png (loro) aparece simultáneamente con 2.png con animación de amazonía
  const image1Start = image2Start // Aparecen al mismo tiempo
  const image1SlideIn = 600 // Tiempo para deslizarse desde abajo
  const image1Duration = windowHeight * 0.2 // Duración visible muy reducida
  const image1FadeOutStart = image1Start + image1SlideIn + image1Duration
  const image1FadeOut = 400 // Tiempo para desaparecer
  const image1End = image1FadeOutStart + image1FadeOut

  // Niebla ya no se usa - eliminada

  // La imagen de fondo y el título desaparecen junto con el loro
  let imageOpacity = 0
  if (scrollY < imageStart) {
    imageOpacity = 0
  } else if (scrollY < imageFixedStart) {
    imageOpacity = Math.min(1, (scrollY - imageStart) / imageFadeIn)
  } else if (scrollY < image1FadeOutStart) {
    imageOpacity = 1
  } else if (scrollY < image1End) {
    // Desaparece junto con el loro
    const fadeOutProgress = (scrollY - image1FadeOutStart) / image1FadeOut
    imageOpacity = 1 - fadeOutProgress
  } else {
    imageOpacity = 0
  }

  // El título aparece junto con la imagen (mismo tiempo) y desaparece con la niebla
  const titleOpacity = imageOpacity

  // Control de opacidad de imagen 2.png - desaparece junto con el loro
  const image2FadeOut = 400 // Tiempo para desaparecer
  const image2End = image1FadeOutStart + image2FadeOut // Desaparece al mismo tiempo que el loro
  
  let image2Opacity = 0
  if (scrollY < image2Start) {
    image2Opacity = 0
  } else if (scrollY < image2Start + image2FadeIn) {
    image2Opacity = Math.min(1, (scrollY - image2Start) / image2FadeIn)
  } else if (scrollY < image1FadeOutStart) {
    image2Opacity = 1
  } else if (scrollY < image2End) {
    // Desaparece junto con el loro
    const fadeOutProgress = (scrollY - image1FadeOutStart) / image2FadeOut
    image2Opacity = 1 - fadeOutProgress
  } else {
    image2Opacity = 0
  }

  // Control de opacidad y posición del loro - desaparece antes de la niebla
  // Imagen pair.png aparece inmediatamente después del loro
  const pairImageStart = image1End + 50 // Aparece inmediatamente después del loro
  const pairImageFadeIn = 800 // Más tiempo para que se dibuje bien
  const pairImageDuration = windowHeight * 1.5 // Duración visible aumentada
  const pairImageFadeOut = 400
  const pairImageEnd = pairImageStart + pairImageFadeIn + pairImageDuration + pairImageFadeOut
  
  let pairImageOpacity = 0
  if (scrollY < pairImageStart) {
    pairImageOpacity = 0
  } else if (scrollY < pairImageStart + pairImageFadeIn) {
    pairImageOpacity = Math.min(1, (scrollY - pairImageStart) / pairImageFadeIn)
  } else if (scrollY < pairImageStart + pairImageFadeIn + pairImageDuration) {
    pairImageOpacity = 1
  } else if (scrollY < pairImageEnd) {
    const fadeOutProgress = (scrollY - (pairImageStart + pairImageFadeIn + pairImageDuration)) / pairImageFadeOut
    pairImageOpacity = 1 - fadeOutProgress
  } else {
    pairImageOpacity = 0
  }

  // Sección de información de la boda con fondo blanco
  const weddingInfoStart = pairImageEnd + 200
  const weddingInfoFadeIn = 600
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  // Una vez que la carta aparece, se mantiene visible permanentemente
  let weddingInfoOpacity = 0
  if (scrollY < weddingInfoStart) {
    weddingInfoOpacity = 0
  } else if (scrollY < weddingInfoStart + weddingInfoFadeIn) {
    weddingInfoOpacity = Math.min(1, (scrollY - weddingInfoStart) / weddingInfoFadeIn)
  } else {
    // Una vez que aparece completamente, se mantiene en 1
    weddingInfoOpacity = 1
  }
  
  // Mostrar la carta cuando tiene opacidad suficiente
  const shouldShowWeddingInfo = weddingInfoOpacity > 0.05
  
  // Forzar que pairImage se oculte cuando aparece la carta de la boda
  if (weddingInfoOpacity > 0) {
    pairImageOpacity = 0
  }
  
  let image1Opacity = 1
  let image1TranslateY = windowHeight

  if (scrollY < image1Start) {
    image1Opacity = 0
    image1TranslateY = windowHeight
  } else if (scrollY < image1Start + image1SlideIn) {
    const progress = (scrollY - image1Start) / image1SlideIn
    image1Opacity = 1
    image1TranslateY = windowHeight * (1 - progress)
  } else if (scrollY < image1FadeOutStart) {
    image1Opacity = 1
    image1TranslateY = 0
  } else if (scrollY < image1End) {
    // Desaparece antes de que aparezca la niebla
    const fadeOutProgress = (scrollY - image1FadeOutStart) / image1FadeOut
    image1Opacity = 1 - fadeOutProgress
    image1TranslateY = 0
  } else {
    image1Opacity = 0
    image1TranslateY = 0
  }

  // Nieve aparece después de la información de la boda (después de que la carta esté completamente visible)
  const weddingInfoFullyVisible = weddingInfoStart + weddingInfoFadeIn
  const snowStart = weddingInfoFullyVisible + 200
  const snowFadeIn = 400
  const snowDuration = windowHeight * 1.5
  const snowEnd = snowStart + snowFadeIn + snowDuration

  let snowOpacity = 0
  if (scrollY < snowStart) {
    snowOpacity = 0
  } else if (scrollY < snowStart + snowFadeIn) {
    snowOpacity = Math.min(1, (scrollY - snowStart) / snowFadeIn)
  } else if (scrollY < snowEnd) {
    snowOpacity = 1
  } else {
    snowOpacity = Math.max(0, 1 - (scrollY - snowEnd) / 400)
  }

  // Ocultar canvas cuando aparece la carta de la boda (ocultar completamente desde el inicio)
  const canvasOpacity = weddingInfoOpacity > 0 ? 0 : 1
  const canvasVisibility = weddingInfoOpacity > 0 ? 'hidden' : 'visible'
  
  // Ocultar todas las imágenes anteriores cuando aparece la carta
  const shouldHidePreviousImages = weddingInfoOpacity > 0

  return (
    <main>
      <div 
        id="canvas-container"
        className={canvasOpacity === 0 ? 'hidden' : ''}
        style={{
          opacity: canvasOpacity,
          visibility: canvasVisibility,
          transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
          zIndex: 0,
          pointerEvents: canvasOpacity === 0 ? 'none' : 'auto'
        }}
      >
        <Suspense fallback={null}>
          <Scene scrollY={scrollY} windowHeight={windowHeight} />
        </Suspense>
      </div>
      <UI />
      <div className="scroll-container">
        {/* Texto inicial - aparece al inicio y desaparece con scroll */}
        <div
          className="content-section intro-section"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            opacity: shouldHidePreviousImages ? 0 : textOpacity,
            transition: 'opacity 0.5s ease-out',
            pointerEvents: textOpacity > 0 ? 'auto' : 'none',
            visibility: shouldHidePreviousImages ? 'hidden' : 'visible'
          }}
        >
          <div className="intro-quote">
            <p className="intro-quote-text">
              La Amazonía es la selva tropical más grande y con mayor biodiversidad del planeta.
            </p>
          </div>
        </div>

        {/* Imagen de fondo con título */}
        <div
          className="content-section image-section"
          style={{
            opacity: shouldHidePreviousImages ? 0 : imageOpacity,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            visibility: shouldHidePreviousImages ? 'hidden' : 'visible'
          }}
        >
          <div className="background-image-container">
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, #0283fe 0%, transparent 20%)',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />
            <Image
              src="/fondo.jpg"
              alt="Amazonía"
              fill
              style={{ objectFit: 'cover', zIndex: 0 }}
              priority
              quality={90}
            />
          </div>
          {/* Título sobre la imagen */}
          <div className="title-container" style={{ position: 'relative', zIndex: 10, opacity: titleOpacity }}>
            <div className="title-small">Bienvenidos al</div>
            <div className="title-large">Puyo</div>
          </div>
        </div>

        {/* Imagen 2.png - aparece simultáneamente con 1.png, ocupa todo el ancho */}
        <div
          className="content-section overlay-image-section"
          style={{
            opacity: shouldHidePreviousImages ? 0 : image2Opacity,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 11,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease-in-out',
            overflow: 'hidden',
            visibility: shouldHidePreviousImages ? 'hidden' : 'visible'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%'
          }}>
            <Image
              src="/2.png"
              alt="Overlay 2"
              fill
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
              quality={90}
              sizes="100vw"
            />
          </div>
        </div>

        {/* Imagen 1.png (loro) - aparece simultáneamente sobre 2.png con animación de amazonía */}
        <div
          style={{
            opacity: shouldHidePreviousImages ? 0 : image1Opacity,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 12,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease-in-out',
            overflow: 'hidden',
            transform: `translateY(${image1TranslateY}px)`,
            visibility: shouldHidePreviousImages ? 'hidden' : 'visible'
          }}
        >
          <div
            className="content-section overlay-image-section parrot-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <div
              className="parrot-container"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                minWidth: '100%',
                minHeight: '100%'
              }}
            >
              <Image
                src="/1.png"
                alt="Loro Amazonía"
                fill
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
                quality={90}
                sizes="100vw"
              />
            </div>
          </div>
        </div>

        {/* Imagen pair.png con título estilo National Geographic */}
        {pairImageOpacity > 0 && !shouldHidePreviousImages && (
          <div
            style={{
              opacity: shouldHidePreviousImages ? 0 : pairImageOpacity,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 12.8,
              pointerEvents: 'none',
              transition: 'opacity 0.5s ease-in-out',
              overflow: 'hidden',
              visibility: shouldHidePreviousImages ? 'hidden' : 'visible'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%'
            }}>
              <Image
                src="/pair.png"
                alt="Un viaje que nunca termina"
                fill
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
                quality={90}
                sizes="100vw"
              />
            </div>
            {/* Título estilo National Geographic con animación */}
            {pairImageOpacity > 0.3 && (
              <div className="natgeo-title-container">
                <div className="natgeo-title natgeo-title-animated">
                  UN VIAJE QUE NUNCA TERMINA
                </div>
              </div>
            )}
          </div>
        )}

        {/* Overlay de fondo sólido para ocultar el canvas completamente - debe estar fuera de la sección */}
        {shouldShowWeddingInfo && (
          <div 
            className="wedding-info-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              zIndex: 24,
              opacity: 1,
              pointerEvents: 'none',
              transition: 'opacity 0.6s ease-in-out',
              display: 'block'
            }}
          />
        )}

        {/* Sección de información de la boda con animación de invitación */}
        {shouldShowWeddingInfo && (
        <div
          className="wedding-info-section"
          style={{
            opacity: 1,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 25,
            pointerEvents: weddingInfoOpacity > 0.5 ? 'auto' : 'none',
            transition: 'opacity 0.6s ease-in-out',
            overflow: weddingInfoOpacity > 0.5 ? 'auto' : 'hidden',
            display: 'flex',
            alignItems: weddingInfoOpacity > 0.5 ? 'flex-start' : 'center',
            justifyContent: 'center',
            visibility: 'visible',
            background: 'transparent',
            paddingTop: weddingInfoOpacity > 0.5 ? '2rem' : '0'
          }}
        >
          {/* Sobre cerrado que se abre */}
          {weddingInfoOpacity > 0 && (
            <div 
              className="envelope-container" 
              style={{ 
                position: 'relative', 
                zIndex: 2, 
                width: '100%', 
                height: '100%',
                opacity: 1,
                visibility: 'visible',
                pointerEvents: weddingInfoOpacity > 0.5 ? 'auto' : 'none',
                overflow: weddingInfoOpacity > 0.5 ? 'visible' : 'hidden'
              }}
            >
            <div className="envelope">
              <div className="envelope-back"></div>
              <div className="envelope-front">
                <div className="envelope-flap"></div>
              </div>
            </div>
            
            {/* Carta que aparece después de abrirse el sobre */}
            <div className={`wedding-letter ${weddingInfoOpacity > 0.7 ? 'letter-visible' : ''}`}>
              <div className="letter-paper scrollable-letter">
                {/* Decoración superior */}
                <div className="letter-header-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-flower">
                    <GiFlowerEmblem />
                  </div>
                  <div className="decoration-line"></div>
                </div>
                
                {/* Título principal */}
                <h1 className="letter-main-title">Invitación de Boda</h1>
                
                {/* Decoración central */}
                <div className="letter-divider">
                  <GiBeveledStar />
                </div>
                
                {/* Información de la boda */}
                <div className="letter-content">
                  {/* Fechas */}
                  <div className="letter-info-item">
                    <div className="letter-icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="letter-info-text">
                      <h3 className="letter-label">Fecha</h3>
                      <p className="letter-date">Sábado 31 de Enero</p>
                      <p className="letter-date">Domingo 01 de Febrero</p>
              </div>
            </div>

            {/* Lugar */}
                  <div className="letter-info-item">
                    <div className="letter-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="letter-info-text">
                      <h3 className="letter-label">Lugar</h3>
                      <p className="letter-location">Mirador de Indichuris</p>
                      <p className="letter-location-detail">Puyo, Ecuador</p>
              </div>
            </div>

                  {/* Descripción */}
                  <div className="letter-description">
                    <p className="letter-description-text">
                El Mirador de Indichuris es un lugar mágico ubicado en las alturas de Puyo, 
                que ofrece una vista panorámica impresionante de la selva amazónica y el río Pastaza. 
                Este mirador elevado te permite contemplar la inmensidad de la naturaleza desde una 
                perspectiva única, rodeado de la exuberante vegetación y los sonidos de la selva. 
                Es el escenario perfecto para celebrar este momento especial, donde la belleza natural 
                se combina con la magia del amor.
              </p>
            </div>

                  {/* Código de vestimenta completo */}
                  <div className="dress-code-section">
                    <h2 className="dress-code-main-title">CÓDIGO DE VESTIMENTA</h2>
                    <h3 className="dress-code-subtitle">SEMI-FORMAL ELEGANTE</h3>
                    <p className="dress-code-description">
                      Queremos que luzcan espectaculares y cómodos para disfrutar de nuestra celebración al aire libre.
                    </p>

                    <div className="dress-code-content">
                      {/* Sección ELLOS */}
                      <div className="dress-code-gender-section">
                        <h4 className="dress-code-gender-title">ELLOS</h4>
                        <div className="dress-code-illustration">
                          <Image
                            src="/persons/1.png"
                            alt="Ejemplo vestimenta caballero"
                            width={200}
                            height={300}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                        <ul className="dress-code-list">
                          <li>PANTALÓN FORMAL O DE LINO</li>
                          <li>CAMISA LISA O CON TEXTURA SUTIL</li>
                          <li>SACO OPCIONAL</li>
                          <li>ZAPATOS FORMALES (NO TENIS)</li>
                        </ul>
                      </div>

                      {/* Sección ELLAS */}
                      <div className="dress-code-gender-section">
                        <h4 className="dress-code-gender-title">ELLAS</h4>
                        <div className="dress-code-illustration">
                          <Image
                            src="/persons/2.png"
                            alt="Ejemplo vestimenta dama"
                            width={200}
                            height={300}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                        <ul className="dress-code-list">
                          <li>VESTIDOS MIDI O LARGOS</li>
                          <li>ENTERIZOS ELEGANTES</li>
                          <li>TACONES O SANDALIAS ELEGANTES</li>
                          <li>ACCESORIOS A GUSTO</li>
                        </ul>
                      </div>
                    </div>

                    {/* Paleta de colores */}
                    <div className="color-palette-section">
                      <p className="color-palette-warning">EVITAR EL BLANCO</p>
                      <div className="color-palette">
                        <div className="color-circle" style={{ backgroundColor: '#8B4513' }}></div>
                        <div className="color-circle" style={{ backgroundColor: '#F5DEB3' }}></div>
                        <div className="color-circle" style={{ backgroundColor: '#A0522D' }}></div>
                        <div className="color-circle" style={{ backgroundColor: '#654321' }}></div>
                        <div className="color-circle" style={{ backgroundColor: '#2F4F4F' }}></div>
                        <div className="color-circle" style={{ backgroundColor: '#556B2F' }}></div>
                        <div className="color-circle" style={{ backgroundColor: '#8B0000' }}></div>
                      </div>
                    </div>

                    {/* Carrusel de ejemplos de vestimenta */}
                    <DressCodeCarousel />
                  </div>

                  {/* Sección de reserva de hotel */}
                  <div className="hotel-section">
                    <h2 className="hotel-section-title">
                      <FaHotel className="hotel-icon" />
                      RESERVA DE HOTEL
                    </h2>
                    <p className="hotel-section-important">
                      <FaExclamationTriangle className="warning-icon" />
                      MUY IMPORTANTE
                    </p>
                    <p className="hotel-section-content">
                      Para garantizar tu comodidad y la de todos nuestros invitados, 
                      es muy importante que reserves tu hospedaje con anticipación. 
                      Puyo cuenta con varias opciones de alojamiento que te recomendamos 
                      consultar y reservar lo antes posible para asegurar disponibilidad.
                    </p>
                  </div>

                  {/* Sección de regalos */}
                  <div className="gifts-section">
                    <h2 className="gifts-section-title">
                      <FaGift className="gift-icon" />
                      REGALOS
                    </h2>
                    <div className="gifts-section-hotel-image">
                      <Image
                        src="https://hotelecopark.com/wp-content/uploads/2025/02/DJI_0943-1.jpeg"
                        alt="Hotel Ekopark"
                        width={600}
                        height={400}
                        style={{ 
                          objectFit: 'cover',
                          borderRadius: '12px',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                        }}
                      />
                    </div>
                    <p className="gifts-section-content">
                      Tu presencia es el mejor regalo que podemos recibir. 
                      Si deseas contribuir a nuestra celebración, tu regalo 
                      puede ser ayudarnos con el pago del hospedaje en el 
                      <strong> Hotel Ekopark</strong>, donde nos alojaremos durante 
                      nuestra boda.
                    </p>
                    <p className="gifts-section-content">
                      Cualquier contribución será de gran ayuda para hacer de este 
                      momento aún más especial.
                    </p>
                    <div className="gifts-section-transfer">
                      <p className="gifts-section-transfer-title">Información de Transferencia</p>
                      <div className="gifts-section-bank-info">
                        <p className="gifts-section-bank-name"><strong>Banco:</strong> Produbanco</p>
                        <p className="gifts-section-bank-name"><strong>Titular:</strong> Estefany Illescas</p>
                        <p className="gifts-section-bank-name"><strong>CI:</strong> 1725976755</p>
                        <p className="gifts-section-bank-name"><strong>Tipo de Cuenta:</strong> Ahorros</p>
                        <p className="gifts-section-transfer-amount"><strong>Número de Cuenta:</strong> 20003465207</p>
                      </div>
                      <p className="gifts-section-transfer-details">
                        Puedes realizar tu transferencia por el monto que desees contribuir.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Decoración inferior */}
                <div className="letter-footer-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-flower">
                    <GiFlowerEmblem />
                  </div>
                  <div className="decoration-line"></div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
        )}

        {/* Efecto de nieve después de la información de la boda */}
        <div
          className="snow-container"
          style={{
            opacity: snowOpacity,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 15,
            pointerEvents: 'none',
            overflow: 'hidden'
          }}
        >
          <div className="snowflakes">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="snowflake"
                style={{
                  left: `${(i * 2) % 100}%`,
                  animationDelay: `${(i * 0.1) % 3}s`,
                  animationDuration: `${3 + (i % 3)}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

