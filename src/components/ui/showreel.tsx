import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { R2_CDN } from '../../lib/cdn'

const SHOWREEL_FILE = 'video_8.mp4' // "Aries Black Showreel" 2026 — src/components/ui/video-gallery.tsx PROJECTS[7]
const MEDIUM_VOLUME = 0.5

export function Showreel() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (video) video.volume = MEDIUM_VOLUME
  }, [])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const video = videoRef.current
    if (!wrapper || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.5 }
    )
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  return (
    <div className="showreel-wrap" ref={wrapperRef}>
      <video
        ref={videoRef}
        className="showreel-video"
        src={`${R2_CDN}/${SHOWREEL_FILE}`}
        muted={muted}
        loop
        playsInline
        preload="metadata"
      />
      <button
        className="showreel-mute-btn"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute showreel' : 'Mute showreel'}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  )
}
