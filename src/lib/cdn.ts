/**
 * Cloudflare R2 CDN helper
 * 
 * Videos are always served through the /r2-cdn proxy path:
 * - In development: Vite dev server proxies to R2 with CORS headers
 * - In production: Vercel rewrites proxy to R2 (configured in vercel.json)
 * 
 * This avoids CORS issues entirely since all requests are same-origin.
 */

/** Base URL for all R2 CDN assets — always same-origin proxy */
export const R2_CDN = '/r2-cdn'

/** Full URL for a video file */
export function videoUrl(filename: string): string {
  return `${R2_CDN}/${filename}`
}

/** Always true — crossOrigin is required for canvas/WebGL, proxy injects CORS in dev */
export const needsCrossOrigin = true
