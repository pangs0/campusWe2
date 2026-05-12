'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Calendar, MapPin, Globe, Users, Zap, CheckCircle } from 'lucide-react'

const EVENT_TYPES = [
  { key: 'networking', label: 'Networking', emoji: '🤝', desc: 'Tanışma ve bağlantı kurma' },
  { key: 'workshop', label: 'Workshop', emoji: '🛠️', desc: 'Pratik beceri geliştirme' },
  { key: 'pitch', label: 'Pitch Gecesi', emoji: '🎤', desc: 'Fikrini sun, geri bildirim al' },
  { key: 'hackathon', label: 'Hackathon', emoji: '💻', desc: 'Takım halinde üret' },
  { key: 'sohbet', label: 'Sohbet', emoji: '☕', desc: 'Samimi ortamda fikir alışverişi' },
  { key: 'diger', label: 'Diğer', emoji: '✨', desc: 'Farklı bir format' },
]

const TAGS = ['Yapay Zeka', 'FinTech', 'EdTech', 'Tasarım', 'Pazarlama', 'Yazılım', 'Yatırım', 'Ürün', 'Büyüme', 'Hukuk']
const COVER_EMOJIS = ['🚀', '💡', '🎯', '🔥', '⚡', '🌱', '🏆', '💎', '🎪', '🌍']
const TIPS = [
  { icon: '📅', text: 'Tarih en az 3 gün ileri seç — insanlar plan yapabilsin.' },
  { icon: '✍️', text: 'Açıklama kısa ve net olsun — kim katılmalı, ne kazanacak.' },
  { icon: '👥', text: 'Katılımcı limiti koy — küçük gruplar daha verimli.' },
  { icon: '🔗', text: 'Online ise Meet/Zoom linkini şimdiden ekle.' },
]

export default function GarajYeniClient({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '', description: '', event_type: 'networking',
    event_date: '', location: '', is_online: true,
    max_participants: '', tags: [] as string[], cover_emoji: '🚀',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  function toggleTag(tag: string) {
    setForm(prev => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: insertError } = await supabase.from('garaj_events').insert({
      organizer_id: userId, title: form.title, description: form.description,
      event_type: form.event_type, event_date: form.event_date, location: form.location,
      is_online: form.is_online, is_public: true,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      tags: form.tags, cover_emoji: form.cover_emoji,
    })
    if (insertError) { setError('Hata: ' + insertError.message); setLoading(false); return }
    router.push('/garaj')
  }

  const selectedType = EVENT_TYPES.find(t => t.key === form.event_type)
  const formattedDate = form.event_date
    ? new Date(form.event_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <main className="px-8 py-10">
      <Link href="/garaj" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Garaja dön
      </Link>

      <div className="mb-8">
        <p className="mono text-xs text-ink/35 tracking-widest mb-1">AÇIK GARAJ</p>
        <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Etkinlik oluştur.</h1>
        <p className="text-sm text-ink/45 mt-1">Topluluğu bir araya getir, bir şeyler inşa edin.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        <form onSubmit={handleSubmit} className="col-span-2 space-y-5">

          {/* Etkinlik türü */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">ETKİNLİK TÜRÜ</p>
            <div className="grid grid-cols-3 gap-2">
              {EVENT_TYPES.map(type => (
                <button key={type.key} type="button" onClick={() => setForm(p => ({ ...p, event_type: type.key }))}
                  className={`p-3 rounded-xl border text-left transition-all ${form.event_type === type.key ? 'border-brand/40 bg-brand/5' : 'border-neutral-200 hover:border-neutral-300 bg-white'}`}>
                  <div className="text-xl mb-1">{type.emoji}</div>
                  <p className={`text-xs font-medium ${form.event_type === type.key ? 'text-brand' : 'text-ink'}`}>{type.label}</p>
                  <p className="text-xs text-ink/35 mt-0.5 leading-tight">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Temel bilgiler */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">ETKİNLİK BİLGİLERİ</p>
            <div>
              <label className="label mb-2">Kapak emojisi</label>
              <div className="flex gap-2 flex-wrap">
                {COVER_EMOJIS.map(emoji => (
                  <button key={emoji} type="button" onClick={() => setForm(p => ({ ...p, cover_emoji: emoji }))}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${form.cover_emoji === emoji ? 'border-brand bg-brand/8 scale-110' : 'border-neutral-200 hover:border-neutral-300'}`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Etkinlik adı</label>
              <input name="title" type="text" className="input" placeholder="Pazartesi Pitch Gecesi" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Açıklama</label>
              <textarea name="description" className="input resize-none" placeholder="Kimler katılmalı? Ne yapacaksınız? Ne kazanacaklar?..." value={form.description} onChange={handleChange} rows={4} />
              <p className="mono text-xs text-ink/25 mt-1">{form.description.length}/500</p>
            </div>
          </div>

          {/* Tarih ve konum */}
          <div className="card space-y-4">
            <p className="mono text-xs text-ink/35 tracking-widest">ZAMAN VE YER</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Tarih ve saat</label>
                <input name="event_date" type="datetime-local" className="input" value={form.event_date} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Katılımcı limiti</label>
                <input name="max_participants" type="number" className="input" placeholder="Sınırsız" min="1" max="500" value={form.max_participants} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="label">Konum / Link</label>
              <input name="location" type="text" className="input" placeholder={form.is_online ? 'https://meet.google.com/...' : 'İstanbul, Kadıköy / Adres'} value={form.location} onChange={handleChange} />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <input type="checkbox" name="is_online" id="is_online" checked={form.is_online} onChange={handleChange} className="accent-brand w-4 h-4" />
              <label htmlFor="is_online" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium text-ink">Online etkinlik</p>
                <p className="text-xs text-ink/40">Video konferans veya canlı yayın</p>
              </label>
              {form.is_online ? <Globe size={16} className="text-brand" /> : <MapPin size={16} className="text-ink/30" />}
            </div>
          </div>

          {/* Etiketler */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">ETİKETLER</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${form.tags.includes(tag) ? 'bg-brand text-white border-brand' : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'}`}>
                  {form.tags.includes(tag) && <CheckCircle size={10} className="inline mr-1" />}{tag}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
            {loading ? 'Oluşturuluyor...' : 'Etkinliği yayınla →'}
          </button>
        </form>

        {/* Sağ — önizleme + ipuçları */}
        <div className="space-y-4 sticky top-10 self-start">
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">CANLI ÖNİZLEME</p>
            <div className="rounded-xl overflow-hidden border border-neutral-200">
              <div className="h-20 flex items-center justify-center text-4xl" style={{ background: 'linear-gradient(135deg, #1a1a18, #2a1a10)' }}>
                {form.cover_emoji}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="mono text-xs bg-brand/10 text-brand border border-brand/15 rounded px-1.5 py-0.5">{selectedType?.emoji} {selectedType?.label}</span>
                  {form.is_online && <span className="mono text-xs text-brand">🌐 Online</span>}
                </div>
                <p className="font-serif font-bold text-ink text-sm mb-1">{form.title || 'Etkinlik adı...'}</p>
                {form.description && <p className="text-xs text-ink/50 leading-relaxed line-clamp-2 mb-2">{form.description}</p>}
                <div className="space-y-1">
                  {formattedDate && <div className="flex items-center gap-1.5 text-xs text-ink/40"><Calendar size={11} /> {formattedDate}</div>}
                  {form.location && <div className="flex items-center gap-1.5 text-xs text-ink/40">{form.is_online ? <Globe size={11} /> : <MapPin size={11} />} {form.location}</div>}
                  {form.max_participants && <div className="flex items-center gap-1.5 text-xs text-ink/40"><Users size={11} /> Maks. {form.max_participants} kişi</div>}
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.map(tag => <span key={tag} className="mono text-xs bg-neutral-100 text-ink/40 rounded px-1.5 py-0.5">{tag}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} className="text-brand" />
              <p className="mono text-xs text-ink/35 tracking-widest">İPUÇLARI</p>
            </div>
            <div className="space-y-2.5">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{tip.icon}</span>
                  <p className="text-xs text-ink/55 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}