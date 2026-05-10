'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Plus, ExternalLink, FileText, DollarSign, Scale, Megaphone, Code, HelpCircle, Search, Heart, Star, Filter } from 'lucide-react'

const CATEGORIES = [
  { key: 'hepsi', label: 'Tümü', icon: BookOpen, color: 'bg-neutral-100 text-ink/60 border-neutral-200' },
  { key: 'pitch_deck', label: 'Pitch Deck', icon: FileText, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'yatirimci', label: 'Yatırımcı', icon: DollarSign, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'hukuk', label: 'Hukuk', icon: Scale, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'finans', label: 'Finans', icon: DollarSign, color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'pazarlama', label: 'Pazarlama', icon: Megaphone, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { key: 'teknik', label: 'Teknik', icon: Code, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { key: 'diger', label: 'Diğer', icon: HelpCircle, color: 'bg-neutral-50 text-neutral-600 border-neutral-200' },
]

type Props = { userId: string; resources: any[] }

export default function KaynaklarClient({ userId, resources }: Props) {
  const supabase = createClient()
  const [activeCategory, setActiveCategory] = useState('hepsi')
  const [search, setSearch] = useState('')
  const [onlyFree, setOnlyFree] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
    Object.fromEntries(resources.map(r => [r.id, r.likes || 0]))
  )

  const filtered = resources.filter(r => {
    if (activeCategory !== 'hepsi' && r.category !== activeCategory) return false
    if (onlyFree && !r.is_free) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
        !r.description?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // Popüler olanları öne al
  const sorted = [...filtered].sort((a, b) => (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0))

  async function toggleLike(resourceId: string) {
    const isLiked = liked.has(resourceId)
    setLiked(prev => {
      const next = new Set(Array.from(prev))
      isLiked ? next.delete(resourceId) : next.add(resourceId)
      return next
    })
    setLikeCounts(prev => ({
      ...prev,
      [resourceId]: (prev[resourceId] || 0) + (isLiked ? -1 : 1)
    }))
  }

  const catObj = CATEGORIES.find(c => c.key === activeCategory)

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">KAYNAKLAR</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Girişimci araç kutusu.</h1>
          <p className="text-sm text-ink/45 mt-1">Pitch deck, yatırımcı listesi, hukuki belgeler ve daha fazlası.</p>
        </div>
        <Link href="/kaynaklar/yeni" className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={13} /> Kaynak ekle
        </Link>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { n: resources.length, l: 'Toplam kaynak' },
          { n: resources.filter(r => r.is_free).length, l: 'Ücretsiz' },
          { n: CATEGORIES.length - 1, l: 'Kategori' },
          { n: resources.reduce((sum, r) => sum + (r.likes || 0), 0), l: 'Toplam beğeni' },
        ].map((s, i) => (
          <div key={i} className="card text-center py-3">
            <p className="font-serif text-2xl font-bold text-ink">{s.n}</p>
            <p className="mono text-xs text-ink/35 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Arama + filtreler */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input type="text" className="input pl-9 py-2 text-sm" placeholder="Kaynak ara..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/55 cursor-pointer">
          <input type="checkbox" checked={onlyFree} onChange={e => setOnlyFree(e.target.checked)}
            className="accent-brand w-4 h-4" />
          Sadece ücretsiz
        </label>
      </div>

      {/* Kategori filtreleri */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
            className={`inline-flex items-center gap-1.5 mono text-xs border rounded-full px-3 py-1.5 transition-colors ${
              activeCategory === cat.key
                ? 'bg-ink text-white border-ink'
                : `${cat.color} hover:opacity-80`
            }`}>
            <cat.icon size={11} />
            {cat.label}
            <span className="opacity-60">
              ({cat.key === 'hepsi' ? resources.length : resources.filter(r => r.category === cat.key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Kaynaklar grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {sorted.map((r: any) => {
            const cat = CATEGORIES.find(c => c.key === r.category) || CATEGORIES[CATEGORIES.length - 1]
            const isLiked = liked.has(r.id)
            return (
              <div key={r.id} className="card hover:border-brand/25 transition-colors group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 mono text-xs border rounded px-2 py-0.5 ${cat.color}`}>
                    <cat.icon size={10} /> {cat.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {r.is_free && (
                      <span className="mono text-xs text-green-600 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">Ücretsiz</span>
                    )}
                    {r.url && r.url !== '#' && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer"
                        className="text-ink/25 hover:text-brand transition-colors">
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>

                <h2 className="font-serif font-bold text-ink text-sm mb-1 group-hover:text-brand transition-colors">
                  {r.title}
                </h2>
                {r.description && (
                  <p className="text-xs text-ink/50 leading-relaxed line-clamp-2 mb-3">{r.description}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  {r.added_by_profile?.full_name ? (
                    <p className="mono text-xs text-ink/30">
                      {r.added_by_profile.full_name} tarafından eklendi
                    </p>
                  ) : (
                    <p className="mono text-xs text-ink/20">CampusWe</p>
                  )}
                  <button onClick={() => toggleLike(r.id)}
                    className="flex items-center gap-1 text-xs transition-colors hover:text-brand">
                    <Heart size={12} className={isLiked ? 'fill-brand text-brand' : 'text-ink/25'} />
                    <span className={`mono ${isLiked ? 'text-brand' : 'text-ink/30'}`}>
                      {likeCounts[r.id] || 0}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
          <BookOpen size={36} className="text-ink/15 mx-auto mb-3" />
          <p className="font-serif text-lg font-bold text-ink/40 mb-1">
            {search ? `"${search}" için sonuç bulunamadı.` : 'Bu kategoride kaynak yok.'}
          </p>
          <p className="text-sm text-ink/30 mb-5">İlk kaynağı ekleyen sen ol.</p>
          <Link href="/kaynaklar/yeni" className="btn-primary inline-flex items-center gap-1.5 text-sm">
            <Plus size={13} /> Kaynak ekle
          </Link>
        </div>
      )}
    </div>
  )
}