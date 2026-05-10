'use client'

import Link from 'next/link'
import { Edit, Briefcase, Calendar, Eye, ArrowRight, Globe, Linkedin, Building2, Users } from 'lucide-react'
import ProfilePosts from './ProfilePosts'
import ProfileClient from './ProfileClient'

type Props = {
  user: any; profile: any; companyProfile: any
  jobListings: any[]; companyEvents: any[]; watchlist: any[]; posts: any[]
}

export default function CompanyProfile({ user, profile, companyProfile, jobListings, companyEvents, watchlist, posts }: Props) {
  const stats = [
    { n: jobListings.length, l: 'Aktif ilan' },
    { n: companyEvents.length, l: 'Etkinlik' },
    { n: watchlist.length, l: 'Takip edilen startup' },
    { n: posts.length, l: 'Paylaşım' },
  ]

  return (
    <div>
      {/* Kapak */}
      <div style={{ height: 140, background: 'linear-gradient(135deg, #1a1a18 0%, #0f1a2a 100%)', borderRadius: '12px 12px 0 0', marginBottom: -60, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(196,80,10,.05) 35px, rgba(196,80,10,.05) 70px)', borderRadius: '12px 12px 0 0' }} />
        <Link href="/profile/edit" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Edit size={12} /> Profili düzenle
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sol kolon */}
        <div className="col-span-1 space-y-4">
          <div className="card" style={{ paddingTop: 72 }}>
            <ProfileClient
              userId={user.id} avatarUrl={profile?.avatar_url || null}
              fullName={profile?.full_name || '?'} username={profile?.username || ''}
              university={null} department={null}
              karmaTokens={profile?.karma_tokens || 0} role="company"
            />
          </div>

          {/* İstatistikler */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">İSTATİSTİKLER</p>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="text-center p-2 rounded-lg" style={{ background: 'rgba(196,80,10,.04)' }}>
                  <p className="font-serif text-xl font-bold text-brand">{s.n}</p>
                  <p className="mono text-xs text-ink/35">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Şirket bilgileri */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="mono text-xs text-ink/35 tracking-widest">ŞİRKET BİLGİLERİ</p>
              <Link href="/profile/edit" className="text-xs text-brand hover:underline">Düzenle</Link>
            </div>
            <div className="space-y-2.5">
              {companyProfile?.company_name && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-0.5">ŞİRKET ADI</p>
                  <p className="text-sm font-medium text-ink">{companyProfile.company_name}</p>
                </div>
              )}
              {companyProfile?.sector && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-0.5">SEKTÖR</p>
                  <p className="text-sm text-ink/70">{companyProfile.sector}</p>
                </div>
              )}
              {companyProfile?.company_size && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-0.5">ÇALIŞAN SAYISI</p>
                  <p className="text-sm text-ink/70 flex items-center gap-1">
                    <Users size={12} /> {companyProfile.company_size}+
                  </p>
                </div>
              )}
              {companyProfile?.founded_year && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-0.5">KURULUŞ YILI</p>
                  <p className="text-sm text-ink/70">{companyProfile.founded_year}</p>
                </div>
              )}
              {companyProfile?.looking_for?.length > 0 && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-1.5">ARANAN PROFİLLER</p>
                  <div className="flex flex-wrap gap-1">
                    {companyProfile.looking_for.map((l: string) => (
                      <span key={l} className="mono text-xs bg-brand/8 text-brand border border-brand/15 rounded px-2 py-0.5">{l}</span>
                    ))}
                  </div>
                </div>
              )}
              {companyProfile?.website_url && (
                <a href={companyProfile.website_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-brand transition-colors">
                  <Globe size={12} /> Web sitesi
                </a>
              )}
              {companyProfile?.linkedin_url && (
                <a href={companyProfile.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-brand transition-colors">
                  <Linkedin size={12} /> LinkedIn
                </a>
              )}
            </div>
            {!companyProfile?.company_name && (
              <Link href="/profile/edit" className="text-xs text-brand hover:underline block mt-2">+ Şirket bilgilerini ekle</Link>
            )}
          </div>

          {/* Hakkında */}
          {profile?.bio && (
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-2">HAKKINDA</p>
              <p className="text-sm text-ink/60 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Takip edilen startuplar */}
          {watchlist.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="mono text-xs text-ink/35 tracking-widest">TAKİP EDİLEN STARTUPLAR</p>
                <Link href="/sirket" className="text-xs text-brand hover:underline">Tümü</Link>
              </div>
              <div className="space-y-1.5">
                {watchlist.slice(0, 5).map((w: any) => (
                  <Link key={w.id} href={`/startup/${w.startup?.slug}`}
                    className="flex items-center justify-between hover:text-brand transition-colors group">
                    <span className="text-sm text-ink/70 group-hover:text-brand">{w.startup?.name}</span>
                    <span className="mono text-xs text-ink/30">{w.startup?.stage}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ kolon */}
        <div className="col-span-2 space-y-5">

          {/* Açık ilanlar */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-ink">Açık İlanlar</h2>
              <Link href="/sirket/ilanlar" className="text-xs text-brand hover:underline flex items-center gap-1">
                Tümünü yönet <ArrowRight size={11} />
              </Link>
            </div>
            {jobListings.length > 0 ? (
              <div className="space-y-2">
                {jobListings.map((j: any) => (
                  <div key={j.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(26,26,24,.03)', border: '1px solid rgba(26,26,24,.06)' }}>
                    <div>
                      <p className="text-sm font-medium text-ink">{j.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {j.type && <span className="mono text-xs text-amber-600">{j.type}</span>}
                        {j.location && <span className="mono text-xs text-ink/35">{j.location}</span>}
                        {j.salary_range && <span className="mono text-xs text-green-600">{j.salary_range}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {j.application_count > 0 && (
                        <span className="mono text-xs text-ink/35">{j.application_count} başvuru</span>
                      )}
                      <span className="mono text-xs bg-green-50 text-green-600 border border-green-100 rounded-full px-2 py-0.5">Aktif</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase size={28} className="text-ink/15 mx-auto mb-2" />
                <p className="text-sm text-ink/35 mb-3">Henüz aktif ilan yok.</p>
                <Link href="/sirket/ilanlar" className="btn-primary text-xs px-4 py-2 inline-block">İlan oluştur →</Link>
              </div>
            )}
          </div>

          {/* Etkinlikler */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-ink">Etkinlikler</h2>
              <Link href="/sirket/etkinlikler" className="text-xs text-brand hover:underline flex items-center gap-1">
                Tümünü gör <ArrowRight size={11} />
              </Link>
            </div>
            {companyEvents.length > 0 ? (
              <div className="space-y-2">
                {companyEvents.map((ev: any) => (
                  <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(26,26,24,.03)', border: '1px solid rgba(26,26,24,.06)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(196,80,10,.1)' }}>
                      <Calendar size={16} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{ev.title}</p>
                      <p className="mono text-xs text-ink/35">{ev.event_type} · {ev.event_date ? new Date(ev.event_date).toLocaleDateString('tr-TR') : '—'}</p>
                    </div>
                    {ev.max_participants && (
                      <span className="mono text-xs text-ink/35">{ev.max_participants} kişi</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar size={28} className="text-ink/15 mx-auto mb-2" />
                <p className="text-sm text-ink/35 mb-3">Henüz etkinlik yok.</p>
                <Link href="/sirket/etkinlikler" className="btn-primary text-xs px-4 py-2 inline-block">Etkinlik oluştur →</Link>
              </div>
            )}
          </div>

          {/* Paylaşımlar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-ink">Paylaşımlar</h2>
              <span className="mono text-xs text-ink/35">{posts.length} paylaşım</span>
            </div>
            <ProfilePosts
              userId={user.id} avatarUrl={profile?.avatar_url || null}
              fullName={profile?.full_name || '?'} startups={[]} initialPosts={posts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}