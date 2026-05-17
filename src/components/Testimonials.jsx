import React, { useState, useEffect } from 'react'
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Sarah Mitchell',
    country: 'United States',
    flag: '🇺🇸',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    tour: 'Mountain Gorilla Trekking',
    text: 'The gorilla trekking experience was absolutely life-changing. Our guide was incredibly knowledgeable and made us feel safe throughout the entire trek. Spending an hour with the gorilla family was the most profound wildlife experience of my life. All In One Tour exceeded every expectation!',
  },
  {
    name: 'James Okonkwo',
    country: 'Nigeria',
    flag: '🇳🇬',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
    tour: 'Akagera Game Drive',
    text: 'The game drive in Akagera was spectacular! We saw lions, elephants, giraffes, and even a black rhino. The boat safari on Lake Ihema was the highlight — watching hippos and crocodiles up close was incredible. The team was professional, punctual, and genuinely passionate about wildlife.',
  },
  {
    name: 'Emma Dubois',
    country: 'France',
    flag: '🇫🇷',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
    tour: 'Nyungwe Canopy Walk',
    text: 'Walking above the forest canopy in Nyungwe was breathtaking! The chimpanzee trekking was equally amazing. Our guide knew exactly where to find them and gave us fascinating insights into their behavior. Rwanda is truly a gem, and All In One Tour made every moment special.',
  },
  {
    name: 'Hiroshi Tanaka',
    country: 'Japan',
    flag: '🇯🇵',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 5,
    tour: 'Cultural Tour & City Night Life',
    text: 'The cultural tour was a wonderful blend of history, tradition, and modern Kigali. The Intore dance performance was mesmerizing, and the city nightlife tour showed us a vibrant, modern Rwanda. Hyacinth and the team were warm, welcoming, and made us feel like family.',
  },
  {
    name: 'Amara Diallo',
    country: 'Senegal',
    flag: '🇸🇳',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5,
    tour: 'Multi-Day Rwanda Tour',
    text: 'We did a 5-day tour covering Akagera, Nyungwe, and Volcanoes parks. The logistics were flawless, accommodations were excellent, and every day brought new wonders. All In One Tour truly lives up to its name — they handle everything so you can just enjoy the experience.',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const prev = () => {
    setIsAutoPlaying(false)
    setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)
  }
  const next = () => {
    setIsAutoPlaying(false)
    setCurrent((p) => (p + 1) % testimonials.length)
  }

  const t = testimonials[current]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="section-title">What Our Guests Say</h2>
          <p className="section-subtitle">
            Real experiences from travelers who explored Rwanda with us.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-primary-100">
          <FaQuoteLeft className="text-primary-200 text-6xl absolute top-6 left-8" />

          <div className="relative z-10">
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(t.rating)].map((_, i) => (
                <FaStar key={i} className="text-gold-500" size={20} />
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 italic">
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-200"
                />
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-gray-500 text-sm">{t.flag} {t.country}</div>
                  <div className="text-primary-600 text-xs font-medium mt-0.5">{t.tour}</div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border-2 border-primary-200 text-primary-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Previous testimonial"
                >
                  <FaChevronLeft size={14} />
                </button>
                <span className="text-gray-400 text-sm">{current + 1} / {testimonials.length}</span>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border-2 border-primary-200 text-primary-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300 flex items-center justify-center"
                  aria-label="Next testimonial"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIsAutoPlaying(false); setCurrent(i) }}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-8 h-2 bg-primary-600' : 'w-2 h-2 bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
