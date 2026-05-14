'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const bootMessages = [
  { text: 'Initializing PRS-OS v2.0...', delay: 0 },
  { text: 'Loading neural modules...', delay: 400 },
  { text: 'Mounting development environment...', delay: 800 },
  { text: 'Connecting AI workspace...', delay: 1200 },
  { text: 'Authenticating developer credentials...', delay: 1600 },
  { text: 'Loading project repositories...', delay: 2000 },
  { text: 'Initializing terminal subsystems...', delay: 2400 },
  { text: 'System ready.', delay: 2800 },
]

interface BootScreenProps {
  onBootComplete: () => void
}

export function BootScreen({ onBootComplete }: BootScreenProps) {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [progress, setProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    bootMessages.forEach((_, index) => {
      setTimeout(() => {
        setVisibleMessages(index + 1)
        setProgress(((index + 1) / bootMessages.length) * 100)
      }, bootMessages[index].delay)
    })

    // Show welcome message
    setTimeout(() => {
      setShowWelcome(true)
    }, 3200)

    // Complete boot
    setTimeout(() => {
      onBootComplete()
    }, 4500)
  }, [onBootComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100, 200, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100, 200, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Scanline effect */}
      <div className="scanline" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl px-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block">
            <motion.div
              className="text-6xl font-bold font-mono tracking-tighter"
              style={{ color: 'var(--primary)' }}
            >
              PRS-OS
            </motion.div>
            <motion.div
              className="absolute -inset-4 rounded-lg opacity-30 blur-xl"
              style={{ background: 'var(--glow)' }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <motion.p 
            className="text-muted-foreground mt-4 font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            AI-Powered Developer Operating System
          </motion.p>
        </motion.div>

        {/* Boot messages */}
        <div className="font-mono text-sm space-y-2 mb-8 h-64 overflow-hidden">
          <AnimatePresence>
            {bootMessages.slice(0, visibleMessages).map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <span style={{ color: 'var(--terminal-green)' }}>{'>'}</span>
                <span className="text-muted-foreground">{message.text}</span>
                {index === visibleMessages - 1 && index < bootMessages.length - 1 && (
                  <motion.span
                    className="w-2 h-4 ml-1"
                    style={{ background: 'var(--primary)' }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
                {index === bootMessages.length - 1 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-2 px-2 py-0.5 text-xs rounded"
                    style={{ 
                      background: 'var(--terminal-green)',
                      color: 'var(--background)'
                    }}
                  >
                    OK
                  </motion.span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="relative h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'var(--primary)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full opacity-50 blur-sm"
            style={{ background: 'var(--primary)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Progress percentage */}
        <motion.div 
          className="text-center mt-4 font-mono text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Math.round(progress)}%
        </motion.div>

        {/* Welcome message */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-12"
            >
              <p className="text-xl font-medium" style={{ color: 'var(--primary)' }}>
                Welcome back, Developer.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Entering workspace...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 opacity-20" style={{ borderColor: 'var(--primary)' }} />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 opacity-20" style={{ borderColor: 'var(--primary)' }} />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 opacity-20" style={{ borderColor: 'var(--primary)' }} />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 opacity-20" style={{ borderColor: 'var(--primary)' }} />
    </motion.div>
  )
}
