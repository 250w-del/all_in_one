import React from 'react'
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp,
  FaFacebook, FaInstagram, FaTwitter, FaYoutube,
  FaHeart, FaArrowUp
} from 'react-icons/fa'

const services = [
  'Tour Guiding', 'Travel Guide', 'Nature Walks', 'City Tour',
  'City Night Life', 'Hiking', 'Day Game Drive', 'Gorilla Trekking',
  'Fishing', 'Boat Riding', 'Canopy Walk', 'Kayaking',
]

const destinations = [
  'Akagera National Park',
  'Nyungwe National Park',
  'Gishwati-Mukura Park',
  'Volcanoes National Park',
  'Cultural Based Tourism',
  'Kigali City',
]

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-tight">All In One Tour</div>
                <div className="text-primary-400 text-xs">Kigali, Rwanda</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your premier tour guide in Rwanda. We offer unforgettable experiences across Rwanda's
              stunning national parks, cultural sites, and scenic landscapes.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a href="mailto:hyacinthhabineza0@gmail.com" className="flex items-center gap-3 text-sm hover:text-primary-400 transition-colors group">
                <FaEnvelope className="text-primary-500 flex-shrink-0 group-hover:text-primary-400" size={14} />
                <span className="break-all">hyacinthhabineza0@gmail.com</span>
              </a>
              <a href="tel:+250795247707" className="flex items-center gap-3 text-sm hover:text-primary-400 transition-colors group">
                <FaPhone className="text-primary-500 flex-shrink-0 group-hover:text-primary-400" size={14} />
                +250 795 247 707
              </a>
              <a href="https://wa.me/250795247707" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-green-400 transition-colors group">
                <FaWhatsapp className="text-green-500 flex-shrink-0 group-hover:text-green-400" size={16} />
                WhatsApp Us
              </a>
              <div className="flex items-center gap-3 text-sm">
                <FaMapMarkerAlt className="text-primary-500 flex-shrink-0" size={14} />
                Kigali, Rwanda
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
                { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
                { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
                { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
              ].map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center ${color} transition-colors duration-300`}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-base mb-5 relative">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary-500 rounded" />
            </h4>
            <ul className="space-y-3 mt-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:bg-primary-400 transition-colors flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white text-base mb-5 relative">
              Our Services
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary-500 rounded" />
            </h4>
            <ul className="space-y-3 mt-4">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:bg-primary-400 transition-colors flex-shrink-0" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-white text-base mb-5 relative">
              Destinations
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary-500 rounded" />
            </h4>
            <ul className="space-y-3 mt-4">
              {destinations.map((dest) => (
                <li key={dest}>
                  <a
                    href="#destinations"
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:bg-primary-400 transition-colors flex-shrink-0" />
                    {dest}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h5 className="text-white font-medium text-sm mb-3">Stay Updated</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} All In One Tour. Made with{' '}
            <FaHeart className="inline text-red-500 mx-1" size={12} />
            by{' '}
            <span className="text-primary-400 font-medium">Hyacinth HABINEZA</span>
            {' '}— Kigali, Rwanda
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
        aria-label="Scroll to top"
      >
        <FaArrowUp size={16} />
      </button>
    </footer>
  )
}
