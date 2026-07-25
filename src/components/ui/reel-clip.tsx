import { useEffect, useRef, useState, useCallback } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { videoUrl } from '../../lib/cdn'

/** 2026 showreel cut — PROJECT_FILES[7] / PROJECTS[7] in the video gallery (360x640, 9:16) */
const CLIP_FILE = 'video_8.mp4'

/** Playback volume for the unmuted autoplay attempt — deliberately low. */
const TARGET_VOLUME = 0.1

export function ReelClip() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(false)

  // Autoplay on enter, pause on exit. Attempt sound first; fall back to muted
  // only if the browser's autoplay policy rejects it, so the clip always plays.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    let disposed = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current
        if (!v || disposed) return

        if (entry.isIntersecting) {
          v.volume = TARGET_VOLUME
          v.play().catch(() => {
            // Unmuted autoplay refused — retry muted so the clip still runs.
            if (disposed) return
            v.muted = true
            setMuted(true)
            v.play().catch(() => {})
          })
        } else if (!v.paused) {
          v.pause()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => { disposed = true; observer.disconnect() }
  }, [])

  const toggleMute = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    const next = !v.muted
    v.muted = next
    if (!next) {
      v.volume = TARGET_VOLUME
      // Unmuting is a user gesture, so a clip paused by autoplay policy can start here.
      if (v.paused) v.play().catch(() => {})
    }
    setMuted(next)
  }, [])

  return (
    <div className="reel-clip" ref={wrapRef}>
      <div className="reel-clip-frame">
        <video
          ref={videoRef}
          className="reel-clip-video"
          src={videoUrl(CLIP_FILE)}
          loop
          playsInline
          preload="metadata"
          aria-label="Real-time rendering and 3D work in motion"
        />
      </div>

      <button
        type="button"
        className="reel-clip-mute"
        onClick={toggleMute}
        aria-pressed={muted}
        aria-label={muted ? 'Unmute clip' : 'Mute clip'}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        <span>{muted ? 'Unmute' : 'Mute'}</span>
      </button>
    </div>
  )
}
