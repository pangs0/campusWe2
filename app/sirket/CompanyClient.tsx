'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Search, Building2, Users, TrendingUp, BookmarkPlus, Bookmark, MessageCircle, Edit3, Check, BarChart2, Briefcase, Star } from 'lucide-react'

type Props = {
  userId: string
  profile: any
  companyProfile: any
  talents: any[]
  watchlist: any[]
  watchlistIds: string[]
  startups: any[]
}

const TABS = ['Yetenek Keşfi', 'Startup Takibi', 'İşe Alım Pipeline', 'Şirket Profili']
const SKILLS = ['Tümü', 'React', 'Python', 'UI/UX', 'Pazarlama', 'Finans', 'ML', 'iOS', 'Android']

const statusColors: Record<string, string> = {
  izleniyor: 'bg-blue-50 text-blue-700 border-blue-200',
  'iletişime geçildi': 'bg-amber-50 text-amber-700 border-amber-200',
  'işe alındı': 'bg-green-50 text-green-700 border-green-200',
}

export default function CompanyClient({ userId, profile, companyProfile, talents, watchlist: initialWatchlist, watchlistIds: initialWatchlistIds, startups }: Props) {
  const supabase = createClient()
  const [tab, setTab] = useState('Yetenek Keşfi')
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('Tümü')
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set(initialWatchlistIds))
  const [watchlist, setWatchlist] = useState(initialWatchlist)
  const [editingProfile, setEditingProfile] = useState(false)
  const [pipeline, setPipeline] = useState<any[]>([])
  const [compForm, setCompForm] = useState({
    company_name: companyProfile?.company_name || '',
    sector: companyProfile?.sector || '',
    company_size: companyProfile?.company_size || '',
    website: companyProfile?.website || '',
    description: companyProfile?.description || '',
  })
  const [saving, setSaving] = useState(false)

  const filteredTalents = talents.filter(t => {
    const matchSearch = t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.university?.toLowerCase().includes(search.toLowerCase())
    const matchSkill = skillFilter === 'Tümü' || t.user_skills?.some((s: any) => s.skill_name === skillFilter)
    return matchSearch && matchSkill
  })

  async function toggleWatchlist(startupId: string) {
    if (watchlistIds.has(startupId)) {
      await supabase.from('company_watchlist').delete().eq('company_id', userId).eq('startup_id', startupId)
      setWatchlistIds(prev => { const s = new Set(prev); s.delete(startupId); return s })
      setWatchlist(prev => prev.filter(w => w.startup_id !== startupId))
    } else {
      await supabase.from('company_watchlist').insert({ company_id: userId, startup_id: startupId, status: 'izleniyor' })
      setWatchlistIds(prev => new Set([...prev, startupId]))
      const startup = startups.find(s => s.id === startupId)
      if (startup) setWatchlist(prev => [...prev, { startup_id: startupId, startup, status: 'izleniyor' }])
    }
  }

  async function updateWatchlistStatus(startupId: string, status: string) {
    await supabase.from('company_watchlist').update({ status }).eq('company_id', userId).eq('startup_id', startupId)
    setWatchlist(prev => prev.map(w => w.startup_id === startupId ? { ...w, status } : w))
  }

  async function addToPipeline(talent: any) {
    if (!pipeline.find(p => p.id === talent.id)) {
      setPipeline(prev => [...prev, { ...talent, pipelineStatus: 'aday' }])
    }
  }

  async function saveProfile() {
    setSaving(true)
    await supabase.from('company_profiles').upsert({ id: userId, ...compForm })
    setEditingProfile(false)
    setSaving(false)
  }

  const stats = [
    { n: filteredTalents.length, l: 'Yetenek', icon: Users },
    { n: watchlist.length, l: 'Takip', icon: Bookmark },
    { n: startups.length, l: 'Startup', icon: TrendingUp },
    { n: pipeline.length, l: 'Pipeline', icon: Briefcase },
  ]

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">ŞİRKET PANELİ</p>
          <h1 className="font-serif text-3xl font-bold text-ink">{compForm.company_name}</h1>
          {compForm.sector && <p className="text-sm text-ink/45 mt-1">{compForm.sector} · {compForm.company_size}</p>}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.l} className="card text-center py-2.5 px-3">
              <p className="font-serif text-xl font-bold text-ink">{s.n}</p>
              <p className="mono text-xs text-ink/35">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-1 mb-6 border-b border-neutral-200">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-brand text-brand' : 'border-transparent text-ink/45 hover:text-ink'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Yetenek Keşfi */}
      {tab === 'Yetenek Keşfi' && (
        <div>
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
              <input className="input pl-9 text-sm" placeholder="İsim veya üniversite ara..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input w-40 text-sm" value={skillFilter} onChange={e => setSkillFilter(e.target.value)}>
              {SKILLS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filteredTalents.map((talent: any) => (
              <div key={talent.id} className="card hover:border-brand/30 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
                    {talent.avatar_url ? <img src={talent.avatar_url} alt="" className="w-full h-full object-cover" /> : talent.full_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm">{talent.full_name}</p>
                    <p className="mono text-xs text-ink/35 truncate">{talent.university}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="mono text-xs text-brand">{talent.karma_tokens}</span>
                    <span className="text-xs">⚡</span>
                  </div>
                </div>

                {talent.user_skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {talent.user_skills.slice(0, 4).map((s: any) => (
                      <span key={s.id} className="mono text-xs bg-neutral-50 text-ink/50 border border-neutral-200 rounded px-1.5 py-0.5">
                        {s.skill_name}
                      </span>
                    ))}
                  </div>
                )}

                {talent.startups?.length > 0 && (
                  <div className="mb-3">
                    {talent.startups.slice(0, 1).map((s: any) => (
                      <Link key={s.id} href={`/startup/${s.slug}`} className="text-xs text-brand hover:underline">
                        🚀 {s.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-neutral-100">
                  <button onClick={() => addToPipeline(talent)}
                    className="flex-1 text-xs text-center py-1.5 border border-neutral-200 rounded-lg hover:border-brand/30 hover:bg-brand/3 transition-colors text-ink/55">
                    {pipeline.find(p => p.id === talent.id) ? '✓ Pipeline\'da' : '+ Pipeline'}
                  </button>
                  <Link href="/mesajlar/yeni" className="flex items-center justify-center gap-1 px-3 py-1.5 border border-neutral-200 rounded-lg hover:border-brand/30 transition-colors text-ink/40 hover:text-brand">
                    <MessageCircle size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredTalents.length === 0 && (
            <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
              <Users size={36} className="text-brand/25 mx-auto mb-3" />
              <p className="font-serif text-xl font-bold text-ink mb-1">Yetenek bulunamadı.</p>
            </div>
          )}
        </div>
      )}

      {/* Startup Takibi */}
      {tab === 'Startup Takibi' && (
        <div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif font-bold text-ink mb-3">Tüm Startuplar</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {startups.map((s: any) => (
                  <div key={s.id} className="card p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <Link href={`/startup/${s.slug}`} className="font-medium text-ink text-sm hover:text-brand transition-colors block truncate">
                        {s.name}
                      </Link>
                      <p className="mono text-xs text-ink/35">{s.stage} · {s.sector || 'Sektör yok'}</p>
                    </div>
                    <button onClick={() => toggleWatchlist(s.id)}
                      className={`transition-colors flex-shrink-0 ${watchlistIds.has(s.id) ? 'text-brand' : 'text-ink/20 hover:text-brand'}`}>
                      {watchlistIds.has(s.id) ? <Bookmark size={15} className="fill-brand" /> : <BookmarkPlus size={15} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-ink mb-3">Takip Listem ({watchlist.length})</h3>
              {watchlist.length > 0 ? (
                <div className="space-y-2">
                  {watchlist.map((w: any) => (
                    <div key={w.id} className="card p-3">
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/startup/${w.startup?.slug}`} className="font-medium text-ink text-sm hover:text-brand transition-colors">
                          {w.startup?.name}
                        </Link>
                        <button onClick={() => toggleWatchlist(w.startup_id)} className="text-ink/20 hover:text-red-500 transition-colors">
                          ✕
                        </button>
                      </div>
                      <select
                        value={w.status}
                        onChange={e => updateWatchlistStatus(w.startup_id, e.target.value)}
                        className={`text-xs border rounded px-2 py-1 w-full focus:outline-none ${statusColors[w.status] || ''}`}
                      >
                        <option value="izleniyor">İzleniyor</option>
                        <option value="iletişime geçildi">İletişime geçildi</option>
                        <option value="işe alındı">İşe alındı</option>
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
                  <Bookmark size={28} className="text-brand/25 mx-auto mb-2" />
                  <p className="text-sm text-ink/45">Startup takip listeni oluştur.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* İşe Alım Pipeline */}
      {tab === 'İşe Alım Pipeline' && (
        <div>
          {pipeline.length > 0 ? (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { status: 'aday', label: 'Aday', color: 'bg-neutral-100' },
                  { status: 'görüşme', label: 'Görüşme', color: 'bg-amber-50' },
                  { status: 'teklif', label: 'Teklif', color: 'bg-green-50' },
                ].map(col => (
                  <div key={col.status}>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${col.color}`}>
                      <p className="text-sm font-medium text-ink">{col.label}</p>
                      <span className="mono text-xs text-ink/40">({pipeline.filter(p => p.pipelineStatus === col.status).length})</span>
                    </div>
                    <div className="space-y-2">
                      {pipeline.filter(p => p.pipelineStatus === col.status).map(p => (
                        <div key={p.id} className="card p-3">
                          <p className="font-medium text-ink text-sm">{p.full_name}</p>
                          <p className="mono text-xs text-ink/35 mb-2">{p.university}</p>
                          <div className="flex gap-1.5">
                            {col.status !== 'görüşme' && (
                              <button onClick={() => setPipeline(prev => prev.map(t => t.id === p.id ? { ...t, pipelineStatus: 'görüşme' } : t))}
                                className="text-xs text-brand hover:underline">Görüşme →</button>
                            )}
                            {col.status === 'görüşme' && (
                              <button onClick={() => setPipeline(prev => prev.map(t => t.id === p.id ? { ...t, pipelineStatus: 'teklif' } : t))}
                                className="text-xs text-green-600 hover:underline">Teklif ver →</button>
                            )}
                          </div>
                        </div>
                      ))}
                      {pipeline.filter(p => p.pipelineStatus === col.status).length === 0 && (
                        <div className="text-center py-6 border border-dashed border-neutral-200 rounded-xl">
                          <p className="text-xs text-ink/25">Boş</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink/35 text-center">Pipeline yalnızca bu oturumda saklanır. Yakında kalıcı kayıt geliyor.</p>
            </div>
          ) : (
            <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
              <Briefcase size={36} className="text-brand/25 mx-auto mb-3" />
              <p className="font-serif text-xl font-bold text-ink mb-1">Pipeline boş.</p>
              <p className="text-sm text-ink/45 mb-4">Yetenek Keşfi'nden adayları pipeline'a ekle.</p>
              <button onClick={() => setTab('Yetenek Keşfi')} className="btn-primary text-sm">
                Yetenek keşfine git →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Şirket Profili */}
      {tab === 'Şirket Profili' && (
        <div className="max-w-2xl">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="mono text-xs text-ink/35 tracking-widest">ŞİRKET PROFİLİ</p>
              <button onClick={() => setEditingProfile(!editingProfile)} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                <Edit3 size={12} />
                {editingProfile ? 'İptal' : 'Düzenle'}
              </button>
            </div>

            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="label">Şirket adı</label>
                  <input className="input" value={compForm.company_name} onChange={e => setCompForm(p => ({ ...p, company_name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Sektör</label>
                    <input className="input" placeholder="Teknoloji, Finans..." value={compForm.sector} onChange={e => setCompForm(p => ({ ...p, sector: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Şirket büyüklüğü</label>
                    <select className="input" value={compForm.company_size} onChange={e => setCompForm(p => ({ ...p, company_size: e.target.value }))}>
                      <option value="">Seç</option>
                      {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => <option key={s}>{s} çalışan</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Açıklama</label>
                  <textarea className="input resize-none" rows={3} value={compForm.description} onChange={e => setCompForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Website</label>
                  <input className="input" placeholder="https://..." value={compForm.website} onChange={e => setCompForm(p => ({ ...p, website: e.target.value }))} />
                </div>
                <button onClick={saveProfile} disabled={saving} className="btn-primary text-sm disabled:opacity-60 flex items-center gap-1.5">
                  <Check size={14} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Şirket', value: compForm.company_name },
                  { label: 'Sektör', value: compForm.sector },
                  { label: 'Büyüklük', value: compForm.company_size },
                  { label: 'Açıklama', value: compForm.description },
                  { label: 'Website', value: compForm.website },
                ].map(f => f.value && (
                  <div key={f.label} className="flex gap-3">
                    <span className="mono text-xs text-ink/35 w-24 flex-shrink-0 pt-0.5">{f.label.toUpperCase()}</span>
                    <span className="text-sm text-ink/70">{f.value}</span>
                  </div>
                ))}
                {!compForm.sector && !compForm.description && (
                  <p className="text-sm text-ink/35">Profil henüz doldurulmadı.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}