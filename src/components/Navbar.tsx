'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, ShieldCheck } from 'lucide-react'

// Custom SVGs for Socials
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.93.548 3.802 1.584 5.437L2.03 22l4.708-1.517a9.93 9.93 0 005.261 1.519c5.52 0 10.005-4.477 10.005-10.002C22.004 6.477 17.522 2 12.004 2zm0 18.004c-1.644 0-3.23-.42-4.636-1.222l-.334-.191-3.447 1.11 1.134-3.324-.213-.34a8.006 8.006 0 01-1.286-4.283c0-4.417 3.593-8.006 8.016-8.006 4.416 0 8.007 3.589 8.007 8.006 0 4.42-3.591 8.01-8.007 8.01zm4.685-6.388c-.257-.128-1.519-.747-1.753-.833-.235-.086-.407-.128-.578.128-.172.257-.665.833-.815.998-.15.166-.3.187-.557.058-.257-.128-1.085-.399-2.068-1.272-.765-.68-1.28-1.522-1.43-1.779-.15-.257-.016-.397.113-.524.115-.115.257-.3.385-.45.128-.15.172-.257.257-.428.086-.171.043-.321-.022-.45-.064-.128-.578-1.391-.792-1.905-.208-.501-.418-.433-.578-.44l-.492-.008c-.172 0-.45.064-.685.321-.235.257-.9.878-.9 2.14 0 1.262.92 2.482 1.048 2.653.128.171 1.808 2.76 4.381 3.869.612.264 1.09.421 1.463.539.614.195 1.173.167 1.615.1.493-.075 1.519-.62 1.733-1.219.213-.599.213-1.112.15-1.218-.064-.108-.235-.172-.492-.301z"/>
  </svg>
)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check admin cookie session
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/admin/check')
        const data = await res.json()
        setIsAdmin(data.authenticated)
      } catch {
        setIsAdmin(false)
      }
    }
    checkAdmin()

    // Track scroll for navbar transparency
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAdminLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setIsAdmin(false)
    router.push('/')
  }

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    if (pathname !== '/') {
      router.push('/#' + id)
      return
    }
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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'glassmorphism border-b border-[#2b2f33]/60 py-4 shadow-lg' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo Banner (Fixed dimensions to prevent stretching) */}
        <Link 
          href="/" 
          onClick={(e) => { 
            if (pathname === '/') {
              e.preventDefault(); 
              scrollToSection('hero'); 
            }
          }} 
          className="flex items-center group"
        >
          <div className="relative w-44 h-12 transition-transform duration-300 group-hover:scale-[1.02]">
                      <Image 
              src="/Gvertex-logo-transparent.png" 
              alt="G-Vertex Technologies" 
              fill
              sizes="(max-width: 768px) 140px, 176px"
              className="object-contain filter brightness-110"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('services')}
            className="text-sm font-medium tracking-wide text-white/70 hover:text-[#8FE3D0] transition-colors cursor-pointer"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('focus')}
            className="text-sm font-medium tracking-wide text-white/70 hover:text-[#8FE3D0] transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-sm font-medium tracking-wide text-white/70 hover:text-[#8FE3D0] transition-colors cursor-pointer"
          >
            Initiate Project
          </button>
          
          <Link 
            href="/about"
            className={`text-sm font-medium tracking-wide transition-colors cursor-pointer ${
              pathname === '/about' ? 'text-[#8FE3D0] font-semibold' : 'text-white/70 hover:text-[#8FE3D0]'
            }`}
          >
            About Us
          </Link>

          {/* Admin Session Indicator */}
          {isAdmin ? (
            <div className="flex items-center gap-4 pl-4 border-l border-[#2B2F33]">
              <Link 
                href="/admin/dashboard"
                className="flex items-center gap-2 text-xs text-[#8FE3D0] font-mono bg-[#0E7C7B]/20 px-2.5 py-1 rounded border border-[#0E7C7B]/50 hover:bg-[#8FE3D0] hover:text-black transition-all duration-300"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Command Center</span>
              </Link>
              <button 
                onClick={handleAdminLogout} 
                className="text-white/60 hover:text-[#8FE3D0] transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/admin"
              className="text-xs font-mono text-white/50 hover:text-white transition-colors pl-4 border-l border-[#2B2F33] flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* Social Links on Header */}
          <div className="flex items-center gap-3 pl-4 border-l border-[#2B2F33]">
            <a 
              href="https://www.instagram.com/gvertex.tech?igsh=aXhwaDBmcnR5NDR0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#8FE3D0] transition-colors p-1"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/company/g-vertex-technologies/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#8FE3D0] transition-colors p-1"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://wa.me/917304910484" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#8FE3D0] transition-colors p-1"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>

          {/* CTA Consultation Button */}
          <button 
            onClick={() => scrollToSection('contact')}
            className="px-5 py-2.5 text-xs font-mono tracking-wider uppercase bg-[#0E7C7B] hover:bg-[#8FE3D0] hover:text-[#101314] text-white rounded transition-all duration-300 font-bold shadow-md shadow-[#0E7C7B]/20 hover:shadow-[#8FE3D0]/20 cursor-pointer"
          >
            Book Consultation
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => scrollToSection('contact')}
            className="px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase bg-[#0E7C7B] text-white rounded font-bold"
          >
            Consult
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/5"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden glassmorphism border-t border-[#2b2f33] mt-4 px-6 py-6 absolute top-full left-0 w-full shadow-xl flex flex-col gap-5">
          <button 
            onClick={() => scrollToSection('services')}
            className="text-left py-2 text-base tracking-wide text-white/80 hover:text-[#8FE3D0] transition-colors"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('focus')}
            className="text-left py-2 text-base tracking-wide text-white/80 hover:text-[#8FE3D0] transition-colors"
          >
            Capabilities
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-left py-2 text-base tracking-wide text-white/80 hover:text-[#8FE3D0] transition-colors"
          >
            Initiate Project
          </button>
          <Link 
            href="/about"
            onClick={() => setIsOpen(false)}
            className={`text-left py-2 text-base tracking-wide transition-colors ${
              pathname === '/about' ? 'text-[#8FE3D0] font-semibold' : 'text-white/80 hover:text-[#8FE3D0]'
            }`}
          >
            About Us
          </Link>
          
          <div className="h-px bg-[#2B2F33] my-1" />
          
          {/* Mobile Social Links */}
          <div className="flex items-center gap-4 py-2">
            <span className="text-xs text-white/40 font-mono">Socials:</span>
            <a 
              href="https://www.instagram.com/gvertex.tech?igsh=aXhwaDBmcnR5NDR0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-[#8FE3D0]"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/company/g-vertex-technologies/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-[#8FE3D0]"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://wa.me/917304910484" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-[#8FE3D0]"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="h-px bg-[#2B2F33] my-1" />

          <div className="flex items-center justify-between">
            {isAdmin ? (
              <div className="flex flex-col gap-1.5">
                <Link 
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 text-xs text-[#8FE3D0] font-mono bg-[#0E7C7B]/20 px-2 py-0.5 rounded border border-[#0E7C7B]/50"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Command Center
                </Link>
              </div>
            ) : (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="text-xs text-white/40 hover:text-white flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
              </Link>
            )}
            
            {isAdmin && (
              <button 
                onClick={handleAdminLogout} 
                className="text-xs text-white/60 hover:text-[#8FE3D0] flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
