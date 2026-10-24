'use client'

import { motion, type Variants } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import {
  ArrowUpRight,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Download,
  MapPin,
  GraduationCap,
  Sparkles,
  Code2,
} from 'lucide-react'

const stagger: Variants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.08 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },
}

const selectedWork = [
  {
    id: 'neuroscan',
    index: '01',
    title: 'NeuroScan AI',
    discipline: 'AI / ML',
    desc: 'Brain tumor detection from MRI scans, running a 35 MB ONNX model on serverless infrastructure.',
    metric: '94.05% validation accuracy',
    tags: ['Python', 'ONNX', 'Flask'],
  },
  {
    id: 'studyflow',
    index: '02',
    title: 'StudyFlow',
    discipline: 'Full stack / AI',
    desc: 'An adaptive study planner that turns a syllabus PDF into a working schedule in under a minute.',
    metric: 'Onboarding cut from 20 min to 45 s',
    tags: ['Next.js', 'Gemini', 'Supabase'],
  },
  {
    id: 'nimbusx',
    index: '03',
    title: 'Nimbus X',
    discipline: 'Mobile',
    desc: 'A real-time Android messaging app with private and group chats, media sharing and offline storage.',
    metric: 'Cloud + local storage toggle',
    tags: ['React Native', 'TypeScript', 'Redux'],
  },
  {
    id: 'codeviz',
    index: '04',
    title: 'CodeViz',
    discipline: 'Developer tooling',
    desc: 'A step-through visualiser for algorithms and data structures, built on a locked-down client sandbox.',
    metric: '100% client-side isolation',
    tags: ['Monaco', 'D3.js', 'TypeScript'],
  },
]

const milestones = [
  { year: '2026', text: 'AI Automation intern, CSRBOX × IBM SkillsBuild × AICTE' },
  { year: '2026', text: 'Shipped Nimbus X and CodeViz' },
  { year: '2025', text: 'Built NeuroScan AI and StudyFlow' },
  { year: '2024', text: 'Started B.E. Computer Engineering, GEC Dahod' },
  { year: '2024', text: 'Diploma completed with CPI 8.33' },
]

const toolkit = [
  { group: 'Languages', items: ['Python', 'TypeScript', 'Java', 'C++'] },
  { group: 'Interface', items: ['React', 'Next.js', 'Tailwind'] },
  { group: 'Systems', items: ['Node.js', 'FastAPI', 'Firebase', 'Supabase'] },
  { group: 'Intelligence', items: ['TensorFlow', 'PyTorch', 'Gemini'] },
]

const stats = [
  { value: '05', label: 'Projects shipped' },
  { value: '02', label: 'Internships' },
  { value: '8.33', label: 'Diploma CPI' },
  { value: '2027', label: 'Graduating' },
]

const elsewhere = [
  { label: 'GitHub', handle: '@PREMRAJESH', href: 'https://github.com/PREMRAJESH', icon: Github },
  { label: 'LinkedIn', handle: 'in/prem-sargara', href: 'https://www.linkedin.com/in/gecdhd-comp-prem-sargara/', icon: Linkedin },
  { label: 'Email', handle: 'sargarapremrajesh@gmail.com', href: 'mailto:sargarapremrajesh@gmail.com', icon: Mail },
  { label: 'LeetCode', handle: 'u/Sargara_Prem', href: 'https://leetcode.com/u/Sargara_Prem/', icon: Code2 },
]

export function ActiveWorkspace() {
  const { windows, openWindow } = useOSStore()
  const hasActiveWindows = windows.filter(w => !w.isMinimized).length > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: hasActiveWindows ? 0.14 : 1,
        scale: hasActiveWindows ? 0.985 : 1,
        filter: hasActiveWindows ? 'blur(4px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden pb-32 custom-scrollbar font-sans"
      aria-hidden={hasActiveWindows}
    >
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="px-5 sm:px-8 md:px-12 pt-8 md:pt-12 pb-16 max-w-[1180px] mx-auto"
      >
        {/* ── Hero ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-9 lg:gap-14 items-end">
          <motion.div variants={stagger.item} className="lg:col-span-7 xl:col-span-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-mono tracking-[0.1em] uppercase text-muted-foreground/65">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Available for internships
              </span>
              <span className="hidden sm:block h-3 w-px bg-hairline" />
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Gujarat, India
              </span>
            </div>

            <h1 className="font-display text-[clamp(3.6rem,8.5vw,6.75rem)] leading-[0.88] tracking-[-0.025em] text-foreground mt-6">
              Prem<br />
              <span className="text-foreground/90">Rajesh</span>
            </h1>

            <p className="mt-6 max-w-xl text-[13.5px] leading-[1.75] text-muted-foreground/85">
              Software engineering student building AI systems, full-stack products and
              developer tools. I care about the small details that make software feel
              considered — fast, legible, and quietly useful.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-7">
              <motion.button
                onClick={() => openWindow('projects')}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors"
              >
                Browse projects
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>

              <motion.a
                href="/Resume.pdf"
                download="P.R.S_Resume.pdf"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-hairline-strong text-foreground/75 hover:text-foreground hover:bg-foreground/[0.035] text-[12px] font-medium transition-colors"
              >
                Résumé
                <Download className="w-3.5 h-3.5" />
              </motion.a>

              <button
                onClick={() => openWindow('quick-links')}
                className="inline-flex items-center gap-1.5 h-9 px-2 text-[12px] text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                Get in touch
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-9 pt-5 border-t border-hairline flex flex-wrap gap-x-8 gap-y-2 text-[11px] text-muted-foreground/60">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-muted-foreground/45" />
                B.E. Computer Engineering, GEC Dahod
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground/45" />
                AI, machine learning & product engineering
              </span>
            </div>
          </motion.div>

          {/* Portrait */}
          <motion.div variants={stagger.item} className="lg:col-span-5 xl:col-span-4">
            <div className="relative max-w-[340px] mx-auto lg:mx-0 lg:ml-auto">
              <div className="absolute -inset-2.5 rounded-[18px] border border-hairline/80 pointer-events-none" />
              <div className="relative aspect-[4/5] rounded-[14px] overflow-hidden bg-surface ring-1 ring-hairline-strong">
                <img
                  src="/avatar.jpg"
                  alt="Portrait of Prem Rajesh"
                  width={1254}
                  height={1254}
                  className="w-full h-full object-cover object-top grayscale-[0.12] contrast-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#17130f]/80 via-[#17130f]/10 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-[19px] leading-none text-[#f4ede2]">Prem Rajesh</p>
                    <p className="mt-1 text-[9px] font-mono tracking-[0.13em] uppercase text-[#e9dfd0]/60">
                      Portfolio, 2026
                    </p>
                  </div>
                  <span className="shrink-0 flex items-center gap-1.5 text-[9px] font-mono tracking-[0.1em] uppercase text-[#e9dfd0]/75">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    Open
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Selected work ── */}
        <motion.section variants={stagger.item} className="mt-16 md:mt-24">
          <div className="flex items-end justify-between gap-4 pb-3.5 border-b border-hairline-strong">
            <div className="flex items-baseline gap-3">
              <h2 className="text-eyebrow">Selected work</h2>
              <span className="text-[10px] font-mono text-muted-foreground/40">2025 — 2026</span>
            </div>
            <button
              onClick={() => openWindow('projects')}
              className="group inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/65 hover:text-foreground transition-colors"
            >
              All projects
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>

          <div>
            {selectedWork.map((project) => (
              <button
                key={project.id}
                onClick={() => openWindow('projects', undefined, project.id)}
                className="group w-full text-left grid grid-cols-[28px_1fr_auto] sm:grid-cols-[34px_minmax(0,1.05fr)_minmax(0,1.2fr)_auto] gap-x-4 gap-y-1 items-baseline py-5 border-b border-hairline hover:bg-foreground/[0.022] transition-colors px-2 -mx-2 rounded-sm"
              >
                <span className="font-mono text-[10px] text-muted-foreground/35 group-hover:text-primary/70 transition-colors">
                  {project.index}
                </span>

                <div className="min-w-0">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <h3 className="text-[17px] leading-tight tracking-[-0.01em] text-foreground/90 group-hover:text-foreground transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-[9px] font-mono tracking-[0.1em] uppercase text-muted-foreground/40">
                      {project.discipline}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/70 max-w-md sm:hidden">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5 sm:hidden">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[9.5px] font-mono text-muted-foreground/55 border border-hairline px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden sm:block min-w-0">
                  <p className="text-[12px] leading-relaxed text-muted-foreground/70 max-w-md">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
                    {project.tags.map((tag, i) => (
                      <span key={tag} className="text-[9.5px] font-mono text-muted-foreground/50">
                        {tag}{i < project.tags.length - 1 && <span className="ml-2 text-muted-foreground/20">·</span>}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-end">
                  <span className="hidden xl:block text-[10px] font-mono text-muted-foreground/45 text-right max-w-[170px] leading-snug">
                    {project.metric}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ── About + context ── */}
        <section className="mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <motion.div variants={stagger.item} className="lg:col-span-7">
            <h2 className="text-eyebrow pb-3.5 border-b border-hairline-strong">About</h2>
            <p className="mt-5 text-[13.5px] leading-[1.8] text-muted-foreground/85 max-w-xl">
              I&apos;m in my third year of Computer Engineering at Government Engineering
              College, Dahod, after a diploma in Computer Software Engineering. My work sits
              between machine learning and product engineering: training models, then making
              them feel simple enough to actually use.
            </p>
            <p className="mt-4 text-[13.5px] leading-[1.8] text-muted-foreground/70 max-w-xl">
              Right now I&apos;m interning in AI automation, and spending the rest of my time
              on developer tooling and interfaces built with React, Next.js and TypeScript.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
              {stats.map(stat => (
                <div key={stat.label} className="border-l border-hairline pl-3.5">
                  <div className="font-display text-[26px] leading-none text-foreground/90 tabular">{stat.value}</div>
                  <div className="mt-1.5 text-[9.5px] font-mono tracking-[0.08em] uppercase text-muted-foreground/50">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.aside variants={stagger.item} className="lg:col-span-5 space-y-8 lg:border-l lg:border-hairline lg:pl-10">
            {/* Now */}
            <div>
              <h2 className="text-eyebrow">Now</h2>
              <div className="mt-3.5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <p className="text-[12px] leading-relaxed text-muted-foreground/80">
                    AI Automation & Intelligent Solutions intern at{' '}
                    <span className="text-foreground/85">CSRBOX × IBM SkillsBuild × AICTE</span>
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-foreground/25 shrink-0" />
                  <p className="text-[12px] leading-relaxed text-muted-foreground/80">
                    Exploring agentic workflows, retrieval pipelines and small, sharp developer tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-eyebrow">Milestones</h2>
                <button
                  onClick={() => openWindow('timeline')}
                  className="text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  Full timeline
                </button>
              </div>
              <ol className="mt-3.5 space-y-2.5">
                {milestones.map((m) => (
                  <li key={`${m.year}-${m.text}`} className="grid grid-cols-[38px_1fr] gap-3 items-baseline">
                    <span className="font-mono text-[10px] text-muted-foreground/35 tabular">{m.year}</span>
                    <span className="text-[11.5px] leading-snug text-muted-foreground/75">{m.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Toolkit */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-eyebrow">Toolkit</h2>
                <button
                  onClick={() => openWindow('skills')}
                  className="text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  Details
                </button>
              </div>
              <div className="mt-3.5 space-y-2">
                {toolkit.map(group => (
                  <div key={group.group} className="grid grid-cols-[72px_1fr] gap-2 items-baseline">
                    <span className="text-[10px] text-muted-foreground/40">{group.group}</span>
                    <span className="text-[11px] text-muted-foreground/75 leading-relaxed">
                      {group.items.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Elsewhere */}
            <div>
              <h2 className="text-eyebrow">Elsewhere</h2>
              <div className="mt-2.5">
                {elsewhere.map(link => {
                  const Icon = link.icon
                  const isEmail = link.href.startsWith('mailto:')
                  return (
                    <a
                      key={link.label}
                      href={isEmail ? undefined : link.href}
                      target={isEmail ? undefined : '_blank'}
                      rel={isEmail ? undefined : 'noopener noreferrer'}
                      onClick={isEmail ? (e) => { e.preventDefault(); openWindow('quick-links') } : undefined}
                      className="group flex items-center gap-3 py-2 border-b border-hairline last:border-b-0 text-[11.5px] hover:text-foreground transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" strokeWidth={1.7} />
                      <span className="text-muted-foreground/80 group-hover:text-foreground transition-colors w-16 shrink-0">{link.label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/45 truncate flex-1">{link.handle}</span>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground/25 group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.aside>
        </section>

        <footer className="mt-16 md:mt-20 pt-4 border-t border-hairline flex flex-wrap items-center justify-between gap-3 text-[9.5px] font-mono tracking-[0.08em] uppercase text-muted-foreground/35">
          <span>PRS—OS · Built with Next.js, Tailwind and Framer Motion</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-accent/80" />
            Open to opportunities
          </span>
        </footer>
      </motion.div>
    </motion.div>
  )
}
