'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ZoomIn, ZoomOut, Download, Printer, ChevronLeft, ChevronRight,
  Search, Menu, LayoutGrid, FileText, Check, Expand
} from 'lucide-react'

const resumeData = {
  header: {
    name: 'Prem R.',
    title: 'Full-Stack Developer & AI/ML Engineer',
    email: 'developer@prs.dev',
    website: 'prs.dev',
    location: 'San Francisco, CA',
  },
  summary: 'Passionate software engineer with 5+ years of experience building scalable, high-performance applications and AI-powered solutions. Specialized in React, Node.js, and cloud architecture with a proven track record of delivering production-ready systems.',
  experience: [
    {
      company: 'NimbusX Technologies',
      role: 'Lead Full-Stack Engineer',
      period: '2023 - Present',
      points: [
        'Architected and deployed a real-time messaging platform serving 50k+ daily active users.',
        'Implemented WebRTC voice/video calling infrastructure reducing latency by 40%.',
        'Led migration from monolith to Kubernetes microservices, achieving 99.99% uptime.',
      ]
    },
    {
      company: 'BrainTumorAI Solutions',
      role: 'Machine Learning Engineer',
      period: '2021 - 2023',
      points: [
        'Developed a deep learning CNN model for medical imaging analysis achieving 97.3% accuracy.',
        'Optimized model inference times by 60% using TensorRT and custom CUDA kernels.',
        'Built a FastAPI-based REST API for seamless integration with existing hospital workflows.',
      ]
    },
    {
      company: 'SmartStudy Platform',
      role: 'Frontend Developer',
      period: '2019 - 2021',
      points: [
        'Built adaptive AI scheduling interfaces using React and Framer Motion.',
        'Improved core web vitals by 35% through dynamic imports and state optimization.',
        'Integrated OpenAI API for automated study plan generation.',
      ]
    }
  ],
  education: [
    { degree: 'M.S. Computer Science', school: 'Stanford University', year: '2019', details: 'Focus in Artificial Intelligence. GPA: 3.9' },
    { degree: 'B.S. Software Engineering', school: 'UC Berkeley', year: '2017', details: 'Graduated with Honors. Minor in Mathematics.' }
  ],
  skills: [
    { category: 'Frontend', items: 'React, Next.js, TypeScript, Tailwind CSS, Zustand, Framer Motion' },
    { category: 'Backend', items: 'Node.js, Python, Go, Express, FastAPI, gRPC' },
    { category: 'Database', items: 'PostgreSQL, MongoDB, Redis, Firebase Firestore, Supabase' },
    { category: 'Cloud & DevOps', items: 'AWS, GCP, Docker, Kubernetes, Vercel, CI/CD pipelines' },
    { category: 'AI & ML', items: 'TensorFlow, PyTorch, OpenAI API, LangChain, Computer Vision' }
  ]
}

export function ResumeViewer() {
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const totalPages = 2
  
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom(z => Math.min(200, z + 10))
  const handleZoomOut = () => setZoom(z => Math.max(50, z - 10))
  
  const handleDownload = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // In a real app, this would trigger a PDF download
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setPage(p => Math.min(totalPages, p + 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setPage(p => Math.max(1, p - 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-foreground font-sans overflow-hidden">
      
      {/* ─── Top Toolbar (Acrobat style) ─── */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-border/40 bg-[#252526] shrink-0 z-10">
        
        {/* Left: Sidebar toggle & Page controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-md transition-colors ${sidebarOpen ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-muted-foreground'}`}
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
          
          <div className="w-px h-5 bg-border/40 mx-1" />
          
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-xs bg-[#3c3c3c] border border-border/50 px-2 py-0.5 rounded text-foreground min-w-[24px] text-center">{page}</span>
            <span className="text-xs text-muted-foreground">/ {totalPages}</span>
          </div>
          
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find in document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#3c3c3c] border border-border/30 rounded-md py-1 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Right: Zoom & Actions */}
        <div className="flex items-center gap-1.5">
          <button onClick={handleZoomOut} className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-12 text-center text-xs text-muted-foreground select-none">
            {zoom}%
          </div>
          <button onClick={handleZoomIn} className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <div className="w-px h-5 bg-border/40 mx-2" />
          
          <button className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground transition-colors" title="Print">
            <Printer className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 ml-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            {copied ? 'Downloaded' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar (Thumbnails) */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-border/40 bg-[#252526] flex flex-col shrink-0 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border/20 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Thumbnails</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                {[1, 2].map((p) => (
                  <div key={p} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => setPage(p)}
                      className={`relative w-full aspect-[8.5/11] bg-white rounded-sm shadow-sm border-2 transition-all overflow-hidden ${page === p ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-[#252526]' : 'border-transparent hover:border-muted-foreground/30'}`}
                    >
                      {/* Fake tiny resume render for thumbnail */}
                      <div className="absolute inset-0 p-3 scale-[0.3] origin-top-left opacity-60">
                        <div className="h-4 w-3/4 bg-gray-800 mb-2" />
                        <div className="h-2 w-1/2 bg-gray-400 mb-6" />
                        <div className="h-2 w-full bg-gray-300 mb-1" />
                        <div className="h-2 w-5/6 bg-gray-300 mb-4" />
                        <div className="h-3 w-1/3 bg-gray-800 mb-2" />
                        <div className="h-2 w-full bg-gray-300 mb-1" />
                        <div className="h-2 w-4/5 bg-gray-300" />
                      </div>
                    </button>
                    <span className="text-[10px] text-muted-foreground">{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Viewer Canvas */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto bg-[#1e1e1e] p-8 flex justify-center custom-scrollbar relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white text-[#111] shadow-[0_0_40px_rgba(0,0,0,0.5)] relative origin-top"
              style={{
                width: `${8.5 * 96 * (zoom / 100)}px`,
                height: `${11 * 96 * (zoom / 100)}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                marginBottom: `${(11 * 96 * (zoom / 100)) - (11 * 96)}px` // Fix scroll height jumping
              }}
            >
              {/* Document Content */}
              {page === 1 ? <PageOne /> : <PageTwo />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ─── Document Pages (Designed like a premium print PDF) ─── */

function PageOne() {
  return (
    <div className="p-[1in] h-full flex flex-col font-serif text-[14px] leading-relaxed">
      {/* Header */}
      <header className="border-b-[3px] border-[#222] pb-6 mb-8 text-center">
        <h1 className="text-[32px] font-bold text-[#111] tracking-tight uppercase mb-2">
          {resumeData.header.name}
        </h1>
        <p className="text-[16px] text-[#444] font-medium tracking-wide uppercase mb-3">
          {resumeData.header.title}
        </p>
        <div className="flex items-center justify-center gap-4 text-[12px] text-[#555] font-sans">
          <span>{resumeData.header.email}</span>
          <span className="text-[#999]">•</span>
          <span>{resumeData.header.website}</span>
          <span className="text-[#999]">•</span>
          <span>{resumeData.header.location}</span>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-[14px] font-bold text-[#111] uppercase tracking-[0.1em] mb-3 border-b border-[#ddd] pb-1">
          Professional Summary
        </h2>
        <p className="text-[#333] text-justify leading-relaxed">
          {resumeData.summary}
        </p>
      </section>

      {/* Experience */}
      <section className="flex-1">
        <h2 className="text-[14px] font-bold text-[#111] uppercase tracking-[0.1em] mb-4 border-b border-[#ddd] pb-1">
          Professional Experience
        </h2>
        <div className="space-y-6">
          {resumeData.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-bold text-[#222] text-[15px]">{exp.company}</h3>
                <span className="text-[#555] text-[12px] font-sans font-medium">{exp.period}</span>
              </div>
              <p className="italic text-[#444] mb-2">{exp.role}</p>
              <ul className="list-none pl-1 space-y-1.5">
                {exp.points.map((pt, j) => (
                  <li key={j} className="relative pl-4 text-[#333]">
                    <span className="absolute left-0 top-0.5 text-[#888] text-[10px]">■</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function PageTwo() {
  return (
    <div className="p-[1in] h-full flex flex-col font-serif text-[14px] leading-relaxed">
      {/* Education */}
      <section className="mb-8">
        <h2 className="text-[14px] font-bold text-[#111] uppercase tracking-[0.1em] mb-4 border-b border-[#ddd] pb-1">
          Education
        </h2>
        <div className="space-y-5">
          {resumeData.education.map((edu, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-[#222] text-[15px]">{edu.school}</h3>
                <span className="text-[#555] text-[12px] font-sans font-medium">{edu.year}</span>
              </div>
              <p className="italic text-[#444] mb-1">{edu.degree}</p>
              <p className="text-[#333]">{edu.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-[14px] font-bold text-[#111] uppercase tracking-[0.1em] mb-4 border-b border-[#ddd] pb-1">
          Technical Skills
        </h2>
        <div className="space-y-3 font-sans text-[13px]">
          {resumeData.skills.map((skill, i) => (
            <div key={i} className="flex items-start">
              <span className="w-36 font-bold text-[#222] shrink-0 pt-0.5">{skill.category}:</span>
              <span className="text-[#444] leading-relaxed">{skill.items}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
