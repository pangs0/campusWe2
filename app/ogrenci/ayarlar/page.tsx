'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Camera, Check, Eye, EyeOff, Shield, Bell, User } from 'lucide-react'

export default function AyarlarPage() {
  const supabase = createClient()
  const router = useRouter()
  const avatarRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({ full_name: '', email: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [passSaved, setPassSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'profil' | 'guvenlik' | 'bildirimler'>('profil')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/register/ogrenci'); return }
      setUser(user)
      setForm(p => ({ ...p, email: user.email || '' }))
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data?.role !== 'student') { router.push('/dashboard'); return }
        setProfile(data)
        setForm(p => ({ ...p, full_name: data.full_name || '' }))
        setAvatarPreview(data.avatar_url || null)
      })
    })
  }, [])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    let avatar_url = profile?.avatar_url
    if (avatarFile) {
      const cleanName = avatarFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const path = `${user.id}/${Date.now()}-${cleanName}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
        avatar_url = urlData.publicUrl
      }
    }
    await supabase.from('profiles').update({ full_name: form.full_name, avatar_url }).eq('id', user.id)
    setSaved(true); setLoading(false)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) { setError('Şifreler eşleşmiyor.'); return }
    if (passwords.new.length < 8) { setError('Şifre en az 8 karakter olmalı.'); return }
    setPassLoading(true); setError('')
    const { error } = await supabase.auth.updateUser({ password: passwords.new })
    if (error) { setError(error.message); setPassLoading(false); return }
    setPassSaved(true); setPassLoading(false)
    setPasswords({ current: '', new: '', confirm: '' })
    setTimeout(() => setPassSaved(false), 2500)
  }

  if (!profile) return null

  const TABS = [
    { key: 'profil', label: 'Profil', icon: User },
    { key: 'guvenlik', label: 'Güvenlik', icon: Shield },
    { key: 'bildirimler', label: 'Bildirimler', icon: Bell },
  ]

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 2, marginBottom: 4 }}>ÖĞRENCİ PANELİ</p>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', letterSpacing: -1, margin: 0 }}>Ayarlar.</h1>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400, background: activeTab === tab.key ? '#1a1a18' : 'transparent', color: activeTab === tab.key ? 'white' : 'rgba(26,26,24,.5)', transition: 'all .15s' }}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 520 }}>

        {/* PROFİL */}
        {activeTab === 'profil' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Avatar */}
            <div style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 14, padding: 24 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, marginBottom: 16 }}>PROFİL FOTOĞRAFI</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => avatarRef.current?.click()}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: 'Georgia,serif', fontWeight: 700, color: '#C4500A', fontSize: 24 }}>
                    {avatarPreview
                      ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : profile?.full_name?.[0] || '?'
                    }
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: '#C4500A', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                    <Camera size={12} color="white" />
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 4 }}>{profile?.full_name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(26,26,24,.4)' }}>Fotoğrafı değiştirmek için tıkla</p>
                </div>
                <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </div>
            </div>

            {/* Bilgiler */}
            <div style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, margin: 0 }}>KİŞİSEL BİLGİLER</p>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>AD SOYAD</label>
                <input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(26,26,24,.12)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>E-POSTA</label>
                <input type="email" value={form.email} disabled
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(26,26,24,.06)', borderRadius: 8, fontSize: 14, background: '#fafafa', color: 'rgba(26,26,24,.4)', boxSizing: 'border-box' }} />
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.3)', marginTop: 4 }}>E-posta değiştirilemez.</p>
              </div>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>ROL</label>
                <div style={{ padding: '10px 14px', border: '1.5px solid rgba(26,26,24,.06)', borderRadius: 8, background: '#fafafa', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', background: 'rgba(196,80,10,.08)', border: '1px solid rgba(196,80,10,.15)', borderRadius: 100, padding: '2px 10px' }}>ÖĞRENCİ</span>
                  <span style={{ fontSize: 12, color: 'rgba(26,26,24,.4)' }}>Sadece kurs izleme hesabı</span>
                </div>
              </div>
            </div>

            {error && <p style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

            <button type="submit" disabled={loading}
              style={{ background: saved ? '#22c55e' : '#C4500A', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .2s' }}>
              {saved ? <><Check size={16} /> Kaydedildi!</> : loading ? 'Kaydediliyor...' : 'Değişiklikleri kaydet'}
            </button>
          </form>
        )}

        {/* GÜVENLİK */}
        {activeTab === 'guvenlik' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <form onSubmit={handlePassword} style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, margin: 0 }}>ŞİFRE DEĞİŞTİR</p>
              {[
                { key: 'new', label: 'YENİ ŞİFRE' },
                { key: 'confirm', label: 'YENİ ŞİFRE (TEKRAR)' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? 'text' : 'password'} placeholder="En az 8 karakter"
                      value={passwords[f.key as keyof typeof passwords]}
                      onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', padding: '11px 40px 11px 14px', border: '1.5px solid rgba(26,26,24,.12)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(26,26,24,.3)' }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              {error && <p style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}
              <button type="submit" disabled={passLoading}
                style={{ background: passSaved ? '#22c55e' : '#1a1a18', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {passSaved ? <><Check size={15} /> Şifre güncellendi!</> : passLoading ? 'Güncelleniyor...' : 'Şifreyi güncelle'}
              </button>
            </form>

            {/* Hesap silme */}
            <div style={{ background: '#fff5f5', border: '1.5px solid rgba(220,38,38,.15)', borderRadius: 14, padding: 24 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#dc2626', letterSpacing: 1, marginBottom: 8 }}>TEHLİKELİ BÖLGE</p>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', marginBottom: 14, lineHeight: 1.6 }}>Hesabını silersen tüm kurs ilerlemen ve sertifikalar kalıcı olarak silinir.</p>
              <button style={{ background: 'white', color: '#dc2626', border: '1.5px solid rgba(220,38,38,.3)', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer' }}>
                Hesabımı sil
              </button>
            </div>
          </div>
        )}

        {/* BİLDİRİMLER */}
        {activeTab === 'bildirimler' && (
          <div style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 14, padding: 24 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, marginBottom: 20 }}>BİLDİRİM TERCİHLERİ</p>
            {[
              { label: 'Yeni ders bildirimleri', desc: 'Kayıtlı olduğun kurslara yeni ders eklenince', default: true },
              { label: 'Kurs indirimleri', desc: 'Beğendiğin kurslarda indirim olunca', default: true },
              { label: 'Sertifika hatırlatıcısı', desc: 'Tamamlamak üzere olduğun kurslar için', default: false },
              { label: 'Yeni kurs önerileri', desc: 'İlgi alanlarına göre yeni kurslar', default: false },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(26,26,24,.05)' : 'none' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18', marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: 'rgba(26,26,24,.4)' }}>{item.desc}</p>
                </div>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: item.default ? '#C4500A' : 'rgba(26,26,24,.12)', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 2, left: item.default ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}