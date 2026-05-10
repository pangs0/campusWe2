'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Clock, Plus, Star, Users, CheckCircle, Filter, MessageCircle, Linkedin } from 'lucide-react'
import { useRouter } from 'next/navigation'

const DAY_LABELS: Record<string, string> = {
  pazartesi: 'Pzt', sali: 'Sal', carsamba: 'Çar',
  persembe: 'Per', cuma: 'Cum', cumartesi: 'Cmt', pazar: 'Paz'
}

const EXPERTISE_FILTERS = ['Tümü', 'Ürün Yönetimi', 'Yazılım', 'Pazarlama', 'Yatırım', 'Büyüme', 'Tasarım']

type Props = {
  userId: string
  sessions: any[]
  isMentor: boolean
}

export default function MentorListClient({ userId, sessions, isMentor }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [filter, setFilter] = useState('Tümü')
  const [booked, setBooked] = useState<Set<string>>(new Set())
  const [booking, setBooking] = useState<string | null>(null)

  const filtered = sessions.filter(s =>
    s.mentor?.id !== userId &&
    (filter === 'Tümü' || s.expertise?.includes(filter))
  )

  async function bookSession(session: any) {
    setBooking(session.id)
    // Konuşma başlat
    const { data: existing } = await supabase
      .from('conversations').select('id')
      .or(`and(participant1_id.eq.${userId},participant2_id.eq.${session.mentor?.id}),and(participant1_id.eq.${session.mentor?.id},participant2_id.eq.${userId})`)
      .single()

    if (existing) {
      router.push(`/mesajlar/${existing.id}`)
    } else {
      const { data: newConv } = await supabase.from('conversations').insert({
        participant1_id: userId,
        participant2_id: session.mentor?.id,
        last_message: `Merhaba! Office Hours için randevu almak istiyorum. ${DAY_LABELS[session.day_of_week] || session.day_of_week} ${session.time_slot} uygun musunuz?`,
        last_message_at: new Date().toISOString(),
      }).select().single()
      if (newConv) {
        await supabase.from('messages').insert({
          conversation_id: newConv.id,
          sender_id: userId,
          content: `Merhaba! Office Hours için randevu almak istiyorum. ${DAY_LABELS[session.day_of_week] || session.day_of_week} ${session.time_slot} uygun musunuz?`,
        })
        setBooked(prev => new Set(Array.from(prev).concat(session.id)))
        router.push(`/mesajlar/${newConv.id}`)
      }
    }
    setBooking(null)
  }

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">OFFICE HOURS</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Mentorlarla tanış.</h1>
          <p className="text-sm text-ink/45 mt-1">Sektör profesyonelleri haftada 1 saat gönüllü mentorluk yapıyor.</p>
        </div>
        {isMentor ? (
          <div className="flex items-center gap-2 bg-brand/8 border border-brand/15 rounded-lg px-4 py-2.5">
            <Star size={13} className="text-brand" />
            <span className="mono text-sm text-brand font-medium">Aktif Mentor</span>
          </div>
        ) : (
          <Link href="/office-hours/yeni" className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={13} /> Mentor ol
          </Link>
        )}
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { n: sessions.length, l: 'Aktif mentor' },
          { n: sessions.filter(s => s.expertise?.includes('Yazılım')).length, l: 'Teknik mentor' },
          { n: 'Ücretsiz', l: 'Her zaman' },
          { n: '1 saat', l: 'Haftalık süre' },
        ].map((s, i) => (
          <div key={i} className="card text-center py-3">
            <p className="font-serif text-2xl font-bold text-ink">{s.n}</p>
            <p className="mono text-xs text-ink/35 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Filtre */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <Filter size={12} className="text-ink/30" />
        {EXPERTISE_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === f ? 'bg-ink text-white border-ink' : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/30'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Mentor listesi */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((session: any) => (
            <div key={session.id} className="card hover:border-brand/25 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-brand/15 flex items-center justify-center text-lg font-bold text-brand font-serif flex-shrink-0 overflow-hidden">
                  {session.mentor?.avatar_url
                    ? <img src={session.mentor.avatar_url} alt="" className="w-full h-full object-cover" />
                    : session.mentor?.full_name?.[0]
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-bold text-ink text-sm">{session.mentor?.full_name}</h2>
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <span className="mono text-xs text-ink/35">Mentor</span>
                    </div>
                  </div>
                  <p className="text-xs text-ink/40 truncate">
                    {session.mentor?.university}
                    {session.mentor?.department && ` · ${session.mentor.department}`}
                  </p>
                </div>
              </div>

              {session.title && (
                <h3 className="font-medium text-ink text-sm mb-1">{session.title}</h3>
              )}
              {session.description && (
                <p className="text-xs text-ink/50 leading-relaxed mb-2 line-clamp-2">{session.description}</p>
              )}

              {/* Uzmanlık alanları */}
              {session.expertise && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {session.expertise.split(',').slice(0, 3).map((area: string, i: number) => (
                    <span key={i} className="mono text-xs bg-neutral-100 text-ink/55 border border-neutral-200 rounded px-1.5 py-0.5">
                      {area.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Yetenekler */}
              {session.mentor?.user_skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {session.mentor.user_skills.slice(0, 3).map((s: any, i: number) => (
                    <span key={i} className="mono text-xs bg-brand/5 text-brand/70 border border-brand/10 rounded px-1.5 py-0.5">
                      {s.skill_name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs text-ink/40">
                  <Clock size={11} />
                  <span>
                    {DAY_LABELS[session.day_of_week] || session.day_of_week} · {session.time_slot}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {booked.has(session.id) ? (
                    <span className="mono text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle size={11} /> Mesaj gönderildi
                    </span>
                  ) : (
                    <button onClick={() => bookSession(session)} disabled={booking === session.id}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 disabled:opacity-50">
                      <MessageCircle size={11} />
                      {booking === session.id ? '...' : 'Randevu al'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
          <Clock size={36} className="text-ink/15 mx-auto mb-3" />
          <p className="font-serif text-lg font-bold text-ink/40 mb-1">
            {filter !== 'Tümü' ? `${filter} alanında mentor bulunamadı.` : 'Henüz mentor yok.'}
          </p>
          <p className="text-sm text-ink/30 mb-5">İlk mentor sen ol.</p>
          {!isMentor && (
            <Link href="/office-hours/yeni" className="btn-primary inline-flex items-center gap-1.5 text-sm">
              <Plus size={13} /> Mentor ol
            </Link>
          )}
        </div>
      )}
    </div>
  )
}