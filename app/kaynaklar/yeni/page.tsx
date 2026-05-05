'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/layout/AppLayout'
import { ArrowLeft } from 'lucide-react'

const CATEGORIES = [
  { key: 'pitch_deck', label: 'Pitch Deck' },
  { key: 'yatirimci', label: 'Yatırımcı' },
  { key: 'hukuk', label: 'Hukuk' },
  { key: 'finans', label: 'Finans' },
  { key: 'pazarlama', label: 'Pazarlama' },
  { key: 'teknik', label: 'Teknik' },
  { key: 'diger', label: 'Diğer' },
]

export default function YeniKaynakPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ title: '', description: '', category: 'pitch_deck', url: '', is_free: true })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('resources').insert({ ...form, added_by: user.id })
    router.push('/kaynaklar')
  }

  return (
    <AppLayout user={null}>
      <main className="px-8 py-10 max-w-2xl">
        <Link href="/kaynaklar" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} /> Kaynaklara dön
        </Link>
        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">YENİ KAYNAK</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Topluluğa katkı sağla.</h1>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label">Başlık</label>
            <input className="input" placeholder="Kaynak adı" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Açıklama</label>
            <textarea className="input resize-none" rows={3} placeholder="Bu kaynak ne işe yarıyor?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kategori</label>
              <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Link (opsiyonel)</label>
              <input className="input" placeholder="https://" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="free" checked={form.is_free} onChange={e => setForm(p => ({ ...p, is_free: e.target.checked }))} className="accent-brand w-4 h-4" />
            <label htmlFor="free" className="text-sm text-ink/60 cursor-pointer">Ücretsiz kaynak</label>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? 'Ekleniyor...' : 'Kaynak ekle →'}
          </button>
        </form>
      </main>
    </AppLayout>
  )
}