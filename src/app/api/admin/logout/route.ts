import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out.' })
  
  // Clear administrative session cookie
  response.cookies.set('gvertex_admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0 // Expire instantly
  })

  return response
}
