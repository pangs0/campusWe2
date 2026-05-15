'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, X, BookOpen, Users, Star, DollarSign, Eye, EyeOff, Zap, CheckCircle } from 'lucide-react'

const CATEGORIES = [
  { key: 'girisimcilik', label: 'Girişimcilik', emoji: '🚀' },
  { key: 'teknoloji', label: 'Teknoloji & Yazılım', emoji: '💻' },
  { key: 'tasarim', label: 'Tasarım & UI/UX', emoji: '🎨' },
  { key: 'pazarlama', label: 'Pazarlama & Büyüme', emoji: '📈' },
  { key: 'finans', label: 'Finans & Yatırım', emoji: '💰' },
  { key: 'yapay_zeka', label: 'Yapay Zeka', emoji: '🤖' },
  { key: 'urun', label: 'Ürün Yönetimi', emoji: '📦' },
  { key: 'kisisel_gelisim', label: 'Kişisel Gelişim', emoji: '🌱' },
  { key: 'diger', label: 'Diğer', emoji: '✨' },
]

const LEVELS = [
  { key: 'başlangıç', label: 'Başlangıç', desc: 'Hiç bilgisi olmayanlar için' },
  { key: 'orta', label: 'Orta', desc: 'Temel bilgisi olanlar için' },
  { key: 'ileri', label: 'İleri', desc: 'Deneyimliler için' },
]

const TIPS = [
  { icon: '📸', text: 'Kaliteli bir kapak görseli tıklanma oranını %40 artırır.' },
  { icon: '✍️', text: 'Başlık net ve spesifik olsun — "Sıfırdan React" değil "Sıfırdan React ile SaaS Kur".' },
  { icon: '💰', text: '%75 komisyonun senindir. Fiyatını buna göre belirle.' },
  { icon: '📚', text: 'En az 5 ders içeren kurslar %3x daha fazla kayıt alır.' },
]

export default function KursYeniClient({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const thumbnailRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    what_you_learn: '',
    requirements: '',
    category: '',
    level: 'başlangıç',
    language: 'Türkçe',
    is_free: true,
    price: 199,
    is_published: false,
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Görsel 5MB\'dan küçük olmalı.'); return }
    setThumbnailFile(file)
    const reader = new FileReader()
    reader.onload = () => setThumbnailPreview(reader.result as string)
    reader.readAsDataURL(file)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Kurs adı gerekli.'); return }
    if (!form.category) { setError('Kategori seçiniz.'); return }
    setLoading(true)
    setError('')

    let thumbnail_url = ''
    if (thumbnailFile) {
      const cleanName = thumbnailFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const path = `${userId}/${Date.now()}-${cleanName}`
      const { error: uploadError } = await supabase.storage.from('course-thumbnails').upload(path, thumbnailFile)
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('course-thumbnails').getPublicUrl(path)
        thumbnail_url = urlData.publicUrl
      }
    }

    const { data, error: insertError } = await supabase.from('courses').insert({
      instructor_id: userId,
      title: form.title,
      description: form.description,
      what_you_learn: form.what_you_learn,
      requirements: form.requirements,
      category: form.category,
      level: form.level,
      language: form.language,
      is_free: form.is_free,
      price: form.is_free ? 0 : form.price,
      thumbnail_url,
      is_published: false,
    }).select().single()

    if (insertError) {
      setError('Hata: ' + insertError.message)
      setLoading(false)
      return
    }

    // Kurs oluşturuldu, editöre yönlendir
    router.push(`/kurslar/egitmen/${data.id}/duzenle`)
  }

  const selectedCategory = CATEGORIES.find(c => c.key === form.category)
  const estimatedMonthly = !form.is_free ? Math.round(form.price * 20 * 0.75) : 0

  return (
    <div>
      <Link href="/kurslar/egitmen" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Panele dön
      </Link>

      <div className="mb-8">
        <p className="mono text-xs text-ink/35 tracking-widest mb-1">EĞİTMEN PANELİ</p>
        <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Yeni Kurs Oluştur.</h1>
        <p className="text-sm text-ink/45 mt-1">Bilgini paylaş, pasif gelir kazan.</p>
      </div>

      {/* Adım indikatörü */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { n: 1, label: 'Kurs Bilgileri' },
          { n: 2, label: 'Fiyat & Yayın' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center mono text-xs font-bold transition-colors ${
              step === s.n ? 'bg-brand text-white' : step > s.n ? 'bg-green-500 text-white' : 'bg-neutral-200 text-ink/40'
            }`}>
              {step > s.n ? <CheckCircle size={14} /> : s.n}
            </div>
            <span className={`text-sm ${step === s.n ? 'text-ink font-medium' : 'text-ink/35'}`}>{s.label}</span>
            {i < 1 && <div className="w-12 h-px bg-neutral-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        <form onSubmit={handleSubmit} className="col-span-2 space-y-5">

          {step === 1 && (
            <>
              {/* Thumbnail */}
              <div className="card">
                <p className="mono text-xs text-ink/35 tracking-widest mb-3">KAPAK GÖRSELİ</p>
                {thumbnailPreview ? (
                  <div className="relative rounded-xl overflow-hidden" style={{ height: 180 }}>
                    <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(null) }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
                      <X size={14} color="white" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 rounded px-2 py-0.5">
                      <p className="mono text-xs text-white/70">{thumbnailFile?.name}</p>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => thumbnailRef.current?.click()}
                    className="border-2 border-dashed border-neutral-200 rounded-xl h-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand/30 hover:bg-brand/2 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-brand/8 flex items-center justify-center">
                      <Upload size={20} className="text-brand/50" />
                    </div>
                    <p className="text-sm text-ink/50">Kapak görseli yükle</p>
                    <p className="mono text-xs text-ink/25">PNG, JPG · maks. 5MB · önerilen 1280×720px</p>
                  </div>
                )}
                <input ref={thumbnailRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
              </div>

              {/* Temel bilgiler */}
              <div className="card space-y-4">
                <p className="mono text-xs text-ink/35 tracking-widest">KURS BİLGİLERİ</p>
                <div>
                  <label className="label">Kurs Adı *</label>
                  <input className="input" placeholder="Sıfırdan React ile SaaS Kur" value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                  <p className="mono text-xs text-ink/25 mt-1">{form.title.length}/100</p>
                </div>
                <div>
                  <label className="label">Açıklama</label>
                  <textarea className="input resize-none" rows={4}
                    placeholder="Bu kursta ne öğrenecekler? Kimler katılmalı? Neden seninle öğrensinler?"
                    value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                  <p className="mono text-xs text-ink/25 mt-1">{form.description.length}/2000</p>
                </div>
                <div>
                  <label className="label">Bu kurstan ne öğrenecekler?</label>
                  <textarea className="input resize-none" rows={3}
                    placeholder="• React hooks kullanmayı öğrenecekler&#10;• Supabase ile backend kuracaklar&#10;• Gerçek bir proje deploy edecekler"
                    value={form.what_you_learn} onChange={e => setForm(p => ({ ...p, what_you_learn: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Ön koşullar</label>
                  <textarea className="input resize-none" rows={2}
                    placeholder="• Temel HTML/CSS bilgisi gerekli&#10;• JavaScript'e aşinalık"
                    value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} />
                </div>
              </div>

              {/* Kategori */}
              <div className="card">
                <p className="mono text-xs text-ink/35 tracking-widest mb-3">KATEGORİ *</p>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.key} type="button" onClick={() => setForm(p => ({ ...p, category: cat.key }))}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        form.category === cat.key ? 'border-brand/40 bg-brand/5' : 'border-neutral-200 hover:border-neutral-300'
                      }`}>
                      <span className="text-lg">{cat.emoji}</span>
                      <p className={`text-xs font-medium mt-1 ${form.category === cat.key ? 'text-brand' : 'text-ink'}`}>{cat.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seviye & Dil */}
              <div className="card space-y-4">
                <p className="mono text-xs text-ink/35 tracking-widest">SEVİYE & DİL</p>
                <div>
                  <label className="label mb-2">Seviye</label>
                  <div className="grid grid-cols-3 gap-2">
                    {LEVELS.map(l => (
                      <button key={l.key} type="button" onClick={() => setForm(p => ({ ...p, level: l.key }))}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          form.level === l.key ? 'border-brand/40 bg-brand/5' : 'border-neutral-200 hover:border-neutral-300'
                        }`}>
                        <p className={`text-sm font-medium ${form.level === l.key ? 'text-brand' : 'text-ink'}`}>{l.label}</p>
                        <p className="text-xs text-ink/35 mt-0.5 leading-tight">{l.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Kurs Dili</label>
                  <select className="input" value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))}>
                    <option>Türkçe</option>
                    <option>İngilizce</option>
                    <option>Türkçe + İngilizce Altyazı</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}

              <button type="button" onClick={() => {
                if (!form.title.trim()) { setError('Kurs adı gerekli.'); return }
                if (!form.category) { setError('Kategori seçiniz.'); return }
                setError(''); setStep(2)
              }} className="btn-primary w-full justify-center py-3">
                Devam et → Fiyat & Yayın
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Fiyat */}
              <div className="card space-y-4">
                <p className="mono text-xs text-ink/35 tracking-widest">FİYATLANDIRMA</p>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50">
                  <input type="checkbox" id="is_free" checked={form.is_free}
                    onChange={e => setForm(p => ({ ...p, is_free: e.target.checked }))}
                    className="accent-brand w-4 h-4" />
                  <label htmlFor="is_free" className="flex-1 cursor-pointer">
                    <p className="text-sm font-medium text-ink">Ücretsiz kurs</p>
                    <p className="text-xs text-ink/40">Daha fazla öğrenciye ulaş, topluluğunu büyüt</p>
                  </label>
                </div>

                {!form.is_free && (
                  <div>
                    <label className="label">Kurs Fiyatı (₺)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 font-medium">₺</span>
                      <input type="number" className="input pl-7" min={9} max={9999} value={form.price}
                        onChange={e => setForm(p => ({ ...p, price: +e.target.value }))} />
                    </div>
                    <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-100">
                      <p className="mono text-xs text-green-700 mb-1">TAHMİNİ AYLIK KAZANÇ</p>
                      <p className="font-serif text-2xl font-bold text-green-700">₺{estimatedMonthly.toLocaleString('tr-TR')}</p>
                      <p className="mono text-xs text-green-600/60 mt-0.5">20 öğrenci × ₺{form.price} × %75 = ₺{estimatedMonthly.toLocaleString('tr-TR')}</p>
                    </div>
                    {/* Fiyat önerileri */}
                    <div className="flex gap-2 mt-3">
                      {[99, 199, 299, 499, 799].map(p => (
                        <button key={p} type="button" onClick={() => setForm(prev => ({ ...prev, price: p }))}
                          className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            form.price === p ? 'bg-brand text-white border-brand' : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'
                          }`}>
                          ₺{p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Yayın durumu */}
              <div className="card">
                <p className="mono text-xs text-ink/35 tracking-widest mb-3">YAYIN DURUMU</p>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setForm(p => ({ ...p, is_published: false }))}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      !form.is_published ? 'border-brand/40 bg-brand/5' : 'border-neutral-200 hover:border-neutral-300'
                    }`}>
                    <EyeOff size={18} className={!form.is_published ? 'text-brand mb-2' : 'text-ink/30 mb-2'} />
                    <p className={`font-medium text-sm ${!form.is_published ? 'text-brand' : 'text-ink'}`}>Taslak olarak kaydet</p>
                    <p className="text-xs text-ink/40 mt-0.5 leading-tight">Önce içerik ekle, sonra yayınla</p>
                  </button>
                  <button type="button" onClick={() => setForm(p => ({ ...p, is_published: true }))}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      form.is_published ? 'border-green-400 bg-green-50' : 'border-neutral-200 hover:border-neutral-300'
                    }`}>
                    <Eye size={18} className={form.is_published ? 'text-green-600 mb-2' : 'text-ink/30 mb-2'} />
                    <p className={`font-medium text-sm ${form.is_published ? 'text-green-700' : 'text-ink'}`}>Hemen yayınla</p>
                    <p className="text-xs text-ink/40 mt-0.5 leading-tight">İçerik hazırsa direkt yayınla</p>
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary px-6 py-3">
                  ← Geri
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3 disabled:opacity-60">
                  {loading ? 'Oluşturuluyor...' : 'Kurs oluştur ve içerik ekle →'}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Sağ — önizleme + ipuçları */}
        <div className="space-y-4 sticky top-10 self-start">
          {/* Canlı önizleme */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">CANLI ÖNİZLEME</p>
            <div className="rounded-xl overflow-hidden border border-neutral-200">
              <div className="h-28 overflow-hidden bg-neutral-100 flex items-center justify-center">
                {thumbnailPreview
                  ? <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
                  : <BookOpen size={28} className="text-neutral-300" />
                }
              </div>
              <div className="p-3">
                {selectedCategory && (
                  <span className="mono text-xs bg-brand/10 text-brand border border-brand/15 rounded px-1.5 py-0.5 mb-2 inline-block">
                    {selectedCategory.emoji} {selectedCategory.label}
                  </span>
                )}
                <p className="font-serif font-bold text-ink text-sm mt-1 mb-1">
                  {form.title || 'Kurs adı...'}
                </p>
                {form.description && (
                  <p className="text-xs text-ink/50 leading-relaxed line-clamp-2 mb-2">{form.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="mono text-xs text-ink/30">{form.level}</span>
                  <span className="text-ink/20">·</span>
                  <span className="mono text-xs text-ink/30">{form.language}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-neutral-100">
                  <span className="font-serif font-bold text-brand">
                    {form.is_free ? 'Ücretsiz' : `₺${form.price}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* İpuçları */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} className="text-brand" />
              <p className="mono text-xs text-ink/35 tracking-widest">İPUÇLARI</p>
            </div>
            <div className="space-y-3">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{tip.icon}</span>
                  <p className="text-xs text-ink/55 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kazanç modeli */}
          <div className="card bg-green-50 border-green-100">
            <p className="mono text-xs text-green-600/60 tracking-widest mb-2">GELİR PAYI</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-serif text-2xl font-bold text-green-700">%75</p>
                <p className="mono text-xs text-green-600/60">senin payın</p>
              </div>
              <div className="w-px h-10 bg-green-200" />
              <div className="flex-1">
                <p className="font-serif text-2xl font-bold text-green-500/50">%25</p>
                <p className="mono text-xs text-green-600/40">platform payı</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}