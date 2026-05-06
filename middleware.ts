import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// In-memory rate limiter (Vercel Edge compatible)
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const record = rateLimit.get(ip)

  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= limit) return false

  record.count++
  return true
}

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const pathname = request.nextUrl.pathname

  // Auth endpoint'lerine rate limiting — 10 istek/dakika
  if (pathname.startsWith('/auth') || pathname.startsWith('/api/auth')) {
    const allowed = checkRateLimit(`auth:${ip}`, 10, 60 * 1000)
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Çok fazla istek. Lütfen bir dakika bekleyin.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }
  }

  // API endpoint'lerine rate limiting — 60 istek/dakika
  if (pathname.startsWith('/api/')) {
    const allowed = checkRateLimit(`api:${ip}`, 60, 60 * 1000)
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Çok fazla istek. Lütfen bekleyin.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options || {})
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Korumalı sayfalar
  const protectedRoutes = [
    '/dashboard', '/profile', '/startup', '/feed', '/mesajlar',
    '/garaj', '/kahve', '/takas', '/kesfet', '/eslestirme',
    '/harita', '/kaynaklar', '/kutuphane', '/demo-day', '/office-hours',
    '/yatirimci', '/sirket', '/kurslar/egitmen', '/kurslar/ogrencim',
    '/ayarlar', '/workspace',
  ]
  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}