'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Clock, Plus, Calendar, Users, CheckCircle, XCircle, Video } from 'lucide-react'

type Props = {
  userId: string
  sessions: any[]
  isInvestor?: boolean
}

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
const TOPICS = ['Ürün geri bildirimi', 'Yatırım görüşmesi', 'Pazar stratejisi', 'Teknik danışmanlık', 'Büyüme stratejisi', 'Genel mentorluk']

export default function OfficeHoursClient({ userId, sessions, isInvestor }: Props) {
  const supabase = createClient()
  const [list, setList] = useState<any[]>(sessions)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    date: '',
    time_slot: '10:00',
    topic: 'Genel mentorluk',
    duration_minutes: 30,
    notes: '',
    meeting_link: '',
  })

  async function createSession() {
    setLoading(true)
    const { data } = await supabase.from('office_hours').insert({
      investor_id: userId,
      date: form.date,
      time_slot: form.time_slot,
      topic: form.topic,
      duration_minutes: form.duration_minutes,
      notes: form.notes,
      meeting_link: form.meeting_link,
      status: 'open',
    }).select('*, profiles(id, full_name, avatar_url, university, city)').single()

    if (data) {
      setList(prev => [data, ...prev])
      setShowForm(false)
      setForm({ date: '', time_slot: '10:00', topic: 'Genel mentorluk', duration_minutes: 30, notes: '', meeting_link: '' })
    }
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('office_hours').update({ status }).eq('id', id)
    setList(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const open = list.filter(s => s.status === 'open')
  const booked = list.filter(s => s.status === 'booked')
  const completed = list.filter(s => s.status === 'completed')

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">YATIRIMCI PANELİ</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Office Hours</h1>
          <p className="text-sm text-ink/45 mt-1">Girişimcilerle birebir görüşme saatleri ayarla.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} />
          Yeni saat ekle
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { n: open.length, l: 'Açık slot', icon: Clock, color: 'text-brand' },
          { n: booked.length, l: 'Rezerve', icon: Calendar, color: 'text-amber-600' },
          { n: completed.length, l: 'Tamamlanan', icon: CheckCircle, color: 'text-green-600' },
        ].map((s, i) => (
          <div key={i} className="card flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
              <s.icon size={16} className={s.color} />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-ink">{s.n}</p>
              <p className="mono text-xs text-ink/35">{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni slot formu */}
      {showForm && (
        <div className="card mb-6" style={{ border: '1.5px solid rgba(196,80,10,.15)' }}>
          <p className="mono text-xs text-ink/35 tracking-widest mb-4">YENİ OFFICE HOURS SLOTU</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mono text-xs text-ink/40 block mb-1">TARİH</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand/40"
                min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="mono text-xs text-ink/40 block mb-1">SAAT</label>
              <select value={form.time_slot} onChange={e => setForm(p => ({ ...p, time_slot: e.target.value }))}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand/40">
                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mono text-xs text-ink/40 block mb-1">KONU</label>
              <select value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand/40">
                {TOPICS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mono text-xs text-ink/40 block mb-1">SÜRE (DAKİKA)</label>
              <select value={form.duration_minutes} onChange={e => setForm(p => ({ ...p, duration_minutes: +e.target.value }))}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand/40">
                {[15, 30, 45, 60].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="mono text-xs text-ink/40 block mb-1">TOPLANTI LİNKİ (isteğe bağlı)</label>
            <input type="url" placeholder="https://meet.google.com/..." value={form.meeting_link}
              onChange={e => setForm(p => ({ ...p, meeting_link: e.target.value }))}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand/40" />
          </div>
          <div className="mb-4">
            <label className="mono text-xs text-ink/40 block mb-1">NOT (isteğe bağlı)</label>
            <textarea placeholder="Görüşme için beklentiler, hazırlık notları..." value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand/40 resize-none" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm px-4 py-2">İptal</button>
            <button onClick={createSession} disabled={loading || !form.date}
              className="btn-primary text-sm px-6 py-2 disabled:opacity-50">
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </div>
      )}

      {/* Açık slotlar */}
      {open.length > 0 && (
        <div className="mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-3">AÇIK SLOTLAR</p>
          <div className="space-y-2">
            {open.map(s => (
              <SessionCard key={s.id} session={s} onUpdate={updateStatus} />
            ))}
          </div>
        </div>
      )}

      {/* Rezerve slotlar */}
      {booked.length > 0 && (
        <div className="mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-3">REZERVE</p>
          <div className="space-y-2">
            {booked.map(s => (
              <SessionCard key={s.id} session={s} onUpdate={updateStatus} showApplicant />
            ))}
          </div>
        </div>
      )}

      {/* Tamamlanan */}
      {completed.length > 0 && (
        <div className="mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-3">TAMAMLANAN</p>
          <div className="space-y-2">
            {completed.map(s => (
              <SessionCard key={s.id} session={s} onUpdate={updateStatus} showApplicant />
            ))}
          </div>
        </div>
      )}

      {list.length === 0 && (
        <div className="card text-center py-16" style={{ border: '1.5px dashed rgba(196,80,10,.15)' }}>
          <Clock size={32} className="text-brand/30 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-ink mb-2">Henüz slot yok</h2>
          <p className="text-sm text-ink/40 mb-5">Girişimcilerle görüşmek için yeni bir office hours slotu ekle.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-6 py-2 inline-flex items-center gap-2">
            <Plus size={14} /> Slot ekle
          </button>
        </div>
      )}
    </div>
  )
}

function SessionCard({ session: s, onUpdate, showApplicant }: {
  session: any
  onUpdate: (id: string, status: string) => Promise<void>
  showApplicant?: boolean
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className="flex-shrink-0 text-center" style={{ minWidth: 64 }}>
        <p className="font-serif text-lg font-bold text-ink">{s.time_slot}</p>
        <p className="mono text-xs text-ink/35">{s.date ? new Date(s.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '—'}</p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-ink">{s.topic}</p>
          <span className={`mono text-xs px-2 py-0.5 rounded-full ${
            s.status === 'open' ? 'bg-brand/8 text-brand' :
            s.status === 'booked' ? 'bg-amber-50 text-amber-600' :
            'bg-green-50 text-green-600'
          }`}>
            {s.status === 'open' ? 'Açık' : s.status === 'booked' ? 'Rezerve' : 'Tamamlandı'}
          </span>
        </div>
        <p className="mono text-xs text-ink/35">{s.duration_minutes} dakika</p>
        {showApplicant && s.profiles && (
          <p className="text-xs text-ink/45 mt-1">👤 {s.profiles.full_name} · {s.profiles.university || s.profiles.city || 'Türkiye'}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {s.meeting_link && (
          <a href={s.meeting_link} target="_blank" rel="noopener noreferrer"
            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
            <Video size={12} /> Katıl
          </a>
        )}
        {s.status === 'booked' && (
          <button onClick={() => onUpdate(s.id, 'completed')}
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
            <CheckCircle size={12} /> Tamamla
          </button>
        )}
        {s.status === 'open' && (
          <button onClick={() => onUpdate(s.id, 'cancelled')}
            className="text-xs text-ink/30 hover:text-red-500 transition-colors px-2 py-1">
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  )
}