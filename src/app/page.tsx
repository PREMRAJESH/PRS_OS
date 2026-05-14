'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BootScreen } from '@/components/os/boot-screen'
import { Desktop } from '@/components/os/desktop'

export default function Home() {
  const [isBooting, setIsBooting] = useState(true)
  const [showDesktop, setShowDesktop] = useState(false)

  useEffect(() => {
    // Check if already booted in this session
    const hasBooted = sessionStorage.getItem('prs-os-booted')
    if (hasBooted) {
      setIsBooting(false)
      setShowDesktop(true)
    }
  }, [])

  const handleBootComplete = () => {
    sessionStorage.setItem('prs-os-booted', 'true')
    setIsBooting(false)
    setTimeout(() => setShowDesktop(true), 100)
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {isBooting && (
          <BootScreen onBootComplete={handleBootComplete} />
        )}
      </AnimatePresence>
      
      {showDesktop && <Desktop />}
    </main>
  )
}
