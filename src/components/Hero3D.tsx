'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowRight, Terminal } from 'lucide-react'

// Dynamic import of CanvasBackground to avoid SSR and React 19 server-side ThreeJS errors
const CanvasBackground = dynamic(() => import('./CanvasBackground'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#0a0c0d]" />
})

export default function Hero3D() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section 
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-[#0a0c0d] border-b border-[#2b2f33]/40 tech-line-grid"
    >
      {/* 3D WebGL Background Layer (Non-blocking, conditional render on viewport entry) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {isInView && <CanvasBackground />}
      </div>

      {/* Decorative Radial Grid Mask */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0a0c0d_80%)] pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101314] border border-[#2B2F33] text-xs font-mono text-[#8FE3D0] mb-8 animate-pulse tech-corners">
          <Terminal className="w-3.5 h-3.5" />
          <span>Gvertex Systems Engine Active</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase max-w-4xl leading-[1.1] font-sans">
          Engineering High-Performance <br/>
          <span className="bg-gradient-to-r from-[#0E7C7B] via-[#8FE3D0] to-white bg-clip-text text-transparent">
            Systems Architecture
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-xl text-[rgba(255,255,255,0.7)] max-w-2xl mb-12 font-light leading-relaxed">
          We design, build, and deploy custom client pipeline systems, digital platforms, and operation automations tailored for high-value enterprise outcomes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full sm:w-auto px-8 py-4 bg-[#0E7C7B] hover:bg-[#8FE3D0] hover:text-[#101314] text-white font-mono uppercase tracking-wider text-sm cyber-btn font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-[#0E7C7B]/20 hover:shadow-[#8FE3D0]/20 cursor-pointer"
          >
            Initiate Project
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={() => scrollToSection('services')}
            className="w-full sm:w-auto px-8 py-4 bg-[#101314]/80 hover:bg-[#1e2225] text-white border border-[#2B2F33] font-mono uppercase tracking-wider text-sm cyber-btn font-medium transition-all duration-300 cursor-pointer"
          >
            Explore Services
          </button>
        </div>

        {/* Micro Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={() => scrollToSection('services')}>
          <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">Scroll to details</span>
          <div className="w-5 h-8 border border-white/20 rounded-full p-1 flex justify-center">
            <div className="w-1.5 h-1.5 bg-[#8FE3D0] rounded-full animate-bounce" />
          </div>
        </div>

      </div>
    </section>
  )
}
