'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Home, Award, Settings, LogOut, Menu, X, Search, Bell } from 'lucide-react'

const NAV = [
  { href: '/ogrenci', label: 'Ana Sayfa', icon: Home },
  { href: '/ogrenci/kurslarim', label: 'Kurslarım', icon: BookOpen },
  { href: '/ogrenci/sertifikalar', label: 'Sertifikalar', icon: Award },
  { href: '/kurslar', label: 'Keşfet', icon: Search },
  { href: '/ogrenci/ayarlar', label: 'Ayarlar', icon: Settings },
]

export default function OgrenciLayout({ user, profile, children }: { user: any; profile: any; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/kurslar')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E8', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)' }}>

      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, background: 'rgba(245,240,232,.98)', borderRight: '1px solid rgba(26,26,24,.08)',
        display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
        willChange: 'transform', transform: 'translateZ(0)',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(26,26,24,.06)' }}>
          <Link href="/ogrenci" style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
            Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
          </Link>
          <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(196,80,10,.08)', border: '1px solid rgba(196,80,10,.15)', borderRadius: 100, padding: '2px 8px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#C4500A', letterSpacing: 1 }}>ÖĞRENCİ</span>
          </div>
        </div>

        {/* Profil */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(26,26,24,.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif', fontWeight: 700, color: '#C4500A', fontSize: 15, overflow: 'hidden', flexShrink: 0 }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : profile?.full_name?.[0] || '?'
            }
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name}</p>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', margin: '2px 0 0' }}>Öğrenci</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8,
                textDecoration: 'none', marginBottom: 2,
                background: active ? 'rgba(196,80,10,.08)' : 'transparent',
                color: active ? '#C4500A' : 'rgba(26,26,24,.55)',
                fontWeight: active ? 600 : 400, fontSize: 13,
                transition: 'all .15s',
              }}>
                <item.icon size={15} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Çıkış */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(26,26,24,.06)' }}>
          <button onClick={handleSignOut} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8,
            background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(26,26,24,.4)', fontSize: 13, transition: 'all .15s'
          }}>
            <LogOut size={15} /> Çıkış yap
          </button>
        </div>
      </aside>

      {/* İçerik */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}