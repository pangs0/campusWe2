'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/layout/AppLayout'
import { ArrowLeft, CheckCircle, Circle, AlertCircle, Users, Eye, Lightbulb, TrendingUp } from 'lucide-react'

const STAGES = ['fikir', 'mvp', 'traction', 'büyüme']
const SECTORS = ['EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'CleanTech', 'E-ticaret', 'SaaS', 'Yapay Zeka', 'Oyun', 'Diğer']

const stageColors: Record<string, string> = {
  fikir: 'bg-amber-50 text-amber-700 border-amber-200',
  mvp: 'bg-blue-50 text-blue-700 border-blue-200',
  traction: 'bg-purple-50 text-purple-700 border-purple-200',
  büyüme: 'bg-green-50 text-green-700 border-green-200',
}

export default function EditStartupPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '', stage: 'fikir', sector: '', is_public: true })
  const [startupId, setStartupId] = useState('')
  const [members, setMembers] = useState<any[]>([])
  const [updates, setUpdates] = useState<any[]>([])
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
      if (!startup || startup.founder_id !== user.id) { router.push('/dashboard'); return }

      setStartupId(startup.id)
      setForm({
        name: startup.name || '',
        description: startup.description || '',
        stage: startup.stage || 'fikir',
        sector: startup.sector || '',
        is_public: startup.is_public ?? true,
      })

      const { data: memberData } = await supabase
        .from('startup_members').select('*, profile:profiles(full_name, avatar_url, user_skills(skill_name))')
        .eq('startup_id', startup.id)
      setMembers(memberData || [])

      const { data: updateData } = await supabase
        .from('startup_updates').select('id').eq('startup_id', startup.id)
      setUpdates(updateData || [])

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

  // Sağlık skoru hesapla
  const healthChecks = [
    { label: 'Startup adı', done: form.name.length > 2 },
    { label: 'Açıklama yazıldı', done: form.description.length > 20 },
    { label: 'Sektör seçildi', done: !!form.sector },
    { label: 'Ekip üyesi var', done: members.length > 1 },
    { label: 'Güncelleme paylaşıldı', done: updates.length > 0 },
    { label: 'Herkese açık', done: form.is_public },
  ]
  const healthScore = Math.round((healthChecks.filter(c => c.done).length / healthChecks.length) * 100)

  // İpuçları
  const tips: string[] = []
  if (form.description.length < 50) tips.push('Açıklamana problem ve çözüm ekle. Yatırımcılar için 2-3 cümle yaz.')
  if (!form.sector) tips.push('Sektör seçmek seni doğru kullanıcılara ulaştırır.')
  if (members.length < 2) tips.push('Co-founder bulmak startup\'ını güçlendirir. Eşleştirme sayfasını dene.')
  if (updates.length === 0) tips.push('İlk güncellemeyi paylaş. Aktif startup\'lar daha fazla ilgi çeker.')
  if (!form.is_public) tips.push('Startup\'ını herkese açarak daha fazla kişiye ulaş.')

  const stageIndex = STAGES.indexOf(form.stage)
  const stageProgress = Math.round(((stageIndex + 1) / STAGES.length) * 100)

  if (fetching) return (
    <AppLayout user={user}>
      <main className="px-8 py-10">
        <div className="animate-pulse grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="h-8 bg-neutral-200 rounded w-48" />
            <div className="h-64 bg-neutral-100 rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-neutral-100 rounded" />
            <div className="h-48 bg-neutral-100 rounded" />
          </div>
        </div>
      </main>
    </AppLayout>
  )

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10">
        <Link href={`/startup/${params.slug}`} className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-6 transition-colors">
          <ArrowLeft size={14} />
          Startup sayfasına dön
        </Link>

        <div className="mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">STARTUP DÜZENLE</p>
          <h1 className="font-serif text-3xl font-bold text-ink">{form.name}</h1>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Sol — Form */}
          <div className="col-span-2">
            <form onSubmit={handleSubmit} className="card space-y-5">
              <div>
                <label className="label">Startup adı</label>
                <input name="name" type="text" className="input" value={form.name} onChange={handleChange} required />
              </div>

              <div>
                <label className="label">Açıklama</label>
                <textarea name="description" className="input resize-none" rows={5}
                  placeholder="Hangi problemi çözüyorsunuz? Çözümünüz nedir? Hedef kitleniz kim?" value={form.description} onChange={handleChange} />
                <p className="mono text-xs text-ink/30 mt-1">{form.description.length} karakter</p>
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
                  Herkese açık — topluluk görebilir
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
          </div>

          {/* Sağ sidebar */}
          <div className="space-y-4">

            {/* Önizleme */}
            <div className="card">
              <div className="flex items-center gap-1.5 mb-3">
                <Eye size={13} className="text-ink/40" />
                <p className="mono text-xs text-ink/35 tracking-widest">ÖNİZLEME</p>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-serif font-bold text-ink text-sm">{form.name || 'Startup adı'}</p>
                  <span className={`mono text-xs border rounded px-1.5 py-0.5 ${stageColors[form.stage]}`}>
                    {form.stage}
                  </span>
                </div>
                <p className="text-xs text-ink/55 leading-relaxed line-clamp-3">
                  {form.description || 'Açıklama henüz girilmedi.'}
                </p>
                {form.sector && (
                  <span className="mono text-xs text-ink/35 mt-2 block">{form.sector}</span>
                )}
                <div className="h-1.5 bg-neutral-200 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-brand rounded-full" style={{ width: `${stageProgress}%` }} />
                </div>
                <p className="mono text-xs text-ink/30 mt-1">{stageProgress}% ilerleme</p>
              </div>
            </div>

            {/* Sağlık skoru */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-ink/40" />
                  <p className="mono text-xs text-ink/35 tracking-widest">SAĞLIK SKORU</p>
                </div>
                <span className={`mono text-sm font-bold ${healthScore >= 80 ? 'text-green-600' : healthScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                  {healthScore}%
                </span>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${healthScore >= 80 ? 'bg-green-500' : healthScore >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                  style={{ width: `${healthScore}%` }}
                />
              </div>
              <div className="space-y-1.5">
                {healthChecks.map(c => (
                  <div key={c.label} className="flex items-center gap-2">
                    {c.done
                      ? <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                      : <Circle size={12} className="text-neutral-300 flex-shrink-0" />
                    }
                    <span className={`text-xs ${c.done ? 'text-ink/50 line-through' : 'text-ink/70'}`}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* İpuçları */}
            {tips.length > 0 && (
              <div className="card border-amber-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <Lightbulb size={13} className="text-amber-500" />
                  <p className="mono text-xs text-amber-600 tracking-widest">İPUÇLARI</p>
                </div>
                <div className="space-y-2.5">
                  {tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertCircle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-ink/60 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ekip durumu */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-ink/40" />
                  <p className="mono text-xs text-ink/35 tracking-widest">EKİP</p>
                </div>
                <Link href="/eslestirme" className="text-xs text-brand hover:underline">+ Üye bul</Link>
              </div>
              {members.length > 0 ? (
                <div className="space-y-2">
                  {members.map((m: any) => (
                    <div key={m.id} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-xs">
                        {m.profile?.avatar_url ? <img src={m.profile.avatar_url} alt="" className="w-full h-full object-cover" /> : m.profile?.full_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-ink truncate">{m.profile?.full_name}</p>
                        <p className="mono text-xs text-ink/35">{m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-xs text-ink/35 mb-2">Henüz ekip yok.</p>
                  <Link href="/eslestirme" className="text-xs text-brand hover:underline">Co-founder bul →</Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </AppLayout>
  )
}