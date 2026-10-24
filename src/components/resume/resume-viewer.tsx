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
    <div className="h-full flex flex-col bg-transparent text-foreground font-sans overflow-hidden select-none">

      {/* ─── Top Toolbar ─── */}
      <div className="h-11 flex items-center justify-between px-4 border-b border-hairline bg-window-chrome/40 shrink-0 z-10">
        <div className="text-[10.5px] text-muted-foreground/60 font-mono tracking-tight pl-0.5">
          P.R.S_Resume.pdf
        </div>

        {/* Right: Zoom & Actions */}
        <div className="flex items-center gap-1.5">
          <button onClick={handleZoomOut} className="p-1.5 rounded-md hover:bg-foreground/[0.06] text-muted-foreground/65 transition-colors">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="w-10 text-center text-[10px] text-muted-foreground/55 select-none font-mono tabular">
            {zoom}%
          </div>
          <button onClick={handleZoomIn} className="p-1.5 rounded-md hover:bg-foreground/[0.06] text-muted-foreground/65 transition-colors">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-hairline mx-1.5" />

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 h-7 px-2.5 ml-0.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-[10.5px] font-medium"
          >
            {downloaded ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
            {downloaded ? 'Opening PDF' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* ─── PDF Viewer ─── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-foreground/[0.02] custom-scrollbar relative"
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
