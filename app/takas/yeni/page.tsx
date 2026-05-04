'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/layout/AppLayout'
import { ArrowLeft } from 'lucide-react'

const CATEGORIES = ['kod', 'tasarim', 'pazarlama', 'sunum', 'diger']
const CAT_LABELS: Record<string, string> = {
  kod: 'Kod', tasarim: 'Tasarım', pazarlama: 'Pazarlama', sunum: 'Sunum/Pitch', diger: 'Diğer'
}

export default function YeniTakasPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '',
    description: '',
    skill_category: 'kod',
    karma_amount: 100,
    delivery_time: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error: insertError } = await supabase.from('takas_offers').insert({
      owner_id: user.id,
      title: form.title,
      description: form.description,
      skill_category: form.skill_category,
      karma_amount: Number(form.karma_amount),
      delivery_time: form.delivery_time,
      status: 'acik',
    })

    if (insertError) {
      setError('Bir hata oluştu.')
      setLoading(false)
      return
    }

    router.push('/takas')
  }

  return (
    <AppLayout user={null}>
      
      <main className="px-8 py-10 max-w-2xl">
        <Link href="/takas" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} />
          Takasa dön
        </Link>

        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">KARMA TOKEN TAKASI</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Teklif oluştur.</h1>
          <p className="text-sm text-ink/45 mt-2">Yapabileceğin bir şeyi topluluğa sun.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="label">Teklif başlığı</label>
            <input
              name="title"
              type="text"
              className="input"
              placeholder="Landing page tasarlayabilirim, React ile MVP yapabilirim..."
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Detay</label>
            <textarea
              name="description"
              className="input resize-none"
              placeholder="Ne yapacaksın, nasıl yapacaksın? Kısaca anlat."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kategori</label>
              <select name="skill_category" className="input" value={form.skill_category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Karma Token miktarı</label>
              <input
                name="karma_amount"
                type="number"
                className="input"
                min={10}
                max={1000}
                value={form.karma_amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Teslim süresi</label>
            <input
              name="delivery_time"
              type="text"
              className="input"
              placeholder="3 gün, 1 hafta..."
              value={form.delivery_time}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? 'Oluşturuluyor...' : 'Teklif oluştur →'}
          </button>
        </form>
      </main>
    </AppLayout>
  )
}