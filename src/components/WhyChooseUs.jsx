import React from 'react'
import { FaShieldAlt, FaUserTie, FaHeart, FaClock, FaGlobe, FaAward } from 'react-icons/fa'

const features = [
  {
    icon: FaUserTie,
    title: 'Expert Local Guides',
    description: 'Our certified guides are born and raised in Rwanda, offering deep cultural knowledge and insider access to hidden gems.',
    color: 'text-primary-600 bg-primary-50',
  },
  {
    icon: FaShieldAlt,
    title: 'Safe & Secure',
    description: 'Your safety is our top priority. All tours follow strict safety protocols with emergency support available 24/7.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: FaHeart,
    title: 'Personalized Experience',
    description: 'Every tour is tailored to your interests, pace, and budget. We create memories that last a lifetime.',
    color: 'text-rose-600 bg-rose-50',
  },
  {
    icon: FaClock,
    title: 'Flexible Scheduling',
    description: 'Choose from half-day, full-day, or multi-day tours. We work around your schedule for maximum convenience.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: FaGlobe,
    title: 'Sustainable Tourism',
    description: 'We are committed to eco-friendly practices that protect Rwanda\'s natural heritage for future generations.',
    color: 'text-teal-600 bg-teal-50',
  },
  {
    icon: FaAward,
    title: 'Award-Winning Service',
    description: 'Recognized for excellence in tourism, we consistently deliver experiences that exceed expectations.',
    color: 'text-purple-600 bg-purple-50',
  },
]

const stats = [
  { value: '500+', label: 'Happy Tourists', suffix: '' },
  { value: '5', label: 'Years Experience', suffix: '+' },
  { value: '4', label: 'National Parks', suffix: '' },
  { value: '98', label: 'Satisfaction Rate', suffix: '%' },
]

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Your Trusted Rwanda Tour Partner
          </h2>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            With years of experience and a passion for showcasing Rwanda's beauty,
            we deliver exceptional tour experiences that go beyond the ordinary.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="font-display text-4xl font-bold text-gold-400 mb-1">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-primary-200 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-primary-200 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-block bg-white text-primary-800 font-bold py-4 px-10 rounded-full hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Start Your Journey Today
          </a>
        </div>
      </div>
    </section>
  )
}
