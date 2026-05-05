import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Building2, MessageCircle, ExternalLink, Briefcase, CalendarDays } from 'lucide-react'

export default async function SirketlerPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'investor') redirect('/yatirimci')
  if (profile?.role === 'company') redirect('/sirket')

  const { data: companies } = await supabase
    .from('company_profiles')
    .select('*, profile:profiles(id, full_name, avatar_url, city)')
    .order('created_at', { ascending: false })

  const { data: events } = await supabase
    .from('company_events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })

  const { data: jobs } = await supabase
    .from('job_listings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const eventTypeColors: Record<string, string> = {
    konferans: 'bg-purple-50 text-purple-700 border-purple-200',
    hackathon: 'bg-blue-50 text-blue-700 border-blue-200',
    workshop: 'bg-green-50 text-green-700 border-green-200',
    staj_fuari: 'bg-amber-50 text-amber-700 border-amber-200',
    networking: 'bg-pink-50 text-pink-700 border-pink-200',
    diger: 'bg-neutral-50 text-neutral-600 border-neutral-200',
  }

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10">
        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">ŞİRKETLER</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Şirketleri keşfet.</h1>
          <p className="text-sm text-ink/45 mt-1">Etkinlikler, staj ilanları ve fırsatlar.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">

            {/* Şirketler */}
            <div>
              <h2 className="font-serif text-xl font-bold text-ink mb-4">Şirketler</h2>
              {companies && companies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {companies.map((comp: any) => (
                    <div key={comp.id} className="card hover:border-brand/30 transition-colors">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-blue-100 flex items-center justify-center font-serif font-bold text-blue-700">
                          {comp.logo_url
                            ? <img src={comp.logo_url} alt="" className="w-full h-full object-cover" />
                            : comp.company_name?.[0]
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-serif font-bold text-ink truncate">{comp.company_name}</p>
                            {comp.is_verified && <span className="mono text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5">✓</span>}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {comp.sector && <span className="mono text-xs text-ink/35">{comp.sector}</span>}
                            {comp.company_size && <span className="mono text-xs text-ink/25">{comp.company_size} çalışan</span>}
                          </div>
                        </div>
                      </div>

                      {comp.description && (
                        <p className="text-xs text-ink/55 leading-relaxed mb-3 line-clamp-2">{comp.description}</p>
                      )}

                      <div className="flex gap-2">
                        {(jobs || []).filter(j => j.company_id === comp.id).length > 0 && (
                          <span className="mono text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-0.5">
                            {(jobs || []).filter(j => j.company_id === comp.id).length} açık ilan
                          </span>
                        )}
                        {(events || []).filter(e => e.company_id === comp.id).length > 0 && (
                          <span className="mono text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded px-2 py-0.5">
                            {(events || []).filter(e => e.company_id === comp.id).length} etkinlik
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-100">
                        <Link href="/mesajlar/yeni" className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs border border-neutral-200 rounded-lg hover:border-brand/30 hover:bg-brand/3 transition-colors text-ink/55 hover:text-brand">
                          <MessageCircle size={11} /> İletişim
                        </Link>
                        {comp.website && (
                          <a href={comp.website} target="_blank" rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg hover:border-brand/30 transition-colors text-ink/40 hover:text-brand">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
                  <Building2 size={32} className="text-brand/25 mx-auto mb-3" />
                  <p className="font-serif text-lg font-bold text-ink mb-1">Henüz şirket yok.</p>
                  <p className="text-sm text-ink/45">Şirketler kayıt oldukça burada görünecekler.</p>
                </div>
              )}
            </div>

            {/* Açık staj ilanları */}
            <div>
              <h2 className="font-serif text-xl font-bold text-ink mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-ink/40" />
                Açık İlanlar
              </h2>
              {jobs && jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job: any) => (
                    <div key={job.id} className="card hover:border-brand/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-ink">{job.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`mono text-xs border rounded px-2 py-0.5 ${job.type === 'staj' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                              {job.type}
                            </span>
                            {job.is_remote && <span className="mono text-xs text-ink/35">Uzaktan</span>}
                            {job.location && <span className="mono text-xs text-ink/35">{job.location}</span>}
                          </div>
                          {job.skills_needed?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.skills_needed.map((s: string, i: number) => (
                                <span key={i} className="mono text-xs bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5 text-ink/50">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <Link href="/mesajlar/yeni" className="btn-primary text-xs py-1.5 px-3 flex-shrink-0">
                          Başvur
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
                  <p className="text-sm text-ink/35">Henüz açık ilan yok.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ — Yaklaşan etkinlikler */}
          <div>
            <h2 className="font-serif text-xl font-bold text-ink mb-4 flex items-center gap-2">
              <CalendarDays size={18} className="text-ink/40" />
              Yaklaşan Etkinlikler
            </h2>
            {events && events.length > 0 ? (
              <div className="space-y-3">
                {events.map((ev: any) => (
                  <div key={ev.id} className="card hover:border-brand/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-ink text-sm">{ev.title}</p>
                      <span className={`mono text-xs border rounded px-1.5 py-0.5 flex-shrink-0 ml-2 ${eventTypeColors[ev.event_type] || eventTypeColors.diger}`}>
                        {ev.event_type}
                      </span>
                    </div>
                    {ev.description && (
                      <p className="text-xs text-ink/50 line-clamp-2 mb-2">{ev.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-ink/35">
                      <CalendarDays size={11} />
                      {new Date(ev.event_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {ev.is_online && <span className="mono text-xs text-brand mt-1 block">🌐 Online</span>}
                    {ev.registration_url && (
                      <a href={ev.registration_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-brand hover:underline mt-2 block">
                        Kayıt ol →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
                <CalendarDays size={24} className="text-brand/25 mx-auto mb-2" />
                <p className="text-sm text-ink/35">Yaklaşan etkinlik yok.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  )
}