import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { ArrowLeft, Plus, Users, Zap } from 'lucide-react'
import AddUpdateForm from './AddUpdateForm'
import type { StartupUpdate, StartupMember } from '@/types'

export default async function StartupPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: startup } = await supabase
    .from('startups')
    .select('*, founder:profiles(full_name, username, university)')
    .eq('slug', params.slug)
    .single()

  if (!startup) notFound()

  const { data: updates } = await supabase
    .from('startup_updates')
    .select('*, author:profiles(full_name, username)')
    .eq('startup_id', startup.id)
    .order('created_at', { ascending: false })

  const { data: members } = await supabase
    .from('startup_members')
    .select('*, profile:profiles(full_name, username, university)')
    .eq('startup_id', startup.id)

  const isFounder = user?.id === startup.founder_id

  const stageColors: Record<string, string> = {
    fikir: 'bg-amber-50 text-amber-700 border-amber-200',
    mvp: 'bg-blue-50 text-blue-700 border-blue-200',
    traction: 'bg-purple-50 text-purple-700 border-purple-200',
    büyüme: 'bg-green-50 text-green-700 border-green-200',
  }

  const updateTypeColors: Record<string, string> = {
    güncelleme: 'bg-ink/5 text-ink/50',
    milestone: 'bg-green-50 text-green-700',
    sorun: 'bg-red-50 text-red-600',
    başarı: 'bg-amber-50 text-amber-700',
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Bugün'
    if (days === 1) return 'Dün'
    return `${days} gün önce`
  }

  const STAGES = ['fikir', 'mvp', 'traction', 'büyüme']
  const stageIndex = STAGES.indexOf(startup.stage)
  const stageProgress = Math.round(((stageIndex + 1) / STAGES.length) * 100)

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="card mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-ink mb-1">
                    {startup.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className={`mono text-xs border rounded px-2 py-0.5 ${stageColors[startup.stage] || 'bg-ink/5 text-ink/50'}`}>
                      {startup.stage}
                    </span>
                    {startup.sector && (
                      <span className="mono text-xs text-ink/35">{startup.sector}</span>
                    )}
                  </div>
                </div>
                {isFounder && (
                  <Link
                    href={`/startup/${startup.slug}/edit`}
                    className="btn-secondary py-1.5 px-3 text-xs"
                  >
                    Düzenle
                  </Link>
                )}
              </div>

              {startup.description && (
                <p className="text-sm text-ink/65 leading-relaxed">
                  {startup.description}
                </p>
              )}

              {/* İlerleme çubuğu */}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="mono text-xs text-ink/35 tracking-widest">STARTUP AŞAMASI</p>
                  <span className="mono text-xs text-brand font-medium">{stageProgress}%</span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${stageProgress}%` }} />
                </div>
                <div className="flex justify-between">
                  {STAGES.map((s, i) => (
                    <span key={s} className={`mono text-xs ${i <= stageIndex ? 'text-brand font-medium' : 'text-ink/25'}`}>{s}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-ink/8 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand/15 flex items-center justify-center text-xs font-bold text-brand">
                  {startup.founder?.full_name?.[0]}
                </div>
                <span className="text-xs text-ink/45">
                  {startup.founder?.full_name} · {startup.founder?.university}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-ink">Güncellemeler</h2>
              {isFounder && (
                <span className="mono text-xs text-ink/35">{updates?.length || 0} güncelleme</span>
              )}
            </div>

            {isFounder && (
              <div className="mb-4">
                <AddUpdateForm startupId={startup.id} />
              </div>
            )}

            {updates && updates.length > 0 ? (
              <div className="space-y-3">
                {updates.map((update: StartupUpdate & { author: any }) => (
                  <div key={update.id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`mono text-xs rounded px-2 py-0.5 ${updateTypeColors[update.update_type] || 'bg-ink/5 text-ink/50'}`}>
                          {update.update_type}
                        </span>
                        <span className="text-xs text-ink/35">{timeAgo(update.created_at)}</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-ink mb-1.5">{update.title}</h3>
                    <p className="text-sm text-ink/55 leading-relaxed">{update.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-10">
                <p className="text-sm text-ink/35">
                  {isFounder ? 'İlk güncellemeyi paylaş.' : 'Henüz güncelleme yok.'}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} className="text-ink/40" />
                <h3 className="font-medium text-ink text-sm">Ekip</h3>
              </div>
              <div className="space-y-3">
                {members?.map((member: StartupMember & { profile: any }) => (
                  <div key={member.id} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center text-xs font-bold text-brand">
                      {member.profile?.full_name?.[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-ink">{member.profile?.full_name}</p>
                      <p className="text-xs text-ink/40">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isFounder && user && (
              <div className="card text-center">
                <Zap size={20} className="text-brand mx-auto mb-2" />
                <p className="text-xs text-ink/50 mb-3">Bu startup'a katkı sağlamak ister misin?</p>
                <button className="btn-primary py-1.5 px-3 text-xs w-full justify-center">
                  Yardım teklif et
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  )
}