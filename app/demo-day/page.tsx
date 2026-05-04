import { createClient } from '@/lib/supabase/server'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Star, Calendar, TrendingUp, Plus } from 'lucide-react'

export default async function DemoDayPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: applications } = await supabase
    .from('demo_day_applications')
    .select('*, startup:startups(name, slug, description, stage, sector, founder:profiles(full_name, university))')
    .eq('status', 'kabul')
    .order('created_at', { ascending: false })

  const { data: myApplication } = user ? await supabase
    .from('demo_day_applications')
    .select('*')
    .eq('applicant_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single() : { data: null }

  const stageColors: Record<string, string> = {
    fikir: 'bg-amber-50 text-amber-700 border-amber-200',
    mvp: 'bg-blue-50 text-blue-700 border-blue-200',
    traction: 'bg-purple-50 text-purple-700 border-purple-200',
    büyüme: 'bg-green-50 text-green-700 border-green-200',
  }

  const statusLabels: Record<string, string> = {
    beklemede: 'İnceleniyor',
    kabul: 'Kabul edildi',
    red: 'Reddedildi',
  }

  const statusColors: Record<string, string> = {
    beklemede: 'bg-amber-50 text-amber-700 border-amber-200',
    kabul: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  }

  return (
    <AppLayout user={user}>
      

      <main className="px-8 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">DEMO DAY</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Yatırımcılara pitch yap.</h1>
            <p className="text-sm text-ink/45 mt-1">
              Ayda bir kez gerçek yatırımcılar önünde sunum yap.
            </p>
          </div>
          {user && !myApplication && (
            <Link href="/demo-day/basvur" className="btn-primary flex items-center gap-1.5 text-xs">
              <Plus size={13} />
              Başvur
            </Link>
          )}
        </div>

        {myApplication && (
          <div className="card mb-6 flex items-center justify-between">
            <div>
              <p className="mono text-xs text-ink/35 tracking-widest mb-1">BAŞVURUN</p>
              <p className="font-medium text-ink">Demo Day başvurun mevcut</p>
            </div>
            <span className={`mono text-xs border rounded px-3 py-1 ${statusColors[myApplication.status] || ''}`}>
              {statusLabels[myApplication.status] || myApplication.status}
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Star, n: applications?.length || 0, l: 'Kabul edilen startup' },
            { icon: Calendar, n: 'Ayda bir', l: 'Demo Day' },
            { icon: TrendingUp, n: 'Gerçek', l: 'Yatırımcılar' },
          ].map((s, i) => (
            <div key={i} className="card flex items-center gap-3 py-4">
              <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                <s.icon size={15} className="text-brand" />
              </div>
              <div>
                <div className="font-serif text-xl font-bold text-ink">{s.n}</div>
                <div className="mono text-xs text-ink/35">{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="font-serif text-xl font-bold text-ink mb-4">Kabul edilen startuplar</h2>

          {applications && applications.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {applications.map((app: any) => (
                <Link
                  key={app.id}
                  href={`/startup/${app.startup?.slug}`}
                  className="card block hover:border-brand/30 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif font-bold text-ink group-hover:text-brand transition-colors">
                      {app.startup?.name}
                    </h3>
                    <span className={`mono text-xs border rounded px-2 py-0.5 ml-2 whitespace-nowrap ${stageColors[app.startup?.stage] || ''}`}>
                      {app.startup?.stage}
                    </span>
                  </div>
                  {app.startup?.description && (
                    <p className="text-sm text-ink/50 line-clamp-2 mb-3">{app.startup.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <span className="text-xs text-ink/40">{app.startup?.founder?.full_name}</span>
                    {app.startup?.sector && (
                      <span className="mono text-xs text-ink/30">{app.startup.sector}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Star size={40} className="text-ink/15 mx-auto mb-4" />
              <p className="text-ink/40 font-serif text-xl mb-2">Henüz kabul edilen startup yok.</p>
              <p className="text-sm text-ink/30 mb-6">İlk başvuran sen ol.</p>
              {user && (
                <Link href="/demo-day/basvur" className="btn-primary inline-flex items-center gap-1.5 text-xs">
                  <Plus size={13} />
                  Başvur
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  )
}