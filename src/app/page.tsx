'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { BootScreen } from '@/components/os/boot-screen'
import { Desktop } from '@/components/os/desktop'
import { MobileOS } from '@/components/mobile/mobile-os'
import { useIsAndroid } from '@/hooks/use-media-query'

export default function Home() {
  const [isBooting, setIsBooting] = useState(true)
  const [showOS, setShowOS] = useState(false)
  const isAndroid = useIsAndroid()

  useEffect(() => {
    // Check if already booted in this session
    const hasBooted = sessionStorage.getItem('prs-os-booted')
    if (hasBooted) {
      setIsBooting(false)
      setShowOS(true)
    }
  }, [])

  const handleBootComplete = () => {
    sessionStorage.setItem('prs-os-booted', 'true')
    setIsBooting(false)
    setTimeout(() => setShowOS(true), 100)
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="h-[100dvh] w-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {isBooting && <BootScreen onBootComplete={handleBootComplete} />}
        </AnimatePresence>

        {showOS &&
          isAndroid !== null &&
          (isAndroid ? (
            <div className="android-shell h-[100dvh] w-full">
              <MobileOS />
            </div>
          ) : (
            <Desktop />
          ))}
      </main>
    </MotionConfig>
  )
}
