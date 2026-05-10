'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Zap, Lightbulb, CheckCircle } from 'lucide-react'

const CATEGORIES = [
  { value: 'kod', label: '💻 Kod', desc: 'Web, mobil, backend geliştirme' },
  { value: 'tasarim', label: '🎨 Tasarım', desc: 'UI/UX, grafik, logo' },
  { value: 'pazarlama', label: '📣 Pazarlama', desc: 'SEO, sosyal medya, içerik' },
  { value: 'sunum', label: '🎤 Sunum', desc: 'Pitch deck, sunum hazırlama' },
  { value: 'diger', label: '⚡ Diğer', desc: 'Hukuk, finans, danışmanlık' },
]

const TIPS = [
  { icon: '🎯', text: 'Ne yapabileceğini net yaz — "Website yapabilirim" değil, "React ile MVP yapabilirim"' },
  { icon: '⏱️', text: 'Gerçekçi süre ver — teslim süresi güven oluşturur' },
  { icon: '💡', text: 'Karma miktarını adil tut — çok yüksek koymak teklifini yavaşlatır' },
  { icon: '📸', text: 'Önceki çalışmalarını belirt — bağlantı ya da açıklama ekle' },
]

const KARMA_PRESETS = [50, 100, 150, 200, 300, 500]

export default function YeniTakasClient({ userId, myKarma }: { userId: string; myKarma: number }) {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '',
    description: '',
    what_you_offer: '',
    skill_category: 'kod',
    karma_amount: 100,
    delivery_time: '',
    portfolio_url: '',
    max_orders: '1',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('takas_offers').insert({
      owner_id: userId,
      title: form.title,
      description: form.description,
      skill_category: form.skill_category,
      karma_amount: Number(form.karma_amount),
      delivery_time: form.delivery_time,
      status: 'acik',
    })

    if (insertError) { setError('Bir hata oluştu.'); setLoading(false); return }

    setSubmitted(true)
    setTimeout(() => router.push('/takas'), 1500)
  }

  const selectedCat = CATEGORIES.find(c => c.value === form.skill_category)

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid rgba(34,197,94,.3)' }}>
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Teklif oluşturuldu! 🎉</h2>
        <p className="text-sm text-ink/50">Takas sayfasına yönlendiriliyor...</p>
      </div>
    )
  }

  return (
    <div>
      <Link href="/takas" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Takasa dön
      </Link>

      <div className="mb-8">
        <p className="mono text-xs text-ink/35 tracking-widest mb-1">KARMA TOKEN TAKASI</p>
        <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Teklif oluştur.</h1>
        <p className="text-sm text-ink/45 mt-1">Yapabileceğin bir şeyi topluluğa sun.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Sol — form */}
        <div className="col-span-2 space-y-5">

          {/* Kategori seçimi */}
          <div className="card space-y-3">
            <p className="mono text-xs text-ink/35 tracking-widest">KATEGORİ</p>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.value} type="button" onClick={() => setForm(p => ({ ...p, skill_category: cat.value }))}
                  className={`p-3 rounded-xl border text-center transition-colors ${
                    form.skill_category === cat.value
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-ink/60 border-neutral-200 hover:border-brand/30'
                  }`}>
                  <p className="text-base mb-1">{cat.label.split(' ')[0]}</p>
                  <p className="mono text-xs">{cat.label.split(' ')[1]}</p>
                </button>
              ))}
            </div>
            {selectedCat && (
              <p className="mono text-xs text-ink/35">📌 {selectedCat.desc}</p>
            )}
          </div>

          {/* Teklif detayı */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">TEKLİF DETAYI</p>
            <div>
              <label className="label">Başlık *</label>
              <input type="text" className="input"
                placeholder="React ile landing page yapabilirim, Logo tasarlayabilirim..."
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Ne sunuyorsunuz?</label>
              <textarea className="input resize-none" rows={2}
                placeholder="Kısaca açıkla — ne yapacaksın, hangi araçları kullanacaksın?"
                value={form.what_you_offer} onChange={e => setForm(p => ({ ...p, what_you_offer: e.target.value }))} />
            </div>
            <div>
              <label className="label">Detaylı açıklama</label>
              <textarea className="input resize-none" rows={3}
                placeholder="Süreç nasıl işleyecek? Neye ihtiyacın var? Revizyon hakkı var mı?"
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className="label">Portfolio / Örnek çalışma linki</label>
              <input type="url" className="input" placeholder="https://..."
                value={form.portfolio_url} onChange={e => setForm(p => ({ ...p, portfolio_url: e.target.value }))} />
            </div>
          </div>

          {/* Karma ve süre */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">KARMA & SÜRE</p>
            <div>
              <label className="label mb-2">Karma Token miktarı *</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {KARMA_PRESETS.map(n => (
                  <button key={n} type="button" onClick={() => setForm(p => ({ ...p, karma_amount: n }))}
                    className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.karma_amount === n
                        ? 'bg-brand text-white border-brand'
                        : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'
                    }`}>
                    {n} ⚡
                  </button>
                ))}
              </div>
              <input type="number" className="input" min={10} max={1000}
                value={form.karma_amount} onChange={e => setForm(p => ({ ...p, karma_amount: +e.target.value }))} />
              <p className="mono text-xs text-ink/30 mt-1">Senin bakiyen: {myKarma} Karma</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Teslim süresi</label>
                <input type="text" className="input" placeholder="3 gün, 1 hafta..."
                  value={form.delivery_time} onChange={e => setForm(p => ({ ...p, delivery_time: e.target.value }))} />
              </div>
              <div>
                <label className="label">Maksimum sipariş</label>
                <select className="input" value={form.max_orders}
                  onChange={e => setForm(p => ({ ...p, max_orders: e.target.value }))}>
                  {['1', '2', '3', '5', 'Sınırsız'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}

          <button onClick={handleSubmit} disabled={loading || !form.title}
            className="btn-primary w-full justify-center disabled:opacity-60 py-3 text-base">
            {loading ? 'Oluşturuluyor...' : 'Teklifi yayınla →'}
          </button>
        </div>

        {/* Sağ — önizleme + ipuçları */}
        <div className="space-y-4">

          {/* Önizleme */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">CANLI ÖNİZLEME</p>
            <div style={{ border: '1px solid rgba(26,26,24,.08)', borderRadius: 12, padding: 14 }}>
              <div className="flex items-start justify-between mb-2">
                <span className="mono text-xs bg-neutral-100 text-ink/50 border border-neutral-200 rounded px-2 py-0.5">
                  {selectedCat?.label || 'Kategori'}
                </span>
                <div className="flex items-center gap-1 bg-brand/8 rounded px-2 py-0.5">
                  <Zap size={10} className="text-brand" />
                  <span className="mono text-xs text-brand font-medium">{form.karma_amount} ⚡</span>
                </div>
              </div>
              <p className="font-serif font-bold text-ink text-sm mb-1">
                {form.title || 'Teklif başlığı...'}
              </p>
              {form.description && (
                <p className="text-xs text-ink/45 leading-relaxed line-clamp-2">{form.description}</p>
              )}
              {form.delivery_time && (
                <p className="mono text-xs text-ink/30 mt-1.5">⏱ {form.delivery_time}</p>
              )}
            </div>
          </div>

          {/* İpuçları */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={13} className="text-brand" />
              <p className="mono text-xs text-ink/35 tracking-widest">İYİ TEKLİF İÇİN</p>
            </div>
            <div className="space-y-3">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{tip.icon}</span>
                  <p className="text-xs text-ink/55 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Karma bilgisi */}
          <div className="card" style={{ background: 'rgba(196,80,10,.03)', border: '1px solid rgba(196,80,10,.1)' }}>
            <p className="mono text-xs text-brand tracking-widest mb-2">KARMA TOKEN NEDİR?</p>
            <p className="text-xs text-ink/55 leading-relaxed">
              Karma Token platform içi değişim birimidir. Teklif kabul edilince token transferi otomatik gerçekleşir. Her takas +5 Karma bonus kazandırır.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}