'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { createClient } from '@/lib/supabase/client'
import { Coffee, RefreshCw, MessageCircle, X, Zap, Users, Clock, Star, Filter } from 'lucide-react'
import Link from 'next/link'

const SECTORS = ['Tümü', 'EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'SaaS', 'Yapay Zeka', 'E-ticaret']

const SUCCESS_STORIES = [
  { a: 'Kaan', b: 'Selin', result: 'Co-founder oldular, 3 ayda MVP çıkardılar.', emoji: '🚀' },
  { a: 'Mert', b: 'Ayşe', result: 'Kahve Molası\'nda tanıştılar, takas yaptılar.', emoji: '⚡' },
  { a: 'Can', b: 'Zeynep', result: 'Birlikte Demo Day\'e başvurdular.', emoji: '🎯' },
]

export default function KahveMolasi() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [match, setMatch] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [sectorFilter, setSectorFilter] = useState('Tümü')
  const [showFilter, setShowFilter] = useState(false)
  const [weeklyCount, setWeeklyCount] = useState(0)
  const [activeCount, setActiveCount] = useState(0)
  const [pastMatches, setPastMatches] = useState<any[]>([])
  const [commonSkills, setCommonSkills] = useState<string[]>([])
  const [mySkills, setMySkills] = useState<string[]>([])
  const [messageSent, setMessageSent] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data: prof } = await supabase.from('profiles')
        .select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
      if (prof) setProfile(prof)

      const { data: skills } = await supabase.from('user_skills').select('skill_name').eq('user_id', user.id)
      if (skills) setMySkills(skills.map((s: any) => s.skill_name))

      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      setActiveCount(count || 0)
      setWeeklyCount(Math.floor((count || 0) * 0.3))
    }
    loadUser()
  }, [])

  async function findMatch() {
    if (!user) return
    setLoading(true)
    setMatch(null)
    setMessageSent(false)
    setCommonSkills([])

    let query = supabase.from('profiles').select('*, user_skills(*), startups(id, name, slug, stage)').neq('id', user.id).limit(50)

    const { data: profiles } = await query
    if (!profiles || profiles.length === 0) { setLoading(false); return }

    let filtered = profiles
    if (sectorFilter !== 'Tümü') {
      const { data: startups } = await supabase
        .from('startups').select('founder_id').eq('sector', sectorFilter)
      const founderIds = new Set(startups?.map((s: any) => s.founder_id) || [])
      filtered = profiles.filter((p: any) => founderIds.has(p.id))
      if (filtered.length === 0) filtered = profiles
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)]
    setMatch(random)

    // Ortak yetenekler
    const matchSkills = random.user_skills?.map((s: any) => s.skill_name) || []
    const common = mySkills.filter(s => matchSkills.includes(s))
    setCommonSkills(common)

    setPastMatches(prev => {
      const already = prev.find(p => p.id === random.id)
      if (already) return prev
      return [random, ...prev].slice(0, 5)
    })

    setLoading(false)
  }

  async function sendMessage() {
    if (!user || !match) return
    // Konuşma başlat veya mevcut konuşmaya git
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${match.id}),and(participant1_id.eq.${match.id},participant2_id.eq.${user.id})`)
      .single()

    if (existing) {
      router.push(`/mesajlar/${existing.id}`)
    } else {
      const { data: newConv } = await supabase.from('conversations').insert({
        participant1_id: user.id,
        participant2_id: match.id,
        last_message: 'Kahve Molası\'ndan merhaba! 👋',
        last_message_at: new Date().toISOString(),
      }).select().single()
      if (newConv) {
        await supabase.from('messages').insert({
          conversation_id: newConv.id,
          sender_id: user.id,
          content: 'Kahve Molası\'ndan merhaba! 👋',
        })
        setMessageSent(true)
        setTimeout(() => router.push(`/mesajlar/${newConv.id}`), 1000)
      }
    }
  }

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">

        {/* Başlık */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="col-span-2">
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">DİJİTAL KAHVE MOLASI</p>
            <h1 className="font-serif text-4xl font-bold text-ink leading-tight mb-3" style={{ letterSpacing: -1.5 }}>
              5 dakikada bir<br />
              <em className="text-brand not-italic">girişimciyle tanış.</em>
            </h1>
            <p className="text-sm text-ink/50 leading-relaxed max-w-md">
              Algoritma seni benzer ilgi alanlarına sahip bir girişimciyle eşleştirir. Bağlan, konuş, büyü.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { n: weeklyCount + '+', l: 'Bu hafta eşleşme', icon: Users },
              { n: activeCount + '+', l: 'Aktif girişimci', icon: Zap },
              { n: '5 dk', l: 'Ortalama süre', icon: Clock },
            ].map((s, i) => (
              <div key={i} className="card flex items-center gap-3 py-2.5">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <s.icon size={14} className="text-brand" />
                </div>
                <div>
                  <p className="font-serif font-bold text-ink text-sm">{s.n}</p>
                  <p className="mono text-xs text-ink/35">{s.l}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Sol — Ana eşleştirme */}
          <div className="col-span-2">

            {/* Filtre */}
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-1.5 text-xs text-ink/50 border border-neutral-200 rounded-lg px-3 py-2 hover:border-brand/30 transition-colors">
                <Filter size={12} />
                {sectorFilter === 'Tümü' ? 'Tüm sektörler' : sectorFilter}
              </button>
              {showFilter && (
                <div className="flex gap-1.5 flex-wrap">
                  {SECTORS.map(s => (
                    <button key={s} onClick={() => { setSectorFilter(s); setShowFilter(false) }}
                      className={`mono text-xs px-2.5 py-1 rounded-full border transition-colors ${sectorFilter === s ? 'bg-ink text-cream border-ink' : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/30'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Eşleştirme kartı */}
            {!match && !loading && (
              <div className="card text-center py-16" style={{ background: 'rgba(196,80,10,.02)', border: '1.5px dashed rgba(196,80,10,.15)' }}>
                <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                  <Coffee size={28} className="text-brand" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-ink mb-2">Hazır mısın?</h2>
                <p className="text-sm text-ink/45 mb-6 max-w-xs mx-auto leading-relaxed">
                  Bir butona bas, topluluğundan biri seni bekliyor.
                </p>
                <button onClick={findMatch} className="btn-primary inline-flex items-center gap-2 text-sm px-8 py-3">
                  <Coffee size={16} />
                  Eşleştir
                </button>
              </div>
            )}

            {loading && (
              <div className="card text-center py-16">
                <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-ink/45">Sana uygun biri aranıyor...</p>
                <p className="mono text-xs text-ink/25 mt-1">Toplulukta taranıyor</p>
              </div>
            )}

            {match && (
              <div className="card">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full bg-brand/15 flex items-center justify-center text-2xl font-bold text-brand font-serif flex-shrink-0">
                    {match.avatar_url
                      ? <img src={match.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                      : match.full_name?.[0]
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="font-serif text-xl font-bold text-ink">{match.full_name}</h2>
                      <span className="mono text-xs bg-brand/8 text-brand border border-brand/15 rounded px-1.5 py-0.5">
                        {match.karma_tokens} ⚡
                      </span>
                    </div>
                    <p className="mono text-xs text-ink/40">@{match.username}</p>
                    {match.university && <p className="text-xs text-ink/45 mt-1">{match.university}</p>}
                    {match.city && <p className="text-xs text-ink/35">📍 {match.city}</p>}
                  </div>
                </div>

                {match.bio && (
                  <p className="text-sm text-ink/55 leading-relaxed mb-4 pb-4 border-b border-neutral-100">
                    {match.bio}
                  </p>
                )}

                {/* Ortak yetenekler */}
                {commonSkills.length > 0 && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <p className="mono text-xs text-green-700 mb-1.5">✓ {commonSkills.length} ORTAK YETENEĞİNİZ VAR</p>
                    <div className="flex flex-wrap gap-1.5">
                      {commonSkills.map((s, i) => (
                        <span key={i} className="mono text-xs bg-green-100 text-green-700 border border-green-200 rounded px-2 py-0.5">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {match.user_skills?.length > 0 && (
                  <div className="mb-4">
                    <p className="mono text-xs text-ink/35 tracking-widest mb-2">YETENEKLERİ</p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.user_skills.slice(0, 6).map((s: any) => (
                        <span key={s.id} className="mono text-xs bg-neutral-100 text-ink/60 border border-neutral-200 rounded px-2 py-0.5">{s.skill_name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {match.startups?.length > 0 && (
                  <div className="mb-4">
                    <p className="mono text-xs text-ink/35 tracking-widest mb-2">STARTUPU</p>
                    {match.startups.slice(0, 1).map((s: any) => (
                      <Link key={s.id} href={`/startup/${s.slug}`} className="flex items-center gap-2 text-sm text-brand hover:underline">
                        🚀 {s.name}
                        <span className="mono text-xs text-ink/35">{s.stage}</span>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-neutral-100">
                  <button onClick={() => setMatch(null)}
                    className="btn-secondary flex items-center justify-center gap-1.5 text-sm py-2.5 px-4">
                    <X size={14} /> Geç
                  </button>
                  <button onClick={findMatch}
                    className="btn-secondary flex items-center justify-center gap-1.5 text-sm py-2.5 px-4">
                    <RefreshCw size={14} />
                  </button>
                  <button onClick={sendMessage} disabled={messageSent}
                    className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm py-2.5 disabled:opacity-70">
                    <MessageCircle size={14} />
                    {messageSent ? 'Mesaj gönderildi! Yönlendiriliyor...' : 'Mesaj gönder'}
                  </button>
                </div>
              </div>
            )}

            {/* Başarı hikayeleri */}
            <div className="mt-6">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">BAŞARI HİKAYELERİ</p>
              <div className="grid grid-cols-3 gap-3">
                {SUCCESS_STORIES.map((s, i) => (
                  <div key={i} className="card py-3 px-4">
                    <span style={{ fontSize: 20 }}>{s.emoji}</span>
                    <p className="text-xs font-medium text-ink mt-2 mb-1">
                      {s.a} & {s.b}
                    </p>
                    <p className="text-xs text-ink/45 leading-relaxed">{s.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ — Geçmiş ve ipuçları */}
          <div className="space-y-5">

            {/* Geçmiş eşleşmeler */}
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">TANIŞTIKLARIM</p>
              {pastMatches.length > 0 ? (
                <div className="space-y-2">
                  {pastMatches.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand/12 flex items-center justify-center font-serif font-bold text-brand text-sm flex-shrink-0">
                        {p.avatar_url
                          ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                          : p.full_name?.[0]
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-ink truncate">{p.full_name}</p>
                        <p className="mono text-xs text-ink/30 truncate">{p.university || p.city || 'Türkiye'}</p>
                      </div>
                      <span className="mono text-xs text-brand">{p.karma_tokens}⚡</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Coffee size={24} className="text-brand/25 mx-auto mb-2" />
                  <p className="text-xs text-ink/35">Henüz eşleşme yok.</p>
                </div>
              )}
            </div>

            {/* İpuçları */}
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">İPUÇLARI</p>
              <div className="space-y-3">
                {[
                  { icon: '☕', text: 'Kendinizi kısaca tanıtın — kim olduğunuz, ne yaptığınız' },
                  { icon: '🎯', text: 'Bir şey sorun — takas, fikir, geri bildirim' },
                  { icon: '⚡', text: 'Karşı tarafı dinleyin, ortak nokta bulun' },
                  { icon: '🤝', text: 'Sonunda bağlantı için mesaj gönderin' },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{t.icon}</span>
                    <p className="text-xs text-ink/55 leading-relaxed">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Karma notu */}
            <div className="card" style={{ background: 'rgba(196,80,10,.04)', border: '1px solid rgba(196,80,10,.12)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} className="text-brand" />
                <p className="mono text-xs text-brand tracking-widest">KARMA TOKEN</p>
              </div>
              <p className="text-xs text-ink/60 leading-relaxed">
                Her eşleşmede <strong>+5 Karma Token</strong> kazanırsın. Mesaj gönderirsen <strong>+10</strong> ekstra!
              </p>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}