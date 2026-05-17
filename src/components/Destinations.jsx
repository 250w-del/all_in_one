import React, { useState } from 'react'
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaLeaf, FaPaw, FaMountain } from 'react-icons/fa'
import ImageWithFallback from './ImageWithFallback'

const destinations = [
  {
    id: 'akagera',
    name: 'Akagera National Park',
    location: 'Eastern Province, Rwanda',
    category: 'National Park',
    image: '/images/akagera.jpg',
    fallback: '/images/Rwanda.jfif',
    heroImage: '/images/akagera.jpg',
    founded: '1934',
    area: '1,122 km²',
    altitude: '1,250–1,825 m',
    icon: FaPaw,
    color: 'from-amber-600 to-orange-700',
    badge: 'bg-amber-100 text-amber-700',
    shortDesc: 'Rwanda\'s only savanna park, home to the Big Five and Africa\'s most protected wetland ecosystem.',
    fullDesc: `Akagera National Park, located in the Eastern Province of Rwanda along the Tanzanian border, is one of the most diverse and well-protected parks in East Africa. Founded in 1934 and named after the Akagera River that flows along its eastern boundary, this remarkable park covers approximately 1,122 km² of stunning savanna, woodland, and wetland landscapes.

The park is characterized by its sweeping golden grasslands dotted with acacia trees, dense papyrus swamps, and a chain of beautiful lakes — including Lake Ihema, the second-largest lake in Rwanda. These diverse habitats support an extraordinary range of wildlife, making Akagera a true gem of African biodiversity.

Akagera is home to the Big Five: lions (reintroduced in 2015), elephants, leopards, buffaloes, and black rhinos (reintroduced in 2017). The park also shelters large herds of zebras, topis, impalas, waterbucks, hippos, and Nile crocodiles. Over 500 bird species have been recorded here, making it a paradise for birdwatchers.

The wetland system along the eastern border is one of the largest protected papyrus swamps in Africa, providing critical habitat for the rare shoebill stork and other water birds. Game drives through the park offer spectacular wildlife viewing, while boat safaris on Lake Ihema provide a unique perspective on the park's aquatic life.`,
    highlights: ['Big Five Wildlife', 'Lake Ihema Boat Safari', '500+ Bird Species', 'Papyrus Wetlands', 'Savanna Game Drives'],
    animals: [
      { name: 'Zebras & Elands', image: '/images/akagera.jpg' },
      { name: 'Rwanda Wildlife', image: '/images/Rwanda.jfif' },
      { name: 'Lion', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=80' },
      { name: 'Hippo', image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=400&q=80' },
    ],
  },
  {
    id: 'nyungwe',
    name: 'Nyungwe National Park',
    location: 'South-West Rwanda',
    category: 'National Park',
    image: '/images/nyungwe-canopy.jpg',
    fallback: '/images/download_2.jfif',
    heroImage: '/images/nyungwe-canopy.jpg',
    founded: '2004',
    area: '1,020 km²',
    altitude: '1,600–2,950 m',
    icon: FaLeaf,
    color: 'from-green-600 to-emerald-700',
    badge: 'bg-green-100 text-green-700',
    shortDesc: 'Africa\'s largest montane rainforest, home to chimpanzees, colobus monkeys, and the iconic canopy walkway.',
    fullDesc: `Nyungwe National Park, nestled in the south-western corner of Rwanda, is one of Africa's oldest and most biodiverse rainforests. Covering over 1,020 km², it became a national park in 2004 and stands as one of the best-protected montane forests on the continent, with altitudes ranging from 1,600 to 2,950 meters above sea level.

This ancient forest is a living treasure of biodiversity. It is home to 13 primate species, including chimpanzees and the spectacular Angolan colobus monkeys that travel in troops of up to 400 individuals — the largest primate troops in Africa. The park also shelters L'Hoest's monkeys, olive baboons, and several other rare species.

Nyungwe is the only park in Rwanda offering the extraordinary canopy walkway — a 200-meter suspension bridge suspended 70 meters above the forest floor, offering breathtaking views of the treetops and the surrounding landscape. This unique experience is one of the most thrilling in all of Africa.

The park is also a critical watershed, feeding both the Congo and Nile river systems. Over 300 bird species have been recorded, including 29 Albertine Rift endemics. The forest's diverse flora includes ancient trees, orchids, and ferns that create a magical, misty atmosphere.

Guided chimpanzee trekking, nature walks, and waterfall hikes make Nyungwe an unmissable destination for nature lovers and adventure seekers alike.`,
    highlights: ['Canopy Walkway', 'Chimpanzee Trekking', '13 Primate Species', '300+ Bird Species', 'Waterfall Hikes'],
    animals: [
      { name: 'Canopy Walkway', image: '/images/nyungwe-canopy.jpg' },
      { name: 'Nyungwe Forest', image: '/images/download_2.jfif' },
      { name: 'Colobus Monkey', image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80' },
      { name: 'Forest Birds', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80' },
    ],
  },
  {
    id: 'gishwati',
    name: 'Gishwati-Mukura National Park',
    location: 'Western Province, Rwanda',
    category: 'National Park',
    image: '/images/Golden Monkeys trek in Rwanda.jfif',
    fallback: '/images/download_3.jfif',
    heroImage: '/images/Golden Monkeys trek in Rwanda.jfif',
    founded: '2020',
    area: '3,558 km²',
    altitude: '2,000–2,800 m',
    icon: FaLeaf,
    color: 'from-teal-600 to-green-700',
    badge: 'bg-teal-100 text-teal-700',
    shortDesc: 'Rwanda\'s newest national park, established in 2020, protecting vital montane forest and diverse primate species.',
    fullDesc: `Gishwati-Mukura National Park, located in the Western Province of Rwanda, is the country's newest and most recently established national park, officially gazetted on December 1, 2020. Covering approximately 3,558 km² of montane forest, this park represents a major conservation achievement for Rwanda.

The park consists of two forest fragments — Gishwati Forest and Mukura Forest — which were once part of a vast continuous forest that covered much of western Rwanda. Through dedicated conservation efforts and community engagement, these forests are being restored and reconnected, creating a vital wildlife corridor.

Gishwati-Mukura is home to a remarkable diversity of primates. Chimpanzees inhabit the forest and can be tracked by visitors. Golden monkeys, L'Hoest's monkeys, and olive baboons are also commonly seen. The park provides critical habitat for these species as well as numerous other mammals, reptiles, and amphibians.

The forest is particularly important for its population of golden monkeys — a rare and endangered species found only in the Albertine Rift region. These striking primates, with their vivid orange-gold patches, are a highlight for wildlife enthusiasts.

The park also plays a crucial ecological role as a watershed for the Congo-Nile divide, protecting water sources for surrounding communities. Birdwatching is excellent, with numerous Albertine Rift endemic species recorded. Community-based tourism initiatives around the park offer visitors authentic cultural experiences alongside wildlife encounters.`,
    highlights: ['Chimpanzee Trekking', 'Golden Monkeys', 'Forest Restoration', 'Community Tourism', 'Birdwatching'],
    animals: [
      { name: 'Golden Monkey', image: '/images/Golden Monkeys trek in Rwanda.jfif' },
      { name: 'Gishwati Forest', image: '/images/download_3.jfif' },
      { name: 'Chimpanzee', image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&q=80' },
      { name: 'Forest Elephant', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&q=80' },
    ],
  },
  {
    id: 'volcanoes',
    name: 'Volcanoes National Park',
    location: 'North-West Rwanda',
    category: 'National Park',
    image: '/images/Volcanoes-National-Park-Rwanda.jpg',
    fallback: '/images/volcanoes-gorillas.jpg',
    heroImage: '/images/Volcanoes-National-Park-Rwanda.jpg',
    founded: '1925',
    area: '160 km²',
    altitude: '2,400–4,507 m',
    icon: FaMountain,
    color: 'from-slate-600 to-gray-700',
    badge: 'bg-slate-100 text-slate-700',
    shortDesc: 'Africa\'s oldest national park, home to endangered mountain gorillas and the majestic Virunga volcanoes.',
    fullDesc: `Volcanoes National Park, situated in the north-western corner of Rwanda, is one of Africa's most iconic and historically significant protected areas. Established in 1925, it is the oldest national park on the African continent and covers approximately 160 km² of dramatic volcanic landscape.

The park is dominated by the magnificent Virunga Massif — a chain of eight volcanoes straddling the borders of Rwanda, Uganda, and the Democratic Republic of Congo. The Rwandan section includes five volcanoes: Karisimbi (4,507 m — the highest), Bisoke (3,711 m), Muhabura (4,127 m), Gahinga (3,474 m), and Sabyinyo (3,634 m).

The landscape is extraordinarily diverse, ranging from open grasslands and bamboo forests at lower altitudes to Hagenia-Hypericum woodland, giant lobelia, and senecio zones at higher elevations, and finally to the bare volcanic peaks above the clouds.

Volcanoes National Park is world-famous as the home of the endangered mountain gorilla (Gorilla beringei beringei). Rwanda hosts approximately one-third of the world's remaining mountain gorilla population. Gorilla trekking — guided hikes to spend one precious hour with a habituated gorilla family — is considered one of the most profound wildlife experiences on Earth.

The park was made famous by primatologist Dian Fossey, who conducted her groundbreaking gorilla research here. Her grave and the ruins of her Karisoke Research Center can be visited. Golden monkeys, buffaloes, and over 180 bird species also inhabit the park.`,
    highlights: ['Mountain Gorilla Trekking', 'Volcano Hiking', 'Golden Monkeys', 'Dian Fossey Trail', 'Karisimbi Summit'],
    volcanoes: [
      { name: 'Volcanoes Park', height: 'Rwanda', image: '/images/Volcanoes-National-Park-Rwanda.jpg' },
      { name: 'Mountain Gorillas', height: 'Gorilla Family', image: '/images/volcanoes-gorillas.jpg' },
      { name: 'Karisimbi', height: '4,507 m', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
      { name: 'Bisoke', height: '3,711 m', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
    ],
  },
  {
    id: 'cbt',
    name: 'Cultural Based Tourism (CBT)',
    location: 'Across Rwanda',
    category: 'Cultural Tourism',
    image: 'https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80',
    founded: 'Traditional',
    area: 'Nationwide',
    altitude: 'Various',
    icon: FaLeaf,
    color: 'from-rose-600 to-pink-700',
    badge: 'bg-rose-100 text-rose-700',
    shortDesc: 'Immerse yourself in Rwanda\'s rich cultural heritage through authentic village experiences, traditional crafts, and local ceremonies.',
    fullDesc: `Cultural Based Tourism (CBT) in Rwanda offers visitors an authentic and deeply enriching window into the country's vibrant traditions, history, and community life. Rwanda's CBT initiatives are among the most well-organized and community-driven in Africa, ensuring that tourism directly benefits local communities.

Visitors can experience traditional Intore dance performances — Rwanda's iconic warrior dance characterized by elaborate costumes, energetic movements, and rhythmic drumming. These performances tell stories of Rwanda's history and cultural values.

Village walks and homestay programs allow travelers to live alongside Rwandan families, participate in daily activities such as cooking traditional meals, farming, and craft-making. Traditional crafts include intricate basket weaving (agaseke), pottery, and wood carving — skills passed down through generations.

The Iby'Iwacu Cultural Village near Volcanoes National Park offers one of the most comprehensive cultural experiences, where former poachers have become cultural ambassadors, sharing traditional medicine, hunting techniques, and community stories.

Rwanda's cultural tourism also encompasses visits to genocide memorials, which provide important historical context and honor the memory of those lost in 1994. These sites are treated with deep respect and offer powerful lessons about reconciliation and resilience.

Traditional beer brewing, banana wine tasting, and participation in community ceremonies provide additional layers of authentic cultural immersion that make Rwanda's CBT experience truly unique.`,
    highlights: ['Intore Dance', 'Village Homestays', 'Traditional Crafts', 'Basket Weaving', 'Cultural Ceremonies'],
    animals: [
      { name: 'Rwanda Destinations', image: '/images/5 Best Places to Go in Rwanda in 2026.jfif' },
      { name: 'Rwanda Scenery', image: '/images/Rwanda.jfif' },
      { name: 'Village Life', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80' },
      { name: 'Traditional Food', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80' },
    ],
  },
]

function DestinationCard({ dest, onSelect, isSelected }) {
  const Icon = dest.icon
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-md card-hover cursor-pointer border-2 transition-all duration-300 ${
        isSelected ? 'border-primary-500 shadow-primary-100 shadow-xl' : 'border-transparent'
      }`}
      onClick={() => onSelect(isSelected ? null : dest.id)}
    >
      <div className="relative h-52 overflow-hidden">
        <ImageWithFallback
          src={dest.image}
          fallback={dest.fallback || dest.image}
          alt={dest.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} opacity-40`} />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${dest.badge}`}>
            {dest.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 rounded-full p-2">
          <Icon className="text-primary-600" size={16} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display font-bold text-gray-900 text-lg leading-tight">{dest.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <FaMapMarkerAlt className="text-primary-500 text-xs flex-shrink-0" />
          <span>{dest.location}</span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{dest.shortDesc}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {dest.highlights.slice(0, 3).map((h) => (
            <span key={h} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
              {h}
            </span>
          ))}
        </div>

        <button className="flex items-center gap-2 text-primary-600 font-semibold text-sm hover:text-primary-800 transition-colors">
          {isSelected ? (
            <><FaChevronUp size={12} /> Show Less</>
          ) : (
            <><FaChevronDown size={12} /> Read More</>
          )}
        </button>
      </div>

      {/* Expanded content */}
      {isSelected && (
        <div className="border-t border-gray-100 px-5 pb-5">
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="text-center bg-gray-50 rounded-xl p-3">
              <div className="font-bold text-primary-700 text-sm">{dest.founded}</div>
              <div className="text-xs text-gray-500">Founded</div>
            </div>
            <div className="text-center bg-gray-50 rounded-xl p-3">
              <div className="font-bold text-primary-700 text-sm">{dest.area}</div>
              <div className="text-xs text-gray-500">Area</div>
            </div>
            <div className="text-center bg-gray-50 rounded-xl p-3">
              <div className="font-bold text-primary-700 text-sm">{dest.altitude}</div>
              <div className="text-xs text-gray-500">Altitude</div>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
            {dest.fullDesc}
          </p>

          {/* Animals / Volcanoes grid */}
          <div className="grid grid-cols-2 gap-3">
            {(dest.animals || dest.volcanoes || []).map((item) => (
              <div key={item.name} className="relative rounded-xl overflow-hidden h-28 group">
                <ImageWithFallback
                  src={item.image}
                  fallback={item.fallback || item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white">
                  <div className="font-semibold text-xs">{item.name}</div>
                  {item.height && <div className="text-xs text-gray-300">{item.height}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Destinations() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Scenic Destinations
          </span>
          <h2 className="section-title">Explore Rwanda's Wonders</h2>
          <p className="section-subtitle">
            From the savanna plains of Akagera to the misty peaks of the Virunga volcanoes,
            Rwanda offers some of Africa's most spectacular destinations.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              dest={dest}
              onSelect={setSelected}
              isSelected={selected === dest.id}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
