import React, { useEffect, useState } from 'react'
import { FaTimes, FaBullhorn, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa'

const API_BASE = import.meta.env.VITE_API_URL || ''

const TYPE_STYLES = {
  info:    { bg: 'bg-blue-600',   icon: FaInfoCircle,         text: 'text-white' },
  success: { bg: 'bg-green-600',  icon: FaCheckCircle,        text: 'text-white' },
  warning: { bg: 'bg-amber-500',  icon: FaExclamationTriangle, text: 'text-white' },
  urgent:  { bg: 'bg-red-600',    icon: FaExclamationCircle,  text: 'text-white' },
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([])
  const [dismissed, setDismissed]         = useState([])
  const [current, setCurrent]             = useState(0)

  useEffect(() => {
    fetch(`${API_BASE}/api/announcements`)
      .then(r => r.json())
      .then(d => { if (d.success) setAnnouncements(d.announcements) })
      .catch(() => {})
  }, [])

  const visible = announcements.filter(a => !dismissed.includes(a.id))
  if (!visible.length) return null

  const ann = visible[current % visible.length]
  const style = TYPE_STYLES[ann.type] || TYPE_STYLES.info
  const Icon  = style.icon

  return (
    <div className={`${style.bg} ${style.text} py-2.5 px-4 relative z-40`}>
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <Icon size={16} className="flex-shrink-0" />
        <div className="flex-1 text-center text-sm font-medium">
          <span className="font-bold mr-2">{ann.title}:</span>
          <span className="opacity-90">{ann.content}</span>
        </div>
        {visible.length > 1 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {visible.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current % visible.length ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
        <button onClick={() => setDismissed(d => [...d, ann.id])}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-2">
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  )
}
