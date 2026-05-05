import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import FeedClient from '@/app/feed/FeedClient'
import Link from 'next/link'
import { Users, Calendar, TrendingUp, Zap, ArrowRight } from 'lucide-react'

export default async function FeedPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: startups } = await supabase
    .from('startups').select('id, name').eq('founder_id', user.id)

  const { data: posts } = await supabase
    .from('posts')
    .select(`*, author:profiles(full_name, avatar_url, username), startup:startups(name, slug), post_likes(user_id), post_comments(*, author:profiles(full_name, avatar_url))`)
    .order('created_at', { ascending: false })
    .limit(30)

  // Önerilen kullanıcılar — aynı üniversiteden veya yüksek karma
  const { data: suggested } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, university, karma_tokens, user_skills(skill_name)')
    .neq('id', user.id)
    .order('karma_tokens', { ascending: false })
    .limit(5)

  // Yaklaşan etkinlikler
  const { data: events } = await supabase
    .from('garaj_events')
    .select('id, title, event_type, event_date, organizer:profiles(full_name)')
    .eq('is_public', true)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(4)

  // Trend startuplar — en fazla güncelleme yapan
  const { data: trendStartups } = await supabase
    .from('startups')
    .select('id, name, slug, stage, sector, founder:profiles(full_name)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(4)

  // Karma liderlik tablosu
  const { data: leaderboard } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, karma_tokens, university')
    .order('karma_tokens', { ascending: false })
    .limit(5)

  function timeLeft(date: string) {
    const diff = new Date(date).getTime() - Date.now()
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    if (days > 0) return `${days} gün`
    if (hours > 0) return `${hours} saat`
    return 'Bugün'
  }

  const typeColors: Record<string, string> = {
    networking: 'bg-purple-50 text-purple-700',
    workshop: 'bg-blue-50 text-blue-700',
    pitch: 'bg-amber-50 text-amber-700',
    sohbet: 'bg-green-50 text-green-700',
  }

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10">
        <div className="grid grid-cols-3 gap-6">

          {/* Sol — Ana akış */}
          <div className="col-span-2">
            <div className="mb-6">
              <p className="mono text-xs text-ink/35 tracking-widest mb-1">TOPLULUK</p>
              <h1 className="font-serif text-3xl font-bold text-ink">Akış</h1>
            </div>

            <FeedClient
              userId={user.id}
              avatarUrl={profile?.avatar_url || null}
              fullName={profile?.full_name || '?'}
              startups={startups?.map(s => ({ id: s.id, name: s.name })) || []}
              initialPosts={posts || []}
            />
          </div>

          {/* Sağ sidebar */}
          <div className="space-y-5">

            {/* Önerilen kullanıcılar */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="mono text-xs text-ink/35 tracking-widest">ÖNERİLEN</p>
                <Link href="/kesfet" className="text-xs text-brand hover:underline">Tümü</Link>
              </div>
              <div className="space-y-3">
                {suggested && suggested.length > 0 ? suggested.map((u: any) => (
                  <div key={u.id} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-xs">
                      {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : u.full_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{u.full_name}</p>
                      <p className="mono text-xs text-ink/35 truncate">{u.university || 'Girişimci'}</p>
                    </div>
                    <Link href="/eslestirme" className="text-xs text-brand hover:underline flex-shrink-0">
                      Bağlan
                    </Link>
                  </div>
                )) : (
                  <p className="text-xs text-ink/35 text-center py-2">Henüz kullanıcı yok.</p>
                )}
              </div>
            </div>

            {/* Yaklaşan etkinlikler */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="mono text-xs text-ink/35 tracking-widest">ETKİNLİKLER</p>
                <Link href="/garaj" className="text-xs text-brand hover:underline">Tümü</Link>
              </div>
              {events && events.length > 0 ? (
                <div className="space-y-2.5">
                  {events.map((ev: any) => (
                    <div key={ev.id} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 mt-0.5">
                        <span className={`mono text-xs rounded px-1.5 py-0.5 ${typeColors[ev.event_type] || 'bg-neutral-50 text-neutral-500'}`}>
                          {ev.event_type}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink line-clamp-1">{ev.title}</p>
                        <p className="mono text-xs text-ink/35">{timeLeft(ev.event_date)} sonra</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-xs text-ink/35 mb-2">Yaklaşan etkinlik yok.</p>
                  <Link href="/garaj/yeni" className="text-xs text-brand hover:underline">Etkinlik oluştur</Link>
                </div>
              )}
            </div>

            {/* Trend startuplar */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="mono text-xs text-ink/35 tracking-widest">TREND</p>
                <Link href="/kesfet" className="text-xs text-brand hover:underline">Tümü</Link>
              </div>
              {trendStartups && trendStartups.length > 0 ? (
                <div className="space-y-2.5">
                  {trendStartups.map((s: any) => (
                    <Link key={s.id} href={`/startup/${s.slug}`}
                      className="flex items-center justify-between group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink group-hover:text-brand transition-colors truncate">{s.name}</p>
                        <p className="mono text-xs text-ink/35">{s.stage}{s.sector && ` · ${s.sector}`}</p>
                      </div>
                      <ArrowRight size={12} className="text-ink/20 group-hover:text-brand transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink/35 text-center py-2">Henüz startup yok.</p>
              )}
            </div>

            {/* Karma liderlik tablosu */}
            <div className="card">
              <div className="flex items-center gap-1.5 mb-3">
                <Zap size={13} className="text-brand" />
                <p className="mono text-xs text-ink/35 tracking-widest">KARMA LİDERLİĞİ</p>
              </div>
              <div className="space-y-2.5">
                {leaderboard?.map((u: any, i: number) => (
                  <div key={u.id} className="flex items-center gap-2.5">
                    <span className="mono text-xs text-ink/25 w-4 text-center flex-shrink-0">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                    </span>
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-xs">
                      {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : u.full_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink truncate">{u.full_name}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="mono text-xs text-brand font-medium">{u.karma_tokens}</span>
                      <span className="text-xs">⚡</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </AppLayout>
  )
}