'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, CheckCircle, BookOpen, DollarSign, Users, Star, TrendingUp, Play, Award, Lightbulb, Plus } from 'lucide-react'

const EXPERTISE_AREAS = [
  'Girişimcilik', 'Web Geliştirme', 'Mobil Uygulama', 'Yapay Zeka',
  'Pazarlama', 'Tasarım', 'Finans', 'Kişisel Gelişim', 'İş Dünyası', 'Veri Bilimi'
]

const INSTRUCTOR_BENEFITS = [
  { icon: DollarSign, title: '%75 Gelir', desc: 'Her kurs satışından %75 senin. Platform %25 alır.' },
  { icon: Users, title: 'Geniş Kitle', desc: 'CampusWe topluluğundaki binlerce girişimciye ulaş.' },
  { icon: TrendingUp, title: 'Pasif Gelir', desc: 'Bir kez oluştur, sonsuza kadar kazan.' },
  { icon: Award, title: 'Eğitmen Rozeti', desc: 'Profilinde öne çıkan eğitmen rozeti kazan.' },
]

const STEPS = [
  { n: '01', title: 'Profil oluştur', desc: 'Uzmanlık alanını ve deneyimini tanıt' },
  { n: '02', title: 'Kurs oluştur', desc: 'Bölüm ve derslerini ekle, video yükle' },
  { n: '03', title: 'Yayınla', desc: 'Kursunu yayınla, öğrenciler kaydolsun' },
  { n: '04', title: 'Kazan', desc: 'Her kayıt için otomatik ödeme al' },
]

type Props = {
  userId: string
  profile: any
  skills: any[]
  isInstructor: boolean
}

export default function EgitmenOlClient({ userId, profile, skills, isInstructor }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    bio: profile?.bio || '',
    expertise: '',
    experience_years: '',
    linkedin_url: '',
    youtube_url: '',
    website_url: '',
    why_teach: '',
  })
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function toggleArea(area: string) {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.bio.trim()) return
    if (selectedAreas.length === 0) return
    setLoading(true)

    // Role instructor yap
    await supabase.from('profiles').update({
      bio: form.bio,
      role: 'instructor',
      linkedin_url: form.linkedin_url || null,
      website_url: form.website_url || null,
    }).eq('id', userId)

    // instructor_profiles upsert
    await supabase.from('instructor_profiles').upsert({
      id: userId,
      expertise: selectedAreas.join(', '),
      bio: form.bio,
      is_approved: true,
    })

    setSubmitted(true)
    setLoading(false)
    setTimeout(() => router.push('/kurslar/egitmen'), 1500)
  }

  if (isInstructor) {
    return (
      <div>
        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">EĞİTMEN PANELI</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>
            Hoş geldin, <em className="text-brand not-italic">{profile?.full_name?.split(' ')[0]}!</em>
          </h1>
          <p className="text-sm text-ink/45 mt-1">Kurslarını yönet, yeni içerikler ekle.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Sol — hızlı aksiyonlar */}
          <div className="col-span-2 space-y-4">

            {/* Hızlı aksiyonlar */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/kurslar/egitmen" className="card hover:border-brand/30 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
                  <BookOpen size={20} className="text-brand" />
                </div>
                <h3 className="font-serif font-bold text-ink mb-1 group-hover:text-brand transition-colors">Kurslarım</h3>
                <p className="text-xs text-ink/45">Kurslarını düzenle, yayınla, izle.</p>
              </Link>

              <Link href="/kurslar/egitmen/yeni" className="card hover:border-brand/30 transition-colors group block">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <Plus size={20} className="text-green-600" />
                </div>
                <h3 className="font-serif font-bold text-ink mb-1 group-hover:text-brand transition-colors">Yeni Kurs</h3>
                <p className="text-xs text-ink/45">Yeni bir kurs oluşturmaya başla.</p>
              </Link>

              <Link href="/kurslar/ogrencim" className="card hover:border-brand/30 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <Users size={20} className="text-blue-600" />
                </div>
                <h3 className="font-serif font-bold text-ink mb-1 group-hover:text-brand transition-colors">Öğrencilerim</h3>
                <p className="text-xs text-ink/45">Kayıtlı öğrencilerini gör.</p>
              </Link>

              <Link href="/kurslar" className="card hover:border-brand/30 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                  <Play size={20} className="text-purple-600" />
                </div>
                <h3 className="font-serif font-bold text-ink mb-1 group-hover:text-brand transition-colors">Kurs Keşfet</h3>
                <p className="text-xs text-ink/45">Diğer eğitmenlerin kurslarını izle.</p>
              </Link>
            </div>

            {/* Gelir hesaplayıcı */}
            <div className="card" style={{ background: '#1a1a18' }}>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={14} className="text-brand" />
                <p className="mono text-xs text-brand tracking-widest">GELİR POTANSİYELİ</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { students: 10, price: 99 },
                  { students: 50, price: 199 },
                  { students: 100, price: 299 },
                ].map((ex, i) => (
                  <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,.05)' }}>
                    <p className="mono text-xs text-white/40 mb-1">{ex.students} öğrenci × ₺{ex.price}</p>
                    <p className="font-serif text-xl font-bold text-brand">₺{(ex.students * ex.price * 0.75).toLocaleString()}</p>
                    <p className="mono text-xs text-white/25 mt-0.5">senin payın</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ — ipuçları */}
          <div className="space-y-4">
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">BAŞARILI KURS İPUÇLARI</p>
              <div className="space-y-3">
                {[
                  { icon: '🎯', text: 'Her ders 5-15 dk olsun' },
                  { icon: '📹', text: 'YouTube\'a "Listelenmemiş" yükle' },
                  { icon: '✅', text: 'Pratik ödevler ekle' },
                  { icon: '💬', text: 'Öğrenci sorularını yanıtla' },
                  { icon: '🔄', text: 'İçeriği güncel tut' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ fontSize: 12, flexShrink: 0 }}>{tip.icon}</span>
                    <p className="text-xs text-ink/55 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(196,80,10,.03)', border: '1px solid rgba(196,80,10,.1)' }}>
              <p className="mono text-xs text-brand tracking-widest mb-2">KOMİSYON</p>
              <p className="font-serif text-3xl font-bold text-brand">%75</p>
              <p className="text-xs text-ink/50 mt-1">Her satıştan senin payın. Platform %25 alır.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid rgba(34,197,94,.3)' }}>
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Eğitmen olarak kaydoldun! 🎉</h2>
        <p className="text-sm text-ink/50">Eğitmen paneline yönlendiriliyor...</p>
      </div>
    )
  }

  return (
    <div>
      <Link href="/kurslar" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Kurslara dön
      </Link>

      {/* Hero */}
      <div className="grid grid-cols-2 gap-8 mb-10" style={{ background: '#1a1a18', borderRadius: 16, overflow: 'hidden', marginLeft: -32, marginRight: -32, paddingLeft: 32, paddingRight: 32, paddingTop: 40, paddingBottom: 40 }}>
        <div>
          <p className="mono text-xs text-brand tracking-widest mb-3">EĞİTMEN OL</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-3" style={{ letterSpacing: -1.5, lineHeight: 1.1 }}>
            Bilgini paylaş,<br />
            <em className="text-brand not-italic">para kazan.</em>
          </h1>
          <p className="text-sm text-white/45 leading-relaxed mb-6">
            CampusWe'de kurs oluştur, topluluğa öğret ve her satıştan %75 kazan.
          </p>
          <div className="flex items-center gap-4">
            <div>
              <p className="font-serif text-2xl font-bold text-brand">%75</p>
              <p className="mono text-xs text-white/30">Gelir payın</p>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,.1)' }} />
            <div>
              <p className="font-serif text-2xl font-bold text-white">∞</p>
              <p className="mono text-xs text-white/30">Pasif gelir</p>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,.1)' }} />
            <div>
              <p className="font-serif text-2xl font-bold text-white">0</p>
              <p className="mono text-xs text-white/30">Başlangıç ücreti</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {INSTRUCTOR_BENEFITS.map((b, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 16 }}>
              <b.icon size={18} className="text-brand mb-2" />
              <p className="text-sm font-medium text-white mb-0.5">{b.title}</p>
              <p className="text-xs text-white/40 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sol — form */}
        <div className="col-span-2 space-y-5">

          {/* Profil özeti */}
          <div className="card" style={{ background: 'rgba(196,80,10,.03)', border: '1px solid rgba(196,80,10,.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-lg flex-shrink-0 overflow-hidden">
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  : profile?.full_name?.[0]
                }
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
          </div>

          {/* Eğitmen bilgileri */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">EĞİTMEN PROFİLİ</p>

            <div>
              <label className="label">Kendinizi tanıtın *</label>
              <textarea className="input resize-none" rows={3}
                placeholder="Kim olduğunuzu, ne konuda uzman olduğunuzu ve neden öğretmek istediğinizi anlatın..."
                value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} required />
            </div>

            <div>
              <label className="label mb-2">Uzmanlık alanları *</label>
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
            </div>

            <div>
              <label className="label">Neden öğretmek istiyorsunuz?</label>
              <textarea className="input resize-none" rows={2}
                placeholder="Motivasyonunuzu paylaşın..."
                value={form.why_teach} onChange={e => setForm(p => ({ ...p, why_teach: e.target.value }))} />
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
                <label className="label">LinkedIn</label>
                <input type="url" className="input" placeholder="https://linkedin.com/in/..."
                  value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">YouTube kanalı</label>
                <input type="url" className="input" placeholder="https://youtube.com/@..."
                  value={form.youtube_url} onChange={e => setForm(p => ({ ...p, youtube_url: e.target.value }))} />
              </div>
              <div>
                <label className="label">Web sitesi</label>
                <input type="url" className="input" placeholder="https://..."
                  value={form.website_url} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} />
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading || !form.bio || selectedAreas.length === 0}
            className="btn-primary w-full justify-center disabled:opacity-60 py-3 text-base">
            {loading ? 'Kaydediliyor...' : 'Eğitmen olarak başla →'}
          </button>

          <p className="text-xs text-ink/35 text-center">
            Kaydolarak <Link href="/kullanim-kosullari" className="text-brand hover:underline">Kullanım Koşulları</Link>'nı kabul etmiş olursunuz.
          </p>
        </div>

        {/* Sağ — bilgi paneli */}
        <div className="space-y-4">

          {/* Nasıl çalışır */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">NASIL ÇALIŞIR</p>
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

          {/* Komisyon hesaplayıcı */}
          <div className="card" style={{ background: 'rgba(196,80,10,.03)', border: '1px solid rgba(196,80,10,.1)' }}>
            <p className="mono text-xs text-brand tracking-widest mb-3">GELİR HESAPLA</p>
            <div className="space-y-2">
              {[
                { price: 99, students: 10 },
                { price: 199, students: 50 },
                { price: 299, students: 100 },
              ].map((ex, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-neutral-100 last:border-0">
                  <p className="text-xs text-ink/55">₺{ex.price} × {ex.students} öğrenci</p>
                  <p className="text-xs font-bold text-brand">₺{(ex.price * ex.students * 0.75).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <p className="mono text-xs text-ink/30 mt-2 text-center">%75 eğitmen payı ile</p>
          </div>

          {/* İpuçları */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={13} className="text-brand" />
              <p className="mono text-xs text-ink/35 tracking-widest">İYİ KURS İÇİN</p>
            </div>
            <div className="space-y-2.5">
              {[
                { icon: '🎯', text: 'Tek bir konuya odaklan' },
                { icon: '📹', text: 'Her ders 5-15 dakika olsun' },
                { icon: '✅', text: 'Pratik ödevler ekle' },
                { icon: '🔄', text: 'İçeriği güncel tut' },
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