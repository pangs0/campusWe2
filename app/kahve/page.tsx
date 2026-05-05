'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { createClient } from '@/lib/supabase/client'
import { Coffee, RefreshCw, MessageCircle, X } from 'lucide-react'

export default function KahveMolasi() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [match, setMatch] = useState<any>(null)
  const [declined, setDeclined] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
      if (prof) setProfile(prof)
    }
    loadUser()
  }, [])

  async function findMatch() {
    setLoading(true)
    setMatch(null)
    setDeclined(false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUser(user)
      const { data: prof } = await supabase.from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
      if (prof) setProfile(prof)

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*, user_skills(*)')
      .neq('id', user.id)
      .limit(50)

    if (!profiles || profiles.length === 0) {
      setLoading(false)
      return
    }

    const random = profiles[Math.floor(Math.random() * profiles.length)]
    setMatch(random)
    setLoading(false)
  }

  function handleDecline() {
    setDeclined(true)
    setMatch(null)
  }

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-16 max-w-2xl mx-auto text-center">
        <div className="mb-10">
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <Coffee size={28} className="text-brand" />
          </div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-2">DİJİTAL KAHVE MOLASI</p>
          <h1 className="font-serif text-3xl font-bold text-ink mb-3">
            Rastgele biriyle tanış.
          </h1>
          <p className="text-sm text-ink/45 max-w-sm mx-auto leading-relaxed">
            Algoritma seni benzer ilgi alanlarına sahip başka bir girişimciyle 5 dakikaya bağlar. Hazır mısın?
          </p>
        </div>

        {!match && !loading && (
          <button
            onClick={findMatch}
            className="btn-primary inline-flex items-center gap-2 text-sm px-8 py-3"
          >
            <Coffee size={16} />
            Eşleştir
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-ink/45">Sana uygun biri aranıyor...</p>
          </div>
        )}

        {match && (
          <div className="card max-w-sm mx-auto text-left">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-brand/15 flex items-center justify-center text-2xl font-bold text-brand font-serif mx-auto mb-3">
                {match.full_name?.[0]}
              </div>
              <h2 className="font-serif text-xl font-bold text-ink">{match.full_name}</h2>
              <p className="mono text-xs text-ink/40 mt-1">@{match.username}</p>
              {match.university && (
                <p className="text-xs text-ink/45 mt-1">{match.university}</p>
              )}
              {match.department && (
                <p className="text-xs text-ink/35">{match.department}</p>
              )}
            </div>

            {match.bio && (
              <p className="text-sm text-ink/55 leading-relaxed text-center mb-4 border-t border-neutral-100 pt-4">
                {match.bio}
              </p>
            )}

            {match.user_skills && match.user_skills.length > 0 && (
              <div className="mb-5">
                <p className="mono text-xs text-ink/35 tracking-widest mb-2">YETENEKLERİ</p>
                <div className="flex flex-wrap gap-1.5">
                  {match.user_skills.slice(0, 5).map((s: any) => (
                    <span key={s.id} className="mono text-xs bg-neutral-100 text-ink/60 border border-neutral-200 rounded px-2 py-0.5">
                      {s.skill_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-neutral-100">
              <button
                onClick={handleDecline}
                className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm py-2.5"
              >
                <X size={14} />
                Geç
              </button>
              <button
                onClick={findMatch}
                className="btn-secondary flex items-center justify-center gap-1.5 text-sm py-2.5 px-3"
              >
                <RefreshCw size={14} />
              </button>
              <a
                href={`mailto:?subject=CampusWe Kahve Molası&body=Merhaba! CampusWe üzerinden seninle tanışmak istedim.`}
                className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm py-2.5"
              >
                <MessageCircle size={14} />
                Bağlan
              </a>
            </div>
          </div>
        )}

        {declined && (
          <div className="mt-6">
            <p className="text-sm text-ink/40 mb-4">Başka biriyle eşleşmek ister misin?</p>
            <button
              onClick={findMatch}
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5"
            >
              <RefreshCw size={14} />
              Tekrar dene
            </button>
          </div>
        )}

        <div className="mt-16 grid grid-cols-3 gap-4 text-center">
          {[
            { n: '5 dk', l: 'Tanışma süresi' },
            { n: 'Rastgele', l: 'Eşleştirme' },
            { n: 'Ücretsiz', l: 'Her zaman' },
          ].map((s, i) => (
            <div key={i} className="card py-4">
              <div className="font-serif text-lg font-bold text-ink">{s.n}</div>
              <div className="mono text-xs text-ink/35 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </main>
    </AppLayout>
  )
}