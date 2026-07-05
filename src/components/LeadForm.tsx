'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadFormSchema, type LeadFormInput } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Terminal, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

export default function LeadForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sameAsContact, setSameAsContact] = useState(false)
  
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      contact_number: '',
      calling_number: '',
      state: '',
      city: '',
      problem_statement: '',
      more_details: '',
      services_required: []
    }
  })

  // Watch contact number to copy if sameAsContact checkbox is active
  const contactVal = watch('contact_number')

  useEffect(() => {
    if (sameAsContact && contactVal) {
      setValue('calling_number', contactVal)
    }
  }, [sameAsContact, contactVal, setValue])

  const handleSameCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setSameAsContact(checked)
    if (checked && contactVal) {
      setValue('calling_number', contactVal)
    }
  }

  const onSubmit = async (data: LeadFormInput) => {
    setSubmitError(null)
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const resBody = await response.json()

      if (!response.ok || !resBody.success) {
        throw new Error(resBody.message || 'Transmission failed. Verify network connection.')
      }

      setIsSuccess(true)
      
      // Auto redirect to About Us page after 4 seconds
      setTimeout(() => {
        router.push('/about')
      }, 4000)

    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected transmission error occurred.')
    }
  }

  const availableServices = [
    { value: 'Digital Platforms & Web Experiences', label: 'Digital Platforms & Web Experiences' },
    { value: 'Client & Pipeline Management Systems', label: 'Client & Pipeline Management Systems' },
    { value: 'Business Process Automation', label: 'Business Process Automation' },
    { value: 'Tailored Operational Solutions', label: 'Tailored Operational Solutions' }
  ]

  return (
    <section 
      id="contact" 
      className="relative py-28 px-6 bg-[#0a0c0d] overflow-hidden tech-line-grid"
    >
      {/* Visual Accent */}
      <div className="absolute top-0 right-1/4 w-px h-full bg-[#2B2F33]/15 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#0E7C7B] uppercase mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>Consultation Intake</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
            Initiate Your Project
          </h2>
          <p className="text-sm font-light text-white/50 mt-4 max-w-xl mx-auto leading-relaxed">
            Specify your operational criteria and requirements below. Our systems engineering team will review the parameters.
          </p>
        </div>

        {/* Form Container */}
        <div className="hardware-panel tech-corners console-panel cyber-border-draw p-8 md:p-12 max-w-2xl mx-auto">
          {isSuccess ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-center py-8 flex flex-col items-center"
            >
              <div className="p-4 rounded-full bg-[#0E7C7B]/15 border border-[#8FE3D0]/30 text-[#8FE3D0] mb-6 animate-pulse">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-bold uppercase text-[#8FE3D0] mb-4 text-cyber-glow">Transmission Transmitted</h3>
              <p className="text-sm font-light text-white/80 max-w-md leading-relaxed mb-6 font-mono">
                Your request has been received by our team and we will get back to you within 2 working days.
              </p>
              <div className="text-xs font-mono text-white/35 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#8FE3D0]" />
                <span>Redirecting to About Us in 4 seconds...</span>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('honeypot')}
                  placeholder="Leave empty"
                />
              </div>

              {/* Grid: Name / Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                    &gt; Client Name
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`w-full bg-[#0a0c0d] border font-mono px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8FE3D0] transition-colors duration-300 ${
                      errors.name ? 'border-red-500/50' : 'border-[#2B2F33]'
                    }`}
                    placeholder="e.g. Sarah Jenkins"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-400 mt-1 block font-light font-mono">{errors.name.message}</span>
                  )}
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                    &gt; Work Email
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full bg-[#0a0c0d] border font-mono px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8FE3D0] transition-colors duration-300 ${
                      errors.email ? 'border-red-500/50' : 'border-[#2B2F33]'
                    }`}
                    placeholder="s.jenkins@company.com"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-400 mt-1 block font-light font-mono">{errors.email.message}</span>
                  )}
                </div>

              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                  &gt; Company Name
                </label>
                <input
                  type="text"
                  {...register('company')}
                  className={`w-full bg-[#0a0c0d] border font-mono px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8FE3D0] transition-colors duration-300 ${
                    errors.company ? 'border-red-500/50' : 'border-[#2B2F33]'
                  }`}
                  placeholder="e.g. Global Tech Solutions"
                />
                {errors.company && (
                  <span className="text-xs text-red-400 mt-1 block font-light font-mono">{errors.company.message}</span>
                )}
              </div>

              {/* Grid: Contact Number (WA) / Calling Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contact (WhatsApp) */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                    &gt; Contact Number (Preferably WhatsApp)
                  </label>
                  <input
                    type="text"
                    {...register('contact_number')}
                    className={`w-full bg-[#0a0c0d] border font-mono px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8FE3D0] transition-colors duration-300 ${
                      errors.contact_number ? 'border-red-500/50' : 'border-[#2B2F33]'
                    }`}
                    placeholder="e.g. 7304910484"
                  />
                  {errors.contact_number && (
                    <span className="text-xs text-red-400 mt-1 block font-light font-mono">{errors.contact_number.message}</span>
                  )}
                </div>

                {/* Calling Number */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/50">
                      &gt; Calling Number
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-mono text-[#8FE3D0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsContact}
                        onChange={handleSameCheckbox}
                        className="rounded border-[#2B2F33] bg-[#0a0c0d] text-[#0E7C7B] focus:ring-0 w-3 h-3 cursor-pointer"
                      />
                      <span>Same as Contact</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={sameAsContact}
                    {...register('calling_number')}
                    className={`w-full bg-[#0a0c0d] border font-mono px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8FE3D0] transition-colors duration-300 ${
                      sameAsContact ? 'opacity-40 cursor-not-allowed border-[#2B2F33]' : errors.calling_number ? 'border-red-500/50' : 'border-[#2B2F33]'
                    }`}
                    placeholder="Calling line number"
                  />
                  {errors.calling_number && !sameAsContact && (
                    <span className="text-xs text-red-400 mt-1 block font-light font-mono">{errors.calling_number.message}</span>
                  )}
                </div>

              </div>

              {/* Grid: City / State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* City */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                    &gt; City
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className={`w-full bg-[#0a0c0d] border font-mono px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8FE3D0] transition-colors duration-300 ${
                      errors.city ? 'border-red-500/50' : 'border-[#2B2F33]'
                    }`}
                    placeholder="e.g. Mumbai"
                  />
                  {errors.city && (
                    <span className="text-xs text-red-400 mt-1 block font-light font-mono">{errors.city.message}</span>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                    &gt; State
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className={`w-full bg-[#0a0c0d] border font-mono px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8FE3D0] transition-colors duration-300 ${
                      errors.state ? 'border-red-500/50' : 'border-[#2B2F33]'
                    }`}
                    placeholder="e.g. Maharashtra"
                  />
                  {errors.state && (
                    <span className="text-xs text-red-400 mt-1 block font-light font-mono">{errors.state.message}</span>
                  )}
                </div>

              </div>

              {/* Services Required Checkboxes */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-3">
                  &gt; What all services required:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-[#0a0c0d] border border-[#2B2F33] p-4 font-mono">
                  {availableServices.map((service) => (
                    <label key={service.value} className="flex items-start gap-2.5 text-xs text-white/80 hover:text-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        value={service.value}
                        {...register('services_required')}
                        className="rounded border-[#2B2F33] bg-[#0a0c0d] text-[#0E7C7B] focus:ring-0 w-4 h-4 cursor-pointer mt-0.5"
                      />
                      <span className="leading-snug">{service.label}</span>
                    </label>
                  ))}
                </div>
                {errors.services_required && (
                  <span className="text-xs text-red-400 mt-1.5 block font-light font-mono">{errors.services_required.message}</span>
                )}
              </div>

              {/* Problem Statement */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                  &gt; Your Problem Statement
                </label>
                <textarea
                  {...register('problem_statement')}
                  rows={4}
                  className={`w-full bg-[#0a0c0d] border font-mono px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8FE3D0] transition-colors duration-300 ${
                    errors.problem_statement ? 'border-red-500/50' : 'border-[#2B2F33]'
                  }`}
                  placeholder="Describe your current system bottleneck or process gaps..."
                />
                {errors.problem_statement && (
                  <span className="text-xs text-red-400 mt-1 block font-light font-mono">{errors.problem_statement.message}</span>
                )}
              </div>

              {/* More Details */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                  &gt; More Details to write if any (Optional)
                </label>
                <textarea
                  {...register('more_details')}
                  rows={3}
                  className="w-full bg-[#0a0c0d] border font-mono px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8FE3D0] border-[#2B2F33] transition-colors duration-300"
                  placeholder="Any extra metrics, technology stacks, or system preferences..."
                />
              </div>

              {/* Error messages */}
              {submitError && (
                <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-900/50 text-red-400 text-xs font-mono">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0E7C7B] hover:bg-[#8FE3D0] hover:text-[#101314] text-white font-mono uppercase tracking-wider text-xs cyber-btn font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-md shadow-[#0E7C7B]/20 hover:shadow-[#8FE3D0]/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Transmitting payload...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    Transmit Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}
