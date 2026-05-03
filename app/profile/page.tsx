import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { Zap, Edit, TrendingUp } from 'lucide-react'
import type { Startup } from '@/types'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: skills } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', user.id)

  const { data: startups } = await supabase
    .from('startups')
    .select('*')
    .eq('founder_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="card text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-brand/15 flex items-center justify-center text-2xl font-bold text-brand font-serif mx-auto mb-3">
                {profile?.full_name?.[0] || '?'}
              </div>
              <h1 className="font-serif text-xl font-bold text-ink">{profile?.full_name}</h1>
              <p className="mono text-xs text-ink/40 mt-1">@{profile?.username}</p>
              {profile?.university && (
                <p className="text-xs text-ink/45 mt-1">{profile.university}</p>
              )}
              {profile?.department && (
                <p className="text-xs text-ink/35">{profile.department}</p>
              )}

              <div className="flex items-center justify-center gap-1.5 mt-4 bg-brand/8 rounded-lg px-3 py-2">
                <Zap size={13} className="text-brand" />
                <span className="mono text-sm font-medium text-brand">
                  {profile?.karma_tokens || 0} Karma
                </span>
              </div>

              <Link
                href="/profile/edit"
                className="btn-secondary w-full mt-3 flex items-center justify-center gap-1.5 text-xs py-2"
              >
                <Edit size={12} />
                Profili düzenle
              </Link>
            </div>

            {profile?.bio && (
              <div className="card mb-4">
                <p className="mono text-xs text-ink/35 tracking-widest mb-2">HAKKINDA</p>
                <p className="text-sm text-ink/60 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">YETENEKLERİM</p>
              {skills && skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(skill => (
                    <span
                      key={skill.id}
                      className="mono text-xs bg-ink/5 text-ink/60 border border-ink/10 rounded px-2 py-0.5"
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink/35">Henüz yetenek eklenmedi.</p>
              )}
              <Link
                href="/profile/edit"
                className="text-xs text-brand hover:underline mt-3 block"
              >
                + Yetenek ekle
              </Link>
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-ink">Startuplarım</h2>
              <Link href="/startup/new" className="btn-primary py-1.5 px-3 text-xs">
                + Yeni
              </Link>
            </div>

            {startups && startups.length > 0 ? (
              <div className="space-y-3">
                {startups.map((startup: Startup) => (
                  <Link
                    key={startup.id}
                    href={`/startup/${startup.slug}`}
                    className="card block hover:border-brand/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-serif font-bold text-ink group-hover:text-brand transition-colors mb-1">
                          {startup.name}
                        </h3>
                        {startup.description && (
                          <p className="text-sm text-ink/50 line-clamp-2">{startup.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {startup.sector && (
                          <span className="mono text-xs text-ink/30">{startup.sector}</span>
                        )}
                        <span className="mono text-xs border border-ink/10 rounded px-2 py-0.5 text-ink/40">
                          {startup.stage}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <TrendingUp size={32} className="text-ink/20 mx-auto mb-3" />
                <p className="text-sm text-ink/40 mb-4">Henüz bir startup yok.</p>
                <Link href="/startup/new" className="btn-primary inline-flex text-xs">
                  İlk startupını oluştur
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
