'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Check, Zap, Star, Shield, RefreshCw, ArrowRight, TrendingUp, MessageCircle, Heart } from 'lucide-react'

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

const PRO_FEATURES = [
  { icon: Star, text: 'Öncelikli Demo Day başvurusu', desc: 'Yatırımcılar önünde ilk sıraya geç' },
  { icon: MessageCircle, text: 'Yatırımcılarla direkt mesaj', desc: 'Platforma kayıtlı yatırımcılara ulaş' },
  { icon: Zap, text: 'Sınırsız takas teklifi', desc: 'Ayda 5 yerine sınırsız hizmet takas et' },
  { icon: TrendingUp, text: 'Gelişmiş co-founder eşleştirme', desc: 'Yapay zeka destekli eşleştirme algoritması' },
  { icon: Heart, text: 'Pro rozeti', desc: 'Profilinde öne çık, güven kazan' },
  { icon: Shield, text: 'Özel içeriklere erişim', desc: 'Pro üyelere özel kaynaklar ve kurslar' },
]

const COMPARE = [
  { feature: 'Takas teklifi', free: '5/ay', pro: 'Sınırsız' },
  { feature: 'Demo Day önceliği', free: false, pro: true },
  { feature: 'Yatırımcı mesajı', free: false, pro: true },
  { feature: 'Co-founder eşleştirme', free: 'Temel', pro: 'Gelişmiş' },
  { feature: 'Pro rozeti', free: false, pro: true },
  { feature: 'Özel içerikler', free: false, pro: true },
  { feature: 'Kurs oluşturma', free: true, pro: true },
  { feature: 'Startup sayfası', free: true, pro: true },
  { feature: 'Topluluk akışı', free: true, pro: true },
]

const TESTIMONIALS = [
  { quote: 'Pro\'ya geçtikten 3 hafta sonra Demo Day\'de yatırımcıyla pitch yaptım. Seed turumuzu kapattık.', name: 'Kaan D.', meta: 'AgriTech Kurucusu', emoji: '🌱' },
  { quote: 'Sınırsız takas sayesinde tasarımımı, SEO\'umu ve copywriting\'imi hallettim — hiç para harcamadan.', name: 'Selin A.', meta: 'SaaS Kurucusu', emoji: '💻' },
  { quote: 'Yatırımcı mesajı özelliğiyle 5 yatırımcıya ulaştım. 2\'si ile hâlâ görüşüyoruz.', name: 'Mert Y.', meta: 'FinTech Kurucusu', emoji: '💰' },
]

export default function ProUpgradePage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [visible, setVisible] = useState(false)
  const s1 = useCountUp(847)
  const s2 = useCountUp(3)
  const s3 = useCountUp(92)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const monthlyPrice = 99
  const yearlyPrice = 899
  const currentPrice = billing === 'monthly' ? monthlyPrice : Math.round(yearlyPrice / 12)

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-in { animation: fadeIn 0.6s ease both; }
        .cta-btn { transition: all 0.2s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,80,10,.3); }
        .feature-card { transition: all 0.2s; }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(26,26,24,.08); border-color: rgba(196,80,10,.25); }
        .toggle-btn { transition: all 0.2s; }
        .testimonial-card { transition: all 0.2s; }
        .testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,26,24,.08); }
        .nav-link { transition: color 0.15s; }
        .nav-link:hover { color: #1a1a18 !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 4rem', borderBottom: '1px solid rgba(26,26,24,.1)', background: 'rgba(245,240,232,.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/fiyatlandirma" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Fiyatlandırma</Link>
          <Link href="/auth/login" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Giriş yap</Link>
          <Link href="/auth/register" className="cta-btn" style={{ background: '#C4500A', color: 'white', padding: '8px 20px', borderRadius: 6, fontSize: 13, textDecoration: 'none', fontWeight: 500, display: 'inline-block' }}>
            Kayıt ol →
          </Link>
        </div>
      </nav>

      {/* Hero — split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid rgba(26,26,24,.1)', minHeight: 580, opacity: visible ? 1 : 0, transition: 'opacity 0.7s' }}>

        {/* Sol — motivasyon */}
        <div style={{ background: '#1a1a18', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,.03) 79px,rgba(255,255,255,.03) 80px)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="fade-up" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(196,80,10,.15)', border: '1px solid rgba(196,80,10,.3)', borderRadius: 999, padding: '5px 14px', marginBottom: '1.5rem' }}>
              <Zap size={11} color="#C4500A" />
              <span style={{ fontSize: 10, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>Pro Üyelik</span>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 50, fontWeight: 800, color: 'white', letterSpacing: -2.5, lineHeight: 1.05, margin: '0 0 1.25rem' }}>
              Startup'ını<br />
              <em style={{ color: '#C4500A', fontStyle: 'normal' }}>hızlandır.</em>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', lineHeight: 1.8, maxWidth: 400, marginBottom: '2.5rem' }}>
              Yatırımcılara ulaş, sınırsız takas yap, Demo Day'de öne çık. Pro olmak startup yolculuğunu değiştirir.
            </p>
          </div>

          {/* Sosyal kanıt sayaçları */}
          <div className="fade-in" style={{ animationDelay: '0.4s', display: 'flex', gap: 28, marginBottom: '2.5rem' }}>
            {[
              { ref: s1.ref, count: s1.count, suffix: '+', label: 'Pro üye' },
              { ref: s2.ref, count: s2.count, suffix: 'x', label: 'Daha hızlı büyüme' },
              { ref: s3.ref, count: s3.count, suffix: '%', label: 'Memnuniyet' },
            ].map((s, i) => (
              <div key={i} ref={s.ref}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: '#C4500A', margin: 0, letterSpacing: -1 }}>
                  {s.count.toLocaleString()}{s.suffix}
                </p>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', margin: '2px 0 0', letterSpacing: 1 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Alıntı */}
          <div className="fade-in" style={{ animationDelay: '0.6s', borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1.5rem' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'rgba(255,255,255,.35)', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 0.75rem' }}>
              "Pro üyelik sadece bir ürün değil — doğru insanlara ulaşmanın en hızlı yolu."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 2, height: 20, background: '#C4500A', borderRadius: 1 }} />
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 1 }}>CAMPUSWE PRO · 2026</span>
            </div>
          </div>
        </div>

        {/* Sağ — plan kartı */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
          <div className="fade-up" style={{ animationDelay: '0.3s', width: '100%', maxWidth: 400 }}>
            {/* Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', background: 'white', border: '1px solid rgba(26,26,24,.12)', borderRadius: 999, padding: 3, gap: 3 }}>
                {[{ key: 'monthly', label: 'Aylık' }, { key: 'yearly', label: 'Yıllık' }].map(b => (
                  <button key={b.key} onClick={() => setBilling(b.key as any)} className="toggle-btn"
                    style={{ padding: '7px 20px', borderRadius: 999, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: billing === b.key ? '#1a1a18' : 'transparent', color: billing === b.key ? 'white' : 'rgba(26,26,24,.5)' }}>
                    {b.label}
                    {b.key === 'yearly' && <span style={{ marginLeft: 5, fontSize: 10, background: '#C4500A', color: 'white', padding: '1px 5px', borderRadius: 999, fontFamily: 'monospace' }}>-24%</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', border: '2px solid rgba(26,26,24,.1)', borderRadius: 20, padding: '2rem', boxShadow: '0 8px 32px rgba(26,26,24,.08)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(196,80,10,.08)', border: '1px solid rgba(196,80,10,.15)', borderRadius: 999, padding: '4px 12px', marginBottom: 12 }}>
                  <Zap size={11} color="#C4500A" />
                  <span style={{ fontSize: 10, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>PRO</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 48, fontWeight: 800, color: '#1a1a18', letterSpacing: -2, transition: 'all 0.3s' }}>₺{currentPrice}</span>
                  <span style={{ fontSize: 14, color: 'rgba(26,26,24,.4)' }}>/ay</span>
                </div>
                {billing === 'yearly' && (
                  <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#22c55e', margin: '4px 0 0' }}>₺{yearlyPrice} yıllık · 2 ay ücretsiz 🎉</p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                {PRO_FEATURES.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(26,26,24,.04)' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={11} color="#C4500A" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18', margin: 0 }}>{f.text}</p>
                      <p style={{ fontSize: 11, color: 'rgba(26,26,24,.4)', margin: 0 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="cta-btn" onClick={() => alert('Ödeme sistemi yakında aktif olacak! 🚀 Şu an beta sürecindeyiz.')} style={{ width: '100%', padding: '14px', background: '#C4500A', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>
                Pro'ya geç — ₺{currentPrice}/ay →
              </button>

              <div style={{ background: 'rgba(196,80,10,.04)', border: '1px solid rgba(196,80,10,.1)', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: 'rgba(26,26,24,.5)', margin: 0, textAlign: 'center', fontFamily: 'monospace' }}>
                  🔜 Ödeme sistemi yakında aktif — Beta sürecinde ücretsiz dene
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                {[{ icon: Shield, text: 'Güvenli ödeme' }, { icon: RefreshCw, text: 'İstediğin zaman iptal' }].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(26,26,24,.35)' }}>
                    <b.icon size={11} color="#C4500A" />
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro'suz vs Pro'lu karşılaştırma */}
      <div style={{ padding: '5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>KARŞILAŞTIRMA</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
            Farkı görün.
          </h2>
        </div>
        <div style={{ border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, overflow: 'hidden', background: 'white' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid rgba(26,26,24,.08)' }}>
            <div style={{ padding: '1rem 1.5rem' }} />
            <div style={{ padding: '1rem', textAlign: 'center', borderLeft: '1px solid rgba(26,26,24,.08)' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', margin: 0, letterSpacing: 1 }}>ÜCRETSİZ</p>
            </div>
            <div style={{ padding: '1rem', textAlign: 'center', background: '#1a1a18', borderLeft: '1px solid rgba(255,255,255,.06)' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', margin: 0, letterSpacing: 1 }}>PRO ⚡</p>
            </div>
          </div>
          {COMPARE.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid rgba(26,26,24,.04)', background: i % 2 === 0 ? 'rgba(26,26,24,.015)' : 'white' }}>
              <div style={{ padding: '0.9rem 1.5rem', fontSize: 13, color: 'rgba(26,26,24,.65)' }}>{row.feature}</div>
              <div style={{ padding: '0.9rem', textAlign: 'center', borderLeft: '1px solid rgba(26,26,24,.06)' }}>
                {row.free === true ? <span style={{ color: '#22c55e' }}>✓</span>
                  : row.free === false ? <span style={{ color: 'rgba(26,26,24,.15)' }}>—</span>
                  : <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'rgba(26,26,24,.5)' }}>{row.free}</span>}
              </div>
              <div style={{ padding: '0.9rem', textAlign: 'center', background: 'rgba(26,26,24,.97)', borderLeft: '1px solid rgba(255,255,255,.04)' }}>
                {row.pro === true ? <span style={{ color: '#C4500A' }}>✓</span>
                  : <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'rgba(255,255,255,.6)' }}>{row.pro}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 özellik kartı */}
      <div style={{ padding: '0 4rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>PRO ÖZELLİKLERİ</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
            Her şey dahil.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {PRO_FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.08)', borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(196,80,10,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <f.icon size={18} color="#C4500A" />
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: '#1a1a18', margin: '0 0 6px' }}>{f.text}</h3>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Başarı hikayeleri */}
      <div style={{ background: '#1a1a18', padding: '5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>BAŞARI HİKAYELERİ</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: 'white', margin: 0, letterSpacing: -1.5 }}>
            Pro üyeler ne diyor?
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '1.5rem' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.25rem' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(196,80,10,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.emoji}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'white', margin: 0 }}>{t.name}</p>
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
            Aklındaki sorular
          </h2>
          {[
            { q: 'Pro üyeliği iptal edebilir miyim?', a: 'Evet, istediğin zaman. Kalan süren boyunca Pro özellikleri aktif kalır.' },
            { q: 'Yıllık planla ne kadar tasarruf ederim?', a: 'Yıllık planla 2 ay ücretsiz alırsın — toplamda %24 tasarruf.' },
            { q: 'Ödeme güvenli mi?', a: 'Tüm ödemeler SSL ile şifreleniyor. Kart bilgilerin bizde saklanmıyor.' },
            { q: 'Pro özellikler hemen aktif mi?', a: 'Evet, ödeme onaylandıktan sonra tüm Pro özelliklere anında erişirsin.' },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(26,26,24,.08)', padding: '1.25rem 0' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, color: '#1a1a18', margin: '0 0 6px' }}>{item.q}</p>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.55)', margin: 0, lineHeight: 1.7 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alt CTA */}
      <div style={{ background: '#1a1a18', padding: '5rem 4rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1.5rem' }}>HAZIR MISIN</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 48, fontWeight: 800, color: 'white', letterSpacing: -2, margin: '0 0 1rem', lineHeight: 1.05 }}>
          Bir adım kaldı.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', marginBottom: '2rem' }}>
          847 girişimci zaten Pro. Sıra sende.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="cta-btn" onClick={() => alert('Ödeme sistemi yakında aktif olacak! 🚀 Şu an beta sürecindeyiz.')} style={{ background: '#C4500A', color: 'white', padding: '14px 36px', borderRadius: 8, border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Pro'ya geç — ₺{currentPrice}/ay →
          </button>
          <Link href="/fiyatlandirma" style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', padding: '14px 36px', borderRadius: 8, border: '1px solid rgba(255,255,255,.12)', fontSize: 15, textDecoration: 'none', fontWeight: 500, display: 'inline-block' }}>
            Planları karşılaştır
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(26,26,24,.08)', padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 800, color: 'rgba(26,26,24,.4)', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Ana sayfa', '/'], ['Fiyatlandırma', '/fiyatlandirma'], ['Kurumsal', '/kurumsal']].map(([l, h]) => (
            <Link key={h} href={h} style={{ fontSize: 13, color: 'rgba(26,26,24,.35)', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.2)', letterSpacing: 1 }}>© 2026 CAMPUSWE</span>
      </div>
    </div>
  )
}