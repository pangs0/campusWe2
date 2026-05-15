'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check } from 'lucide-react'
import { checkPasswordStrength } from '@/lib/supabase/security'

const ROLES = [
  {
    key: 'founder',
    emoji: '🚀',
    label: 'Girişimci',
    desc: 'Startup kuruyorum veya kurmak istiyorum',
    color: '#C4500A',
    bg: 'rgba(196,80,10,.06)',
    border: 'rgba(196,80,10,.3)',
  },
  {
    key: 'investor',
    emoji: '💼',
    label: 'Yatırımcı',
    desc: 'Startup\'lara yatırım yapıyorum',
    color: '#b45309',
    bg: 'rgba(180,83,9,.06)',
    border: 'rgba(180,83,9,.3)',
  },
  {
    key: 'company',
    emoji: '🏢',
    label: 'Şirket',
    desc: 'Yetenekleri keşfediyorum',
    color: '#1d4ed8',
    bg: 'rgba(29,78,216,.06)',
    border: 'rgba(29,78,216,.3)',
  },
  {
    key: 'instructor',
    emoji: '🎓',
    label: 'Eğitmen',
    desc: 'Kurs oluşturup gelir kazanmak istiyorum',
    color: '#059669',
    bg: 'rgba(5,150,105,.06)',
    border: 'rgba(5,150,105,.3)',
  },
]

const LEFT_FEATURES = {
  founder: [
    { emoji: '🤝', text: 'Co-founder bul, ekibini kur' },
    { emoji: '📅', text: 'Demo Day\'de yatırımcılara pitch yap' },
    { emoji: '⚡', text: 'Karma token kazan, takas yap' },
    { emoji: '🎓', text: 'Kurs oluştur, pasif gelir elde et' },
  ],
  investor: [
    { emoji: '🔍', text: 'Startupları filtrele ve keşfet' },
    { emoji: '📅', text: 'Demo Day\'i izle, pitch gör' },
    { emoji: '💬', text: 'Kurucularla direkt iletişim' },
    { emoji: '❤️', text: 'Favori listeni oluştur' },
  ],
  company: [
    { emoji: '👥', text: 'Yetenek keşfet, stajyer bul' },
    { emoji: '🎯', text: 'Hackathon ve etkinlik düzenle' },
    { emoji: '📋', text: 'İş ilanı yayınla' },
    { emoji: '📊', text: 'İşe alım pipeline yönet' },
  ],
  instructor: [
    { emoji: '💰', text: 'Her satıştan %75 kazanç al' },
    { emoji: '📚', text: 'Sınırsız kurs ve ders oluştur' },
    { emoji: '📊', text: 'Gelir ve öğrenci takibi yap' },
    { emoji: '🏆', text: 'Eğitmen rozeti ve profil sayfası' },
  ],
}

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [role, setRole] = useState<'founder' | 'investor' | 'company' | 'instructor'>('founder')
  const [form, setForm] = useState({ email: '', password: '', full_name: '', username: '', university: '', city: '', company_name: '', firm_name: '', expertise: '', bio: '' })
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const selectedRole = ROLES.find(r => r.key === role)!
  const features = LEFT_FEATURES[role]

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, username: form.username } },
    })

    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: form.full_name,
        username: form.username,
        university: role === 'founder' ? form.university : null,
        city: form.city,
        role,
        karma_tokens: 100,
        bio: role === 'instructor' ? form.bio : null,
      })

      if (role === 'investor') {
        await supabase.from('investor_profiles').insert({ id: data.user.id, firm_name: form.firm_name })
      }
      if (role === 'company') {
        await supabase.from('company_profiles').insert({ id: data.user.id, company_name: form.company_name || form.full_name })
      }
      if (role === 'instructor') {
        try {
          await supabase.from('instructor_profiles').insert({
            id: data.user.id,
            expertise: form.expertise,
            is_approved: true,
          })
        } catch {}
      }
    }

    setSent(true)
    setLoading(false)
    setTimeout(() => {
      if (role === 'instructor') router.push('/kurslar/egitmen')
      else router.push('/dashboard')
    }, 1500)
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
        .role-card { transition: all 0.2s; cursor: pointer; }
        .role-card:hover { transform: translateY(-2px); }
        .feature-item { transition: transform 0.2s; }
        .feature-item:hover { transform: translateX(4px); }
      `}</style>

      {/* Sol — koyu, dinamik */}
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
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 800, color: 'white', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>

        <div>
          <div className="fade-up" style={{ animationDelay: '0.1s' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1rem' }}>
              {selectedRole.emoji} {selectedRole.label.toUpperCase()} OLARAK
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, color: 'white', letterSpacing: -2, lineHeight: 1.1, margin: '0 0 1.5rem', transition: 'all 0.3s' }}>
              Topluluğa<br />
              <em style={{ color: '#C4500A', fontStyle: 'normal' }}>katıl.</em>
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
            {features.map((f, i) => (
              <div key={i} className="fade-up feature-item" style={{ animationDelay: `${0.2 + i * 0.1}s`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${selectedRole.bg.replace('06', '12')}`, border: `1px solid ${selectedRole.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                  {f.emoji}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.55)' }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Sosyal kanıt */}
          <div className="fade-in" style={{ animationDelay: '0.6s', display: 'flex', gap: 20 }}>
            {[{ n: '12K+', l: 'Girişimci' }, { n: '340+', l: 'Üniversite' }, { n: '86+', l: 'Demo Day' }].map((s, i) => (
              <div key={i}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#C4500A', margin: 0 }}>{s.n}</p>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', margin: 0, letterSpacing: 1 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.8s', borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1.5rem' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'rgba(255,255,255,.35)', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 0.75rem' }}>
            "Her büyük startup bir eksiklikle başladı."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 2, height: 20, background: '#C4500A', borderRadius: 1 }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 1 }}>CAMPUSWE · 2026</span>
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
        padding: '2rem',
        overflowY: 'auto',
      }}>
        <div className="fade-up" style={{ animationDelay: '0.3s', width: '100%', maxWidth: 420 }}>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: 32 }}>
                📧
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 800, color: '#1a1a18', margin: '0 0 0.75rem', letterSpacing: -1 }}>
                E-postanı doğrula
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(26,26,24,.55)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                <strong>{form.email}</strong> adresine bir doğrulama bağlantısı gönderdik. Gelen kutunu kontrol et ve bağlantıya tıkla.
              </p>
              <div style={{ background: 'rgba(196,80,10,.04)', border: '1px solid rgba(196,80,10,.12)', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: 12, color: 'rgba(26,26,24,.5)', margin: 0, lineHeight: 1.7 }}>
                  📁 Spam klasörünü de kontrol etmeyi unutma. Mail 1-2 dakika içinde gelir.
                </p>
              </div>
              <Link href="/auth/login" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 8, background: '#1a1a18', color: 'white', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
                Giriş sayfasına git →
              </Link>
            </div>
          ) : (
            <div>

          {/* Rol seçimi */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', letterSpacing: 1, marginBottom: 8 }}>SEN KİMSİN?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 8 }}>
              {ROLES.map(r => (
                <button key={r.key} type="button" onClick={() => setRole(r.key as any)} className="role-card"
                  style={{ padding: '10px 8px', borderRadius: 10, border: role === r.key ? `2px solid ${r.color}` : '1.5px solid rgba(26,26,24,.12)', background: role === r.key ? r.bg : 'white', cursor: 'pointer', textAlign: 'center', position: 'relative' }}>
                  {role === r.key && (
                    <div style={{ position: 'absolute', top: 5, right: 5, width: 15, height: 15, borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={8} color="white" />
                    </div>
                  )}
                  <span style={{ fontSize: 18, display: 'block', marginBottom: 3 }}>{r.emoji}</span>
                  <p style={{ fontSize: 11, fontWeight: 600, color: role === r.key ? r.color : '#1a1a18', margin: 0 }}>{r.label}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>AD SOYAD *</label>
                <input className="input-auth" placeholder="Adınız Soyadınız" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>KULLANICI ADI *</label>
                <input className="input-auth" placeholder="kullaniciadi" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
              </div>
            </div>

            {role === 'founder' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>ÜNİVERSİTE</label>
                  <input className="input-auth" placeholder="ODTÜ, İTÜ..." value={form.university} onChange={e => setForm(p => ({ ...p, university: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>ŞEHİR</label>
                  <input className="input-auth" placeholder="İstanbul" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                </div>
              </div>
            )}

            {role === 'investor' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>FİRMA ADI</label>
                  <input className="input-auth" placeholder="XYZ Ventures" value={form.firm_name} onChange={e => setForm(p => ({ ...p, firm_name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>ŞEHİR</label>
                  <input className="input-auth" placeholder="İstanbul" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                </div>
              </div>
            )}

            {role === 'company' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>ŞİRKET ADI *</label>
                  <input className="input-auth" placeholder="Şirket A.Ş." value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>ŞEHİR</label>
                  <input className="input-auth" placeholder="İstanbul" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                </div>
              </div>
            )}

            {role === 'instructor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>UZMANLIK ALANI *</label>
                    <select className="input-auth" value={form.expertise} onChange={e => setForm(p => ({ ...p, expertise: e.target.value }))} required style={{ appearance: 'auto' }}>
                      <option value="">Seç</option>
                      <option>Girişimcilik</option>
                      <option>Teknoloji & Yazılım</option>
                      <option>Tasarım & UI/UX</option>
                      <option>Pazarlama & Büyüme</option>
                      <option>Finans & Yatırım</option>
                      <option>Yapay Zeka</option>
                      <option>Ürün Yönetimi</option>
                      <option>Kişisel Gelişim</option>
                      <option>Diğer</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>ŞEHİR</label>
                    <input className="input-auth" placeholder="İstanbul" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>KISA BİO</label>
                  <textarea className="input-auth" placeholder="Kendinizi ve oluşturmayı planladığınız kursu kısaca anlatın..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={2} style={{ resize: 'none' }} />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>E-POSTA *</label>
              <input type="email" className="input-auth" placeholder="ornek@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>

            <div>
              <label style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>ŞİFRE *</label>
              <input type="password" className="input-auth" placeholder="En az 8 karakter" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={8} />
              {form.password.length > 0 && (() => {
                const strength = checkPasswordStrength(form.password)
                return (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 3, background: 'rgba(26,26,24,.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(strength.score / 5) * 100}%`, background: strength.color, borderRadius: 2, transition: 'all 0.3s' }} />
                    </div>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: strength.color, margin: '3px 0 0', letterSpacing: 0.5 }}>{strength.label}</p>
                  </div>
                )
              })()}
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px' }}>
                <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>⚠ {error}</p>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <input type="checkbox" id="agreed" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 2, accentColor: '#C4500A', width: 15, height: 15, flexShrink: 0 }} />
              <label htmlFor="agreed" style={{ fontSize: 12, color: 'rgba(26,26,24,.55)', lineHeight: 1.6, cursor: 'pointer' }}>
                <a href="/kullanim-kosullari" target="_blank" style={{ color: '#C4500A', textDecoration: 'none' }}>Kullanım Koşulları</a>'nı ve{' '}
                <a href="/gizlilik" target="_blank" style={{ color: '#C4500A', textDecoration: 'none' }}>Gizlilik Politikası</a>'nı okudum, kabul ediyorum.
              </label>
            </div>

            <button type="submit" disabled={loading || !agreed}
              style={{ padding: '13px', background: '#1a1a18', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#C4500A' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a1a18' }}>
              {loading ? 'Hesap oluşturuluyor...' : `${selectedRole.emoji} ${selectedRole.label} olarak kayıt ol →`}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(26,26,24,.3)', marginTop: '1rem', lineHeight: 1.6, fontFamily: 'monospace' }}>
            🔒 SSL ile güvenli · KVKK uyumlu
          </p>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}