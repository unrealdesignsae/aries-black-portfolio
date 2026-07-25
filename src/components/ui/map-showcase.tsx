import { Compass, ArrowUpRight } from "lucide-react"
import mapImg from "@/assets/showcase/map-masterplan.jpg"

const MAP_URL = "https://olfah-cinematic-v2.vercel.app/"

export function MapShowcase() {
  return (
    <a
      href={MAP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="map-showcase"
      aria-label="Open the interactive 360° masterplan map in a new tab"
    >
      <img
        src={mapImg}
        alt="Interactive masterplan map with clickable hotspots over an aerial residential render"
        className="map-showcase-img"
        loading="lazy"
      />
      <div className="map-showcase-scrim" />

      <span className="map-showcase-tag">
        <Compass size={13} />
        Interactive 360&deg; Experience
      </span>

      <span className="map-showcase-button">
        <span className="map-showcase-button-ring" />
        <span className="map-showcase-button-core">
          Explore the Map
          <ArrowUpRight size={16} />
        </span>
      </span>
    </a>
  )
}
