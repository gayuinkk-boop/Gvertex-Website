import { createClient } from '@/lib/supabase/server'
import { leadFormSchema } from '@/lib/validation'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin') || headersList.get('referer')

    // 1. Origin verification
    if (origin) {
      try {
        const originUrl = new URL(origin)
        const hostname = originUrl.hostname
        const allowedDomains = ['localhost', 'gvertex.com', 'vercel.app']
        const isAllowed = allowedDomains.some(domain => 
          hostname === domain || hostname.endsWith('.' + domain)
        )
        if (!isAllowed) {
          return new NextResponse('Forbidden: Invalid Origin', { status: 403 })
        }
      } catch {
        return new NextResponse('Forbidden: Invalid Origin Header', { status: 403 })
      }
    }

    // Parse the request body
    const body = await request.json()

    // 2. Honeypot check (bot prevention)
    if (body.honeypot && body.honeypot.trim() !== '') {
      // Silently discard/mock success to avoid telling the bot it failed
      return NextResponse.json({ success: true, message: 'Lead submitted successfully (honeypot triggered)' })
    }

    // 3. Zod schema validation
    const validation = leadFormSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        errors: validation.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const { 
      name, email, company, contact_number, calling_number, 
      state, city, problem_statement, more_details, services_required 
    } = validation.data
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || headersList.get('x-real-ip') || '127.0.0.1'

    const supabase = await createClient()

    // 4. Rate Limiting Check (Fallback to Supabase logs querying if Upstash is not set up)
    const isUpstashConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    
    if (isUpstashConfigured) {
      try {
        const url = process.env.UPSTASH_REDIS_REST_URL!
        const token = process.env.UPSTASH_REDIS_REST_TOKEN!
        const key = `rate-limit:lead:${ip}`
        
        // Fetch current count
        const getRes = await fetch(`${url}/get/${key}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await getRes.json()
        const count = data.result ? parseInt(data.result, 10) : 0

        if (count >= 5) {
          return NextResponse.json({ 
            success: false, 
            message: 'Too many submissions. Please try again in an hour.' 
          }, { status: 429 })
        }

        // Increment count and set 1 hour expire (3600 seconds)
        await fetch(`${url}/multi`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify([
            ['INCR', key],
            ['EXPIRE', key, 3600]
          ])
        })
      } catch (err) {
        console.error('Upstash Rate Limiting Error:', err)
        // Proceed to let it pass if rate limiting service is down
      }
    } else {
      // Fallback Supabase check. Uses the anon key. 
      // NOTE: For safety, if user does not configure service role and read on anon is blocked by RLS,
      // this check might fail. We wrap it in try/catch so the form still submits if the policy is strict.
      try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
        const { count, error } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('ip_address', ip)
          .gte('created_at', oneHourAgo)
        
        if (!error && count !== null && count >= 5) {
          return NextResponse.json({ 
            success: false, 
            message: 'Too many submissions. Please try again in an hour.' 
          }, { status: 429 })
        }
      } catch (err) {
        console.error('Supabase Rate Limiting Fallback Error:', err)
      }
    }

    // 5. Supabase Insertion
    let insertError = null
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const isPlaceholder = supabaseUrl.includes('placeholder.supabase.co')

    if (isPlaceholder) {
      console.warn('[DEV MOCK] Supabase is not configured. Simulating successful insertion for lead:', name)
    } else {
      try {
        const { error } = await supabase
          .from('leads')
          .insert({
            name,
            email,
            company,
            contact_number,
            calling_number,
            state,
            city,
            problem_statement,
            more_details: more_details || '',
            services_required: services_required.join(', '),
            ip_address: ip
          })
        insertError = error
      } catch (err: any) {
        console.error('Supabase DB Exception:', err)
        if (process.env.NODE_ENV === 'development') {
          console.warn('[DEV MOCK] DB exception. Falling back to local mock success.')
        } else {
          insertError = err
        }
      }
    }

    if (insertError) {
      console.error('Database Insertion Error:', insertError)
      return NextResponse.json({ 
        success: false, 
        message: 'Database error. Could not record lead.' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead recorded successfully.' 
    })
  } catch (error) {
    console.error('Lead Capture API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'An unexpected server error occurred.' 
    }, { status: 500 })
  }
}
