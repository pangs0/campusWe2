'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, CalendarDays, Trash2 } from 'lucide-react'

const EVENT_TYPES = ['konferans', 'hackathon', 'workshop', 'staj_fuari', 'networking', 'diger']

const typeColors: Record<string, string> = {
  konferans: 'bg-purple-50 text-purple-700 border-purple-200',
  hackathon: 'bg-blue-50 text-blue-700 border-blue-200',
  workshop: 'bg-green-50 text-green-700 border-green-200',
  staj_fuari: 'bg-amber-50 text-amber-700 border-amber-200',
  networking: 'bg-pink-50 text-pink-700 border-pink-200',
  diger: 'bg-neutral-50 text-neutral-600 border-neutral-200',
}

export default function CompanyEventsClient({ userId, initialEvents }: { userId: string; initialEvents: any[] }) {
  const supabase = createClient()
  const [events, setEvents] = useState(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', event_type: 'konferans', event_date: '', location: '', is_online: false, registration_url: '' })

  async function createEvent(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('company_events').insert({ ...form, company_id: userId }).select().single()
    if (error) {
      alert('Hata: ' + error.message + ' | Code: ' + error.code)
      setLoading(false)
      return
    }
    if (data) setEvents(prev => [data, ...prev])
    setShowForm(false)
    setForm({ title: '', description: '', event_type: 'konferans', event_date: '', location: '', is_online: false, registration_url: '' })
    setLoading(false)
  }

  async function deleteEvent(id: string) {
    await supabase.from('company_events').delete().eq('id', id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">ETKİNLİKLER</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Etkinliklerini yönet.</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Etkinlik oluştur
        </button>
      </div>

      {showForm && (
        <form onSubmit={createEvent} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-ink">Yeni etkinlik</p>
            <button type="button" onClick={() => setShowForm(false)}><X size={15} className="text-ink/40" /></button>
          </div>
          <div>
            <label className="label">Etkinlik adı</label>
            <input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Açıklama</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Tür</label>
              <select className="input" value={form.event_type} onChange={e => setForm(p => ({ ...p, event_type: e.target.value }))}>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tarih</label>
              <input type="datetime-local" className="input" value={form.event_date} onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))} />
            </div>
            <div>
              <label className="label">Konum</label>
              <input className="input" placeholder="İstanbul / Online" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kayıt linki</label>
              <input className="input" placeholder="https://..." value={form.registration_url} onChange={e => setForm(p => ({ ...p, registration_url: e.target.value }))} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="is_online" checked={form.is_online} onChange={e => setForm(p => ({ ...p, is_online: e.target.checked }))} className="accent-brand w-4 h-4" />
              <label htmlFor="is_online" className="text-sm text-ink/60">Online etkinlik</label>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Oluşturuluyor...' : 'Etkinlik oluştur →'}
          </button>
        </form>
      )}

      {events.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {events.map(ev => (
            <div key={ev.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <p className="font-serif font-bold text-ink">{ev.title}</p>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className={`mono text-xs border rounded px-1.5 py-0.5 ${typeColors[ev.event_type] || typeColors.diger}`}>{ev.event_type}</span>
                  <button onClick={() => deleteEvent(ev.id)} className="text-ink/20 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              {ev.description && <p className="text-sm text-ink/55 mb-2 line-clamp-2">{ev.description}</p>}
              <div className="flex items-center gap-3 text-xs text-ink/35">
                {ev.event_date && (
                  <span className="flex items-center gap-1">
                    <CalendarDays size={11} />
                    {new Date(ev.event_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {ev.location && <span>📍 {ev.location}</span>}
                {ev.is_online && <span className="text-brand">🌐 Online</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
          <CalendarDays size={36} className="text-brand/25 mx-auto mb-3" />
          <p className="font-serif text-xl font-bold text-ink mb-1">Henüz etkinlik yok.</p>
          <p className="text-sm text-ink/45">Konferans, hackathon veya workshop oluştur.</p>
        </div>
      )}
    </div>
  )
}