'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, User, LayoutDashboard } from 'lucide-react'

type NavbarProps = {
  user?: { email?: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="border-b border-ink/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg font-bold text-ink">
          Campus<em className="text-brand not-italic">We</em>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <Link
                href="/kesfet"
                className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
              >
                Keşfet
              </Link>
              <Link
                href="/garaj"
                className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
              >
                Garaj
              </Link>
              <Link
                href="/kahve"
                className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
              >
                Kahve
              </Link>
              <Link
                href="/office-hours"
                className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
              >
                Mentorlar
              </Link>
              <Link
                href="/demo-day"
                className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
              >
                Demo Day
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
              >
                <User size={14} />
                Profil
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm text-ink/40 hover:text-ink transition-colors"
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary py-1.5 px-4 text-xs">
                Giriş yap
              </Link>
              <Link href="/auth/register" className="btn-primary py-1.5 px-4 text-xs">
                Kayıt ol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}