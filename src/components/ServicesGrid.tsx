'use client'

import { Laptop, GitMerge, Cpu, Layers, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'

interface ServiceCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  codeLabel: string
  floatClass: string
}

function ServiceCard({ id, title, description, icon, codeLabel, floatClass }: ServiceCardProps) {
  return (
    <div className={`hardware-panel tech-corners cyber-border-draw hud-corner-detail p-8 hover:border-[#8FE3D0]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#0E7C7B]/10 group flex flex-col justify-between ${floatClass}`}>
      
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="p-3 rounded bg-[#101314] border border-[#2B2F33] text-[#8FE3D0] group-hover:bg-[#0E7C7B] group-hover:text-white transition-all duration-300">
            {icon}
          </div>
          <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
            {codeLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-white mb-3 uppercase group-hover:text-[#8FE3D0] transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-white/60">
          {description}
        </p>
      </div>

      {/* Tech Spec Footer */}
      <div className="mt-8 pt-4 border-t border-[#2B2F33]/40 flex items-center justify-between text-[10px] font-mono text-white/30">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8FE3D0]" />
          <span>STATUS: ONLINE</span>
        </div>
        <span>ENG-V1.{id}</span>
      </div>

    </div>
  )
}

export default function ServicesGrid() {
  const services = [
    {
      id: '01',
      title: 'Digital Platforms & Web Experiences',
      description: 'Ultra-fast, responsive web applications engineered for heavy client loads and high-conversion pathways. Built with compiled low-latency core runtimes and highly optimized delivery bundles.',
      icon: <Laptop className="w-5 h-5" />,
      codeLabel: 'SYS // EXPERIENCE.NODE',
      floatClass: 'floating-card-slow'
    },
    {
      id: '02',
      title: 'Client & Pipeline Management Systems',
      description: 'Custom lead ingestion pipelines, real-time CRM dashboards, and database integrations. Secure, automated workflows to optimize enterprise sales pipelines.',
      icon: <GitMerge className="w-5 h-5" />,
      codeLabel: 'DB // PIPELINE.POSTGRES',
      floatClass: 'floating-card-medium'
    },
    {
      id: '03',
      title: 'Business Process Automation',
      description: 'Eliminate repetitive workflows with robust automation connectors. Seamless data synchronizations between your marketing assets, databases, and third-party SaaS.',
      icon: <Cpu className="w-5 h-5" />,
      codeLabel: 'API // WORKFLOW.AUTON',
      floatClass: 'floating-card-fast'
    },
    {
      id: '04',
      title: 'Tailored Operational Solutions',
      description: 'Custom internal software designed to resolve specific operational bottlenecks. We map your engineering requirements to clean, scalable microservices architectures.',
      icon: <Layers className="w-5 h-5" />,
      codeLabel: 'SEC // ARCHITECTURE.RLS',
      floatClass: 'floating-card-medium'
    }
  ]

  return (
    <section 
      id="services" 
      className="relative py-28 px-6 bg-[#0a0c0d] border-b border-[#2b2f33]/40 overflow-hidden tech-line-grid"
    >
      {/* Structural Accent Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-[#2B2F33]/15 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-[#2B2F33]/15 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left mb-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-6"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#0E7C7B] uppercase mb-4">
              <Terminal className="w-3.5 h-3.5" />
              <span>Technical Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
              Core Development Services
            </h2>
          </div>
          <p className="text-sm font-light text-white/50 max-w-sm md:text-right">
            Curated engineering solutions designed to remove digital inefficiencies and scale business operations seamlessly.
          </p>
        </motion.div>

        {/* 2x2 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 py-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
