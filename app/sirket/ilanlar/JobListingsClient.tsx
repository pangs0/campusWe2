'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, Briefcase, Trash2, Users, ToggleLeft, ToggleRight } from 'lucide-react'

const JOB_TYPES = ['staj', 'yarı zamanlı', 'tam zamanlı']
const COMMON_SKILLS = ['React', 'Python', 'UI/UX', 'Pazarlama', 'İş Geliştirme', 'Finans', 'ML', 'iOS', 'Android', 'Node.js']

export default function JobListingsClient({ userId, initialJobs }: { userId: string; initialJobs: any[] }) {
  const supabase = createClient()
  const [jobs, setJobs] = useState(initialJobs)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', type: 'staj', skills_needed: [] as string[], location: '', is_remote: true })

  function toggleSkill(skill: string) {
    setForm(prev => ({
      ...prev,
      skills_needed: prev.skills_needed.includes(skill)
        ? prev.skills_needed.filter(s => s !== skill)
        : prev.skills_needed.concat(skill)
    }))
  }

  async function createJob(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('job_listings').insert({ ...form, company_id: userId, is_active: true }).select().single()
    if (error) {
      alert('Hata: ' + error.message + ' | Code: ' + error.code)
      setLoading(false)
      return
    }
    if (data) setJobs(prev => [{ ...data, applications: [] }, ...prev])
    setShowForm(false)
    setForm({ title: '', description: '', type: 'staj', skills_needed: [], location: '', is_remote: true })
    setLoading(false)
  }

  async function toggleActive(id: string, isActive: boolean) {
    await supabase.from('job_listings').update({ is_active: !isActive }).eq('id', id)
    setJobs(prev => prev.map(j => j.id === id ? { ...j, is_active: !isActive } : j))
  }

  async function deleteJob(id: string) {
    await supabase.from('job_listings').delete().eq('id', id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">İŞ İLANLARI</p>
          <h1 className="font-serif text-3xl font-bold text-ink">İlanlarını yönet.</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> İlan oluştur
        </button>
      </div>

      {showForm && (
        <form onSubmit={createJob} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-ink">Yeni ilan</p>
            <button type="button" onClick={() => setShowForm(false)}><X size={15} className="text-ink/40" /></button>
          </div>
          <div>
            <label className="label">Pozisyon adı</label>
            <input className="input" placeholder="Frontend Developer Stajyeri" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Açıklama</label>
            <textarea className="input resize-none" rows={3} placeholder="Pozisyon hakkında detaylar..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Tür</label>
              <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Konum</label>
              <input className="input" placeholder="İstanbul" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="remote" checked={form.is_remote} onChange={e => setForm(p => ({ ...p, is_remote: e.target.checked }))} className="accent-brand w-4 h-4" />
              <label htmlFor="remote" className="text-sm text-ink/60">Uzaktan</label>
            </div>
          </div>
          <div>
            <label className="label">Aranan yetenekler</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {COMMON_SKILLS.map(s => (
                <button key={s} type="button" onClick={() => toggleSkill(s)}
                  className={`mono text-xs border rounded px-2 py-1 transition-colors ${form.skills_needed.includes(s) ? 'bg-brand text-white border-brand' : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/40'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Oluşturuluyor...' : 'İlanı yayınla →'}
          </button>
        </form>
      )}

      {jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className={`card transition-colors ${!job.is_active ? 'opacity-60' : 'hover:border-brand/30'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-ink">{job.title}</p>
                    <span className={`mono text-xs border rounded px-1.5 py-0.5 ${job.type === 'staj' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                      {job.type}
                    </span>
                    {!job.is_active && <span className="mono text-xs bg-neutral-100 text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">Pasif</span>}
                  </div>
                  {job.description && <p className="text-sm text-ink/50 line-clamp-1 mb-2">{job.description}</p>}
                  <div className="flex items-center gap-3 flex-wrap">
                    {job.skills_needed?.map((s: string, i: number) => (
                      <span key={i} className="mono text-xs bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5 text-ink/45">{s}</span>
                    ))}
                    {job.is_remote && <span className="mono text-xs text-brand">Uzaktan</span>}
                    {job.location && <span className="mono text-xs text-ink/35">📍 {job.location}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-ink/40">
                    <Users size={12} />
                    <span>{job.applications?.length || 0} başvuru</span>
                  </div>
                  <button onClick={() => toggleActive(job.id, job.is_active)} className="text-ink/30 hover:text-brand transition-colors">
                    {job.is_active ? <ToggleRight size={18} className="text-brand" /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={() => deleteJob(job.id)} className="text-ink/20 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
          <Briefcase size={36} className="text-brand/25 mx-auto mb-3" />
          <p className="font-serif text-xl font-bold text-ink mb-1">Henüz ilan yok.</p>
          <p className="text-sm text-ink/45">Staj, yarı zamanlı veya tam zamanlı ilan oluştur.</p>
        </div>
      )}
    </div>
  )
}