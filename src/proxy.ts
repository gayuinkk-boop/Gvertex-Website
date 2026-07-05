import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const adminToken = request.cookies.get('gvertex_admin_token')?.value
  const path = request.nextUrl.pathname
  const isAdminDashboard = path.startsWith('/admin/dashboard')

  if (isAdminDashboard && adminToken !== 'gvertex-tony-authenticated') {
    const redirectUrl = new URL('/admin', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Set HTTP security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Custom Content-Security-Policy supporting Framer Motion styles, Google Fonts, and Supabase WebSockets
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
  )

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
