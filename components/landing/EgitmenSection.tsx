'use client'

import { useEffect, useRef, useState } from 'react'

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); observer.disconnect() }
    }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}

function useCountUp(target: number, duration = 1500, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [active, target])
  return count
}

const STEPS = [
  { n: '01', icon: '👤', title: 'Kayıt ol', desc: 'Ücretsiz hesap oluştur, eğitmen profilini kur.' },
  { n: '02', icon: '🎬', title: 'Kurs oluştur', desc: 'Bölüm ve derslerini ekle, YouTube videolarını göm.' },
  { n: '03', icon: '🚀', title: 'Yayınla', desc: 'Bir tıkla yayınla, binlerce öğrenciye ulaş.' },
  { n: '04', icon: '💰', title: 'Kazan', desc: 'Her kayıt için %75 komisyon otomatik hesaplanır.' },
]

const BENEFITS = [
  { icon: '💸', title: '%75 Gelir Payı', desc: 'Her satışın büyük çoğunluğu senin. Platform sadece %25 alır.' },
  { icon: '♾️', title: 'Sınırsız Öğrenci', desc: 'Bir kez oluştur, sonsuz kez sat. Pasif gelir makinesi.' },
  { icon: '🎯', title: 'Hedef Kitle Hazır', desc: 'Binlerce girişimci ve startup kurucusu seni bekliyor.' },
  { icon: '🛠️', title: 'Kolay Araçlar', desc: 'Bölüm, ders, video — hepsini dakikalar içinde kur.' },
  { icon: '📊', title: 'Detaylı Analitik', desc: 'Öğrenci sayısı, gelir, puan — her şeyi takip et.' },
  { icon: '🏆', title: 'Eğitmen Rozeti', desc: 'Profilinde öne çıkan rozet — toplulukta tanınırlık kazan.' },
]

const FAQS = [
  { q: 'Kurs oluşturmak ücretli mi?', a: 'Tamamen ücretsiz. Hiçbir ön ödeme yok.' },
  { q: 'Videoları nasıl yüklerim?', a: 'YouTube\'a yükleyip linkini yapıştırıyorsun. Hem kolay hem ücretsiz.' },
  { q: 'Ne zaman para alırım?', a: 'Ödeme sistemi aktif olduğunda her satıştan anında gelir.' },
  { q: 'Kaç kurs oluşturabilirim?', a: 'Sınır yok. İstediğin kadar kurs, bölüm ve ders ekleyebilirsin.' },
]

export default function EgitmenSection() {
  const { ref: headerRef, inView: headerVisible } = useInView(0.1)
  const { ref: stepsRef, inView: stepsVisible } = useInView(0.1)
  const { ref: benefitsRef, inView: benefitsVisible } = useInView(0.1)
  const { ref: simRef, inView: simVisible } = useInView(0.1)
  const { ref: faqRef, inView: faqVisible } = useInView(0.1)

  const [students, setStudents] = useState(50)
  const [price, setPrice] = useState(199)
  const earning = Math.round(students * price * 0.75)

  const s1 = useCountUp(500, 1500, headerVisible)
  const s2 = useCountUp(75, 1500, headerVisible)
  const s3 = useCountUp(50, 1500, headerVisible)

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div>
      {/* Hero başlık */}
      <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(196,80,10,.15)', border: '1px solid rgba(196,80,10,.3)',
          borderRadius: 999, padding: '6px 18px', marginBottom: '1.5rem',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A', animation: 'float1 2s infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase' }}>EĞİTMEN PLATFORMU</span>
        </div>

        <h2 style={{
          fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 800,
          letterSpacing: -2, lineHeight: 1.1, color: 'white',
          marginBottom: '1.5rem',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s ease 0.1s',
        }}>
          Bilgini paylaş,<br />
          <span style={{
            background: 'linear-gradient(90deg, #C4500A, #ff8c4b, #C4500A)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: headerVisible ? 'shimmer 3s linear infinite' : 'none',
          }}>her ay düzenli gelir kazan.</span>
        </h2>

        <p style={{
          fontSize: 17, color: 'rgba(255,255,255,.45)', maxWidth: 520,
          margin: '0 auto 3rem', lineHeight: 1.8,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.2s',
        }}>
          CampusWe'de kurs oluştur, Türkiye'nin en büyük girişimci topluluğuna öğret ve kazanmaya başla.
        </p>

        {/* İstatistikler */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '4rem',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.3s',
        }}>
          {[
            { n: s1 + '+', l: 'Aktif öğrenci' },
            { n: '%' + s2, l: 'Eğitmen gelir payı' },
            { n: s3 + '+', l: 'Yayınlanan kurs' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, color: '#C4500A', margin: 0 }}>{s.n}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.3)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Kazanç simülatörü */}
      <div ref={simRef} style={{
        background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,80,10,.2)',
        borderRadius: 20, padding: '3rem', marginBottom: '5rem',
        opacity: simVisible ? 1 : 0,
        transform: simVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.8s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>GELİR SİMÜLATÖRÜ</p>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>Kazancını hesapla</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          {/* Slider 1 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: 1, textTransform: 'uppercase' }}>Öğrenci sayısı</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#C4500A' }}>{students}</span>
            </div>
            <input type="range" min={5} max={500} value={students}
              onChange={e => setStudents(+e.target.value)}
              style={{ width: '100%', accentColor: '#C4500A', height: 4, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>5</span>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>500</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: 1, textTransform: 'uppercase' }}>Kurs fiyatı</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#C4500A' }}>₺{price}</span>
            </div>
            <input type="range" min={29} max={999} step={10} value={price}
              onChange={e => setPrice(+e.target.value)}
              style={{ width: '100%', accentColor: '#C4500A', height: 4, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>₺29</span>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>₺999</span>
            </div>
          </div>

          {/* Sonuç */}
          <div style={{
            background: 'rgba(196,80,10,.12)', border: '1px solid rgba(196,80,10,.3)',
            borderRadius: 16, padding: '1.5rem', textAlign: 'center',
            boxShadow: '0 0 30px rgba(196,80,10,.2)',
            animation: 'pulse-glow 2s infinite',
          }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>AYLAK KAZANCIN</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 42, fontWeight: 800, color: '#C4500A', margin: 0, lineHeight: 1, transition: 'all 0.3s ease' }}>
              ₺{earning.toLocaleString('tr-TR')}
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 8 }}>%75 × {students} öğrenci × ₺{price}</p>
          </div>
        </div>
      </div>

      {/* Nasıl çalışır */}
      <div ref={stepsRef} style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>SÜREÇ</p>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: 'white', margin: 0 }}>4 adımda başla</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {STEPS.map((step, i) => (
            <div key={i} className="egitmen-card" style={{
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 16, padding: '2rem 1.5rem', textAlign: 'center',
              opacity: stepsVisible ? 1 : 0,
              transform: stepsVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 0.6s ease ${i * 0.1}s`,
            }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(196,80,10,.15)', border: '1px solid rgba(196,80,10,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 24 }}>
                {step.icon}
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#C4500A', letterSpacing: 2, marginBottom: 8 }}>{step.n}</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>{step.title}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Faydalar */}
      <div ref={benefitsRef} style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>NEDEN CAMPUSWE</p>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: 'white', margin: 0 }}>Eğitmen olmanın avantajları</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {BENEFITS.map((b, i) => (
            <div key={i} className="egitmen-card" style={{
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 16, padding: '1.75rem',
              opacity: benefitsVisible ? 1 : 0,
              transform: benefitsVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 0.6s ease ${i * 0.08}s`,
            }}>
              <div style={{ fontSize: 28, marginBottom: '1rem' }}>{b.icon}</div>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>{b.title}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SSS */}
      <div ref={faqRef} style={{ maxWidth: 700, margin: '0 auto 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>SORULAR</p>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: 'white', margin: 0 }}>Sıkça sorulanlar</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,.04)', border: `1px solid ${openFaq === i ? 'rgba(196,80,10,.4)' : 'rgba(255,255,255,.08)'}`,
              borderRadius: 12, overflow: 'hidden',
              opacity: faqVisible ? 1 : 0,
              transform: faqVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease ${i * 0.1}s`,
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 600, color: 'white', textAlign: 'left' }}>{faq.q}</span>
                <span style={{ color: '#C4500A', fontSize: 20, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 1.5rem 1.25rem' }}>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, color: 'white', marginBottom: '1rem', letterSpacing: -1 }}>
          Hazır mısın?
        </h3>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', marginBottom: '2.5rem' }}>
          Ücretsiz başla. Kredi kartı gerekmez.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <a href="/auth/register" style={{
            background: '#C4500A', color: 'white', padding: '16px 40px',
            borderRadius: 10, fontSize: 16, textDecoration: 'none', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 8px 32px rgba(196,80,10,.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(196,80,10,.6)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(196,80,10,.4)' }}
          >
            Eğitmen olarak başla →
          </a>
          <a href="/kurslar" style={{
            background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)',
            padding: '16px 40px', borderRadius: 10, fontSize: 16,
            textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(255,255,255,.12)',
          }}>
            Kursları keşfet
          </a>
        </div>
      </div>
    </div>
  )
}