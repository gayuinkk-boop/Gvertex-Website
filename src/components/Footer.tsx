'use client'

import { Shield } from 'lucide-react'

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

export default function Footer() {
  return (
    <footer className="bg-[#0a0c0d] border-t border-[#2B2F33]/60 py-12 px-6 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Copyright details */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-[11px] font-mono text-white/35 uppercase tracking-wide">
            © {new Date().getFullYear()} GVERTEX TECHNOLOGIES. ALL RIGHTS RESERVED.
          </span>
          <span className="text-[9px] font-mono text-white/20 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#0E7C7B]" /> SECURE CONNECTION // RLS SECURED
          </span>
        </div>

        {/* Social Media Link Icons */}
        <div className="flex items-center gap-4">
          <a 
            href="https://www.instagram.com/gvertex.tech?igsh=aXhwaDBmcnR5NDR0" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 border border-[#2B2F33] text-white/50 hover:text-[#8FE3D0] hover:border-[#8FE3D0]/40 rounded-full transition-all duration-300"
            title="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a 
            href="https://www.linkedin.com/company/g-vertex-technologies/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 border border-[#2B2F33] text-white/50 hover:text-[#8FE3D0] hover:border-[#8FE3D0]/40 rounded-full transition-all duration-300"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a 
            href="https://wa.me/917304910484" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 border border-[#2B2F33] text-white/50 hover:text-[#8FE3D0] hover:border-[#8FE3D0]/40 rounded-full transition-all duration-300"
            title="WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Production Status Log */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono text-white/35">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            CORE STATUS // OPERATIONAL
          </span>
          <span className="border-l border-[#2B2F33]/40 pl-4">SECURE GATEWAY // SSL-TLS</span>
          <span className="border-l border-[#2B2F33]/40 pl-4">DISTRIBUTED CLOUD // EDGE</span>
          <span className="border-l border-[#2B2F33]/40 pl-4">DB TUNNEL // ACTIVE</span>
        </div>

      </div>
    </footer>
  )
}
