'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/layout/Navbar'
import { ArrowLeft } from 'lucide-react'

const DAYS = ['pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi', 'pazar']
const DAY_LABELS: Record<string, string> = {
  pazartesi: 'Pazartesi', sali: 'Salı', carsamba: 'Çarşamba',
  persembe: 'Perşembe', cuma: 'Cuma', cumartesi: 'Cumartesi', pazar: 'Pazar'
}

export default function YeniOfficeHoursPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '',
    description: '',
    day_of_week: 'pazartesi',
    time_slot: '19:00',
    expertise: '',
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

    const { error: insertError } = await supabase.from('office_hours').insert({
      mentor_id: user.id,
      title: form.title,
      description: form.description,
      day_of_week: form.day_of_week,
      time_slot: form.time_slot,
      expertise: form.expertise,
      is_active: true,
    })

    if (insertError) {
      setError('Bir hata oluştu.')
      setLoading(false)
      return
    }

    router.push('/office-hours')
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/office-hours" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} />
          Office Hours'a dön
        </Link>

        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">MENTOR OL</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Haftanda 1 saat ver.</h1>
          <p className="text-sm text-ink/45 mt-2">Bir sonraki büyük kurucuyu keşfet.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="label">Başlık</label>
            <input
              name="title"
              type="text"
              className="input"
              placeholder="Ürün yönetimi ve startup büyümesi üzerine"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Ne konuşabiliriz?</label>
            <textarea
              name="description"
              className="input resize-none"
              placeholder="Hangi konularda yardımcı olabilirsin?"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div>
            <label className="label">Uzmanlık alanı</label>
            <input
              name="expertise"
              type="text"
              className="input"
              placeholder="Product Management, Growth, Pazarlama..."
              value={form.expertise}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Gün</label>
              <select name="day_of_week" className="input" value={form.day_of_week} onChange={handleChange}>
                {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Saat</label>
              <input
                name="time_slot"
                type="time"
                className="input"
                value={form.time_slot}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? 'Kaydediliyor...' : 'Mentor olarak kaydol →'}
          </button>
        </form>
      </main>
    </div>
  )
}