import { createClient } from '@/lib/supabase/server'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Plus, Calendar, Users, MessageSquare } from 'lucide-react'


export default async function GarajPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: events } = await supabase
    .from('garaj_events')
    .select('*, organizer:profiles(full_name, username, avatar_url)')
    .eq('is_public', true)
    .order('event_date', { ascending: true })

  const { data: userProfile } = user ? await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
    : { data: null }

  function timeLeft(date: string) {
    const diff = new Date(date).getTime() - Date.now()
    if (diff < 0) return 'Sona erdi'
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    if (days > 0) return `${days} gün sonra`
    if (hours > 0) return `${hours} saat sonra`
    return 'Bugün'
  }

  const typeColors: Record<string, string> = {
    networking: 'bg-purple-50 text-purple-700 border-purple-200',
    workshop: 'bg-blue-50 text-blue-700 border-blue-200',
    pitch: 'bg-amber-50 text-amber-700 border-amber-200',
    sohbet: 'bg-green-50 text-green-700 border-green-200',
  }

  return (
    <AppLayout user={user} profile={userProfile}>
      

      <main className="px-8 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">AÇIK GARAJ</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Topluluk etkinlikleri.</h1>
            <p className="text-sm text-ink/45 mt-1">
              Herkesin katılabileceği etkinlikler ve sohbetler.
            </p>
          </div>
          {user && (
            <Link href="/garaj/yeni" className="btn-primary flex items-center gap-1.5 text-xs">
              <Plus size={13} />
              Etkinlik oluştur
            </Link>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Calendar, n: events?.length || 0, l: 'Aktif etkinlik' },
            { icon: Users, n: '—', l: 'Bu hafta katılımcı' },
            { icon: MessageSquare, n: '—', l: 'Topluluk sohbeti' },
          ].map((s, i) => (
            <div key={i} className="card flex items-center gap-3 py-4">
              <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                <s.icon size={15} className="text-brand" />
              </div>
              <div>
                <div className="font-serif text-xl font-bold text-ink">{s.n}</div>
                <div className="mono text-xs text-ink/35">{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {events.map((event: any) => (
              <div key={event.id} className="card hover:border-brand/30 transition-colors p-0 overflow-hidden">
                {/* Banner */}
                {event.banner_url ? (
                  <div className="w-full h-36 overflow-hidden">
                    <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-20 flex items-center justify-center text-2xl"
                    style={{ background: 'linear-gradient(135deg, #1a1a18, #2a1a10)' }}>
                    {event.cover_emoji || '🎉'}
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`mono text-xs border rounded px-2 py-0.5 ${typeColors[event.event_type] || 'bg-neutral-50 text-neutral-500 border-neutral-200'}`}>
                      {event.event_type}
                    </span>
                    <span className="mono text-xs text-ink/35">{timeLeft(event.event_date)}</span>
                  </div>

                  <h2 className="font-serif text-lg font-bold text-ink mb-1">{event.title}</h2>
                  {event.description && (
                    <p className="text-sm text-ink/50 line-clamp-2 leading-relaxed mb-3">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-brand/15 flex items-center justify-center text-xs font-bold text-brand overflow-hidden">
                        {event.organizer?.avatar_url
                          ? <img src={event.organizer.avatar_url} alt="" className="w-full h-full object-cover" />
                          : event.organizer?.full_name?.[0]
                        }
                      </div>
                      <span className="text-xs text-ink/40">{event.organizer?.full_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink/35">
                      <Calendar size={12} />
                      {new Date(event.event_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar size={40} className="text-ink/15 mx-auto mb-4" />
            <p className="text-ink/40 font-serif text-xl mb-2">Henüz etkinlik yok.</p>
            <p className="text-sm text-ink/30 mb-6">İlk etkinliği sen oluştur.</p>
            {user && (
              <Link href="/garaj/yeni" className="btn-primary inline-flex items-center gap-1.5 text-xs">
                <Plus size={13} />
                Etkinlik oluştur
              </Link>
            )}
          </div>
        )}
      </main>
    </AppLayout>
  )
}