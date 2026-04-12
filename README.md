# Aries Black — Portfolio

> Senior CG Generalist · Architectural Visualization · Experiential Design  
> Based in Dubai, UAE

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | CSS (custom design system) + Tailwind (utility layer) |
| Animation | GSAP, CSS keyframes |
| 3D | Three.js |
| Video CDN | Cloudflare R2 |
| Deployment | Vercel |

---

## Project Structure

```
PORTFOLIO/
├── src/
│   ├── App.tsx                   # Root layout & page assembly
│   ├── main.tsx                  # Vite entry point
│   ├── index.css                 # Global resets
│   ├── assets/
│   │   ├── profile.png           # Profile image (AnimatedTiles)
│   │   └── videos/               # 28 trimmed MP4s for local dev hero
│   ├── components/
│   │   └── ui/
│   │       ├── animated-tiles.tsx        # Profile image tile reveal
│   │       ├── flow-gradient-hero-section.tsx
│   │       ├── glitch-cursor.tsx         # Fullscreen glitch BG + cursor
│   │       ├── logo-timeline.tsx         # Scrolling software arsenal strip
│   │       ├── lumina-interactive-list.tsx # Video hero slider
│   │       ├── music-portfolio.tsx       # Project card list w/ scramble hover
│   │       ├── scanner-card-stream.tsx   # AI workflows scroll strip
│   │       └── video-gallery.tsx         # 28-video gallery + lightbox
│   ├── css/
│   │   └── style.css             # Main design system (tokens, components, animations)
│   └── lib/
│       └── utils.ts              # clsx/tailwind-merge helper
├── skills/                       # In-repo design skill references
│   ├── frontend-design/
│   └── ui-ux-pro-max/
├── index.html                    # Vite HTML entry
├── vite.config.ts
├── tailwind.config.cjs
├── postcss.config.cjs
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── .vercel/                      # Vercel project config (auto-managed)
```

---

## Development

```bash
npm install
npm run dev        # Local dev server → http://localhost:5173
npm run build      # Production build → /dist
```

## Video Assets

- **Production** — Videos are served from Cloudflare R2:  
  `https://pub-340c09903d0b49fea4aec85224bcb1bb.r2.dev/video_N.mp4`
- **Local hero slider** — Uses `src/assets/videos/video_N.mp4` (trimmed source files)

## Deployment

Pushing to `main` triggers an automatic Vercel deployment.  
Live site: [aries-black-portfolio.vercel.app](https://aries-black-portfolio.vercel.app)
