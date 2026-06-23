'use client'

import { useState, useEffect, useRef } from 'react'
import EgitmenSection from '@/components/landing/EgitmenSection'
import Link from 'next/link'

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

const FEATURES = [
  { emoji: '🚀', title: 'Startup Sayfası', desc: 'Fikrini yayınla, güncellemelerini paylaş, ilerlemeyi takip et.' },
  { emoji: '🤝', title: 'Co-founder Eşleştirme', desc: 'Tamamlayıcı yeteneklere sahip kurucu ortağını bul.' },
  { emoji: '💬', title: 'Mesajlaşma', desc: 'Gerçek zamanlı direkt mesaj, split-view arayüz.' },
  { emoji: '🌍', title: 'Dünya Haritası', desc: 'Türkiye\'deki girişimcileri harita üzerinde keşfet.' },
  { emoji: '⚡', title: 'Karma Token', desc: 'Katkına göre puan kazan, topluluğa değer kat.' },
  { emoji: '🎓', title: 'Kurs Sistemi', desc: 'Kurs oluştur, kazan. Topluluğun bilgisinden öğren.' },
  { emoji: '🏢', title: 'Çalışma Alanı', desc: 'Toplantı, kanban, notlar, dosya paylaşımı — hepsi bir arada.' },
  { emoji: '📅', title: 'Demo Day', desc: 'Yatırımcılar önünde pitch yap, fon bul.' },
  { emoji: '☕', title: 'Kahve Molası', desc: 'Rastgele biriyle 5 dakikada tanış, ağını genişlet.' },
  { emoji: '📚', title: 'Kütüphane', desc: 'Deep Work modu, Pomodoro timer, aktif çalışan topluluk.' },
  { emoji: '🔔', title: 'Bildirimler', desc: 'Gerçek zamanlı bildirimler — hiçbir şeyi kaçırma.' },
  { emoji: '🔄', title: 'Takas', desc: 'Karma token ile hizmet takas et — kod, tasarım, pazarlama.' },
]

const ROLES = [
  {
    key: 'founder', emoji: '🚀', label: 'Girişimci', color: '#C4500A', bg: 'rgba(196,80,10,.06)',
    features: ['Startup sayfası oluştur ve paylaş', 'Co-founder bul, ekip kur', 'Demo Day\'de yatırımcılara pitch yap', 'Kahve Molası ile ağ genişlet', 'Çalışma alanında ekiple çalış', 'Kurs oluştur, kazanç elde et']
  },
  {
    key: 'investor', emoji: '💼', label: 'Yatırımcı', color: '#b45309', bg: 'rgba(180,83,9,.06)',
    features: ['Startup\'ları filtrele, keşfet', 'Favori listesi oluştur', 'Demo Day başvurularını gör', 'Kurucularla direkt mesajlaş', 'Portföyünü platforma ekle', 'Office Hours ile mentörlük yap']
  },
  {
    key: 'company', emoji: '🏢', label: 'Şirket', color: '#1d4ed8', bg: 'rgba(29,78,216,.06)',
    features: ['Yetenek keşfet, stajyer bul', 'Hackathon ve etkinlik düzenle', 'Startup\'ları takip et', 'İş ilanı yayınla', 'İşe alım pipeline yönet', 'Markalı kuluçka katı aç']
  },
]

const TESTIMONIALS = [
  { quote: 'Co-founder\'ımı CampusWe\'de buldum. 3 ayda MVP\'yi çıkardık.', name: 'Kaan D.', meta: 'AgriTech Kurucusu', emoji: '🌱' },
  { quote: 'Demo Day\'de yatırımcıyla tanıştım. Seed turunu kapattık.', name: 'Zeynep A.', meta: 'EduTech Kurucusu', emoji: '📚' },
  { quote: 'Takas sistemiyle UI tasarımımı hallettim, karşılığında kod yazdım.', name: 'Mert Y.', meta: 'FinTech Kurucusu', emoji: '💰' },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Kaydol', desc: 'Girişimci, yatırımcı veya şirket olarak kaydol. 60 saniye.' },
  { n: '02', title: 'Profilini oluştur', desc: 'Yeteneklerini, startup\'ını ve hedeflerini paylaş.' },
  { n: '03', title: 'Topluluğa katıl', desc: 'Keşfet, bağlan, öğren, büyü.' },
]

export default function HomePage() {
  const [activeRole, setActiveRole] = useState('founder')
  const [visible, setVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const s1 = useCountUp(12000)
  const s2 = useCountUp(340)
  const s3 = useCountUp(2400)
  const s4 = useCountUp(86)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const selectedRole = ROLES.find(r => r.key === activeRole)!

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', maxWidth: '100vw', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float1 { 0%,100% { transform: translateY(0px) rotate(0deg); opacity: .3; } 50% { transform: translateY(-20px) rotate(180deg); opacity: .6; } }
        @keyframes float2 { 0%,100% { transform: translateY(0px) rotate(0deg); opacity: .2; } 50% { transform: translateY(-30px) rotate(-180deg); opacity: .5; } }
        @keyframes float3 { 0%,100% { transform: translateY(0px); opacity: .15; } 50% { transform: translateY(-15px); opacity: .4; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .feature-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26,26,24,.1); border-color: rgba(196,80,10,.3); }
        .cta-btn { transition: all 0.2s; display: inline-block; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,80,10,.3); }
        .nav-link { transition: color 0.15s; }
        .nav-link:hover { color: #1a1a18 !important; }
        .earn-card { transition: all 0.2s; }
        .earn-card:hover { transform: translateY(-3px); border-color: rgba(196,80,10,.25); }
        .testimonial-card { transition: all 0.2s; }
        .testimonial-card:hover { transform: translateY(-3px); }
        .shimmer-text { background: linear-gradient(90deg, #C4500A, #ff8c4b, #C4500A); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }

        /* ── MOBİL RESPONSIVE ── */
        .landing-nav { padding: 1.2rem 4rem; }
        .landing-nav-links { display: flex; gap: 28px; align-items: center; }
        .landing-nav-mobile { display: none; }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid rgba(26,26,24,.1); }
        .hero-left { padding: 5rem 4rem 4rem 6rem; border-right: 1px solid rgba(26,26,24,.1); min-height: 560px; display: flex; flex-direction: column; justify-content: space-between; }
        .hero-right { display: grid; grid-template-columns: 1fr 1fr; }
        .hero-title { font-size: 52px; }
        .hero-stats { display: flex; gap: 32px; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(26,26,24,.08); }
        .stats-bar { display: flex; }
        .stat-item { text-align: center; padding: 2.5rem 3rem; flex: 1; }
        .section-pad { padding: 5rem 6rem; }
        .section-pad-dark { padding: 5rem 2rem; }
        .roles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center; }
        .roles-features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .earn-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
        .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .community-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding: 2rem 4rem; }
        .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
        .egitmen-pad { padding: 6rem 6rem; }

        @media (max-width: 768px) {
          .landing-nav-links { display: none; }
          .landing-nav-mobile { display: flex; }
          .landing-nav { padding: 1rem 1.25rem !important; }
          .mobile-menu { display: flex; flex-direction: column; gap: 16px; padding: 1.5rem; background: rgba(245,240,232,.98); border-bottom: 1px solid rgba(26,26,24,.1); }

          .hero-grid { grid-template-columns: 1fr; }
          .hero-left { padding: 2.5rem 1.5rem; min-height: auto; border-right: none; border-bottom: 1px solid rgba(26,26,24,.1); }
          .hero-right { border-top: none; }
          .hero-title { font-size: 32px !important; letter-spacing: -1px !important; }
          .hero-badge { display: none; }
          .hero-stats { gap: 20px; margin-top: 2rem; padding-top: 1.5rem; flex-wrap: wrap; }
          .hero-stats > div p:first-child { font-size: 20px !important; }

          .stats-bar { flex-wrap: wrap; }
          .stat-item { padding: 1.5rem 1rem; width: 50%; border-right: none !important; border-bottom: 1px solid rgba(26,26,24,.08); }
          .stat-item:nth-child(odd) { border-right: 1px solid rgba(26,26,24,.08) !important; }

          .section-pad { padding: 3rem 1.5rem; }
          .section-pad-dark { padding: 3rem 1.5rem; }
          .section-title { font-size: 28px !important; letter-spacing: -1px !important; }
          .section-title-sm { font-size: 22px !important; }

          .roles-grid { grid-template-columns: 1fr; gap: 24px; }
          .roles-features-grid { grid-template-columns: 1fr 1fr; }
          .role-tabs { flex-wrap: wrap; gap: 6px; justify-content: center; }

          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .earn-grid { grid-template-columns: 1fr; }
          .how-grid { grid-template-columns: 1fr; }
          .how-step { border-right: none !important; border-bottom: 1px solid rgba(26,26,24,.08); }
          .how-step:last-child { border-bottom: none; }

          .why-grid { grid-template-columns: 1fr; gap: 2rem; }
          .why-title { font-size: 36px !important; }
          .community-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: 1fr; }

          .footer-inner { flex-direction: column; align-items: flex-start; padding: 1.5rem; }
          .footer-links { gap: 12px; }
          .egitmen-pad { padding: 3rem 1.5rem; }

          .cta-row { flex-direction: column; }
          .cta-row a { width: 100%; text-align: center; box-sizing: border-box; }

          .paul-quote { font-size: 24px !important; }
          .final-title { font-size: 36px !important; letter-spacing: -1px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav className="landing-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(26,26,24,.1)', background: 'rgba(245,240,232,.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#1a1a18' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </span>
        <div className="landing-nav-links">
          <a href="/kurslar" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Kurslar</a>
          <a href="/fiyatlandirma" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Fiyatlandırma</a>
          <a href="/kurumsal" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Kurumsal</a>
          <a href="/egitmen" className="nav-link" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none', border: '1px solid rgba(196,80,10,.3)', borderRadius: 6, padding: '6px 14px' }}>Eğitmen Ol</a>
          <a href="/auth/login" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none' }}>Giriş yap</a>
          <a href="/auth/register" className="cta-btn" style={{ background: '#C4500A', color: '#F5F0E8', padding: '8px 20px', borderRadius: 6, fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            Kayıt ol →
          </a>
        </div>
        {/* Mobil nav */}
        <div className="landing-nav-mobile" style={{ alignItems: 'center', gap: 10 }}>
          <a href="/auth/register" style={{ background: '#C4500A', color: 'white', padding: '7px 16px', borderRadius: 6, fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>Kayıt ol</a>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: '1px solid rgba(26,26,24,.15)', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>
            <span style={{ fontSize: 16 }}>{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobil menü */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {[['Kurslar', '/kurslar'], ['Fiyatlandırma', '/fiyatlandirma'], ['Kurumsal', '/kurumsal'], ['Eğitmen Ol', '/egitmen'], ['Giriş yap', '/auth/login']].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: 15, color: 'rgba(26,26,24,.7)', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid rgba(26,26,24,.06)' }}>{label}</a>
          ))}
        </div>
      )}

      {/* Hero */}
      <div className="hero-grid" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s' }}>
        <div className="hero-left fade-up">
          <div>
            <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(196,80,10,.08)', border: '1px solid rgba(196,80,10,.2)', borderRadius: 999, padding: '5px 14px', marginBottom: '2rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A' }} />
              <span style={{ fontSize: 10, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>Türkiye'nin Girişimci Platformu</span>
            </div>
            <h1 className="hero-title" style={{ fontFamily: 'Georgia, serif', fontWeight: 800, color: '#1a1a18', letterSpacing: -2.5, lineHeight: 1.05, margin: '0 0 1.5rem' }}>
              Co-founder bul,<br />
              yatırımcıyla tanış,<br />
              <em style={{ color: '#C4500A', fontStyle: 'normal' }}>birlikte büyü.</em>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(26,26,24,.5)', maxWidth: 420, lineHeight: 1.75, margin: '0 0 2rem' }}>
              Co-founder bul, yatırımcıyla tanış, kurs oluştur, kazan. Startup yolculuğunda ihtiyacın olan her şey burada.
            </p>
            <div className="cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/auth/register" className="cta-btn" style={{ background: '#C4500A', color: 'white', padding: '14px 32px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
                Ücretsiz başla
              </a>
              <a href="/fiyatlandirma" className="cta-btn" style={{ background: 'transparent', color: '#1a1a18', padding: '14px 32px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(26,26,24,.2)' }}>
                Fiyatlandırma →
              </a>
            </div>
          </div>
          <div className="hero-stats">
            {[{ n: '12K+', l: 'Girişimci' }, { n: '340+', l: 'Üniversite' }, { n: '86+', l: 'Demo Day' }].map((s, i) => (
              <div key={i}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 800, color: '#C4500A', margin: 0 }}>{s.n}</p>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', margin: '2px 0 0', letterSpacing: 1 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-right">
          {[
            { emoji: '🚀', title: 'Startup Sayfası', desc: 'Fikrini yayınla, güncellemelerini paylaş.' },
            { emoji: '🤝', title: 'Co-founder', desc: 'Tamamlayıcı yeteneklerle ekip kur.' },
            { emoji: '💼', title: 'Yatırımcı Ağı', desc: 'Demo Day\'de pitch yap, fon bul.' },
            { emoji: '🎓', title: 'Kurs Sistemi', desc: 'Öğret ve kazanç elde et.' },
            { emoji: '⚡', title: 'Karma Token', desc: 'Katkına göre puan kazan.' },
            { emoji: '🏗️', title: 'Çalışma Alanı', desc: 'Uzaktan ekiple birlikte çalış.' },
          ].map((f, i) => (
            <div key={i} style={{ padding: '2rem', borderRight: i % 2 === 0 ? '1px solid rgba(26,26,24,.08)' : 'none', borderBottom: i < 4 ? '1px solid rgba(26,26,24,.08)' : 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(196,80,10,.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>{f.emoji}</span>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, color: '#1a1a18', margin: '0 0 5px' }}>{f.title}</p>
              <p style={{ fontSize: 12, color: 'rgba(26,26,24,.45)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sayaçlar */}
      <div style={{ borderTop: '1px solid rgba(26,26,24,.08)', borderBottom: '1px solid rgba(26,26,24,.08)' }}>
        <div className="stats-bar">
          {[
            { ref: s1.ref, count: s1.count, suffix: 'K+', label: 'Aktif girişimci' },
            { ref: s2.ref, count: s2.count, suffix: '+', label: 'Üniversite' },
            { ref: s3.ref, count: s3.count, suffix: '+', label: 'Tamamlanan takas' },
            { ref: s4.ref, count: s4.count, suffix: '+', label: 'Demo Day pitch' },
          ].map((s, i) => (
            <div key={i} ref={s.ref} className="stat-item" style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(26,26,24,.08)' : 'none' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#C4500A', margin: 0, letterSpacing: -1 }}>
                {s.count.toLocaleString()}{s.suffix}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(26,26,24,.4)', margin: '4px 0 0', fontFamily: 'monospace', letterSpacing: 0.5 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roller */}
      <div className="section-pad">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>HERKESİN BİR YERİ VAR</p>
          <h2 className="section-title" style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>Sen kimsin?</h2>
        </div>
        <div className="role-tabs" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: '3rem' }}>
          {ROLES.map(r => (
            <button key={r.key} onClick={() => setActiveRole(r.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 999, border: activeRole === r.key ? `2px solid ${r.color}` : '1px solid rgba(26,26,24,.15)', background: activeRole === r.key ? r.bg : 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: activeRole === r.key ? r.color : 'rgba(26,26,24,.6)' }}>
              <span>{r.emoji}</span> {r.label}
            </button>
          ))}
        </div>
        <div className="roles-grid">
          <div>
            <h3 className="section-title-sm" style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1a1a18', margin: '0 0 1.5rem', letterSpacing: -1 }}>
              {selectedRole.emoji} {selectedRole.label} için CampusWe
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedRole.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: selectedRole.bg, border: `1px solid ${selectedRole.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: selectedRole.color, fontSize: 11, fontWeight: 700 }}>✓</span>
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(26,26,24,.7)' }}>{f}</span>
                </div>
              ))}
            </div>
            <a href="/auth/register" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: '2rem', background: '#C4500A', color: 'white', padding: '12px 28px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              {selectedRole.label} olarak kaydol →
            </a>
          </div>
          <div className="roles-features-grid">
            {selectedRole.features.map((f, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 12, padding: '1.25rem', transition: 'all 0.2s' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: selectedRole.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontSize: 16 }}>
                  {['🚀', '🤝', '📅', '☕', '🏗️', '🎓'][i % 6]}
                </div>
                <p style={{ fontSize: 12, color: 'rgba(26,26,24,.65)', margin: 0, lineHeight: 1.5 }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Özellikler */}
      <div style={{ background: '#1a1a18' }}>
        <div className="section-pad-dark" style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>PLATFORM ÖZELLİKLERİ</p>
            <h2 className="section-title" style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: 'white', margin: 0, letterSpacing: -1.5 }}>
              Bir startup için<br />ihtiyacın olan her şey.
            </h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.25rem' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>{f.emoji}</span>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700, color: 'white', margin: '0 0 6px' }}>{f.title}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kazanç modeli */}
      <div className="section-pad">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>KAZANÇ MODELİ</p>
          <h2 className="section-title" style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>Platforma katıl, kazan.</h2>
          <p style={{ fontSize: 15, color: 'rgba(26,26,24,.45)', marginTop: '0.75rem' }}>CampusWe sadece bir topluluk değil — bir gelir kapısı.</p>
        </div>
        <div className="earn-grid">
          {[
            { emoji: '🎓', title: 'Kurs oluştur', desc: 'Girişimcilik, kod, tasarım, pazarlama — bildiğin her şeyi öğret. Her satıştan %75\'i senin.', cta: 'Eğitmen ol', href: '/kurslar/egitmen' },
            { emoji: '⚡', title: 'Pro\'ya geç', desc: 'Sınırsız takas, öncelikli Demo Day, yatırımcı mesajı. Aylık ₺99.', cta: 'Pro\'ya geç', href: '/pro/upgrade' },
            { emoji: '🏢', title: 'Kurumsal ortak ol', desc: 'Markalı kuluçka katı aç, yetenek keşfet, Demo Day sponsoru ol.', cta: 'İletişime geç', href: '/kurumsal' },
          ].map((item, i) => (
            <div key={i} className="earn-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 32, marginBottom: 12 }}>{item.emoji}</span>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1a1a18', margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.55)', lineHeight: 1.7, flex: 1, margin: '0 0 1.5rem' }}>{item.desc}</p>
              <a href={item.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#C4500A', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>{item.cta} →</a>
            </div>
          ))}
        </div>
      </div>

      {/* Nasıl çalışır */}
      <div style={{ background: '#faf9f6', borderTop: '1px solid rgba(26,26,24,.08)', borderBottom: '1px solid rgba(26,26,24,.08)' }}>
        <div className="section-pad">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>NASIL ÇALIŞIR</p>
            <h2 className="section-title" style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>3 adımda başla.</h2>
          </div>
          <div className="how-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="how-step" style={{ textAlign: 'center', padding: '2.5rem', borderRight: i < 2 ? '1px solid rgba(26,26,24,.08)' : 'none' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 800, color: 'rgba(26,26,24,.08)', margin: '0 0 1rem', letterSpacing: -2 }}>{step.n}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1a1a18', margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(26,26,24,.5)', margin: 0, lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Neden CampusWe */}
      <div className="section-pad" style={{ borderTop: '1px solid rgba(26,26,24,.08)', borderBottom: '1px solid rgba(26,26,24,.08)' }}>
        <div className="why-grid">
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1.5rem' }}>NEDEN CAMPUSWE</p>
            <h2 className="why-title" style={{ fontFamily: 'Georgia, serif', fontSize: 48, fontWeight: 800, color: '#1a1a18', letterSpacing: -2, lineHeight: 1.1, margin: '0 0 1.5rem' }}>
              Yalnız başarı<br /><em style={{ color: '#C4500A', fontStyle: 'normal' }}>bir mit.</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(26,26,24,.55)', lineHeight: 1.8, maxWidth: 420 }}>
              Dünyanın en başarılı startupları bir gün ekip olarak kurulmadı. Farklı yeteneklerin birbirini bulmasıyla doğdu.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { n: '73%', text: 'başarılı startupların birden fazla kurucusu var' },
              { n: '2x', text: 'co-founder olan startuplar yalnız kurulanlara göre 2 kat hızlı büyüyor' },
              { n: '36%', text: 'girişimciler en büyük zorluğun doğru ekibi bulmak olduğunu söylüyor' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'white', border: '1px solid rgba(26,26,24,.08)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#C4500A', margin: 0, flexShrink: 0, letterSpacing: -1 }}>{s.n}</p>
                <p style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', margin: 0, lineHeight: 1.6 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topluluktan bu hafta */}
      <div className="section-pad" style={{ background: 'rgba(196,80,10,.02)', borderBottom: '1px solid rgba(26,26,24,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.5rem' }}>TOPLULUKTAN BU HAFTA</p>
            <h2 className="section-title-sm" style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1a1a18', margin: 0, letterSpacing: -1 }}>Gerçek insanlar, gerçek anlar.</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(196,80,10,.08)', border: '1px solid rgba(196,80,10,.2)', borderRadius: 999, padding: '6px 14px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A' }} />
            <span style={{ fontSize: 11, color: '#C4500A', fontFamily: 'monospace', letterSpacing: 1 }}>CANLI</span>
          </div>
        </div>
        <div className="community-grid">
          {[
            { emoji: '🤝', text: '3 co-founder eşleşmesi gerçekleşti', time: '2 sa önce' },
            { emoji: '🚀', text: 'Yeni bir startup sayfası yayınlandı', time: '4 sa önce' },
            { emoji: '☕', text: '12 kişi Kahve Molası\'nda tanıştı', time: 'Dün' },
            { emoji: '🎓', text: 'Yeni bir kurs topluluğa eklendi', time: 'Dün' },
            { emoji: '💰', text: 'Demo Day başvurusu kabul edildi', time: '2 gün önce' },
            { emoji: '⚡', text: '840 Karma Token takas edildi', time: '2 gün önce' },
            { emoji: '🏗️', text: 'Yeni çalışma alanı kuruldu', time: '3 gün önce' },
            { emoji: '📅', text: 'Hackathon etkinliği oluşturuldu', time: '3 gün önce' },
          ].map((item, i) => (
            <div key={i} className="feature-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.08)', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji}</span>
              <div>
                <p style={{ fontSize: 12, color: 'rgba(26,26,24,.7)', margin: '0 0 4px', lineHeight: 1.5 }}>{item.text}</p>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.3)', margin: 0 }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paul Graham */}
      <div style={{ background: '#1a1a18' }}>
        <div className="section-pad-dark" style={{ maxWidth: 720 }}>
          <p className="paul-quote" style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 700, color: 'white', lineHeight: 1.3, letterSpacing: -1.5, margin: '0 0 2rem' }}>
            "Eğer hâlâ doğru ekibi arıyorsan, aramayı bırakma. En iyi kariyerler, doğru insanlarla bir odada oturmakla başlar."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 3, height: 36, background: '#C4500A', borderRadius: 2 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.7)', margin: 0 }}>Paul Graham</p>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', margin: 0, letterSpacing: 1 }}>Y COMBINATOR KURUCUSU</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="section-pad">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>BAŞARI HİKAYELERİ</p>
          <h2 className="section-title" style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>Gerçek insanlar, gerçek sonuçlar.</h2>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '1.75rem' }}>
              <p style={{ fontSize: 14, color: 'rgba(26,26,24,.65)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.5rem' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.emoji}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18', margin: 0 }}>{t.name}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', margin: 0 }}>{t.meta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ background: '#1a1a18', padding: '6rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1.5rem' }}>BAŞLAMAYA HAZIR MISIN</p>
        <h2 className="final-title" style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 800, color: 'white', letterSpacing: -2.5, margin: '0 0 1rem', lineHeight: 1.05 }}>
          Her büyük startup bir<br /><em style={{ color: '#C4500A', fontStyle: 'normal' }}>eksiklikle</em> başladı.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', marginBottom: '2.5rem' }}>Seninki de burada başlasın.</p>
        <div className="cta-row" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/auth/register" style={{ background: '#C4500A', color: 'white', padding: '14px 36px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 600 }}>Ücretsiz kaydol</a>
          <a href="/fiyatlandirma" style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', padding: '14px 36px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(255,255,255,.12)' }}>Planları incele</a>
        </div>
      </div>

      {/* Eğitmen Bölümü */}
      <div className="egitmen-pad" style={{ background: '#1a1a18', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(196,80,10,.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(196,80,10,.08) 0%, transparent 40%)', pointerEvents: 'none' }} />
        {[
          { top: '10%', left: '5%', size: 6, anim: 'float1 4s infinite' },
          { top: '60%', left: '8%', size: 8, anim: 'float3 6s infinite 2s' },
          { top: '15%', right: '10%', size: 5, anim: 'float2 5s infinite' },
          { top: '70%', right: '15%', size: 4, anim: 'float1 4s infinite 2s' },
        ].map((p, i) => (
          <div key={i} style={{ position: 'absolute', top: p.top, left: (p as any).left, right: (p as any).right, width: p.size, height: p.size, borderRadius: '50%', background: '#C4500A', animation: p.anim, pointerEvents: 'none' }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <EgitmenSection />
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(26,26,24,.08)' }}>
        <div className="footer-inner">
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 800, color: 'rgba(26,26,24,.4)' }}>
            Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
          </span>
          <div className="footer-links">
            {[['Kurslar', '/kurslar'], ['Fiyatlandırma', '/fiyatlandirma'], ['Kurumsal', '/kurumsal'], ['Kayıt ol', '/auth/register'], ['Gizlilik', '/gizlilik'], ['Kullanım Koşulları', '/kullanim-kosullari']].map(([label, href]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: 'rgba(26,26,24,.35)', textDecoration: 'none' }}>{label}</a>
            ))}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.2)', letterSpacing: 1 }}>© 2026 CAMPUSWE</span>
        </div>
      </div>
    </div>
  )
}