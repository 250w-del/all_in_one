import React, { useState } from 'react'

/**
 * Image component that falls back to a placeholder if the local image fails to load.
 * This handles the case where local /images/ files haven't been placed yet.
 */
export default function ImageWithFallback({ src, fallback, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback)
      }}
      {...props}
    />
  )
}
