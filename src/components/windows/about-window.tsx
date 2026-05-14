'use client'

import { motion } from 'framer-motion'
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin,
  Calendar,
  ExternalLink,
  Cpu,
  Layers,
  Activity,
  Code2
} from 'lucide-react'

export function AboutWindow() {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] overflow-y-auto custom-scrollbar selection:bg-primary/30">
      <div className="p-8 max-w-3xl mx-auto w-full space-y-12 pb-20">
        
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-12"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-background shadow-2xl shadow-primary/20">
              PR
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-[#0a0a0b] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-white">Prem Ranjan</h1>
            <p className="text-lg text-primary font-medium">Software Systems Engineer</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground/60 font-mono">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Bengaluru, India
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Engineering Undergrad
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bio & Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Engineering Philosophy</h2>
          <p className="text-base leading-relaxed text-muted-foreground/80 font-medium">
            I specialize in architecting high-fidelity web systems and cloud-native applications. My approach favors 
            <span className="text-white"> technical precision and system-level thinking</span> over decorative abstractions. I build tools that 
            prioritize developer experience, keyboard accessibility, and performance.
          </p>
        </motion.div>

        {/* Engineering Challenges (The Realism Part) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Engineering Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChallengeCard 
              title="State Orchestration"
              description="Managing multi-window lifecycle and z-index depth without causing unnecessary re-renders in the main layout."
              icon={Layers}
            />
            <ChallengeCard 
              title="60FPS Motion Performance"
              description="Optimizing GPU-accelerated transitions and mouse-reactive lighting to maintain high frame rates on low-end hardware."
              icon={Activity}
            />
            <ChallengeCard 
              title="Command Parsing"
              description="Building a scalable natural language intent system that maps user queries to system-level workspace actions."
              icon={Code2}
            />
            <ChallengeCard 
              title="Context Preservation"
              description="Ensuring workspace continuity and contextual handoffs between the Command Hub and individual app modules."
              icon={Cpu}
            />
          </div>
        </motion.div>

        {/* System Design Decisions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">System Design Decisions</h2>
          <div className="space-y-4">
            <DecisionItem 
              label="Why Zustand?"
              value="Chosen for lightweight global orchestration. It provides low-overhead reactive state management for the OS 'kernel' without the boilerplate of Redux."
            />
            <DecisionItem 
              label="Why Command-Driven UX?"
              value="Reduces navigation cognitive load while increasing immersion. It prioritizes keyboard accessibility and mirrors professional developer tooling."
            />
            <DecisionItem 
              label="Why Floating Windows?"
              value="Enables contextual multitasking. Unlike static tabs, it allows the user to preserve workspace continuity across complex technical workflows."
            />
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Connect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SocialLink icon={Github} label="GitHub" href="https://github.com/premranjan" username="@premranjan" />
            <SocialLink icon={Linkedin} label="LinkedIn" href="https://linkedin.com/in/premranjan" username="in/premranjan" />
            <SocialLink icon={Twitter} label="Twitter" href="https://twitter.com/premranjan" username="@premranjan" />
            <SocialLink icon={Mail} label="Email" href="mailto:prem@example.com" username="prem@example.com" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ChallengeCard({ title, description, icon: Icon }: { title: string, description: string, icon: any }) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">{description}</p>
    </div>
  )
}

function DecisionItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
      <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">{label}</div>
      <div className="text-sm text-muted-foreground font-medium leading-relaxed">{value}</div>
    </div>
  )
}

function SocialLink({ 
  icon: Icon, 
  label, 
  href, 
  username 
}: { 
  icon: any
  label: string
  href: string
  username: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.05] transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-white uppercase tracking-tight">{label}</div>
        <div className="text-xs text-muted-foreground/60 truncate font-mono mt-0.5">{username}</div>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}
