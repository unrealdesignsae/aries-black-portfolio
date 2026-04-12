import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Mail, Music, MapPin } from 'lucide-react';

// Custom text scramble hook that doesn't need the paid GSAP plugin
function useScrambleText(text: string, isActive: boolean, isReady: boolean) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (!nodeRef.current || !isReady) return;

    if (isActive) {
      const chars = "qwerty1337h@ck3r+*#&%";
      let iteration = 0;
      
      clearInterval(animationRef.current);
      
      animationRef.current = setInterval(() => {
        if (!nodeRef.current) return;
        nodeRef.current.innerText = text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        
        iteration += 1 / 2; // speed
        
        if (iteration >= text.length) {
          clearInterval(animationRef.current);
          nodeRef.current.innerText = text;
        }
      }, 20);
    } else {
      clearInterval(animationRef.current);
      if (nodeRef.current) nodeRef.current.innerText = text;
    }
    
    return () => clearInterval(animationRef.current);
  }, [isActive, text, isReady]);

  return nodeRef;
}

// Scramble text wrapper component for global use
export const ScrambleHover = ({ text, className = "" }: { text: string; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useScrambleText(text, isHovered, true);

  return (
    <span 
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      {text}
    </span>
  );
};


// Time Display Component
const TimeDisplay = ({ CONFIG = { timeZone: "America/New_York", timeUpdateInterval: 1000 } }) => {
  const [time, setTime] = useState({ hours: '', minutes: '', dayPeriod: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: CONFIG.timeZone,
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      };
      // @ts-ignore
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const parts = formatter.formatToParts(now);
      
      setTime({
        hours: parts.find(part => part.type === "hour")?.value || '',
        minutes: parts.find(part => part.type === "minute")?.value || '',
        dayPeriod: parts.find(part => part.type === "dayPeriod")?.value || ''
      });
    };

    updateTime();
    const interval = setInterval(updateTime, CONFIG.timeUpdateInterval);
    return () => clearInterval(interval);
  }, [CONFIG.timeZone, CONFIG.timeUpdateInterval]);

  return (
    <time className="absolute bottom-8 right-8 font-mono text-sm tracking-widest text-[#00E5FF]" id="current-time">
      {time.hours}<span className="animate-[blink_1s_infinite]">:</span>{time.minutes} {time.dayPeriod}
    </time>
  );
};

// Project Item Component
const ProjectItem = ({ project, index, onMouseEnter, onMouseLeave, isActive, isIdle }: any) => {
  const itemRef = useRef(null);
  
  // Create refs for our custom scramble hook
  const artistRef = useScrambleText(project.artist, isActive, true);
  const albumRef = useScrambleText(project.album, isActive, true);
  const categoryRef = useScrambleText(project.category, isActive, true);
  const labelRef = useScrambleText(project.label, isActive, true);
  const yearRef = useScrambleText(project.year, isActive, true);

  return (
    <li 
      ref={itemRef}
      className={`group flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-b border-white/10 transition-colors duration-300 font-mono text-xs md:text-sm tracking-widest cursor-pointer
        ${isActive ? 'text-white' : 'text-white/40'} 
        ${isIdle ? 'opacity-100' : (isActive ? 'opacity-100' : 'opacity-30')} 
        hover:text-[#00E5FF] hover:border-[#00E5FF]/30`}
      onMouseEnter={() => onMouseEnter(index, project.image)}
      onMouseLeave={onMouseLeave}
    >
      <span ref={artistRef} className="w-full md:w-1/4 mb-2 md:mb-0 uppercase">{project.artist}</span>
      <span ref={albumRef} className="w-full md:w-1/4 mb-2 md:mb-0 font-bold">{project.album}</span>
      <span ref={categoryRef} className="w-full md:w-1/6 md:text-center text-white/50">{project.category}</span>
      <span ref={labelRef} className="w-full md:w-1/4 md:text-right hidden md:block text-white/30">{project.label}</span>
      <span ref={yearRef} className="w-auto md:ml-8 text-[#00E5FF]">{project.year}</span>
    </li>
  );
};

// Main Portfolio Component
const MusicPortfolio = ({ PROJECTS_DATA = [], LOCATION = {}, CALLBACKS = {}, CONFIG = {}, SOCIAL_LINKS = {} }: any) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isIdle, setIsIdle] = useState(true);
  
  const backgroundRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<any>(null);
  const debounceRef = useRef<any>(null);

  // Default configuration 
  const currentConfig = {
    timeZone: "Asia/Dubai",
    timeUpdateInterval: 1000,
    idleDelay: 4000,
    ...CONFIG
  };

  // Preload images
  useEffect(() => {
    PROJECTS_DATA.forEach((project: any) => {
      if (project.image) {
        const img = new Image();
        img.src = project.image;
      }
    });
  }, [PROJECTS_DATA]);

  // Start idle timer
  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    idleTimerRef.current = setTimeout(() => {
      if (activeIndex === -1) {
        setIsIdle(true);
      }
    }, currentConfig.idleDelay);
  }, [activeIndex, currentConfig.idleDelay]);

  // Stop idle timer
  const stopIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  // Handle mouse enter on project
  const handleProjectMouseEnter = useCallback((index: number, imageUrl: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    stopIdleTimer();
    setIsIdle(false);
    
    if (activeIndex === index) return;
    setActiveIndex(index);
    
    if (imageUrl && backgroundRef.current) {
      const bg = backgroundRef.current;
      bg.style.transition = "none";
      bg.style.transform = "translate(-50%, -50%) scale(1.1)";
      bg.style.backgroundImage = `url(${imageUrl})`;
      bg.style.opacity = "1";
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bg.style.transition = "opacity 0.6s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          bg.style.transform = "translate(-50%, -50%) scale(1.0)";
        });
      });
    }
  }, [activeIndex, stopIdleTimer]);

  // Handle mouse leave on project
  const handleProjectMouseLeave = useCallback(() => {
    // Component will handle text reset
  }, []);

  // Handle container mouse leave
  const handleContainerMouseLeave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    setActiveIndex(-1);
    setIsIdle(true);
    
    if (backgroundRef.current) {
      backgroundRef.current.style.opacity = "0";
    }
    
    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    startIdleTimer();
    return () => stopIdleTimer();
  }, [startIdleTimer, stopIdleTimer]);

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col justify-center items-center overflow-hidden bg-black/50 py-24 my-24 border border-white/10 rounded-3xl backdrop-blur-md">
      
      {/* Dynamic Background Image */}
      <div 
        ref={backgroundRef}
        className="absolute top-1/2 left-1/2 w-full h-full object-cover opacity-0 pointer-events-none z-0"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) contrast(1.2)'
        }}
        role="img" 
        aria-hidden="true"
      />

      {/* Main Content container */}
      <main 
        ref={containerRef}
        className="relative z-10 w-full max-w-5xl px-8 md:px-12"
        onMouseLeave={handleContainerMouseLeave}
      >
        <div className="mb-12 border-b border-[#00E5FF]/30 pb-4 flex justify-between items-end">
          <h3 className="font-mono text-sm tracking-[0.3em] font-medium text-[#00E5FF]">PROJECT INDEX</h3>
          <span className="font-mono text-xs opacity-50">LATEST WORK</span>
        </div>

        <ul className="flex flex-col w-full list-none p-0 m-0" role="list">
          {PROJECTS_DATA.map((project: any, index: number) => (
            <ProjectItem
              key={project.id || index}
              project={project}
              index={index}
              onMouseEnter={handleProjectMouseEnter}
              onMouseLeave={handleProjectMouseLeave}
              isActive={activeIndex === index}
              isIdle={isIdle}
            />
          ))}
        </ul>
      </main>

      {/* Corner Elements */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-[#00E5FF]/50" />
      
      <nav className="absolute top-8 right-8 flex gap-4 text-xs font-mono text-[#00E5FF]">
        <a href="https://open.spotify.com/user/226ilulo57zutgtiwjsjqnqsy?si=0004e7bc669a406e" className="flex items-center gap-1 hover:text-white transition-colors">
          <Music size={12} /> Spotify
        </a>
        <a href="mailto:hi@filip.fyi" className="flex items-center gap-1 hover:text-white transition-colors">
          <Mail size={12} /> Email
        </a>
        <a href="https://x.com/filipz" target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-white transition-colors">
          𝕏
        </a>
      </nav>
      
      <div className="absolute bottom-8 left-8 flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
        <MapPin size={12} /> 43.9250° N, 19.5530° E
      </div>
      
      <TimeDisplay CONFIG={currentConfig} />
    </div>
  );
};

export default MusicPortfolio;
