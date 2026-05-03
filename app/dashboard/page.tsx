import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Plus, Zap, Users, TrendingUp } from 'lucide-react'
import type { Startup, StartupUpdate } from '@/types'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: myStartups } = await supabase
    .from('startups')
    .select('*')
    .eq('founder_id', user.id)
    .order('created_at', { ascending: false })

  const { data: recentUpdates } = await supabase
    .from('startup_updates')
    .select('*, author:profiles(full_name, username, avatar_url), startup:startups(name, slug)')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">HOŞ GELDİN</p>
            <h1 className="font-serif text-3xl font-bold text-ink">
              {profile?.full_name?.split(' ')[0] || 'Kurucu'} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white border border-ink/10 rounded-lg px-4 py-2.5">
            <Zap size={14} className="text-brand" />
            <span className="mono text-sm font-medium text-ink">
              {profile?.karma_tokens || 0} Karma
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">STARTUPLAR</p>
            <p className="font-serif text-3xl font-bold text-ink">{myStartups?.length || 0}</p>
          </div>
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">KARMA TOKEN</p>
            <p className="font-serif text-3xl font-bold text-brand">{profile?.karma_tokens || 0}</p>
          </div>
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">GÜNCELLEMELER</p>
            <p className="font-serif text-3xl font-bold text-ink">
              {recentUpdates?.filter(u => myStartups?.some(s => s.id === u.startup_id)).length || 0}
            </p>
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
                  <Link
                    key={startup.id}
                    href={`/startup/${startup.slug}`}
                    className="card block hover:border-brand/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-ink group-hover:text-brand transition-colors">
                          {startup.name}
                        </h3>
                        <p className="text-sm text-ink/50 mt-1 line-clamp-2">
                          {startup.description}
                        </p>
                      </div>
                      <span className="mono text-xs text-ink/30 border border-ink/10 rounded px-2 py-0.5 ml-4 whitespace-nowrap">
                        {startup.stage}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <TrendingUp size={32} className="text-ink/20 mx-auto mb-3" />
                <p className="text-sm text-ink/40 mb-4">Henüz bir startup yok.</p>
                <Link href="/startup/new" className="btn-primary inline-flex items-center gap-1.5 text-xs">
                  <Plus size={12} />
                  İlk startupını oluştur
                </Link>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-ink mb-4">Topluluk akışı</h2>
            <div className="space-y-3">
              {recentUpdates && recentUpdates.length > 0 ? (
                recentUpdates.map((update: any) => (
                  <div key={update.id} className="card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-brand/15 flex items-center justify-center text-xs font-bold text-brand">
                        {update.author?.full_name?.[0] || '?'}
                      </div>
                      <span className="text-xs text-ink/50">
                        {update.author?.full_name}
                      </span>
                      <span className="mono text-xs text-ink/25">·</span>
                      <span className="text-xs text-ink/35">{update.startup?.name}</span>
                    </div>
                    <p className="text-sm font-medium text-ink line-clamp-2">{update.title}</p>
                  </div>
                ))
              ) : (
                <div className="card p-4 text-center">
                  <Users size={24} className="text-ink/20 mx-auto mb-2" />
                  <p className="text-xs text-ink/40">Henüz güncelleme yok.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
