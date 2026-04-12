import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Search, Grid3X3, List, Play, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { R2_CDN } from '../../lib/cdn'

// ── Project metadata ─────────────────────────────────────────────────────────
const PROJECT_DATA: { file: string; title: string; category: string; featured?: boolean }[] = [
  { file: 'video_1.mp4',  title: 'DAMAC Luxury Tower',           category: 'Architectural Viz', featured: true },
  { file: 'video_2.mp4',  title: 'Ambient Desert Villa',          category: 'Architectural Viz' },
  { file: 'video_3.mp4',  title: 'World Government Summit',       category: 'Event Design',      featured: true },
  { file: 'video_4.mp4',  title: 'TAG Heuer Brand Activation',    category: 'Event Design' },
  { file: 'video_5.mp4',  title: 'Real-Time Cityscape',           category: 'Real-Time UE5',    featured: true },
  { file: 'video_6.mp4',  title: 'Montblanc Showcase',            category: 'Event Design' },
  { file: 'video_7.mp4',  title: 'Dubai Marina Penthouse',        category: 'Architectural Viz' },
  { file: 'video_8.mp4',  title: 'Samsung Galaxy Stage',          category: 'Event Design' },
  { file: 'video_9.mp4',  title: 'Interior Light Study',          category: 'Look Dev' },
  { file: 'video_10.mp4', title: 'Huawei Tech Conference',        category: 'Event Design' },
  { file: 'video_11.mp4', title: 'Volumetric Fog Render',         category: 'Look Dev' },
  { file: 'video_12.mp4', title: 'Omniyat Branded Residence',     category: 'Architectural Viz' },
  { file: 'video_13.mp4', title: 'Night Skyline Study',           category: 'Real-Time UE5' },
  { file: 'video_14.mp4', title: 'Richard Mille Pop-Up',          category: 'Event Design' },
  { file: 'video_15.mp4', title: 'Dubai Holding Masterplan',      category: 'Architectural Viz' },
  { file: 'video_16.mp4', title: 'Vodafone Arena Stage',          category: 'Event Design' },
  { file: 'video_17.mp4', title: 'G20 Saudi Arabia Pavilion',     category: 'Event Design' },
  { file: 'video_18.mp4', title: 'Warner Bros Cinematic Set',     category: 'Look Dev' },
  { file: 'video_19.mp4', title: 'Ministry of Transport Hub',     category: 'Architectural Viz' },
  { file: 'video_20.mp4', title: 'Sandstorm Environment',         category: 'Real-Time UE5' },
  { file: 'video_21.mp4', title: 'Entourage Mega-Event Stage',    category: 'Event Design',     featured: true },
  { file: 'video_22.mp4', title: 'Ambient Studio Landscape',      category: 'Architectural Viz' },
  { file: 'video_23.mp4', title: 'OD Events Keynote Stage',       category: 'Event Design' },
  { file: 'video_24.mp4', title: 'Glass Villa Interior',          category: 'Architectural Viz' },
  { file: 'video_25.mp4', title: 'InDesign Showroom Cairo',       category: 'Architectural Viz' },
  { file: 'video_26.mp4', title: 'Cinematic Character Rig',       category: 'Look Dev' },
  { file: 'video_27.mp4', title: 'Hyperrealistic Terrain',        category: 'Real-Time UE5' },
  { file: 'video_28.mp4', title: 'Luxury Retail Entrance',        category: 'Architectural Viz' },
]

const ALL_CATEGORIES = ['All', 'Architectural Viz', 'Event Design', 'Real-Time UE5', 'Look Dev']

// ── Category counts ───────────────────────────────────────────────────────────
function getCategoryCounts() {
  const counts: Record<string, number> = { All: PROJECT_DATA.length }
  for (const p of PROJECT_DATA) {
    counts[p.category] = (counts[p.category] || 0) + 1
  }
  return counts
}

// ── Queued poster generator (max 3 concurrent) ───────────────────────────────
const posterQueue: (() => void)[] = []
let activePosters = 0
const MAX_CONCURRENT_POSTERS = 3

function runNextPoster() {
  if (activePosters >= MAX_CONCURRENT_POSTERS || posterQueue.length === 0) return
  const next = posterQueue.shift()
  if (next) { activePosters++; next() }
}

function capturePoster(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const run = () => {
      const video = document.createElement('video')
      video.src = src
      video.crossOrigin = 'anonymous'
      video.muted = true
      video.playsInline = true
      video.preload = 'metadata'

      const cleanup = () => {
        video.src = ''
        video.load()
        activePosters--
        runNextPoster()
      }

      const timeout = setTimeout(() => {
        cleanup()
        resolve(null)
      }, 12000)

      const capture = () => {
        clearTimeout(timeout)
        try {
          const canvas = document.createElement('canvas')
          canvas.width = 640
          canvas.height = 360
          const ctx = canvas.getContext('2d', { willReadFrequently: true })
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
            cleanup()
            resolve(dataUrl && dataUrl.length > 100 ? dataUrl : null)
          } else {
            cleanup()
            resolve(null)
          }
        } catch {
          cleanup()
          resolve(null)
        }
      }

      video.addEventListener('loadedmetadata', () => {
        const seekTarget = Math.min(1, Math.max(0, video.duration - 0.1))
        video.currentTime = seekTarget
      }, { once: true })

      video.addEventListener('seeked', capture, { once: true })
      video.addEventListener('error', () => {
        clearTimeout(timeout)
        cleanup()
        resolve(null)
      }, { once: true })

      video.load()
    }

    posterQueue.push(run)
    runNextPoster()
  })
}

function usePoster(src: string) {
  const [poster, setPoster] = useState<string>('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    capturePoster(src).then(result => {
      if (cancelled) return
      if (result) setPoster(result)
      else setFailed(true)
    })

    return () => { cancelled = true }
  }, [src])


  return { poster, failed }
}

// ── Gradient fallback poster ──────────────────────────────────────────────────
function GradientPoster({ title, category }: { title: string; category: string }) {
  const gradients: Record<string, string> = {
    'Architectural Viz': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    'Event Design': 'linear-gradient(135deg, #1a1a1a 0%, #2d1b4e 50%, #1a1a2e 100%)',
    'Real-Time UE5': 'linear-gradient(135deg, #0a1628 0%, #1a3a2a 50%, #0a1628 100%)',
    'Look Dev': 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 50%, #1a1a1a 100%)',
  }
  return (
    <div className="vg-gradient-poster" style={{ background: gradients[category] || gradients['Look Dev'] }}>
      <div className="vg-gradient-poster-inner">
        <Play size={32} strokeWidth={1.5} />
        <span>{title}</span>
      </div>
    </div>
  )
}

// ── Video Card (Grid mode) ────────────────────────────────────────────────────
function VideoCard({
  project,
  onClick,
  index,
}: {
  project: typeof PROJECT_DATA[0]
  onClick: () => void
  index: number
}) {
  const src = `${R2_CDN}/${project.file}`
  const { poster, failed } = usePoster(src)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleMouseEnter = () => {
    setHovered(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
      // Start progress tracking
      progressInterval.current = setInterval(() => {
        if (videoRef.current && videoRef.current.duration) {
          setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
        }
      }, 100)
    }
  }
  const handleMouseLeave = () => {
    setHovered(false)
    setProgress(0)
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [])

  return (
    <div
      className={`vg-card ${project.featured ? 'vg-card--featured' : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="vg-card-media">
        {failed ? (
          <GradientPoster title={project.title} category={project.category} />
        ) : poster ? (
          <img className="vg-poster" src={poster} alt={project.title} />
        ) : (
          <div className="vg-poster-loading">
            <div className="vg-poster-loading-shimmer" />
          </div>
        )}
        <video
          ref={videoRef}
          className={`vg-video ${hovered ? 'vg-video--visible' : ''}`}
          src={src}
          muted
          loop
          playsInline
          preload="none"
        />
        <div className={`vg-overlay ${hovered ? 'vg-overlay--visible' : ''}`}>
          <div className="vg-play-ring">
            <Play size={24} fill="currentColor" />
          </div>
        </div>
        <span className="vg-category-badge">{project.category}</span>
        {/* Hover progress bar */}
        <div className={`vg-hover-progress ${hovered ? 'vg-hover-progress--visible' : ''}`}>
          <div className="vg-hover-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="vg-card-info">
        <h3 className="vg-title">{project.title}</h3>
        <div className="vg-meta">
          <span className="vg-tag">{project.category}</span>
          <span className="vg-watch">Watch ›</span>
        </div>
      </div>
    </div>
  )
}

// ── Video Card (List mode) ────────────────────────────────────────────────────
function VideoListItem({
  project,
  onClick,
  index,
}: {
  project: typeof PROJECT_DATA[0]
  onClick: () => void
  index: number
}) {
  const src = `${R2_CDN}/${project.file}`
  const { poster, failed } = usePoster(src)

  return (
    <div
      className="vg-list-item"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={onClick}
    >
      <div className="vg-list-thumb">
        {failed ? (
          <GradientPoster title={project.title} category={project.category} />
        ) : poster ? (
          <img src={poster} alt={project.title} />
        ) : (
          <div className="vg-poster-loading"><div className="vg-poster-loading-shimmer" /></div>
        )}
        <div className="vg-list-play">
          <Play size={16} fill="currentColor" />
        </div>
      </div>
      <div className="vg-list-info">
        <h3 className="vg-list-title">{project.title}</h3>
        <span className="vg-list-category">{project.category}</span>
      </div>
      <span className="vg-list-watch">Watch ›</span>
    </div>
  )
}

// ── Lightbox modal ────────────────────────────────────────────────────────────
function Lightbox({
  project,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: {
  project: typeof PROJECT_DATA[0]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  currentIndex: number
  totalCount: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, onNext, onPrev])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Skip to 5 seconds when video loads
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const seekTarget = Math.min(5, Math.max(0, videoRef.current.duration - 0.1))
      videoRef.current.currentTime = seekTarget
    }
  }

  return (
    <div className="vg-lightbox" onClick={onClose}>
      <div className="vg-lightbox-inner" onClick={e => e.stopPropagation()}>
        <button className="vg-lb-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <button className="vg-lb-nav vg-lb-prev" onClick={onPrev} aria-label="Previous"><ChevronLeft size={24} /></button>
        <button className="vg-lb-nav vg-lb-next" onClick={onNext} aria-label="Next"><ChevronRight size={24} /></button>

        <video
          ref={videoRef}
          key={project.file}
          className="vg-lb-video"
          src={`${R2_CDN}/${project.file}`}
          controls
          autoPlay
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
        />
        <div className="vg-lb-info">
          <div className="vg-lb-info-left">
            <span className="vg-lb-category">{project.category}</span>
            <h2 className="vg-lb-title">{project.title}</h2>
          </div>
          <span className="vg-lb-counter">{currentIndex + 1} / {totalCount}</span>
        </div>
      </div>
    </div>
  )
}

// ── Sorting ───────────────────────────────────────────────────────────────────
type SortMode = 'default' | 'name' | 'category'

function sortProjects(projects: typeof PROJECT_DATA, mode: SortMode) {
  if (mode === 'default') return projects
  return [...projects].sort((a, b) => {
    if (mode === 'name') return a.title.localeCompare(b.title)
    if (mode === 'category') return a.category.localeCompare(b.category)
    return 0
  })
}

// ── Main gallery component ────────────────────────────────────────────────────
export function VideoGallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const categoryCounts = useMemo(() => getCategoryCounts(), [])

  const filtered = useMemo(() => {
    let result = activeCategory === 'All'
      ? PROJECT_DATA
      : PROJECT_DATA.filter(p => p.category === activeCategory)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }

    return sortProjects(result, sortMode)
  }, [activeCategory, searchQuery, sortMode])

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevLightbox = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null), [filtered.length])
  const nextLightbox = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % filtered.length : null), [filtered.length])

  return (
    <div className="vg-root">
      {/* ── Toolbar: Search + View Toggle + Sort ── */}
      <div className="vg-toolbar">
        <div className="vg-search-wrapper">
          <Search size={16} className="vg-search-icon" />
          <input
            type="text"
            className="vg-search-input"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="vg-search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="vg-toolbar-right">
          {/* Sort dropdown */}
          <div className="vg-sort-wrapper">
            <button
              className={`vg-tool-btn ${showSortMenu ? 'vg-tool-btn--active' : ''}`}
              onClick={() => setShowSortMenu(!showSortMenu)}
              title="Sort"
            >
              <SlidersHorizontal size={16} />
            </button>
            {showSortMenu && (
              <div className="vg-sort-menu">
                {([['default', 'Default'], ['name', 'By Name'], ['category', 'By Category']] as const).map(([key, label]) => (
                  <button
                    key={key}
                    className={`vg-sort-option ${sortMode === key ? 'vg-sort-option--active' : ''}`}
                    onClick={() => { setSortMode(key); setShowSortMenu(false) }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="vg-view-toggle">
            <button
              className={`vg-tool-btn ${viewMode === 'grid' ? 'vg-tool-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              className={`vg-tool-btn ${viewMode === 'list' ? 'vg-tool-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter pills with counts ── */}
      <div className="vg-filters">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`vg-filter-btn ${activeCategory === cat ? 'vg-filter-btn--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
            <span className="vg-filter-count">{categoryCounts[cat] || 0}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="vg-count">{filtered.length} {filtered.length === 1 ? 'Project' : 'Projects'}</p>

      {/* ── Grid View ── */}
      {viewMode === 'grid' && (
        <div className="vg-grid" key={`grid-${activeCategory}-${searchQuery}`}>
          {filtered.map((project, i) => (
            <VideoCard
              key={project.file}
              project={project}
              index={i}
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>
      )}

      {/* ── List View ── */}
      {viewMode === 'list' && (
        <div className="vg-list" key={`list-${activeCategory}-${searchQuery}`}>
          {filtered.map((project, i) => (
            <VideoListItem
              key={project.file}
              project={project}
              index={i}
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="vg-empty">
          <p>No projects match your search.</p>
          <button className="vg-empty-reset" onClick={() => { setSearchQuery(''); setActiveCategory('All') }}>
            Reset filters
          </button>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          project={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
          currentIndex={lightboxIndex}
          totalCount={filtered.length}
        />
      )}
    </div>
  )
}
