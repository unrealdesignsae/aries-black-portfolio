import React, { useEffect, useRef, useState } from 'react'
import { AnimatedTiles } from "@/components/ui/animated-tiles"
import { VideoGallery } from "@/components/ui/video-gallery"
import GlitchCursor from "@/components/ui/glitch-cursor"
import { LuminaSlider } from "@/components/ui/lumina-interactive-list"
import profileImg from "@/assets/profile.png"
import MusicPortfolio, { ScrambleHover } from "@/components/ui/music-portfolio"
import { ScannerCardStream } from "@/components/ui/scanner-card-stream"
import { LogoTimeline } from "@/components/ui/logo-timeline"
import type { LogoItem } from "@/components/ui/logo-timeline"
import {
  Layers, Monitor, Film, Cpu, Sparkles,
  Zap, Wand2, LayoutGrid, Bot, Ruler, Menu, X
} from "lucide-react"

const mockMusicProjects = [
  {
    id: 1,
    artist: "ARCHITECTURAL",
    album: "DESERT VILLA",
    category: "CONCEPT",
    label: "EXTERIOR",
    year: "2024",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    artist: "INTERIOR",
    album: "MINIMAL PENTHOUSE",
    category: "LIVING",
    label: "MODERN",
    year: "2024",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c639bb?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 3,
    artist: "EXPERIENTIAL",
    album: "META STAGE",
    category: "EVENT",
    label: "LIGHTING",
    year: "2023",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    artist: "VISUALIZATION",
    album: "GLASS PAVILION",
    category: "COMMERCIAL",
    label: "RENDER",
    year: "2023",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 5,
    artist: "CONCEPTUAL",
    album: "NEON CORRIDOR",
    category: "EXHIBITION",
    label: "IMMERSIVE",
    year: "2022",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"
  }
];

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
  // Row 3 — Adobe Creative (using Lucide fallbacks — SI CDN slugs for Adobe vary by version)
  { row: 3, label: 'Photoshop',     icon: <Film size={16} style={{ color: '#31A8FF' }} />,     animationDelay: -50,   animationDuration: 50 },
  { row: 3, label: 'After Effects', icon: <Sparkles size={16} style={{ color: '#9999FF' }} />, animationDelay: -33.3, animationDuration: 50 },
  { row: 3, label: 'Premiere Pro',  icon: <Layers size={16} style={{ color: '#9999FF' }} />,   animationDelay: -16.7, animationDuration: 50 },
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

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    // Reveal animations
    const reveals = document.querySelectorAll(".reveal")
    const reveal = () => {
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight
        const elementTop = reveals[i].getBoundingClientRect().top
        const elementVisible = 150
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active")
        } else {
          reveals[i].classList.remove("active")
        }
      }
    }
    window.addEventListener("scroll", reveal)
    reveal()

    // Navbar scroll detection
    const navbar = document.querySelector(".navbar") as HTMLElement | null
    const onScroll = () => {
      if (window.scrollY > 60) {
        navbar?.classList.add("scrolled")
      } else {
        navbar?.classList.remove("scrolled")
      }
    }
    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", reveal)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className="portfolio-root">
      {/* ── FIXED FULL-SCREEN GLITCH BACKGROUND ── */}
      <GlitchCursor fullscreen />

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-logo">AB.</div>
        <div className="nav-links">
          <a href="#about" onClick={() => setMobileNavOpen(false)}><ScrambleHover text="About" /></a>
          <a href="#portfolio" onClick={() => setMobileNavOpen(false)}><ScrambleHover text="Work" /></a>
          <a href="#expertise" onClick={() => setMobileNavOpen(false)}><ScrambleHover text="Expertise" /></a>
          <a href="#experience" onClick={() => setMobileNavOpen(false)}><ScrambleHover text="Experience" /></a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="mobile-nav-drawer">
          <a href="#about" onClick={() => setMobileNavOpen(false)}>About</a>
          <a href="#portfolio" onClick={() => setMobileNavOpen(false)}>Work</a>
          <a href="#expertise" onClick={() => setMobileNavOpen(false)}>Expertise</a>
          <a href="#experience" onClick={() => setMobileNavOpen(false)}>Experience</a>
          <a href="#contact" onClick={() => setMobileNavOpen(false)}>Let's Talk</a>
        </div>
      )}

      {/* ── LUMINA VIDEO SLIDER HERO (new, first) ── */}
      <LuminaSlider />

      {/* ── ORIGINAL HERO (second, pushed below) ── */}
      {/* Hero Section */}
      <header className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-overlay"></div>
        <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="subtitle fade-in">BASED IN DUBAI, UAE</h2>
          <h1 className="title slide-up">ARIES BLACK</h1>
          <p className="tagline slide-up-delay">Senior CG Generalist <span className="dot">•</span> Architectural Visualization <span className="dot">•</span> Experiential Design</p>
          
          <div className="hero-stats fade-in-delay">
            <div className="stat">
              <span className="stat-number">12+</span>
              <span className="stat-label">Years of<br />Experience</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Major Brands<br />Collaborated</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">20+</span>
              <span className="stat-label">Mega Events<br />Delivered</span>
            </div>
          </div>

          <a href="#portfolio" className="cta-button primary slide-up-delay-2">
            <ScrambleHover text="Explore My Work" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          </a>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper reveal">
              {/* Replacing static image with AnimatedTiles as per user request */}
              <AnimatedTiles 
                imageUrl={profileImg} 
                rows={12} 
                cols={8} 
                tileSize={50}
                className="rounded-xl overflow-hidden shadow-2xl"
              />
              <div className="image-glow"></div>
            </div>
            <div className="about-content reveal">
              <h2>The Architect of Experience.</h2>
              <p>I am a Senior CG Generalist and Designer with over a decade of experience transforming concepts into visceral realities. From photorealistic architectural visualization to massive experiential stages in Dubai, I merge technical precision with cinematic lighting.</p>
              <p>My work across the UAE has supported giants like TAG Heuer, Montblanc, and the World Government Summit, turning visionary ideas into immersive 3D, real-time, and built environments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Spotlight Section */}
      <section id="portfolio" className="section portfolio-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Featured Visualizations</h2>
            <p>Curated archive of architectural visualizations, immersive stage designs, and real-time renders.</p>
          </div>

          <div className="reveal">
            <VideoGallery />
          </div>

          <div className="reveal">
            <MusicPortfolio PROJECTS_DATA={mockMusicProjects} />
          </div>
          
          <div className="client-marquee reveal">
            <p className="marquee-label">TRUSTED BY GLOBAL BRANDS</p>
            <div className="marquee-wrapper">
              {/* Duplicate track for seamless infinite loop */}
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

      {/* ── SOFTWARE ARSENAL TIMELINE ── */}
      <section id="software-arsenal" className="section" style={{ padding: '5rem 0 2rem', overflow: 'hidden' }}>
        <div className="container" style={{ marginBottom: '2.5rem' }}>
          <div className="section-header reveal">
            <h2 style={{ marginBottom: '0.6rem' }}>Software Arsenal</h2>
            <p style={{ opacity: 0.55, lineHeight: 1.7 }}>
              Every tool in my workflow, organised by discipline — from photorealistic rendering to real-time worlds and agentic AI pipelines.
            </p>
          </div>
        </div>

        <LogoTimeline
          height="h-[490px]"
          showRowSeparator={true}
          items={softwareItems}
        />
      </section>

      {/* Expertise & Tools */}
      <section id="expertise" className="section dark-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Core Disciplines</h2>
            <p>A decade of precision across every pillar of visual production — from photorealistic renders to real-time worlds and AI-driven pipelines.</p>
          </div>
          <ul className="skills-list skills-list--grid reveal">
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

      {/* ── AGENTIC AI WORKFLOWS SECTION ── */}
      <section id="ai-workflows" className="section" style={{ padding: '5rem 0 4rem', overflow: 'hidden' }}>
        <div className="container" style={{ marginBottom: '2.5rem' }}>
          <div className="section-header reveal" style={{ maxWidth: 680 }}>
            <h2 style={{ marginBottom: '0.75rem' }}>Agentic AI for Designers</h2>
            <p style={{ opacity: 0.65, lineHeight: 1.7 }}>
              Beyond tools — these are autonomous workflows. I integrate AI agents that generate,
              render, animate, and iterate at machine speed, compressing weeks of production into hours.
              Hover over any card as the scanner reveals the pipeline beneath the surface.
            </p>
          </div>
        </div>



        {/* Scanner card stream — full-bleed */}
        <ScannerCardStream
          initialSpeed={260}
          direction={-1}
          repeat={4}
          cardGap={60}
          friction={0.96}
          scanEffect="scramble"
          cardImages={[
            'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
            'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80',
            'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80',
          ]}
        />

        {/* Workflow labels beneath strip */}
        <div className="container" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {[
            { label: 'AI Video Generation', desc: 'RunwayML · Kling · Sora' },
            { label: '3D Asset Synthesis',  desc: 'Meshy · Luma · Tripo3D' },
            { label: 'Automated Rendering', desc: 'ComfyUI · Stable Diffusion' },
            { label: 'Motion & Animation',  desc: 'AnimateDiff · Hailuo' },
            { label: 'Prompt Engineering',  desc: 'Claude · GPT-4o · Gemini' },
          ].map(w => (
            <div key={w.label} className="reveal" style={{
              padding: '1rem',
              borderTop: '1px solid rgba(167,139,250,0.25)',
            }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>{w.label}</p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(167,139,250,0.7)', fontFamily: 'monospace' }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="section experience-section">
        <div className="container">
          <div className="section-header center reveal">
            <h2>Professional Journey</h2>
          </div>
          
          <div className="timeline">
            {[
              { date: 'Sep 2024 — Present', role: 'Senior CG Generalist', company: 'Entourage Marketing & Events • Dubai', desc: 'Developing high-end 3D visualizations and stage concepts for major corporate events.' },
              { date: 'Mar 2024 — Aug 2024', role: 'Architectural Visualizer', company: 'Ambient Studio • Dubai', desc: 'Produced architectural renderings and landscape visualizations for developments.' },
              { date: 'Sep 2022 — Feb 2024', role: 'Senior 3D Artist', company: 'OD Event • Dubai', desc: 'Created high-quality visualizations and immersive stage designs.' },
              { date: '2012 — 2021', role: 'Self-Employed Designer', company: 'InDesign • Cairo, Egypt', desc: 'Delivered architectural and interior designs for various sectors.' }
            ].map((item, i) => (
              <div key={i} className="timeline-item reveal">
                <div className="timeline-dot"></div>
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

      {/* Contact & Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="contact-box glass-card reveal">
            <h2>Let's build something extraordinary.</h2>
            <p>Currently open to new opportunities—Remote globally or locally in Dubai.</p>
            
            <div className="contact-info">
              <a href="mailto:ariesblackdesign@icloud.com" className="contact-link">
                <ScrambleHover text="ariesblackdesign@icloud.com" />
              </a>
              <a href="tel:+971567502350" className="contact-link">
                <ScrambleHover text="+971 567 502 350" />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Aries Black. All rights reserved.</p>
            <p>Designed in Dubai.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
