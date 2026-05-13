'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface GalleryProject {
  title: string;
  src: string;
  ratio: number;
}

const PROJECTS: GalleryProject[] = [
  { title: 'ROGER DUBUIS LIGHT CALLIGRAPHY ACTIVATION – DUBAI MALL', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-ROGER-DUBUIS-LIGHT-PAINTING-DUBAI-2020-1.jpg' },
  { title: 'PIAGET WINTER AT TANTORA – VIP & PRESS ACTIVATION AL ULA KSA', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-piaget-winterattantora-alula-ksa-2020-13.jpg' },
  { title: 'PIAGET WINTER AT TANTORA – EXHIBITION POP UP AL ULA KSA', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-piaget-winterattantora-alula-ksa-2020-1.jpg' },
  { title: 'MR WHITE PARTY – NIKKI BEACH DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2020/01/www.odevent.com-mr.whitedubai-party-nikkibeach-dubai-2020-1.jpg' },
  { title: 'NEWYEAR EVE PARTY – BURJ AL ARAB DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2020/01/www.odevent.com-newyeareve-party-burjalarab-dubai-2020-1.jpg' },
  { title: 'PROPERTY FINDER AWARDS 2019 – ARMANI HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-propertyfinder-awards-armanihotel-dubai-2019-1.jpg' },
  { title: 'KAYTO – AL NASEEM HOTEL DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-kayto-resturent-alnaseemhotel-madinatjumeirah-dubai-2019-1.jpg' },
  { title: 'TAG HEUER – PORSCHE FORMULA E CHAMPIONSHIP RIYADH KSA', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-tagheuer-porche-formulaechampionship-saudi-2019-1.jpg' },
  { title: 'PUMA – MAYBELLINE PROMENADE MALL KUWAIT', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2019/10/www.odevent.com-puma-maybelline-launch-kuwait-1.jpg' },
  { title: 'GUERLAIN – ALSERKAL AVENUE DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-guerlain-perfume-launch-alsarkalavenue-dubai-2019-1.jpg' },
  { title: 'LANCOME PARIS – KUWAIT', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-lancomeparis-event-symphonyballroom-kuwait-1.jpg' },
  { title: 'BURJ AL ARAB – STARS AT BURJ DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-starsatburj-burjalarab-event-dubai-1.jpg' },
  { title: 'ROGER DUBUIS HURACAN WATCH LAUNCH – NIKKI BEACH DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-rogerdubuis-event-nikkibeach-dubai-1.jpg' },
  { title: 'SLS HOTEL LAUNCH – BVLGARI HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-slshotel-launch-event-bvlgarihotel-dubai-1.jpg' },
  { title: 'YSL BEAUTE EVENT – ADDRESS HOTEL DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-ysl-beaute-event-addresshotel-dubai-1.jpg' },
  { title: 'GIORGIO ARMANI BEAUTY STARS – ARMANI HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-georgioarmani-armanibeautystar-armanihotel-dubai-1.jpg' },
  { title: 'PIAGET SUMMER SALT – NASEEM HOTEL DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-piaget-summersalt-naseemhotel-madinatjumeirah-dubai-2-1.jpg' },
  { title: 'MR WHITE PARTY – W HOTEL PALM DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-mr.whitedubai-whiteparty-w-hotel-dubai-1.jpg' },
  { title: 'MAC – SHINY PRETTY THINGS CITY WALK DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2019/01/www.odevent.com-mac-shinyprettythings-citywalk-dubai-1.jpg' },
  { title: 'BVLGARI THE EXCLUSIVE – MADE TO ORDER BVLGARI HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2018/11/www.odevent.com-bvlgari-theexclussive-newmade-toorder-accessories-offering-1.jpg' },
  { title: 'BVLGARI B.GLAM SPRING/SUMMER 2019 – BVLGARI HOTEL DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2018/11/www.odevent.com-bvlgari-B.GLAM-spring.summer-2019collection-ecent-dubai-1.jpg' },
  { title: 'CARTIER PANTHERE DE CARTIER LAUNCH – NIKKI BEACH DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-cartier-pantheredecartier-launch-nikkibeach-dubai-1.jpg' },
  { title: 'WESTHOLME DUBAI LAUNCH – FOUR SEASONS HOTEL DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2018/10/www.odevent.fr-westholme-dubai-launch-fourseasons-hotel-dubai-1.jpg' },
  { title: 'TASC CELEBRATING 10 YEARS – FOUR SEASONS HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2018/10/www.odevent.com-tasc-celebrating-10years-fourseasons-hotel-dubai-1.jpg' },
  { title: 'PIAGET RAMADAN SOHOUR 2018 – ABU DHABI & SHARJAH', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2018/05/www.odevent.fr-piaget-suhour-2018-abudhabi-sharja-1.jpg' },
  { title: 'BVLGARI MFW18 ACCESSORIES EVENT – BVLGARI HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2018/05/www.odevent.fr-bulgari-mfw18-accessoriesevent-dubai-1.jpg' },
  { title: 'URBAN DECAY & BOUTIQAAT LAUNCH 2018 – KUWAIT', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2018/05/www.odevent.fr-urbandecay-boutiqaat-2018-kuwait-2.jpg' },
  { title: 'GIORGIO ARMANI SI PASSIONE LAUNCH – NIKKI BEACH DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2018/04/www.odevent.fr-giorgioarmani-sipassione-perfume-launch-nikkiprive-dubai-.jpg' },
  { title: 'PIAGET EXCEPTIONAL DINNER – ART DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2018/03/www.odevent.fr-piaget-exceptional-dinner-artdubai-dubai-1.jpg' },
  { title: 'POLO RALPH LAUREN POLO TOURNAMENT 2018 – DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2018/03/www.odevent.com-polo-raplhlauren-polotournament-poloclub-dubai-1.jpg' },
  { title: 'BVLGARI PRESS DINNER – BAB AL SHAMS DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-bulgari-press-dinner-babalshams-dubai-1.jpg' },
  { title: 'GUERLAIN AQUA NUDE LAUNCH – KEMPINSKI HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-guerlain-aquanudelaunch-kempinski-hotel-dubai-.jpg' },
  { title: 'MR WHITE PARTY – DUBAI OPERA', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-mr.white-party-secretparty-dubai-opera-1.jpg' },
  { title: 'LOUIS VUITTON HARD SIDED CEO DINNER – DUBAI MALL', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-ceodinner-dubai-mall-1.jpg' },
  { title: 'LOUIS VUITTON HARD SIDED VIP SHOWCASE – DUBAI MALL', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-vip-showcase-dubai-mall-1.jpg' },
  { title: 'LOUIS VUITTON HARD SIDED PARTY – NINIVE RESTAURANT DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-party-niniverestaurant-dubai-1.jpg' },
  { title: 'PIAGET RAMADAN SUHOOR 2017 – BURJ KHALIFA DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-piaget-ramadan-suhour-2017-burjkhalifa-dubai-1.jpg' },
  { title: 'GUERLAIN OUD ESSENTIAL LAUNCH – ONE & ONLY ROYAL MIRAGE DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-guerlain-oudessential-launch-oneandonlyroyalmirage-dubai-1.jpg' },
  { title: 'PIAGET POSSESSION LAUNCH – DUBAI DESIGN DISTRICT', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-piaget-possession-launch-D3-dubai-1.jpg' },
  { title: 'VALENTINO DINNER & PREVIEW FW 17-18 – FIVE HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-valentino-dinnerandpreview-FW17-18-fivehotel-dubai-1.jpg' },
  { title: 'SOHAD ACOURI BRIDAL SHOW – INTERCONTINENTAL DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-sohadacouri-bridalshow-2016-intercontinental-dubai-1.jpg' },
  { title: 'EMAAR DUBAI OPERA LAUNCH – DUBAI OPERA', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-emaar-dubaiopera-launch-dubai-1.jpg' },
  { title: 'CHOPARD IMPERIAL COLLECTION LAUNCH – BURJ AL ARAB DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-chopard-imperialcollection-launch-burjalarab-dubai-1.jpg' },
  { title: 'RENAULT CAPTUR LAUNCH – AL SERKAL AVENUE DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-renaultcapture-launch-alserkalavenue-dubai-1.jpg' },
  { title: 'EMBASSY BLVD GALA DINNER + SHOW 2016 – BANGALORE INDIA', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.com-embassy-BLVD-galadinner-lido-circus-show-bangalore-india-1-1.jpg' },
  { title: 'MARKS & SPENCER FASHION SHOW – THE WESTIN DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-marks-and-spencer-fashionshow-thewestin-dubai-1.jpg' },
  { title: "BLOOMINGDALE'S FASHION SHOW – THE DUBAI MALL", ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-bloomingdales-fashionshow-dubaimall-1.jpg' },
  { title: 'JAFZA EXCELLENCE AWARDS – MADINAT JUMEIRAH DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-jafza-excellence-awards-madinatjumeirah-dubai-1.jpg' },
  { title: "HERMÈS LES JEUX D'HERMÈS – THE ADDRESS MONTGOMERY DUBAI", ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-hermes-LESJEUXDHERMES-theaddress-montgomery-dubai-1.jpg' },
  { title: 'PRIME MINISTER OFFICE POLICY MAJLIS – THE PAVILION DOWNTOWN DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-primeminister-office-policymajlis-thepavilion-downtown-dubai-1.jpg' },
  { title: 'PRIME MINISTER OFFICE POLICY MAJLIS – PRIVATE PALACE DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-primeminister-office-policymajlis-private-palace-dubai-1.jpg' },
  { title: 'PRIME MINISTER OFFICE FIVE YEARS OF ACHIEVEMENT – ARMANI HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.com-primeminister-office-five-yearsofachievement-armani-hotel-dubai-1-1.jpg' },
  { title: 'IWC WATCH MAKING WORKSHOP – ETIHAD TOWERS ABU DHABI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-iwc-watch-making-workshop-ethihadtower-abudhabi-1.jpg' },
  { title: 'IWC BOUTIQUE OPENING – AVENUE MALL ABU DHABI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-iwc-boutique-opening-avenuemall-abudhabi-1.jpg' },
  { title: 'HSBC CEO PARTY – DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-hsbc-ceo-party-dubai-1.jpg' },
  { title: 'LAUREUS AWARD GALA DINNER 2011 – EMIRATES PALACE ABU DHABI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-laures-award-galadinner-2011-emiratespalace-hotel-abudhabi-1.jpg' },
  { title: 'MIELE LAUNCH IN THE MIDDLE EAST 2011 – MIELE SHOWROOM DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-miele-launch-middleeast-2011-mieleshowroom-dubai-1.jpg' },
  { title: 'VERTU CONSTELLATION QUEST LAUNCH – ARMANI HOTEL DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-vertu-constellationquest-launch-armanihotel-dubai-1.jpg' },
  { title: 'HSBC DIWALI CEO PARTY – DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-hsbc-diwali-ceoparty-dubai-1.jpg' },
  { title: 'IWC PRIVATE VIEWING PIERRE GAGNAIRE – DUBAI', ratio: 4/3, src: 'https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-iwc-privateviewing-pierregagnaire-dubai-1.jpg' },
  { title: 'HSBC FESTIVAL SEASON PARTY – DUBAI', ratio: 16/9, src: 'https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-hsbc-festival-season-party-dubai-1.jpg' },
]

const INITIAL_COUNT = 12

interface AnimatedImageProps {
  project: GalleryProject
}

function AnimatedImage({ project }: AnimatedImageProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })
  const [isLoading, setIsLoading] = React.useState(true)
  const [imgSrc, setImgSrc] = React.useState(project.src)

  return (
    <AspectRatio
      ref={ref}
      ratio={project.ratio}
      className="relative w-full overflow-hidden group"
      style={{ borderRadius: '2px' }}
    >
      {/* Dark placeholder while loading */}
      <div className="absolute inset-0 bg-[#111]" />

      <img
        alt={project.title}
        src={imgSrc}
        onError={() => setImgSrc('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=60')}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out scale-[1.03]',
          isInView && !isLoading
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-[1.03]',
        )}
      />

      {/* Title overlay */}
      <div className={cn(
        'absolute inset-0 flex items-end p-3',
        'bg-gradient-to-t from-black/80 via-black/10 to-transparent',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
      )}>
        <p style={{
          fontSize: '0.55rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#e8e8e8',
          lineHeight: 1.4,
          fontFamily: 'var(--font-body)',
        }}>
          {project.title}
        </p>
      </div>
    </AspectRatio>
  )
}

export function ImageGallery() {
  const [expanded, setExpanded] = React.useState(false)
  const visible = expanded ? PROJECTS : PROJECTS.slice(0, INITIAL_COUNT)

  // Distribute into 3 columns
  const cols: GalleryProject[][] = [[], [], []]
  visible.forEach((p, i) => cols[i % 3].push(p))

  return (
    <div className="w-full">
      {/* 3-column masonry grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '3px',
        width: '100%',
      }}>
        {cols.map((col, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {col.map((project, idx) => (
              <AnimatedImage key={`${ci}-${idx}`} project={project} />
            ))}
          </div>
        ))}
      </div>

      {/* Show More / Less */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0 10px' }}>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: 'var(--text-primary)',
            color: 'var(--bg-color)',
            border: 'none',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '15px 40px',
            cursor: 'pointer',
            transition: 'background 0.3s, transform 0.3s',
          }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = 'var(--text-secondary)'; (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'var(--text-primary)'; (e.target as HTMLButtonElement).style.transform = 'translateY(0)' }}
        >
          {expanded ? 'Show Less' : `Show All ${PROJECTS.length} Projects`}
        </button>
      </div>
    </div>
  )
}
