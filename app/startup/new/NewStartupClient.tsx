'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Lightbulb, Globe, Lock, Upload } from 'lucide-react'

const STAGES = [
  { value: 'fikir', label: 'Fikir', desc: 'Henüz geliştirme yok' },
  { value: 'mvp', label: 'MVP', desc: 'İlk ürün hazır' },
  { value: 'traction', label: 'Traction', desc: 'İlk kullanıcılar var' },
  { value: 'büyüme', label: 'Büyüme', desc: 'Ölçekleniyoruz' },
]
const SECTORS = ['EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'CleanTech', 'E-ticaret', 'SaaS', 'Yapay Zeka', 'Oyun', 'Diğer']

const STAGE_COLORS: Record<string, string> = {
  fikir: 'bg-amber-50 text-amber-700 border-amber-200',
  mvp: 'bg-blue-50 text-blue-700 border-blue-200',
  traction: 'bg-purple-50 text-purple-700 border-purple-200',
  büyüme: 'bg-green-50 text-green-700 border-green-200',
}

const TIPS = [
  { icon: '🎯', title: 'Net bir problem tanımla', desc: 'En iyi startuplar gerçek bir acıyı çözer.' },
  { icon: '🚀', title: 'Sektörünü doğru seç', desc: 'İlgili yatırımcı ve co-founderlarla buluşursun.' },
  { icon: '👥', title: 'Herkese açık yap', desc: 'Co-founder bulmak ve Demo Day için şart.' },
  { icon: '✍️', title: 'Tek paragrafla anlat', desc: '30 saniyede anlaşılmayan fikir anlatılamamış fikirdir.' },
]

const SECTOR_EXAMPLES: Record<string, string[]> = {
  'EdTech': ['Duolingo', 'Coursera', 'Khan Academy'],
  'FinTech': ['Stripe', 'Wise', 'Papara'],
  'HealthTech': ['Hims', 'Ro', 'Meditopia'],
  'AgriTech': ['Tarfin', 'Agrovisio', 'FarmHero'],
  'SaaS': ['Notion', 'Slack', 'Figma'],
  'Yapay Zeka': ['Hugging Face', 'Replicate', 'RunwayML'],
  'E-ticaret': ['Trendyol', 'Hepsiburada', 'Getir'],
}

export default function NewStartupClient({ userId, profile }: { userId: string; profile: any }) {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    name: '', description: '', problem: '', solution: '',
    target_audience: '', stage: 'fikir', sector: '',
    city: profile?.city || '', website_url: '', team_size: '1', is_public: true,
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function slugify(text: string) {
    return text.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const slug = slugify(form.name) + '-' + Math.random().toString(36).slice(2, 6)

    let logo_url = null
    if (logoFile) {
      const { data: uploadData } = await supabase.storage
        .from('startup-logos')
        .upload(`${slug}-${Date.now()}`, logoFile)
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('startup-logos').getPublicUrl(uploadData.path)
        logo_url = urlData.publicUrl
      }
    }

    const { data, error: insertError } = await supabase.from('startups').insert({
      founder_id: userId, name: form.name, slug,
      description: form.description, stage: form.stage,
      sector: form.sector, is_public: form.is_public,
      logo_url,
    }).select().single()

    if (insertError) { setError('Bir hata oluştu. Tekrar dene.'); setLoading(false); return }
    await supabase.from('startup_members').insert({ startup_id: data.id, user_id: userId, role: 'Kurucu' })
    router.push(`/startup/${data.slug}`)
  }

  return (
    <main className="px-8 py-10">
      <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Dashboard'a dön
      </Link>

      <div className="mb-8">
        <p className="mono text-xs text-ink/35 tracking-widest mb-1">YENİ STARTUP</p>
        <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Fikrinin adını koy.</h1>
        <p className="text-sm text-ink/45 mt-1">Birkaç dakikada startup sayfan hazır.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Sol — form */}
        <div className="col-span-2 space-y-4">

          {/* Temel bilgiler */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">TEMEL BİLGİLER</p>

            {/* Logo yükleme */}
            <div className="flex items-center gap-4">
              <div style={{ width: 64, height: 64, borderRadius: 14, background: logoPreview ? 'transparent' : 'rgba(196,80,10,.1)', border: '2px dashed rgba(196,80,10,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {logoPreview
                  ? <img src={logoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 22 }}>{form.name?.[0]?.toUpperCase() || '🚀'}</span>
                }
              </div>
              <div>
                <label className="label mb-1">Logo</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid rgba(26,26,24,.12)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: 'rgba(26,26,24,.6)', cursor: 'pointer' }}>
                  <Upload size={12} />
                  Logo yükle
                  <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                </label>
                <p className="mono text-xs text-ink/30 mt-1">PNG, JPG · Maks 2MB</p>
              </div>
            </div>

            <div>
              <label className="label">Startup adı *</label>
              <input type="text" className="input" placeholder="EcoTrack, MediSync..."
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>

            <div>
              <label className="label">Ne yapıyorsunuz? *</label>
              <textarea className="input resize-none" rows={3}
                placeholder="Tek paragrafla anlat. Yatırımcıya anlatır gibi."
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>

          {/* Problem & Çözüm */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">PROBLEM & ÇÖZÜM</p>
            <div>
              <label className="label">Hangi problemi çözüyorsunuz?</label>
              <textarea className="input resize-none" rows={2}
                placeholder="Kullanıcıların yaşadığı somut problem..."
                value={form.problem} onChange={e => setForm(p => ({ ...p, problem: e.target.value }))} />
            </div>
            <div>
              <label className="label">Çözümünüz nedir?</label>
              <textarea className="input resize-none" rows={2}
                placeholder="Problemi nasıl çözüyorsunuz?"
                value={form.solution} onChange={e => setForm(p => ({ ...p, solution: e.target.value }))} />
            </div>
            <div>
              <label className="label">Hedef kitle</label>
              <input type="text" className="input" placeholder="Örn: 18-30 yaş arası üniversite öğrencileri"
                value={form.target_audience} onChange={e => setForm(p => ({ ...p, target_audience: e.target.value }))} />
            </div>
          </div>

          {/* Detaylar */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">DETAYLAR</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Aşama</label>
                <select className="input" value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>
                  {STAGES.map(s => <option key={s.value} value={s.value}>{s.label} — {s.desc}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Sektör</label>
                <select className="input" value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))}>
                  <option value="">Seç</option>
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Şehir</label>
                <input type="text" className="input" placeholder="İstanbul"
                  value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
              </div>
              <div>
                <label className="label">Kurucu sayısı</label>
                <select className="input" value={form.team_size} onChange={e => setForm(p => ({ ...p, team_size: e.target.value }))}>
                  {['1', '2', '3', '4', '5+'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Web sitesi (isteğe bağlı)</label>
              <input type="url" className="input" placeholder="https://..."
                value={form.website_url} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(26,26,24,.03)', border: '1px solid rgba(26,26,24,.06)' }}>
              <input type="checkbox" id="is_public" checked={form.is_public}
                onChange={e => setForm(p => ({ ...p, is_public: e.target.checked }))}
                className="accent-brand w-4 h-4 flex-shrink-0" />
              <label htmlFor="is_public" className="cursor-pointer flex-1">
                <p className="text-sm font-medium text-ink flex items-center gap-1.5">
                  {form.is_public ? <Globe size={13} className="text-brand" /> : <Lock size={13} className="text-ink/30" />}
                  {form.is_public ? 'Herkese açık' : 'Gizli'}
                </p>
                <p className="mono text-xs text-ink/35">
                  {form.is_public ? 'Topluluk görebilir, co-founder bulman kolaylaşır' : 'Sadece sen görebilirsin'}
                </p>
              </label>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}

          <button type="button" onClick={handleSubmit} disabled={loading || !form.name}
            className="btn-primary w-full justify-center disabled:opacity-60 py-3 text-base">
            {loading ? 'Oluşturuluyor...' : 'Startup sayfamı oluştur →'}
          </button>
        </div>

        {/* Sağ — önizleme + ipuçları */}
        <div className="space-y-4">

          {/* Canlı önizleme */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">CANLI ÖNİZLEME</p>
            <div style={{ border: '1px solid rgba(26,26,24,.08)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ height: 48, background: 'linear-gradient(135deg, #1a1a18, #2a1a10)' }} />
              <div style={{ padding: '0 12px 14px', marginTop: -22 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: logoPreview ? 'transparent' : '#C4500A', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18, marginBottom: 8, overflow: 'hidden', flexShrink: 0 }}>
                  {logoPreview
                    ? <img src={logoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (form.name?.[0]?.toUpperCase() || '?')
                  }
                </div>
                <p className="font-serif font-bold text-ink text-sm">{form.name || 'Startup adı...'}</p>
                {form.target_audience && <p className="mono text-xs text-ink/35 mt-0.5">👥 {form.target_audience}</p>}
                <p className="text-xs text-ink/50 mt-1 leading-relaxed line-clamp-2">
                  {form.description || 'Açıklama burada görünecek...'}
                </p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {form.stage && <span className={`mono text-xs border rounded px-1.5 py-0.5 ${STAGE_COLORS[form.stage]}`}>{form.stage}</span>}
                  {form.sector && <span className="mono text-xs bg-neutral-100 text-ink/50 border border-neutral-200 rounded px-1.5 py-0.5">{form.sector}</span>}
                  {form.city && <span className="mono text-xs text-ink/30">📍 {form.city}</span>}
                  {form.team_size && <span className="mono text-xs text-ink/30">👤 {form.team_size} kurucu</span>}
                </div>
              </div>
            </div>
            <p className="mono text-xs text-ink/25 text-center mt-2">Gerçek zamanlı önizleme</p>
          </div>

          {/* Sektör örnekleri */}
          {form.sector && SECTOR_EXAMPLES[form.sector] && (
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">{form.sector.toUpperCase()} ÖRNEKLERİ</p>
              <div className="space-y-1.5">
                {SECTOR_EXAMPLES[form.sector].map((ex, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A', flexShrink: 0 }} />
                    <span className="text-sm text-ink/60">{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* İpuçları */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={14} className="text-brand" />
              <p className="mono text-xs text-ink/35 tracking-widest">İYİ BİR STARTUP SAYFASI</p>
            </div>
            <div className="space-y-3">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{tip.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-ink">{tip.title}</p>
                    <p className="text-xs text-ink/45 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}