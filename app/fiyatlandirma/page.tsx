'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check, X, Shield, RefreshCw, Heart, Zap, Star, ArrowRight, Building2, Rocket, TrendingUp } from 'lucide-react'

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true) }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])
  useEffect(() => {
    if (!started) return
    let val = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      val += step
      if (val >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(val))
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration])
  return { count, ref }
}

const FREE_FEATURES = [
  { label: 'Profil oluşturma', included: true },
  { label: 'Startup sayfası', included: true },
  { label: 'Topluluk akışı', included: true },
  { label: 'Kahve Molası eşleştirme', included: true },
  { label: '5 takas teklifi/ay', included: true },
  { label: 'Garaj etkinlikleri', included: true },
  { label: 'Sanal kütüphane', included: true },
  { label: 'Kurs izleme', included: true },
  { label: 'Öncelikli Demo Day', included: false },
  { label: 'Yatırımcı mesajı', included: false },
  { label: 'Sınırsız takas', included: false },
  { label: 'Pro rozeti', included: false },
  { label: 'Gelişmiş eşleştirme', included: false },
]

const PRO_FEATURES = [
  { label: 'Profil oluşturma', included: true },
  { label: 'Startup sayfası', included: true },
  { label: 'Topluluk akışı', included: true },
  { label: 'Kahve Molası eşleştirme', included: true },
  { label: 'Sınırsız takas teklifi', included: true },
  { label: 'Garaj etkinlikleri', included: true },
  { label: 'Sanal kütüphane', included: true },
  { label: 'Kurs izleme', included: true },
  { label: 'Öncelikli Demo Day', included: true },
  { label: 'Yatırımcı mesajı', included: true },
  { label: 'Sınırsız takas', included: true },
  { label: 'Pro rozeti', included: true },
  { label: 'Gelişmiş eşleştirme', included: true },
]

const TESTIMONIALS = [
  { quote: 'Pro\'ya geçtikten sonra Demo Day\'de yatırımcıyla tanıştım. 3 ay içinde seed turunu kapattık.', name: 'Kaan Demir', meta: 'AgriTech Kurucusu', emoji: '🌱' },
  { quote: 'Sınırsız takas özelliği hayatımı değiştirdi. Her eksikliğimi topluluğa açıyorum.', name: 'Zeynep Arslan', meta: 'EduTech Kurucusu', emoji: '📚' },
  { quote: 'Yatırımcılarla direkt mesajlaşma özelliği inanılmaz. 2 haftada 3 meeting ayarladım.', name: 'Mert Yıldız', meta: 'FinTech Kurucusu', emoji: '💰' },
]

const NAV_LINKS = [
  { href: '/', label: 'Ana sayfa' },
  { href: '/kurslar', label: 'Kurslar' },
  { href: '/fiyatlandirma', label: 'Fiyatlandırma' },
  { href: '/kurumsal', label: 'Kurumsal' },
]

export default function FiyatlandirmaPage() {
  const pathname = usePathname()
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [visible, setVisible] = useState(false)
  const s1 = useCountUp(12000)
  const s2 = useCountUp(340)
  const s3 = useCountUp(2400)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const monthlyPrice = 99
  const yearlyPrice = 899
  const currentPrice = billing === 'monthly' ? monthlyPrice : Math.round(yearlyPrice / 12)

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .plan-card { transition: transform 0.2s, box-shadow 0.2s; }
        .plan-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26,26,24,.1); }
        .toggle-btn { transition: all 0.2s; }
        .nav-link { transition: color 0.15s; position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1.5px; background: #C4500A; transition: width 0.2s; }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #1a1a18 !important; }
        .nav-link.active { color: #C4500A !important; }
        .nav-link.active::after { width: 100%; }
        .cta-btn { transition: all 0.2s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,80,10,.25); }
        .testimonial-card { transition: all 0.2s; }
        .testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,26,24,.08); }
      `}</style>

      {/* Nav — açılış sayfasıyla aynı */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 4rem', borderBottom: '1px solid rgba(26,26,24,.1)', background: 'rgba(245,240,232,.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              style={{ fontSize: 13, color: pathname === link.href ? '#C4500A' : 'rgba(26,26,24,.5)', textDecoration: 'none' }}>
              {link.label}
            </Link>
          ))}
          <Link href="/auth/login" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Giriş yap</Link>
          <Link href="/egitmen" className="nav-link" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none', border: '1px solid rgba(196,80,10,.3)', borderRadius: 6, padding: '6px 14px' }}>Eğitmen Ol</Link>
          <Link href="/auth/register" className="cta-btn" style={{ background: '#C4500A', color: '#F5F0E8', padding: '8px 20px', borderRadius: 6, fontSize: 13, textDecoration: 'none', fontWeight: 500, display: 'inline-block' }}>
            Kayıt ol →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: '5rem 4rem 3rem', textAlign: 'center', opacity: visible ? 1 : 0, transition: 'opacity 0.6s' }}>
        <div className="fade-up">
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1rem' }}>FİYATLANDIRMA</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 56, fontWeight: 800, color: '#1a1a18', letterSpacing: -2.5, margin: '0 0 1rem', lineHeight: 1.05 }}>
            Sade ve şeffaf.
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(26,26,24,.45)', marginBottom: '2rem' }}>
            Ücretsiz başla, büyüdükçe yükselt.
          </p>
        </div>
      </div>

      {/* Sayaçlar */}
      <div style={{ display: 'flex', borderTop: '1px solid rgba(26,26,24,.08)', borderBottom: '1px solid rgba(26,26,24,.08)', marginBottom: '4rem' }}>
        {[
          { ref: s1.ref, count: s1.count, suffix: 'K+', label: 'Aktif girişimci' },
          { ref: s2.ref, count: s2.count, suffix: '+', label: 'Üniversite' },
          { ref: s3.ref, count: s3.count, suffix: '+', label: 'Tamamlanan takas' },
        ].map((s, i) => (
          <div key={i} ref={s.ref} style={{ textAlign: 'center', padding: '2rem 0', flex: 1, borderRight: i < 2 ? '1px solid rgba(26,26,24,.08)' : 'none' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#C4500A', margin: 0, letterSpacing: -1 }}>
              {s.count.toLocaleString()}{s.suffix}
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', margin: '4px 0 0', letterSpacing: 1 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', background: 'white', border: '1px solid rgba(26,26,24,.12)', borderRadius: 999, padding: 4, gap: 4 }}>
          {[{ key: 'monthly', label: 'Aylık' }, { key: 'yearly', label: 'Yıllık' }].map(b => (
            <button key={b.key} onClick={() => setBilling(b.key as any)} className="toggle-btn"
              style={{ padding: '9px 28px', borderRadius: 999, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', background: billing === b.key ? '#1a1a18' : 'transparent', color: billing === b.key ? 'white' : 'rgba(26,26,24,.5)' }}>
              {b.label}
              {b.key === 'yearly' && <span style={{ marginLeft: 6, fontSize: 10, background: '#C4500A', color: 'white', padding: '2px 6px', borderRadius: 999, fontFamily: 'monospace' }}>-24%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plan kartları + karşılaştırma */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, margin: '0 4rem 5rem', border: '1px solid rgba(26,26,24,.1)', borderRadius: 20, overflow: 'visible', marginTop: 20 }}>

        {/* Ücretsiz */}
        <div className="plan-card" style={{ background: 'white', padding: '2.5rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(26,26,24,.08)', borderRadius: '20px 0 0 20px', border: '1px solid rgba(26,26,24,.1)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(26,26,24,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Rocket size={18} color="rgba(26,26,24,.5)" />
            </div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 8px' }}>BAŞLANGIÇ</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', margin: 0 }}>Ücretsiz</p>
            <p style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', marginTop: 4 }}>Sonsuza kadar</p>
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(26,26,24,.03)', borderRadius: 8, border: '1px solid rgba(26,26,24,.06)' }}>
              <p style={{ fontSize: 12, color: 'rgba(26,26,24,.55)', margin: 0, lineHeight: 1.6 }}>
                Platforma adım atmak ve topluluğu keşfetmek isteyenler için.
              </p>
            </div>
          </div>
          <div style={{ flex: 1, marginBottom: '2rem' }}>
            {FREE_FEATURES.map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(26,26,24,.04)' }}>
                {f.included ? <Check size={13} color="#22c55e" /> : <X size={13} color="rgba(26,26,24,.2)" />}
                <span style={{ fontSize: 13, color: f.included ? 'rgba(26,26,24,.65)' : 'rgba(26,26,24,.3)' }}>{f.label}</span>
              </div>
            ))}
          </div>
          <Link href="/auth/register" className="cta-btn" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, border: '1px solid rgba(26,26,24,.2)', color: '#1a1a18', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
            Ücretsiz başla
          </Link>
        </div>

        {/* Pro */}
        <div className="plan-card" style={{ background: '#1a1a18', padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', borderRight: '1px solid rgba(255,255,255,.08)', borderRadius: 20, marginTop: -20, border: '2px solid #C4500A', zIndex: 1 }}>
          <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#C4500A', color: 'white', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, padding: '4px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>
            EN POPÜLER
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(196,80,10,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Zap size={18} color="#C4500A" />
            </div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 8px' }}>PRO</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: 'white', margin: 0, transition: 'all 0.3s' }}>₺{currentPrice}</p>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>/ay</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>
              {billing === 'yearly' ? `₺${yearlyPrice} yıllık · 2 ay ücretsiz` : 'aylık ödeme'}
            </p>
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(196,80,10,.12)', borderRadius: 8, border: '1px solid rgba(196,80,10,.2)' }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', margin: 0, lineHeight: 1.6 }}>
                Startup'ını büyütmek ve yatırımcılara ulaşmak isteyenler için.
              </p>
            </div>
          </div>
          <div style={{ flex: 1, marginBottom: '2rem' }}>
            {PRO_FEATURES.map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <Check size={13} color="#C4500A" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{f.label}</span>
              </div>
            ))}
          </div>
          <Link href="/pro/upgrade" className="cta-btn" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, background: '#C4500A', color: 'white', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
            Pro'ya geç →
          </Link>
        </div>

        {/* Kurumsal */}
        <div className="plan-card" style={{ background: 'white', padding: '2.5rem', display: 'flex', flexDirection: 'column', borderRadius: '0 20px 20px 0', border: '1px solid rgba(26,26,24,.1)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(29,78,216,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Building2 size={18} color="#1d4ed8" />
            </div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 8px' }}>KURUMSAL</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', margin: 0 }}>Özel</p>
            <p style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', marginTop: 4 }}>Şirket büyüklüğüne göre</p>
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(29,78,216,.04)', borderRadius: 8, border: '1px solid rgba(29,78,216,.1)' }}>
              <p style={{ fontSize: 12, color: 'rgba(26,26,24,.55)', margin: 0, lineHeight: 1.6 }}>
                Yetenek keşfetmek ve ekosisteme ortak olmak isteyen şirketler için.
              </p>
            </div>
          </div>
          <div style={{ flex: 1, marginBottom: '2rem' }}>
            {['Markalı kuluçka katı', 'Premium yetenek erişimi', 'Sponsored Demo Day', 'Özel etkinlik', 'Yetenek analitik paneli', 'Aylık raporlama', 'Özel account manager', 'API erişimi', 'Sınırsız kullanıcı', 'Öncelikli destek', 'Özelleştirme', 'SLA garantisi', 'Özel entegrasyonlar'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(26,26,24,.04)' }}>
                <Check size={13} color="#22c55e" />
                <span style={{ fontSize: 13, color: 'rgba(26,26,24,.65)' }}>{f}</span>
              </div>
            ))}
          </div>
          <Link href="/kurumsal" className="cta-btn" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, background: '#1d4ed8', color: 'white', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
            İletişime geç →
          </Link>
        </div>
      </div>

      {/* Güven rozetleri */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', padding: '0 4rem 5rem' }}>
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

      {/* Testimonials */}
      <div style={{ background: '#1a1a18', padding: '5rem 4rem' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.75rem' }}>BAŞARI HİKAYELERİ</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: 'white', textAlign: 'center', margin: '0 0 2.5rem', letterSpacing: -1 }}>
          Pro üyelerin söyledikleri
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.5rem' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.25rem' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(196,80,10,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{t.emoji}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'white', margin: 0 }}>{t.name}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', margin: 0 }}>{t.meta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SSS */}
      <div style={{ padding: '5rem 4rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1a1a18', textAlign: 'center', marginBottom: '2.5rem', letterSpacing: -1 }}>
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
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '4rem', borderTop: '1px solid rgba(26,26,24,.08)' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 42, fontWeight: 800, color: '#1a1a18', letterSpacing: -1.5, margin: '0 0 1rem' }}>
          Her büyük startup bir<br />
          <em style={{ color: '#C4500A', fontStyle: 'normal' }}>eksiklikle</em> başladı.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(26,26,24,.45)', marginBottom: '2rem' }}>Seninki de burada başlasın.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/auth/register" className="cta-btn" style={{ background: '#C4500A', color: 'white', padding: '13px 32px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 500, display: 'inline-block' }}>
            Ücretsiz başla
          </Link>
          <Link href="/pro/upgrade" className="cta-btn" style={{ background: '#1a1a18', color: 'white', padding: '13px 32px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 500, display: 'inline-block' }}>
            Pro'ya geç →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(26,26,24,.08)', padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 800, color: 'rgba(26,26,24,.4)', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 13, color: 'rgba(26,26,24,.35)', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.2)', letterSpacing: 1 }}>© 2026 CAMPUSWE</span>
      </div>
    </div>
  )
}