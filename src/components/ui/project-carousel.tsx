import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Carousel } from '@ark-ui/react/carousel'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// Derive up to 10 sequential image URLs from the first image URL
function deriveImages(src: string): string[] {
  const match = src.match(/^(.+-)(\d+)(\.jpg)$/i)
  if (!match) return [src]
  const [, base, , ext] = match
  return Array.from({ length: 10 }, (_, i) => `${base}${i + 1}${ext}`)
}

function preloadImages(urls: string[]): Promise<string[]> {
  return new Promise(resolve => {
    const results: { i: number; url: string }[] = []
    let done = 0
    urls.forEach((url, i) => {
      const img = new window.Image()
      img.onload  = () => { results.push({ i, url }); finish() }
      img.onerror = () => { finish() }
      img.src = url
    })
    function finish() {
      done++
      if (done === urls.length) {
        resolve(results.sort((a, b) => a.i - b.i).map(r => r.url))
      }
    }
  })
}

interface Props {
  title: string
  venue: string
  src: string
  onClose: () => void
}

export function ProjectCarousel({ title, venue, src, onClose }: Props) {
  const [images, setImages] = useState<string[]>([])
  const [ready,  setReady]  = useState(false)

  useEffect(() => {
    const candidates = deriveImages(src)
    preloadImages(candidates).then(loaded => {
      setImages(loaded.length ? loaded : [src])
      setReady(true)
    })
  }, [src])

  // Scroll lock + ESC
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const node = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%', maxWidth: '960px',
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '16px 20px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <p style={{
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.72rem', fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '0.07em', textTransform: 'uppercase',
              lineHeight: 1.4,
            }}>
              {title}
            </p>
            {venue && (
              <p style={{
                margin: '3px 0 0',
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                color: 'rgba(0,229,255,0.8)',
                letterSpacing: '0.12em',
              }}>
                {venue}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff', cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginLeft: '12px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.16)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)')}
          >
            <X size={13} />
          </button>
        </div>

        {/* ── Content ── */}
        {!ready ? (
          <div style={{
            height: '440px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 40 40" fill="none" width="40" height="40" style={{ animation: 'spin 1s linear infinite' }}>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              <circle cx="20" cy="20" r="17" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
              <circle cx="20" cy="20" r="17" stroke="rgba(0,229,255,0.7)" strokeWidth="2.5"
                strokeDasharray="44 63" strokeLinecap="round" />
            </svg>
          </div>
        ) : (
          <Carousel.Root
            defaultPage={0}
            slideCount={images.length}
            style={{ position: 'relative', padding: '20px 0 20px' }}
          >
            {/* Slides */}
            <Carousel.ItemGroup style={{ display: 'flex', overflow: 'hidden' }}>
              {images.map((img, i) => (
                <Carousel.Item
                  key={i}
                  index={i}
                  style={{ flex: '0 0 100%', minWidth: 0 }}
                >
                  <img
                    src={img}
                    alt={`${title} ${i + 1}`}
                    style={{
                      width: '100%',
                      height: 'clamp(260px, 55vh, 580px)',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel.ItemGroup>

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <Carousel.PrevTrigger
                  style={{
                    position: 'absolute', top: '50%', left: '14px',
                    transform: 'translateY(-50%)',
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'rgba(10,10,10,0.75)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', cursor: 'pointer', zIndex: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.2s, background 0.2s',
                    backdropFilter: 'blur(6px)',
                  }}
                  onMouseEnter={e => {
                    const b = e.currentTarget as HTMLButtonElement
                    b.style.borderColor = 'rgba(0,229,255,0.5)'
                    b.style.background = 'rgba(0,229,255,0.1)'
                  }}
                  onMouseLeave={e => {
                    const b = e.currentTarget as HTMLButtonElement
                    b.style.borderColor = 'rgba(255,255,255,0.2)'
                    b.style.background = 'rgba(10,10,10,0.75)'
                  }}
                >
                  <ChevronLeft size={18} />
                </Carousel.PrevTrigger>

                <Carousel.NextTrigger
                  style={{
                    position: 'absolute', top: '50%', right: '14px',
                    transform: 'translateY(-50%)',
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'rgba(10,10,10,0.75)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', cursor: 'pointer', zIndex: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.2s, background 0.2s',
                    backdropFilter: 'blur(6px)',
                  }}
                  onMouseEnter={e => {
                    const b = e.currentTarget as HTMLButtonElement
                    b.style.borderColor = 'rgba(0,229,255,0.5)'
                    b.style.background = 'rgba(0,229,255,0.1)'
                  }}
                  onMouseLeave={e => {
                    const b = e.currentTarget as HTMLButtonElement
                    b.style.borderColor = 'rgba(255,255,255,0.2)'
                    b.style.background = 'rgba(10,10,10,0.75)'
                  }}
                >
                  <ChevronRight size={18} />
                </Carousel.NextTrigger>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <Carousel.IndicatorGroup
                style={{
                  display: 'flex', justifyContent: 'center',
                  gap: '7px', marginTop: '16px', padding: '0 20px',
                }}
              >
                {images.map((_, i) => (
                  <Carousel.Indicator
                    key={i}
                    index={i}
                    style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.22)',
                      border: 'none', padding: 0, cursor: 'pointer',
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                    className="pc-dot"
                  />
                ))}
              </Carousel.IndicatorGroup>
            )}
          </Carousel.Root>
        )}

        {/* Footer counter */}
        {ready && images.length > 1 && (
          <div style={{
            textAlign: 'center', padding: '0 20px 14px',
            fontFamily: 'monospace', fontSize: '0.58rem',
            color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em',
          }}>
            {images.length} IMAGES · CLICK OUTSIDE OR ESC TO CLOSE
          </div>
        )}
      </div>

      {/* Dot active state */}
      <style>{`
        .pc-dot[data-current] {
          background: rgba(0,229,255,0.9) !important;
          transform: scale(1.3);
        }
      `}</style>
    </div>
  )

  return createPortal(node, document.body)
}
