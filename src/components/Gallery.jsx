import React, { useState } from 'react'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const galleryImages = [
  {
    src: '/images/volcanoes-gorillas.jpg',
    title: 'Mountain Gorillas',
    category: 'Wildlife',
    span: 'col-span-2 row-span-2',
  },
  {
    src: '/images/akagera.jpg',
    title: 'Akagera Savanna',
    category: 'National Parks',
    span: '',
  },
  {
    src: '/images/nyungwe-canopy.jpg',
    title: 'Nyungwe Canopy Walk',
    category: 'Nature',
    span: '',
  },
  {
    src: '/images/Volcanoes-National-Park-Rwanda.jpg',
    title: 'Volcanoes National Park',
    category: 'Volcanoes',
    span: '',
  },
  {
    src: '/images/Golden Monkeys trek in Rwanda.jfif',
    title: 'Golden Monkey',
    category: 'Primates',
    span: '',
  },
  {
    src: '/images/Rwanda.jfif',
    title: 'Rwanda Landscape',
    category: 'Nature',
    span: 'col-span-2',
  },
  {
    src: '/images/5 Best Places to Go in Rwanda in 2026.jfif',
    title: 'Rwanda Destinations',
    category: 'National Parks',
    span: '',
  },
  {
    src: '/images/download_2.jfif',
    title: 'Nyungwe Forest',
    category: 'Nature',
    span: '',
  },
  {
    src: '/images/download_3.jfif',
    title: 'Gishwati Forest',
    category: 'National Parks',
    span: '',
  },
]

const categories = ['All', 'Wildlife', 'National Parks', 'Nature', 'Volcanoes', 'Primates']

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory)

  const openLightbox = (index) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const prevImage = () => setLightbox((prev) => (prev - 1 + filtered.length) % filtered.length)
  const nextImage = () => setLightbox((prev) => (prev + 1) % filtered.length)

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Photo Gallery
          </span>
          <h2 className="section-title">Rwanda Through Our Lens</h2>
          <p className="section-subtitle">
            A visual journey through Rwanda's stunning landscapes, incredible wildlife, and vibrant culture.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {filtered.map((img, index) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${img.span}`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-white font-semibold text-sm">{img.title}</div>
                <div className="text-primary-300 text-xs">{img.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <FaTimes size={28} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3"
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            aria-label="Previous image"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            aria-label="Next image"
          >
            <FaChevronRight size={20} />
          </button>

          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <div className="text-white font-semibold text-lg">{filtered[lightbox].title}</div>
              <div className="text-primary-400 text-sm">{filtered[lightbox].category}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
