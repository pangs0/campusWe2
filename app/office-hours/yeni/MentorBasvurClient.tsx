'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Star, Clock, Users, CheckCircle, Lightbulb, Heart } from 'lucide-react'

const DAYS = ['pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi', 'pazar']
const DAY_LABELS: Record<string, string> = {
  pazartesi: 'Pazartesi', sali: 'Salı', carsamba: 'Çarşamba',
  persembe: 'Perşembe', cuma: 'Cuma', cumartesi: 'Cumartesi', pazar: 'Pazar'
}
const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
const EXPERTISE_AREAS = ['Ürün Yönetimi', 'Yazılım Geliştirme', 'Pazarlama', 'Yatırım', 'Büyüme', 'Tasarım', 'Finans', 'Hukuk', 'Satış', 'İnsan Kaynakları']

const MENTOR_BENEFITS = [
  { icon: Heart, text: 'Bir girişimcinin hayatına dokunuyorsun' },
  { icon: Users, text: 'Toplulukta tanınırlık kazanıyorsun' },
  { icon: Star, text: 'Mentor rozeti profilde görünüyor' },
  { icon: Clock, text: 'Sadece haftada 1 saat' },
]

type Props = {
  userId: string
  profile: any
  skills: any[]
  existing: any
}

export default function MentorBasvurClient({ userId, profile, skills, existing }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '',
    description: '',
    expertise: '',
    day_of_week: 'pazartesi',
    time_slot: '19:00',
    session_duration: '60',
    linkedin_url: '',
    experience_years: '',
    max_mentees: '5',
  })
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function toggleArea(area: string) {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('office_hours').upsert({
      mentor_id: userId,
      title: form.title,
      description: form.description,
      day_of_week: form.day_of_week,
      time_slot: form.time_slot,
      expertise: selectedAreas.join(', ') || form.expertise,
      is_active: true,
      status: 'open',
    })

    if (insertError) {
      setError('Bir hata oluştu: ' + insertError.message)
      setLoading(false)
      return
    }

    setSubmitted(true)
    setTimeout(() => router.push('/office-hours'), 1500)
  }

  if (existing) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-brand" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Zaten mentor olarak kayıtlısın!</h2>
        <p className="text-sm text-ink/50 mb-6">Profilini mentorlar listesinde görebilirsin.</p>
        <Link href="/office-hours" className="btn-primary inline-flex text-sm px-6 py-2">Mentorları gör →</Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid rgba(34,197,94,.3)' }}>
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Mentor olarak kaydoldun! 🎉</h2>
        <p className="text-sm text-ink/50">Mentorlar sayfasına yönlendiriliyor...</p>
      </div>
    )
  }

  return (
    <div>
      <Link href="/office-hours" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Office Hours'a dön
      </Link>

      <div className="mb-8">
        <p className="mono text-xs text-ink/35 tracking-widest mb-1">MENTOR OL</p>
        <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Haftanda 1 saat ver.</h1>
        <p className="text-sm text-ink/45 mt-1">Bir sonraki büyük kurucuyu keşfet.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sol — form */}
        <div className="col-span-2 space-y-5">

          {/* Profil özeti */}
          <div className="card" style={{ background: 'rgba(196,80,10,.03)', border: '1px solid rgba(196,80,10,.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-lg flex-shrink-0">
                {profile?.full_name?.[0]}
              </div>
              <div>
                <p className="font-medium text-ink">{profile?.full_name}</p>
                <p className="mono text-xs text-ink/40">{profile?.university || 'Üniversite belirtilmemiş'}</p>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skills.slice(0, 3).map((s: any, i: number) => (
                      <span key={i} className="mono text-xs bg-white text-ink/50 border border-neutral-200 rounded px-1.5 py-0.5">{s.skill_name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {!profile?.bio && (
              <p className="mono text-xs text-ink/35 mt-3">
                💡 <Link href="/profile/edit" className="text-brand hover:underline">Profil hakkında bölümünü doldur</Link> — mentor kartında görünecek.
              </p>
            )}
          </div>

          {/* Mentorluk bilgileri */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">MENTORLUK BİLGİLERİ</p>

            <div>
              <label className="label">Mentorluk başlığı *</label>
              <input type="text" className="input"
                placeholder="Ürün yönetimi ve startup büyümesi üzerine"
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>

            <div>
              <label className="label">Ne konuşabiliriz? *</label>
              <textarea className="input resize-none" rows={3}
                placeholder="Hangi konularda yardımcı olabilirsin? Hangi soruları yanıtlayabilirsin?"
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
            </div>

            <div>
              <label className="label mb-2">Uzmanlık alanları</label>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_AREAS.map(area => (
                  <button key={area} type="button" onClick={() => toggleArea(area)}
                    className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedAreas.includes(area)
                        ? 'bg-brand text-white border-brand'
                        : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'
                    }`}>
                    {area}
                  </button>
                ))}
              </div>
              <input type="text" className="input mt-2" placeholder="Diğer uzmanlık alanları..."
                value={form.expertise} onChange={e => setForm(p => ({ ...p, expertise: e.target.value }))} />
            </div>

            <div>
              <label className="label">LinkedIn profili</label>
              <input type="url" className="input" placeholder="https://linkedin.com/in/..."
                value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Deneyim (yıl)</label>
                <select className="input" value={form.experience_years}
                  onChange={e => setForm(p => ({ ...p, experience_years: e.target.value }))}>
                  <option value="">Seç</option>
                  {['1-2', '3-5', '5-10', '10+'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Maks. mentee sayısı</label>
                <select className="input" value={form.max_mentees}
                  onChange={e => setForm(p => ({ ...p, max_mentees: e.target.value }))}>
                  {['1', '2', '3', '5', '10'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Uygunluk */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">UYGUNLUK</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Gün</label>
                <select className="input" value={form.day_of_week}
                  onChange={e => setForm(p => ({ ...p, day_of_week: e.target.value }))}>
                  {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Saat</label>
                <select className="input" value={form.time_slot}
                  onChange={e => setForm(p => ({ ...p, time_slot: e.target.value }))}>
                  {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Süre</label>
                <select className="input" value={form.session_duration}
                  onChange={e => setForm(p => ({ ...p, session_duration: e.target.value }))}>
                  {[['30', '30 dk'], ['45', '45 dk'], ['60', '1 saat'], ['90', '1.5 saat']].map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
          )}

          <button onClick={handleSubmit} disabled={loading || !form.title || !form.description}
            className="btn-primary w-full justify-center disabled:opacity-60 py-3 text-base">
            {loading ? 'Kaydediliyor...' : 'Mentor olarak kaydol →'}
          </button>
        </div>

        {/* Sağ — bilgi + önizleme */}
        <div className="space-y-4">

          {/* Önizleme */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">MENTOR KARTI ÖNİZLEME</p>
            <div style={{ border: '1px solid rgba(26,26,24,.08)', borderRadius: 12, padding: 14 }}>
              <div className="flex items-start gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-brand/15 flex items-center justify-center font-serif font-bold text-brand flex-shrink-0">
                  {profile?.full_name?.[0]}
                </div>
                <div>
                  <p className="font-serif font-bold text-ink text-sm">{profile?.full_name}</p>
                  <p className="mono text-xs text-ink/35">{profile?.university || '—'}</p>
                </div>
              </div>
              <p className="text-xs font-medium text-ink mb-1">{form.title || 'Mentorluk başlığı...'}</p>
              {form.description && <p className="text-xs text-ink/45 line-clamp-2 leading-relaxed mb-2">{form.description}</p>}
              {selectedAreas.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedAreas.slice(0, 3).map((a, i) => (
                    <span key={i} className="mono text-xs bg-neutral-100 text-ink/50 border border-neutral-200 rounded px-1.5 py-0.5">{a}</span>
                  ))}
                </div>
              )}
              <p className="mono text-xs text-ink/35">
                <Clock size={9} className="inline mr-1" />
                {DAY_LABELS[form.day_of_week]} · {form.time_slot} · {form.session_duration} dk
              </p>
            </div>
          </div>

          {/* Neden mentor ol */}
          <div className="card" style={{ background: '#1a1a18' }}>
            <div className="flex items-center gap-2 mb-3">
              <Star size={13} className="text-brand" />
              <p className="mono text-xs text-brand tracking-widest">NEDEN MENTOR OL?</p>
            </div>
            <div className="space-y-3">
              {[
                { icon: '❤️', text: 'Bir girişimcinin hayatına dokunuyorsun' },
                { icon: '🏆', text: 'Toplulukta mentor rozeti kazanıyorsun' },
                { icon: '🤝', text: 'Değerli bağlantılar kuruyorsun' },
                { icon: '⏱️', text: 'Sadece haftada 1 saat yeterli' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <p className="text-xs text-white/55">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* İpuçları */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={13} className="text-brand" />
              <p className="mono text-xs text-ink/35 tracking-widest">İYİ MENTOR PROFİLİ</p>
            </div>
            <div className="space-y-2.5">
              {[
                { icon: '🎯', text: 'Net bir uzmanlık alanı belirt' },
                { icon: '📝', text: 'Hangi soruları cevaplayabileceğini yaz' },
                { icon: '🔗', text: 'LinkedIn profilini ekle — güven oluşturur' },
                { icon: '📅', text: 'Gerçekçi müsaitlik saati seç' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{tip.icon}</span>
                  <p className="text-xs text-ink/55 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}