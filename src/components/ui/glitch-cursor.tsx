import React, { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GlitchCursorProps {
  title?: string;
  subtitle?: string;
  caption?: string;
  titleSize?: string;
  subtitleSize?: string;
  captionSize?: string;
  className?: string;
  /** When true, renders fixed/fullscreen as a background layer with no pointer events */
  fullscreen?: boolean;
}

// ─── Internal canvas classes (defined outside component to avoid recreation) ──
class GlitchBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  life: number;
  color: string;
  context: CanvasRenderingContext2D;

  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    this.x = x + (Math.random() - 0.5) * 50;
    this.y = y + (Math.random() - 0.5) * 50;
    this.width = Math.random() * 50 + 10;
    this.height = Math.random() * 30 + 5;
    this.life = 100;
    this.context = context;
    this.color = `hsla(${180 + Math.random() * 60}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`;
  }

  draw() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.life -= 1;
    this.x += (Math.random() - 0.5) * 4;
    this.y += (Math.random() - 0.5) * 4;
  }
}

class Scanline {
  y: number;
  height: number;
  speed: number;
  life: number;
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  offsetX: number;

  constructor(
    y: number,
    height: number,
    speed: number,
    context: CanvasRenderingContext2D,
    canvasWidth: number
  ) {
    this.y = y;
    this.height = height;
    this.speed = speed;
    this.life = 15;
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.offsetX = (Math.random() - 0.5) * 100;
  }

  draw() {
    const imageData = this.context.getImageData(0, this.y, this.canvasWidth, this.height);
    this.context.putImageData(imageData, this.offsetX, this.y);
    this.context.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.05)`;
    this.context.fillRect(0, this.y, this.canvasWidth, this.height);
  }

  update() {
    this.life -= 1;
    this.y += this.speed;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const GlitchCursor = ({
  title = "",
  subtitle = "",
  caption = "",
  titleSize = "text-5xl md:text-7xl lg:text-8xl",
  subtitleSize = "text-xl md:text-2xl",
  captionSize = "text-sm md:text-base",
  className = "",
  fullscreen = false,
}: GlitchCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const glitchBlocks = useRef<GlitchBlock[]>([]);
  const scanlines = useRef<Scanline[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      glitchBlocks.current = glitchBlocks.current.filter(block => {
        block.update();
        block.draw();
        return block.life > 0;
      });

      scanlines.current = scanlines.current.filter(line => {
        line.update();
        line.draw();
        return line.life > 0;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.5) {
        glitchBlocks.current.push(new GlitchBlock(e.clientX, e.clientY, ctx));
      }
    };

    const handleClick = () => {
      for (let i = 0; i < 20; i++) {
        scanlines.current.push(
          new Scanline(
            Math.random() * canvas.height,
            Math.random() * 10 + 1,
            (Math.random() - 0.5) * 4,
            ctx,
            canvas.width
          )
        );
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    // fullscreen mode is a passive background — only attach click in content mode
    if (!fullscreen) {
      window.addEventListener("click", handleClick);
    } else {
      window.addEventListener("click", handleClick); // still looks cool
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
    };
  }, [fullscreen]);

  const showContent = !!(title || subtitle || caption);

  // Fullscreen background mode — mirrors LiquidGradient's `fullscreen` prop behaviour
  if (fullscreen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          background: "#000",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  // Standalone / demo mode — renders with content overlay
  return (
    <div
      className={`relative h-screen w-screen overflow-hidden bg-black font-mono ${className}`}
    >
      <canvas ref={canvasRef} className="fixed inset-0 block h-full w-full" />

      {showContent && (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 select-none text-center p-4">
          {title && (
            <h1
              className={`m-0 p-0 text-cyan-300 font-bold uppercase tracking-widest leading-none ${titleSize}`}
              style={{ textShadow: "2px 2px 0px #ff00ff, -2px -2px 0px #00ffff" }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <h2
              className={`m-0 p-0 text-gray-300 font-normal leading-none ${subtitleSize}`}
              style={{ textShadow: "1px 1px 0px #ff00ff, -1px -1px 0px #00ffff" }}
            >
              {subtitle}
            </h2>
          )}
          {caption && (
            <p className={`mt-4 p-0 text-gray-400 font-light leading-none ${captionSize}`}>
              {caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GlitchCursor;
