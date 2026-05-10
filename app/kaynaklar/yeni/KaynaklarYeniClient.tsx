'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Lightbulb, ExternalLink, CheckCircle, FileText, DollarSign, Scale, Megaphone, Code, HelpCircle, BookOpen } from 'lucide-react'

const CATEGORIES = [
  { key: 'pitch_deck', label: 'Pitch Deck', icon: FileText, color: 'bg-purple-50 text-purple-700 border-purple-200', desc: 'Sunum şablonları, pitch rehberleri' },
  { key: 'yatirimci', label: 'Yatırımcı', icon: DollarSign, color: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'Yatırımcı listeleri, email şablonları' },
  { key: 'hukuk', label: 'Hukuk', icon: Scale, color: 'bg-blue-50 text-blue-700 border-blue-200', desc: 'Sözleşmeler, şirket kuruluşu' },
  { key: 'finans', label: 'Finans', icon: DollarSign, color: 'bg-green-50 text-green-700 border-green-200', desc: 'Finansal modeller, hibe rehberleri' },
  { key: 'pazarlama', label: 'Pazarlama', icon: Megaphone, color: 'bg-rose-50 text-rose-700 border-rose-200', desc: 'Growth, SEO, içerik stratejileri' },
  { key: 'teknik', label: 'Teknik', icon: Code, color: 'bg-cyan-50 text-cyan-700 border-cyan-200', desc: 'MVP rehberleri, araç listeleri' },
  { key: 'diger', label: 'Diğer', icon: HelpCircle, color: 'bg-neutral-50 text-neutral-600 border-neutral-200', desc: 'Diğer faydalı kaynaklar' },
]

const RESOURCE_TYPES = [
  { key: 'rehber', label: '📖 Rehber', desc: 'Adım adım kılavuz' },
  { key: 'sablon', label: '📄 Şablon', desc: 'Kullanıma hazır dosya' },
  { key: 'liste', label: '📋 Liste', desc: 'Kaynak veya araç listesi' },
  { key: 'video', label: '🎥 Video', desc: 'Video içerik' },
  { key: 'kurs', label: '🎓 Kurs', desc: 'Eğitim içeriği' },
  { key: 'arac', label: '🛠️ Araç', desc: 'Yazılım veya uygulama' },
]

const TIPS = [
  { icon: '🎯', text: 'Başlığı net yaz — kaynak ne işe yarıyor?' },
  { icon: '📝', text: 'Açıklama kısa ama bilgilendirici olsun' },
  { icon: '🔗', text: 'Çalışan bir link ekle — ölü linkler güven kırar' },
  { icon: '✅', text: 'Ücretsiz mi ücretli mi olduğunu belirt' },
]

export default function KaynaklarYeniClient({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'pitch_deck',
    resource_type: 'rehber',
    url: '',
    is_free: true,
    language: 'tr',
    tags: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const selectedCat = CATEGORIES.find(c => c.key === form.category)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('resources').insert({
      title: form.title,
      description: form.description,
      category: form.category,
      url: form.url || null,
      is_free: form.is_free,
      added_by: userId,
    })

    if (insertError) { setError('Bir hata oluştu.'); setLoading(false); return }
    setSubmitted(true)
    setTimeout(() => router.push('/kaynaklar'), 1500)
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid rgba(34,197,94,.3)' }}>
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Kaynak eklendi! 🎉</h2>
        <p className="text-sm text-ink/50">Kaynaklar sayfasına yönlendiriliyor...</p>
      </div>
    )
  }

  return (
    <div>
      <Link href="/kaynaklar" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Kaynaklara dön
      </Link>

      <div className="mb-8">
        <p className="mono text-xs text-ink/35 tracking-widest mb-1">YENİ KAYNAK</p>
        <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Topluluğa katkı sağla.</h1>
        <p className="text-sm text-ink/45 mt-1">Faydalı bulduğun bir kaynağı toplulukla paylaş.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Sol — form */}
        <div className="col-span-2 space-y-5">

          {/* Kategori seçimi */}
          <div className="card space-y-3">
            <p className="mono text-xs text-ink/35 tracking-widest">KATEGORİ</p>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.key} type="button" onClick={() => setForm(p => ({ ...p, category: cat.key }))}
                  className={`p-2.5 rounded-xl border text-center transition-colors ${
                    form.category === cat.key ? 'bg-ink text-white border-ink' : 'bg-white border-neutral-200 hover:border-brand/30'
                  }`}>
                  <cat.icon size={14} className={form.category === cat.key ? 'text-white mx-auto mb-1' : 'text-ink/40 mx-auto mb-1'} />
                  <p className={`mono text-xs ${form.category === cat.key ? 'text-white' : 'text-ink/50'}`}>{cat.label}</p>
                </button>
              ))}
            </div>
            {selectedCat && (
              <p className="mono text-xs text-ink/35">📌 {selectedCat.desc}</p>
            )}
          </div>

          {/* Kaynak detayı */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">KAYNAK DETAYI</p>
            <div>
              <label className="label">Başlık *</label>
              <input type="text" className="input"
                placeholder="Y Combinator Pitch Deck Rehberi, KOSGEB Hibe Listesi..."
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Açıklama</label>
              <textarea className="input resize-none" rows={3}
                placeholder="Bu kaynak ne işe yarıyor? Kime faydalı?"
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className="label">Link</label>
              <input type="url" className="input" placeholder="https://..."
                value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Kaynak türü</label>
                <select className="input" value={form.resource_type}
                  onChange={e => setForm(p => ({ ...p, resource_type: e.target.value }))}>
                  {RESOURCE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Dil</label>
                <select className="input" value={form.language}
                  onChange={e => setForm(p => ({ ...p, language: e.target.value }))}>
                  <option value="tr">🇹🇷 Türkçe</option>
                  <option value="en">🇬🇧 İngilizce</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(26,26,24,.03)', border: '1px solid rgba(26,26,24,.06)' }}>
              <input type="checkbox" id="is_free" checked={form.is_free}
                onChange={e => setForm(p => ({ ...p, is_free: e.target.checked }))}
                className="accent-brand w-4 h-4 flex-shrink-0" />
              <label htmlFor="is_free" className="cursor-pointer">
                <p className="text-sm font-medium text-ink">{form.is_free ? '✅ Ücretsiz kaynak' : '💳 Ücretli kaynak'}</p>
                <p className="mono text-xs text-ink/35">{form.is_free ? 'Herkes ücretsiz erişebilir' : 'Ödeme gerektiriyor'}</p>
              </label>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}

          <button onClick={handleSubmit} disabled={loading || !form.title}
            className="btn-primary w-full justify-center disabled:opacity-60 py-3 text-base">
            {loading ? 'Ekleniyor...' : 'Kaynağı paylaş →'}
          </button>
        </div>

        {/* Sağ — önizleme + ipuçları */}
        <div className="space-y-4">

          {/* Önizleme */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">CANLI ÖNİZLEME</p>
            <div style={{ border: '1px solid rgba(26,26,24,.08)', borderRadius: 12, padding: 14 }}>
              <div className="flex items-start justify-between mb-2">
                {selectedCat && (
                  <span className={`inline-flex items-center gap-1 mono text-xs border rounded px-2 py-0.5 ${selectedCat.color}`}>
                    <selectedCat.icon size={10} /> {selectedCat.label}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {form.is_free && (
                    <span className="mono text-xs text-green-600 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">Ücretsiz</span>
                  )}
                  {form.url && <ExternalLink size={12} className="text-ink/25" />}
                </div>
              </div>
              <p className="font-serif font-bold text-ink text-sm mb-1">
                {form.title || 'Kaynak başlığı...'}
              </p>
              {form.description && (
                <p className="text-xs text-ink/45 leading-relaxed line-clamp-2">{form.description}</p>
              )}
              <p className="mono text-xs text-ink/20 mt-2">Sen tarafından eklendi</p>
            </div>
          </div>

          {/* İpuçları */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={13} className="text-brand" />
              <p className="mono text-xs text-ink/35 tracking-widest">İYİ KAYNAK İÇİN</p>
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

          {/* Popüler kategoriler */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">EN ÇOK ARANAN</p>
            <div className="space-y-2">
              {[
                { cat: 'Pitch Deck', n: '12 kaynak' },
                { cat: 'Yatırımcı', n: '8 kaynak' },
                { cat: 'Teknik', n: '7 kaynak' },
                { cat: 'Finans', n: '6 kaynak' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-ink/60">{item.cat}</span>
                  <span className="mono text-xs text-ink/30">{item.n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}