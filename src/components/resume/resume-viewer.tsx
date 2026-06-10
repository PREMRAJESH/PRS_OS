'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ZoomIn, ZoomOut, Download, Printer, ChevronLeft, ChevronRight,
  Search, Menu, LayoutGrid, FileText, Check, Expand
} from 'lucide-react'

const resumeData = {
  header: {
    name: 'Prem Rajesh',
    title: 'Software Engineering Student',
    email: 'sargarapremrajesh@gmail.com',
    website: 'github.com/PREMRAJESH',
    location: 'Gujarat, India',
  },
  summary: 'Software Engineering student with a strong academic foundation in Computer Engineering. Experienced in building practical AI/ML models, real-world full-stack web platforms, and interactive developer tools. Passionate about applying analytical problem solving to build scalable and modern software applications.',
  experience: [
    {
      company: 'BrainyBeam Technologies Pvt. Ltd.',
      role: 'Web Development Intern',
      period: 'September 2022',
      points: [
        'Acquired hands-on experience in frontend layout implementations and web design systems.',
        'Assisted developers in verifying build code integrity across deployment environments.',
        'Developed clean, mobile-responsive page layouts using modern HTML/JS/CSS coordinates.'
      ]
    }
  ],
  education: [
    { 
      degree: 'Bachelor of Engineering in Computer Engineering', 
      school: 'Government Engineering College, Dahod', 
      year: '2024 - 2027', 
      details: 'Focusing on advanced algorithms, database systems, software engineering methodologies, and machine learning.' 
    },
    { 
      degree: 'Diploma in Computer Software Engineering', 
      school: 'Government Polytechnic, Dahod', 
      year: '2021 - 2024', 
      details: 'Graduated with a grade of 8.33 CPI. Core coursework in Object Oriented Programming, Data Structures, and Web Development.' 
    }
  ],
  skills: [
    { category: 'Programming Languages', items: 'Python, Java, C++, JavaScript' },
    { category: 'Frontend', items: 'React, Next.js, Tailwind CSS, Framer Motion' },
    { category: 'Backend', items: 'Node.js, FastAPI, Firebase, Express' },
    { category: 'AI / ML', items: 'TensorFlow, PyTorch, Gemini API, CNNs' },
    { category: 'Developer Tools', items: 'Git, GitHub, Docker, Vercel, VS Code' }
  ],
  projects: [
    { name: 'NeuroScan AI', desc: 'Brain tumor classification system using EfficientNetB0 backbone and ONNX Runtime CPU serverless serving. Achieved 94.05% accuracy.' },
    { name: 'StudyFlow', desc: 'AI-driven study schedule builder using Next.js App Router, Supabase database, and Google Gemini API for structured schema parsing.' },
    { name: 'Nimbus X', desc: 'AI-assisted cloud storage drive featuring automated file auto-tagging and semantic search vectors.' },
    { name: 'CodeViz', desc: 'Multi-language code execution and algorithm visualizer using Monaco Editor, Acorn parsing, and D3.js trees.' }
  ],
  certifications: [
    'AI & Machine Learning Specialization Certificate',
    'Advanced Web Development Stack Certification',
  ],
  achievements: [
    'Obtained 8.33 CPI in Diploma in Computer Software Engineering program.',
    'Engineered and hosted 4 high-fidelity, live AI/ML and full-stack projects.'
  ]
}

export function ResumeViewer() {
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  const totalPages = 2
  
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom(z => Math.min(200, z + 10))
  const handleZoomOut = () => setZoom(z => Math.max(50, z - 10))
  
  const handleDownload = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
    
    // Create direct printable page or simple document print trigger
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Resume - Prem Rajesh</title>
            <style>
              body { font-family: serif; line-height: 1.6; color: #111; padding: 20px; max-width: 800px; margin: 0 auto; }
              h1 { font-family: sans-serif; text-transform: uppercase; margin-bottom: 2px; text-align: center; }
              .title { font-family: sans-serif; text-transform: uppercase; font-weight: bold; text-align: center; color: #444; margin-bottom: 15px; }
              .contacts { text-align: center; font-size: 12px; font-family: sans-serif; margin-bottom: 25px; border-bottom: 2px solid #222; padding-bottom: 10px; }
              h2 { font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 2px; margin-top: 25px; }
              .item-header { display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px; }
              .item-role { font-style: italic; color: #444; }
              ul { margin-top: 5px; padding-left: 20px; }
              li { margin-bottom: 4px; }
              .skill-row { display: flex; margin-bottom: 6px; font-size: 13px; font-family: sans-serif; }
              .skill-cat { width: 150px; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>${resumeData.header.name}</h1>
            <div class="title">${resumeData.header.title}</div>
            <div class="contacts">
              ${resumeData.header.email} &bull; ${resumeData.header.website} &bull; ${resumeData.header.location}
            </div>
            
            <h2>Professional Summary</h2>
            <p>${resumeData.summary}</p>
            
            <h2>Education</h2>
            ${resumeData.education.map(edu => `
              <div>
                <div class="item-header">
                  <span>${edu.school}</span>
                  <span>${edu.year}</span>
                </div>
                <div class="item-role">${edu.degree}</div>
                <p style="margin: 3px 0 10px 0; font-size: 13.5px;">${edu.details}</p>
              </div>
            `).join('')}
            
            <h2>Experience</h2>
            ${resumeData.experience.map(exp => `
              <div>
                <div class="item-header">
                  <span>${exp.company}</span>
                  <span>${exp.period}</span>
                </div>
                <div class="item-role">${exp.role}</div>
                <ul>
                  ${exp.points.map(pt => `<li>${pt}</li>`).join('')}
                </ul>
              </div>
            `).join('')}

            <h2>Projects</h2>
            ${resumeData.projects.map(proj => `
              <p style="margin: 8px 0; font-size: 13.5px;"><strong>${proj.name}</strong>: ${proj.desc}</p>
            `).join('')}
            
            <h2>Technical Skills</h2>
            ${resumeData.skills.map(s => `
              <div class="skill-row">
                <div class="skill-cat">${s.category}:</div>
                <div>${s.items}</div>
              </div>
            `).join('')}

            <h2>Certifications</h2>
            <ul>
              ${resumeData.certifications.map(c => `<li>${c}</li>`).join('')}
            </ul>

            <h2>Achievements</h2>
            <ul>
              ${resumeData.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
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
    <div className="h-full flex flex-col bg-[#1e1e1e] text-foreground font-sans overflow-hidden select-none">
      
      {/* ─── Top Toolbar ─── */}
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
        <div className="flex-1 max-w-xs sm:max-w-sm mx-4">
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
          <div className="w-12 text-center text-xs text-muted-foreground select-none font-mono">
            {zoom}%
          </div>
          <button onClick={handleZoomIn} className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <div className="w-px h-5 bg-border/40 mx-2" />
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 ml-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-bold"
          >
            {downloaded ? <Check className="w-3.5 h-3.5 animate-pulse" /> : <Download className="w-3.5 h-3.5" />}
            {downloaded ? 'Opening PDF' : 'Download CV'}
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
              animate={{ width: 180, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-border/40 bg-[#252526] flex flex-col shrink-0 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border/20 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Thumbnails</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                {[1, 2].map((p) => (
                  <div key={p} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => setPage(p)}
                      className={`relative w-full aspect-[8.5/11] bg-white rounded-sm shadow-sm border-2 transition-all overflow-hidden ${page === p ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-[#252526]' : 'border-transparent hover:border-muted-foreground/30'}`}
                    >
                      {/* Thumbnail blueprint */}
                      <div className="absolute inset-0 p-3 scale-[0.25] origin-top-left opacity-65">
                        <div className="h-4 w-3/4 bg-gray-800 mb-2" />
                        <div className="h-2 w-1/2 bg-gray-400 mb-6" />
                        <div className="h-2 w-full bg-gray-300 mb-1" />
                        <div className="h-2 w-5/6 bg-gray-300 mb-4" />
                        <div className="h-3 w-1/3 bg-gray-800 mb-2" />
                        <div className="h-2 w-full bg-gray-300 mb-1" />
                      </div>
                    </button>
                    <span className="text-[10px] text-muted-foreground font-mono">{p}</span>
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
              className="bg-white text-[#111] shadow-[0_0_40px_rgba(0,0,0,0.5)] relative origin-top shrink-0"
              style={{
                width: `${8.5 * 96 * (zoom / 100)}px`,
                height: `${11 * 96 * (zoom / 100)}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                marginBottom: `${(11 * 96 * (zoom / 100)) - (11 * 96)}px`
              }}
            >
              {page === 1 ? <PageOne /> : <PageTwo />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ─── Print Pages (Designed like a premium print PDF) ─── */

function PageOne() {
  return (
    <div className="p-[0.8in] h-full flex flex-col font-serif text-[12.5px] leading-relaxed select-text">
      {/* Header */}
      <header className="border-b-[2.5px] border-[#222] pb-4 mb-6 text-center">
        <h1 className="text-[26px] font-bold text-[#111] tracking-tight uppercase mb-1">
          {resumeData.header.name}
        </h1>
        <p className="text-[13px] text-[#444] font-semibold tracking-wide uppercase mb-2">
          {resumeData.header.title}
        </p>
        <div className="flex items-center justify-center gap-3 text-[10px] text-[#555] font-sans">
          <span>{resumeData.header.email}</span>
          <span className="text-[#999]">•</span>
          <span>{resumeData.header.website}</span>
          <span className="text-[#999]">•</span>
          <span>{resumeData.header.location}</span>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-5">
        <h2 className="text-[12px] font-bold text-[#111] uppercase tracking-[0.1em] mb-2 border-b border-[#ddd] pb-0.5">
          Professional Summary
        </h2>
        <p className="text-[#333] text-justify leading-relaxed font-sans text-[11.5px]">
          {resumeData.summary}
        </p>
      </section>

      {/* Education */}
      <section className="mb-5">
        <h2 className="text-[12px] font-bold text-[#111] uppercase tracking-[0.1em] mb-2 border-b border-[#ddd] pb-0.5">
          Education
        </h2>
        <div className="space-y-4">
          {resumeData.education.map((edu, i) => (
            <div key={i} className="text-[11.5px]">
              <div className="flex justify-between items-baseline font-sans font-bold text-[#222]">
                <span>{edu.school}</span>
                <span className="text-[#555] font-normal text-[10.5px]">{edu.year}</span>
              </div>
              <p className="italic text-[#444] font-sans font-medium">{edu.degree}</p>
              <p className="text-[#333] mt-0.5 leading-relaxed">{edu.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="flex-1">
        <h2 className="text-[12px] font-bold text-[#111] uppercase tracking-[0.1em] mb-2 border-b border-[#ddd] pb-0.5">
          Work Experience
        </h2>
        <div className="space-y-4">
          {resumeData.experience.map((exp, i) => (
            <div key={i} className="text-[11.5px]">
              <div className="flex justify-between items-baseline font-sans font-bold text-[#222]">
                <span>{exp.company}</span>
                <span className="text-[#555] font-normal text-[10.5px]">{exp.period}</span>
              </div>
              <p className="italic text-[#444] font-sans font-medium mb-1">{exp.role}</p>
              <ul className="list-disc pl-4 space-y-1 text-[#333]">
                {exp.points.map((pt, j) => (
                  <li key={j} className="leading-relaxed">{pt}</li>
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
    <div className="p-[0.8in] h-full flex flex-col font-serif text-[12.5px] leading-relaxed select-text">
      {/* Projects */}
      <section className="mb-5">
        <h2 className="text-[12px] font-bold text-[#111] uppercase tracking-[0.1em] mb-2 border-b border-[#ddd] pb-0.5">
          Workspace Projects
        </h2>
        <div className="space-y-3 font-sans text-[11px] text-[#333]">
          {resumeData.projects.map((proj, i) => (
            <div key={i} className="leading-relaxed">
              <span className="font-bold text-[#222]">{proj.name}</span>: {proj.desc}
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-5">
        <h2 className="text-[12px] font-bold text-[#111] uppercase tracking-[0.1em] mb-2 border-b border-[#ddd] pb-0.5">
          Technical Skills
        </h2>
        <div className="space-y-2 font-sans text-[11.5px]">
          {resumeData.skills.map((skill, i) => (
            <div key={i} className="flex items-start">
              <span className="w-32 font-bold text-[#222] shrink-0">{skill.category}:</span>
              <span className="text-[#444] leading-relaxed">{skill.items}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-5">
        <h2 className="text-[12px] font-bold text-[#111] uppercase tracking-[0.1em] mb-2 border-b border-[#ddd] pb-0.5">
          Certifications
        </h2>
        <ul className="list-disc pl-4 space-y-1 font-sans text-[11px] text-[#333]">
          {resumeData.certifications.map((c, i) => (
            <li key={i} className="leading-relaxed">{c}</li>
          ))}
        </ul>
      </section>

      {/* Achievements */}
      <section className="flex-1">
        <h2 className="text-[12px] font-bold text-[#111] uppercase tracking-[0.1em] mb-2 border-b border-[#ddd] pb-0.5">
          Achievements
        </h2>
        <ul className="list-disc pl-4 space-y-1 font-sans text-[11px] text-[#333]">
          {resumeData.achievements.map((a, i) => (
            <li key={i} className="leading-relaxed">{a}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
