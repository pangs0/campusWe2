'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Check, X, Shield, RefreshCw, Heart, Zap, Star, ArrowRight } from 'lucide-react'

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return { count, ref }
}

export default function FiyatlandirmaPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [visible, setVisible] = useState(false)

  const s1 = useCountUp(12000)
  const s2 = useCountUp(340)
  const s3 = useCountUp(2400)
  const s4 = useCountUp(86)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const freeFeatures = [
    { label: 'Profil oluşturma', included: true },
    { label: 'Startup sayfası', included: true },
    { label: 'Topluluk akışı', included: true },
    { label: 'Kahve Molası eşleştirme', included: true },
    { label: '5 takas teklifi/ay', included: true },
    { label: 'Garaj etkinlikleri', included: true },
    { label: 'Sanal kütüphane', included: true },
    { label: 'Öncelikli Demo Day', included: false },
    { label: 'Yatırımcı mesajı', included: false },
    { label: 'Sınırsız takas', included: false },
    { label: 'Pro rozeti', included: false },
  ]

  const proFeatures = [
    { label: 'Profil oluşturma', included: true },
    { label: 'Startup sayfası', included: true },
    { label: 'Topluluk akışı', included: true },
    { label: 'Kahve Molası eşleştirme', included: true },
    { label: 'Sınırsız takas teklifi', included: true },
    { label: 'Garaj etkinlikleri', included: true },
    { label: 'Sanal kütüphane', included: true },
    { label: 'Öncelikli Demo Day', included: true },
    { label: 'Yatırımcı mesajı', included: true },
    { label: 'Gelişmiş eşleştirme', included: true },
    { label: 'Pro rozeti', included: true },
  ]

  const testimonials = [
    { quote: 'Pro\'ya geçtikten sonra Demo Day\'de yatırımcıyla tanıştım. 3 ay içinde seed turunu kapattık.', name: 'Kaan Demir', meta: 'İTÜ · AgriTech', emoji: '🌱' },
    { quote: 'Sınırsız takas özelliği hayatımı değiştirdi. Artık her eksikliğimi topluluğa açıyorum.', name: 'Zeynep Arslan', meta: 'Bilkent · EduTech', emoji: '📚' },
    { quote: 'Yatırımcılarla direkt mesajlaşma özelliği inanılmaz. 2 hafta içinde 3 meeting ayarladım.', name: 'Mert Yıldız', meta: 'ODTÜ · FinTech', emoji: '💰' },
  ]

  const proFor = [
    'Co-founder bulmaya ciddi olarak odaklanıyorsan',
    'Demo Day\'de yatırımcılara pitch yapmak istiyorsan',
    'Haftada 5\'ten fazla takas yapmak istiyorsan',
    'Startup\'ını hızla büyütmek istiyorsan',
    'Yatırımcılarla direkt iletişim kurmak istiyorsan',
    'Toplulukta öne çıkmak ve tanınmak istiyorsan',
  ]

  const monthlyPrice = 99
  const yearlyPrice = 899
  const currentPrice = billing === 'monthly' ? monthlyPrice : Math.round(yearlyPrice / 12)

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-in { animation: fadeIn 0.5s ease both; }
        .plan-card { transition: transform 0.2s, box-shadow 0.2s; }
        .plan-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26,26,24,.1); }
        .toggle-btn { transition: all 0.2s; }
        .feature-row:nth-child(even) { background: rgba(26,26,24,.02); }
      `}</style>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 3rem', borderBottom: '1px solid rgba(26,26,24,.1)', background: 'rgba(245,240,232,.95)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Ana sayfa</Link>
          <Link href="/kurumsal" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Kurumsal</Link>
          <Link href="/auth/login" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none' }}>Giriş yap</Link>
          <Link href="/auth/register" style={{ background: '#C4500A', color: '#F5F0E8', padding: '7px 18px', borderRadius: 4, fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            Kayıt ol
          </Link>
        </div>
      </nav>

      <main>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '5rem 2rem 3rem', opacity: visible ? 1 : 0, transition: 'opacity 0.6s' }}>
          <div className="fade-up" style={{ animationDelay: '0.1s' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1rem' }}>FİYATLANDIRMA</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 800, color: '#1a1a18', letterSpacing: -2.5, margin: 0, lineHeight: 1.05 }}>
              Sade ve şeffaf.
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(26,26,24,.45)', marginTop: '1rem' }}>
              Ücretsiz başla, büyüdükçe yükselt.
            </p>
          </div>
        </div>

        {/* Sosyal kanıt sayaçları */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, borderTop: '1px solid rgba(26,26,24,.08)', borderBottom: '1px solid rgba(26,26,24,.08)', marginBottom: '4rem' }}>
          {[
            { ref: s1.ref, count: s1.count, suffix: 'K+', label: 'Aktif girişimci' },
            { ref: s2.ref, count: s2.count, suffix: '+', label: 'Üniversite' },
            { ref: s3.ref, count: s3.count, suffix: '+', label: 'Tamamlanan takas' },
            { ref: s4.ref, count: s4.count, suffix: '+', label: 'Demo Day pitch' },
          ].map((s, i) => (
            <div key={i} ref={s.ref} style={{ textAlign: 'center', padding: '2rem 3rem', borderRight: i < 3 ? '1px solid rgba(26,26,24,.08)' : 'none', flex: 1 }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 800, color: '#C4500A', margin: 0, letterSpacing: -1 }}>
                {s.count.toLocaleString()}{s.suffix}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(26,26,24,.4)', margin: '4px 0 0', fontFamily: 'monospace', letterSpacing: 0.5 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', background: 'white', border: '1px solid rgba(26,26,24,.12)', borderRadius: 999, padding: 4, gap: 4 }}>
            {[{ key: 'monthly', label: 'Aylık' }, { key: 'yearly', label: 'Yıllık' }].map(b => (
              <button key={b.key} onClick={() => setBilling(b.key as any)} className="toggle-btn"
                style={{ padding: '8px 24px', borderRadius: 999, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', background: billing === b.key ? '#1a1a18' : 'transparent', color: billing === b.key ? 'white' : 'rgba(26,26,24,.5)' }}>
                {b.label}
                {b.key === 'yearly' && (
                  <span style={{ marginLeft: 6, fontSize: 10, background: '#C4500A', color: 'white', padding: '2px 6px', borderRadius: 999, fontFamily: 'monospace' }}>-24%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plan kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 960, margin: '0 auto 5rem', padding: '0 2rem' }}>

          {/* Ücretsiz */}
          <div className="plan-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 8px' }}>BAŞLANGIÇ</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', margin: 0 }}>Ücretsiz</p>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', marginTop: 4 }}>Sonsuza kadar</p>
            </div>
            <div style={{ flex: 1, marginBottom: '1.5rem' }}>
              {freeFeatures.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(26,26,24,.04)' }}>
                  {f.included ? <Check size={13} color="#22c55e" /> : <X size={13} color="rgba(26,26,24,.2)" />}
                  <span style={{ fontSize: 13, color: f.included ? 'rgba(26,26,24,.65)' : 'rgba(26,26,24,.3)' }}>{f.label}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/register" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 8, border: '1px solid rgba(26,26,24,.2)', color: '#1a1a18', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              Ücretsiz başla
            </Link>
          </div>

          {/* Pro */}
          <div className="plan-card" style={{ background: '#1a1a18', border: '2px solid #1a1a18', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#C4500A', color: 'white', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, padding: '4px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>
              EN POPÜLER
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 8px' }}>PRO</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: 'white', margin: 0, transition: 'all 0.3s' }}>
                  ₺{currentPrice}
                </p>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>/ay</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>
                {billing === 'yearly' ? `₺${yearlyPrice} yıllık ödeme` : 'aylık ödeme'}
              </p>
            </div>
            <div style={{ flex: 1, marginBottom: '1.5rem' }}>
              {proFeatures.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                  <Check size={13} color="#C4500A" />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{f.label}</span>
                </div>
              ))}
            </div>
            <Link href="/pro/upgrade" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 8, background: '#C4500A', color: 'white', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
              Pro'ya geç →
            </Link>
          </div>

          {/* Kurumsal */}
          <div className="plan-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 8px' }}>KURUMSAL</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', margin: 0 }}>Özel fiyat</p>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', marginTop: 4 }}>Şirket büyüklüğüne göre</p>
            </div>
            <div style={{ flex: 1, marginBottom: '1.5rem' }}>
              {['Markalı kuluçka katı', 'Premium yetenek erişimi', 'Sponsored Demo Day', 'Özel etkinlik', 'Yetenek analitik paneli', 'Aylık raporlama', 'Özel account manager', 'API erişimi', 'Sınırsız kullanıcı', 'Öncelikli destek', 'Özelleştirme'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(26,26,24,.04)' }}>
                  <Check size={13} color="#22c55e" />
                  <span style={{ fontSize: 13, color: 'rgba(26,26,24,.65)' }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/kurumsal" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 8, background: '#C4500A', color: 'white', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              İletişime geç →
            </Link>
          </div>

        </div>

        {/* Pro için doğru musun? */}
        <div style={{ maxWidth: 720, margin: '0 auto 5rem', padding: '0 2rem' }}>
          <div style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
              <Star size={18} color="#C4500A" />
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#1a1a18', margin: 0 }}>
                Pro senin için mi?
              </h2>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(26,26,24,.5)', marginBottom: '1.5rem' }}>
              Aşağıdakilerden en az birini yapıyorsan Pro kesinlikle senin için:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {proFor.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'rgba(196,80,10,.04)', borderRadius: 8, border: '1px solid rgba(196,80,10,.1)' }}>
                  <span style={{ color: '#C4500A', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: 'rgba(26,26,24,.7)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link href="/pro/upgrade" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#C4500A', color: 'white', padding: '12px 28px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
                <Zap size={15} />
                Pro'ya geç →
              </Link>
            </div>
          </div>
        </div>

        {/* Başarı hikayeleri */}
        <div style={{ background: '#1a1a18', padding: '4rem 2rem', marginBottom: '4rem' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.75rem' }}>BAŞARI HİKAYELERİ</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: 'white', textAlign: 'center', margin: '0 0 2.5rem', letterSpacing: -1 }}>
              Pro üyelerin söyledikleri
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {testimonials.map((t, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.5rem' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(196,80,10,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      {t.emoji}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'white', margin: 0 }}>{t.name}</p>
                      <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', margin: 0 }}>{t.meta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Güven rozetleri */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', padding: '0 2rem 4rem' }}>
          {[
            { icon: Shield, label: 'SSL ile güvenli ödeme' },
            { icon: RefreshCw, label: 'İstediğin zaman iptal' },
            { icon: Heart, label: 'Türk girişimciler için' },
            { icon: Zap, label: 'Anında aktif' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(26,26,24,.45)', fontSize: 13 }}>
              <b.icon size={15} color="#C4500A" />
              {b.label}
            </div>
          ))}
        </div>

        {/* SSS */}
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 2rem 5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1a1a18', textAlign: 'center', marginBottom: '2rem', letterSpacing: -1 }}>
            Sık sorulan sorular
          </h2>
          {[
            { q: 'Ücretsiz plan ne kadar süre geçerli?', a: 'Sonsuza kadar. Temel özellikler her zaman ücretsiz.' },
            { q: 'Pro planı iptal edebilir miyim?', a: 'Evet, istediğin zaman. Kalan süren boyunca Pro özellikleri aktif kalır.' },
            { q: 'Yıllık planda indirim ne kadar?', a: 'Yıllık planla 2 ay ücretsiz alırsın — %24 tasarruf.' },
            { q: 'Kurumsal plan nasıl çalışıyor?', a: 'Şirket büyüklüğüne göre özel fiyat. Formu doldur, 24 saatte dönüş yapalım.' },
            { q: 'Ödeme güvenli mi?', a: 'Tüm ödemeler SSL ile şifreleniyor. Kart bilgilerin bizde saklanmıyor.' },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(26,26,24,.08)', padding: '1.5rem 0' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: '#1a1a18', margin: '0 0 6px' }}>{item.q}</p>
              <p style={{ fontSize: 14, color: 'rgba(26,26,24,.55)', margin: 0, lineHeight: 1.7 }}>{item.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '4rem 2rem 5rem', borderTop: '1px solid rgba(26,26,24,.08)' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', letterSpacing: -1.5, margin: '0 0 1rem' }}>
            Her büyük startup bir<br />
            <em style={{ color: '#C4500A', fontStyle: 'normal' }}>eksiklikle</em> başladı.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(26,26,24,.45)', marginBottom: '2rem' }}>Seninki de burada başlasın.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', padding: '13px 32px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 500 }}>
              Ücretsiz başla
            </Link>
            <Link href="/pro/upgrade" style={{ background: '#1a1a18', color: 'white', padding: '13px 32px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 500 }}>
              Pro'ya geç →
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(26,26,24,.08)', padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 800, color: 'rgba(26,26,24,.4)', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/" style={{ fontSize: 13, color: 'rgba(26,26,24,.35)', textDecoration: 'none' }}>Ana sayfa</Link>
          <Link href="/kurumsal" style={{ fontSize: 13, color: 'rgba(26,26,24,.35)', textDecoration: 'none' }}>Kurumsal</Link>
          <Link href="/auth/register" style={{ fontSize: 13, color: 'rgba(26,26,24,.35)', textDecoration: 'none' }}>Kayıt ol</Link>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.2)', letterSpacing: 1 }}>© 2026 CAMPUSWE</span>
      </div>
    </div>
  )
}