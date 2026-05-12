'use client'

import Link from 'next/link'
import { Edit, TrendingUp, ArrowRight, Zap, Camera } from 'lucide-react'
import ProfilePosts from './ProfilePosts'
import ProfileClient from './ProfileClient'

type Props = {
  user: any; profile: any; skills: any[]; startups: any[]; posts: any[]
}

const BADGES = [
  { id: 'first_startup', icon: '🚀', label: 'İlk Startup', check: (p: any, s: any[], posts: any[]) => s.length > 0 },
  { id: 'karma_100', icon: '⚡', label: '100 Karma', check: (p: any) => (p?.karma_tokens || 0) >= 100 },
  { id: 'social', icon: '🤝', label: 'Sosyal', check: (p: any, s: any[], posts: any[]) => posts.length >= 3 },
  { id: 'complete_profile', icon: '✅', label: 'Tam Profil', check: (p: any) => !!(p?.avatar_url && p?.bio && p?.university) },
  { id: 'multi_skill', icon: '🎯', label: 'Çok Yetenekli', check: (p: any, s: any[]) => s.length >= 3 },
]

export default function FounderProfile({ user, profile, skills, startups, posts = [] }: Props) {
  const stats = [
    { n: startups.length, l: 'Startup' },
    { n: skills.length, l: 'Yetenek' },
    { n: posts.length, l: 'Paylaşım' },
    { n: profile?.karma_tokens || 0, l: 'Karma Token' },
  ]

  const earnedBadges = BADGES.filter(b => b.check(profile, skills, posts))

  // Son aktiflik
  const lastPost = posts[0]
  const daysSince = lastPost
    ? Math.floor((Date.now() - new Date(lastPost.created_at).getTime()) / 86400000)
    : null
  const activityLabel = daysSince === null ? null
    : daysSince === 0 ? '🟢 Bugün aktif'
    : daysSince <= 3 ? '🟢 Bu hafta aktif'
    : daysSince <= 7 ? '🟡 Bu hafta aktif'
    : '⚪ Bir süredir sessiz'

  return (
    <div>
      {/* Kapak — banner veya gradient */}
      <div style={{ height: 160, borderRadius: '12px 12px 0 0', marginBottom: -60, position: 'relative', overflow: 'hidden' }}>
        {profile?.banner_url ? (
          <img src={profile.banner_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1a18 0%, #1a0f0a 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(196,80,10,.06) 35px, rgba(196,80,10,.06) 70px)' }} />
          </>
        )}
        {/* Overlay butonlar */}
        <Link href="/profile/edit" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,.4)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(4px)' }}>
          <Edit size={12} /> Profili düzenle
        </Link>
        <Link href="/profile/edit" style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,.4)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, padding: '5px 12px', fontSize: 11, color: 'rgba(255,255,255,.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(4px)' }}>
          <Camera size={11} /> Kapak değiştir
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sol kolon */}
        <div className="col-span-1 space-y-4">
          <div className="card" style={{ paddingTop: 72 }}>
            <ProfileClient
              userId={user.id} avatarUrl={profile?.avatar_url || null}
              fullName={profile?.full_name || '?'} username={profile?.username || ''}
              university={profile?.university || null} department={profile?.department || null}
              karmaTokens={profile?.karma_tokens || 0} role="founder"
            />
            {activityLabel && (
              <p className="mono text-xs text-ink/40 mt-2">{activityLabel}</p>
            )}
          </div>

          {/* Rozetler */}
          {earnedBadges.length > 0 && (
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">ROZETLER</p>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map(badge => (
                  <div key={badge.id} title={badge.label}
                    className="flex items-center gap-1.5 bg-brand/5 border border-brand/15 rounded-full px-2.5 py-1">
                    <span style={{ fontSize: 13 }}>{badge.icon}</span>
                    <span className="mono text-xs text-brand/70">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Hakkında */}
          {profile?.bio && (
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-2">HAKKINDA</p>
              <p className="text-sm text-ink/60 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Yetenekler */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="mono text-xs text-ink/35 tracking-widest">YETENEKLERİM</p>
              <Link href="/profile/edit" className="text-xs text-brand hover:underline">Düzenle</Link>
            </div>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill: any) => (
                  <span key={skill.id} className="mono text-xs bg-neutral-100 text-ink/60 border border-neutral-200 rounded px-2 py-0.5">{skill.skill_name}</span>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-xs text-ink/35 mb-2">Henüz yetenek eklenmedi.</p>
                <Link href="/profile/edit" className="text-xs text-brand hover:underline">+ Yetenek ekle</Link>
              </div>
            )}
          </div>

          {/* Startuplar */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="mono text-xs text-ink/35 tracking-widest">STARTUPLARIM</p>
              <Link href="/startup/new" className="text-xs text-brand hover:underline">+ Yeni</Link>
            </div>
            {startups.length > 0 ? (
              <div className="space-y-2">
                {startups.map((s: any) => (
                  <Link key={s.id} href={`/startup/${s.slug}`}
                    className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg hover:bg-brand/5 transition-colors group">
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
        </div>

        {/* Sağ kolon */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-ink">Paylaşımlar</h2>
            <span className="mono text-xs text-ink/35">{posts?.length || 0} paylaşım</span>
          </div>
          <ProfilePosts
            userId={user.id} avatarUrl={profile?.avatar_url || null}
            fullName={profile?.full_name || '?'}
            startups={startups.map((s: any) => ({ id: s.id, name: s.name }))}
            initialPosts={posts}
          />
        </div>
      </div>
    </div>
  )
}