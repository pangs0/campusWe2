'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, ExternalLink, Trash2, Heart } from 'lucide-react'

const SECTORS = ['EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'SaaS', 'Yapay Zeka', 'E-ticaret', 'Diğer']
const STAGES = ['fikir', 'mvp', 'traction', 'büyüme', 'exited']

export default function PortfolioClient({ userId, initialPortfolio }: { userId: string; initialPortfolio: any[] }) {
  const supabase = createClient()
  const [portfolio, setPortfolio] = useState(initialPortfolio)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ company_name: '', sector: '', stage: '', year: new Date().getFullYear(), description: '', website: '' })

  async function addPortfolio(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data } = await supabase.from('investor_portfolio').insert({ ...form, investor_id: userId }).select().single()
    if (data) setPortfolio(prev => [data, ...prev])
    setShowForm(false)
    setForm({ company_name: '', sector: '', stage: '', year: new Date().getFullYear(), description: '', website: '' })
    setLoading(false)
  }

  async function deletePortfolio(id: string) {
    await supabase.from('investor_portfolio').delete().eq('id', id)
    setPortfolio(prev => prev.filter(p => p.id !== id))
  }

  const stageColors: Record<string, string> = {
    fikir: 'bg-amber-50 text-amber-700 border-amber-200',
    mvp: 'bg-blue-50 text-blue-700 border-blue-200',
    traction: 'bg-purple-50 text-purple-700 border-purple-200',
    büyüme: 'bg-green-50 text-green-700 border-green-200',
    exited: 'bg-neutral-800 text-white border-neutral-800',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">PORTFÖY</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Portföyüm.</h1>
          <p className="text-sm text-ink/45 mt-1">{portfolio.length} yatırım</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Yatırım ekle
        </button>
      </div>

      {showForm && (
        <form onSubmit={addPortfolio} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-ink">Yeni yatırım</p>
            <button type="button" onClick={() => setShowForm(false)}><X size={15} className="text-ink/40" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Şirket adı</label>
              <input className="input" placeholder="Startup adı" value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Website</label>
              <input className="input" placeholder="https://..." value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Sektör</label>
              <select className="input" value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))}>
                <option value="">Seç</option>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Aşama</label>
              <select className="input" value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>
                <option value="">Seç</option>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Yıl</label>
              <input type="number" className="input" value={form.year} onChange={e => setForm(p => ({ ...p, year: parseInt(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="label">Açıklama</label>
            <textarea className="input resize-none" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Ekleniyor...' : 'Portföye ekle →'}
          </button>
        </form>
      )}

      {portfolio.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {portfolio.map(p => (
            <div key={p.id} className="card hover:border-brand/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <p className="font-serif font-bold text-ink">{p.company_name}</p>
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-ink/25 hover:text-brand transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button onClick={() => deletePortfolio(p.id)} className="text-ink/20 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {p.stage && <span className={`mono text-xs border rounded px-1.5 py-0.5 ${stageColors[p.stage] || ''}`}>{p.stage}</span>}
                {p.sector && <span className="mono text-xs text-ink/35">{p.sector}</span>}
                {p.year && <span className="mono text-xs text-ink/25">{p.year}</span>}
              </div>
              {p.description && <p className="text-xs text-ink/50 leading-relaxed">{p.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
          <Heart size={36} className="text-brand/25 mx-auto mb-3" />
          <p className="font-serif text-xl font-bold text-ink mb-1">Portföy boş.</p>
          <p className="text-sm text-ink/45">Yatırım yaptığın şirketleri ekle, topluluğa göster.</p>
        </div>
      )}
    </div>
  )
}