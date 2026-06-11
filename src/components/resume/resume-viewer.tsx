'use client'

import { useState, useRef } from 'react'
import {
  ZoomIn, ZoomOut, Download, Check
} from 'lucide-react'

export function ResumeViewer() {
  const [zoom, setZoom] = useState(100)
  const [downloaded, setDownloaded] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom(z => Math.min(200, z + 10))
  const handleZoomOut = () => setZoom(z => Math.max(50, z - 10))

  const handleDownload = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
    const a = document.createElement('a')
    a.href = '/Resume.pdf'
    a.download = 'P.R.S_Resume.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-foreground font-sans overflow-hidden select-none">

      {/* ─── Top Toolbar ─── */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-border/40 bg-[#252526] shrink-0 z-10">
        <div className="text-xs text-muted-foreground font-bold tracking-wider pl-1">
          P.R.S_Resume.pdf
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

      {/* ─── PDF Viewer ─── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-[#1e1e1e] custom-scrollbar relative"
      >
        <div
          className="w-full h-full min-h-[500px] transition-transform duration-75 origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <iframe
            src="/Resume.pdf"
            className="w-full h-full border-0"
            title="Resume"
          />
        </div>
      </div>
    </div>
  )
}
