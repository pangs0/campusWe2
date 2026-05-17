'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Camera, Check, Eye, EyeOff, Shield, Bell, User, BookOpen, Award, TrendingUp, Star, LogOut } from 'lucide-react'

export default function AyarlarPage() {
  const supabase = createClient()
  const router = useRouter()
  const avatarRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ courses: 0, completed: 0, lessons: 0 })
  const [form, setForm] = useState({ full_name: '', email: '' })
  const [passwords, setPasswords] = useState({ new: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [passSaved, setPassSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'profil' | 'guvenlik' | 'bildirimler'>('profil')
  const [notifs, setNotifs] = useState({ yeni_ders: true, indirim: true, sertifika: false, oneri: false })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUser(user)
      setForm(p => ({ ...p, email: user.email || '' }))
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (!data) return
        setProfile(data)
        setForm(p => ({ ...p, full_name: data.full_name || '' }))
        setAvatarPreview(data.avatar_url || null)
      })
      // İstatistikler
      Promise.all([
        supabase.from('course_enrollments').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
        supabase.from('lesson_completions').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
      ]).then(([enrollRes, lessonRes]) => {
        setStats({ courses: enrollRes.count || 0, completed: 0, lessons: lessonRes.count || 0 })
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
      const path = `${user.id}/${Date.now()}-avatar`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
        avatar_url = urlData.publicUrl
      }
    }
    await supabase.from('profiles').update({ full_name: form.full_name, avatar_url }).eq('id', user.id)
    setProfile((p: any) => ({ ...p, full_name: form.full_name, avatar_url }))
    setSaved(true); setLoading(false)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) { setError('Şifreler eşleşmiyor.'); return }
    if (passwords.new.length < 8) { setError('En az 8 karakter.'); return }
    setPassLoading(true); setError('')
    const { error } = await supabase.auth.updateUser({ password: passwords.new })
    if (error) { setError(error.message); setPassLoading(false); return }
    setPassSaved(true); setPassLoading(false)
    setPasswords({ new: '', confirm: '' })
    setTimeout(() => setPassSaved(false), 2500)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/kurslar')
  }

  if (!profile) return null

  const TABS = [
    { key: 'profil', label: 'Profil', icon: User },
    { key: 'guvenlik', label: 'Güvenlik', icon: Shield },
    { key: 'bildirimler', label: 'Bildirimler', icon: Bell },
  ]

  const card = { background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 14, padding: 24 }
  const input = { width: '100%', padding: '11px 14px', border: '1.5px solid rgba(26,26,24,.12)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }
  const label = { fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }
  const sectionTitle = { fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, margin: '0 0 16px' }

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 2, marginBottom: 4 }}>ÖĞRENCİ PANELİ</p>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', letterSpacing: -1, margin: 0 }}>Ayarlar.</h1>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key as any); setError('') }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400, background: activeTab === tab.key ? '#1a1a18' : 'transparent', color: activeTab === tab.key ? 'white' : 'rgba(26,26,24,.5)', transition: 'all .15s' }}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 2 kolon layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* Sol — formlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* PROFİL */}
          {activeTab === 'profil' && (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={card}>
                <p style={sectionTitle}>PROFİL FOTOĞRAFI</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }} onClick={() => avatarRef.current?.click()}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: 'Georgia,serif', fontWeight: 700, color: '#C4500A', fontSize: 28 }}>
                      {avatarPreview ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : profile?.full_name?.[0] || '?'}
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: '#C4500A', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                      <Camera size={13} color="white" />
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>{profile?.full_name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(26,26,24,.4)', marginBottom: 8 }}>Fotoğrafı değiştirmek için tıkla</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.3)' }}>PNG, JPG · maks. 5MB</p>
                  </div>
                  <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </div>
              </div>

              <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={sectionTitle}>KİŞİSEL BİLGİLER</p>
                <div>
                  <label style={label}>AD SOYAD</label>
                  <input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} style={input} />
                </div>
                <div>
                  <label style={label}>E-POSTA</label>
                  <input type="email" value={form.email} disabled style={{ ...input, background: '#fafafa', color: 'rgba(26,26,24,.4)', border: '1.5px solid rgba(26,26,24,.06)' }} />
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.3)', marginTop: 4 }}>E-posta değiştirilemez.</p>
                </div>
                <div>
                  <label style={label}>HESAP TÜRÜ</label>
                  <div style={{ padding: '10px 14px', border: '1.5px solid rgba(26,26,24,.06)', borderRadius: 8, background: '#fafafa', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', background: 'rgba(196,80,10,.08)', border: '1px solid rgba(196,80,10,.15)', borderRadius: 100, padding: '2px 10px' }}>ÖĞRENCİ</span>
                    <span style={{ fontSize: 12, color: 'rgba(26,26,24,.4)' }}>Kurs izleme hesabı</span>
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
              <form onSubmit={handlePassword} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={sectionTitle}>ŞİFRE DEĞİŞTİR</p>
                {[{ key: 'new', lbl: 'YENİ ŞİFRE' }, { key: 'confirm', lbl: 'TEKRAR GİR' }].map(f => (
                  <div key={f.key}>
                    <label style={label}>{f.lbl}</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPass ? 'text' : 'password'} placeholder="En az 8 karakter"
                        value={passwords[f.key as keyof typeof passwords]}
                        onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ ...input, paddingRight: 40 }} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(26,26,24,.3)' }}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
                {error && <p style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}
                <button type="submit" disabled={passLoading}
                  style={{ background: passSaved ? '#22c55e' : '#1a1a18', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {passSaved ? <><Check size={15} /> Güncellendi!</> : passLoading ? 'Güncelleniyor...' : 'Şifreyi güncelle'}
                </button>
              </form>

              <div style={{ ...card, background: '#fff5f5', border: '1.5px solid rgba(220,38,38,.15)' }}>
                <p style={{ ...sectionTitle, color: '#dc2626' }}>TEHLİKELİ BÖLGE</p>
                <p style={{ fontSize: 13, color: 'rgba(26,26,24,.55)', marginBottom: 14, lineHeight: 1.6 }}>Hesabını silersen tüm kurs ilerlemen ve sertifikalar kalıcı olarak silinir. Bu işlem geri alınamaz.</p>
                <button style={{ background: 'white', color: '#dc2626', border: '1.5px solid rgba(220,38,38,.3)', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                  Hesabımı sil
                </button>
              </div>
            </div>
          )}

          {/* BİLDİRİMLER */}
          {activeTab === 'bildirimler' && (
            <div style={card}>
              <p style={sectionTitle}>BİLDİRİM TERCİHLERİ</p>
              {[
                { key: 'yeni_ders', label: 'Yeni ders bildirimleri', desc: 'Kayıtlı kurslara yeni ders eklenince' },
                { key: 'indirim', label: 'Kurs indirimleri', desc: 'Beğendiğin kurslarda indirim olunca' },
                { key: 'sertifika', label: 'Sertifika hatırlatıcısı', desc: 'Tamamlamak üzere olduğun kurslar' },
                { key: 'oneri', label: 'Yeni kurs önerileri', desc: 'İlgi alanlarına göre kurs önerileri' },
              ].map((item, i, arr) => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(26,26,24,.05)' : 'none' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18', marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: 'rgba(26,26,24,.4)' }}>{item.desc}</p>
                  </div>
                  <div onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                    style={{ width: 44, height: 24, borderRadius: 12, background: notifs[item.key as keyof typeof notifs] ? '#C4500A' : 'rgba(26,26,24,.12)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}>
                    <div style={{ position: 'absolute', top: 2, left: notifs[item.key as keyof typeof notifs] ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sağ — profil özeti */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Profil kartı */}
          <div style={{ ...card, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: 'Georgia,serif', fontWeight: 700, color: '#C4500A', fontSize: 26, margin: '0 auto 14px' }}>
              {avatarPreview ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : profile?.full_name?.[0] || '?'}
            </div>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>{profile?.full_name}</p>
            <p style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', marginBottom: 14 }}>{form.email}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(196,80,10,.08)', border: '1px solid rgba(196,80,10,.15)', borderRadius: 100, padding: '4px 12px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A' }}>ÖĞRENCİ HESABI</span>
            </div>
          </div>

          {/* İstatistikler */}
          <div style={card}>
            <p style={sectionTitle}>İSTATİSTİKLERİM</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: BookOpen, label: 'Kayıtlı Kurs', value: stats.courses, color: '#3b82f6' },
                { icon: Award, label: 'Tamamlanan', value: stats.completed, color: '#22c55e' },
                { icon: TrendingUp, label: 'İzlenen Ders', value: stats.lessons, color: '#C4500A' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#fafafa', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <s.icon size={15} color={s.color} />
                    <span style={{ fontSize: 13, color: 'rgba(26,26,24,.6)' }}>{s.label}</span>
                  </div>
                  <span style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hızlı işlemler */}
          <div style={card}>
            <p style={sectionTitle}>HIZLI ERİŞİM</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/ogrenci/kurslarim', label: 'Kurslarıma git', icon: BookOpen },
                { href: '/ogrenci/sertifikalar', label: 'Sertifikalarım', icon: Award },
                { href: '/kurslar', label: 'Yeni kurs keşfet', icon: Star },
              ].map((item, i) => (
                <a key={i} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: '#fafafa', border: '1px solid rgba(26,26,24,.06)', textDecoration: 'none', color: '#1a1a18', fontSize: 13, transition: 'all .15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,80,10,.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(196,80,10,.04)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,26,24,.06)'; (e.currentTarget as HTMLElement).style.background = '#fafafa' }}>
                  <item.icon size={14} color="rgba(196,80,10,.6)" />
                  {item.label}
                </a>
              ))}
              <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: '#fafafa', border: '1px solid rgba(26,26,24,.06)', cursor: 'pointer', color: 'rgba(26,26,24,.5)', fontSize: 13, marginTop: 4 }}>
                <LogOut size={14} /> Çıkış yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}