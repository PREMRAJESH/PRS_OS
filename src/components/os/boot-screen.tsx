'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const bootSteps = [
  'Preparing the workspace',
  'Loading project archive',
  'Restoring your session',
  'Ready',
]

const STEP_MS = 620

interface BootScreenProps {
  onBootComplete: () => void
}

export function BootScreen({ onBootComplete }: BootScreenProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = bootSteps.map((_, index) =>
      setTimeout(() => setStep(index + 1), (index + 1) * STEP_MS)
    )
    const done = setTimeout(onBootComplete, bootSteps.length * STEP_MS + 420)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [onBootComplete])

  const progress = Math.min(100, (step / bootSteps.length) * 100)
  const current = bootSteps[Math.min(step, bootSteps.length - 1)]

  return (
    <motion.div
      className="fixed inset-0 desktop-texture z-50 flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="grain" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-sm px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-2.5 mb-7">
            <span className="w-5 h-5 rounded-[6px] border border-hairline-strong bg-surface/60 flex items-center justify-center">
              <span className="font-display text-[12px] leading-none text-primary -mt-px">P</span>
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground/60">
              PRS—OS
            </span>
          </div>

          <h1 className="font-display text-[3.25rem] leading-[0.95] text-foreground tracking-[-0.02em]">
            Prem Rajesh
          </h1>
          <p className="mt-3 text-[12px] text-muted-foreground/70">
            Software engineer in Gujarat, India
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-12"
        >
          <div className="h-px w-full bg-hairline overflow-hidden">
            <motion.div
              className="h-full bg-primary/80"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground/55">
            <span>{current}</span>
            <span className="tabular">{Math.round(progress)}%</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[9px] font-mono tracking-[0.14em] uppercase text-muted-foreground/30">
        <span>v2.0</span>
        <span>Portfolio</span>
      </div>
    </motion.div>
  )
}
