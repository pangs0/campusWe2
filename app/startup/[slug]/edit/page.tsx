'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/layout/AppLayout'
import { ArrowLeft } from 'lucide-react'

const STAGES = ['fikir', 'mvp', 'traction', 'büyüme']
const SECTORS = ['EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'CleanTech', 'E-ticaret', 'SaaS', 'Yapay Zeka', 'Oyun', 'Diğer']

export default function EditStartupPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '', stage: 'fikir', sector: '', is_public: true })
  const [startupId, setStartupId] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: startup } = await supabase
        .from('startups').select('*').eq('slug', params.slug).single()

      if (!startup || startup.founder_id !== user.id) {
        router.push('/dashboard'); return
      }

      setStartupId(startup.id)
      setForm({
        name: startup.name || '',
        description: startup.description || '',
        stage: startup.stage || 'fikir',
        sector: startup.sector || '',
        is_public: startup.is_public ?? true,
      })
      setFetching(false)
    }
    load()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: updateError } = await supabase
      .from('startups')
      .update({ name: form.name, description: form.description, stage: form.stage, sector: form.sector, is_public: form.is_public })
      .eq('id', startupId)

    if (updateError) { setError('Bir hata oluştu.'); setLoading(false); return }

    router.push(`/startup/${params.slug}`)
  }

  if (fetching) return (
    <AppLayout user={user}>
      <main className="px-8 py-10 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-48" />
          <div className="h-64 bg-neutral-100 rounded" />
        </div>
      </main>
    </AppLayout>
  )

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10 max-w-2xl">
        <Link href={`/startup/${params.slug}`} className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} />
          Startup sayfasına dön
        </Link>

        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">STARTUP DÜZENLE</p>
          <h1 className="font-serif text-3xl font-bold text-ink">{form.name}</h1>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="label">Startup adı</label>
            <input name="name" type="text" className="input" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Açıklama</label>
            <textarea name="description" className="input resize-none" rows={4}
              placeholder="Startup'ını kısaca anlat..." value={form.description} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Aşama</label>
              <select name="stage" className="input" value={form.stage} onChange={handleChange}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Sektör</label>
              <select name="sector" className="input" value={form.sector} onChange={handleChange}>
                <option value="">Seç</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_public" id="is_public" checked={form.is_public}
              onChange={handleChange} className="accent-brand w-4 h-4" />
            <label htmlFor="is_public" className="text-sm text-ink/60 cursor-pointer">
              Herkese açık
            </label>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}

          <div className="flex gap-3">
            <Link href={`/startup/${params.slug}`} className="btn-secondary flex-1 text-center text-sm py-2.5">
              İptal
            </Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-60">
              {loading ? 'Kaydediliyor...' : 'Değişiklikleri kaydet →'}
            </button>
          </div>
        </form>
      </main>
    </AppLayout>
  )
}