import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('gvertex_admin_token')?.value

  if (token === 'gvertex-tony-authenticated') {
    return NextResponse.json({ authenticated: true })
  }

  return NextResponse.json({ authenticated: false })
}
