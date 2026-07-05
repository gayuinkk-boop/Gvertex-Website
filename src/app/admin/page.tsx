'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Terminal, Lock, User, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Administrative credentials mismatch.')
      }

      // Success, route to secure dashboard
      router.push('/admin/dashboard')
    } catch (err: any) {
      setErrorMsg(err.message || 'Access Denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0c0d] text-white flex items-center justify-center p-6 relative font-sans">
      
      {/* Background Blueprint Grid Lines */}
      <div className="absolute inset-0 tech-line-grid opacity-35 pointer-events-none" />
      
      {/* Visual top bar glow */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#0E7C7B] to-transparent" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Core console wrapper */}
        <div className="hardware-panel tech-corners console-panel p-8 md:p-10 border border-[#2B2F33] hover:border-[#8FE3D0]/40 transition-colors duration-500 shadow-2xl shadow-black/80">
          
          {/* Header Title HUD */}
          <div className="text-center mb-8 border-b border-[#2B2F33] pb-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8FE3D0] uppercase tracking-wider mb-2">
              <Terminal className="w-3.5 h-3.5 animate-pulse" />
              <span>Security Protocols Active</span>
            </div>
            <h1 className="text-xl font-black tracking-wider uppercase text-white">Administrative Portal</h1>
            <span className="text-[9px] font-mono text-white/30 block mt-1">GVERTEX TECHNOLOGIES // SYS-AUTH.V2</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                &gt; Administrative ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40 font-mono text-sm">&gt;</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0a0c0d] border border-[#2B2F33] focus:border-[#8FE3D0] pl-8 pr-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors duration-300"
                  placeholder="username"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                &gt; Access Key
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40 font-mono text-sm">&gt;</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0c0d] border border-[#2B2F33] focus:border-[#8FE3D0] pl-8 pr-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors duration-300"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Security Feedback message */}
            {errorMsg && (
              <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-900/50 text-red-400 text-[10px] font-mono leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold block">[ SECURITY NOTICE ]</span>
                  <span>{errorMsg.toUpperCase()}</span>
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0E7C7B] hover:bg-[#8FE3D0] hover:text-[#101314] text-white font-mono uppercase tracking-wider text-xs cyber-btn font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating Signature...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Grant Access
                </>
              )}
            </button>

          </form>

          {/* Footer Back Link */}
          <div className="mt-8 text-center pt-4 border-t border-[#2B2F33]/40">
            <Link 
              href="/" 
              className="text-[10px] font-mono text-white/40 hover:text-white transition-colors"
            >
              &lt; Return to Operations Dashboard
            </Link>
          </div>

        </div>

      </div>
    </main>
  )
}
