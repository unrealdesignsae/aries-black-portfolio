"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedTilesProps {
  rows?: number
  cols?: number
  tileSize?: number
  imageUrl?: string
  backgroundColor?: string
  className?: string
}

export function AnimatedTiles({
  rows = 12,
  cols = 8,
  tileSize = 50,
  imageUrl = "/src/assets/profile.jpg",
  backgroundColor = "transparent",
  className,
}: AnimatedTilesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tilesRef = useRef<HTMLDivElement>(null)
  // Responsive tile size — recalculates when container width changes
  const [activeTileSize, setActiveTileSize] = useState(tileSize)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width
        if (availableWidth > 0) {
          // Fit all cols within available width, never exceed the original tileSize
          const computed = Math.floor(availableWidth / cols)
          setActiveTileSize(Math.min(computed, tileSize))
        }
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [cols, tileSize])

  const maxOpacities = [
    [0.0, 0.2, 0.4, 0.6, 0.6, 0.4, 0.2, 0.0],
    [0.2, 0.4, 0.8, 1.0, 1.0, 0.6, 0.4, 0.2],
    [0.2, 0.4, 1.0, 1.0, 1.0, 0.8, 0.6, 0.2],
    [0.2, 0.6, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
    [0.2, 0.6, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
    [0.2, 0.6, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
    [0.2, 0.4, 0.8, 1.0, 1.0, 0.8, 0.6, 0.2],
    [0.2, 0.4, 0.6, 0.8, 0.8, 0.6, 0.4, 0.1],
    [0.1, 0.2, 0.4, 0.4, 0.4, 0.4, 0.2, 0.1],
    [0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1, 0.1],
    [0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  ]

  useEffect(() => {
    if (!tilesRef.current || activeTileSize === 0) return

    const tiles: HTMLDivElement[] = []
    tilesRef.current.innerHTML = ""

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = document.createElement("div")
        tile.className = "tile"
        tile.style.width = `${activeTileSize}px`
        tile.style.height = `${activeTileSize}px`
        tile.style.backgroundImage = `url(${imageUrl})`
        tile.style.backgroundPosition = `${-col * activeTileSize}px ${-row * activeTileSize}px`
        tile.style.backgroundSize = `${cols * activeTileSize}px ${rows * activeTileSize}px`
        tile.style.float = "left"
        tiles.push(tile)
        tilesRef.current.appendChild(tile)
      }
    }

    const animationFrames: number[] = []
    const startTimes: number[] = []

    tiles.forEach((tile, i) => {
      const row = Math.floor(i / cols)
      const col = i % cols
      const variance = 0.4
      const maxOpacity = maxOpacities[row]?.[col] ?? 0
      const minOpacity = Math.max(0, maxOpacity - variance)
      const duration = Math.random() * 0.25 + 0.75 // 0.75 to 1 second

      if (maxOpacity === 0) {
        tile.style.opacity = "0"
        return
      }

      startTimes[i] = Math.random() * duration
      let startTime: number | null = null

      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const elapsed = (currentTime - startTime) / 1000
        const progress = (elapsed + startTimes[i]) % (duration * 2)
        const normalizedProgress = progress < duration ? progress / duration : (duration * 2 - progress) / duration

        const opacity = minOpacity + (maxOpacity - minOpacity) * normalizedProgress
        tile.style.opacity = Math.max(minOpacity, Math.min(maxOpacity, opacity)).toString()

        animationFrames[i] = requestAnimationFrame(animate)
      }

      animationFrames[i] = requestAnimationFrame(animate)
    })

    return () => {
      animationFrames.forEach((frameId) => cancelAnimationFrame(frameId))
    }
  }, [rows, cols, activeTileSize, imageUrl])

  return (
    <div
      ref={containerRef}
      className={cn("flex justify-center items-center w-full", className)}
      style={{ backgroundColor, minHeight: activeTileSize > 0 ? `${rows * activeTileSize}px` : '400px' }}
    >
      <div
        ref={tilesRef}
        style={{
          width: `${cols * activeTileSize}px`,
          height: `${rows * activeTileSize}px`,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      />
    </div>
  )
}
