'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Globe, Compass, Home, Coffee,
  ArrowLeftRight, Clock, Star, BookOpen, User, LogOut,
  Rss, MessageCircle, Users, Library, Settings,
  TrendingUp, Building2, Heart, Briefcase, CalendarDays, GraduationCap, MonitorPlay
} from 'lucide-react'
import NotificationBell from '@/components/layout/NotificationBell'

type SidebarProps = { user?: any }

const FOUNDER_NAV = [
  {
    label: 'Ana',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/feed', label: 'Akış', icon: Rss },
      { href: '/mesajlar', label: 'Mesajlar', icon: MessageCircle },
    ]
  },
  {
    label: 'Keşfet',
    items: [
      { href: '/harita', label: 'Harita', icon: Globe },
      { href: '/kesfet', label: 'Startuplar', icon: Compass },
      { href: '/eslestirme', label: 'Co-founder', icon: Users },
    ]
  },
  {
    label: 'Topluluk',
    items: [
      { href: '/garaj', label: 'Garaj', icon: Home },
      { href: '/kahve', label: 'Kahve Molası', icon: Coffee },
      { href: '/takas', label: 'Takas', icon: ArrowLeftRight },
    ]
  },
  {
    label: 'Startup',
    items: [
      { href: '/startup/new', label: 'Startup Oluştur', icon: TrendingUp },
      { href: '/workspace', label: 'Çalışma Alanı', icon: MonitorPlay },
    ]
  },
  {
    label: 'Büyü',
    items: [
      { href: '/office-hours', label: 'Mentorlar', icon: Clock },
      { href: '/demo-day', label: 'Demo Day', icon: Star },
      { href: '/yatirimcilar', label: 'Yatırımcılar', icon: TrendingUp },
      { href: '/sirketler', label: 'Şirketler', icon: Building2 },
      { href: '/kaynaklar', label: 'Kaynaklar', icon: Library },
      { href: '/kutuphane', label: 'Kütüphane', icon: BookOpen },
      { href: '/kurslar', label: 'Kurslar', icon: GraduationCap },
      { href: '/kurslar/egitmen-ol', label: 'Eğitmen Ol', icon: BookOpen },
    ]
  },
]

const INVESTOR_NAV = [
  {
    label: 'Panel',
    items: [
      { href: '/yatirimci', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/mesajlar', label: 'Mesajlar', icon: MessageCircle },
    ]
  },
  {
    label: 'Keşfet',
    items: [
      { href: '/yatirimci', label: 'Startuplar', icon: Compass },
      { href: '/demo-day', label: 'Demo Day', icon: Star },
    ]
  },
  {
    label: 'Portföy',
    items: [
      { href: '/yatirimci/portfoy', label: 'Portföyüm', icon: Heart },
      { href: '/yatirimci/office-hours', label: 'Office Hours', icon: Clock },
    ]
  },
]

const COMPANY_NAV = [
  {
    label: 'Panel',
    items: [
      { href: '/sirket', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/mesajlar', label: 'Mesajlar', icon: MessageCircle },
    ]
  },
  {
    label: 'Keşfet',
    items: [
      { href: '/sirket', label: 'Yetenek Keşfi', icon: Users },
      { href: '/kesfet', label: 'Startuplar', icon: Compass },
    ]
  },
  {
    label: 'Yönet',
    items: [
      { href: '/sirket/etkinlikler', label: 'Etkinlikler', icon: CalendarDays },
      { href: '/sirket/ilanlar', label: 'İş İlanları', icon: Briefcase },
    ]
  },
]

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const navRef = useRef<HTMLElement>(null)

  // Scroll pozisyonunu kaydet
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    // Kaydedilmiş pozisyonu geri yükle
    const saved = sessionStorage.getItem('sidebar-scroll')
    if (saved) nav.scrollTop = parseInt(saved)

    const handleScroll = () => {
      sessionStorage.setItem('sidebar-scroll', nav.scrollTop.toString())
    }
    nav.addEventListener('scroll', handleScroll)
    return () => nav.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!user) return null
  if (!user.id) return null

  const role = user.role || 'founder'
  const navGroups = role === 'investor' ? INVESTOR_NAV : role === 'company' ? COMPANY_NAV : FOUNDER_NAV

  const roleLabel = role === 'investor' ? 'Yatırımcı' : role === 'company' ? 'Şirket' : 'Girişimci'
  const roleColor = role === 'investor' ? 'text-amber-600 bg-amber-50' : role === 'company' ? 'text-blue-600 bg-blue-50' : 'text-brand bg-brand/8'

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-cream border-r border-neutral-200 flex flex-col z-50">
      <style>{`
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(196,80,10,.2); border-radius: 99px; }
        .sidebar-nav::-webkit-scrollbar-thumb:hover { background: rgba(196,80,10,.4); }
        .sidebar-nav { scrollbar-width: thin; scrollbar-color: rgba(196,80,10,.2) transparent; }
      `}</style>

      <div className="px-5 py-4 border-b border-neutral-200 flex-shrink-0">
        <Link href="/" className="font-serif text-xl font-bold text-ink block mb-2">
          Campus<em className="text-brand not-italic">We</em>
        </Link>
        <span className={`mono text-xs px-2 py-0.5 rounded-full font-medium ${roleColor}`}>
          {roleLabel}
        </span>
      </div>

      <nav ref={navRef} className="sidebar-nav flex-1 overflow-y-auto py-3 px-3">
        {navGroups.map(group => (
          <div key={group.label} className="mb-4">
            <p className="mono text-xs text-ink/25 tracking-widest px-3 mb-1">{group.label.toUpperCase()}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link key={item.href + item.label} href={item.href} prefetch={true}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active ? 'bg-brand/10 text-brand font-medium' : 'text-ink/55 hover:bg-neutral-100 hover:text-ink'
                    }`}>
                    <item.icon size={15} className={active ? 'text-brand' : 'text-ink/40'} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-neutral-200 p-3 space-y-0.5 flex-shrink-0">
        <NotificationBell userId={user.id} />
        <Link href="/profile"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/profile' ? 'bg-brand/10 text-brand font-medium' : 'text-ink/55 hover:bg-neutral-100 hover:text-ink'
          }`}>
          <User size={15} className="text-ink/40" />
          Profil
        </Link>
        <Link href="/ayarlar"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/ayarlar' ? 'bg-brand/10 text-brand font-medium' : 'text-ink/55 hover:bg-neutral-100 hover:text-ink'
          }`}>
          <Settings size={15} className="text-ink/40" />
          Ayarlar
        </Link>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink/40 hover:bg-neutral-100 hover:text-ink transition-colors">
          <LogOut size={15} />
          Çıkış yap
        </button>
      </div>
    </aside>
  )
}