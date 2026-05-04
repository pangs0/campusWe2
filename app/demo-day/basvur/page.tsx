'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/layout/AppLayout'
import { ArrowLeft } from 'lucide-react'

export default function DemoDayBasvurPage() {
  const router = useRouter()
  const supabase = createClient()
  const [startups, setStartups] = useState<any[]>([])
  const [form, setForm] = useState({
    startup_id: '',
    pitch_summary: '',
    problem: '',
    solution: '',
    traction: '',
    ask: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('startups').select('*').eq('founder_id', user.id)
      if (data) setStartups(data)
    }
    load()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: insertError } = await supabase.from('demo_day_applications').insert({
      applicant_id: user.id,
      startup_id: form.startup_id,
      pitch_summary: form.pitch_summary,
      problem: form.problem,
      solution: form.solution,
      traction: form.traction,
      ask: form.ask,
      status: 'beklemede',
    })

    if (insertError) {
      setError('Bir hata oluştu. Daha önce başvurmuş olabilirsin.')
      setLoading(false)
      return
    }

    router.push('/demo-day')
  }

  return (
    <AppLayout user={null}>
      
      <main className="px-8 py-10 max-w-2xl">
        <Link href="/demo-day" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} />
          Demo Day'e dön
        </Link>

        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">DEMO DAY</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Başvurunu yap.</h1>
          <p className="text-sm text-ink/45 mt-2">Yatırımcılara pitch yapma fırsatı için başvur.</p>
        </div>

        {startups.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-ink/45 mb-4">Önce bir startup oluşturman lazım.</p>
            <Link href="/startup/new" className="btn-primary inline-flex text-xs">
              Startup oluştur →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-5">
            <div>
              <label className="label">Hangi startup için başvuruyorsun?</label>
              <select name="startup_id" className="input" value={form.startup_id} onChange={handleChange} required>
                <option value="">Seç</option>
                {startups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Pitch özeti (2-3 cümle)</label>
              <textarea name="pitch_summary" className="input resize-none" placeholder="Startup'ını tek paragrafta anlat." value={form.pitch_summary} onChange={handleChange} rows={3} required />
            </div>

            <div>
              <label className="label">Hangi problemi çözüyorsunuz?</label>
              <textarea name="problem" className="input resize-none" placeholder="Problem ne?" value={form.problem} onChange={handleChange} rows={2} required />
            </div>

            <div>
              <label className="label">Çözümünüz nedir?</label>
              <textarea name="solution" className="input resize-none" placeholder="Nasıl çözüyorsunuz?" value={form.solution} onChange={handleChange} rows={2} required />
            </div>

            <div>
              <label className="label">Traction — şimdiye kadar ne yaptınız?</label>
              <textarea name="traction" className="input resize-none" placeholder="Kullanıcı sayısı, gelir, MVP durumu..." value={form.traction} onChange={handleChange} rows={2} />
            </div>

            <div>
              <label className="label">Ne istiyorsunuz?</label>
              <input name="ask" type="text" className="input" placeholder="500K TL seed yatırım, mentor, müşteri bağlantısı..." value={form.ask} onChange={handleChange} />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? 'Gönderiliyor...' : 'Başvuruyu gönder →'}
            </button>
          </form>
        )}
      </main>
    </AppLayout>
  )
}