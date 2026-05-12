'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, X, TrendingUp, BookOpen, Users, FileText, ArrowRight, Clock } from 'lucide-react'

type Result = {
  id: string
  type: 'startup' | 'user' | 'course' | 'resource'
  title: string
  subtitle?: string
  href: string
  avatar?: string
}

const TYPE_ICONS = {
  startup: TrendingUp,
  user: Users,
  course: BookOpen,
  resource: FileText,
}

const TYPE_LABELS = {
  startup: 'Startup',
  user: 'Kullanıcı',
  course: 'Kurs',
  resource: 'Kaynak',
}

const TYPE_COLORS = {
  startup: 'text-brand bg-brand/8',
  user: 'text-blue-600 bg-blue-50',
  course: 'text-purple-600 bg-purple-50',
  resource: 'text-green-600 bg-green-50',
}

const RECENT_KEY = 'campuswe-recent-searches'

export default function GlobalSearch() {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)
  const [recent, setRecent] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  // Cmd+K veya Ctrl+K ile aç
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Açılınca input'a odaklan
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      const saved = localStorage.getItem(RECENT_KEY)
      if (saved) setRecent(JSON.parse(saved))
    } else {
      setQuery('')
      setResults([])
      setSelected(0)
    }
  }, [open])

  const NAV_ITEMS = [
    { title: 'Dashboard', href: '/dashboard', subtitle: 'Ana panel' },
    { title: 'Akış', href: '/feed', subtitle: 'Topluluk paylaşımları' },
    { title: 'Mesajlar', href: '/mesajlar', subtitle: 'Konuşmalar' },
    { title: 'Harita', href: '/harita', subtitle: 'Girişimci haritası' },
    { title: 'Startuplar', href: '/kesfet', subtitle: 'Tüm startuplar' },
    { title: 'Co-founder', href: '/eslestirme', subtitle: 'Co-founder bul' },
    { title: 'Garaj', href: '/garaj', subtitle: 'Etkinlikler' },
    { title: 'Kahve Molası', href: '/kahve', subtitle: 'Biriyle tanış' },
    { title: 'Takas', href: '/takas', subtitle: 'Karma token takası' },
    { title: 'Mentorlar', href: '/office-hours', subtitle: 'Office hours' },
    { title: 'Demo Day', href: '/demo-day', subtitle: 'Pitch yap' },
    { title: 'Yatırımcılar', href: '/yatirimcilar', subtitle: 'Yatırımcı ağı' },
    { title: 'Şirketler', href: '/sirketler', subtitle: 'Şirket ilanları' },
    { title: 'Kaynaklar', href: '/kaynaklar', subtitle: 'Startup kaynakları' },
    { title: 'Kütüphane', href: '/kutuphane', subtitle: 'Kütüphane' },
    { title: 'Kurslar', href: '/kurslar', subtitle: 'Eğitim kursları' },
    { title: 'Kurslarım', href: '/kurslar/ogrencim', subtitle: 'Kayıtlı olduğum kurslar' },
    { title: 'Eğitmen Paneli', href: '/kurslar/egitmen', subtitle: 'Kurs yönetimi ve gelir' },
    { title: 'Eğitmen Ol', href: '/kurslar/egitmen-ol', subtitle: 'Kurs oluştur kazan' },
    { title: 'Fırsatlar', href: '/firsatlar', subtitle: 'İş ilanları ve etkinlikler' },
    { title: 'İş İlanları', href: '/firsatlar', subtitle: 'Şirketlerin açık pozisyonları' },
    { title: 'Startup Oluştur', href: '/startup/new', subtitle: 'Yeni startup' },
    { title: 'Çalışma Alanı', href: '/workspace', subtitle: 'Takım workspace' },
    { title: 'Profil', href: '/profile', subtitle: 'Profilim' },
    { title: 'Profil Düzenle', href: '/profile/edit', subtitle: 'Bilgilerini güncelle' },
    { title: 'Ayarlar', href: '/ayarlar', subtitle: 'Hesap ayarları' },
    { title: 'Bildirimler', href: '/bildirimler', subtitle: 'Bildirimler' },
  ]

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)

    // Sidebar nav linklerinde ara
    const navResults: Result[] = NAV_ITEMS
      .filter(item =>
        item.title.toLowerCase().includes(q.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(q.toLowerCase())
      )
      .map(item => ({
        id: item.href,
        type: 'resource' as const,
        title: item.title,
        subtitle: item.subtitle,
        href: item.href,
      }))

    const [startups, users, courses, resources] = await Promise.all([
      supabase.from('startups').select('id, name, slug, sector, stage')
        .ilike('name', `%${q}%`).eq('is_public', true).limit(3),
      supabase.from('profiles').select('id, full_name, username, university, avatar_url')
        .ilike('full_name', `%${q}%`).limit(3),
      supabase.from('courses').select('id, title, category')
        .ilike('title', `%${q}%`).eq('is_published', true).limit(3),
      supabase.from('resources').select('id, title, category')
        .ilike('title', `%${q}%`).limit(2),
    ])

    const all: Result[] = [
      ...navResults,
      ...(startups.data || []).map(s => ({
        id: s.id, type: 'startup' as const,
        title: s.name,
        subtitle: [s.sector, s.stage].filter(Boolean).join(' · '),
        href: `/startup/${s.slug}`,
      })),
      ...(users.data || []).map(u => ({
        id: u.id, type: 'user' as const,
        title: u.full_name,
        subtitle: u.university || `@${u.username}`,
        href: `/profile/${u.username || u.id}`,
        avatar: u.avatar_url,
      })),
      ...(courses.data || []).map(c => ({
        id: c.id, type: 'course' as const,
        title: c.title,
        subtitle: c.category,
        href: `/kurslar/${c.id}`,
      })),
      ...(resources.data || []).map(r => ({
        id: r.id, type: 'resource' as const,
        title: r.title,
        subtitle: r.category,
        href: `/kaynaklar`,
      })),
    ]

    setResults(all)
    setSelected(0)
    setLoading(false)
  }, [])

  // Debounce arama
  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(query), 300)
    return () => clearTimeout(timerRef.current)
  }, [query])

  function saveRecent(q: string) {
    if (!q.trim()) return
    const updated = [q, ...recent.filter(r => r !== q)].slice(0, 5)
    setRecent(updated)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  }

  function navigate(href: string, q?: string) {
    if (q) saveRecent(q)
    setOpen(false)
    router.push(href)
  }

  // Klavye navigasyonu
  function handleKeyDown(e: React.KeyboardEvent) {
    const items = results.length > 0 ? results : []
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, items.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && items[selected]) navigate(items[selected].href, query)
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink/55 hover:bg-neutral-100 hover:text-ink transition-colors">
      <Search size={15} className="text-ink/40" />
      <span className="flex-1 text-left">Ara...</span>
      <kbd className="mono text-xs bg-neutral-100 text-ink/30 px-1.5 py-0.5 rounded">⌘K</kbd>
    </button>
  )

  return (
    <div className="relative">
      {/* Overlay — sadece dışarı tıklayınca kapat */}
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

      {/* Inline arama kutusu */}
      <div className="relative z-50">
        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 border border-brand/20">
          <Search size={14} className="text-brand/60 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Ara..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm text-ink placeholder:text-ink/35 outline-none bg-transparent min-w-0"
          />
          {loading
            ? <div className="w-3 h-3 border-2 border-brand/30 border-t-brand rounded-full animate-spin flex-shrink-0" />
            : <button onClick={() => setOpen(false)} className="text-ink/25 hover:text-ink flex-shrink-0"><X size={13} /></button>
          }
        </div>

        {/* Sonuçlar dropdown */}
        {query && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-cream border border-neutral-200 rounded-xl shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
            {results.length > 0 ? results.map((r, i) => {
              const Icon = TYPE_ICONS[r.type]
              return (
                <button key={r.id} onClick={() => navigate(r.href, query)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                    selected === i ? 'bg-brand/8' : 'hover:bg-brand/5'
                  }`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[r.type]}`}>
                    {r.avatar
                      ? <img src={r.avatar} alt="" className="w-full h-full object-cover rounded-lg" />
                      : <Icon size={12} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink truncate">{r.title}</p>
                    {r.subtitle && <p className="mono text-xs text-ink/30 truncate">{r.subtitle}</p>}
                  </div>
                  <span className={`mono text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${TYPE_COLORS[r.type]}`} style={{fontSize: 9}}>
                    {TYPE_LABELS[r.type]}
                  </span>
                </button>
              )
            }) : (
              <div className="py-6 text-center">
                <p className="text-xs text-ink/35">"{query}" için sonuç yok.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}