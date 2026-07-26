interface Photo {
  src: string
  alt: string
}

const PHOTOS: Photo[] = [
  {
    src: "https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-piaget-winterattantora-alula-ksa-2020-1.jpg",
    alt: "Piaget Winter at Tantora exhibition pop-up, AlUla",
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
    src: "https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-cartier-pantheredecartier-launch-nikkibeach-dubai-1.jpg",
    alt: "Cartier Panthère launch, Nikki Beach Dubai",
  },
  {
    src: "https://www.odevent.com/wp-content/uploads/2018/11/www.odevent.com-bvlgari-theexclussive-newmade-toorder-accessories-offering-1.jpg",
    alt: "BVLGARI The Exclusive accessories offering, BVLGARI Hotel Dubai",
  },
  {
    src: "https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-ceodinner-dubai-mall-1.jpg",
    alt: "Louis Vuitton Hard Sided CEO dinner, The Dubai Mall",
  },
]

const CLIENTS = [
  "Piaget", "Cartier", "BVLGARI", "TAG Heuer", "Louis Vuitton", "YSL Beauté",
  "Guerlain", "Giorgio Armani", "Roger Dubuis", "Chopard", "Hermès", "IWC",
]

export function ODEventShowcase() {
  return (
    <div className="ode-layout">
      <div className="ode-copy">
        <p>
          I worked alongside their production team for two years, delivering the on-site content, décor and event
          visuals behind luxury launches for houses like Piaget, Cartier, BVLGARI, TAG Heuer and Louis Vuitton.
        </p>

        <div className="ode-clients">
          <span className="ode-clients-label">Clients we've worked with</span>
          <div className="ode-clients-list">
            {CLIENTS.map(c => <span key={c} className="ode-client-chip">{c}</span>)}
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
