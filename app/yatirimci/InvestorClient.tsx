'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Star, Search, Filter, Heart, MessageCircle, TrendingUp, Calendar, Building2, Edit3, Check } from 'lucide-react'

type Props = {
  userId: string
  profile: any
  investorProfile: any
  startups: any[]
  favorites: any[]
  favoriteIds: string[]
  demoApps: any[]
}

const SECTORS = ['Tümü', 'EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'CleanTech', 'SaaS', 'Yapay Zeka']
const STAGES = ['Tümü', 'fikir', 'mvp', 'traction', 'büyüme']
const TABS = ['Startuplar', 'Favorilerim', 'Demo Day', 'Profilim']

const stageColors: Record<string, string> = {
  fikir: 'bg-amber-50 text-amber-700 border-amber-200',
  mvp: 'bg-blue-50 text-blue-700 border-blue-200',
  traction: 'bg-purple-50 text-purple-700 border-purple-200',
  büyüme: 'bg-green-50 text-green-700 border-green-200',
}

export default function InvestorClient({ userId, profile, investorProfile, startups, favorites: initialFavorites, favoriteIds: initialFavoriteIds, demoApps }: Props) {
  const supabase = createClient()
  const [tab, setTab] = useState('Startuplar')
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('Tümü')
  const [stage, setStage] = useState('Tümü')
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(initialFavoriteIds))
  const [favorites, setFavorites] = useState(initialFavorites)
  const [editingProfile, setEditingProfile] = useState(false)
  const [invForm, setInvForm] = useState({
    firm_name: investorProfile?.firm_name || '',
    title: investorProfile?.title || '',
    bio: investorProfile?.bio || '',
    ticket_size: investorProfile?.ticket_size || '',
    website: investorProfile?.website || '',
    linkedin: investorProfile?.linkedin || '',
  })
  const [saving, setSaving] = useState(false)

  const filtered = startups.filter(s => {
    const matchSearch = s.name?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase())
    const matchSector = sector === 'Tümü' || s.sector === sector
    const matchStage = stage === 'Tümü' || s.stage === stage
    return matchSearch && matchSector && matchStage
  })

  async function toggleFavorite(startupId: string) {
    if (favoriteIds.has(startupId)) {
      await supabase.from('investor_favorites').delete().eq('investor_id', userId).eq('startup_id', startupId)
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(startupId); return s })
      setFavorites(prev => prev.filter(f => f.startup_id !== startupId))
    } else {
      await supabase.from('investor_favorites').insert({ investor_id: userId, startup_id: startupId })
      setFavoriteIds(prev => new Set([...prev, startupId]))
      const startup = startups.find(s => s.id === startupId)
      if (startup) setFavorites(prev => [...prev, { startup_id: startupId, startup }])
    }
  }

  async function saveProfile() {
    setSaving(true)
    await supabase.from('investor_profiles').upsert({ id: userId, ...invForm })
    setEditingProfile(false)
    setSaving(false)
  }

  function healthScore(startup: any) {
    let score = 0
    if (startup.description?.length > 50) score += 20
    if (startup.sector) score += 20
    if (startup.startup_updates?.length > 0) score += 20
    if (startup.stage !== 'fikir') score += 20
    if (startup.founder?.user_skills?.length > 0) score += 20
    return score
  }

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">YATIRIMCI PANELİ</p>
          <h1 className="font-serif text-3xl font-bold text-ink">
            {invForm.firm_name || profile?.full_name || 'Yatırımcı'}
          </h1>
          {invForm.title && <p className="text-sm text-ink/45 mt-1">{invForm.title}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="card px-4 py-2 flex items-center gap-2">
            <Star size={13} className="text-amber-500 fill-amber-500" />
            <span className="mono text-sm font-medium text-ink">{favorites.length} favori</span>
          </div>
          <div className="card px-4 py-2 flex items-center gap-2">
            <TrendingUp size={13} className="text-brand" />
            <span className="mono text-sm font-medium text-ink">{startups.length} startup</span>
          </div>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-1 mb-6 border-b border-neutral-200">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-brand text-brand' : 'border-transparent text-ink/45 hover:text-ink'}`}>
            {t}
            {t === 'Favorilerim' && favorites.length > 0 && (
              <span className="ml-1.5 bg-brand text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">{favorites.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Startuplar */}
      {tab === 'Startuplar' && (
        <div>
          <div className="flex gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
              <input className="input pl-9 text-sm" placeholder="Startup ara..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input w-36 text-sm" value={sector} onChange={e => setSector(e.target.value)}>
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="input w-32 text-sm" value={stage} onChange={e => setStage(e.target.value)}>
              {STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filtered.map((startup: any) => {
              const score = healthScore(startup)
              const isFav = favoriteIds.has(startup.id)
              return (
                <div key={startup.id} className="card hover:border-brand/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/startup/${startup.slug}`} className="font-serif font-bold text-ink hover:text-brand transition-colors">
                          {startup.name}
                        </Link>
                        <span className={`mono text-xs border rounded px-1.5 py-0.5 ${stageColors[startup.stage] || ''}`}>
                          {startup.stage}
                        </span>
                      </div>
                      {startup.description && (
                        <p className="text-xs text-ink/50 line-clamp-2 leading-relaxed">{startup.description}</p>
                      )}
                    </div>
                    <button onClick={() => toggleFavorite(startup.id)}
                      className={`ml-3 flex-shrink-0 transition-colors p-1 rounded ${isFav ? 'text-red-500' : 'text-ink/20 hover:text-red-400'}`}>
                      <Heart size={16} className={isFav ? 'fill-red-500' : ''} />
                    </button>
                  </div>

                  {/* Sağlık skoru */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="mono text-xs text-ink/30">Sağlık skoru</span>
                      <span className={`mono text-xs font-medium ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{score}%</span>
                    </div>
                    <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${score}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-xs flex-shrink-0">
                        {startup.founder?.avatar_url ? <img src={startup.founder.avatar_url} alt="" className="w-full h-full object-cover" /> : startup.founder?.full_name?.[0]}
                      </div>
                      <span className="text-xs text-ink/40 truncate">{startup.founder?.full_name}</span>
                      {startup.sector && <span className="mono text-xs text-ink/25">{startup.sector}</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="mono text-xs text-ink/30">{startup.startup_updates?.length || 0} güncelleme</span>
                      <Link href={`/mesajlar/yeni`} className="text-ink/25 hover:text-brand transition-colors">
                        <MessageCircle size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
              <TrendingUp size={36} className="text-brand/25 mx-auto mb-3" />
              <p className="font-serif text-xl font-bold text-ink mb-1">Startup bulunamadı.</p>
              <p className="text-sm text-ink/45">Filtreleri değiştirmeyi dene.</p>
            </div>
          )}
        </div>
      )}

      {/* Favoriler */}
      {tab === 'Favorilerim' && (
        <div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {favorites.map((fav: any) => (
                <div key={fav.id} className="card hover:border-brand/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/startup/${fav.startup?.slug}`} className="font-serif font-bold text-ink hover:text-brand transition-colors">
                      {fav.startup?.name}
                    </Link>
                    <button onClick={() => toggleFavorite(fav.startup_id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Heart size={14} className="fill-red-400" />
                    </button>
                  </div>
                  {fav.startup?.description && (
                    <p className="text-xs text-ink/50 line-clamp-2 mb-2">{fav.startup.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`mono text-xs border rounded px-1.5 py-0.5 ${stageColors[fav.startup?.stage] || ''}`}>{fav.startup?.stage}</span>
                    <Link href="/mesajlar/yeni" className="ml-auto text-xs text-brand hover:underline flex items-center gap-1">
                      <MessageCircle size={11} /> İletişime geç
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
              <Heart size={36} className="text-brand/25 mx-auto mb-3" />
              <p className="font-serif text-xl font-bold text-ink mb-1">Henüz favori yok.</p>
              <p className="text-sm text-ink/45">Startupları incele, beğendiklerini kaydet.</p>
            </div>
          )}
        </div>
      )}

      {/* Demo Day */}
      {tab === 'Demo Day' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink/45">{demoApps.length} startup Demo Day için kabul edildi.</p>
            <Link href="/demo-day" className="btn-primary text-xs flex items-center gap-1.5">
              <Calendar size={12} /> Demo Day sayfası
            </Link>
          </div>
          {demoApps.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {demoApps.map((app: any) => (
                <div key={app.id} className="card hover:border-brand/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/startup/${app.startup?.slug}`} className="font-serif font-bold text-ink hover:text-brand transition-colors">
                      {app.startup?.name}
                    </Link>
                    <span className={`mono text-xs border rounded px-1.5 py-0.5 ${stageColors[app.startup?.stage] || ''}`}>
                      {app.startup?.stage}
                    </span>
                  </div>
                  {app.startup?.description && (
                    <p className="text-xs text-ink/50 line-clamp-2 mb-3">{app.startup.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-xs text-ink/40">{app.startup?.founder?.full_name} · {app.startup?.founder?.university}</span>
                    <button onClick={() => toggleFavorite(app.startup?.id)} className={`transition-colors ${favoriteIds.has(app.startup?.id) ? 'text-red-500' : 'text-ink/20 hover:text-red-400'}`}>
                      <Heart size={13} className={favoriteIds.has(app.startup?.id) ? 'fill-red-500' : ''} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
              <Calendar size={36} className="text-brand/25 mx-auto mb-3" />
              <p className="font-serif text-xl font-bold text-ink mb-1">Demo Day başvurusu yok.</p>
            </div>
          )}
        </div>
      )}

      {/* Profil */}
      {tab === 'Profilim' && (
        <div className="max-w-2xl">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="mono text-xs text-ink/35 tracking-widest">YATIRIMCI PROFİLİ</p>
              <button onClick={() => setEditingProfile(!editingProfile)} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                <Edit3 size={12} />
                {editingProfile ? 'İptal' : 'Düzenle'}
              </button>
            </div>

            {editingProfile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Firma adı</label>
                    <input className="input" placeholder="XYZ Ventures" value={invForm.firm_name} onChange={e => setInvForm(p => ({ ...p, firm_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Unvan</label>
                    <input className="input" placeholder="Partner, Angel Investor..." value={invForm.title} onChange={e => setInvForm(p => ({ ...p, title: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label">Hakkında</label>
                  <textarea className="input resize-none" rows={3} placeholder="Yatırım odağınız, deneyiminiz..." value={invForm.bio} onChange={e => setInvForm(p => ({ ...p, bio: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Ticket büyüklüğü</label>
                    <input className="input" placeholder="$50K - $500K" value={invForm.ticket_size} onChange={e => setInvForm(p => ({ ...p, ticket_size: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Website</label>
                    <input className="input" placeholder="https://..." value={invForm.website} onChange={e => setInvForm(p => ({ ...p, website: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label">LinkedIn</label>
                  <input className="input" placeholder="linkedin.com/in/..." value={invForm.linkedin} onChange={e => setInvForm(p => ({ ...p, linkedin: e.target.value }))} />
                </div>
                <button onClick={saveProfile} disabled={saving} className="btn-primary text-sm disabled:opacity-60 flex items-center gap-1.5">
                  <Check size={14} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Firma', value: invForm.firm_name },
                  { label: 'Unvan', value: invForm.title },
                  { label: 'Hakkında', value: invForm.bio },
                  { label: 'Ticket büyüklüğü', value: invForm.ticket_size },
                  { label: 'Website', value: invForm.website },
                  { label: 'LinkedIn', value: invForm.linkedin },
                ].map(f => f.value && (
                  <div key={f.label} className="flex gap-3">
                    <span className="mono text-xs text-ink/35 w-28 flex-shrink-0 pt-0.5">{f.label.toUpperCase()}</span>
                    <span className="text-sm text-ink/70">{f.value}</span>
                  </div>
                ))}
                {!invForm.firm_name && !invForm.title && (
                  <p className="text-sm text-ink/35">Profil henüz doldurulmadı. Düzenle butonuna tıkla.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}