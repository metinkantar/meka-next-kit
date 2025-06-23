'use client'

import { useEffect } from 'react'

export default function ScrollHandler() {
  useEffect(() => {
    const header = document.getElementById('header')
    if (!header) return

    const updateHeaderStyle = () => {
      if (window.scrollY > 0) {
        header.className = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm bg-black/20 border-b dark:border-white/10 border-black/30 shadow-lg'
      } else {
        header.className = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent'
      }
    }

    // İlk yüklenmede kontrol et
    updateHeaderStyle()

    window.addEventListener('scroll', updateHeaderStyle)
    return () => window.removeEventListener('scroll', updateHeaderStyle)
  }, [])

  return null
}