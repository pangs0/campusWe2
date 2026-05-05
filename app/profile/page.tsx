import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Edit, Zap, TrendingUp, ArrowRight, Building2, Heart, Briefcase } from 'lucide-react'
import ProfileClient from '@/app/profile/ProfileClient'
import ProfilePosts from '@/app/profile/ProfilePosts'
import type { Startup } from '@/types'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const role = profile?.role || 'founder'

  const { data: skills } = await supabase
    .from('user_skills').select('*').eq('user_id', user.id)

  const { data: startups } = await supabase
    .from('startups').select('*').eq('founder_id', user.id).order('created_at', { ascending: false })

  const { data: posts } = await supabase
    .from('posts')
    .select(`*, author:profiles(full_name, avatar_url), startup:startups(name, slug), post_likes(user_id), post_comments(*, author:profiles(full_name, avatar_url))`)
    .eq('user_id', user.id).order('created_at', { ascending: false })

  // Yatırımcı verileri
  const { data: investorProfile } = role === 'investor'
    ? await supabase.from('investor_profiles').select('*').eq('id', user.id).single()
    : { data: null }

  const { data: portfolio } = role === 'investor'
    ? await supabase.from('investor_portfolio').select('*').eq('investor_id', user.id).order('year', { ascending: false })
    : { data: null }

  const { data: favorites } = role === 'investor'
    ? await supabase.from('investor_favorites').select('*, startup:startups(name, slug, stage)').eq('investor_id', user.id)
    : { data: null }

  // Şirket verileri
  const { data: companyProfile } = role === 'company'
    ? await supabase.from('company_profiles').select('*').eq('id', user.id).single()
    : { data: null }

  const { data: companyEvents } = role === 'company'
    ? await supabase.from('company_events').select('*').eq('company_id', user.id).order('event_date', { ascending: false }).limit(3)
    : { data: null }

  const { data: jobListings } = role === 'company'
    ? await supabase.from('job_listings').select('*').eq('company_id', user.id).eq('is_active', true)
    : { data: null }

  const stageColors: Record<string, string> = {
    fikir: 'bg-amber-50 text-amber-700 border-amber-200',
    mvp: 'bg-blue-50 text-blue-700 border-blue-200',
    traction: 'bg-purple-50 text-purple-700 border-purple-200',
    büyüme: 'bg-green-50 text-green-700 border-green-200',
  }

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <div className="grid grid-cols-3 gap-6">

          {/* Sol kolon — profil bilgileri */}
          <div className="col-span-1 space-y-4">

            {/* Profil kartı */}
            <div className="card">
              <ProfileClient
                userId={user.id}
                avatarUrl={profile?.avatar_url || null}
                fullName={profile?.full_name || '?'}
                username={profile?.username || ''}
                university={profile?.university || null}
                department={profile?.department || null}
                karmaTokens={profile?.karma_tokens || 0}
                role={role}
              />
              <Link href="/profile/edit" className="btn-secondary w-full flex items-center justify-center gap-1.5 text-xs py-2 mt-3">
                <Edit size={12} /> Profili düzenle
              </Link>
            </div>

            {/* Hakkında */}
            {profile?.bio && (
              <div className="card">
                <p className="mono text-xs text-ink/35 tracking-widest mb-2">HAKKINDA</p>
                <p className="text-sm text-ink/60 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* FOUNDER: Yetenekler + Startuplar */}
            {role === 'founder' && (
              <>
                <div className="card">
                  <p className="mono text-xs text-ink/35 tracking-widest mb-3">YETENEKLERİM</p>
                  {skills && skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill: any) => (
                        <span key={skill.id} className="mono text-xs bg-neutral-100 text-ink/60 border border-neutral-200 rounded px-2 py-0.5">{skill.skill_name}</span>
                      ))}
                    </div>
                  ) : <p className="text-xs text-ink/35 mb-2">Henüz yetenek eklenmedi.</p>}
                  <Link href="/profile/edit" className="text-xs text-brand hover:underline mt-2 block">+ Yetenek ekle</Link>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <p className="mono text-xs text-ink/35 tracking-widest">STARTUPLARIM</p>
                    <Link href="/startup/new" className="text-xs text-brand hover:underline">+ Yeni</Link>
                  </div>
                  {startups && startups.length > 0 ? (
                    <div className="space-y-2">
                      {startups.map((s: Startup) => (
                        <Link key={s.id} href={`/startup/${s.slug}`} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg hover:bg-brand/5 transition-colors group">
                          <div>
                            <p className="text-sm font-medium text-ink group-hover:text-brand transition-colors">{s.name}</p>
                            <p className="mono text-xs text-ink/35">{s.stage}</p>
                          </div>
                          <ArrowRight size={12} className="text-ink/20 group-hover:text-brand" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <TrendingUp size={24} className="text-ink/15 mx-auto mb-2" />
                      <p className="text-xs text-ink/35 mb-2">Henüz startup yok.</p>
                      <Link href="/startup/new" className="text-xs text-brand hover:underline">Oluştur →</Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* INVESTOR: Profil + Portföy özeti */}
            {role === 'investor' && (
              <>
                <div className="card">
                  <p className="mono text-xs text-ink/35 tracking-widest mb-3">YATIRIMCI BİLGİLERİ</p>
                  <div className="space-y-2">
                    {investorProfile?.firm_name && (
                      <div className="flex gap-2">
                        <span className="mono text-xs text-ink/30 w-16 flex-shrink-0">FİRMA</span>
                        <span className="text-sm text-ink/70">{investorProfile.firm_name}</span>
                      </div>
                    )}
                    {investorProfile?.title && (
                      <div className="flex gap-2">
                        <span className="mono text-xs text-ink/30 w-16 flex-shrink-0">UNVAN</span>
                        <span className="text-sm text-ink/70">{investorProfile.title}</span>
                      </div>
                    )}
                    {investorProfile?.ticket_size && (
                      <div className="flex gap-2">
                        <span className="mono text-xs text-ink/30 w-16 flex-shrink-0">TİCKET</span>
                        <span className="text-sm text-brand font-medium">{investorProfile.ticket_size}</span>
                      </div>
                    )}
                  </div>
                  <Link href="/yatirimci" className="text-xs text-brand hover:underline mt-3 block">Panele git →</Link>
                </div>

                {portfolio && portfolio.length > 0 && (
                  <div className="card">
                    <div className="flex items-center justify-between mb-3">
                      <p className="mono text-xs text-ink/35 tracking-widest">PORTFÖY</p>
                      <Link href="/yatirimci/portfoy" className="text-xs text-brand hover:underline">{portfolio.length} yatırım</Link>
                    </div>
                    <div className="space-y-2">
                      {portfolio.slice(0, 4).map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between">
                          <span className="text-sm text-ink/70">{p.company_name}</span>
                          <div className="flex items-center gap-1.5">
                            {p.sector && <span className="mono text-xs text-ink/30">{p.sector}</span>}
                            {p.year && <span className="mono text-xs text-ink/20">{p.year}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {favorites && favorites.length > 0 && (
                  <div className="card">
                    <p className="mono text-xs text-ink/35 tracking-widest mb-3">FAVORİ STARTUPLAR</p>
                    <div className="space-y-1.5">
                      {favorites.slice(0, 4).map((f: any) => (
                        <Link key={f.id} href={`/startup/${f.startup?.slug}`} className="flex items-center justify-between hover:text-brand transition-colors">
                          <span className="text-sm text-ink/70">{f.startup?.name}</span>
                          <span className={`mono text-xs border rounded px-1.5 py-0.5 ${stageColors[f.startup?.stage] || ''}`}>{f.startup?.stage}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* COMPANY: Şirket bilgileri + Etkinlikler */}
            {role === 'company' && (
              <>
                <div className="card">
                  <p className="mono text-xs text-ink/35 tracking-widest mb-3">ŞİRKET BİLGİLERİ</p>
                  <div className="space-y-2">
                    {companyProfile?.company_name && (
                      <div className="flex gap-2">
                        <span className="mono text-xs text-ink/30 w-16 flex-shrink-0">ŞİRKET</span>
                        <span className="text-sm text-ink/70 font-medium">{companyProfile.company_name}</span>
                      </div>
                    )}
                    {companyProfile?.sector && (
                      <div className="flex gap-2">
                        <span className="mono text-xs text-ink/30 w-16 flex-shrink-0">SEKTÖR</span>
                        <span className="text-sm text-ink/70">{companyProfile.sector}</span>
                      </div>
                    )}
                    {companyProfile?.company_size && (
                      <div className="flex gap-2">
                        <span className="mono text-xs text-ink/30 w-16 flex-shrink-0">BOYUT</span>
                        <span className="text-sm text-ink/70">{companyProfile.company_size} çalışan</span>
                      </div>
                    )}
                  </div>
                  <Link href="/sirket" className="text-xs text-brand hover:underline mt-3 block">Panele git →</Link>
                </div>

                {companyEvents && companyEvents.length > 0 && (
                  <div className="card">
                    <div className="flex items-center justify-between mb-3">
                      <p className="mono text-xs text-ink/35 tracking-widest">ETKİNLİKLER</p>
                      <Link href="/sirket/etkinlikler" className="text-xs text-brand hover:underline">Tümü</Link>
                    </div>
                    <div className="space-y-2">
                      {companyEvents.map((ev: any) => (
                        <div key={ev.id} className="p-2.5 bg-neutral-50 rounded-lg">
                          <p className="text-sm font-medium text-ink">{ev.title}</p>
                          <p className="mono text-xs text-ink/35">{ev.event_type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {jobListings && jobListings.length > 0 && (
                  <div className="card">
                    <div className="flex items-center justify-between mb-3">
                      <p className="mono text-xs text-ink/35 tracking-widest">AÇIK İLANLAR</p>
                      <Link href="/sirket/ilanlar" className="text-xs text-brand hover:underline">{jobListings.length} ilan</Link>
                    </div>
                    <div className="space-y-2">
                      {jobListings.slice(0, 3).map((j: any) => (
                        <div key={j.id} className="flex items-center justify-between">
                          <span className="text-sm text-ink/70">{j.title}</span>
                          <span className="mono text-xs text-amber-600">{j.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sağ kolon — paylaşımlar */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-ink">Paylaşımlar</h2>
              <span className="mono text-xs text-ink/35">{posts?.length || 0} paylaşım</span>
            </div>

            <ProfilePosts
              userId={user.id}
              avatarUrl={profile?.avatar_url || null}
              fullName={profile?.full_name || '?'}
              startups={startups?.map(s => ({ id: s.id, name: s.name })) || []}
              initialPosts={posts || []}
            />
          </div>
        </div>
      </main>
    </AppLayout>
  )
}