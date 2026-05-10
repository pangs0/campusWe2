import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { Plus, Zap, Users, TrendingUp, ArrowRight, CheckCircle, Circle, User, Briefcase, Star } from 'lucide-react'
import type { Startup } from '@/types'

function getProfileCompletion(profile: any, skills: any[], startups: any[]) {
  const steps = [
    { key: 'name', label: 'Ad soyad ekle', done: !!profile?.full_name, href: '/profile/edit' },
    { key: 'university', label: 'Üniversite ekle', done: !!profile?.university, href: '/profile/edit' },
    { key: 'bio', label: 'Hakkında yaz', done: !!profile?.bio, href: '/profile/edit' },
    { key: 'skills', label: 'Yetenek ekle', done: (skills?.length || 0) > 0, href: '/profile/edit' },
    { key: 'startup', label: 'Startup oluştur', done: (startups?.length || 0) > 0, href: '/startup/new' },
  ]
  const completed = steps.filter(s => s.done).length
  const percent = Math.round((completed / steps.length) * 100)
  return { steps, completed, percent }
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: skills } = await supabase
    .from('user_skills').select('*').eq('user_id', user.id)

  const { data: myStartups } = await supabase
    .from('startups').select('*').eq('founder_id', user.id).order('created_at', { ascending: false })

  const { data: recentUpdates } = await supabase
    .from('startup_updates')
    .select('*, author:profiles(full_name), startup:startups(name, slug)')
    .order('created_at', { ascending: false })
    .limit(8)

  // Yaklaşan toplantı
  const { data: upcomingMeeting } = await supabase
    .from('meetings')
    .select('*, startup:startups(name, slug)')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(1)
    .single()

  // Bekleyen görevler
  const { count: pendingTasks } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('assigned_to', user.id)
    .neq('status', 'done')

  // Okunmamış mesajlar
  const { count: unreadMessages } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)

  // Günlük hedefler
  const today = new Date().toISOString().split('T')[0]
  const { data: todayGoals } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .order('created_at')

  const { percent, steps } = getProfileCompletion(profile, skills || [], myStartups || [])
  const isNew = (myStartups?.length || 0) === 0 && (skills?.length || 0) === 0

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">

        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">HOŞ GELDİN</p>
            <h1 className="font-serif text-3xl font-bold text-ink">
              {profile?.full_name?.split(' ')[0] || 'Kurucu'} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-4 py-2.5">
            <Zap size={14} className="text-brand" />
            <span className="mono text-sm font-medium text-ink">{profile?.karma_tokens || 0} Karma</span>
          </div>
        </div>

        {isNew && (
          <div className="card mb-8" style={{ borderColor: 'rgba(196,80,10,.2)', background: 'rgba(196,80,10,.02)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={15} className="text-brand" />
              <p className="font-medium text-ink text-sm">Başlamak için 3 adım</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: '1', title: 'Profilini tamamla', desc: 'Yeteneklerini ekle, topluluk seni tanısın.', href: '/profile/edit', icon: User },
                { n: '2', title: 'Startup oluştur', desc: 'Fikrini paylaş, co-founder ve yatırımcı bulsun.', href: '/startup/new', icon: Briefcase },
                { n: '3', title: 'Topluluğa katıl', desc: 'Kahve Molası\'nda biriyle tanış, ağını genişlet.', href: '/kahve', icon: Users },
              ].map(s => (
                <Link key={s.n} href={s.href} className="bg-white border border-neutral-200 rounded-xl p-4 hover:border-brand/40 transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center mono text-xs font-bold text-brand mb-3">{s.n}</div>
                  <p className="font-medium text-ink text-sm mb-1 group-hover:text-brand transition-colors">{s.title}</p>
                  <p className="text-xs text-ink/45 leading-relaxed">{s.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {percent < 100 && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User size={14} className="text-ink/40" />
                <p className="text-sm font-medium text-ink">Profil tamamlanma</p>
              </div>
              <span className="mono text-sm font-bold text-brand">{percent}%</span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full mb-4 overflow-hidden">
              <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {steps.map(s => (
                <Link key={s.key} href={s.href}
                  className={`flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 border transition-colors ${
                    s.done
                      ? 'text-ink/30 border-neutral-100 bg-neutral-50 pointer-events-none'
                      : 'text-brand border-brand/20 bg-brand/5 hover:bg-brand/10'
                  }`}
                >
                  {s.done
                    ? <CheckCircle size={11} className="text-green-500 flex-shrink-0" />
                    : <Circle size={11} className="text-brand flex-shrink-0" />
                  }
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">STARTUPLAR</p>
            <p className="font-serif text-3xl font-bold text-ink">{myStartups?.length || 0}</p>
          </div>
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">KARMA TOKEN</p>
            <p className="font-serif text-3xl font-bold text-brand">{profile?.karma_tokens || 0}</p>
          </div>
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">BEKLİYEN GÖREV</p>
            <p className="font-serif text-3xl font-bold text-ink">{pendingTasks || 0}</p>
          </div>
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">YETENEKLERİM</p>
            <p className="font-serif text-3xl font-bold text-ink">{skills?.length || 0}</p>
          </div>
        </div>

        {/* Günlük hedefler + Yaklaşan toplantı */}
        <div className="grid grid-cols-2 gap-4 mb-8">

          {/* Günlük hedefler */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="mono text-xs text-ink/35 tracking-widest">BUGÜNÜN HEDEFLERİ</p>
              <Link href="/kutuphane" className="text-xs text-brand hover:underline">Tümü →</Link>
            </div>
            {todayGoals && todayGoals.length > 0 ? (
              <div className="space-y-1.5">
                {todayGoals.slice(0, 4).map((g: any) => (
                  <div key={g.id} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${g.is_completed ? 'bg-green-500 border-green-500' : 'border-neutral-300'}`}>
                      {g.is_completed && <CheckCircle size={10} color="white" />}
                    </div>
                    <span className={`text-sm ${g.is_completed ? 'line-through text-ink/30' : 'text-ink/70'}`}>{g.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-ink/35 mb-2">Bugün için hedef belirlemedin.</p>
                <Link href="/kutuphane" className="text-xs text-brand hover:underline">Hedef ekle →</Link>
              </div>
            )}
          </div>

          {/* Yaklaşan toplantı */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="mono text-xs text-ink/35 tracking-widest">YAKLAŞAN TOPLANTI</p>
              {myStartups?.[0] && (
                <Link href={`/workspace/${myStartups[0].slug}`} className="text-xs text-brand hover:underline">Workspace →</Link>
              )}
            </div>
            {upcomingMeeting ? (
              <div className="p-3 rounded-xl" style={{ background: 'rgba(196,80,10,.04)', border: '1px solid rgba(196,80,10,.12)' }}>
                <p className="text-sm font-medium text-ink">{upcomingMeeting.title}</p>
                <p className="mono text-xs text-ink/40 mt-1">
                  {new Date(upcomingMeeting.scheduled_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  {' · '}
                  {new Date(upcomingMeeting.scheduled_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                {upcomingMeeting.startup && (
                  <p className="mono text-xs text-brand mt-0.5">{upcomingMeeting.startup.name}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-ink/35 mb-2">Yaklaşan toplantı yok.</p>
                {myStartups?.[0] && (
                  <Link href={`/workspace/${myStartups[0].slug}`} className="text-xs text-brand hover:underline">Toplantı oluştur →</Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-ink">Startuplarım</h2>
              <Link href="/startup/new" className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5">
                <Plus size={12} />
                Yeni startup
              </Link>
            </div>

            {myStartups && myStartups.length > 0 ? (
              <div className="space-y-3">
                {myStartups.map((startup: Startup) => (
                  <Link key={startup.id} href={`/startup/${startup.slug}`}
                    className="card block hover:border-brand/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-ink group-hover:text-brand transition-colors">{startup.name}</h3>
                        <p className="text-sm text-ink/50 mt-1 line-clamp-2">{startup.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <span className="mono text-xs text-ink/30 border border-neutral-200 rounded px-2 py-0.5">{startup.stage}</span>
                        <ArrowRight size={13} className="text-ink/20 group-hover:text-brand transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card py-12 text-center" style={{ background: '#faf9f6', border: '1.5px dashed rgba(26,26,24,.15)' }}>
                <TrendingUp size={36} className="text-brand/30 mx-auto mb-4" />
                <p className="font-serif text-lg font-bold text-ink mb-1">Fikrin var mı?</p>
                <p className="text-sm text-ink/45 mb-5 max-w-xs mx-auto leading-relaxed">
                  Her büyük startup bir eksiklikle başladı. Seninkini buraya taşı.
                </p>
                <Link href="/startup/new" className="btn-primary inline-flex items-center gap-1.5 text-sm">
                  <Plus size={14} />
                  İlk startupını oluştur
                </Link>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-ink mb-4">Topluluk akışı</h2>
            {recentUpdates && recentUpdates.length > 0 ? (
              <div className="space-y-2">
                {recentUpdates.map((update: any) => (
                  <div key={update.id} className="card p-3 hover:border-neutral-300 transition-colors">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-brand/15 flex items-center justify-center text-xs font-bold text-brand flex-shrink-0">
                        {update.author?.full_name?.[0] || '?'}
                      </div>
                      <span className="text-xs text-ink/45 truncate">{update.author?.full_name}</span>
                      <span className="text-xs text-ink/20">·</span>
                      <span className="text-xs text-ink/30 truncate">{update.startup?.name}</span>
                    </div>
                    <p className="text-sm font-medium text-ink line-clamp-2">{update.title}</p>
                  </div>
                ))}
                <Link href="/kesfet" className="flex items-center justify-center gap-1 text-xs text-brand hover:underline py-2">
                  Tüm startupları keşfet <ArrowRight size={11} />
                </Link>
              </div>
            ) : (
              <div className="card py-10 text-center" style={{ border: '1.5px dashed rgba(26,26,24,.12)' }}>
                <Users size={28} className="text-ink/15 mx-auto mb-3" />
                <p className="text-sm font-medium text-ink/50 mb-1">Topluluk sessiz.</p>
                <p className="text-xs text-ink/35 mb-4 leading-relaxed">İlk güncellemeyi paylaşan sen ol.</p>
                <Link href="/startup/new" className="text-xs text-brand hover:underline inline-flex items-center gap-1">
                  Startup oluştur <ArrowRight size={11} />
                </Link>
              </div>
            )}

            <div className="mt-4 space-y-1.5">
              <p className="mono text-xs text-ink/30 tracking-widest mb-2">HIZLI ERİŞİM</p>
              {[
                { label: 'Kahve Molası — biriyle tanış', href: '/kahve' },
                { label: 'Takas teklifi oluştur', href: '/takas/yeni' },
                { label: 'Mentor bul', href: '/office-hours' },
                { label: 'Demo Day\'e başvur', href: '/demo-day/basvur' },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  className="flex items-center justify-between p-2.5 bg-white border border-neutral-200 rounded-lg hover:border-brand/30 hover:bg-brand/3 transition-colors group text-xs text-ink/55 hover:text-ink"
                >
                  {a.label}
                  <ArrowRight size={11} className="text-ink/20 group-hover:text-brand transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}