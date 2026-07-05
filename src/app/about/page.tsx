'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { 
  Terminal, Shield, Layers, Cpu, FolderGit, 
  Users, Mail, ExternalLink 
} from 'lucide-react'
import Link from 'next/link'

interface InfoCard {
  id: string
  title: string
  content: string
  icon_name?: string
}

interface ProjectCard {
  id: string
  title: string
  description: string
  category: string
  impact: string
}

interface TeamMember {
  id: string
  name: string
  designation: string
  expertise: string
  email: string
  linkedin: string
  photo_url: string
}

export default function AboutPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [cards, setCards] = useState<InfoCard[]>([])
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Default Info Cards Fallback
  const defaultCards: InfoCard[] = [
    {
      id: 'd1',
      title: 'Systems Engineering Architecture',
      content: 'We specialize in writing high-value corporate backend protocols, database pipelines, and systems design that eliminates traditional digital bottlenecks.',
      icon_name: 'Cpu'
    },
    {
      id: 'd2',
      title: 'Edge low-latency distribution',
      content: 'Every deployment is optimized globally for Next.js edge caching and database read replications, ensuring page loads remain under 100ms.',
      icon_name: 'Layers'
    },
    {
      id: 'd3',
      title: 'Security-First Paradigm',
      content: 'Our systems implement strict Row-Level Security (RLS) rules directly at the Postgres core and leverage secure Google OAuth tokens.',
      icon_name: 'Shield'
    }
  ]

  // Default Projects Fallback
  const defaultProjects: ProjectCard[] = [
    {
      id: 'p1',
      title: 'Project Alpha-Core',
      category: 'API GATEWAY',
      description: 'Engineered a highly concurrent payment routing engine handling 15,000+ API calls/sec with custom sliding-window rate limit structures.',
      impact: '100% gateway uptime under peak load'
    },
    {
      id: 'p2',
      title: 'Project Chrono-Sync',
      category: 'STUDIO ENGINES',
      description: 'Distributed scheduling scheduler and asset watermarking delivery pipelines designed for commercial photography networks.',
      impact: '92% decrease in operations processing times'
    },
    {
      id: 'p3',
      title: 'Project Secure-Vault',
      category: 'MEDICAL CDN',
      description: 'HIPAA-compliant asset caching network with fast image compression and decentralized storage retrievals for healthcare groups.',
      impact: '4.8x increase in file load performance'
    }
  ]

  // Default Team Members Fallback (Pointing to generated portraits in public/)
  const defaultTeam: TeamMember[] = [
    {
      id: 't1',
      name: 'Dr. Evelyn Carter',
      designation: 'Chief Systems Architect',
      expertise: 'Core Compilers & Low-Latency APIs',
      email: 'e.carter@gvertex.tech',
      linkedin: 'https://www.linkedin.com/company/g-vertex-technologies/',
      photo_url: '/evelyn_carter.png'
    },
    {
      id: 't2',
      name: 'Marcus Vance',
      designation: 'Principal Infrastructure Engineer',
      expertise: 'Postgres RLS & Distributed Edge Caching',
      email: 'm.vance@gvertex.tech',
      linkedin: 'https://www.linkedin.com/company/g-vertex-technologies/',
      photo_url: '/marcus_vance.png'
    },
    {
      id: 't3',
      name: 'Siddharth Mehta',
      designation: 'Director of Solutions Engineering',
      expertise: 'Enterprise Workflow Automations',
      email: 's.mehta@gvertex.tech',
      linkedin: 'https://www.linkedin.com/company/g-vertex-technologies/',
      photo_url: '/siddharth_mehta.png'
    }
  ]

  useEffect(() => {
    const init = async () => {
      try {
        const checkRes = await fetch('/api/admin/check')
        const checkData = await checkRes.json()
        setIsAdmin(checkData.authenticated)
      } catch (err) {
        setIsAdmin(false)
      }
      
      await fetchData()
      setLoading(false)
    }

    init()
  }, [])

  const fetchData = async () => {
    try {
      // 1. Fetch cards
      const { data: dbCards, error: cardErr } = await supabase
        .from('about_cards')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!cardErr && dbCards && dbCards.length > 0) {
        setCards(dbCards)
      } else {
        setCards(defaultCards)
      }

      // 2. Fetch projects
      const { data: dbProjects, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!projErr && dbProjects && dbProjects.length > 0) {
        setProjects(dbProjects)
      } else {
        setProjects(defaultProjects)
      }

      // 3. Fetch team members
      const { data: dbTeam, error: teamErr } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!teamErr && dbTeam && dbTeam.length > 0) {
        setTeam(dbTeam)
      } else {
        setTeam(defaultTeam)
      }
    } catch (e) {
      setCards(defaultCards)
      setProjects(defaultProjects)
      setTeam(defaultTeam)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0a0c0d] text-white-90 pt-32 pb-24 px-6 tech-dot-grid scanline-container overflow-hidden">
        
        {/* Dynamic Glowing Page Header */}
        <div className="max-w-7xl mx-auto mb-16 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2B2F33]/60 pb-8 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8FE3D0] tracking-widest uppercase mb-3">
                <Terminal className="w-3.5 h-3.5 blink-led" />
                <span>DIRECTORY // ABOUT GVERTEX</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-cyber-glow">
                About Our <span className="bg-gradient-to-r from-[#0E7C7B] to-[#8FE3D0] bg-clip-text text-transparent">Operations</span>
              </h1>
            </motion.div>
            
            {/* Command Center Redirection for Admins */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0E7C7B] hover:bg-[#8FE3D0] text-white hover:text-black font-mono text-xs font-bold uppercase rounded border border-[#0E7C7B] transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Open Command Center</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* 1. About Info Cards Section */}
        <div className="max-w-7xl mx-auto mb-28">
          <h2 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-10">
            <Cpu className="w-5 h-5 text-[#8FE3D0]" />
            Company Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, idx) => (
              <motion.div 
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="hardware-panel tech-corners cyber-border-draw hud-corner-detail p-8 flex flex-col justify-between hover:border-[#8FE3D0]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#0E7C7B]/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-2 bg-[#0a0c0d] border border-[#2B2F33] text-[#8FE3D0]">
                      {card.icon_name === 'Layers' ? <Layers className="w-5 h-5" /> : 
                       card.icon_name === 'Shield' ? <Shield className="w-5 h-5" /> : 
                       <Cpu className="w-5 h-5" />}
                    </div>
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-wide text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm font-light text-white/60 leading-relaxed">
                    {card.content}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#2B2F33]/40 text-[9px] font-mono text-white/20">
                  SYSTEM SPEC CARD // {idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. Team Directory Section */}
        <div className="max-w-7xl mx-auto mb-28">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#2B2F33]/40">
            <h2 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8FE3D0]" />
              Engineering Council (Team)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="hardware-panel tech-corners cyber-border-draw hud-corner-detail hover:border-[#8FE3D0]/60 transition-all duration-500 hover:shadow-xl hover:shadow-[#0E7C7B]/5 group flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative w-full h-64 overflow-hidden border-b border-[#2B2F33]/60 bg-[#0a0c0d] flex items-center justify-center">
                    <img 
                      src={member.photo_url} 
                      alt={member.name}
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0d] to-transparent opacity-65" />
                    
                    {/* Tech details absolute overlay */}
                    <span className="absolute bottom-3 left-4 text-[9px] font-mono text-white/30 uppercase tracking-widest">
                      UNIT // SEC-ENG.{idx + 1}
                    </span>
                  </div>

                  {/* Member Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold uppercase text-white mb-1 group-hover:text-[#8FE3D0] transition-colors duration-300">
                      {member.name}
                    </h3>
                    <span className="text-xs text-white/50 block font-mono uppercase mb-4 tracking-wider">
                      {member.designation}
                    </span>
                    <p className="text-xs text-white/70 leading-relaxed font-light mb-6 border-l-2 border-[#0E7C7B] pl-3">
                      <span className="font-mono text-[10px] text-white/40 block mb-1">CORE EXPERTISE:</span>
                      {member.expertise}
                    </p>
                  </div>
                </div>

                {/* Footer and Social Links */}
                <div className="px-6 pb-6 pt-4 border-t border-[#2B2F33]/20 flex items-center justify-between">
                  <a 
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono">Email Contact</span>
                  </a>
                  
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#101314] hover:bg-[#8FE3D0] hover:text-black border border-[#2B2F33] hover:border-[#8FE3D0] text-[#8FE3D0] cyber-btn font-mono text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Projects Showcase Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#2B2F33]/40">
            <h2 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FolderGit className="w-5 h-5 text-[#8FE3D0]" />
              Projects Done Under Gvertex Technologies
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {projects.map((proj, idx) => (
              <motion.div 
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="hardware-panel tech-corners p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#8FE3D0]/60 transition-all duration-300"
              >
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-[10px] font-mono text-[#8FE3D0] bg-[#0E7C7B]/15 px-2.5 py-0.5 rounded border border-[#0E7C7B]/30 uppercase">
                      {proj.category}
                    </span>
                    <h3 className="text-lg font-bold uppercase text-white tracking-wide">
                      {proj.title}
                    </h3>
                  </div>
                  <p className="text-sm font-light text-white/60 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-white/30 uppercase block">Project Impact</span>
                    <span className="text-xs font-mono text-[#8FE3D0] font-bold uppercase tracking-wider block mt-1">
                      {proj.impact}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>

      {/* Reusable shared footer */}
      <Footer />
    </>
  )
}
