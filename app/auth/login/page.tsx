'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const FEATURES = [
  { emoji: '🚀', text: 'Startup sayfanı oluştur, topluluğa tanıt' },
  { emoji: '🤝', text: 'Co-founder bul, ekibini kur' },
  { emoji: '💼', text: 'Yatırımcılarla direkt iletişim' },
  { emoji: '🎓', text: 'Kurs oluştur, kazanç elde et' },
]

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('E-posta veya şifre hatalı.'); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-in { animation: fadeIn 0.5s ease both; }
        .input-auth { width: 100%; padding: 11px 14px; border: 1.5px solid rgba(26,26,24,.15); border-radius: 8px; font-size: 14px; color: #1a1a18; outline: none; transition: border-color 0.2s; font-family: Inter, sans-serif; background: white; box-sizing: border-box; }
        .input-auth:focus { border-color: #C4500A; }
        .btn-auth { width: 100%; padding: 13px; background: #1a1a18; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: Inter, sans-serif; }
        .btn-auth:hover { background: #C4500A; transform: translateY(-1px); }
        .btn-auth:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .feature-item { transition: transform 0.2s; }
        .feature-item:hover { transform: translateX(4px); }
      `}</style>

      {/* Sol — koyu, motivasyon */}
      <div style={{
        background: '#1a1a18',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,.03) 79px,rgba(255,255,255,.03) 80px)',
        padding: '3rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s',
      }}>
        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 800, color: 'white', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>

        {/* Ana içerik */}
        <div>
          <div className="fade-up" style={{ animationDelay: '0.1s' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              TÜRKIYE'NIN GİRİŞİMCİ PLATFORMU
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 44, fontWeight: 800, color: 'white', letterSpacing: -2, lineHeight: 1.1, margin: '0 0 1.5rem' }}>
              Tekrar hoş<br />
              <em style={{ color: '#C4500A', fontStyle: 'normal' }}>geldin.</em>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              Topluluk seni bekliyor. Giriş yap ve kaldığın yerden devam et.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="fade-up feature-item" style={{ animationDelay: `${0.2 + i * 0.1}s`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {f.emoji}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alt alıntı */}
        <div className="fade-in" style={{ animationDelay: '0.7s' }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1.5rem' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: 'rgba(255,255,255,.4)', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 1rem' }}>
              "Doğru ekipte olmak, doğru fikre sahip olmaktan daha önemlidir."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 2, height: 24, background: '#C4500A', borderRadius: 1 }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.5)', margin: 0 }}>Reid Hoffman</p>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', margin: 0, letterSpacing: 1 }}>LİNKEDIN KURUCUSU</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ — form */}
      <div style={{
        background: '#F5F0E8',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
      }}>
        <div className="fade-up" style={{ animationDelay: '0.3s', width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: '#1a1a18', margin: '0 0 6px', letterSpacing: -1 }}>
              Giriş yap
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(26,26,24,.45)', margin: 0 }}>
              Hesabın yok mu?{' '}
              <Link href="/auth/register" style={{ color: '#C4500A', textDecoration: 'none', fontWeight: 500 }}>Kayıt ol →</Link>
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>E-POSTA</label>
              <input type="email" className="input-auth" placeholder="sen@universite.edu.tr"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.45)', letterSpacing: 1 }}>ŞİFRE</label>
                <Link href="/auth/reset" style={{ fontSize: 11, color: 'rgba(26,26,24,.4)', textDecoration: 'none' }}>Şifremi unuttum</Link>
              </div>
              <input type="password" className="input-auth" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px' }}>
                <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>⚠ {error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-auth">
              {loading ? 'Giriş yapılıyor...' : 'Giriş yap →'}
            </button>
          </form>

          {/* Ayırıcı */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(26,26,24,.1)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.3)', letterSpacing: 1 }}>VEYA</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(26,26,24,.1)' }} />
          </div>

          <Link href="/auth/register" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 8, border: '1.5px solid rgba(26,26,24,.15)', color: 'rgba(26,26,24,.6)', fontSize: 14, textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4500A'; e.currentTarget.style.color = '#C4500A' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,24,.15)'; e.currentTarget.style.color = 'rgba(26,26,24,.6)' }}>
            Yeni hesap oluştur
          </Link>

          {/* Güven notu */}
          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(26,26,24,.3)', marginTop: '1.5rem', lineHeight: 1.6, fontFamily: 'monospace' }}>
            🔒 SSL ile güvenli · KVKK uyumlu
          </p>
        </div>
      </div>
    </div>
  )
}