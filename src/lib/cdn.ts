/**
 * Cloudflare R2 CDN helper
 * 
 * In development, videos are proxied through Vite's dev server which injects
 * proper CORS headers (Access-Control-Allow-Origin: *) to bypass R2's missing CORS.
 * In production, videos are loaded directly from R2 (which needs CORS configured).
 * 
 * crossOrigin='anonymous' is ALWAYS set because:
 * - Three.js requires it for WebGL texture sampling
 * - Canvas.toDataURL() requires it for thumbnail capture
 * The Vite proxy injects the needed CORS headers in dev mode.
 */

const R2_DIRECT = 'https://pub-340c09903d0b49fea4aec85224bcb1bb.r2.dev'
const R2_PROXY  = '/r2-cdn'

const isDev = import.meta.env.DEV

/** Base URL for all R2 CDN assets */
export const R2_CDN = isDev ? R2_PROXY : R2_DIRECT

/** Full URL for a video file */
export function videoUrl(filename: string): string {
  return `${R2_CDN}/${filename}`
}

/** Always true — crossOrigin is required for canvas/WebGL, proxy injects CORS in dev */
export const needsCrossOrigin = true
