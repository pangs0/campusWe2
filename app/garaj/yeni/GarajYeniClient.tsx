'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

import { ArrowLeft } from 'lucide-react'

const EVENT_TYPES = ['networking', 'workshop', 'pitch', 'sohbet']

export default function GarajYeniClient({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_type: 'networking',
    event_date: '',
    location: '',
    is_online: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')


    const { error: insertError } = await supabase.from('garaj_events').insert({
      organizer_id: userId,
      title: form.title,
      description: form.description,
      event_type: form.event_type,
      event_date: form.event_date,
      location: form.location,
      is_online: form.is_online,
      is_public: true,
    })

    if (insertError) {
      setError('Bir hata oluştu.')
      setLoading(false)
      return
    }

    router.push('/garaj')
  }

  return (
    
      
  <main className="px-8 py-10 max-w-2xl">
        <Link href="/garaj" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} />
          Garaja dön
        </Link>

        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">AÇIK GARAJ</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Etkinlik oluştur.</h1>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="label">Etkinlik adı</label>
            <input name="title" type="text" className="input" placeholder="Pazartesi Pitch Gecesi" value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Açıklama</label>
            <textarea name="description" className="input resize-none" placeholder="Etkinlik hakkında kısa bilgi ver..." value={form.description} onChange={handleChange} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tür</label>
              <select name="event_type" className="input" value={form.event_type} onChange={handleChange}>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tarih ve saat</label>
              <input name="event_date" type="datetime-local" className="input" value={form.event_date} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="label">Konum / Link</label>
            <input name="location" type="text" className="input" placeholder="Google Meet linki veya adres" value={form.location} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_online" id="is_online" checked={form.is_online} onChange={handleChange} className="accent-brand w-4 h-4" />
            <label htmlFor="is_online" className="text-sm text-ink/60 cursor-pointer">Online etkinlik</label>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? 'Oluşturuluyor...' : 'Etkinlik oluştur →'}
          </button>
        </form>
  </main>
    
  )
}