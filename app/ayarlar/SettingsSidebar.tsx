'use client'

import Link from 'next/link'
import { Zap, Shield, CheckCircle, AlertCircle, TrendingUp, Edit } from 'lucide-react'

type Props = {
  profile: any
  stats: {
    posts: number
    likes: number
    startups: number
    skills: number
    takas: number
    cofounders: number
  }
  completionPercent: number
  email: string
  createdAt: string
  activityDates: string[]
}

export default function SettingsSidebar({ profile, stats, completionPercent, email, createdAt, activityDates }: Props) {

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / 86400000)
    const months = Math.floor(days / 30)
    if (months > 0) return `${months} ay önce`
    if (days > 0) return `${days} gün önce`
    return 'Bugün'
  }

  // Aktivite grafiği — son 12 hafta
  const weeks = 12
  const days = weeks * 7
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const activityMap = new Map<string, number>()
  activityDates.forEach(d => {
    const key = new Date(d).toISOString().split('T')[0]
    activityMap.set(key, (activityMap.get(key) || 0) + 1)
  })

  const cells: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    cells.push({ date: key, count: activityMap.get(key) || 0 })
  }

  function cellColor(count: number) {
    if (count === 0) return '#f0ece4'
    if (count === 1) return '#f5c9aa'
    if (count === 2) return '#e8975c'
    return '#C4500A'
  }

  const statItems = [
    { label: 'Paylaşım', value: stats.posts },
    { label: 'Beğeni', value: stats.likes },
    { label: 'Startup', value: stats.startups },
    { label: 'Yetenek', value: stats.skills },
    { label: 'Takas', value: stats.takas },
    { label: 'Co-founder', value: stats.cofounders },
  ]

  return (
    <div className="space-y-4 sticky top-6">

      {/* Profil kartı */}
      <div className="card text-center">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif text-2xl font-bold text-brand mx-auto mb-3">
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            : profile?.full_name?.[0] || '?'
          }
        </div>
        <p className="font-serif font-bold text-ink">{profile?.full_name}</p>
        <p className="mono text-xs text-ink/35 mt-0.5">@{profile?.username}</p>

        <div className="flex items-center justify-center gap-1.5 mt-2 bg-brand/8 rounded-lg px-3 py-1.5 mx-auto w-fit">
          <Zap size={12} className="text-brand" />
          <span className="mono text-sm font-medium text-brand">{profile?.karma_tokens || 0} Karma</span>
        </div>

        {/* Profil tamamlanma */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-ink/45">Profil tamamlanma</p>
            <span className="mono text-xs font-bold text-brand">{completionPercent}%</span>
          </div>
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${completionPercent}%` }} />
          </div>
        </div>

        <Link href="/profile/edit" className="btn-secondary w-full mt-3 text-xs py-1.5 flex items-center justify-center gap-1.5">
          <Edit size={12} />
          Profili düzenle
        </Link>
      </div>

      {/* İstatistikler */}
      <div className="card">
        <div className="flex items-center gap-1.5 mb-3">
          <TrendingUp size={13} className="text-ink/40" />
          <p className="mono text-xs text-ink/35 tracking-widest">İSTATİSTİKLER</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {statItems.map(s => (
            <div key={s.label} className="text-center bg-neutral-50 rounded-lg py-2.5 px-1">
              <p className="font-serif text-xl font-bold text-ink">{s.value}</p>
              <p className="mono text-xs text-ink/35 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Aktivite grafiği */}
      <div className="card">
        <p className="mono text-xs text-ink/35 tracking-widest mb-3">AKTİVİTE</p>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${weeks}, 1fr)`, gap: 3 }}>
          {Array.from({ length: weeks }).map((_, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {cells.slice(wi * 7, wi * 7 + 7).map((cell, di) => (
                <div
                  key={di}
                  title={`${cell.date}: ${cell.count} aktivite`}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 2,
                    background: cellColor(cell.count),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <p className="mono text-xs text-ink/25 mt-2">Son 12 hafta</p>
      </div>

      {/* Güvenlik durumu */}
      <div className="card">
        <div className="flex items-center gap-1.5 mb-3">
          <Shield size={13} className="text-ink/40" />
          <p className="mono text-xs text-ink/35 tracking-widest">GÜVENLİK</p>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={13} className="text-green-500" />
              <p className="text-xs text-ink/70">E-posta</p>
            </div>
            <p className="mono text-xs text-ink/35 truncate max-w-24">{email.split('@')[0]}@...</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={13} className="text-green-500" />
              <p className="text-xs text-ink/70">Hesap oluşturuldu</p>
            </div>
            <p className="mono text-xs text-ink/35">{timeAgo(createdAt)}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={13} className="text-amber-500" />
              <p className="text-xs text-ink/70">İki faktörlü doğrulama</p>
            </div>
            <p className="mono text-xs text-amber-500">Pasif</p>
          </div>
        </div>
      </div>

    </div>
  )
}