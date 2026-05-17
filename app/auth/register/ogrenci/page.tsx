'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function OgrenciKayitPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 8) { setError('Şifre en az 8 karakter olmalı.'); return }
    setLoading(true); setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } }
    })

    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: form.full_name,
        username: form.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 999),
        role: 'student',
        karma_tokens: 0,
      })
      if (profileError) { setError('Profil oluşturulamadı: ' + profileError.message); setLoading(false); return }
    }

    setDone(true)
    setLoading(false)
    setTimeout(() => router.push('/ogrenci'), 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ background: 'rgba(245,240,232,.95)', borderBottom: '1px solid rgba(26,26,24,.1)', padding: '1.2rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(8px)' }}>
        <Link href="/" style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/kurslar" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Kurslara dön</Link>
          <Link href="/auth/login" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none' }}>Zaten hesabın var mı? Giriş yap</Link>
        </div>
      </nav>

      {/* İçerik */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {done ? (
            <div style={{ textAlign: 'center', background: 'white', borderRadius: 16, padding: 40, border: '1.5px solid rgba(26,26,24,.08)' }}>
              <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 800, color: '#1a1a18', marginBottom: 8 }}>Hesabın oluşturuldu!</h2>
              <p style={{ fontSize: 14, color: 'rgba(26,26,24,.5)' }}>Kurslara yönlendiriliyorsun...</p>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 16, padding: 40, border: '1.5px solid rgba(26,26,24,.08)', boxShadow: '0 4px 24px rgba(26,26,24,.06)' }}>
              {/* Başlık */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(196,80,10,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <BookOpen size={24} color="#C4500A" />
                </div>
                <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 26, fontWeight: 800, color: '#1a1a18', marginBottom: 6 }}>
                  Kurslara başla
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(26,26,24,.45)' }}>
                  Ücretsiz hesap aç, hemen öğrenmeye başla.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>AD SOYAD *</label>
                  <input
                    type="text" required
                    placeholder="Adınız Soyadınız"
                    value={form.full_name}
                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                    style={{ width: '100%', padding: '12px 14px', border: '1.5px solid rgba(26,26,24,.12)', borderRadius: 10, fontSize: 14, background: '#fafafa', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>E-POSTA *</label>
                  <input
                    type="email" required
                    placeholder="ornek@email.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    style={{ width: '100%', padding: '12px 14px', border: '1.5px solid rgba(26,26,24,.12)', borderRadius: 10, fontSize: 14, background: '#fafafa', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>ŞİFRE *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'} required
                      placeholder="En az 8 karakter"
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      style={{ width: '100%', padding: '12px 44px 12px 14px', border: '1.5px solid rgba(26,26,24,.12)', borderRadius: 10, fontSize: 14, background: '#fafafa', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(26,26,24,.35)' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px' }}>{error}</p>
                )}

                <button type="submit" disabled={loading}
                  style={{ background: '#C4500A', color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                  {loading ? 'Hesap oluşturuluyor...' : 'Ücretsiz kayıt ol →'}
                </button>
              </form>

              {/* Faydalar */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(26,26,24,.06)' }}>
                {[
                  '✅ Yüzlerce kursa erişim',
                  '🎓 Tamamlama sertifikası',
                  '📱 Her cihazdan izle',
                  '🔒 Güvenli ödeme',
                ].map((item, i) => (
                  <p key={i} style={{ fontSize: 12, color: 'rgba(26,26,24,.5)', marginBottom: 6 }}>{item}</p>
                ))}
              </div>

              <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(26,26,24,.35)', marginTop: 20 }}>
                Zaten hesabın var mı?{' '}
                <Link href="/auth/login" style={{ color: '#C4500A', textDecoration: 'none', fontWeight: 600 }}>Giriş yap</Link>
              </p>
              <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(26,26,24,.3)', marginTop: 8 }}>
                Girişimci misin?{' '}
                <Link href="/auth/register" style={{ color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Tam kayıt →</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}