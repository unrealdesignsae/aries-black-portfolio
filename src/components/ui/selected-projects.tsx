import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Play, X } from "lucide-react"

interface ProjectVideo {
  id: string
  title: string
}

interface Project {
  key: string
  title: string
  client: string
  location: string
  year: string
  summary: string
  highlights: string[]
  images: string[]
  videos: ProjectVideo[]
}

const PROJECTS: Project[] = [
  {
    key: "al-qadsiah-2025",
    title: "Al Qadsiah Celebration 2025",
    client: "Al Qadsiah FC",
    location: "Al Khobar Waterfront, KSA",
    year: "2025",
    summary:
      "A city-wide football celebration built for 37,000+ fans on the Al Khobar waterfront — live show, an original club anthem, and a content engine designed to travel far past the site.",
    highlights: [
      "37,409 visitors across the celebration, 14,963+ on the peak day",
      "18,727 sqm of festival city space activated",
      "Original club anthem “Taj Al Khobar” produced with Rotana, premiered live",
      "Headline performances, water shows and a stage-and-sky multimedia finale",
    ],
    images: [
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-01.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-02.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/AL-QADSIAH-CELEBRATION-2025-03.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-03.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-04.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-05.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-06.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-07.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-08.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-09.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-10.png",
      "https://entourageintl.com/wp-content/uploads/2026/02/al-qadsiah-2025-celebration-event-11.png",
    ],
    videos: [
      { id: "KkRbgMiNWe8", title: "Taj Al Khobar — Al Qadsiah FC anthem" },
      { id: "T_EvvhXp8cQ", title: "Al Qadsiah Festival 2025" },
    ],
  },
  {
    key: "roshn-2025-closing",
    title: "Roshn Saudi League 2025 — Closing Ceremony",
    client: "Saudi Pro League",
    location: "Al-Inma Stadium, Jeddah, KSA",
    year: "2025",
    summary:
      "Six world-record tifos, a mid-match 3D projection and a 2,000-drone finale for AlIttihad's championship night.",
    highlights: [
      "Six world-record-breaking tifo displays across the stands",
      "Mid-match 3D projection synced with live LED drummers, starring Ahmad Saad",
      "2,000-drone show paired with a five-minute fireworks finale",
      "Trophy presented by the Sports Minister to Karim Benzema",
    ],
    images: [
      "https://entourageintl.com/wp-content/uploads/2025/06/01-Roshn-Saudi-League-2025.webp",
      "https://entourageintl.com/wp-content/uploads/2025/06/02-Roshn-Saudi-League-2025.webp",
      "https://entourageintl.com/wp-content/uploads/2025/06/04-Roshn-Saudi-League-2025-scaled.webp",
      "https://entourageintl.com/wp-content/uploads/2025/06/05-Roshn-Saudi-League-2025.webp",
      "https://entourageintl.com/wp-content/uploads/2025/06/09-Roshn-Saudi-League-2025.webp",
      "https://entourageintl.com/wp-content/uploads/2025/06/10-Roshn-Saudi-League-2025.webp",
      "https://entourageintl.com/wp-content/uploads/2025/06/11-Roshn-Saudi-League-2025.webp",
    ],
    videos: [{ id: "47l0033pbRs", title: "Roshn Saudi League 2025 — Closing Ceremony" }],
  },
  {
    key: "roshn-2026-closing",
    title: "Roshn Saudi League 2025/26 — Closing Ceremony",
    client: "Ministry of Sport",
    location: "Riyadh & Al-Majma’ah, KSA",
    year: "2026",
    summary:
      "Two fully-produced championship ceremonies built in parallel for two different clubs, because the title wasn't decided until the final whistle.",
    highlights: [
      "Two complete, production-ready shows on standby — Al Nassr and Al Hilal",
      "Centre-pitch projection mapping and a 1,000-drone performance for Al Nassr's win",
      "Roof-launch fireworks and a bespoke championship podium",
      "Marked Cristiano Ronaldo's first major trophy in Saudi Arabia",
    ],
    images: [
      "https://entourageintl.com/wp-content/uploads/2026/07/Roshn-Saudi-League-2026-01.webp",
      "https://entourageintl.com/wp-content/uploads/2026/07/Roshn-Saudi-League-2026-02.webp",
      "https://entourageintl.com/wp-content/uploads/2026/07/Roshn-Saudi-League-2026-03.webp",
      "https://entourageintl.com/wp-content/uploads/2026/07/Roshn-Saudi-League-2026-04.webp",
      "https://entourageintl.com/wp-content/uploads/2026/07/Roshn-Saudi-League-2026-05.webp",
      "https://entourageintl.com/wp-content/uploads/2026/07/Roshn-Saudi-League-2026-06.webp",
    ],
    videos: [
      { id: "A7O9Vr2hbKo", title: "Roshn Saudi League Closing Ceremony 2026" },
      { id: "9fXmsbrg3ig", title: "RSL — Dual Championship Ceremony" },
    ],
  },
  {
    key: "richard-mille-desert-polo",
    title: "Richard Mille Desert Polo Tournament",
    client: "Royal Commission for AlUla",
    location: "AlUla, KSA",
    year: "2025",
    summary:
      "A luxury desert-polo tournament and gala dinner, built from raw terrain in under a month for royalty, dignitaries and global press.",
    highlights: [
      "Full venue build in AlUla's desert landscape, delivered in under four weeks",
      "Over 1,500 guests across the tournament and gala dinner",
      "VVIP and royal-protocol guest journey design",
      "Bespoke polo trophies handcrafted by artisans in Spain",
    ],
    images: [
      "https://entourageintl.com/wp-content/uploads/2025/02/01_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/02_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/03_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/04_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/05_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/06_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/07_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/08_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/09_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/10_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/11_Richard_Mille_Alula_Desert_Polo.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/13_Richard_Mille_Alula_Desert_Polo.png",
    ],
    videos: [{ id: "fGi3B30yBR0", title: "AlUla Desert Polo — Richard Mille" }],
  },
  {
    key: "alfursan-endurance",
    title: "AlFursan Endurance",
    client: "Royal Commission for AlUla",
    location: "AlUla, KSA",
    year: "2025",
    summary:
      "An endurance race carrying the King's name — full event experience, VVIP hospitality and press operations, with riders representing 66 countries.",
    highlights: [
      "Riders and officials represented 66 countries",
      "Full guest journey design, from arrival protocol to VVIP hospitality lounges",
      "Official press conference produced and managed on-site",
      "Athlete, media and medical infrastructure built in a remote desert setting",
    ],
    images: [
      "https://entourageintl.com/wp-content/uploads/2025/02/01_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/02_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/03_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/04_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/05_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/06_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/07_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/08_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/09_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/10_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/11_Alfursan_Endurance_Alula.png",
      "https://entourageintl.com/wp-content/uploads/2025/02/12_Alfursan_Endurance_Alula.png",
    ],
    videos: [{ id: "GfA8L693FNs", title: "AlFursan Endurance — Royal Commission for AlUla" }],
  },
]

function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

function VideoTile({ video }: { video: ProjectVideo }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="sp-video-tile sp-video-tile--playing">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className="sp-video-tile"
      onClick={() => setPlaying(true)}
    >
      <img src={ytThumb(video.id)} alt={video.title} loading="lazy" />
      <span className="sp-video-play" aria-hidden="true"><Play size={18} fill="currentColor" /></span>
      <span className="sp-video-title">{video.title}</span>
    </button>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const showPrev = useCallback(
    () => setLightboxIndex(i => (i === null ? null : (i - 1 + project.images.length) % project.images.length)),
    [project.images.length]
  )
  const showNext = useCallback(
    () => setLightboxIndex(i => (i === null ? null : (i + 1) % project.images.length)),
    [project.images.length]
  )

  useEffect(() => {
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) closeLightbox()
        else onClose()
      }
      if (lightboxIndex !== null) {
        if (e.key === "ArrowLeft") showPrev()
        if (e.key === "ArrowRight") showNext()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [lightboxIndex, onClose, closeLightbox, showPrev, showNext])

  const node = (
    <div className="sp-modal-overlay" onClick={onClose}>
      <div className="sp-modal" onClick={e => e.stopPropagation()}>
        <div className="sp-modal-header">
          <div>
            <p className="sp-modal-eyebrow">{project.client} · {project.location} · {project.year}</p>
            <h3>{project.title}</h3>
          </div>
          <button type="button" className="sp-modal-close" onClick={onClose} aria-label="Close case study">
            <X size={16} />
          </button>
        </div>

        <div className="sp-modal-body">
          <p className="sp-modal-summary">{project.summary}</p>

          <ul className="sp-highlights">
            {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>

          {project.videos.length > 0 && (
            <>
              <h4 className="sp-gallery-heading">Video</h4>
              <div className="sp-video-grid">
                {project.videos.map(v => <VideoTile key={v.id} video={v} />)}
              </div>
            </>
          )}

          <h4 className="sp-gallery-heading">Gallery</h4>
          <div className="sp-gallery-grid">
            {project.images.map((src, i) => (
              <button
                key={i}
                type="button"
                className="sp-gallery-thumb"
                onClick={() => setLightboxIndex(i)}
              >
                <img src={src} alt={`${project.title} — photo ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="sp-lightbox"
          onClick={e => { e.stopPropagation(); closeLightbox() }}
        >
          <img
            className="sp-lightbox-img"
            src={project.images[lightboxIndex]}
            alt={`${project.title} — photo ${lightboxIndex + 1}`}
            onClick={e => e.stopPropagation()}
          />
          <button
            type="button"
            className="sp-lightbox-btn sp-lightbox-close"
            onClick={e => { e.stopPropagation(); closeLightbox() }}
            aria-label="Close image"
          >
            <X size={18} />
          </button>
          {project.images.length > 1 && (
            <>
              <button
                type="button"
                className="sp-lightbox-btn sp-lightbox-prev"
                onClick={e => { e.stopPropagation(); showPrev() }}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="sp-lightbox-btn sp-lightbox-next"
                onClick={e => { e.stopPropagation(); showNext() }}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
              <span className="sp-lightbox-count">{lightboxIndex + 1} / {project.images.length}</span>
            </>
          )}
        </div>
      )}
    </div>
  )

  return createPortal(node, document.body)
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <div
      className="sp-card"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen()
        }
      }}
      aria-label={`Open case study — ${project.title}`}
    >
      <div className="sp-card-media">
        {project.images.slice(0, 3).map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${project.title} photo ${i + 1}`}
            className="sp-thumb-frame"
            loading="lazy"
          />
        ))}
        <div className="sp-card-scrim" />
        <span className="sp-card-cta">View Case Study <ArrowUpRight size={14} /></span>
      </div>
      <div className="sp-card-body">
        <span className="sp-card-tag"><MapPin size={11} /> {project.location} · {project.year}</span>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </div>
    </div>
  )
}

export function SelectedProjects() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <div className="sp-grid">
      {PROJECTS.map(project => (
        <ProjectCard key={project.key} project={project} onOpen={() => setActive(project)} />
      ))}
      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </div>
  )
}
