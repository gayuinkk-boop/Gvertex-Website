'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Terminal, LogOut, Loader2, Users, FileText, Briefcase, Plus, Trash2, 
  CheckCircle2, AlertCircle, Sparkles, Mail, ExternalLink, RefreshCw 
} from 'lucide-react'

interface Lead {
  id: string
  created_at: string
  name: string
  email: string
  company: string
  contact_number: string
  calling_number: string
  state: string
  city: string
  problem_statement: string
  more_details?: string
  services_required: string
  ip_address: string
}

interface SpecCard {
  id: string
  title: string
  content: string
  icon_name: string
  sort_order: number
}

interface Project {
  id: string
  title: string
  description: string
  category: string
  impact: string
  sort_order: number
}

interface TeamMember {
  id: string
  name: string
  designation: string
  expertise: string
  email: string
  linkedin: string
  photo_url: string
  sort_order: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'cards' | 'projects' | 'team'>('leads')
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<Lead[]>([])
  
  // Specs state
  const [cards, setCards] = useState<SpecCard[]>([])
  const [newCard, setNewCard] = useState({ title: '', content: '', icon_name: 'Cpu', sort_order: 0 })
  
  // Projects state
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState({ title: '', description: '', category: '', impact: '', sort_order: 0 })
  
  // Team state
  const [team, setTeam] = useState<TeamMember[]>([])
  const [newMember, setNewMember] = useState({ name: '', designation: '', expertise: '', email: '', linkedin: '', photo_url: '', sort_order: 0 })
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  // Status logs
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => setStatusMsg(null), 4000)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Fetch leads
      const { data: leadsData, error: leadsErr } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (leadsErr) throw leadsErr
      setLeads(leadsData || [])

      // 2. Fetch cards
      const { data: cardsData, error: cardsErr } = await supabase
        .from('about_cards')
        .select('*')
        .order('sort_order', { ascending: true })
      if (cardsErr) throw cardsErr
      setCards(cardsData || [])

      // 3. Fetch projects
      const { data: projectsData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
      if (projErr) throw projErr
      setProjects(projectsData || [])

      // 4. Fetch team members
      const { data: teamData, error: teamErr } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true })
      if (teamErr) throw teamErr
      setTeam(teamData || [])

    } catch (err: any) {
      console.error('Fetch Data Error:', err.message)
      showStatus('error', 'Could not sync database collections: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin')
    } catch (err) {
      router.push('/admin')
    }
  }

  // --- CRUD Specs ---
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCard.title || !newCard.content) return
    try {
      const { error } = await supabase
        .from('about_cards')
        .insert([newCard])
      if (error) throw error
      showStatus('success', 'Specs card initialized successfully.')
      setNewCard({ title: '', content: '', icon_name: 'Cpu', sort_order: cards.length })
      fetchData()
    } catch (err: any) {
      showStatus('error', err.message)
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this specifications card?')) return
    try {
      const { error } = await supabase
        .from('about_cards')
        .delete()
        .eq('id', id)
      if (error) throw error
      showStatus('success', 'Specs card deleted.')
      fetchData()
    } catch (err: any) {
      showStatus('error', err.message)
    }
  }

  // --- CRUD Projects ---
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.title || !newProject.description || !newProject.category || !newProject.impact) return
    try {
      const { error } = await supabase
        .from('projects')
        .insert([newProject])
      if (error) throw error
      showStatus('success', 'Project registered successfully under Gvertex.')
      setNewProject({ title: '', description: '', category: '', impact: '', sort_order: projects.length })
      fetchData()
    } catch (err: any) {
      showStatus('error', err.message)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Gvertex project record?')) return
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      if (error) throw error
      showStatus('success', 'Project deleted.')
      fetchData()
    } catch (err: any) {
      showStatus('error', err.message)
    }
  }

  // --- CRUD Team Members ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingPhoto(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setNewMember(prev => ({ ...prev, photo_url: reader.result as string }))
      setUploadingPhoto(false)
      showStatus('success', 'Base64 image conversion complete.')
    }
    reader.onerror = () => {
      setUploadingPhoto(false)
      showStatus('error', 'Failed to convert photo file.')
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMember.name || !newMember.designation || !newMember.expertise || !newMember.email || !newMember.linkedin || !newMember.photo_url) {
      showStatus('error', 'All fields (including profile picture) are required.')
      return
    }
    try {
      const { error } = await supabase
        .from('team_members')
        .insert([newMember])
      if (error) throw error
      showStatus('success', 'Team member registered.')
      setNewMember({ name: '', designation: '', expertise: '', email: '', linkedin: '', photo_url: '', sort_order: team.length })
      fetchData()
    } catch (err: any) {
      showStatus('error', err.message)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)
      if (error) throw error
      showStatus('success', 'Team member profile removed.')
      fetchData()
    } catch (err: any) {
      showStatus('error', err.message)
    }
  }

  const handleComposeGmail = (lead: Lead) => {
    const subject = encodeURIComponent('Gvertex Technologies - Technical Roadmap Briefing')
    const body = encodeURIComponent(
      `Dear ${lead.name},\n\n` +
      `Thank you for submitting your specifications to Gvertex Technologies.\n\n` +
      `We have received your problem statement:\n` +
      `"${lead.problem_statement}"\n\n` +
      `Our systems engineering team is analyzing your bottleneck parameters. We will schedule a technical roadmap briefing shortly.\n\n` +
      `Best regards,\n` +
      `Systems Operations Team\n` +
      `Gvertex Technologies`
    )
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}&su=${subject}&body=${body}`
    window.open(gmailUrl, '_blank')
  }

  return (
    <main className="min-h-screen bg-[#0a0c0d] text-white py-16 px-6 font-sans relative">
      
      {/* HUD Background elements */}
      <div className="absolute inset-0 tech-line-grid opacity-35 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0E7C7B] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2B2F33] mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8FE3D0] uppercase mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Gvertex Administrative Console</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Command Center</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="px-4 py-2 border border-[#2B2F33] hover:border-[#8FE3D0] text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync DB
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Terminate Session
            </button>
          </div>
        </header>

        {/* Status Alerts */}
        {statusMsg && (
          <div className={`flex items-center gap-3 p-4 mb-8 border font-mono text-xs ${
            statusMsg.type === 'success' ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' : 'bg-red-950/20 border-red-900/50 text-red-400'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full text-left p-4 font-mono text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                activeTab === 'leads' ? 'bg-[#101314] border-[#8FE3D0] text-white font-bold' : 'bg-[#101314]/40 border-[#2B2F33] text-white/50 hover:text-white'
              }`}
            >
              &gt; leads inbox ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`w-full text-left p-4 font-mono text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                activeTab === 'cards' ? 'bg-[#101314] border-[#8FE3D0] text-white font-bold' : 'bg-[#101314]/40 border-[#2B2F33] text-white/50 hover:text-white'
              }`}
            >
              &gt; spec cards manager ({cards.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full text-left p-4 font-mono text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-[#101314] border-[#8FE3D0] text-white font-bold' : 'bg-[#101314]/40 border-[#2B2F33] text-white/50 hover:text-white'
              }`}
            >
              &gt; projects portfolio ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full text-left p-4 font-mono text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                activeTab === 'team' ? 'bg-[#101314] border-[#8FE3D0] text-white font-bold' : 'bg-[#101314]/40 border-[#2B2F33] text-white/50 hover:text-white'
              }`}
            >
              &gt; engineering council ({team.length})
            </button>
          </div>

          {/* Active Workspace */}
          <div className="lg:col-span-9 bg-[#101314]/80 border border-[#2B2F33] p-8 relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 font-mono text-xs text-white/40 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#8FE3D0]" />
                <span>Synchronizing console datasets...</span>
              </div>
            ) : (
              <>
                {/* 1. Leads Panel */}
                {activeTab === 'leads' && (
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-6 font-mono flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#8FE3D0]" />
                      Incoming Consultations Inbox
                    </h2>

                    {leads.length === 0 ? (
                      <div className="text-center py-12 text-white/30 font-mono text-xs">
                        [ NO USER REQUEST TRANSMISSIONS RECORDED ]
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs text-white/80 min-w-[1000px]">
                          <thead>
                            <tr className="border-b border-[#2B2F33] text-white/40 uppercase">
                              <th className="py-3 px-2">Date</th>
                              <th className="py-3 px-2">Client Details</th>
                              <th className="py-3 px-2">Phone Numbers</th>
                              <th className="py-3 px-2">Location</th>
                              <th className="py-3 px-2">Services Needed</th>
                              <th className="py-3 px-2">Problem Statement / More Details</th>
                              <th className="py-3 px-2">Origin IP</th>
                              <th className="py-3 px-2 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2B2F33]/40">
                            {leads.map((lead) => (
                              <tr key={lead.id} className="hover:bg-white/5 align-top">
                                <td className="py-3 px-2 text-[10px] text-white/40 whitespace-nowrap">
                                  {new Date(lead.created_at).toLocaleString()}
                                </td>
                                <td className="py-3 px-2">
                                  <span className="font-bold text-white block">{lead.name}</span>
                                  <span className="text-[#8FE3D0] block text-[10px]">{lead.email}</span>
                                  <span className="text-white/40 block text-[10px]">{lead.company}</span>
                                </td>
                                <td className="py-3 px-2">
                                  <span className="block text-white/70">WA: {lead.contact_number}</span>
                                  <span className="block text-white/40 text-[10px]">Call: {lead.calling_number}</span>
                                </td>
                                <td className="py-3 px-2 uppercase">
                                  {lead.city}, {lead.state}
                                </td>
                                <td className="py-3 px-2 text-[#8FE3D0] text-[10px]">
                                  {lead.services_required}
                                </td>
                                <td className="py-3 px-2 max-w-[250px]">
                                  <p className="text-white/70 line-clamp-3" title={lead.problem_statement}>
                                    {lead.problem_statement}
                                  </p>
                                  {lead.more_details && (
                                    <p className="text-[10px] text-white/30 mt-1 italic line-clamp-2" title={lead.more_details}>
                                      More: {lead.more_details}
                                    </p>
                                  )}
                                </td>
                                <td className="py-3 px-2 text-[10px] text-white/30 whitespace-nowrap">{lead.ip_address}</td>
                                <td className="py-3 px-2 text-right">
                                  <button
                                    onClick={() => handleComposeGmail(lead)}
                                    className="px-2.5 py-1.5 bg-[#0E7C7B] hover:bg-[#8FE3D0] hover:text-[#101314] text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ml-auto transition-all duration-300 cursor-pointer"
                                  >
                                    <Mail className="w-3 h-3" />
                                    Gmail Reply
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Specs Cards Panel */}
                {activeTab === 'cards' && (
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-6 font-mono">
                      &gt; Spec Cards Manager
                    </h2>

                    {/* Add Spec card Form */}
                    <form onSubmit={handleAddCard} className="space-y-4 mb-8 bg-[#0a0c0d] p-6 border border-[#2B2F33]">
                      <h3 className="text-xs uppercase font-mono text-[#8FE3D0] mb-2">[ REGISTER SPECIFICATION CARD ]</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={newCard.title}
                          onChange={(e) => setNewCard(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Card Title (e.g. SYSTEMS RELIABILITY)"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                        <select
                          value={newCard.icon_name}
                          onChange={(e) => setNewCard(prev => ({ ...prev, icon_name: e.target.value }))}
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        >
                          <option value="Cpu">Cpu Icon</option>
                          <option value="Layers">Layers Icon</option>
                          <option value="Shield">Shield Icon</option>
                        </select>
                      </div>
                      <textarea
                        value={newCard.content}
                        onChange={(e) => setNewCard(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Card Content Description (1-2 sentences)"
                        rows={2}
                        className="w-full bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0E7C7B] hover:bg-[#8FE3D0] hover:text-[#101314] text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" /> Commit Card
                      </button>
                    </form>

                    {/* Cards Directory */}
                    <div className="space-y-4">
                      {cards.map((c) => (
                        <div key={c.id} className="flex items-start justify-between p-4 border border-[#2B2F33] bg-[#101314]/40">
                          <div>
                            <span className="text-[10px] font-mono text-[#8FE3D0] block mb-1">ICON: {c.icon_name}</span>
                            <h4 className="font-bold text-white uppercase text-sm mb-1">{c.title}</h4>
                            <p className="text-xs text-white/60 font-light">{c.content}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteCard(c.id)}
                            className="p-2 text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Projects Showcase Panel */}
                {activeTab === 'projects' && (
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-6 font-mono">
                      &gt; Gvertex Projects Done
                    </h2>

                    {/* Add Project Form */}
                    <form onSubmit={handleAddProject} className="space-y-4 mb-8 bg-[#0a0c0d] p-6 border border-[#2B2F33]">
                      <h3 className="text-xs uppercase font-mono text-[#8FE3D0] mb-2">[ REGISTER PROJECT RECORD ]</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Project Title (e.g. ERP PIPELINE ENGINE)"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                        <input
                          type="text"
                          value={newProject.category}
                          onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="Category (e.g. Logistics / Automation)"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={newProject.impact}
                          onChange={(e) => setNewProject(prev => ({ ...prev, impact: e.target.value }))}
                          placeholder="Operational Impact Metric (e.g. 40% latency reduction)"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                        <input
                          type="number"
                          value={newProject.sort_order}
                          onChange={(e) => setNewProject(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                          placeholder="Sort Index"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                      </div>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description of pipeline specifications..."
                        rows={2}
                        className="w-full bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0E7C7B] hover:bg-[#8FE3D0] hover:text-[#101314] text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" /> Commit Project
                      </button>
                    </form>

                    {/* Projects Listing */}
                    <div className="space-y-4">
                      {projects.map((p) => (
                        <div key={p.id} className="flex items-start justify-between p-4 border border-[#2B2F33] bg-[#101314]/40">
                          <div>
                            <span className="text-[10px] font-mono text-[#8FE3D0] block mb-1">METRIC: {p.impact} | {p.category}</span>
                            <h4 className="font-bold text-white uppercase text-sm mb-1">{p.title}</h4>
                            <p className="text-xs text-white/60 font-light">{p.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-2 text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Team Members Panel */}
                {activeTab === 'team' && (
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-6 font-mono">
                      &gt; Engineering Council Management
                    </h2>

                    {/* Add Team Member Form */}
                    <form onSubmit={handleAddMember} className="space-y-4 mb-8 bg-[#0a0c0d] p-6 border border-[#2B2F33]">
                      <h3 className="text-xs uppercase font-mono text-[#8FE3D0] mb-2">[ REGISTER EXECUTIVE RECORD ]</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={newMember.name}
                          onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Member Name (e.g. Siddharth Mehta)"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                        <input
                          type="text"
                          value={newMember.designation}
                          onChange={(e) => setNewMember(prev => ({ ...prev, designation: e.target.value }))}
                          placeholder="Designation (e.g. Chief Systems Architect)"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={newMember.expertise}
                          onChange={(e) => setNewMember(prev => ({ ...prev, expertise: e.target.value }))}
                          placeholder="Expertise area (e.g. Kubernetes Cluster Config)"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                        <input
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Contact Email"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={newMember.linkedin}
                          onChange={(e) => setNewMember(prev => ({ ...prev, linkedin: e.target.value }))}
                          placeholder="LinkedIn Profile URL"
                          className="bg-[#101314] border border-[#2B2F33] p-2 text-xs font-mono text-white focus:outline-none focus:border-[#8FE3D0]"
                        />
                        <div className="flex flex-col justify-center">
                          <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">Portrait Upload</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="text-xs font-mono text-white/60"
                          />
                        </div>
                      </div>

                      {newMember.photo_url && (
                        <div className="p-2 bg-[#101314] border border-[#2B2F33] flex items-center gap-3">
                          <img src={newMember.photo_url} alt="preview" className="w-12 h-12 object-cover border border-[#2B2F33]" />
                          <span className="text-[10px] font-mono text-white/40 uppercase">Image loaded dynamically (Base64)</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={uploadingPhoto}
                        className="px-4 py-2 bg-[#0E7C7B] hover:bg-[#8FE3D0] hover:text-[#101314] text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer font-bold disabled:opacity-50"
                      >
                        {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Commit Profile
                      </button>
                    </form>

                    {/* Members Listing */}
                    <div className="space-y-4">
                      {team.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-4 border border-[#2B2F33] bg-[#101314]/40">
                          <div className="flex items-center gap-4">
                            <img src={t.photo_url} alt={t.name} className="w-12 h-12 object-cover border border-[#2B2F33] grayscale" />
                            <div>
                              <h4 className="font-bold text-white uppercase text-sm mb-0.5">{t.name}</h4>
                              <span className="text-[10px] font-mono text-white/50 uppercase block">{t.designation}</span>
                              <span className="text-[10px] font-mono text-[#8FE3D0] block">Expertise: {t.expertise}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMember(t.id)}
                            className="p-2 text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </main>
  )
}
