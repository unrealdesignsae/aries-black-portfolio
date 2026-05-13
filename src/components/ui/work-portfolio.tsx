import React, { useState, useCallback } from 'react'

interface Project {
  slug: string
  title: string
  images: string[]
}

function makeUrls(base: string, indices: number[], ext = 'jpg'): string[] {
  return indices.map(n => `${base}${n}.${ext}`)
}
function seq(base: string, from: number, to: number, ext = 'jpg'): string[] {
  return Array.from({ length: to - from + 1 }, (_, i) => `${base}${from + i}.${ext}`)
}

const PROJECTS: Project[] = [
  {
    slug: 'roger-dubuis-3',
    title: 'ROGER DUBUIS LIGHT CALLIGRAPHY ACTIVATION – DUBAI MALL',
    images: seq('https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-ROGER-DUBUIS-LIGHT-PAINTING-DUBAI-2020-', 1, 10),
  },
  {
    slug: 'piaget-winter-vip',
    title: 'PIAGET WINTER AT TANTORA – VIP & PRESS ACTIVATION AL ULA KSA',
    images: seq('https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-piaget-winterattantora-alula-ksa-2020-', 13, 26),
  },
  {
    slug: 'piaget-winter-popup',
    title: 'PIAGET WINTER AT TANTORA – EXHIBITION 3 MONTHS POP UP AL ULA KSA',
    images: seq('https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-piaget-winterattantora-alula-ksa-2020-', 1, 11),
  },
  {
    slug: 'mr-white-nikki-beach-2020',
    title: 'MR WHITE PARTY SECRET WHITE PARTY NIKKI BEACH DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2020/01/www.odevent.com-mr.whitedubai-party-nikkibeach-dubai-2020-', 1, 19),
  },
  {
    slug: 'newyear-eve-party',
    title: 'NEWYEAR EVE PARTY BURJ AL ARAB DUBAI',
    images: (() => {
      const b = 'https://www.odevent.com/wp-content/uploads/2020/01/www.odevent.com-newyeareve-party-burjalarab-dubai-2020-'
      return Array.from({ length: 22 }, (_, i) => `${b}${i === 9 ? '10.' : (i + 1)}${i === 9 ? '.jpg' : '.jpg'}`.replace('10..jpg', '10..jpg'))
        .map((_, i) => `${b}${i + 1 === 10 ? '10.' : i + 1}.jpg`.replace('10..jpg', '10..jpg'))
    })(),
  },
  {
    slug: 'property-finder-awards',
    title: 'PROPERTY FINDER AWARDS REAL ESTATE AWARDS 2019 ARMANI HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-propertyfinder-awards-armanihotel-dubai-2019-', 1, 18),
  },
  {
    slug: 'kayto',
    title: 'KAYTO AL NASEEM HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-kayto-resturent-alnaseemhotel-madinatjumeirah-dubai-2019-', 1, 16),
  },
  {
    slug: 'tag-heuer-porsche-riyadh',
    title: 'TAG HEUER – PORSCHE FORMULA E CHAMPIONSHIP RIYADH KSA',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-tagheuer-porche-formulaechampionship-saudi-2019-', 1, 16),
  },
  {
    slug: 'puma-maybelline',
    title: 'PUMA – MAYBELLINE PROMENADE MALL KUWAIT',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/10/www.odevent.com-puma-maybelline-launch-kuwait-', 1, 15),
  },
  {
    slug: 'guerlain-alserkal',
    title: 'GUERLAIN ALSERKAL AVENUE DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-guerlain-perfume-launch-alsarkalavenue-dubai-2019-', 1, 17),
  },
  {
    slug: 'lancome-kuwait',
    title: 'LANCOME PARIS KUWAIT',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-lancomeparis-event-symphonyballroom-kuwait-', 1, 17),
  },
  {
    slug: 'stars-at-burj',
    title: 'BURJ AL ARAB STARS AT BURJ DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-starsatburj-burjalarab-event-dubai-', 1, 27),
  },
  {
    slug: 'roger-dubuis-nikki',
    title: 'ROGER DUBUIS HURACAN WATCH LAUNCH NIKKI BEACH DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-rogerdubuis-event-nikkibeach-dubai-', 1, 22),
  },
  {
    slug: 'sls-bvlgari',
    title: 'SLS HOTEL LAUNCH BVLGARI HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-slshotel-launch-event-bvlgarihotel-dubai-', 1, 21),
  },
  {
    slug: 'ysl-beaute',
    title: 'YSL BEAUTE EVENT ADDRESS HOTEL DUBAI',
    images: [
      ...makeUrls('https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-ysl-beaute-event-addresshotel-dubai-', [1,2,4,5,6,7,8,10,11,12,13,14,15,16,19,22,24,25,26]),
      'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-ysl-beaute-event-addresshotel-dubai-3-1.jpg',
    ],
  },
  {
    slug: 'giorgio-armani-beauty',
    title: 'GIORGIO ARMANI ARMANI BEAUTY STARS ARMANI HOTEL DUBAI',
    images: (() => {
      const b = 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-georgioarmani-armanibeautystar-armanihotel-dubai-'
      return Array.from({ length: 20 }, (_, i) => i === 4 ? `${b}5..jpg` : `${b}${i + 1}.jpg`)
    })(),
  },
  {
    slug: 'piaget-summersalt',
    title: 'PIAGET SUMMER SALT NASEEM HOTEL DUBAI',
    images: [2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22].map(n =>
      `https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-piaget-summersalt-naseemhotel-madinatjumeirah-dubai-${n}-1.jpg`
    ),
  },
  {
    slug: 'mr-white-w-hotel',
    title: 'MR WHITE PARTY SECRET WHITE PARTY W HOTEL PALM DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-mr.whitedubai-whiteparty-w-hotel-dubai-', 1, 18),
  },
  {
    slug: 'mac',
    title: 'MAC – SHINY PRETTY THINGS CITY WALK DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2019/01/www.odevent.com-mac-shinyprettythings-citywalk-dubai-', 1, 17),
  },
  {
    slug: 'bvlgari-made-to-order',
    title: 'BVLGARI THE EXCLUSIVE – MADE TO ORDER ACCESSORIES BVLGARI HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/11/www.odevent.com-bvlgari-theexclussive-newmade-toorder-accessories-offering-', 1, 10),
  },
  {
    slug: 'bvlgari-bglam',
    title: 'BVLGARI B.GLAM SPRING/SUMMER COLLECTION 2019 BVLGARI HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/11/www.odevent.com-bvlgari-B.GLAM-spring.summer-2019collection-ecent-dubai-', 1, 11),
  },
  {
    slug: 'cartier',
    title: 'CARTIER PANTHERE DE CARTIER LAUNCH NIKKI BEACH DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-cartier-pantheredecartier-launch-nikkibeach-dubai-', 1, 26),
  },
  {
    slug: 'westholme',
    title: 'WESTHOLME DUBAI LAUNCH FOUR SEASONS HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/10/www.odevent.fr-westholme-dubai-launch-fourseasons-hotel-dubai-', 1, 22),
  },
  {
    slug: 'tasc',
    title: 'TASC CELEBRATING 10 YEARS FOUR SEASONS HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/10/www.odevent.com-tasc-celebrating-10years-fourseasons-hotel-dubai-', 1, 17),
  },
  {
    slug: 'piaget-sohour-2018',
    title: 'PIAGET RAMADAN SOHOUR 2018 ABU DHABI & SHARJAH',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/05/www.odevent.fr-piaget-suhour-2018-abudhabi-sharja-', 1, 20),
  },
  {
    slug: 'bvlgari-mfw18',
    title: 'BVLGARI MFW18 ACCESSORIES EVENT BVLGARI HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/05/www.odevent.fr-bulgari-mfw18-accessoriesevent-dubai-', 1, 30),
  },
  {
    slug: 'urban-decay',
    title: 'URBAN DECAY & BOUTIQAAT LAUNCH 2018 KUWAIT',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/05/www.odevent.fr-urbandecay-boutiqaat-2018-kuwait-', 2, 16),
  },
  {
    slug: 'giorgio-armani-sipassione',
    title: 'GIORGIO ARMANI SI PASSIONE PERFUME LAUNCH NIKKI BEACH DUBAI',
    images: (() => {
      const b = 'https://www.odevent.com/wp-content/uploads/2018/04/www.odevent.fr-giorgioarmani-sipassione-perfume-launch-nikkiprive-dubai-'
      return [`${b}.jpg`, ...seq(b, 1, 9), ...seq(b, 11, 21)]
    })(),
  },
  {
    slug: 'piaget-art-dubai',
    title: 'PIAGET EXCEPTIONAL DINNER ART DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/03/www.odevent.fr-piaget-exceptional-dinner-artdubai-dubai-', 1, 13),
  },
  {
    slug: 'polo-ralph-lauren',
    title: 'POLO RALPH LAUREN POLO TOURNAMENT 2018 DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/03/www.odevent.com-polo-raplhlauren-polotournament-poloclub-dubai-', 1, 8),
  },
  {
    slug: 'bvlgari-press-dinner',
    title: 'BVLGARI PRESS DINNER BAB AL SHAMS DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-bulgari-press-dinner-babalshams-dubai-', 1, 6),
  },
  {
    slug: 'guerlain-aqua-nude',
    title: 'GUERLAIN AQUA NUDE LAUNCH KEMPINSKI HOTEL DUBAI',
    images: (() => {
      const b = 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-guerlain-aquanudelaunch-kempinski-hotel-dubai-'
      return [`${b}.jpg`, `${b}2.jpg`, `${b}3.jpg`, `${b}4.jpg`]
    })(),
  },
  {
    slug: 'mr-white-dubai-opera',
    title: 'MR WHITE PARTY SECRET WHITE PARTY DUBAI OPERA',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-mr.white-party-secretparty-dubai-opera-', 1, 11),
  },
  {
    slug: 'louis-vuitton-ceo',
    title: 'LOUIS VUITTON HARD SIDED CEO DINNER DUBAI MALL',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-ceodinner-dubai-mall-', 1, 3),
  },
  {
    slug: 'louis-vuitton-showcase',
    title: 'LOUIS VUITTON HARD SIDED VIP SHOWCASE DUBAI MALL',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-vip-showcase-dubai-mall-', 1, 10),
  },
  {
    slug: 'louis-vuitton-party',
    title: 'LOUIS VUITTON HARD SIDED PARTY NINIVE RESTAURANT DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-party-niniverestaurant-dubai-', 1, 6),
  },
  {
    slug: 'piaget-suhoor-2017',
    title: 'PIAGET RAMADAN SUHOOR 2017 BURJ KHALIFA DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-piaget-ramadan-suhour-2017-burjkhalifa-dubai-', 1, 10),
  },
  {
    slug: 'guerlain-oud',
    title: 'GUERLAIN OUD ESSENTIAL LAUNCH ONE & ONLY ROYAL MIRAGE DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-guerlain-oudessential-launch-oneandonlyroyalmirage-dubai-', 1, 4),
  },
  {
    slug: 'piaget-possession',
    title: 'PIAGET POSSESSION LAUNCH DUBAI DESIGN DISTRICT DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-piaget-possession-launch-D3-dubai-', 1, 23),
  },
  {
    slug: 'valentino',
    title: 'VALENTINO DINNER & PREVIEW FW 17-18 FIVE HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-valentino-dinnerandpreview-FW17-18-fivehotel-dubai-', 1, 9),
  },
  {
    slug: 'sohad-acouri',
    title: 'SOHAD ACOURI BRIDAL SHOW INTERCONTINENTAL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-sohadacouri-bridalshow-2016-intercontinental-dubai-', 1, 6),
  },
  {
    slug: 'emaar',
    title: 'EMAAR DUBAI OPERA LAUNCH DUBAI OPERA',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-emaar-dubaiopera-launch-dubai-', 1, 7),
  },
  {
    slug: 'chopard',
    title: 'CHOPARD IMPERIAL COLLECTION LAUNCH BURJ AL ARAB DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-chopard-imperialcollection-launch-burjalarab-dubai-', 1, 8),
  },
  {
    slug: 'renault',
    title: 'RENAULT CAPTUR LAUNCH AL SERKAL AVENUE DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-renaultcapture-launch-alserkalavenue-dubai-', 1, 15),
  },
  {
    slug: 'embassy',
    title: 'EMBASSY BLVD GALA DINNER + SHOW 2016 BANGALORE INDIA',
    images: Array.from({ length: 24 }, (_, i) =>
      `https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.com-embassy-BLVD-galadinner-lido-circus-show-bangalore-india-${i + 1}-1.jpg`
    ),
  },
  {
    slug: 'marks-spencer',
    title: 'MARKS & SPENCER FASHION SHOW THE WESTIN DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-marks-and-spencer-fashionshow-thewestin-dubai-', 1, 12),
  },
  {
    slug: 'bloomingdales',
    title: "BLOOMINGDALE'S FASHION SHOW THE DUBAI MALL",
    images: seq('https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-bloomingdales-fashionshow-dubaimall-', 1, 9),
  },
  {
    slug: 'jafza',
    title: 'JAFZA EXCELLENCE AWARDS MADINAT JUMEIRAH DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-jafza-excellence-awards-madinatjumeirah-dubai-', 1, 5),
  },
  {
    slug: 'hermes',
    title: "HERMÈS LES JEUX D'HERMÈS THE ADDRESS MONTGOMERY DUBAI",
    images: seq('https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-hermes-LESJEUXDHERMES-theaddress-montgomery-dubai-', 1, 16),
  },
  {
    slug: 'pm-office-pavilion',
    title: 'PRIME MINISTER OFFICE POLICY MAJLIS THE PAVILION DOWNTOWN DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-primeminister-office-policymajlis-thepavilion-downtown-dubai-', 1, 7),
  },
  {
    slug: 'pm-office-palace',
    title: 'PRIME MINISTER OFFICE POLICY MAJLIS PRIVATE PALACE DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-primeminister-office-policymajlis-private-palace-dubai-', 1, 6),
  },
  {
    slug: 'pm-office-achievement',
    title: 'PRIME MINISTER OFFICE FIVE YEARS OF ACHIEVEMENT ARMANI HOTEL DUBAI',
    images: Array.from({ length: 11 }, (_, i) =>
      `https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.com-primeminister-office-five-yearsofachievement-armani-hotel-dubai-${i + 1}-1.jpg`
    ),
  },
  {
    slug: 'iwc-workshop',
    title: 'IWC WATCH MAKING WORKSHOP ETIHAD TOWERS ABU DHABI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-iwc-watch-making-workshop-ethihadtower-abudhabi-', 1, 5),
  },
  {
    slug: 'iwc-boutique',
    title: 'IWC BOUTIQUE OPENING AVENUE MALL ABU DHABI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-iwc-boutique-opening-avenuemall-abudhabi-', 1, 4),
  },
  {
    slug: 'hsbc-ceo',
    title: 'HSBC CEO PARTY DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-hsbc-ceo-party-dubai-', 1, 8),
  },
  {
    slug: 'laureus-award',
    title: 'LAUREUS AWARD GALA DINNER 2011 EMIRATES PALACE ABU DHABI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-laures-award-galadinner-2011-emiratespalace-hotel-abudhabi-', 1, 14),
  },
  {
    slug: 'miele',
    title: 'MIELE LAUNCH IN THE MIDDLE EAST 2011 MIELE SHOWROOM DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-miele-launch-middleeast-2011-mieleshowroom-dubai-', 1, 17),
  },
  {
    slug: 'vertu',
    title: 'VERTU CONSTELLATION QUEST LAUNCH ARMANI HOTEL DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-vertu-constellationquest-launch-armanihotel-dubai-', 1, 12),
  },
  {
    slug: 'hsbc-diwali',
    title: 'HSBC DIWALI CEO PARTY DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-hsbc-diwali-ceoparty-dubai-', 1, 5),
  },
  {
    slug: 'iwc-pierre-gagnaire',
    title: 'IWC PRIVATE VIEWING PIERRE GAGNAIRE DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-iwc-privateviewing-pierregagnaire-dubai-', 1, 5),
  },
  {
    slug: 'hsbc-festival',
    title: 'HSBC FESTIVAL SEASON PARTY DUBAI',
    images: seq('https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-hsbc-festival-season-party-dubai-', 1, 6),
  },
]

interface CardProps {
  project: Project
  idx: number
  current: number
  onNavigate: (idx: number, dir: number) => void
  onGoTo: (idx: number, si: number) => void
}

function ProjectCard({ project, idx, current, onNavigate, onGoTo }: CardProps) {
  const total = project.images.length
  const showDots = total <= 30

  return (
    <div className="wp-card">
      <div className="wp-slides">
        {project.images.map((src, si) => (
          <div key={si} className={`wp-slide${si === current ? ' wp-slide--active' : ''}`}>
            <img src={src} alt={project.title} loading="lazy" />
          </div>
        ))}
      </div>

      <button
        className="wp-nav wp-nav--prev"
        onClick={e => { e.stopPropagation(); onNavigate(idx, -1) }}
        aria-label="Previous"
      >&#8249;</button>
      <button
        className="wp-nav wp-nav--next"
        onClick={e => { e.stopPropagation(); onNavigate(idx, 1) }}
        aria-label="Next"
      >&#8250;</button>

      {showDots && (
        <div className="wp-dots">
          {project.images.map((_, si) => (
            <button
              key={si}
              className={`wp-dot${si === current ? ' wp-dot--active' : ''}`}
              onClick={e => { e.stopPropagation(); onGoTo(idx, si) }}
              aria-label={`Go to image ${si + 1}`}
            />
          ))}
        </div>
      )}

      <div className="wp-title">
        <span className="wp-title-text">{project.title}</span>
        <span className="wp-title-counter">{current + 1} / {total}</span>
      </div>
    </div>
  )
}

const INITIAL_COUNT = 12
const TOTAL = PROJECTS.length

export function WorkPortfolio() {
  const [slides, setSlides] = useState<Record<number, number>>({})
  const [expanded, setExpanded] = useState(false)

  const goTo = useCallback((idx: number, si: number) => {
    setSlides(prev => ({ ...prev, [idx]: si }))
  }, [])

  const navigate = useCallback((idx: number, dir: number) => {
    const current = slides[idx] ?? 0
    const total = PROJECTS[idx].images.length
    goTo(idx, (current + dir + total) % total)
  }, [slides, goTo])

  const visible = expanded ? PROJECTS : PROJECTS.slice(0, INITIAL_COUNT)

  return (
    <>
      <div className="wp-grid">
        {visible.map((project, idx) => (
          <ProjectCard
            key={project.slug}
            project={project}
            idx={idx}
            current={slides[idx] ?? 0}
            onNavigate={navigate}
            onGoTo={goTo}
          />
        ))}
      </div>
      <div className="wp-show-more">
        <button className="wp-show-more-btn" onClick={() => setExpanded(e => !e)}>
          {expanded ? `Show Less` : `Show All ${TOTAL} Projects`}
        </button>
      </div>
    </>
  )
}
