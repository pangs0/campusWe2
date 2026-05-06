'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check, Users, TrendingUp, Building2, Calendar, Star, ArrowRight, Zap, Shield, BarChart2, Briefcase, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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

function useScrollFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

const NAV_LINKS = [
  { href: '/', label: 'Ana sayfa' },
  { href: '/kurslar', label: 'Kurslar' },
  { href: '/fiyatlandirma', label: 'Fiyatlandırma' },
  { href: '/kurumsal', label: 'Kurumsal' },
]

const BENEFITS = [
  {
    icon: Users,
    title: 'Yetenek Keşfi',
    desc: '12.000\'den fazla girişimci profili arasından filtreli arama. Üniversite, yetenek, karma skoru — istediğin kritere göre.',
    stat: '12K+',
    statLabel: 'Aktif profil',
    color: '#C4500A',
    bg: 'rgba(196,80,10,.06)',
  },
  {
    icon: Calendar,
    title: 'Demo Day Sponsorluğu',
    desc: 'Şirket olarak Demo Day\'e sponsor ol. Startup\'ların pitch\'lerini izle, potansiyel iş ortaklarını keşfet.',
    stat: '86+',
    statLabel: 'Demo Day pitch',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,.06)',
  },
  {
    icon: Building2,
    title: 'Markalı Kuluçka Katı',
    desc: 'Platformda şirket adına özel bir alan. Etkinlik düzenle, ilan paylaş, startup\'larla doğrudan iletişim kur.',
    stat: '340+',
    statLabel: 'Üniversite',
    color: '#0369a1',
    bg: 'rgba(3,105,161,.06)',
  },
  {
    icon: BarChart2,
    title: 'Analitik Panel',
    desc: 'Kaç profil incelendi, kaç başvuru geldi, hangi yetenekler öne çıkıyor — aylık detaylı raporlama.',
    stat: '%94',
    statLabel: 'Memnuniyet',
    color: '#059669',
    bg: 'rgba(5,150,105,.06)',
  },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Başvur', desc: 'Formu doldur, 24 saat içinde seni arayalım.' },
  { n: '02', title: 'Profil oluştur', desc: 'Şirket sayfanı kur, logonu ekle, açıklama yaz.' },
  { n: '03', title: 'Yetenek keşfet', desc: 'Filtreleyerek aday bul, pipeline\'a ekle.' },
  { n: '04', title: 'Ekibe katıl', desc: 'Doğru yetenekle iletişime geç, işe al.' },
]

const TESTIMONIALS = [
  { quote: 'CampusWe sayesinde 3 ayda 4 stajyer aldık. Hepsi tam aradığımız profildeydi.', name: 'Ayşe Kara', meta: 'Trendyol · İK Direktörü', emoji: '🛍️' },
  { quote: 'Demo Day sponsorluğu mükemmeldi. Startup ekosistemiyle bağlantı kurmak bu kadar kolay olmamıştı.', name: 'Can Öztürk', meta: 'Arçelik · İnovasyon Müdürü', emoji: '⚡' },
  { quote: 'Markalı kuluçka katımız sayesinde üniversiteli yeteneklere direkt ulaşıyoruz.', name: 'Selin Yılmaz', meta: 'Turkcell · Teknoloji Partneri', emoji: '📱' },
]

const PACKAGES = [
  {
    title: 'Starter',
    price: 'İletişime geç',
    color: '#0369a1',
    bg: 'white',
    textColor: '#1a1a18',
    features: ['Şirket profili', 'Yetenek keşfi (50 profil/ay)', '2 iş ilanı', 'Temel analitik', 'Email destek'],
  },
  {
    title: 'Growth',
    price: 'İletişime geç',
    color: '#C4500A',
    bg: '#1a1a18',
    textColor: 'white',
    featured: true,
    features: ['Şirket profili', 'Sınırsız yetenek keşfi', 'Sınırsız ilan', 'Demo Day sponsorluğu', 'Gelişmiş analitik', 'Öncelikli destek', 'Aylık rapor'],
  },
  {
    title: 'Enterprise',
    price: 'Özel fiyat',
    color: '#7c3aed',
    bg: 'white',
    textColor: '#1a1a18',
    features: ['Markalı kuluçka katı', 'API erişimi', 'Özel entegrasyonlar', 'Account manager', 'SLA garantisi', 'Özel etkinlik', 'Tüm Growth özellikleri'],
  },
]

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function ROICalculator() {
  const [hires, setHires] = useState(5)
  const [salary, setSalary] = useState(15000)
  const traditional = hires * salary * 0.15
  const campuswe = 899
  const saving = Math.max(0, Math.round(traditional - campuswe))

  return (
    <div style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
          YILLIK İŞE ALIM HEDEFİ: <strong style={{ color: '#C4500A' }}>{hires} kişi</strong>
        </label>
        <input type="range" min={1} max={50} value={hires} onChange={e => setHires(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#C4500A' }} />
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
          ORTALAMA MAAŞ: <strong style={{ color: '#C4500A' }}>₺{salary.toLocaleString()}</strong>
        </label>
        <input type="range" min={5000} max={100000} step={1000} value={salary} onChange={e => setSalary(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#C4500A' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(26,26,24,.04)', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', margin: '0 0 4px', letterSpacing: 1 }}>GELENEKSEL</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 800, color: '#dc2626', margin: 0 }}>₺{Math.round(traditional).toLocaleString()}</p>
        </div>
        <div style={{ background: 'rgba(196,80,10,.06)', borderRadius: 10, padding: '1rem', textAlign: 'center', border: '1px solid rgba(196,80,10,.15)' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', margin: '0 0 4px', letterSpacing: 1 }}>CAMPUSWE</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 800, color: '#C4500A', margin: 0 }}>₺{campuswe.toLocaleString()}</p>
        </div>
      </div>
      <div style={{ background: '#1a1a18', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.4)', margin: '0 0 4px', letterSpacing: 1 }}>YILLIK TASARRUF</p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: '#22c55e', margin: 0 }}>₺{saving.toLocaleString()}</p>
      </div>
    </div>
  )
}

function SSQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(26,26,24,.08)', overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: '#1a1a18' }}>{q}</span>
        <span style={{ fontSize: 20, color: '#C4500A', transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0)', flexShrink: 0, marginLeft: 16 }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: 14, color: 'rgba(26,26,24,.6)', lineHeight: 1.8, margin: '0 0 1.25rem', paddingRight: '2rem' }}>{a}</p>
      )}
    </div>
  )
}

export default function KurumsalPage() {
  const pathname = usePathname()
  const supabase = createClient()
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', sector: '', size: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [visible, setVisible] = useState(false)

  const s1 = useCountUp(12000)
  const s2 = useCountUp(340)
  const s3 = useCountUp(86)
  const s4 = useCountUp(94)

  const hero = useScrollFadeUp()
  const benefits = useScrollFadeUp()
  const howIt = useScrollFadeUp()
  const packages = useScrollFadeUp()
  const formSection = useScrollFadeUp()

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('corporate_applications').insert({
      company_name: form.company,
      contact_name: form.name,
      email: form.email,
      phone: form.phone,
      sector: form.sector,
      company_size: form.size,
      message: form.message,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .scroll-fade { transition: opacity 0.7s ease, transform 0.7s ease; }
        .scroll-fade.hidden { opacity: 0; transform: translateY(24px); }
        .scroll-fade.shown { opacity: 1; transform: translateY(0); }
        .benefit-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .benefit-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26,26,24,.1); }
        .nav-link { transition: color 0.15s; position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1.5px; background: #C4500A; transition: width 0.2s; }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #1a1a18 !important; }
        .nav-link.active { color: #C4500A !important; }
        .nav-link.active::after { width: 100%; }
        .cta-btn { transition: all 0.2s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,80,10,.25); }
        .step-card { transition: all 0.2s; }
        .step-card:hover { background: white; box-shadow: 0 4px 16px rgba(26,26,24,.06); }
        .pkg-card { transition: transform 0.2s, box-shadow 0.2s; }
        .pkg-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(26,26,24,.12); }
        .testimonial-card { transition: all 0.2s; }
        .testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,26,24,.08); }
        .input-field { width: 100%; padding: 10px 14px; border: 1px solid rgba(26,26,24,.15); borderRadius: 8px; background: white; font-size: 14px; color: #1a1a18; outline: none; transition: border-color 0.2s; font-family: Inter, sans-serif; }
        .input-field:focus { border-color: #C4500A; }
      `}</style>

      {/* Nav */}
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
          <Link href="/auth/register" className="cta-btn" style={{ background: '#C4500A', color: '#F5F0E8', padding: '8px 20px', borderRadius: 6, fontSize: 13, textDecoration: 'none', fontWeight: 500, display: 'inline-block' }}>
            Kayıt ol →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid rgba(26,26,24,.1)', opacity: visible ? 1 : 0, transition: 'opacity 0.7s' }}>
        <div style={{ padding: '5rem 4rem 4rem 4rem', borderRight: '1px solid rgba(26,26,24,.08)' }}>
          <div className="fade-up" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(196,80,10,.08)', border: '1px solid rgba(196,80,10,.2)', borderRadius: 999, padding: '5px 14px', marginBottom: '1.5rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A' }} />
              <span style={{ fontSize: 10, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>Kurumsal Çözümler</span>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 800, color: '#1a1a18', letterSpacing: -2.5, lineHeight: 1.05, margin: '0 0 1.5rem' }}>
              Geleceğin ekibini<br />
              <em style={{ color: '#C4500A', fontStyle: 'normal' }}>bugün keşfet.</em>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(26,26,24,.55)', lineHeight: 1.8, maxWidth: 480, marginBottom: '2.5rem' }}>
              12.000'den fazla üniversiteli girişimci ve yetenekli profil. Demo Day'e sponsor ol, markalı kuluçka katı aç, doğru insanları bul.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => scrollToSection('basvuru')} className="cta-btn" style={{ background: '#C4500A', color: 'white', padding: '13px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Başvuru yap →
              </button>
              <button onClick={() => scrollToSection('paketler')} className="cta-btn" style={{ background: 'white', color: '#1a1a18', padding: '13px 28px', borderRadius: 8, fontSize: 14, fontWeight: 500, border: '1px solid rgba(26,26,24,.15)', cursor: 'pointer' }}>
                Paketleri gör
              </button>
            </div>
          </div>
        </div>

        {/* Sağ — sayaçlar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {[
            { ref: s1.ref, count: s1.count, suffix: 'K+', label: 'Aktif girişimci', icon: '🚀', border: '0 0 1px 0' },
            { ref: s2.ref, count: s2.count, suffix: '+', label: 'Üniversite', icon: '🎓', border: '0 0 1px 1px' },
            { ref: s3.ref, count: s3.count, suffix: '+', label: 'Demo Day pitch', icon: '🎯', border: '0', borderRight: '1px solid rgba(26,26,24,.08)' },
            { ref: s4.ref, count: s4.count, suffix: '%', label: 'Şirket memnuniyeti', icon: '⭐', border: '0' },
          ].map((s, i) => (
            <div key={i} ref={s.ref} style={{ padding: '2.5rem', borderBottom: i < 2 ? '1px solid rgba(26,26,24,.08)' : 'none', borderRight: i % 2 === 0 ? '1px solid rgba(26,26,24,.08)' : 'none', borderLeft: '1px solid rgba(26,26,24,.08)' }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{s.icon}</span>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#C4500A', margin: 0, letterSpacing: -1 }}>
                {s.count.toLocaleString()}{s.suffix}
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', margin: '4px 0 0', letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Faydalar */}
      <div ref={benefits.ref} className={`scroll-fade ${benefits.visible ? 'shown' : 'hidden'}`}
        style={{ padding: '5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>NEDEN CAMPUSWE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
            Şirketiniz için güçlü araçlar.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {BENEFITS.map((b, i) => (
            <div key={i} className="benefit-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.08)', borderRadius: 16, padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, flexShrink: 0 }}>
                <b.icon size={20} color={b.color} />
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#1a1a18', margin: '0 0 8px' }}>{b.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.55)', lineHeight: 1.7, flex: 1, margin: '0 0 16px' }}>{b.desc}</p>
              <div style={{ paddingTop: 16, borderTop: '1px solid rgba(26,26,24,.06)' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 800, color: b.color, margin: 0 }}>{b.stat}</p>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', margin: '2px 0 0', letterSpacing: 1 }}>{b.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nasıl çalışır */}
      <div ref={howIt.ref} className={`scroll-fade ${howIt.visible ? 'shown' : 'hidden'}`}
        style={{ background: '#1a1a18', padding: '5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>NASIL ÇALIŞIR</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: 'white', margin: 0, letterSpacing: -1.5 }}>
            4 adımda başla.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="step-card" style={{ padding: '2rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,.06)' : 'none', textAlign: 'center', borderRadius: 12 }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 800, color: 'rgba(255,255,255,.08)', margin: '0 0 1rem', letterSpacing: -2 }}>{step.n}</p>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', margin: 0, lineHeight: 1.7 }}>{step.desc}</p>
              {i < 3 && (
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                  <ChevronRight size={16} color="rgba(255,255,255,.2)" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Paketler */}
      <div id="paketler" ref={packages.ref} className={`scroll-fade ${packages.visible ? 'shown' : 'hidden'}`}
        style={{ padding: '5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>PAKETLER</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
            Şirketinize özel çözüm.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {PACKAGES.map((pkg, i) => (
            <div key={i} className="pkg-card" style={{ background: pkg.bg, border: pkg.featured ? `2px solid ${pkg.color}` : '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', marginTop: pkg.featured ? -12 : 0 }}>
              {pkg.featured && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#C4500A', color: 'white', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, padding: '4px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                  EN POPÜLER
                </div>
              )}
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: pkg.featured ? 'rgba(255,255,255,.3)' : 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 8px' }}>{pkg.title.toUpperCase()}</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: pkg.textColor, margin: '0 0 4px' }}>{pkg.price}</p>
              <div style={{ flex: 1, margin: '1.5rem 0' }}>
                {pkg.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: `1px solid ${pkg.featured ? 'rgba(255,255,255,.06)' : 'rgba(26,26,24,.04)'}` }}>
                    <Check size={13} color={pkg.color} />
                    <span style={{ fontSize: 13, color: pkg.featured ? 'rgba(255,255,255,.7)' : 'rgba(26,26,24,.65)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollToSection('basvuru')} className="cta-btn" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '12px', borderRadius: 8, background: pkg.featured ? '#C4500A' : 'transparent', color: pkg.featured ? 'white' : pkg.color, fontSize: 14, fontWeight: 500, border: pkg.featured ? 'none' : `1.5px solid ${pkg.color}`, cursor: 'pointer' }}>
                Hemen başvur →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: '0 4rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>REFERANSLAR</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
            Şirketler ne diyor?
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ background: 'white', border: '1px solid rgba(26,26,24,.08)', borderRadius: 16, padding: '1.75rem' }}>
              <p style={{ fontSize: 14, color: 'rgba(26,26,24,.65)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '1.5rem' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(196,80,10,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{t.emoji}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', margin: 0 }}>{t.name}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', margin: 0 }}>{t.meta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Başvuru Formu */}

      {/* Karşılaştırma tablosu */}
      <div style={{ padding: '5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>KARŞILAŞTIRMA</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
            Hangi paket size uygun?
          </h2>
        </div>
        <div style={{ border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, overflow: 'hidden', background: 'white' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(26,26,24,.08)' }}>
            <div style={{ padding: '1.25rem 1.5rem' }} />
            {['Starter', 'Growth', 'Enterprise'].map((p, i) => (
              <div key={i} style={{ padding: '1.25rem 1rem', textAlign: 'center', background: i === 1 ? '#1a1a18' : 'transparent', borderLeft: '1px solid rgba(26,26,24,.08)' }}>
                <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: i === 1 ? '#C4500A' : 'rgba(26,26,24,.5)', margin: 0, letterSpacing: 1 }}>{p.toUpperCase()}</p>
              </div>
            ))}
          </div>
          {/* Satırlar */}
          {[
            { label: 'Şirket profili', values: [true, true, true] },
            { label: 'Yetenek keşfi', values: ['50/ay', 'Sınırsız', 'Sınırsız'] },
            { label: 'İş ilanı', values: ['2', 'Sınırsız', 'Sınırsız'] },
            { label: 'Demo Day sponsorluğu', values: [false, true, true] },
            { label: 'Markalı kuluçka katı', values: [false, false, true] },
            { label: 'Analitik panel', values: ['Temel', 'Gelişmiş', 'Özel'] },
            { label: 'Aylık rapor', values: [false, true, true] },
            { label: 'API erişimi', values: [false, false, true] },
            { label: 'Account manager', values: [false, false, true] },
            { label: 'Destek', values: ['Email', 'Öncelikli', 'SLA'] },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(26,26,24,.04)', background: i % 2 === 0 ? 'rgba(26,26,24,.015)' : 'white' }}>
              <div style={{ padding: '1rem 1.5rem', fontSize: 13, color: 'rgba(26,26,24,.65)' }}>{row.label}</div>
              {row.values.map((val, j) => (
                <div key={j} style={{ padding: '1rem', textAlign: 'center', borderLeft: '1px solid rgba(26,26,24,.06)', background: j === 1 ? 'rgba(26,26,24,.97)' : 'transparent' }}>
                  {val === true ? <span style={{ color: '#22c55e', fontSize: 16 }}>✓</span>
                    : val === false ? <span style={{ color: 'rgba(26,26,24,.15)', fontSize: 16 }}>—</span>
                    : <span style={{ fontSize: 12, fontFamily: 'monospace', color: j === 1 ? 'rgba(255,255,255,.6)' : 'rgba(26,26,24,.5)' }}>{val}</span>}
                </div>
              ))}
            </div>
          ))}
          {/* CTA satırı */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
            <div style={{ padding: '1.5rem' }} />
            {['Starter', 'Growth', 'Enterprise'].map((p, i) => (
              <div key={i} style={{ padding: '1.25rem 1rem', textAlign: 'center', background: i === 1 ? '#1a1a18' : 'transparent', borderLeft: '1px solid rgba(26,26,24,.08)' }}>
                <button onClick={() => scrollToSection('basvuru')} className="cta-btn"
                  style={{ background: i === 1 ? '#C4500A' : 'transparent', color: i === 1 ? 'white' : '#C4500A', padding: '8px 16px', borderRadius: 6, border: i === 1 ? 'none' : '1px solid #C4500A', fontSize: 12, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
                  Başvur →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Hesaplayıcı */}
      <div style={{ background: 'rgba(196,80,10,.04)', borderTop: '1px solid rgba(196,80,10,.1)', borderBottom: '1px solid rgba(196,80,10,.1)', padding: '5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(196,80,10,.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1rem' }}>ROI HESAPLAYICI</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', letterSpacing: -1.5, margin: '0 0 1rem' }}>
              Ne kadar tasarruf<br />
              <em style={{ color: '#C4500A', fontStyle: 'normal' }}>edeceksiniz?</em>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(26,26,24,.5)', lineHeight: 1.8 }}>
              Geleneksel işe alım yöntemleriyle kıyasladığınızda CampusWe'nin size sağladığı tasarrufu hesaplayın.
            </p>
          </div>
          <ROICalculator />
        </div>
      </div>

      {/* SSS */}
      <div style={{ padding: '5rem 4rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>SSS</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', margin: 0, letterSpacing: -1.5 }}>
              Aklınızdaki sorular.
            </h2>
          </div>
          {[
            { q: 'Deneme süresi var mı?', a: 'Evet, Growth ve Enterprise paketlerinde 30 günlük ücretsiz deneme sunuyoruz. Kredi kartı gerekmez.' },
            { q: 'İstediğimde iptal edebilir miyim?', a: 'Evet, herhangi bir zamanda iptal edebilirsiniz. Yıllık paketlerde kalan süre için iade yapılır.' },
            { q: 'API entegrasyonu nasıl çalışıyor?', a: 'Enterprise paketinde REST API erişimi sunuyoruz. Kendi İK sisteminizle entegre edebilirsiniz.' },
            { q: 'Kaç kullanıcı hesabı açabiliriz?', a: 'Starter\'da 3, Growth\'ta 10, Enterprise\'da sınırsız kullanıcı hesabı oluşturabilirsiniz.' },
            { q: 'Veri güvenliği nasıl sağlanıyor?', a: 'Tüm veriler SSL ile şifrelenir, Türkiye\'deki sunucularda KVKK uyumlu olarak saklanır.' },
            { q: 'Demo Day\'e nasıl sponsor olabiliriz?', a: 'Growth ve Enterprise paketlerinde Demo Day sponsorluğu dahil. Ayrıca özel sponsorluk paketleri için iletişime geçin.' },
          ].map((item, i) => (
            <SSQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>

      {/* Alt CTA */}
      <div style={{ background: 'rgba(26,26,24,.03)', borderTop: '1px solid rgba(26,26,24,.08)', borderBottom: '1px solid rgba(26,26,24,.08)', padding: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1rem' }}>HÂLÂ KARARSIZ MISINIZ</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', letterSpacing: -1, margin: '0 0 1rem' }}>
              Önce demo isteyin,<br />
              sonra karar verin.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(26,26,24,.5)', lineHeight: 1.8 }}>
              30 dakikalık ücretsiz demo ile platformu şirketiniz için nasıl kullanabileceğinizi göstereceğiz.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => scrollToSection('basvuru')} className="cta-btn"
              style={{ background: '#C4500A', color: 'white', padding: '15px 32px', borderRadius: 8, border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>
              Demo talep et →
            </button>
            <button onClick={() => scrollToSection('basvuru')} className="cta-btn"
              style={{ background: 'white', color: '#1a1a18', padding: '15px 32px', borderRadius: 8, border: '1px solid rgba(26,26,24,.15)', fontSize: 15, fontWeight: 500, cursor: 'pointer', textAlign: 'center' }}>
              Teklif al
            </button>
            <p style={{ fontSize: 12, color: 'rgba(26,26,24,.35)', textAlign: 'center', margin: 0 }}>
              Kredi kartı gerekmez · 30 gün ücretsiz deneme
            </p>
          </div>
        </div>
      </div>

      {/* Başvuru Formu */}
      <div id="basvuru" ref={formSection.ref} className={`scroll-fade ${formSection.visible ? 'shown' : 'hidden'}`}
        style={{ background: '#1a1a18', padding: '5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1rem' }}>BAŞVURU FORMU</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 42, fontWeight: 800, color: 'white', letterSpacing: -1.5, lineHeight: 1.1, margin: '0 0 1.5rem' }}>
              24 saat içinde<br />
              <em style={{ color: '#C4500A', fontStyle: 'normal' }}>seni arayalım.</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Şirketinizin ihtiyaçlarını dinleyelim, size özel bir teklif hazırlayalım.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Shield, text: 'Bilgileriniz güvende, asla paylaşılmaz' },
                { icon: Zap, text: '24 saat içinde dönüş garantisi' },
                { icon: Star, text: 'İlk ay ücretsiz deneme imkanı' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(196,80,10,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={14} color="#C4500A" />
                  </div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,.55)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 20, padding: '2.5rem' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 28 }}>✅</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#1a1a18', margin: '0 0 8px' }}>Başvurun alındı!</h3>
                <p style={{ fontSize: 14, color: 'rgba(26,26,24,.55)' }}>24 saat içinde seni arayacağız.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>ŞİRKET ADI *</label>
                    <input className="input-field" placeholder="Şirket Adı A.Ş." value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} required style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>YETKILI ADI *</label>
                    <input className="input-field" placeholder="Ad Soyad" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>E-POSTA *</label>
                    <input className="input-field" type="email" placeholder="ornek@sirket.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>TELEFON</label>
                    <input className="input-field" placeholder="+90 5XX XXX XX XX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>SEKTÖR</label>
                    <select value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', background: 'white', color: '#1a1a18', boxSizing: 'border-box' }}>
                      <option value="">Seçin</option>
                      {['Teknoloji', 'Finans', 'Perakende', 'Sağlık', 'Üretim', 'Eğitim', 'Diğer'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>ŞİRKET BÜYÜKLÜĞÜ</label>
                    <select value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', background: 'white', color: '#1a1a18', boxSizing: 'border-box' }}>
                      <option value="">Seçin</option>
                      {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => <option key={s}>{s} çalışan</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(26,26,24,.45)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>MESAJINIZ</label>
                  <textarea placeholder="Neye ihtiyacınız var? Nasıl yardımcı olabiliriz?" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'none', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" disabled={loading} className="cta-btn" style={{ background: '#C4500A', color: 'white', padding: '13px', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Gönderiliyor...' : 'Başvuru yap →'}
                </button>
              </form>
            )}
          </div>
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