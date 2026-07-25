import { ArrowUpRight } from "lucide-react"
import nodal1 from "@/assets/showcase/nodal-1.jpg"
import nodal2 from "@/assets/showcase/nodal-2.jpg"
import nodal3 from "@/assets/showcase/nodal-3.jpg"
import rw1 from "@/assets/showcase/rw-1.jpg"
import rw2 from "@/assets/showcase/rw-2.jpg"
import rw3 from "@/assets/showcase/rw-3.jpg"
import dao1 from "@/assets/showcase/dao-1.jpg"
import dao2 from "@/assets/showcase/dao-2.jpg"
import dao3 from "@/assets/showcase/dao-3.jpg"

interface SiteSample {
  key: string
  title: string
  tag: string
  description: string
  url: string
  images: string[]
}

const SITES: SiteSample[] = [
  {
    key: 'nodal',
    title: 'Nodal Technical Consultancy',
    tag: 'nodaltc.com',
    description: 'Precision live-event engineering — audio, video, lighting & systems integration.',
    url: 'https://nodaltc.com',
    images: [nodal1, nodal2, nodal3],
  },
  {
    key: 'richard-wagner',
    title: 'Richard Wagner',
    tag: 'richard-wagner-v3.vercel.app',
    description: 'Architecture, interiors & product design studio, in the UAE since 2005.',
    url: 'https://richard-wagner-v3.vercel.app/',
    images: [rw1, rw2, rw3],
  },
  {
    key: 'dao-clinic',
    title: 'DAO Clinic',
    tag: 'dao-clinic-sky-v3.vercel.app',
    description: 'Cinematic aesthetic-clinic experience built on a scroll-driven 3D skyline.',
    url: 'https://dao-clinic-sky-v3.vercel.app/',
    images: [dao1, dao2, dao3],
  },
]

function SiteCard({ site }: { site: SiteSample }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="wds-card"
      aria-label={`Visit ${site.title} (opens in a new tab)`}
    >
      <div className="wds-card-media">
        {site.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${site.title} website screenshot ${i + 1}`}
            className="wds-frame"
            loading="lazy"
          />
        ))}
        <div className="wds-card-scrim" />
        <span className="wds-visit">
          Visit Site <ArrowUpRight size={14} />
        </span>
      </div>
      <div className="wds-card-label">
        <h3>{site.title}</h3>
        <p>{site.description}</p>
        <span className="wds-card-tag">{site.tag}</span>
      </div>
    </a>
  )
}

export function WebDesignShowcase() {
  return (
    <div className="wds-grid">
      {SITES.map(site => (
        <SiteCard key={site.key} site={site} />
      ))}
    </div>
  )
}
