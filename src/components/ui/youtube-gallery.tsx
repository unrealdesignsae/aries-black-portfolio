"use client"

import { useState } from "react"

interface YTVideo {
  id: string
  title: string
  year: string
}

const VIDEOS: YTVideo[] = [
  { id: 'PCqxjF6C2mI', title: 'AlQadsiah Festival',      year: '2025' },
  { id: 'fGi3B30yBR0', title: 'AlUla Desert Polo',       year: '2025' },
  { id: 'GfA8L693FNs', title: 'AlFursan',                year: '2025' },
  { id: '5iwd5Mgpm1Q', title: 'Omniyat Orla Launch',     year: '2024' },
  { id: 'aH5qIUq-ZG0', title: 'Roshn',                   year: '2025' },
  { id: 'memB01oIa-U', title: 'Production Reel',         year: '2025' },
]

function thumb(id: string) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}

export function YouTubeGallery() {
  const [active, setActive] = useState(0)
  const video = VIDEOS[active]

  return (
    <div className="yt-gallery">
      {/* ── Main player ── */}
      <div className="yt-player-wrap">
        <div className="yt-player-inner">
          <iframe
            key={video.id}
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="yt-iframe"
          />
        </div>
        <div className="yt-player-meta">
          <span className="yt-player-title">{video.title}</span>
          <span className="yt-player-year">{video.year}</span>
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      <div className="yt-strip">
        {VIDEOS.map((v, i) => (
          <button
            key={v.id}
            className={`yt-thumb-btn ${i === active ? 'yt-thumb-btn--active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={v.title}
          >
            <img
              src={thumb(v.id)}
              alt={v.title}
              className="yt-thumb-img"
              loading="lazy"
            />
            <div className="yt-thumb-overlay">
              <span className="yt-thumb-title">{v.title}</span>
              <span className="yt-thumb-year">{v.year}</span>
            </div>
            {i === active && <div className="yt-thumb-active-bar" />}
          </button>
        ))}
      </div>
    </div>
  )
}
