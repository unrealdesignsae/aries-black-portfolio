/**
 * Cloudflare R2 CDN helper
 *
 * Videos are served through the /r2-cdn proxy path:
 * - In development: Vite dev server proxies to R2 with CORS headers
 * - In production: Vercel rewrites proxy to R2 (configured in vercel.json)
 *
 * Same-origin proxying avoids CORS issues for canvas posters and WebGL
 * video textures (the r2.dev bucket serves no CORS headers).
 *
 * SELF-HEALING FALLBACK: production has broken twice (2026-06-19,
 * 2026-07-24) when a deploy shipped without vercel.json and every
 * /r2-cdn request 404'd. If the proxy is missing, we flip the base to
 * the direct bucket URL. Plain <video> playback needs no CORS, so the
 * gallery keeps playing; only canvas posters and WebGL textures degrade.
 */

/** Direct public bucket URL — playback-safe, but no CORS headers */
export const R2_DIRECT = 'https://pub-340c09903d0b49fea4aec85224bcb1bb.r2.dev'

/** Base URL for all R2 CDN assets — same-origin proxy, self-healing */
export let R2_CDN = '/r2-cdn'

if (typeof window !== 'undefined') {
  fetch(`${R2_CDN}/video_1.mp4`, { method: 'HEAD' })
    .then(r => { if (!r.ok) R2_CDN = R2_DIRECT })
    .catch(() => { R2_CDN = R2_DIRECT })
}

/** Full URL for a video file */
export function videoUrl(filename: string): string {
  return `${R2_CDN}/${filename}`
}

/** Always true — crossOrigin is required for canvas/WebGL, proxy injects CORS in dev */
export const needsCrossOrigin = true
