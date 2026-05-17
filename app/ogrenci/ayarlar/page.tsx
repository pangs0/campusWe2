'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import OgrenciLayout from '../OgrenciLayout'

export default function AyarlarPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({ full_name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/register/ogrenci'); return }
      setUser(user)
      setForm(p => ({ ...p, email: user.email || '' }))
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data?.role !== 'student') { router.push('/dashboard'); return }
        setProfile(data)
        setForm(p => ({ ...p, full_name: data.full_name || '' }))
      })
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('profiles').update({ full_name: form.full_name }).eq('id', user.id)
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!profile) return null

  return (
    <OgrenciLayout user={user} profile={profile}>
      <div style={{ padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 2, marginBottom: 4 }}>ÖĞRENCİ PANELİ</p>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', letterSpacing: -1, margin: 0 }}>Ayarlar.</h1>
        </div>

        <div style={{ maxWidth: 480 }}>
          <form onSubmit={handleSave} style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>AD SOYAD</label>
              <input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(26,26,24,.12)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>E-POSTA</label>
              <input type="email" value={form.email} disabled
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 8, fontSize: 14, background: '#fafafa', color: 'rgba(26,26,24,.4)', boxSizing: 'border-box' }} />
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.3)', marginTop: 4 }}>E-posta değiştirilemez.</p>
            </div>
            <button type="submit" disabled={loading}
              style={{ background: '#C4500A', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {saved ? '✅ Kaydedildi!' : loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </div>
      </div>
    </OgrenciLayout>
  )
}