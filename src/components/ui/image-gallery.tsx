import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ProjectCarousel } from './project-carousel';

interface GalleryProject {
  title: string;
  venue: string;
  src: string;
}

const PROJECTS: GalleryProject[] = [
  { title: 'ROGER DUBUIS LIGHT CALLIGRAPHY ACTIVATION', venue: 'DUBAI MALL', src: 'https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-ROGER-DUBUIS-LIGHT-PAINTING-DUBAI-2020-1.jpg' },
  { title: 'PIAGET WINTER AT TANTORA – VIP & PRESS ACTIVATION', venue: 'AL ULA KSA', src: 'https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-piaget-winterattantora-alula-ksa-2020-13.jpg' },
  { title: 'PIAGET WINTER AT TANTORA – EXHIBITION POP UP', venue: 'AL ULA KSA', src: 'https://www.odevent.com/wp-content/uploads/2020/02/www.odevent.com-piaget-winterattantora-alula-ksa-2020-1.jpg' },
  { title: 'MR WHITE PARTY', venue: 'NIKKI BEACH DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2020/01/www.odevent.com-mr.whitedubai-party-nikkibeach-dubai-2020-1.jpg' },
  { title: 'NEW YEAR EVE PARTY', venue: 'BURJ AL ARAB DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2020/01/www.odevent.com-newyeareve-party-burjalarab-dubai-2020-1.jpg' },
  { title: 'PROPERTY FINDER AWARDS 2019', venue: 'ARMANI HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-propertyfinder-awards-armanihotel-dubai-2019-1.jpg' },
  { title: 'KAYTO RESTAURANT LAUNCH', venue: 'AL NASEEM HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-kayto-resturent-alnaseemhotel-madinatjumeirah-dubai-2019-1.jpg' },
  { title: 'TAG HEUER – PORSCHE FORMULA E CHAMPIONSHIP', venue: 'RIYADH KSA', src: 'https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-tagheuer-porche-formulaechampionship-saudi-2019-1.jpg' },
  { title: 'PUMA – MAYBELLINE LAUNCH', venue: 'PROMENADE MALL KUWAIT', src: 'https://www.odevent.com/wp-content/uploads/2019/10/www.odevent.com-puma-maybelline-launch-kuwait-1.jpg' },
  { title: 'GUERLAIN LAUNCH', venue: 'ALSERKAL AVENUE DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/11/www.odevent.com-guerlain-perfume-launch-alsarkalavenue-dubai-2019-1.jpg' },
  { title: 'LANCÔME PARIS EVENT', venue: 'SYMPHONY BALLROOM KUWAIT', src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-lancomeparis-event-symphonyballroom-kuwait-1.jpg' },
  { title: 'STARS AT BURJ', venue: 'BURJ AL ARAB DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-starsatburj-burjalarab-event-dubai-1.jpg' },
  { title: 'ROGER DUBUIS HURACAN WATCH LAUNCH', venue: 'NIKKI BEACH DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-rogerdubuis-event-nikkibeach-dubai-1.jpg' },
  { title: 'SLS HOTEL LAUNCH', venue: 'BVLGARI HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-slshotel-launch-event-bvlgarihotel-dubai-1.jpg' },
  { title: 'YSL BEAUTÉ EVENT', venue: 'ADDRESS HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-ysl-beaute-event-addresshotel-dubai-1.jpg' },
  { title: 'GIORGIO ARMANI BEAUTY STARS', venue: 'ARMANI HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-georgioarmani-armanibeautystar-armanihotel-dubai-1.jpg' },
  { title: 'PIAGET SUMMER SALT', venue: 'NASEEM HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-piaget-summersalt-naseemhotel-madinatjumeirah-dubai-2-1.jpg' },
  { title: 'MR WHITE PARTY', venue: 'W HOTEL PALM DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/05/www.odevent.com-mr.whitedubai-whiteparty-w-hotel-dubai-1.jpg' },
  { title: 'MAC – SHINY PRETTY THINGS', venue: 'CITY WALK DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2019/01/www.odevent.com-mac-shinyprettythings-citywalk-dubai-1.jpg' },
  { title: 'BVLGARI THE EXCLUSIVE – MADE TO ORDER', venue: 'BVLGARI HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/11/www.odevent.com-bvlgari-theexclussive-newmade-toorder-accessories-offering-1.jpg' },
  { title: 'BVLGARI B.GLAM SPRING/SUMMER 2019', venue: 'BVLGARI HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/11/www.odevent.com-bvlgari-B.GLAM-spring.summer-2019collection-ecent-dubai-1.jpg' },
  { title: 'CARTIER PANTHÈRE DE CARTIER LAUNCH', venue: 'NIKKI BEACH DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-cartier-pantheredecartier-launch-nikkibeach-dubai-1.jpg' },
  { title: 'WESTHOLME DUBAI LAUNCH', venue: 'FOUR SEASONS HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/10/www.odevent.fr-westholme-dubai-launch-fourseasons-hotel-dubai-1.jpg' },
  { title: 'TASC CELEBRATING 10 YEARS', venue: 'FOUR SEASONS HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/10/www.odevent.com-tasc-celebrating-10years-fourseasons-hotel-dubai-1.jpg' },
  { title: 'PIAGET RAMADAN SOHOUR 2018', venue: 'ABU DHABI & SHARJAH', src: 'https://www.odevent.com/wp-content/uploads/2018/05/www.odevent.fr-piaget-suhour-2018-abudhabi-sharja-1.jpg' },
  { title: 'BVLGARI MFW18 ACCESSORIES EVENT', venue: 'BVLGARI HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/05/www.odevent.fr-bulgari-mfw18-accessoriesevent-dubai-1.jpg' },
  { title: 'URBAN DECAY & BOUTIQAAT LAUNCH 2018', venue: 'KUWAIT', src: 'https://www.odevent.com/wp-content/uploads/2018/05/www.odevent.fr-urbandecay-boutiqaat-2018-kuwait-2.jpg' },
  { title: 'GIORGIO ARMANI SI PASSIONE LAUNCH', venue: 'NIKKI BEACH DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/04/www.odevent.fr-giorgioarmani-sipassione-perfume-launch-nikkiprive-dubai-.jpg' },
  { title: 'PIAGET EXCEPTIONAL DINNER', venue: 'ART DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/03/www.odevent.fr-piaget-exceptional-dinner-artdubai-dubai-1.jpg' },
  { title: 'POLO RALPH LAUREN POLO TOURNAMENT 2018', venue: 'DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/03/www.odevent.com-polo-raplhlauren-polotournament-poloclub-dubai-1.jpg' },
  { title: 'BVLGARI PRESS DINNER', venue: 'BAB AL SHAMS DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-bulgari-press-dinner-babalshams-dubai-1.jpg' },
  { title: 'GUERLAIN AQUA NUDE LAUNCH', venue: 'KEMPINSKI HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-guerlain-aquanudelaunch-kempinski-hotel-dubai-.jpg' },
  { title: 'MR WHITE PARTY', venue: 'DUBAI OPERA', src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-mr.white-party-secretparty-dubai-opera-1.jpg' },
  { title: 'LOUIS VUITTON HARD SIDED CEO DINNER', venue: 'DUBAI MALL', src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-ceodinner-dubai-mall-1.jpg' },
  { title: 'LOUIS VUITTON HARD SIDED VIP SHOWCASE', venue: 'DUBAI MALL', src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-vip-showcase-dubai-mall-1.jpg' },
  { title: 'LOUIS VUITTON HARD SIDED PARTY', venue: 'NINIVE RESTAURANT DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2018/01/www.odevent.fr-louisvuitton-hardsided-party-niniverestaurant-dubai-1.jpg' },
  { title: 'PIAGET RAMADAN SUHOOR 2017', venue: 'BURJ KHALIFA DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-piaget-ramadan-suhour-2017-burjkhalifa-dubai-1.jpg' },
  { title: 'GUERLAIN OUD ESSENTIAL LAUNCH', venue: 'ONE & ONLY ROYAL MIRAGE DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-guerlain-oudessential-launch-oneandonlyroyalmirage-dubai-1.jpg' },
  { title: 'PIAGET POSSESSION LAUNCH', venue: 'DUBAI DESIGN DISTRICT', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-piaget-possession-launch-D3-dubai-1.jpg' },
  { title: 'VALENTINO DINNER & PREVIEW FW 17-18', venue: 'FIVE HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-valentino-dinnerandpreview-FW17-18-fivehotel-dubai-1.jpg' },
  { title: 'SOHAD ACOURI BRIDAL SHOW', venue: 'INTERCONTINENTAL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-sohadacouri-bridalshow-2016-intercontinental-dubai-1.jpg' },
  { title: 'EMAAR DUBAI OPERA LAUNCH', venue: 'DUBAI OPERA', src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-emaar-dubaiopera-launch-dubai-1.jpg' },
  { title: 'CHOPARD IMPERIAL COLLECTION LAUNCH', venue: 'BURJ AL ARAB DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-chopard-imperialcollection-launch-burjalarab-dubai-1.jpg' },
  { title: 'RENAULT CAPTUR LAUNCH', venue: 'AL SERKAL AVENUE DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-renaultcapture-launch-alserkalavenue-dubai-1.jpg' },
  { title: 'EMBASSY BLVD GALA DINNER + LIDO CIRCUS SHOW', venue: 'BANGALORE INDIA', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.com-embassy-BLVD-galadinner-lido-circus-show-bangalore-india-1-1.jpg' },
  { title: 'MARKS & SPENCER FASHION SHOW', venue: 'THE WESTIN DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-marks-and-spencer-fashionshow-thewestin-dubai-1.jpg' },
  { title: "BLOOMINGDALE'S FASHION SHOW", venue: 'THE DUBAI MALL', src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-bloomingdales-fashionshow-dubaimall-1.jpg' },
  { title: 'JAFZA EXCELLENCE AWARDS', venue: 'MADINAT JUMEIRAH DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-jafza-excellence-awards-madinatjumeirah-dubai-1.jpg' },
  { title: "HERMÈS LES JEUX D'HERMÈS", venue: 'THE ADDRESS MONTGOMERY DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/07/www.odevent.fr-hermes-LESJEUXDHERMES-theaddress-montgomery-dubai-1.jpg' },
  { title: 'PRIME MINISTER OFFICE POLICY MAJLIS', venue: 'THE PAVILION DOWNTOWN DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-primeminister-office-policymajlis-thepavilion-downtown-dubai-1.jpg' },
  { title: 'PRIME MINISTER OFFICE POLICY MAJLIS', venue: 'PRIVATE PALACE DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-primeminister-office-policymajlis-private-palace-dubai-1.jpg' },
  { title: 'PRIME MINISTER OFFICE – FIVE YEARS OF ACHIEVEMENT', venue: 'ARMANI HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.com-primeminister-office-five-yearsofachievement-armani-hotel-dubai-1-1.jpg' },
  { title: 'IWC WATCH MAKING WORKSHOP', venue: 'ETIHAD TOWERS ABU DHABI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-iwc-watch-making-workshop-ethihadtower-abudhabi-1.jpg' },
  { title: 'IWC BOUTIQUE OPENING', venue: 'AVENUE MALL ABU DHABI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-iwc-boutique-opening-avenuemall-abudhabi-1.jpg' },
  { title: 'HSBC CEO PARTY', venue: 'DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-hsbc-ceo-party-dubai-1.jpg' },
  { title: 'LAUREUS AWARD GALA DINNER 2011', venue: 'EMIRATES PALACE ABU DHABI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-laures-award-galadinner-2011-emiratespalace-hotel-abudhabi-1.jpg' },
  { title: 'MIELE LAUNCH IN THE MIDDLE EAST 2011', venue: 'MIELE SHOWROOM DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-miele-launch-middleeast-2011-mieleshowroom-dubai-1.jpg' },
  { title: 'VERTU CONSTELLATION QUEST LAUNCH', venue: 'ARMANI HOTEL DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/09/www.odevent.fr-vertu-constellationquest-launch-armanihotel-dubai-1.jpg' },
  { title: 'HSBC DIWALI CEO PARTY', venue: 'DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-hsbc-diwali-ceoparty-dubai-1.jpg' },
  { title: 'IWC PRIVATE VIEWING PIERRE GAGNAIRE', venue: 'DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-iwc-privateviewing-pierregagnaire-dubai-1.jpg' },
  { title: 'HSBC FESTIVAL SEASON PARTY', venue: 'DUBAI', src: 'https://www.odevent.com/wp-content/uploads/2017/08/www.odevent.fr-hsbc-festival-season-party-dubai-1.jpg' },
]

const INITIAL_COUNT = 12

function ImageCard({ project, index, onOpen }: { project: GalleryProject; index: number; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [imgSrc, setImgSrc] = useState(project.src)

  return (
    <div
      className="vg-card-wrapper"
      style={{ animationDelay: `${(index % 12) * 40}ms` }}
    >
      <div
        className={`vg-card ${hovered ? 'vg-card--hov' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onOpen}
      >
        <div className="vg-card-media">
          <img
            className="vg-poster"
            src={imgSrc}
            alt={project.title}
            loading="lazy"
            onError={() => setImgSrc('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=60')}
          />
          <div className="vg-scan-line" />
        </div>
      </div>
      <div className="vg-card-label">
        <span className="vg-card-label-name">{project.title}</span>
        <span className="vg-card-label-year">{project.venue}</span>
      </div>
    </div>
  )
}

interface SelectedProject { title: string; venue: string; src: string }

export function ImageGallery() {
  const [showAll,  setShowAll]  = useState(false)
  const [selected, setSelected] = useState<SelectedProject | null>(null)
  const visible = showAll ? PROJECTS : PROJECTS.slice(0, INITIAL_COUNT)

  return (
    <div className="vg-root">
      <div className="vg-grid">
        {visible.map((project, i) => (
          <ImageCard
            key={`${project.title}-${i}`}
            project={project}
            index={i}
            onOpen={() => setSelected({ title: project.title, venue: project.venue, src: project.src })}
          />
        ))}
      </div>

      {!showAll && PROJECTS.length > INITIAL_COUNT && (
        <button className="vg-show-more" onClick={() => setShowAll(true)}>
          Show All {PROJECTS.length} Projects <ChevronDown size={17} />
        </button>
      )}
      {showAll && (
        <button className="vg-show-more" onClick={() => setShowAll(false)}>
          Show Less <ChevronDown size={17} style={{ transform: 'rotate(180deg)' }} />
        </button>
      )}

      {selected && (
        <ProjectCarousel
          title={selected.title}
          venue={selected.venue}
          src={selected.src}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
