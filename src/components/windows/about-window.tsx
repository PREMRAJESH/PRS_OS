'use client'

import { motion } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  GraduationCap,
  ExternalLink,
  Code2,
} from 'lucide-react'

const interests = [
  {
    title: 'AI agents',
    desc: 'Autonomous reasoning workflows and integration pipelines.',
  },
  {
    title: 'Machine learning',
    desc: 'Training classifier networks and optimising inference.',
  },
  {
    title: 'Developer experience',
    desc: 'High-fidelity sandboxes and tools that make code legible.',
  },
  {
    title: 'Cloud computing',
    desc: 'Serverless runtimes and realtime data synchronisation.',
  },
]

const facts = [
  { label: 'Based in', value: 'Gujarat, India' },
  { label: 'Studying', value: 'B.E. Computer Engineering, 2024—2027' },
  { label: 'College', value: 'Government Engineering College, Dahod' },
  { label: 'Focus', value: 'AI, full stack, developer tooling' },
]

export function AboutWindow() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar font-sans">
      <div className="px-6 sm:px-9 py-8 sm:py-10 max-w-3xl mx-auto w-full pb-16">

        {/* Profile header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 pb-8 border-b border-hairline"
        >
          <div className="relative shrink-0">
            <div className="w-[104px] h-[130px] rounded-lg overflow-hidden ring-1 ring-hairline-strong bg-surface">
              <img
                src="/avatar.jpg"
                alt="Prem Rajesh"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-popover border border-hairline text-[8px] font-mono tracking-[0.1em] uppercase text-accent">
              <span className="w-1 h-1 rounded-full bg-accent" />
              Open
            </span>
          </div>

          <div className="flex-1 min-w-0 sm:pt-1.5">
            <p className="text-eyebrow">About</p>
            <h1 className="font-display text-[2.9rem] leading-[0.95] tracking-[-0.02em] mt-2">
              Prem Rajesh
            </h1>
            <p className="mt-2.5 text-[13px] text-muted-foreground/80">
              Software engineering student · AI and full stack
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[10.5px] font-mono text-muted-foreground/55">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Gujarat, India
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3" />
                GEC Dahod
              </span>
            </div>
          </div>
        </motion.header>

        {/* Bio */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="py-8 border-b border-hairline"
        >
          <p className="text-[13.5px] leading-[1.85] text-muted-foreground/85">
            I&apos;m a Computer Engineering student at Government Engineering College, Dahod,
            interested in artificial intelligence, machine learning, cloud computing and full
            stack development. I like building practical software that combines engineering
            fundamentals with real-world problem solving.
          </p>
          <p className="mt-4 text-[13.5px] leading-[1.85] text-muted-foreground/70">
            Most of my work starts with a question I can&apos;t answer quickly enough — how a
            model makes a decision, how a schedule fits a real week, how a data structure
            changes step by step. I build tools to make those things visible.
          </p>
        </motion.section>

        {/* Facts */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="py-7 border-b border-hairline grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"
        >
          {facts.map(fact => (
            <div key={fact.label}>
              <div className="text-[9px] font-mono tracking-[0.13em] uppercase text-muted-foreground/40">
                {fact.label}
              </div>
              <div className="mt-1 text-[12px] text-foreground/75 leading-snug">{fact.value}</div>
            </div>
          ))}
        </motion.section>

        {/* Interests */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="py-8 border-b border-hairline"
        >
          <div className="flex items-baseline justify-between">
            <h2 className="text-eyebrow">Current interests</h2>
            <span className="text-[9.5px] font-mono text-muted-foreground/35">Four threads</span>
          </div>

          <div className="mt-4">
            {interests.map((interest, i) => (
              <div
                key={interest.title}
                className="grid grid-cols-[24px_1fr] sm:grid-cols-[28px_150px_1fr] gap-x-4 gap-y-1 py-3 border-b border-hairline last:border-b-0 items-baseline"
              >
                <span className="font-mono text-[10px] text-muted-foreground/30 tabular">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[12.5px] text-foreground/85">{interest.title}</h3>
                <p className="col-start-2 sm:col-start-auto text-[12px] leading-relaxed text-muted-foreground/65">
                  {interest.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-2.5 text-[11.5px] leading-relaxed text-muted-foreground/65">
            <span className="mt-[6px] w-1 h-1 rounded-full bg-primary/80 shrink-0" />
            <span>
              Currently exploring modern web applications built with React 19, Next.js 16 and
              Tailwind CSS 4.
            </span>
          </div>
        </motion.section>

        {/* Connect */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8"
        >
          <h2 className="text-eyebrow">Connect</h2>

          <div className="mt-2">
            <SocialLink icon={Github} label="GitHub" href="https://github.com/PREMRAJESH" username="@PREMRAJESH" />
            <SocialLink icon={Linkedin} label="LinkedIn" href="https://www.linkedin.com/in/gecdhd-comp-prem-sargara/" username="in/gecdhd-comp-prem-sargara" />
            <SocialLink
              icon={Mail}
              label="Email"
              href="#"
              username="sargarapremrajesh@gmail.com"
              onClick={() => useOSStore.getState().openWindow('quick-links')}
            />
            <SocialLink icon={Code2} label="LeetCode" href="https://leetcode.com/u/Sargara_Prem/" username="u/Sargara_Prem" />
          </div>
        </motion.section>

      </div>
    </div>
  )
}

function SocialLink({
  icon: Icon,
  label,
  href,
  username,
  onClick,
}: {
  icon: typeof Github
  label: string
  href: string
  username: string
  onClick?: () => void
}) {
  return (
    <a
      href={onClick ? undefined : href}
      target={onClick ? undefined : '_blank'}
      rel={onClick ? undefined : 'noopener noreferrer'}
      onClick={onClick ? (e) => { e.preventDefault(); onClick() } : undefined}
      className="group flex items-center gap-3 py-3 border-b border-hairline last:border-b-0 transition-colors"
    >
      <Icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" strokeWidth={1.7} />
      <span className="text-[12px] text-foreground/80 group-hover:text-foreground transition-colors w-20 shrink-0">
        {label}
      </span>
      <span className="flex-1 min-w-0 text-[10.5px] font-mono text-muted-foreground/50 truncate">
        {username}
      </span>
      {!onClick && (
        <ExternalLink className="w-3 h-3 shrink-0 text-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </a>
  )
}
