'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, CheckCircle, Star, Clock, Users, TrendingUp, Zap, AlertCircle } from 'lucide-react'

const STEPS = [
  { n: '01', title: 'Startup seç', desc: 'Hangi startup için başvuracağını belirle' },
  { n: '02', title: 'Pitch özeti', desc: 'Startup\'ını kısaca anlat' },
  { n: '03', title: 'Problem & Çözüm', desc: 'Ne çözüyorsun, nasıl çözüyorsun' },
  { n: '04', title: 'Traction & Ask', desc: 'Ne yaptın, ne istiyorsun' },
]

const TIPS = [
  { icon: '🎯', text: 'Problemi net tanımla — "Herkese" değil, "X kişilere" de' },
  { icon: '📊', text: 'Sayılarla konuş — kullanıcı sayısı, gelir, büyüme oranı' },
  { icon: '💡', text: 'Çözümün neden şimdi — zamanlamanı açıkla' },
  { icon: '💰', text: 'Ask gerçekçi ol — ne için kullanacağını söyle' },
]

type Props = {
  userId: string
  startups: any[]
  existingApplication: any
}

export default function DemoDayBasvurClient({ userId, startups, existingApplication }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    startup_id: startups[0]?.id || '',
    pitch_summary: '',
    problem: '',
    solution: '',
    traction: '',
    ask: '',
    website_url: '',
    video_url: '',
    team_size: '1',
    seeking: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const selectedStartup = startups.find(s => s.id === form.startup_id)

  function toggleSeeking(item: string) {
    setForm(p => ({
      ...p,
      seeking: p.seeking.includes(item)
        ? p.seeking.filter(i => i !== item)
        : [...p.seeking, item]
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('demo_day_applications').insert({
      applicant_id: userId,
      startup_id: form.startup_id,
      pitch_summary: form.pitch_summary,
      problem: form.problem,
      solution: form.solution,
      traction: form.traction,
      ask: form.ask,
      status: 'beklemede',
    })

    if (insertError) {
      setError('Bir hata oluştu. Daha önce başvurmuş olabilirsin.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setTimeout(() => router.push('/demo-day'), 2500)
  }

  // Mevcut başvuru varsa
  if (existingApplication) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-brand" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Başvurun alındı!</h2>
        <p className="text-sm text-ink/50 mb-2">Başvuru durumun: <strong className="text-brand">{existingApplication.status}</strong></p>
        <p className="text-sm text-ink/45 mb-6">Ekibimiz başvurunu inceleyecek ve en kısa sürede dönüş yapacak.</p>
        <Link href="/demo-day" className="btn-primary inline-flex text-sm px-6 py-2">Demo Day'e dön →</Link>
      </div>
    )
  }

  // Başarıyla gönderildi
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid rgba(34,197,94,.3)' }}>
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Başvurun gönderildi! 🎉</h2>
        <p className="text-sm text-ink/50 mb-6">Demo Day sayfasına yönlendiriliyorsun...</p>
      </div>
    )
  }

  return (
    <div>
      <Link href="/demo-day" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Demo Day'e dön
      </Link>

      <div className="mb-8">
        <p className="mono text-xs text-ink/35 tracking-widest mb-1">DEMO DAY</p>
        <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Başvurunu yap.</h1>
        <p className="text-sm text-ink/45 mt-1">Yatırımcılara pitch yapma fırsatı için başvur.</p>
      </div>

      {startups.length === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp size={32} className="text-ink/20 mx-auto mb-3" />
          <p className="font-serif text-lg font-bold text-ink mb-2">Önce startup oluştur</p>
          <p className="text-sm text-ink/45 mb-5">Demo Day'e başvurmak için aktif bir startupın olması gerekiyor.</p>
          <Link href="/startup/new" className="btn-primary inline-flex text-sm px-6 py-2">Startup oluştur →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">

          {/* Sol — form */}
          <div className="col-span-2 space-y-5">

            {/* Startup seçimi */}
            <div className="card space-y-4">
              <p className="mono text-xs text-ink/35 tracking-widest">STARTUP</p>
              <div>
                <label className="label">Hangi startup için başvuruyorsun?</label>
                <select className="input" value={form.startup_id}
                  onChange={e => setForm(p => ({ ...p, startup_id: e.target.value }))}>
                  {startups.map(s => <option key={s.id} value={s.id}>{s.name} — {s.stage}</option>)}
                </select>
              </div>
              {selectedStartup && (
                <div className="p-3 rounded-xl" style={{ background: 'rgba(196,80,10,.04)', border: '1px solid rgba(196,80,10,.1)' }}>
                  <p className="text-sm font-medium text-ink">{selectedStartup.name}</p>
                  <p className="text-xs text-ink/50 mt-0.5 line-clamp-2">{selectedStartup.description}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="mono text-xs bg-brand/8 text-brand border border-brand/15 rounded px-1.5 py-0.5">{selectedStartup.stage}</span>
                    {selectedStartup.sector && <span className="mono text-xs text-ink/40">{selectedStartup.sector}</span>}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Web sitesi</label>
                  <input type="url" className="input" placeholder="https://..." value={form.website_url}
                    onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Demo / Pitch video linki</label>
                  <input type="url" className="input" placeholder="YouTube, Loom..." value={form.video_url}
                    onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Pitch */}
            <div className="card space-y-4">
              <p className="mono text-xs text-ink/35 tracking-widest">PİTCH</p>
              <div>
                <label className="label">Pitch özeti *</label>
                <textarea className="input resize-none" rows={3}
                  placeholder="Startup'ını 2-3 cümleyle anlat. Yatırımcı gözüyle yaz."
                  value={form.pitch_summary} onChange={e => setForm(p => ({ ...p, pitch_summary: e.target.value }))} required />
                <p className="mono text-xs text-ink/30 mt-1">{form.pitch_summary.length}/300 karakter</p>
              </div>
            </div>

            {/* Problem & Çözüm */}
            <div className="card space-y-4">
              <p className="mono text-xs text-ink/35 tracking-widest">PROBLEM & ÇÖZÜM</p>
              <div>
                <label className="label">Hangi problemi çözüyorsunuz? *</label>
                <textarea className="input resize-none" rows={2}
                  placeholder="Kimin ne problemi var? Büyüklüğü ne kadar?"
                  value={form.problem} onChange={e => setForm(p => ({ ...p, problem: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Çözümünüz nedir? *</label>
                <textarea className="input resize-none" rows={2}
                  placeholder="Nasıl çözüyorsunuz? Rakiplerden farkı ne?"
                  value={form.solution} onChange={e => setForm(p => ({ ...p, solution: e.target.value }))} required />
              </div>
            </div>

            {/* Traction & Ask */}
            <div className="card space-y-4">
              <p className="mono text-xs text-ink/35 tracking-widest">TRACTION & ASK</p>
              <div>
                <label className="label">Şimdiye kadar ne yaptınız?</label>
                <textarea className="input resize-none" rows={2}
                  placeholder="Kullanıcı sayısı, gelir, MVP durumu, büyüme..."
                  value={form.traction} onChange={e => setForm(p => ({ ...p, traction: e.target.value }))} />
              </div>
              <div>
                <label className="label">Ne istiyorsunuz? *</label>
                <input type="text" className="input" placeholder="500K TL seed yatırım, mentor, müşteri bağlantısı..."
                  value={form.ask} onChange={e => setForm(p => ({ ...p, ask: e.target.value }))} required />
              </div>
              <div>
                <label className="label mb-2">Ekip büyüklüğü</label>
                <select className="input" value={form.team_size}
                  onChange={e => setForm(p => ({ ...p, team_size: e.target.value }))}>
                  {['1', '2', '3', '4', '5+'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="label mb-2">Ne arıyorsunuz?</label>
                <div className="flex flex-wrap gap-2">
                  {['Yatırım', 'Mentor', 'Müşteri', 'Co-founder', 'Teknik destek', 'Pazarlama'].map(item => (
                    <button key={item} type="button" onClick={() => toggleSeeking(item)}
                      className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.seeking.includes(item)
                          ? 'bg-brand text-white border-brand'
                          : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'
                      }`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading || !form.startup_id || !form.pitch_summary}
              className="btn-primary w-full justify-center disabled:opacity-60 py-3 text-base">
              {loading ? 'Gönderiliyor...' : 'Başvuruyu gönder →'}
            </button>
          </div>

          {/* Sağ — bilgi */}
          <div className="space-y-4">

            {/* Demo Day bilgisi */}
            <div className="card" style={{ background: '#1a1a18' }}>
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className="text-brand" />
                <p className="mono text-xs text-brand tracking-widest">DEMO DAY</p>
              </div>
              <p className="font-serif text-lg font-bold text-white mb-1">Yatırımcıların önüne çık.</p>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Seçilen startuplar yatırımcı ve mentor kitlesi önünde pitch yapma hakkı kazanır.
              </p>
              {[
                { icon: Clock, text: '10 dk pitch süresi' },
                { icon: Users, text: '20+ yatırımcı izleyici' },
                { icon: Zap, text: '5 startup seçilecek' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <item.icon size={12} className="text-brand flex-shrink-0" />
                  <p className="text-xs text-white/50">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Başvuru adımları */}
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">BAŞVURU ADIMLARI</p>
              <div className="space-y-3">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mono text-xs text-brand font-bold flex-shrink-0 mt-0.5">{step.n}</span>
                    <div>
                      <p className="text-xs font-medium text-ink">{step.title}</p>
                      <p className="text-xs text-ink/40">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* İpuçları */}
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">GÜÇLÜ BAŞVURU İÇİN</p>
              <div className="space-y-2.5">
                {TIPS.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ fontSize: 13, flexShrink: 0 }}>{tip.icon}</span>
                    <p className="text-xs text-ink/55 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}