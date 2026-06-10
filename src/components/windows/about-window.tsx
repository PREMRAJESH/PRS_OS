'use client'

import { motion } from 'framer-motion'
import { 
  Github, 
  Linkedin, 
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
    <div className="h-full flex flex-col bg-[#0a0a0b] overflow-y-auto custom-scrollbar selection:bg-primary/30 font-sans">
      <div className="p-8 max-w-3xl mx-auto w-full space-y-12 pb-20 select-none">
        
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-12"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-[#0a0a0b] shadow-2xl bg-[#0c0d12]">
              <img src="/avatar.png" alt="Prem Rajesh" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-[#0a0a0b] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-white">Prem Rajesh</h1>
            <p className="text-lg text-primary font-medium">Software Engineering Student</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground/60 font-mono">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary/70" />
                Gujarat, India
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary/70" />
                Government Engineering College, Dahod
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bio & Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">About Me</h2>
          <p className="text-base leading-relaxed text-muted-foreground/80 font-medium app-body-text">
            Software Engineering student currently pursuing a Bachelor's degree at Government Engineering College, Dahod. Interested in Artificial Intelligence, Machine Learning, Cloud Computing, and Full Stack Development. I enjoy building practical software solutions that combine engineering principles with real-world problem solving.
          </p>
        </motion.div>

        {/* Current Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Current Technical Interests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InterestCard title="AI Agents" desc="Developing autonomous reasoning workflows and integration pipelines." icon={Cpu} />
            <InterestCard title="Machine Learning" desc="Training classifier networks and optimizing inference operations." icon={Activity} />
            <InterestCard title="Developer Experience" desc="Building high-fidelity Sandboxes and code visualizing tools." icon={Code2} />
            <InterestCard title="Cloud Computing" desc="Orchestrating serverless runtimes and real-time database synchronizations." icon={Layers} />
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-muted-foreground leading-relaxed flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-pulse" />
            <span>Currently exploring <strong>Modern Web Applications</strong> built with React 19, Next.js 16, and Tailwind CSS 4.</span>
          </div>
        </motion.div>

        {/* Social connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Connect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SocialLink icon={Github} label="GitHub" href="https://github.com/PREMRAJESH" username="@PREMRAJESH" />
            <SocialLink icon={Linkedin} label="LinkedIn" href="https://www.linkedin.com/in/gecdhd-comp-prem-sargara/" username="in/gecdhd-comp-prem-sargara" />
            <SocialLink icon={Mail} label="Email" href="mailto:sargarapremrajesh@gmail.com" username="sargarapremrajesh@gmail.com" />
            <SocialLink icon={Code2} label="LeetCode" href="https://leetcode.com/u/Sargara_Prem/" username="u/Sargara_Prem" />
          </div>
        </motion.div>

      </div>
    </div>
  )
}

function InterestCard({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-primary">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">{desc}</p>
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
      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.05] transition-all group"
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
