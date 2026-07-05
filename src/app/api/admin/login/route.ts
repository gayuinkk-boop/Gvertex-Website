import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (username === 'gvertex-tony' && password === 'Ironman@3000') {
      const response = NextResponse.json({ success: true, message: 'Authorization granted.' })
      
      // Set secure HTTP-only session cookie
      response.cookies.set('gvertex_admin_token', 'gvertex-tony-authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days session lifespan
      })

      return response
    }

    return NextResponse.json({ success: false, message: 'Invalid Administrative Credentials' }, { status: 401 })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Bad request payload' }, { status: 400 })
  }
}
