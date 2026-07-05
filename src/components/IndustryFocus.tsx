'use client'

import { useState } from 'react'
import { Camera, Home, PenTool, Terminal, ChevronRight, CheckCircle2 } from 'lucide-react'

export default function IndustryFocus() {
  const [activeTab, setActiveTab] = useState(0)

  const niches = [
    {
      title: 'Photography Scheduling Engines',
      subtitle: 'Asset proofing & studio management',
      icon: <Camera className="w-5 h-5" />,
      tag: 'MEDIA // CAPABILITY.01',
      description: 'Custom booking and pipeline software built for commercial agencies. Automates client onboarding, scheduling, high-resolution proofing pipelines with web watermarks, and invoice generation.',
      features: [
        'Automated proofing portal for client selection',
        'Direct S3 bucket image uploading with instant thumbnail generation',
        'Integration with stripe billing API for deposits',
        'Staff calendar syncing and shift distribution'
      ],
      metric: '92% Reduction in onboarding overhead'
    },
    {
      title: 'Interior Design Costing Systems',
      subtitle: 'Quotation, margin safety & supply chains',
      icon: <Home className="w-5 h-5" />,
      tag: 'DESIGN // CAPABILITY.02',
      description: 'Specialized enterprise resource calculators for design studios. Calculates live margins against shifting material costs, locks designer commissions, and triggers purchase orders instantly.',
      features: [
        'Live cost updates from supplier inventory webhooks',
        'Client-facing interactive proposal approval board',
        'Margin safety locks to prevent underpriced orders',
        'CAD and layout sheet attachments linked to project records'
      ],
      metric: '100% Protection from margin errors'
    },
    {
      title: 'Asset Configurator Portals',
      subtitle: '3D specifications & dynamic contracts',
      icon: <PenTool className="w-5 h-5" />,
      tag: 'ENG // CAPABILITY.03',
      description: 'Client configuration tools for physical manufactures. Allow custom choices in dimensions, colors, and components with automatic CAD file compiles and instantaneous PDF contract drafting.',
      features: [
        'Interactive dynamic spec sheets (web-native)',
        'Automatic invoice and legal contract compile',
        'Material cost bill-of-materials (BOM) generator',
        'Lead status pipelines syncing to Salesforce/Hubspot'
      ],
      metric: '4.8x Increase in client self-service conversions'
    }
  ]

  return (
    <section 
      id="focus" 
      className="relative py-28 px-6 bg-[#0a0c0d] border-b border-[#2b2f33]/40 overflow-hidden tech-dot-grid"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#0E7C7B] uppercase mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>Niche Implementations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
            Specialized Industry Focus
          </h2>
          <p className="text-sm font-light text-white/50 mt-4 leading-relaxed">
            We build solutions for businesses with complex operational workflows that cannot be solved by generic out-of-the-box software.
          </p>
        </div>

        {/* Tab Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Tab Selector Links */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {niches.map((n, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`text-left p-6 transition-all duration-300 border flex items-center justify-between group cursor-pointer ${
                  activeTab === idx
                    ? 'bg-[#101314] border-[#8FE3D0]/50 shadow-md shadow-[#8FE3D0]/5 tech-corners'
                    : 'bg-[#101314]/40 border-[#2B2F33]/40 hover:border-[#2B2F33]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded transition-colors duration-300 ${
                    activeTab === idx 
                      ? 'bg-[#0E7C7B] text-[#8FE3D0]' 
                      : 'bg-[#101314] text-white/40 group-hover:text-white'
                  }`}>
                    {n.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold uppercase transition-colors ${
                      activeTab === idx ? 'text-white' : 'text-white/60 group-hover:text-white'
                    }`}>
                      {n.title}
                    </h4>
                    <span className="text-[11px] text-white/40 block mt-0.5">{n.subtitle}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                  activeTab === idx ? 'text-[#8FE3D0] translate-x-1' : 'text-white/20 group-hover:text-white/40'
                }`} />
              </button>
            ))}
          </div>

          {/* Active Tab Panel details */}
          <div className="lg:col-span-8 hardware-panel tech-corners blueprint-panel cyber-border-draw p-8 md:p-10 flex flex-col justify-between transition-all duration-500">
            
            {/* Tag Header */}
            <div>
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#2B2F33]/40">
                <span className="text-xs font-mono text-[#8FE3D0]">{niches[activeTab].tag}</span>
                <span className="text-[10px] font-mono text-[#0E7C7B] px-2.5 py-1 rounded bg-[#0E7C7B]/10 border border-[#0E7C7B]/20">
                  SYSTEM READY
                </span>
              </div>

              {/* Description */}
              <h3 className="text-2xl font-bold uppercase text-white mb-4">
                {niches[activeTab].title}
              </h3>
              <p className="text-sm font-light text-white/70 leading-relaxed mb-8">
                {niches[activeTab].description}
              </p>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {niches[activeTab].features.map((feat, fidx) => (
                  <div key={fidx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#8FE3D0] shrink-0 mt-0.5" />
                    <span className="text-xs text-white/60 font-light leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metric Footer */}
            <div className="mt-10 pt-6 border-t border-[#2B2F33]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-white/30 uppercase block">Engineered Impact</span>
                <span className="text-sm font-mono font-bold text-white mt-1 block">
                  {niches[activeTab].metric}
                </span>
              </div>
              <div className="text-[10px] font-mono text-white/20 sm:text-right">
                STABLE RELEASE // CLOUD COMPATIBLE
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
