import piagetActivation from "@/assets/od-event/piaget-activation.jpg"
import burjAlArabNye from "@/assets/od-event/burj-al-arab-nye.jpg"
import orlaLaunch from "@/assets/od-event/orla-launch.jpg"

interface Photo {
  src: string
  alt: string
}

const PHOTOS: Photo[] = [
  {
    src: piagetActivation,
    alt: "Piaget jungle-themed activation, Suntlight Journey",
  },
  {
    src: "https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-tagheuer-porche-formulaechampionship-saudi-2019-1.jpg",
    alt: "TAG Heuer x Porsche Formula E Championship, Riyadh",
  },
  {
    src: "https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-ROGER-DUBUIS-LIGHT-PAINTING-DUBAI-2020-1.jpg",
    alt: "Roger Dubuis light calligraphy activation, Dubai Mall",
  },
  {
    src: burjAlArabNye,
    alt: "New Year's Eve fireworks, Burj Al Arab Dubai",
  },
  {
    src: "https://www.odevent.com/wp-content/uploads/2018/11/www.odevent.com-bvlgari-theexclussive-newmade-toorder-accessories-offering-1.jpg",
    alt: "BVLGARI The Exclusive accessories offering, BVLGARI Hotel Dubai",
  },
  {
    src: orlaLaunch,
    alt: "Orla waterfront light show launch",
  },
]

interface ClientLogo {
  name: string
  src: string
}

const CLIENTS: ClientLogo[] = [
  { name: "Piaget", src: "/logos/piaget.svg" },
  { name: "Cartier", src: "/logos/cartier.svg" },
  { name: "BVLGARI", src: "/logos/bulgari.svg" },
  { name: "TAG Heuer", src: "/logos/tag-heuer.svg" },
  { name: "Louis Vuitton", src: "/logos/louis-vuitton.svg" },
  { name: "YSL Beauté", src: "/logos/ysl.svg" },
  { name: "Guerlain", src: "/logos/guerlain.svg" },
  { name: "Giorgio Armani", src: "/logos/giorgio-armani.svg" },
  { name: "Roger Dubuis", src: "/logos/roger-dubuis.svg" },
  { name: "Chopard", src: "/logos/chopard.svg" },
  { name: "Hermès", src: "/logos/hermes.svg" },
  { name: "IWC", src: "/logos/iwc.svg" },
]

export function ODEventShowcase() {
  return (
    <div className="ode-layout">
      <div className="ode-copy">
        <p>
          I worked alongside their production team for two years, delivering the on-site content, décor and event
          visuals behind luxury launches for houses like Piaget, Cartier, BVLGARI, TAG Heuer and Louis Vuitton.
        </p>

        <div className="client-logo-strip">
          <span className="client-logo-strip-label">Clients we've worked with</span>
          <div className="client-logo-strip-list">
            {CLIENTS.map(c => (
              <img key={c.name} src={c.src} alt={c.name} loading="lazy" className="client-logo-strip-img" />
            ))}
          </div>
        </div>
      </div>

      <div className="ode-gallery">
        {PHOTOS.map((photo, i) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            className={`ode-photo ${i === 0 ? "ode-photo--hero" : ""}`}
          />
        ))}
      </div>
    </div>
  )
}
