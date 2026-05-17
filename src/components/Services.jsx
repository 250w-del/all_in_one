import React from 'react'
import {
  FaCompass, FaMap, FaLeaf, FaCity, FaMoon, FaMountain,
  FaCar, FaGlobeAfrica, FaFish, FaShip, FaTree, FaWater
} from 'react-icons/fa'

const services = [
  {
    icon: FaCompass,
    title: 'Tour Guiding',
    description: 'Expert local guides who know every corner of Rwanda, ensuring a safe and enriching experience.',
    color: 'bg-green-50 text-green-600',
    border: 'border-green-200',
  },
  {
    icon: FaMap,
    title: 'Travel Guide',
    description: 'Comprehensive travel planning and itinerary design tailored to your interests and schedule.',
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-200',
  },
  {
    icon: FaLeaf,
    title: 'Nature Walks',
    description: 'Immersive nature experiences through Rwanda\'s stunning forests, wetlands, and scenic landscapes.',
    color: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-200',
  },
  {
    icon: FaCity,
    title: 'City Tour',
    description: 'Discover Kigali\'s vibrant culture, modern architecture, memorials, and local markets.',
    color: 'bg-purple-50 text-purple-600',
    border: 'border-purple-200',
  },
  {
    icon: FaMoon,
    title: 'City Night Life',
    description: 'Experience Kigali\'s exciting nightlife — restaurants, bars, live music, and cultural shows.',
    color: 'bg-indigo-50 text-indigo-600',
    border: 'border-indigo-200',
  },
  {
    icon: FaMountain,
    title: 'Hiking',
    description: 'Guided hiking adventures through Rwanda\'s breathtaking hills, volcanoes, and forest trails.',
    color: 'bg-orange-50 text-orange-600',
    border: 'border-orange-200',
  },
  {
    icon: FaCar,
    title: 'Day Game Drive',
    description: 'Thrilling game drives in Akagera National Park to spot lions, elephants, giraffes, and more.',
    color: 'bg-yellow-50 text-yellow-600',
    border: 'border-yellow-200',
  },
  {
    icon: FaGlobeAfrica,
    title: 'Gorilla Trekking',
    description: 'Once-in-a-lifetime mountain gorilla trekking experience in Volcanoes National Park.',
    color: 'bg-teal-50 text-teal-600',
    border: 'border-teal-200',
  },
  {
    icon: FaFish,
    title: 'Fishing',
    description: 'Relaxing fishing trips on Lake Kivu and other scenic water bodies across Rwanda.',
    color: 'bg-cyan-50 text-cyan-600',
    border: 'border-cyan-200',
  },
  {
    icon: FaShip,
    title: 'Boat Riding',
    description: 'Scenic boat rides on Lake Kivu and Akagera\'s lakes, offering stunning views and wildlife.',
    color: 'bg-sky-50 text-sky-600',
    border: 'border-sky-200',
  },
  {
    icon: FaTree,
    title: 'Canopy Walk',
    description: 'Walk above the forest canopy in Nyungwe National Park — a unique and thrilling experience.',
    color: 'bg-lime-50 text-lime-600',
    border: 'border-lime-200',
  },
  {
    icon: FaWater,
    title: 'Kayaking',
    description: 'Exciting kayaking adventures on Rwanda\'s beautiful lakes and rivers for all skill levels.',
    color: 'bg-rose-50 text-rose-600',
    border: 'border-rose-200',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="section-title">Our Tour Services</h2>
          <p className="section-subtitle">
            From thrilling wildlife encounters to peaceful nature walks, we offer a complete range of
            experiences to make your Rwanda visit unforgettable.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 border ${service.border} card-hover cursor-pointer group`}
              >
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="#contact" className="btn-primary inline-block">
            Book Your Adventure
          </a>
        </div>
      </div>
    </section>
  )
}
