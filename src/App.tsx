import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { AnimatedTiles } from "@/components/ui/animated-tiles"
import { VideoGallery } from "@/components/ui/video-gallery"
import GlitchCursor from "@/components/ui/glitch-cursor"
import profileImg from "@/assets/profile.png"
import { ScrambleHover } from "@/components/ui/music-portfolio"
import { ScannerCardStream } from "@/components/ui/scanner-card-stream"
import { LogoTimeline } from "@/components/ui/logo-timeline"
import type { LogoItem } from "@/components/ui/logo-timeline"
import {
  Layers, Monitor, Film, Cpu, Sparkles,
  Zap, Wand2, LayoutGrid, Bot, Ruler, Menu, X,
  Mail, Phone
} from "lucide-react"

// ── Contact / social constants ────────────────────────────────────────────────
const CONTACTS = {
  email:     'ariesblackdesign@outlook.com',
  phone:     '+971567502350',
  whatsapp:  'https://wa.me/971567502350',
  linkedin:  'https://www.linkedin.com/in/ariesblack/',
  instagram: 'https://www.instagram.com/blacc.ae',
}

// ── Inline brand SVG icons (no CDN dependency) ────────────────────────────────
const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// ── helper: SimpleIcons as <img> ─────────────────────────────────────────────
const SI = ({ slug, label }: { slug: string; label: string }) => (
  <img
    src={`https://cdn.simpleicons.org/${slug}/ffffff`}
    alt={label}
    width={16}
    height={16}
    style={{ display: 'inline-block', filter: 'opacity(0.85)' }}
  />
);

// ── Software items organised by discipline (7 rows) ──────────────────────────
const softwareItems: LogoItem[] = [
  // Row 1 — 3D Modelling
  { row: 1, label: 'Blender',    icon: <SI slug="blender"  label="Blender"  />, animationDelay: -55,   animationDuration: 55 },
  { row: 1, label: '3ds Max',    icon: <SI slug="autodesk" label="Autodesk" />, animationDelay: -36.7, animationDuration: 55 },
  { row: 1, label: 'SketchUp',   icon: <SI slug="sketchup" label="Sketchup"/>, animationDelay: -18.3, animationDuration: 55 },
  // Row 2 — Real-Time & Viz
  { row: 2, label: 'Unreal Engine 5', icon: <SI slug="unrealengine" label="Unreal" />, animationDelay: -60,  animationDuration: 60 },
  { row: 2, label: 'Enscape',         icon: <Monitor size={16} />,                     animationDelay: -40,  animationDuration: 60 },
  { row: 2, label: 'Lumion',          icon: <Layers size={16} />,                      animationDelay: -20,  animationDuration: 60 },
  // Row 3 — Adobe Creative
  { row: 3, label: 'Photoshop',     icon: <Film size={16} style={{ color: '#31A8FF' }} />,     animationDelay: -50,   animationDuration: 50 },
  { row: 3, label: 'After Effects', icon: <Sparkles size={16} style={{ color: '#00E5FF' }} />, animationDelay: -33.3, animationDuration: 50 },
  { row: 3, label: 'Premiere Pro',  icon: <Layers size={16} style={{ color: '#00E5FF' }} />,   animationDelay: -16.7, animationDuration: 50 },
  // Row 4 — CAD & Architecture
  { row: 4, label: 'AutoCAD', icon: <SI slug="autodesk" label="AutoCAD" />, animationDelay: -48, animationDuration: 48 },
  { row: 4, label: 'Revit',   icon: <Ruler size={16} />,                    animationDelay: -32, animationDuration: 48 },
  { row: 4, label: 'V-Ray',   icon: <Cpu size={16} />,                      animationDelay: -16, animationDuration: 48 },
  // Row 5 — AI Generative
  { row: 5, label: 'Midjourney',       icon: <Sparkles size={16} />,   animationDelay: -65,   animationDuration: 65 },
  { row: 5, label: 'Stable Diffusion', icon: <Wand2 size={16} />,      animationDelay: -48.8, animationDuration: 65 },
  { row: 5, label: 'RunwayML',         icon: <Film size={16} />,       animationDelay: -32.5, animationDuration: 65 },
  { row: 5, label: 'ComfyUI',          icon: <LayoutGrid size={16} />, animationDelay: -16.3, animationDuration: 65 },
  // Row 6 — AI Agent Platforms
  { row: 6, label: 'Claude',  icon: <SI slug="anthropic" label="Claude" />, animationDelay: -58,   animationDuration: 58 },
  { row: 6, label: 'ChatGPT', icon: <Bot size={16} />,                       animationDelay: -43.5, animationDuration: 58 },
  { row: 6, label: 'Gemini',  icon: <Zap size={16} />,                       animationDelay: -29,   animationDuration: 58 },
  { row: 6, label: 'n8n',     icon: <SI slug="n8n" label="n8n" />,           animationDelay: -14.5, animationDuration: 58 },
  // Row 7 — Media & Collab
  { row: 7, label: 'DaVinci Resolve', icon: <Film size={16} />,                         animationDelay: -52,   animationDuration: 52 },
  { row: 7, label: 'Figma',           icon: <SI slug="figma" label="Figma" />,           animationDelay: -34.7, animationDuration: 52 },
  { row: 7, label: 'Notion',          icon: <SI slug="notion" label="Notion" />,         animationDelay: -17.3, animationDuration: 52 },
];

// ── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const t0 = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setCount(Math.floor(eased * target))
            if (p < 1) requestAnimationFrame(tick)
            else setCount(target)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

function StatItem({ value, suffix = '+', label }: { value: number; suffix?: string; label: React.ReactNode }) {
  const { count, ref } = useCountUp(value)
  return (
    <div className="stat">
      <span className="stat-number" ref={ref}>{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal, .reveal-left, .stagger-children")
    const reveal = () => {
      revealEls.forEach(el => {
        const top = el.getBoundingClientRect().top
        if (top < window.innerHeight - 100) {
          el.classList.add("active")
        }
      })
    }
    window.addEventListener("scroll", reveal)
    reveal()

    const navbar = document.querySelector(".navbar") as HTMLElement | null
    const onScroll = () => {
      if (window.scrollY > 60) navbar?.classList.add("scrolled")
      else navbar?.classList.remove("scrolled")
    }
    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", reveal)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className="portfolio-root">
      <GlitchCursor fullscreen />

      {/* ── NAV ── */}
      <nav className="navbar">
        <div className="nav-logo">AB.</div>
        <div className="nav-links">
          <a href="#about" onClick={() => setMobileNavOpen(false)}><ScrambleHover text="About" /></a>
          <a href="#portfolio" onClick={() => setMobileNavOpen(false)}><ScrambleHover text="Work" /></a>
          <a href="#expertise" onClick={() => setMobileNavOpen(false)}><ScrambleHover text="Expertise" /></a>
          <a href="#experience" onClick={() => setMobileNavOpen(false)}><ScrambleHover text="Experience" /></a>
        </div>
        <div className="nav-right">
          {/* Social + contact icons — desktop */}
          <div className="nav-social">
            <a href={CONTACTS.linkedin} target="_blank" rel="noopener noreferrer"
               className="nav-icon-btn" aria-label="LinkedIn" data-tip="LinkedIn">
              <LinkedInIcon size={14} />
            </a>
            <a href={CONTACTS.instagram} target="_blank" rel="noopener noreferrer"
               className="nav-icon-btn" aria-label="Instagram" data-tip="Instagram">
              <InstagramIcon size={14} />
            </a>
            <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer"
               className="nav-icon-btn" aria-label="WhatsApp" data-tip="WhatsApp">
              <WhatsAppIcon size={14} />
            </a>
            <a href={`mailto:${CONTACTS.email}`}
               className="nav-icon-btn" aria-label="Email" data-tip="Email">
              <Mail size={14} />
            </a>
            <a href={`tel:${CONTACTS.phone}`}
               className="nav-icon-btn" aria-label="Call" data-tip="Call">
              <Phone size={14} />
            </a>
          </div>
          <span className="nav-sep" aria-hidden="true" />
          <a href="#contact" className="nav-cta nav-cta--mobile-hidden"><ScrambleHover text="Let's Talk" /></a>
          <button
            className="nav-hamburger"
            onClick={() => setMobileNavOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileNavOpen && (
        <div className="mobile-nav-drawer">
          <a href="#about" onClick={() => setMobileNavOpen(false)}>About</a>
          <a href="#portfolio" onClick={() => setMobileNavOpen(false)}>Work</a>
          <a href="#expertise" onClick={() => setMobileNavOpen(false)}>Expertise</a>
          <a href="#experience" onClick={() => setMobileNavOpen(false)}>Experience</a>
          <a href="#contact" onClick={() => setMobileNavOpen(false)}>Let's Talk</a>
          {/* Social row in mobile drawer */}
          <div className="mobile-nav-social">
            <a href={CONTACTS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon size={18} />
            </a>
            <a href={CONTACTS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon size={18} />
            </a>
            <a href={`mailto:${CONTACTS.email}`} aria-label="Email">
              <Mail size={18} />
            </a>
            <a href={`tel:${CONTACTS.phone}`} aria-label="Call">
              <Phone size={18} />
            </a>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <header className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-eyebrow fade-in">Based in Dubai, UAE</span>
          <h1 className="title slide-up">ARIES <em className="title-em">BLACK</em></h1>
          <p className="tagline slide-up-delay">
            Senior CG Generalist <span className="dot">·</span> Technical Art Director <span className="dot">·</span> Architectural Visualization <span className="dot">·</span> Experiential Design
          </p>

          <div className="hero-stats fade-in-delay">
            <StatItem value={12} label={<>Years<br />Experience</>} />
            <StatItem value={50} label={<>Global<br />Brands</>} />
            <StatItem value={20} label={<>Mega Events<br />Delivered</>} />
          </div>

          <a href="#portfolio" className="cta-button primary slide-up-delay-2">
            <ScrambleHover text="Explore My Work" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          </a>
        </div>
      </header>

      {/* ── ABOUT ── */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper reveal reveal-left">
              <AnimatedTiles
                imageUrl={profileImg}
                rows={12}
                cols={8}
                tileSize={50}
                className="rounded-xl overflow-hidden shadow-2xl"
              />
              <div className="image-glow" />
            </div>
            <div className="about-content reveal">
              <span className="section-eyebrow">01 / About</span>
              <h2 className="about-headline">The Architect<br />of <em>Experience.</em></h2>
              <p>I am a Senior CG Generalist and Designer with over a decade of experience transforming concepts into visceral realities. From photorealistic architectural visualization to massive experiential stages in Dubai, I merge technical precision with cinematic lighting.</p>
              <p>My work across the UAE has supported giants like TAG Heuer, Montblanc, and the World Government Summit — turning visionary ideas into immersive 3D, real-time, and built environments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORK ── */}
      <section id="portfolio" className="section portfolio-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">02 / Work</span>
            <h2>Featured <em>Visualizations</em></h2>
            <p>Curated archive of architectural visualizations, immersive stage designs, and real-time renders.</p>
          </div>

          <div className="reveal">
            <VideoGallery />
          </div>

          <div className="client-marquee reveal">
            <p className="marquee-label">Trusted by global brands</p>
            <div className="marquee-wrapper">
              {[0, 1].map(n => (
                <div className="marquee-track" key={n} aria-hidden={n === 1 ? true : undefined}>
                  <img className="client-logo" src="https://cdn.simpleicons.org/samsung/white" alt="Samsung" />
                  <img className="client-logo" src="https://cdn.simpleicons.org/huawei/white" alt="Huawei" />
                  <img className="client-logo" src="https://cdn.simpleicons.org/vodafone/white" alt="Vodafone" />
                  <img className="client-logo" src="https://cdn.simpleicons.org/figma/white" alt="Figma" />
                  <img className="client-logo" src="https://cdn.simpleicons.org/unrealengine/white" alt="Unreal Engine" />
                  <span className="client-name">TAG Heuer</span>
                  <span className="client-name">Montblanc</span>
                  <span className="client-name">Warner Bros</span>
                  <span className="client-name">Richard Mille</span>
                  <span className="client-name">Omniyat</span>
                  <span className="client-name">Dubai Holding</span>
                  <span className="client-name">G20 Saudi Arabia</span>
                  <span className="client-name">Ministry of Transport</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOFTWARE ARSENAL ── */}
      <section id="software-arsenal" className="section" style={{ padding: '5rem 0 2rem', overflow: 'hidden' }}>
        <div className="container" style={{ marginBottom: '2.5rem' }}>
          <div className="section-header reveal">
            <span className="section-eyebrow">03 / Tools</span>
            <h2>Software <em>Arsenal</em></h2>
            <p>Every tool in my workflow, organised by discipline — from photorealistic rendering to real-time worlds and agentic AI pipelines.</p>
          </div>
        </div>
        <LogoTimeline height="h-[490px]" showRowSeparator={true} items={softwareItems} />
      </section>

      {/* ── CORE DISCIPLINES ── */}
      <section id="expertise" className="section dark-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">04 / Expertise</span>
            <h2>Core <em>Disciplines</em></h2>
            <p>A decade of precision across every pillar of visual production — from photorealistic renders to real-time worlds and AI-driven pipelines.</p>
          </div>
          <ul className="skills-list skills-list--grid reveal stagger-children">
            <li>
              <h4>Architectural Visualization</h4>
              <p>Photorealistic renderings of commercial &amp; residential developments.</p>
            </li>
            <li>
              <h4>Real-Time Environments</h4>
              <p>Immersive interactive scenes engineered in Unreal Engine 5.</p>
            </li>
            <li>
              <h4>Experiential &amp; Event Design</h4>
              <p>Concept development and stage creation for luxury activations.</p>
            </li>
            <li>
              <h4>Look Dev &amp; Lighting</h4>
              <p>Crafting mood, atmosphere, and cinematic lighting setups.</p>
            </li>
            <li>
              <h4>Animation &amp; Rigging</h4>
              <p>Complex 3D animation, character rigging, and motion systems for immersive storytelling.</p>
            </li>
            <li>
              <h4>Agentic AI Workflows</h4>
              <p>Integrating autonomous AI pipelines to supercharge creative ideation and production speed.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ── AI WORKFLOWS ── */}
      <section id="ai-workflows" className="section" style={{ padding: '5rem 0 4rem', overflow: 'hidden' }}>
        <div className="container" style={{ marginBottom: '2.5rem' }}>
          <div className="section-header reveal">
            <span className="section-eyebrow">05 / AI</span>
            <h2>Agentic AI for <em>Designers</em></h2>
            <p>Beyond tools — these are autonomous workflows. AI agents that generate, render, animate, and iterate at machine speed, compressing weeks of production into hours.</p>
          </div>
        </div>

        <ScannerCardStream
          initialSpeed={260}
          direction={-1}
          repeat={4}
          cardGap={60}
          friction={0.96}
          scanEffect="scramble"
          cardImages={[
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
            'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
          ]}
        />

        <div className="container ai-workflow-grid">
          {[
            { label: 'AI Video Generation', desc: 'RunwayML · Kling · Sora' },
            { label: '3D Asset Synthesis',  desc: 'Meshy · Luma · Tripo3D' },
            { label: 'Automated Rendering', desc: 'ComfyUI · Stable Diffusion' },
            { label: 'Motion & Animation',  desc: 'AnimateDiff · Hailuo' },
            { label: 'Prompt Engineering',  desc: 'Claude · GPT-4o · Gemini' },
          ].map(w => (
            <div key={w.label} className="ai-workflow-item reveal">
              <p className="ai-workflow-label">{w.label}</p>
              <p className="ai-workflow-tools">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="section experience-section">
        <div className="container">
          <div className="section-header center reveal">
            <span className="section-eyebrow">06 / Journey</span>
            <h2>Professional <em>Journey</em></h2>
          </div>

          <div className="timeline stagger-children">
            {[
              { date: 'Sep 2024 — Present', role: 'Senior CG Generalist', company: 'Entourage Marketing & Events · Dubai', desc: 'Developing high-end 3D visualizations and stage concepts for major corporate events and luxury brand activations.' },
              { date: 'Mar 2024 — Aug 2024', role: 'Architectural Visualizer', company: 'Ambient Studio · Dubai', desc: 'Produced architectural renderings and landscape visualizations for premium residential and commercial developments.' },
              { date: 'Sep 2022 — Feb 2024', role: 'Senior 3D Artist', company: 'OD Event · Dubai', desc: 'Created high-quality visualizations and immersive stage designs for large-scale events across the UAE.' },
              { date: '2012 — 2021', role: 'Self-Employed Designer', company: 'InDesign · Cairo, Egypt', desc: 'Delivered architectural and interior designs across residential, commercial, and hospitality sectors.' }
            ].map((item, i) => (
              <div key={i} className="timeline-item reveal">
                <div className="timeline-dot" />
                <div className="timeline-content glass-card">
                  <span className="date">{item.date}</span>
                  <h3 className="role">{item.role}</h3>
                  <h4 className="company">{item.company}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / FOOTER ── */}
      <footer id="contact" className="footer-v2">
        <div className="footer-v2-glow" />
        <div className="footer-v2-inner">

          <div className="footer-v2-top reveal">
            <span className="footer-v2-avail">
              <span className="footer-v2-pulse" />
              Available for Projects
            </span>
            <h2 className="footer-v2-headline">
              Let's build<br />something<br />
              <em className="footer-v2-headline-em">extraordinary.</em>
            </h2>
          </div>

          <div className="footer-v2-contacts reveal">
            <a href={`mailto:${CONTACTS.email}`} className="footer-v2-link">
              <span className="footer-v2-link-label">Email</span>
              <span className="footer-v2-link-value"><ScrambleHover text="ariesblackdesign@outlook.com" /></span>
              <span className="footer-v2-link-arrow">↗</span>
            </a>
            <a href={`tel:${CONTACTS.phone}`} className="footer-v2-link">
              <span className="footer-v2-link-label">Phone</span>
              <span className="footer-v2-link-value"><ScrambleHover text="+971 567 502 350" /></span>
              <span className="footer-v2-link-arrow">↗</span>
            </a>
          </div>

          {/* Social platforms strip */}
          <div className="footer-v2-social reveal">
            <a href={CONTACTS.linkedin} target="_blank" rel="noopener noreferrer" className="footer-v2-social-item">
              <span className="footer-v2-social-ico">
                <LinkedInIcon size={18} />
              </span>
              <span className="footer-v2-social-body">
                <span className="footer-v2-social-name">LinkedIn</span>
                <span className="footer-v2-social-handle">/in/ariesblack</span>
              </span>
              <span className="footer-v2-social-arrow">↗</span>
            </a>
            <a href={CONTACTS.instagram} target="_blank" rel="noopener noreferrer" className="footer-v2-social-item">
              <span className="footer-v2-social-ico">
                <InstagramIcon size={18} />
              </span>
              <span className="footer-v2-social-body">
                <span className="footer-v2-social-name">Instagram</span>
                <span className="footer-v2-social-handle">@blacc.ae</span>
              </span>
              <span className="footer-v2-social-arrow">↗</span>
            </a>
            <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="footer-v2-social-item">
              <span className="footer-v2-social-ico">
                <WhatsAppIcon size={18} />
              </span>
              <span className="footer-v2-social-body">
                <span className="footer-v2-social-name">WhatsApp</span>
                <span className="footer-v2-social-handle">+971 567 502 350</span>
              </span>
              <span className="footer-v2-social-arrow">↗</span>
            </a>
          </div>

          <div className="footer-v2-bottom">
            <span className="footer-v2-coords">25.2048° N · 55.2708° E · Dubai, UAE</span>
            <span className="footer-v2-copy">© 2026 Aries Black · All rights reserved</span>
          </div>

        </div>
      </footer>
      <Analytics />
    </div>
  )
}

export default App
