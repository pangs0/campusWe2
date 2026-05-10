'use client'

import Link from 'next/link'
import { Edit, TrendingUp, ArrowRight, Zap } from 'lucide-react'
import ProfilePosts from './ProfilePosts'
import ProfileClient from './ProfileClient'

type Props = {
  user: any; profile: any; skills: any[]; startups: any[]; posts: any[]
}

export default function FounderProfile({ user, profile, skills, startups, posts = [] }: Props) {
  const stats = [
    { n: startups.length, l: 'Startup' },
    { n: skills.length, l: 'Yetenek' },
    { n: posts.length, l: 'Paylaşım' },
    { n: profile?.karma_tokens || 0, l: 'Karma Token' },
  ]

  return (
    <div>
      {/* Kapak */}
      <div style={{ height: 140, background: 'linear-gradient(135deg, #1a1a18 0%, #1a0f0a 100%)', borderRadius: '12px 12px 0 0', marginBottom: -60, position: 'relative' }}>
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
              university={profile?.university || null} department={profile?.department || null}
              karmaTokens={profile?.karma_tokens || 0} role="founder"
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