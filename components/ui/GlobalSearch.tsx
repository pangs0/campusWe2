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

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)

    const [startups, users, courses, resources] = await Promise.all([
      supabase.from('startups').select('id, name, slug, sector, stage')
        .ilike('name', `%${q}%`).eq('is_public', true).limit(4),
      supabase.from('profiles').select('id, full_name, username, university, avatar_url')
        .ilike('full_name', `%${q}%`).limit(3),
      supabase.from('courses').select('id, title, category')
        .ilike('title', `%${q}%`).eq('is_published', true).limit(3),
      supabase.from('resources').select('id, title, category')
        .ilike('title', `%${q}%`).limit(3),
    ])

    const all: Result[] = [
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
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Modal */}
      <div className="fixed top-[12%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl px-4" style={{ marginLeft: 112 }}>
        <div className="bg-cream rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">

          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200">
            <Search size={16} className="text-ink/30 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Startup, kullanıcı, kurs veya kaynak ara..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-sm text-ink placeholder:text-ink/30 outline-none bg-transparent"
            />
            {loading && (
              <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin flex-shrink-0" />
            )}
            <button onClick={() => setOpen(false)} className="text-ink/25 hover:text-ink transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>

          {/* Sonuçlar */}
          <div className="max-h-96 overflow-y-auto">
            {query && results.length > 0 ? (
              <div className="py-2">
                {results.map((r, i) => {
                  const Icon = TYPE_ICONS[r.type]
                  return (
                    <button key={r.id} onClick={() => navigate(r.href, query)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        selected === i ? 'bg-brand/8' : 'hover:bg-brand/5'
                      }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[r.type]}`}>
                        {r.avatar
                          ? <img src={r.avatar} alt="" className="w-full h-full object-cover rounded-lg" />
                          : <Icon size={14} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{r.title}</p>
                        {r.subtitle && <p className="mono text-xs text-ink/35 truncate">{r.subtitle}</p>}
                      </div>
                      <span className={`mono text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[r.type]}`}>
                        {TYPE_LABELS[r.type]}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : query && !loading ? (
              <div className="py-12 text-center">
                <Search size={28} className="text-ink/15 mx-auto mb-2" />
                <p className="text-sm text-ink/35">"{query}" için sonuç bulunamadı.</p>
              </div>
            ) : !query ? (
              <div className="py-2">
                {recent.length > 0 && (
                  <div className="mb-1">
                    {recent.map((r, i) => (
                      <button key={i} onClick={() => setQuery(r)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 transition-colors text-left">
                        <Clock size={14} className="text-ink/25 flex-shrink-0" />
                        <span className="text-sm text-ink/55">{r}</span>
                      </button>
                    ))}
                    <div className="border-t border-neutral-200 mx-4 my-1" />
                  </div>
                )}
                {[
                  { label: 'Tüm startuplar', href: '/startuplar', icon: TrendingUp },
                  { label: 'Kurslar', href: '/kurslar', icon: BookOpen },
                  { label: 'Kaynaklar', href: '/kaynaklar', icon: FileText },
                  { label: 'Co-founder bul', href: '/eslestirme', icon: Users },
                ].map(item => (
                  <button key={item.href} onClick={() => navigate(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 transition-colors text-left group">
                    <div className="w-8 h-8 rounded-lg bg-neutral-200/60 flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} className="text-ink/40" />
                    </div>
                    <span className="text-sm text-ink/55 group-hover:text-ink transition-colors">{item.label}</span>
                    <ArrowRight size={13} className="text-ink/20 ml-auto group-hover:text-brand transition-colors" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-4 py-2 flex items-center gap-4 bg-neutral-100/50">
            <div className="flex items-center gap-1.5">
              <kbd className="mono text-xs bg-neutral-100 text-ink/30 px-1.5 py-0.5 rounded">↑↓</kbd>
              <span className="mono text-xs text-ink/25">seç</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="mono text-xs bg-neutral-100 text-ink/30 px-1.5 py-0.5 rounded">↵</kbd>
              <span className="mono text-xs text-ink/25">git</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="mono text-xs bg-neutral-100 text-ink/30 px-1.5 py-0.5 rounded">Esc</kbd>
              <span className="mono text-xs text-ink/25">kapat</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}