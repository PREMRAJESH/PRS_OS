'use client'

import { motion } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import {
  Activity,
  Folder,
  User,
  ExternalLink,
  Brain,
  Cloud,
  BookOpen,
  Code2,
  Heart,
  Calendar,
  Layers,
  Github,
  Linkedin,
  Mail,
  ChevronRight,
  Briefcase,
} from 'lucide-react'

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  },
}

export function ActiveWorkspace() {
  const { windows, openWindow } = useOSStore()
  const hasActiveWindows = windows.filter(w => !w.isMinimized).length > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: hasActiveWindows ? 0.08 : 1,
        scale: hasActiveWindows ? 0.97 : 1,
        filter: hasActiveWindows ? 'blur(6px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="absolute inset-0 overflow-y-auto pb-32 custom-scrollbar selection:bg-primary/20 font-sans"
    >
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="p-6 md:p-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ─── Left / Center Column (Hero, Projects, About) ─── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ── Hero Panel ── */}
            <motion.div 
              variants={stagger.item} 
              className="p-6 rounded-2xl bg-[#0c0d12]/50 backdrop-blur-md border border-white/[0.03] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            >
              {/* Background accent glow */}
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10 group-hover:bg-primary/10 transition-colors duration-500" />
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#2dd4bf]/70 font-mono">SYSTEM ACTIVE</span>
                </div>
                
                <div className="space-y-1">
                  <h1 className="text-4xl font-black text-white tracking-tight leading-none hero-title">
                    Prem <span className="text-[#38bdf8]">Rajesh</span>
                  </h1>
                  <h2 className="text-sm font-bold text-[#38bdf8] tracking-wide mt-1.5 hero-subtitle">
                    Software Engineering Student
                  </h2>
                  <p className="text-[10px] text-muted-foreground/60 font-mono flex items-center gap-1.5 pt-0.5">
                    <span>AI Developer</span>
                    <span className="text-primary/40">•</span>
                    <span>Full Stack Developer</span>
                    <span className="text-primary/40">•</span>
                    <span>ML Enthusiast</span>
                  </p>
                </div>

                <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-md app-body-text">
                  Passionate about building intelligent systems and exceptional digital experiences. I love turning ideas into real-world products that make an impact.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <motion.button
                    onClick={() => openWindow('projects')}
                    whileHover={{ scale: 1.02, y: -0.5 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-[#14b8a6] hover:bg-[#0d9488] text-white text-[11px] font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-lg shadow-[#14b8a6]/10"
                  >
                    Explore Projects <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                  <motion.button
                    onClick={() => openWindow('resume')}
                    whileHover={{ scale: 1.02, y: -0.5 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-foreground/80 hover:text-white text-[11px] font-semibold transition-all flex items-center gap-1.5"
                  >
                    Download Resume
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Right: Mock Code Sandbox Window */}
              <div className="w-full md:w-72 shrink-0 bg-[#06070a]/90 rounded-xl border border-white/[0.04] p-4 font-mono text-[9.5px] leading-relaxed text-zinc-400 shadow-2xl relative overflow-hidden select-text">
                <div className="flex items-center gap-1.5 pb-2.5 border-b border-white/[0.03] mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  <span className="text-[8px] text-zinc-600 ml-1.5">developer.js</span>
                </div>
                <pre className="space-y-0.5 text-[9px]">
                  <div><span className="text-[#f472b6]">const</span> developer = &#123;</div>
                  <div>  name: <span className="text-[#34d399]">"Prem Rajesh"</span>,</div>
                  <div>  role: <span className="text-[#34d399]">"Software Engineering Student"</span>,</div>
                  <div>  interests: [</div>
                  <div>    <span className="text-[#34d399]">"Artificial Intelligence"</span>,</div>
                  <div>    <span className="text-[#34d399]">"Machine Learning"</span>,</div>
                  <div>    <span className="text-[#34d399]">"Full Stack Development"</span></div>
                  <div>  ],</div>
                  <div>  currentlyLearning: [</div>
                  <div>    <span className="text-[#34d399]">"Cloud Computing"</span>,</div>
                  <div>    <span className="text-[#34d399]">"Machine Learning"</span>,</div>
                  <div>    <span className="text-[#34d399]">"Modern Web Development"</span></div>
                  <div>  ],</div>
                  <div>  building: [</div>
                  <div>    <span className="text-[#34d399]">"NeuroScan AI"</span>,</div>
                  <div>    <span className="text-[#34d399]">"StudyFlow"</span>,</div>
                  <div>    <span className="text-[#34d399]">"Nimbus X"</span>,</div>
                  <div>    <span className="text-[#34d399]">"CodeViz"</span></div>
                  <div>  ]</div>
                  <div>&#125;;</div>
                </pre>
              </div>
            </motion.div>

            {/* ── Featured Projects ── */}
            <motion.div variants={stagger.item} className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-primary/80" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">FEATURED PROJECTS</span>
                </div>
                <button 
                  onClick={() => openWindow('projects')}
                  className="text-[10px] font-bold tracking-wider text-muted-foreground/50 hover:text-primary transition-colors flex items-center gap-1"
                >
                  View All Projects <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* 2x2 Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Project 1: NeuroScan AI */}
                <ProjectCard 
                  id="neuroscan"
                  title="NeuroScan AI"
                  badge="AI / ML"
                  badgeColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  desc="Brain Tumor Detection System"
                  icon={Brain}
                  iconColor="text-emerald-400 bg-emerald-400/10 shadow-[0_0_20px_rgba(52,211,153,0.15)] border-emerald-400/20"
                  tags={['TensorFlow + ONNX', '~90% Model Accuracy']}
                />

                {/* Project 2: Nimbus X */}
                <ProjectCard 
                  id="nimbusx"
                  title="Nimbus X"
                  badge="Cloud"
                  badgeColor="text-sky-400 bg-sky-400/10 border-sky-400/20"
                  desc="Cloud Storage Platform"
                  icon={Cloud}
                  iconColor="text-sky-400 bg-sky-400/10 shadow-[0_0_20px_rgba(56,189,248,0.15)] border-sky-400/20"
                  tags={['Intelligent File Organization', 'Modern Web Architecture']}
                />

                {/* Project 3: StudyFlow */}
                <ProjectCard 
                  id="studyflow"
                  title="StudyFlow"
                  badge="Productivity"
                  badgeColor="text-violet-400 bg-violet-400/10 border-violet-400/20"
                  desc="AI-Powered Study Planner"
                  icon={BookOpen}
                  iconColor="text-violet-400 bg-violet-400/10 shadow-[0_0_20px_rgba(167,139,250,0.15)] border-violet-400/20"
                  tags={['Adaptive Scheduling', 'Gemini Integration']}
                />

                {/* Project 4: CodeViz */}
                <ProjectCard 
                  id="codeviz"
                  title="CodeViz"
                  badge="Developer Tool"
                  badgeColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  desc="Code & Algorithm Visualization Platform"
                  icon={Code2}
                  iconColor="text-emerald-400 bg-emerald-400/10 shadow-[0_0_20px_rgba(52,211,153,0.15)] border-emerald-400/20"
                  tags={['Interactive Learning Experience', 'Developer Education Tool']}
                />

              </div>
            </motion.div>

            {/* ── About Me ── */}
            <motion.div variants={stagger.item} className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <User className="w-4 h-4 text-primary/80" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">ABOUT ME</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#0c0d12]/50 backdrop-blur-md border border-white/[0.03] space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <p className="text-xs text-muted-foreground/80 leading-relaxed app-body-text">
                  Software Engineering student currently pursuing a Bachelor's degree at Government Engineering College, Dahod. Interested in Artificial Intelligence, Machine Learning, Cloud Computing, and Full Stack Development. I enjoy building practical software solutions that combine engineering principles with real-world problem solving.
                </p>
                
                {/* 4 Stat Cards Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatItem value="4+" label="Projects Built" icon={Code2} iconBg="bg-blue-500/10 text-blue-400 border-blue-500/20" />
                  <StatItem value="Since 2021" label="Coding Journey" icon={Calendar} iconBg="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" />
                  <StatItem value="1" label="Internship" icon={Briefcase} iconBg="bg-purple-500/10 text-purple-400 border-purple-500/20" />
                  <StatItem value="AI • Full Stack • ML" label="Current Focus" icon={Layers} iconBg="bg-red-500/10 text-red-400 border-red-500/20" />
                </div>
              </div>
            </motion.div>

          </div>

          {/* ─── Right Sidebar Column (Activity, Tech Stack, Quick Links) ─── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ── Key Milestones ── */}
            <motion.div variants={stagger.item} className="p-5 rounded-2xl bg-[#0c0d12]/50 backdrop-blur-md border border-white/[0.03] space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary/80" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">KEY MILESTONES</span>
              </div>

              {/* Activity Dot list representing real milestones */}
              <div className="space-y-4">
                <ActivityItem title="Built Nimbus X & CodeViz" time="2026" dotColor="bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <ActivityItem title="Built NeuroScan AI & StudyFlow" time="2025" dotColor="bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                <ActivityItem title="Started B.E. at GEC Dahod" time="2024" dotColor="bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                <ActivityItem title="Completed Diploma at Govt. Polytechnic" time="2024" dotColor="bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <ActivityItem title="Completed Web Dev Internship at BrainyBeam" time="2022" dotColor="bg-purple-400 shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
              </div>

              <button 
                onClick={() => openWindow('timeline')}
                className="w-full py-2 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] rounded-xl text-[10px] font-bold text-muted-foreground/60 hover:text-white transition-all text-center flex items-center justify-center gap-1.5"
              >
                View Full Timeline <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* ── Tech Stack ── */}
            <motion.div variants={stagger.item} className="p-5 rounded-2xl bg-[#0c0d12]/50 backdrop-blur-md border border-white/[0.03] space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary/80" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">TECH STACK</span>
              </div>

              <div className="space-y-3.5 select-text">
                <StackCategory title="Languages" items={['Python', 'JavaScript', 'C++', 'SQL']} />
                <StackCategory title="Frontend" items={['React', 'Next.js', 'Tailwind CSS']} />
                <StackCategory title="Backend" items={['Node.js', 'FastAPI', 'Firebase']} />
                <StackCategory title="AI / ML" items={['TensorFlow', 'PyTorch', 'Gemini API']} />
                <StackCategory title="Tools" items={['Git', 'Docker', 'VS Code', 'Vercel']} />
              </div>

              <button 
                onClick={() => openWindow('skills')}
                className="w-full py-2 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] rounded-xl text-[10px] font-bold text-muted-foreground/60 hover:text-white transition-all text-center flex items-center justify-center gap-1.5"
              >
                View Full Stack <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* ── Quick Links ── */}
            <motion.div variants={stagger.item} className="p-5 rounded-2xl bg-[#0c0d12]/50 backdrop-blur-md border border-white/[0.03] space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary/80" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">QUICK LINKS</span>
              </div>

              <div className="space-y-2 select-text">
                <QuickLinkItem label="GitHub" url="github.com/PREMRAJESH" href="https://github.com/PREMRAJESH" icon={Github} />
                <QuickLinkItem label="LinkedIn" url="linkedin.com/in/gecdhd-comp-prem-sargara" href="https://www.linkedin.com/in/gecdhd-comp-prem-sargara/" icon={Linkedin} />
                <QuickLinkItem label="Email" url="sargarapremrajesh@gmail.com" href="mailto:sargarapremrajesh@gmail.com" icon={Mail} />
                <QuickLinkItem label="LeetCode" url="leetcode.com/u/Sargara_Prem" href="https://leetcode.com/u/Sargara_Prem/" icon={Code2} />
              </div>
            </motion.div>

          </div>

        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Helper Sub-components ───────────────────────────── */

function ProjectCard({
  id,
  title,
  badge,
  badgeColor,
  desc,
  icon: Icon,
  iconColor,
  tags
}: {
  id: string
  title: string
  badge: string
  badgeColor: string
  desc: string
  icon: any
  iconColor: string
  tags: string[]
}) {
  const { openWindow } = useOSStore()

  return (
    <div className="p-4 rounded-xl bg-[#06070a]/50 border border-white/[0.03] flex flex-col justify-between gap-4 group hover:border-[#14b8a6]/30 hover:bg-[#06070a]/80 transition-all duration-300">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {/* Project icon with glow border */}
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={`text-[8.5px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wide font-mono ${badgeColor}`}>
            {badge}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors project-title">
            {title}
          </h3>
          <p className="text-[11px] text-muted-foreground/85 leading-relaxed project-desc">
            {desc}
          </p>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span key={tag} className="text-[9px] font-mono text-muted-foreground/60 bg-white/5 border border-white/[0.03] px-2 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.03] text-[10px] font-bold text-muted-foreground/50">
        <button 
          onClick={() => openWindow('projects', undefined, id)}
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          View Project <ChevronRight className="w-3 h-3" />
        </button>
        <a 
          href={`https://github.com/PREMRAJESH/${id === 'nimbusx' ? 'NimbusX' : id === 'neuroscan' ? 'NeuroScan' : id === 'studyflow' ? 'StudyFlow' : 'CodeViz'}`}
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-primary transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}

function StatItem({
  value,
  label,
  icon: Icon,
  iconBg
}: {
  value: string
  label: string
  icon: any
  iconBg: string
}) {
  return (
    <div className="p-3.5 rounded-xl bg-[#06070a]/40 border border-white/[0.02] flex items-center justify-between gap-2">
      <div className="space-y-0.5">
        <div className="text-base font-black text-white leading-none stats-value">{value}</div>
        <div className="text-[9px] font-medium text-muted-foreground/60 leading-tight stats-label">{label}</div>
      </div>
      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
    </div>
  )
}

function ActivityItem({
  title,
  time,
  dotColor
}: {
  title: string
  time: string
  dotColor: string
}) {
  return (
    <div className="flex items-start gap-2.5 text-[10px] group">
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${dotColor}`} />
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="text-muted-foreground/80 leading-normal group-hover:text-white transition-colors">{title}</div>
        <div className="text-muted-foreground/35 font-mono">{time}</div>
      </div>
    </div>
  )
}

function StackCategory({
  title,
  items
}: {
  title: string
  items: string[]
}) {
  return (
    <div className="space-y-1.5 text-[10px]">
      <span className="block text-muted-foreground/45 font-bold uppercase tracking-wider text-[8px]">{title}</span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="px-2 py-0.5 rounded-md bg-[#06070a]/50 text-muted-foreground/80 border border-white/[0.03] font-mono">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function QuickLinkItem({
  label,
  url,
  href,
  icon: Icon
}: {
  label: string
  url: string
  href: string
  icon: any
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-2.5 rounded-xl bg-[#06070a]/40 border border-white/[0.02] hover:border-primary/20 hover:bg-white/[0.02] transition-all group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-white leading-none">{label}</div>
          <div className="text-[8.5px] text-muted-foreground/50 font-mono truncate mt-0.5">{url}</div>
        </div>
      </div>
      <svg className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}
