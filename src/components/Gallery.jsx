import React, { useState, useEffect } from 'react'
import { FaTimes, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa'

const API_BASE = import.meta.env.VITE_API_URL || ''

// Static fallback images (always shown)
const staticImages = [
  { id: 's1', image_url: '/images/volcanoes-gorillas.jpg',           title: 'Mountain Gorillas',       category: 'Wildlife',       span: 'col-span-2 row-span-2' },
  { id: 's2', image_url: '/images/akagera.jpg',                      title: 'Akagera Savanna',         category: 'National Parks', span: '' },
  { id: 's3', image_url: '/images/nyungwe-canopy.jpg',               title: 'Nyungwe Canopy Walk',     category: 'Nature',         span: '' },
  { id: 's4', image_url: '/images/Volcanoes-National-Park-Rwanda.jpg',title: 'Volcanoes National Park', category: 'Volcanoes',      span: '' },
  { id: 's5', image_url: '/images/Golden Monkeys trek in Rwanda.jfif',title: 'Golden Monkey',          category: 'Primates',       span: '' },
  { id: 's6', image_url: '/images/Rwanda.jfif',                      title: 'Rwanda Landscape',        category: 'Nature',         span: 'col-span-2' },
  { id: 's7', image_url: '/images/5 Best Places to Go in Rwanda in 2026.jfif', title: 'Rwanda Destinations', category: 'National Parks', span: '' },
  { id: 's8', image_url: '/images/download_2.jfif',                  title: 'Nyungwe Forest',          category: 'Nature',         span: '' },
  { id: 's9', image_url: '/images/download_3.jfif',                  title: 'Gishwati Forest',         category: 'National Parks', span: '' },
]

const allCategories = ['All', 'Wildlife', 'National Parks', 'Nature', 'Volcanoes', 'Primates', 'Culture', 'City', 'General']

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox]             = useState(null)
  const [dbImages, setDbImages]             = useState([])
  const [loadingDb, setLoadingDb]           = useState(true)

  // Load images from DB (admin-uploaded)
  useEffect(() => {
    fetch(`${API_BASE}/api/gallery`)
      .then(r => r.json())
      .then(d => { if (d.success) setDbImages(d.images) })
      .catch(() => {})
      .finally(() => setLoadingDb(false))
  }, [])

  // Merge DB images + static images (DB first, no duplicates)
  const allImages = [
    ...dbImages.map(img => ({
      id:        img.id,
      image_url: img.image_url,
      title:     img.title,
      category:  img.category,
      span:      '',
      fromDb:    true,
    })),
    ...staticImages,
  ]

  // Get unique categories from all images
  const usedCategories = ['All', ...new Set(allImages.map(i => i.category))]

  const filtered = activeCategory === 'All'
    ? allImages
    : allImages.filter(img => img.category === activeCategory)

  const openLightbox  = (index) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const prevImage     = () => setLightbox(p => (p - 1 + filtered.length) % filtered.length)
  const nextImage     = () => setLightbox(p => (p + 1) % filtered.length)

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
          {loadingDb && (
            <div className="flex items-center justify-center gap-2 mt-3 text-primary-500 text-sm">
              <FaSpinner className="animate-spin" size={14} />
              Loading latest photos...
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {usedCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 border border-gray-200'
              }`}>{cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {filtered.map((img, index) => (
            <div key={img.id}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group bg-gray-100 ${img.span || ''}`}
              onClick={() => openLightbox(index)}>
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={e => { e.target.style.display = 'none' }}
              />
              {/* DB badge */}
              {img.fromDb && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full font-medium shadow">New</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-white font-semibold text-sm">{img.title}</div>
                <div className="text-primary-300 text-xs">{img.category}</div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loadingDb && (
          <div className="text-center py-16 text-gray-400">
            No images in this category yet.
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
            onClick={closeLightbox} aria-label="Close">
            <FaTimes size={22} />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3"
            onClick={e => { e.stopPropagation(); prevImage() }} aria-label="Previous">
            <FaChevronLeft size={20} />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3"
            onClick={e => { e.stopPropagation(); nextImage() }} aria-label="Next">
            <FaChevronRight size={20} />
          </button>
          <div className="max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
            <img src={filtered[lightbox].image_url} alt={filtered[lightbox].title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl" />
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
