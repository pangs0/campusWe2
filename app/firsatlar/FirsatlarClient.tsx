'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Briefcase, CalendarDays, Star, MapPin, Globe, Users, Clock, ArrowRight, Zap, Filter } from 'lucide-react'

const JOB_TYPE_COLORS: Record<string, string> = {
  staj: 'bg-amber-50 text-amber-700 border-amber-200',
  tam_zamanli: 'bg-green-50 text-green-700 border-green-200',
  yari_zamanli: 'bg-blue-50 text-blue-700 border-blue-200',
  freelance: 'bg-purple-50 text-purple-700 border-purple-200',
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  konferans: 'bg-purple-50 text-purple-700 border-purple-200',
  hackathon: 'bg-blue-50 text-blue-700 border-blue-200',
  workshop: 'bg-green-50 text-green-700 border-green-200',
  staj_fuari: 'bg-amber-50 text-amber-700 border-amber-200',
  networking: 'bg-pink-50 text-pink-700 border-pink-200',
  diger: 'bg-neutral-50 text-neutral-600 border-neutral-200',
}

type Props = {
  userId: string
  jobs: any[]
  events: any[]
  userSkills: string[]
  hasAppliedDemoDay: boolean
}

export default function FirsatlarClient({ userId, jobs, events, userSkills, hasAppliedDemoDay }: Props) {
  const [activeTab, setActiveTab] = useState<'ilanlar' | 'etkinlikler' | 'demoday'>('ilanlar')
  const [jobFilter, setJobFilter] = useState('tumu')

  // Yeteneklere göre eşleşen ilanlar
  const matchedJobs = jobs.filter(j =>
    j.skills_needed?.some((s: string) => userSkills.includes(s.toLowerCase()))
  )
  const otherJobs = jobs.filter(j =>
    !j.skills_needed?.some((s: string) => userSkills.includes(s.toLowerCase()))
  )

  const filteredJobs = jobFilter === 'tumu' ? jobs
    : jobFilter === 'eslesen' ? matchedJobs
    : jobs.filter(j => j.type === jobFilter)

  const TABS = [
    { key: 'ilanlar', label: 'İş İlanları', icon: Briefcase, count: jobs.length },
    { key: 'etkinlikler', label: 'Etkinlikler', icon: CalendarDays, count: events.length },
    { key: 'demoday', label: 'Demo Day', icon: Star, count: null },
  ]

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">FIRSATLAR</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>
            Seni bekleyen fırsatlar.
          </h1>
          <p className="text-sm text-ink/45 mt-1">
            İlanlar, etkinlikler ve Demo Day — hepsi tek yerde.
          </p>
        </div>
        {matchedJobs.length > 0 && (
          <div className="flex items-center gap-2 bg-brand/8 border border-brand/15 rounded-xl px-4 py-2.5">
            <Zap size={14} className="text-brand" />
            <div>
              <p className="text-sm font-medium text-brand">{matchedJobs.length} eşleşen ilan</p>
              <p className="mono text-xs text-brand/60">Yeteneklerinle uyumlu</p>
            </div>
          </div>
        )}
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { n: jobs.length, l: 'Açık ilan', icon: Briefcase, color: 'text-brand' },
          { n: events.length, l: 'Yaklaşan etkinlik', icon: CalendarDays, color: 'text-purple-600' },
          { n: matchedJobs.length, l: 'Seninle eşleşen', icon: Zap, color: 'text-green-600' },
        ].map((s, i) => (
          <div key={i} className="card flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/8 flex items-center justify-center flex-shrink-0">
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className={`font-serif text-2xl font-bold ${s.color}`}>{s.n}</p>
              <p className="mono text-xs text-ink/35">{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tablar */}
      <div className="flex gap-1 bg-white border border-neutral-200 rounded-xl p-1 mb-6 w-fit">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg mono text-xs transition-colors ${
              activeTab === tab.key ? 'bg-ink text-white' : 'text-ink/50 hover:text-ink'
            }`}>
            <tab.icon size={13} />
            {tab.label}
            {tab.count !== null && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-ink/40'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* İş İlanları */}
      {activeTab === 'ilanlar' && (
        <div>
          {/* Filtreler */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <Filter size={12} className="text-ink/30" />
            {[
              { key: 'tumu', label: 'Tümü' },
              { key: 'eslesen', label: `✨ Seninle eşleşen (${matchedJobs.length})` },
              { key: 'staj', label: 'Staj' },
              { key: 'tam_zamanli', label: 'Tam zamanlı' },
              { key: 'yari_zamanli', label: 'Yarı zamanlı' },
              { key: 'freelance', label: 'Freelance' },
            ].map(f => (
              <button key={f.key} onClick={() => setJobFilter(f.key)}
                className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  jobFilter === f.key ? 'bg-ink text-white border-ink' : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/30'
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          {filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.map((job: any) => {
                const isMatch = matchedJobs.some(m => m.id === job.id)
                return (
                  <div key={job.id} className={`card hover:border-brand/25 transition-colors ${isMatch ? 'border-brand/20 bg-brand/2' : ''}`}>
                    <div className="flex items-start gap-4">
                      {/* Şirket logo */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center font-serif font-bold text-ink/40 text-lg flex-shrink-0">
                        {job.company?.logo_url
                          ? <img src={job.company.logo_url} alt="" className="w-full h-full object-cover" />
                          : job.company?.company_name?.[0] || '?'
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-serif font-bold text-ink">{job.title}</h3>
                              {isMatch && (
                                <span className="mono text-xs bg-brand/10 text-brand border border-brand/20 rounded-full px-2 py-0.5 flex items-center gap-1">
                                  <Zap size={9} /> Eşleşti
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-ink/50 mt-0.5">{job.company?.company_name}</p>
                          </div>
                          <span className={`mono text-xs border rounded px-2 py-0.5 flex-shrink-0 ${JOB_TYPE_COLORS[job.type] || JOB_TYPE_COLORS.staj}`}>
                            {job.type?.replace('_', ' ')}
                          </span>
                        </div>

                        {job.description && (
                          <p className="text-sm text-ink/50 mt-2 leading-relaxed line-clamp-2">{job.description}</p>
                        )}

                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          {job.location && (
                            <span className="flex items-center gap-1 text-xs text-ink/35">
                              <MapPin size={11} /> {job.location}
                            </span>
                          )}
                          {job.is_remote && (
                            <span className="flex items-center gap-1 text-xs text-ink/35">
                              <Globe size={11} /> Uzaktan
                            </span>
                          )}
                          {job.salary_range && (
                            <span className="mono text-xs text-green-600">{job.salary_range}</span>
                          )}
                        </div>

                        {job.skills_needed?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {job.skills_needed.map((skill: string, i: number) => (
                              <span key={i} className={`mono text-xs border rounded px-1.5 py-0.5 ${
                                userSkills.includes(skill.toLowerCase())
                                  ? 'bg-brand/8 text-brand border-brand/20'
                                  : 'bg-neutral-50 text-ink/40 border-neutral-200'
                              }`}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link href="/mesajlar/yeni"
                        className="btn-primary text-xs px-4 py-2 flex-shrink-0 flex items-center gap-1.5">
                        Başvur <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
              <Briefcase size={36} className="text-ink/15 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink/40 mb-1">İlan bulunamadı.</p>
              <p className="text-sm text-ink/30">Şirketler ilan ekledikçe burada görünecek.</p>
            </div>
          )}
        </div>
      )}

      {/* Etkinlikler */}
      {activeTab === 'etkinlikler' && (
        <div>
          {events.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {events.map((ev: any) => (
                <div key={ev.id} className="card hover:border-brand/25 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`mono text-xs border rounded px-2 py-0.5 ${EVENT_TYPE_COLORS[ev.event_type] || EVENT_TYPE_COLORS.diger}`}>
                      {ev.event_type?.replace('_', ' ')}
                    </span>
                    {ev.is_online && (
                      <span className="mono text-xs text-brand flex items-center gap-1">
                        <Globe size={11} /> Online
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-ink mb-1">{ev.title}</h3>
                  <p className="text-sm text-ink/50 mb-3 line-clamp-2 leading-relaxed">{ev.description}</p>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs text-ink/40">
                      <CalendarDays size={12} />
                      {new Date(ev.event_date).toLocaleDateString('tr-TR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </div>
                    {ev.location && (
                      <div className="flex items-center gap-2 text-xs text-ink/40">
                        <MapPin size={12} /> {ev.location}
                      </div>
                    )}
                    {ev.max_participants && (
                      <div className="flex items-center gap-2 text-xs text-ink/40">
                        <Users size={12} /> Maks. {ev.max_participants} kişi
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <p className="text-xs text-ink/35">{ev.company?.company_name}</p>
                    {ev.registration_url ? (
                      <a href={ev.registration_url} target="_blank" rel="noopener noreferrer"
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                        Kayıt ol <ArrowRight size={11} />
                      </a>
                    ) : (
                      <Link href="/mesajlar/yeni" className="btn-secondary text-xs px-3 py-1.5">
                        İletişim
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
              <CalendarDays size={36} className="text-ink/15 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink/40 mb-1">Yaklaşan etkinlik yok.</p>
              <p className="text-sm text-ink/30">Şirketler etkinlik ekledikçe burada görünecek.</p>
            </div>
          )}
        </div>
      )}

      {/* Demo Day */}
      {activeTab === 'demoday' && (
        <div className="max-w-2xl">
          <div className="card" style={{ background: '#1a1a18', border: 'none' }}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-brand" />
              <p className="mono text-xs text-brand tracking-widest">DEMO DAY</p>
            </div>
            <h2 className="font-serif text-2xl font-bold text-white mb-2">
              Yatırımcıların önüne çık.
            </h2>
            <p className="text-sm text-white/45 leading-relaxed mb-6">
              Demo Day'e kabul alan startuplar yatırımcı ve mentor kitlesi önünde pitch yapma hakkı kazanır.
              Her Demo Day'de 5 startup seçilir.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { n: '10 dk', l: 'Pitch süresi' },
                { n: '20+', l: 'Yatırımcı' },
                { n: '5', l: 'Seçilen startup' },
              ].map((s, i) => (
                <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,.05)' }}>
                  <p className="font-serif text-2xl font-bold text-brand">{s.n}</p>
                  <p className="mono text-xs text-white/30 mt-1">{s.l}</p>
                </div>
              ))}
            </div>

            {hasAppliedDemoDay ? (
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)' }}>
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Star size={14} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-400">Başvurun alındı!</p>
                  <p className="text-xs text-white/40">Ekibimiz en kısa sürede dönüş yapacak.</p>
                </div>
              </div>
            ) : (
              <Link href="/demo-day/basvur"
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium"
                style={{ background: '#C4500A', color: 'white' }}>
                Demo Day'e başvur <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {/* Başvuru süreci */}
          <div className="card mt-4">
            <p className="mono text-xs text-ink/35 tracking-widest mb-4">BAŞVURU SÜRECİ</p>
            <div className="space-y-3">
              {[
                { n: '01', title: 'Başvuru yap', desc: 'Startup bilgilerini ve pitch özetini gönder.' },
                { n: '02', title: 'Değerlendirme', desc: 'Ekibimiz başvuruyu 3-5 iş günü içinde değerlendirir.' },
                { n: '03', title: 'Seçim', desc: 'Kabul alan 5 startup Demo Day\'e davet edilir.' },
                { n: '04', title: 'Pitch', desc: '10 dakika pitch, ardından yatırımcı soruları.' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mono text-xs text-brand font-bold flex-shrink-0 mt-0.5">{step.n}</span>
                  <div>
                    <p className="text-sm font-medium text-ink">{step.title}</p>
                    <p className="text-xs text-ink/40">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}