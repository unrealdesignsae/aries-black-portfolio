"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface LogoItem {
  label: string
  icon: React.ReactNode
  animationDelay: number
  animationDuration: number
  row: number
}

export interface LogoTimelineProps {
  items: LogoItem[]
  title?: string
  height?: string
  className?: string
  iconSize?: number
  showRowSeparator?: boolean
  animateOnHover?: boolean
}

export function LogoTimeline({
  items,
  title,
  height = "h-[400px]",
  className,
  showRowSeparator = true,
  animateOnHover = false,
}: LogoTimelineProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Group items by row
  const rowsMap = new Map<number, LogoItem[]>()
  items.forEach((item) => {
    if (!rowsMap.has(item.row)) rowsMap.set(item.row, [])
    rowsMap.get(item.row)!.push(item)
  })

  const rows = Array.from(rowsMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, rowItems]) => rowItems)

  const animationPlayState = animateOnHover
    ? isHovered ? "running" : "paused"
    : "running"

  return (
    <section className={cn("w-full", height, className)}>
      <motion.div
        aria-hidden="true"
        className="relative h-full w-full overflow-hidden py-8"
        style={{ background: "transparent" }}
        onMouseEnter={() => animateOnHover && setIsHovered(true)}
        onMouseLeave={() => animateOnHover && setIsHovered(false)}
      >
        {title && (
          <div className="absolute top-1/2 left-1/2 mx-auto w-full max-w-[90%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
            <p className="mx-auto mt-2 max-w-3xl text-4xl font-semibold tracking-tight text-pretty sm:text-5xl md:text-6xl"
               style={{ color: "rgba(255,255,255,0.06)" }}>
              {title}
            </p>
          </div>
        )}

        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}
        >
          {rows.map((rowItems, index) => (
            <div className="group relative flex items-center" key={index}>
              {/* dashed centre line */}
              <div
                className="absolute inset-x-0 top-1/2 h-px"
                style={{
                  backgroundImage: "repeating-linear-gradient(90deg, rgba(0,229,255,0.18) 0, rgba(0,229,255,0.18) 6px, transparent 6px, transparent 12px)",
                }}
              />
              {/* row separator */}
              {showRowSeparator && (
                <div
                  className="absolute inset-x-0 bottom-0 h-px group-last:hidden"
                  style={{
                    backgroundImage: "repeating-linear-gradient(90deg, rgba(0,229,255,0.07) 0, rgba(0,229,255,0.07) 6px, transparent 6px, transparent 12px)",
                  }}
                />
              )}

              {rowItems.map((logo) => (
                <div
                  key={`${logo.row}-${logo.label}`}
                  className="absolute top-1/2 flex -translate-y-1/2 items-center gap-2 px-3 py-1.5 whitespace-nowrap rounded-full backdrop-blur-sm"
                  style={{
                    /* dark pill */
                    background: "linear-gradient(to top, rgba(5,10,15,0.85), rgba(10,15,20,0.80))",
                    border: "1px solid rgba(0,229,255,0.25)",
                    boxShadow: "0 0 12px rgba(0,229,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
                    /* move-x animation via CSS keyframe defined in index.css */
                    animationName: "move-x",
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationDelay: `${logo.animationDelay}s`,
                    animationDuration: `${logo.animationDuration}s`,
                    animationPlayState,
                    ["--move-x-from" as string]: "-100%",
                    ["--move-x-to" as string]: "calc(100% + 100vw)",
                  }}
                >
                  <span className="flex items-center" style={{ color: "#00E5FF", opacity: 0.9 }}>
                    {logo.icon}
                  </span>
                  <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500, letterSpacing: "0.02em" }}>
                    {logo.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
