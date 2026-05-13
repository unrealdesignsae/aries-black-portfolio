import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Play, Pause, X, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize2, Minimize2, ChevronDown, RotateCcw } from 'lucide-react'
import { R2_CDN } from '../../lib/cdn'

const PROJECT_FILES = [
  'video_1.mp4',  'video_2.mp4',  'video_3.mp4',  'video_4.mp4',
  'video_5.mp4',  'video_6.mp4',  'video_7.mp4',  'video_8.mp4',
  'video_9.mp4',  'video_10.mp4', 'video_11.mp4', 'video_12.mp4',
  'video_13.mp4', 'video_14.mp4', 'video_15.mp4', 'video_16.mp4',
  'video_17.mp4', 'video_18.mp4', 'video_19.mp4', 'video_20.mp4',
  'video_21.mp4', 'video_22.mp4', 'video_23.mp4', 'video_24.mp4',
  'video_25.mp4', 'video_26.mp4', 'video_27.mp4', 'video_28.mp4',
]

const PROJECTS: { name: string; year: string }[] = [
  { name: 'Kings Cup Festival',          year: '2025' },
  { name: 'Hakura Cinematic Scene',      year: '2025' },
  { name: 'Imtiaz Coca-Cola Arena',      year: '2024' },
  { name: 'Roshn Cup Final Ceremony',    year: '2026' },
  { name: 'Montblanc Event',             year: '2023' },
  { name: 'Omniyat Launch Event',        year: '2024' },
  { name: 'Al Sharjah WIC',             year: '2026' },
  { name: 'Aries Black Showreel',        year: '2026' },
  { name: 'Hotel Design South Africa',   year: '2024' },
  { name: 'Kings Cup Final',             year: '2026' },
  { name: 'Samurai Cinematic Scene',     year: '2025' },
  { name: 'AlQadsiah Festival',          year: '2026' },
  { name: 'Burj Al Arab NYE',            year: '2024' },
  { name: 'Piaget Watches & Wonders',    year: '2024' },
  { name: 'Radamis Water Leisure',       year: '2025' },
  { name: 'Dubai Police Event',          year: '2025' },
  { name: 'NGSC',                        year: '2026' },
  { name: 'Saudi Game Awards',           year: '2024' },
  { name: 'Saudi Media Forum',           year: '2025' },
  { name: 'Imtiaz Launching Event',      year: '2024' },
  { name: 'Omniyat Lana Opening',        year: '2024' },
  { name: 'Taqdeer Awarding Ceremony',   year: '2024' },
  { name: 'AlQadsiah Event',             year: '2025' },
  { name: 'Residential Building AD',     year: '2024' },
  { name: 'Saudi Rally Event',           year: '2025' },
  { name: 'Aries Black Showreel',        year: '2025' },
  { name: 'Piaget Event',                year: '2023' },
  { name: 'Roshn League Final Ceremony', year: '2025' },
]

// ── Poster capture queue ──────────────────────────────────────────────────────
const posterQueue: (() => void)[] = []
let activePosters = 0
const MAX_CONCURRENT = 3

function runNextPoster() {
  if (activePosters >= MAX_CONCURRENT || posterQueue.length === 0) return
  const next = posterQueue.shift()
  if (next) { activePosters++; next() }
}

function isBlackFrame(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  try {
    const data = ctx.getImageData(0, 0, w, h).data
    let sum = 0
    const step = 4 * 8 // sample every 8th pixel for speed
    for (let i = 0; i < data.length; i += step) sum += data[i] + data[i + 1] + data[i + 2]
    const avg = sum / (data.length / step * 3)
    return avg < 8 // treat frames with avg brightness <8/255 as black
  } catch { return false }
}

function capturePoster(src: string): Promise<string | null> {
  return new Promise(resolve => {
    const run = () => {
      const v = document.createElement('video')
      v.src = src
      v.crossOrigin = 'anonymous'
      v.muted = true
      v.playsInline = true
      v.preload = 'metadata'

      const cleanup = () => { v.src = ''; v.load(); activePosters--; runNextPoster() }
      const timeout = setTimeout(() => { cleanup(); resolve(null) }, 20000)

      let attempt = 0
      let bestUrl: string | null = null

      const getSeekPoints = (dur: number) => [
        dur * 0.15,
        dur * 0.35,
        dur * 0.55,
        dur * 0.75,
        Math.min(2, dur * 0.1),
      ].map(t => Math.max(0.05, Math.min(t, dur - 0.05)))

      const tryCapture = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = 640; canvas.height = 360
          const ctx = canvas.getContext('2d', { willReadFrequently: true })
          if (!ctx) { clearTimeout(timeout); cleanup(); resolve(null); return }
          ctx.drawImage(v, 0, 0, 640, 360)
          const url = canvas.toDataURL('image/jpeg', 0.82)
          const valid = url && url.length > 500

          if (valid && !isBlackFrame(ctx, 640, 360)) {
            clearTimeout(timeout); cleanup(); resolve(url); return
          }
          if (valid && !bestUrl) bestUrl = url

          // Try next seek point
          const points = getSeekPoints(v.duration)
          attempt++
          if (attempt < points.length) {
            v.addEventListener('seeked', tryCapture, { once: true })
            v.currentTime = points[attempt]
          } else {
            clearTimeout(timeout); cleanup(); resolve(bestUrl)
          }
        } catch { clearTimeout(timeout); cleanup(); resolve(bestUrl) }
      }

      v.addEventListener('loadedmetadata', () => {
        const points = getSeekPoints(v.duration)
        v.currentTime = points[0]
      }, { once: true })
      v.addEventListener('seeked', tryCapture, { once: true })
      v.addEventListener('error', () => { clearTimeout(timeout); cleanup(); resolve(null) }, { once: true })
      v.load()
    }
    posterQueue.push(run)
    runNextPoster()
  })
}

function usePoster(src: string) {
  const [poster, setPoster] = useState('')
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let cancelled = false
    capturePoster(src).then(r => {
      if (cancelled) return
      if (r) setPoster(r); else setFailed(true)
    })
    return () => { cancelled = true }
  }, [src])
  return { poster, failed }
}

function fmt(s: number) {
  if (!isFinite(s) || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

// ── Premium Player Lightbox ───────────────────────────────────────────────────
function PlayerLightbox({
  index, total, onClose, onPrev, onNext,
}: {
  index: number; total: number
  onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  const project = PROJECTS[index] ?? { name: '', year: '' }
  return <PlayerLightboxInner index={index} total={total} title={project.name} year={project.year} onClose={onClose} onPrev={onPrev} onNext={onNext} />
}

function PlayerLightboxInner({
  index, total, title, year, onClose, onPrev, onNext,
}: {
  index: number; total: number; title: string; year: string
  onClose: () => void; onPrev: () => void; onNext: () => void
} {
  const src = `${R2_CDN}/${PROJECT_FILES[index]}`
  const videoRef      = useRef<HTMLVideoElement>(null)
  const containerRef  = useRef<HTMLDivElement>(null)
  const seekRef       = useRef<HTMLDivElement>(null)
  const hideRef       = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrubbingRef  = useRef(false)

  const [playing,   setPlaying]   = useState(false)
  const [curTime,   setCurTime]   = useState(0)
  const [dur,       setDur]       = useState(0)
  const [vol,       setVol]       = useState(1)
  const [muted,     setMuted]     = useState(false)
  const [fullscr,   setFullscr]   = useState(false)
  const [showCtrl,  setShowCtrl]  = useState(true)
  const [waiting,   setWaiting]   = useState(false)
  const [ended,     setEnded]     = useState(false)
  const [buffered,  setBuffered]  = useState(0)       // 0–100 %
  const [hoverPct,  setHoverPct]  = useState<number | null>(null) // 0–100 for tooltip

  // ── Buffered range ──────────────────────────────────────────────────────────
  const updateBuffered = useCallback(() => {
    const v = videoRef.current
    if (!v || !v.duration) { setBuffered(0); return }
    let end = 0
    for (let i = 0; i < v.buffered.length; i++) {
      if (v.buffered.start(i) <= v.currentTime + 0.01) {
        end = Math.max(end, v.buffered.end(i))
      }
    }
    setBuffered((end / v.duration) * 100)
  }, [])

  // ── Toggle play ─────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const v = videoRef.current; if (!v) return
    if (v.paused) v.play().then(() => { setPlaying(true); setEnded(false) }).catch(() => {})
    else { v.pause(); setPlaying(false) }
  }, [])

  // ── Fullscreen ──────────────────────────────────────────────────────────────
  const toggleFs = useCallback(() => {
    const el = containerRef.current
    const v  = videoRef.current
    if (!el || !v) return

    // iOS Safari: fullscreen only works via webkitEnterFullscreen on <video>
    const vAny = v as any
    if (typeof vAny.webkitEnterFullscreen === 'function') {
      if (vAny.webkitDisplayingFullscreen) vAny.webkitExitFullscreen()
      else vAny.webkitEnterFullscreen()
      return
    }

    // Standard + vendor-prefixed Fullscreen API (Android, desktop)
    const elAny = el as any
    const isFs  = !!(document.fullscreenElement || (document as any).webkitFullscreenElement)
    if (!isFs) {
      const req = elAny.requestFullscreen || elAny.webkitRequestFullscreen || elAny.mozRequestFullScreen || elAny.msRequestFullscreen
      req?.call(el).catch(() => {})
    } else {
      const exit = (document as any).exitFullscreen || (document as any).webkitExitFullscreen || (document as any).mozCancelFullScreen || (document as any).msExitFullscreen
      exit?.call(document)
    }
  }, [])

  // ── Mute ────────────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    const v = videoRef.current; if (!v) return
    v.muted = !v.muted; setMuted(v.muted)
  }, [])

  // ── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      { onClose(); return }
      if (e.key === 'ArrowRight')  { e.preventDefault(); onNext() }
      if (e.key === 'ArrowLeft')   { e.preventDefault(); onPrev() }
      if (e.key === ' ')           { e.preventDefault(); togglePlay() }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFs() }
      if (e.key === 'm' || e.key === 'M') toggleMute()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNext, onPrev, togglePlay, toggleFs, toggleMute])

  // ── Lock scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // ── Autoplay on src change ──────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current; if (!v) return
    v.currentTime = 0
    setCurTime(0); setDur(0); setPlaying(false); setBuffered(0); setEnded(false); setWaiting(false)
    v.play().then(() => setPlaying(true)).catch(() => {})
  }, [src])

  // ── Global mouseup (for scrubbing outside seek bar) ─────────────────────────
  useEffect(() => {
    const onUp = () => { scrubbingRef.current = false }
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  // ── Auto-hide controls ──────────────────────────────────────────────────────
  const bump = useCallback(() => {
    setShowCtrl(true)
    if (hideRef.current) clearTimeout(hideRef.current)
    hideRef.current = setTimeout(() => setShowCtrl(false), 3200)
  }, [])

  useEffect(() => {
    if (!playing) { setShowCtrl(true); if (hideRef.current) clearTimeout(hideRef.current) }
    else bump()
    return () => { if (hideRef.current) clearTimeout(hideRef.current) }
  }, [playing, bump])

  // ── Fullscreen sync ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Standard + webkit document events (Android / desktop)
    const onDocFs = () => setFullscr(!!(document.fullscreenElement || (document as any).webkitFullscreenElement))
    document.addEventListener('fullscreenchange', onDocFs)
    document.addEventListener('webkitfullscreenchange', onDocFs)

    // iOS Safari fires these on the video element itself
    const v = videoRef.current
    const onVidFs = () => setFullscr(!!(v as any).webkitDisplayingFullscreen)
    v?.addEventListener('webkitbeginfullscreen', onVidFs)
    v?.addEventListener('webkitendfullscreen',   onVidFs)

    return () => {
      document.removeEventListener('fullscreenchange', onDocFs)
      document.removeEventListener('webkitfullscreenchange', onDocFs)
      v?.removeEventListener('webkitbeginfullscreen', onVidFs)
      v?.removeEventListener('webkitendfullscreen',   onVidFs)
    }
  }, [])

  // ── Volume ──────────────────────────────────────────────────────────────────
  const changeVol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    const v = videoRef.current; if (!v) return
    v.volume = val; setVol(val)
    v.muted = val === 0; setMuted(val === 0)
  }

  // ── Scrub ───────────────────────────────────────────────────────────────────
  const scrubTo = useCallback((clientX: number) => {
    const bar = seekRef.current; const v = videoRef.current
    if (!bar || !v || !dur) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    v.currentTime = ratio * dur; setCurTime(ratio * dur)
  }, [dur])

  // ── Double-click → fullscreen, single → play/pause ─────────────────────────
  const handleVideoClick = useCallback(() => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      toggleFs()
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null
        togglePlay()
      }, 220)
    }
  }, [togglePlay, toggleFs])

  // ── Replay ──────────────────────────────────────────────────────────────────
  const replay = useCallback(() => {
    const v = videoRef.current; if (!v) return
    v.currentTime = 0; setEnded(false)
    v.play().then(() => setPlaying(true)).catch(() => {})
  }, [])

  const pct = dur > 0 ? (curTime / dur) * 100 : 0

  const lightboxNode = (
    <div className="vg-lightbox" onClick={onClose}>
      <div
        ref={containerRef}
        className="vg-player-wrap"
        onClick={e => e.stopPropagation()}
        onMouseMove={bump}
        onMouseLeave={() => playing && setShowCtrl(false)}
      >
        {/* Corner accents */}
        <span className="vg-player-corner vg-player-corner--tl" />
        <span className="vg-player-corner vg-player-corner--br" />

        {/* Close */}
        <button
          className={`vg-player-close ${showCtrl ? 'vis' : ''}`}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={15} />
        </button>

        {/* Title + Counter */}
        <div className={`vg-player-counter ${showCtrl ? 'vis' : ''}`}>
          {title && (
            <span className="vg-player-title">
              {title}
              {year && <span className="vg-player-title-year">{year}</span>}
            </span>
          )}
          <span className="vg-player-counter-num">
            {String(index + 1).padStart(2, '0')}
            <span style={{ opacity: 0.3 }}> / </span>
            {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Prev / Next */}
        <button className={`vg-player-nav vg-player-prev ${showCtrl ? 'vis' : ''}`} onClick={onPrev} aria-label="Previous">
          <ChevronLeft size={20} />
        </button>
        <button className={`vg-player-nav vg-player-next ${showCtrl ? 'vis' : ''}`} onClick={onNext} aria-label="Next">
          <ChevronRight size={20} />
        </button>

        {/* Video */}
        <video
          ref={videoRef}
          className="vg-player-video"
          src={src}
          playsInline
          onClick={handleVideoClick}
          onTimeUpdate={() => {
            if (!scrubbingRef.current && videoRef.current) {
              setCurTime(videoRef.current.currentTime)
              updateBuffered()
            }
          }}
          onLoadedMetadata={() => { if (videoRef.current) setDur(videoRef.current.duration) }}
          onEnded={() => { setPlaying(false); setEnded(true); setShowCtrl(true) }}
          onWaiting={() => setWaiting(true)}
          onCanPlay={() => setWaiting(false)}
          onPlaying={() => { setWaiting(false); setEnded(false) }}
          onProgress={updateBuffered}
        />

        {/* Loading spinner */}
        <div className={`vg-player-spinner ${waiting ? 'vg-player-spinner--vis' : ''}`}>
          <svg viewBox="0 0 40 40" fill="none" className="vg-spin-svg">
            <circle cx="20" cy="20" r="17" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
            <circle
              cx="20" cy="20" r="17"
              stroke="rgba(0,229,255,0.85)"
              strokeWidth="2.5"
              strokeDasharray="44 63"
              strokeLinecap="round"
              strokeDashoffset="0"
            />
          </svg>
        </div>

        {/* Ended replay overlay */}
        {ended && (
          <div className="vg-player-ended" onClick={replay}>
            <RotateCcw size={28} strokeWidth={1.5} />
            <span>Replay</span>
          </div>
        )}

        {/* Big play overlay (paused, not ended, not waiting) */}
        {!playing && !ended && !waiting && (
          <div className="vg-player-center-play vis" onClick={togglePlay}>
            <Play size={32} fill="white" strokeWidth={0} />
          </div>
        )}

        {/* Controls gradient bar */}
        <div className={`vg-player-controls ${showCtrl ? 'vis' : ''}`}>

          {/* ── Seek bar: 44px hit target, visual rail inside ── */}
          <div
            ref={seekRef}
            className="vg-player-seek"
            onMouseDown={e => { e.preventDefault(); scrubbingRef.current = true; scrubTo(e.clientX) }}
            onMouseMove={e => {
              if (scrubbingRef.current) scrubTo(e.clientX)
              const rect = e.currentTarget.getBoundingClientRect()
              setHoverPct(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))
            }}
            onMouseLeave={() => setHoverPct(null)}
            onClick={e => scrubTo(e.clientX)}
          >
            {/* Hover tooltip — positioned above 44px container */}
            {hoverPct !== null && dur > 0 && (
              <div
                className="vg-seek-tooltip"
                style={{ left: `clamp(26px, ${hoverPct}%, calc(100% - 26px))` }}
              >
                {fmt((hoverPct / 100) * dur)}
              </div>
            )}

            {/* Visual rail — scaleY on hover, no layout shift */}
            <div className="vg-player-seek-rail">
              <div className="vg-player-seek-track" />
              <div className="vg-player-seek-buffer" style={{ width: `${buffered}%` }} />
              <div className="vg-player-seek-fill"   style={{ width: `${pct}%` }} />
            </div>
            {/* Thumb lives outside the scaled rail so it stays circular */}
            <div className="vg-player-seek-thumb" style={{ left: `${pct}%` }} />
          </div>

          {/* ── Bottom bar ── */}
          <div className="vg-player-bar">
            <div className="vg-player-left">
              <button className="vg-pb" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                {playing
                  ? <Pause size={16} fill="white" strokeWidth={0} />
                  : <Play  size={16} fill="white" strokeWidth={0} />}
              </button>
              <span className="vg-player-time">
                {fmt(curTime)}
                <span style={{ opacity: 0.3, margin: '0 5px' }}>/</span>
                {fmt(dur)}
              </span>
            </div>

            <div className="vg-player-right">
              {/* Volume group — slider expands on hover */}
              <div className="vg-vol-group">
                <button className="vg-pb" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
                  {muted || vol === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <div className="vg-vol-slider-wrap">
                  <input
                    type="range" min={0} max={1} step={0.02}
                    value={muted ? 0 : vol}
                    onChange={changeVol}
                    className="vg-player-vol"
                    aria-label="Volume"
                    style={{ '--vol-pct': `${(muted ? 0 : vol) * 100}%` } as React.CSSProperties}
                  />
                </div>
              </div>

              <button className="vg-pb" onClick={toggleFs} aria-label="Fullscreen">
                {fullscr ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(lightboxNode, document.body)
}

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ index, onClick }: { index: number; onClick: () => void }) {
  const src     = `${R2_CDN}/${PROJECT_FILES[index]}`
  const project = PROJECTS[index] ?? { name: '', year: '' }
  const { poster, failed } = usePoster(src)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)

  const enter = () => {
    setHovered(true)
    videoRef.current?.play().catch(() => {})
  }
  const leave = () => {
    setHovered(false)
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
  }

  return (
    <div
      className="vg-card-wrapper"
      style={{ animationDelay: `${(index % 12) * 40}ms` }}
    >
      <div
        className={`vg-card ${hovered ? 'vg-card--hov' : ''}`}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onClick={onClick}
      >
        <div className="vg-card-media">
          {failed
            ? <div className="vg-grad-fb"><Play size={28} strokeWidth={1} style={{ color: 'rgba(0,229,255,0.4)' }} /></div>
            : poster
            ? <img className="vg-poster" src={poster} alt={project.name} loading="lazy" />
            : <div className="vg-shimmer"><div className="vg-shimmer-bar" /></div>
          }
          <video
            ref={videoRef}
            className={`vg-video ${hovered ? 'vg-video--vis' : ''}`}
            src={src} muted loop playsInline preload="none"
          />
          <div className="vg-scan-line" />
        </div>
      </div>
      {/* Title sits outside the card — zero clipping issues */}
      <div className="vg-card-label">
        <span className="vg-card-label-name">{project.name}</span>
        <span className="vg-card-label-year">{project.year}</span>
      </div>
    </div>
  )
}

// ── Gallery ───────────────────────────────────────────────────────────────────
export function VideoGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [showAll,  setShowAll]  = useState(false)
  const INIT = 12

  const open  = useCallback((i: number) => setLightbox(i), [])
  const close = useCallback(() => setLightbox(null), [])
  const prev  = useCallback(() => setLightbox(i => i !== null ? (i - 1 + PROJECT_FILES.length) % PROJECT_FILES.length : null), [])
  const next  = useCallback(() => setLightbox(i => i !== null ? (i + 1) % PROJECT_FILES.length : null), [])

  const visible = showAll ? PROJECT_FILES : PROJECT_FILES.slice(0, INIT)

  return (
    <div className="vg-root">
      <div className="vg-grid">
        {visible.map((_, i) => (
          <VideoCard key={PROJECT_FILES[i]} index={i} onClick={() => open(i)} />
        ))}
      </div>

      {!showAll && PROJECT_FILES.length > INIT && (
        <button className="vg-show-more" onClick={() => setShowAll(true)}>
          Show All {PROJECT_FILES.length} Works <ChevronDown size={17} />
        </button>
      )}

      {lightbox !== null && (
        <PlayerLightbox
          index={lightbox}
          total={PROJECT_FILES.length}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  )
}
