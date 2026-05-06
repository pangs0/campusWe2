'use client'

import { useState, useEffect, useRef } from 'react'
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
    key: 'founder',
    emoji: '🚀',
    label: 'Girişimci',
    color: '#C4500A',
    bg: 'rgba(196,80,10,.06)',
    features: [
      'Startup sayfası oluştur ve paylaş',
      'Co-founder bul, ekip kur',
      'Demo Day\'de yatırımcılara pitch yap',
      'Kahve Molası ile ağ genişlet',
      'Çalışma alanında ekiple çalış',
      'Kurs oluştur, kazanç elde et',
    ]
  },
  {
    key: 'investor',
    emoji: '💼',
    label: 'Yatırımcı',
    color: '#b45309',
    bg: 'rgba(180,83,9,.06)',
    features: [
      'Startup\'ları filtrele, keşfet',
      'Favori listesi oluştur',
      'Demo Day başvurularını gör',
      'Kurucularla direkt mesajlaş',
      'Portföyünü platforma ekle',
      'Office Hours ile mentörlük yap',
    ]
  },
  {
    key: 'company',
    emoji: '🏢',
    label: 'Şirket',
    color: '#1d4ed8',
    bg: 'rgba(29,78,216,.06)',
    features: [
      'Yetenek keşfet, stajyer bul',
      'Hackathon ve etkinlik düzenle',
      'Startup\'ları takip et',
      'İş ilanı yayınla',
      'İşe alım pipeline yönet',
      'Markalı kuluçka katı aç',
    ]
  },
]

const TESTIMONIALS = [
  { quote: 'Co-founder\'ımı CampusWe\'de buldum. 3 ayda MVP\'yi çıkardık.', name: 'Kaan D.', meta: 'İTÜ · AgriTech Kurucusu', emoji: '🌱' },
  { quote: 'Demo Day\'de yatırımcıyla tanıştım. Seed turunu kapattık.', name: 'Zeynep A.', meta: 'Bilkent · EduTech Kurucusu', emoji: '📚' },
  { quote: 'Takas sistemiyle UI tasarımımı hallettim, karşılığında kod yazdım.', name: 'Mert Y.', meta: 'ODTÜ · FinTech Kurucusu', emoji: '💰' },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Kaydol', desc: 'Girişimci, yatırımcı veya şirket olarak kaydol. 60 saniye.' },
  { n: '02', title: 'Profilini oluştur', desc: 'Yeteneklerini, startup\'ını ve hedeflerini paylaş.' },
  { n: '03', title: 'Topluluğa katıl', desc: 'Keşfet, bağlan, öğren, büyü.' },
]

export default function HomePage() {
  const [activeRole, setActiveRole] = useState('founder')
  const [visible, setVisible] = useState(false)
  const s1 = useCountUp(12000)
  const s2 = useCountUp(340)
  const s3 = useCountUp(2400)
  const s4 = useCountUp(86)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const selectedRole = ROLES.find(r => r.key === activeRole)!

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-in { animation: fadeIn 0.5s ease both; }
        .slide-right { animation: slideRight 0.6s ease both; }
        .feature-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; cursor: default; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26,26,24,.1); border-color: rgba(196,80,10,.3); }
        .role-btn { transition: all 0.25s; }
        .role-btn:hover { transform: translateY(-1px); }
        .cta-btn { transition: all 0.2s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,80,10,.3); }
        .step-card { transition: all 0.2s; }
        .step-card:hover { background: white; box-shadow: 0 4px 16px rgba(26,26,24,.06); }
        .testimonial-card { transition: all 0.2s; }
        .testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,26,24,.08); }
        .earn-card { transition: all 0.2s; }
        .earn-card:hover { transform: translateY(-3px); border-color: rgba(196,80,10,.25); box-shadow: 0 8px 24px rgba(26,26,24,.08); }
        .nav-link { transition: color 0.15s; }
        .nav-link:hover { color: #1a1a18 !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 3rem', borderBottom: '1px solid rgba(26,26,24,.1)', background: 'rgba(245,240,232,.95)', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#1a1a18' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/kurslar" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Kurslar</a>
          <a href="/fiyatlandirma" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Fiyatlandırma</a>
          <a href="/kurumsal" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Kurumsal</a>
          <a href="/auth/login" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none' }}>Giriş yap</a>
          <a href="/auth/register" style={{ background: '#C4500A', color: '#F5F0E8', padding: '8px 20px', borderRadius: 6, fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            Kayıt ol →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: '100%', padding: '6rem 8rem 4rem', textAlign: 'center', opacity: visible ? 1 : 0, transition: 'opacity 0.6s' }}>
        <div className="fade-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(196,80,10,.08)', border: '1px solid rgba(196,80,10,.2)', borderRadius: 999, padding: '5px 14px', marginBottom: '2rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A' }} />
            <span style={{ fontSize: 11, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>Türkiye'nin Girişimci Platformu</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 64, fontWeight: 800, color: '#1a1a18', letterSpacing: -3, lineHeight: 1.05, margin: '0 0 1.5rem' }}>
            Eksikliği olan girişimcilerin<br />
            <em style={{ color: '#C4500A', fontStyle: 'normal' }}>birbirini bulduğu</em> platform.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(26,26,24,.5)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Co-founder bul, yatırımcıyla tanış, kurs oluştur, kazan. Startup yolculuğunda ihtiyacın olan her şey burada.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/auth/register" className="cta-btn" style={{ background: '#1a1a18', color: 'white', padding: '14px 36px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 600, letterSpacing: -0.3, display: 'inline-block' }}>
              Ücretsiz başla
            </a>
            <a href="/fiyatlandirma" className="cta-btn" style={{ background: 'white', color: '#1a1a18', padding: '14px 36px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(26,26,24,.15)', display: 'inline-block' }}>
              Fiyatlandırma →
            </a>
          </div>
        </div>
      </div>

      {/* Sosyal kanıt sayaçları */}
      <div style={{ borderTop: '1px solid rgba(26,26,24,.08)', borderBottom: '1px solid rgba(26,26,24,.08)', display: 'flex' }}>
        {[
          { ref: s1.ref, count: s1.count, suffix: 'K+', label: 'Aktif girişimci' },
          { ref: s2.ref, count: s2.count, suffix: '+', label: 'Üniversite' },
          { ref: s3.ref, count: s3.count, suffix: '+', label: 'Tamamlanan takas' },
          { ref: s4.ref, count: s4.count, suffix: '+', label: 'Demo Day pitch' },
        ].map((s, i) => (
          <div key={i} ref={s.ref} style={{ textAlign: 'center', padding: '2.5rem 3rem', borderRight: i < 3 ? '1px solid rgba(26,26,24,.08)' : 'none', flex: 1 }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#C4500A', margin: 0, letterSpacing: -1 }}>
              {s.count.toLocaleString()}{s.suffix}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(26,26,24,.4)', margin: '4px 0 0', fontFamily: 'monospace', letterSpacing: 0.5 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Roller */}
      <div style={{ maxWidth: '100%', padding: '5rem 8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>HERKESİN BİR YERİ VAR</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>Sen kimsin?</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: '3rem' }}>
          {ROLES.map(r => (
            <button key={r.key} onClick={() => setActiveRole(r.key)} className="role-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 999, border: activeRole === r.key ? `2px solid ${r.color}` : '1px solid rgba(26,26,24,.15)', background: activeRole === r.key ? r.bg : 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: activeRole === r.key ? r.color : 'rgba(26,26,24,.6)' }}>
              <span>{r.emoji}</span> {r.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1a1a18', margin: '0 0 1.5rem', letterSpacing: -1 }}>
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
            <a href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: '2rem', background: '#C4500A', color: 'white', padding: '12px 28px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              {selectedRole.label} olarak kaydol →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
      <div style={{ background: '#1a1a18', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>PLATFORM ÖZELLİKLERİ</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: 'white', margin: 0, letterSpacing: -1.5 }}>
              Bir startup için<br />ihtiyacın olan her şey.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.25rem', cursor: 'default' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>{f.emoji}</span>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700, color: 'white', margin: '0 0 6px' }}>{f.title}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Para kazanma modeli */}
      <div style={{ maxWidth: '100%', padding: '5rem 8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>KAZANÇ MODELİ</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
            Platforma katıl, kazan.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(26,26,24,.45)', marginTop: '0.75rem' }}>
            CampusWe sadece bir topluluk değil — bir gelir kapısı.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { emoji: '🎓', title: 'Kurs oluştur', desc: 'Girişimcilik, kod, tasarım, pazarlama — bildiğin her şeyi öğret. Her satıştan %75\'i senin.', cta: 'Eğitmen ol', href: '/kurslar/egitmen' },
            { emoji: '⚡', title: 'Pro\'ya geç', desc: 'Sınırsız takas, öncelikli Demo Day, yatırımcı mesajı. Aylık ₺99.', cta: 'Pro\'ya geç', href: '/pro/upgrade' },
            { emoji: '🏢', title: 'Kurumsal ortak ol', desc: 'Markalı kuluçka katı aç, yetenek keşfet, Demo Day sponsoru ol.', cta: 'İletişime geç', href: '/kurumsal' },
          ].map((item, i) => (
            <div key={i} className="earn-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 32, marginBottom: 12 }}>{item.emoji}</span>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1a1a18', margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.55)', lineHeight: 1.7, flex: 1, margin: '0 0 1.5rem' }}>{item.desc}</p>
              <a href={item.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#C4500A', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
                {item.cta} →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Nasıl çalışır */}
      <div style={{ background: '#faf9f6', borderTop: '1px solid rgba(26,26,24,.08)', borderBottom: '1px solid rgba(26,26,24,.08)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>NASIL ÇALIŞIR</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
              3 adımda başla.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem', borderRight: i < 2 ? '1px solid rgba(26,26,24,.08)' : 'none' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 48, fontWeight: 800, color: 'rgba(26,26,24,.08)', margin: '0 0 1rem', letterSpacing: -2 }}>{step.n}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#1a1a18', margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ maxWidth: '100%', padding: '5rem 8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>BAŞARI HİKAYELERİ</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
            Gerçek insanlar, gerçek sonuçlar.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '1.75rem' }}>
              <p style={{ fontSize: 14, color: 'rgba(26,26,24,.65)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "{t.quote}"
              </p>
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
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 800, color: 'white', letterSpacing: -2.5, margin: '0 0 1rem', lineHeight: 1.05 }}>
          Her büyük startup bir<br />
          <em style={{ color: '#C4500A', fontStyle: 'normal' }}>eksiklikle</em> başladı.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', marginBottom: '2.5rem' }}>
          Seninki de burada başlasın.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/auth/register" style={{ background: '#C4500A', color: 'white', padding: '14px 36px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 600 }}>
            Ücretsiz kaydol
          </a>
          <a href="/fiyatlandirma" style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', padding: '14px 36px', borderRadius: 8, fontSize: 15, textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(255,255,255,.12)' }}>
            Planları incele
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(26,26,24,.08)', padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 800, color: 'rgba(26,26,24,.4)' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Kurslar', '/kurslar'], ['Fiyatlandırma', '/fiyatlandirma'], ['Kurumsal', '/kurumsal'], ['Kayıt ol', '/auth/register']].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: 13, color: 'rgba(26,26,24,.35)', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.2)', letterSpacing: 1 }}>© 2026 CAMPUSWE</span>
      </div>
    </div>
  )
}