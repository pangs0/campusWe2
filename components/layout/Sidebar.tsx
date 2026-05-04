'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Globe, Compass, Home, Coffee,
  ArrowLeftRight, Clock, Star, BookOpen, User, LogOut, Zap
} from 'lucide-react'

type SidebarProps = {
  user?: { email?: string } | null
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/harita', label: 'Harita', icon: Globe },
  { href: '/kesfet', label: 'Keşfet', icon: Compass },
  { href: '/garaj', label: 'Garaj', icon: Home },
  { href: '/kahve', label: 'Kahve Molası', icon: Coffee },
  { href: '/takas', label: 'Takas', icon: ArrowLeftRight },
  { href: '/office-hours', label: 'Mentorlar', icon: Clock },
  { href: '/demo-day', label: 'Demo Day', icon: Star },
  { href: '/kutuphane', label: 'Kütüphane', icon: BookOpen },
]

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!user) return null

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-cream border-r border-neutral-200 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-neutral-200">
        <Link href="/" className="font-serif text-xl font-bold text-ink">
          Campus<em className="text-brand not-italic">We</em>
        </Link>
      </div>

      {/* Nav linkleri */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-brand/10 text-brand font-medium'
                    : 'text-ink/55 hover:bg-neutral-100 hover:text-ink'
                }`}
              >
                <item.icon size={15} className={active ? 'text-brand' : 'text-ink/40'} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Alt kısım — profil ve çıkış */}
      <div className="border-t border-neutral-200 p-3 space-y-0.5">
        <Link
          href="/profile"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/profile'
              ? 'bg-brand/10 text-brand font-medium'
              : 'text-ink/55 hover:bg-neutral-100 hover:text-ink'
          }`}
        >
          <User size={15} className="text-ink/40" />
          Profil
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink/40 hover:bg-neutral-100 hover:text-ink transition-colors"
        >
          <LogOut size={15} />
          Çıkış yap
        </button>
      </div>
    </aside>
  )
}