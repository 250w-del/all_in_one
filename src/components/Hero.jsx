import React, { useState, useEffect } from 'react'
import { FaPlay, FaChevronDown, FaStar } from 'react-icons/fa'

const slides = [
  {
    image: '/images/volcanoes-gorillas.jpg',
    title: 'Discover the Heart of Africa',
    subtitle: 'Rwanda — The Land of a Thousand Hills',
    tag: 'Mountain Gorilla Trekking',
  },
  {
    image: '/images/akagera.jpg',
    title: 'Explore Breathtaking National Parks',
    subtitle: 'Wildlife, Nature & Unforgettable Adventures',
    tag: 'Akagera National Park',
  },
  {
    image: '/images/nyungwe-canopy.jpg',
    title: 'Walk Above the Forest Canopy',
    subtitle: 'Nyungwe — Africa\'s Oldest Rainforest',
    tag: 'Nyungwe Canopy Walk',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-600/90 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 animate-fade-in">
          <FaStar className="text-gold-400 text-xs" />
          {slides[current].tag}
          <FaStar className="text-gold-400 text-xs" />
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 animate-slide-up max-w-5xl">
          {slides[current].title}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl animate-fade-in">
          {slides[current].subtitle}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-8 mb-10 text-white">
          {[
            { value: '500+', label: 'Happy Tourists' },
            { value: '4', label: 'National Parks' },
            { value: '12+', label: 'Tour Services' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-gold-400">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <a href="#destinations" className="btn-primary flex items-center gap-2 justify-center">
            Explore Destinations
          </a>
          <a href="#services" className="btn-outline flex items-center gap-2 justify-center">
            <FaPlay className="text-xs" />
            Our Services
          </a>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2 bg-primary-400' : 'w-2 h-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <a
        href="#services"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white animate-bounce"
        aria-label="Scroll down"
      >
        <FaChevronDown size={24} />
      </a>
    </section>
  )
}
