'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, X } from 'lucide-react'

const UPDATE_TYPES = ['güncelleme', 'milestone', 'sorun', 'başarı']

export default function AddUpdateForm({ startupId }: { startupId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    update_type: 'güncelleme',
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('startup_updates').insert({
      startup_id: startupId,
      user_id: user.id,
      title: form.title,
      content: form.content,
      update_type: form.update_type,
    })

    setForm({ title: '', content: '', update_type: 'güncelleme' })
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary w-full flex items-center justify-center gap-1.5 text-sm py-2.5"
      >
        <Plus size={14} />
        Güncelleme paylaş
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-ink text-sm">Yeni güncelleme</h3>
        <button type="button" onClick={() => setOpen(false)}>
          <X size={16} className="text-ink/40" />
        </button>
      </div>

      <div>
        <label className="label">Tür</label>
        <select name="update_type" className="input" value={form.update_type} onChange={handleChange}>
          {UPDATE_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Başlık</label>
        <input
          name="title"
          type="text"
          className="input"
          placeholder="Bu haftaki gelişme..."
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="label">Detay</label>
        <textarea
          name="content"
          className="input min-h-[80px] resize-none"
          placeholder="Ne oldu, ne öğrendin, ne yapacaksın?"
          value={form.content}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 text-sm">
        {loading ? 'Paylaşılıyor...' : 'Paylaş'}
      </button>
    </form>
  )
}
