'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/layout/Navbar'
import { ArrowLeft } from 'lucide-react'

const STAGES = ['fikir', 'mvp', 'traction', 'büyüme']
const SECTORS = [
  'EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'CleanTech',
  'E-ticaret', 'SaaS', 'Yapay Zeka', 'Oyun', 'Diğer'
]

export default function NewStartupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    name: '',
    description: '',
    stage: 'fikir',
    sector: '',
    is_public: true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const slug = slugify(form.name) + '-' + Math.random().toString(36).slice(2, 6)

    const { data, error: insertError } = await supabase
      .from('startups')
      .insert({
        founder_id: user.id,
        name: form.name,
        slug,
        description: form.description,
        stage: form.stage,
        sector: form.sector,
        is_public: form.is_public,
      })
      .select()
      .single()

    if (insertError) {
      setError('Bir hata oluştu. Tekrar dene.')
      setLoading(false)
      return
    }

    await supabase.from('startup_members').insert({
      startup_id: data.id,
      user_id: user.id,
      role: 'Kurucu',
    })

    router.push(`/startup/${data.slug}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Dashboard'a dön
        </Link>

        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">YENİ STARTUP</p>
          <h1 className="font-serif text-3xl font-bold text-ink">
            Fikrinin adını koy.
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="label">Startup adı</label>
            <input
              name="name"
              type="text"
              className="input"
              placeholder="EcoTrack, MediSync..."
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Ne yapıyorsunuz?</label>
            <textarea
              name="description"
              className="input min-h-[100px] resize-none"
              placeholder="Tek paragrafla anlat. Yatırımcıya anlatır gibi."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Aşama</label>
              <select
                name="stage"
                className="input"
                value={form.stage}
                onChange={handleChange}
              >
                {STAGES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Sektör</label>
              <select
                name="sector"
                className="input"
                value={form.sector}
                onChange={handleChange}
              >
                <option value="">Seç</option>
                {SECTORS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              name="is_public"
              id="is_public"
              checked={form.is_public}
              onChange={handleChange}
              className="accent-brand w-4 h-4"
            />
            <label htmlFor="is_public" className="text-sm text-ink/60 cursor-pointer">
              Herkese açık — topluluk görebilir
            </label>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {loading ? 'Oluşturuluyor...' : 'Startup oluştur →'}
          </button>
        </form>
      </main>
    </div>
  )
}
