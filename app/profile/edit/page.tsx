'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/layout/AppLayout'
import { ArrowLeft, X, Plus } from 'lucide-react'

const SKILL_CATEGORIES = ['Teknik', 'Tasarım', 'Pazarlama', 'İş Geliştirme', 'Finans', 'Hukuk', 'Diğer']

export default function ProfileEditPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    university: '',
    department: '',
    bio: '',
  })
  const [skills, setSkills] = useState<any[]>([])
  const [newSkill, setNewSkill] = useState({ skill_name: '', category: 'Teknik' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      if (profile) setForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        university: profile.university || '',
        department: profile.department || '',
        bio: profile.bio || '',
      })

      const { data: skillData } = await supabase
        .from('user_skills').select('*').eq('user_id', user.id)
      if (skillData) setSkills(skillData)
    }
    load()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('profiles').update(form).eq('id', user.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function addSkill() {
    if (!newSkill.skill_name.trim()) return
    const { data } = await supabase.from('user_skills').insert({
      user_id: user.id,
      skill_name: newSkill.skill_name.trim(),
      category: newSkill.category,
    }).select().single()
    if (data) setSkills(prev => [...prev, data])
    setNewSkill({ skill_name: '', category: 'Teknik' })
  }

  async function removeSkill(id: string) {
    await supabase.from('user_skills').delete().eq('id', id)
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  return (
    <AppLayout user={null}>
      
      <main className="px-8 py-10 max-w-2xl">
        <Link href="/profile" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} />Profile dön
        </Link>

        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">PROFİL</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Bilgilerini güncelle.</h1>
        </div>

        <form onSubmit={handleSave} className="card space-y-5 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ad Soyad</label>
              <input name="full_name" type="text" className="input" value={form.full_name} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Kullanıcı adı</label>
              <input name="username" type="text" className="input" value={form.username} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Üniversite</label>
              <input name="university" type="text" className="input" placeholder="ODTÜ" value={form.university} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Bölüm</label>
              <input name="department" type="text" className="input" placeholder="Bilgisayar Müh." value={form.department} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="label">Hakkında</label>
            <textarea
              name="bio"
              className="input resize-none"
              placeholder="Kendini kısaca tanıt..."
              value={form.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {saved ? '✓ Kaydedildi' : loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>

        {/* Yetenekler */}
        <div className="card space-y-4">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">YETENEKLERİM</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.length > 0 ? skills.map(skill => (
                <div key={skill.id} className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 rounded px-2.5 py-1">
                  <span className="mono text-xs text-ink/70">{skill.skill_name}</span>
                  <button onClick={() => removeSkill(skill.id)} className="text-ink/30 hover:text-red-500 transition-colors">
                    <X size={11} />
                  </button>
                </div>
              )) : (
                <p className="text-xs text-ink/35">Henüz yetenek eklenmedi.</p>
              )}
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">YENİ YETENEK EKLE</p>
            <div className="flex gap-2">
              <select
                className="input w-36"
                value={newSkill.category}
                onChange={e => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
              >
                {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="text"
                className="input flex-1"
                placeholder="React, Figma, SEO..."
                value={newSkill.skill_name}
                onChange={e => setNewSkill(prev => ({ ...prev, skill_name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button onClick={addSkill} type="button" className="btn-primary px-3 flex items-center gap-1">
                <Plus size={14} />
              </button>
            </div>
            <p className="text-xs text-ink/30 mt-2">Enter'a basarak da ekleyebilirsin.</p>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}