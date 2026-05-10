'use client'

import Link from 'next/link'
import { Edit, Clock, Star, TrendingUp, Calendar, ArrowRight, Linkedin, Globe, MessageCircle, Zap } from 'lucide-react'
import ProfilePosts from './ProfilePosts'
import ProfileClient from './ProfileClient'

type Props = {
  user: any; profile: any; investorProfile: any
  portfolio: any[]; favorites: any[]; officeHours: any[]; posts: any[]
}

const FOCUS_AREAS = ['FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'SaaS', 'Yapay Zeka', 'E-ticaret', 'CleanTech']
const STAGES = ['Pre-Seed', 'Seed', 'Seri A', 'Seri B+']

export default function InvestorProfile({ user, profile, investorProfile, portfolio, favorites, officeHours, posts }: Props) {
  const stats = [
    { n: portfolio.length, l: 'Portföy şirketi' },
    { n: favorites.length, l: 'Favori startup' },
    { n: officeHours.length, l: 'Açık Office Hours' },
    { n: posts.length, l: 'Paylaşım' },
  ]

  return (
    <div>
      {/* Kapak alanı */}
      <div style={{ height: 140, background: 'linear-gradient(135deg, #1a1a18 0%, #2a1a10 100%)', borderRadius: '12px 12px 0 0', marginBottom: -60, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(196,80,10,.06) 35px, rgba(196,80,10,.06) 70px)', borderRadius: '12px 12px 0 0' }} />
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
              karmaTokens={profile?.karma_tokens || 0} role="investor"
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

          {/* Yatırımcı bilgileri */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="mono text-xs text-ink/35 tracking-widest">YATIRIMCI PROFİLİ</p>
              <Link href="/profile/edit" className="text-xs text-brand hover:underline">Düzenle</Link>
            </div>
            <div className="space-y-2.5">
              {investorProfile?.firm_name && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-0.5">FİRMA</p>
                  <p className="text-sm font-medium text-ink">{investorProfile.firm_name}</p>
                </div>
              )}
              {investorProfile?.title && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-0.5">UNVAN</p>
                  <p className="text-sm text-ink/70">{investorProfile.title}</p>
                </div>
              )}
              {investorProfile?.ticket_size && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-0.5">TİCKET BOYUTU</p>
                  <p className="text-sm text-brand font-medium">{investorProfile.ticket_size}</p>
                </div>
              )}
              {investorProfile?.focus_areas?.length > 0 && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-1.5">ODAK ALANLARI</p>
                  <div className="flex flex-wrap gap-1">
                    {investorProfile.focus_areas.map((f: string) => (
                      <span key={f} className="mono text-xs bg-brand/8 text-brand border border-brand/15 rounded px-2 py-0.5">{f}</span>
                    ))}
                  </div>
                </div>
              )}
              {investorProfile?.preferred_stages?.length > 0 && (
                <div>
                  <p className="mono text-xs text-ink/30 mb-1.5">TERCİH EDİLEN AŞAMALAR</p>
                  <div className="flex flex-wrap gap-1">
                    {investorProfile.preferred_stages.map((s: string) => (
                      <span key={s} className="mono text-xs bg-neutral-100 text-ink/60 border border-neutral-200 rounded px-2 py-0.5">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {investorProfile?.linkedin_url && (
                <a href={investorProfile.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-brand transition-colors">
                  <Linkedin size={12} /> LinkedIn profili
                </a>
              )}
              {investorProfile?.website_url && (
                <a href={investorProfile.website_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-brand transition-colors">
                  <Globe size={12} /> Web sitesi
                </a>
              )}
            </div>
            {!investorProfile?.firm_name && (
              <Link href="/profile/edit" className="text-xs text-brand hover:underline block mt-2">+ Yatırımcı bilgilerini ekle</Link>
            )}
          </div>

          {/* Hakkında */}
          {profile?.bio && (
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-2">HAKKINDA</p>
              <p className="text-sm text-ink/60 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Office Hours */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="mono text-xs text-ink/35 tracking-widest">OFFICE HOURS</p>
              <Link href="/yatirimci/office-hours" className="text-xs text-brand hover:underline">Yönet</Link>
            </div>
            {officeHours.length > 0 ? (
              <div className="space-y-2">
                {officeHours.slice(0, 3).map((oh: any) => (
                  <div key={oh.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-ink">{oh.topic}</p>
                      <p className="mono text-xs text-ink/35">{oh.date} · {oh.time_slot}</p>
                    </div>
                    <span className="mono text-xs bg-brand/8 text-brand px-2 py-0.5 rounded-full">Açık</span>
                  </div>
                ))}
                <Link href="/yatirimci/office-hours" className="text-xs text-brand hover:underline block mt-1">
                  Tümünü gör →
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <Clock size={22} className="text-ink/15 mx-auto mb-2" />
                <p className="text-xs text-ink/35 mb-2">Henüz slot yok.</p>
                <Link href="/yatirimci/office-hours" className="text-xs text-brand hover:underline">Slot ekle →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Sağ kolon */}
        <div className="col-span-2 space-y-5">

          {/* Portföy */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-ink">Portföy</h2>
              <Link href="/yatirimci/portfoy" className="text-xs text-brand hover:underline flex items-center gap-1">
                Tümünü gör <ArrowRight size={11} />
              </Link>
            </div>
            {portfolio.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {portfolio.slice(0, 6).map((p: any) => (
                  <div key={p.id} className="p-3 rounded-xl" style={{ background: 'rgba(26,26,24,.03)', border: '1px solid rgba(26,26,24,.06)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-ink">{p.company_name}</p>
                      {p.year && <span className="mono text-xs text-ink/25">{p.year}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {p.sector && <span className="mono text-xs text-ink/40">{p.sector}</span>}
                      {p.stage && <span className="mono text-xs bg-brand/8 text-brand border border-brand/15 rounded px-1.5 py-0.5">{p.stage}</span>}
                    </div>
                    {p.investment_amount && (
                      <p className="mono text-xs text-green-600 mt-1">{p.investment_amount}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp size={28} className="text-ink/15 mx-auto mb-2" />
                <p className="text-sm text-ink/35 mb-3">Henüz portföy şirketi yok.</p>
                <Link href="/yatirimci/portfoy" className="btn-primary text-xs px-4 py-2 inline-block">Portföy ekle →</Link>
              </div>
            )}
          </div>

          {/* Favori startuplar */}
          {favorites.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-bold text-ink">Favori Startuplar</h2>
                <span className="mono text-xs text-ink/35">{favorites.length} startup</span>
              </div>
              <div className="space-y-2">
                {favorites.slice(0, 5).map((f: any) => (
                  <Link key={f.id} href={`/startup/${f.startup?.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-brand/5 transition-colors group">
                    <div className="flex items-center gap-2">
                      <Star size={13} className="text-brand/50" />
                      <span className="text-sm text-ink/70 group-hover:text-brand transition-colors">{f.startup?.name}</span>
                    </div>
                    <span className="mono text-xs text-ink/30">{f.startup?.stage}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

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