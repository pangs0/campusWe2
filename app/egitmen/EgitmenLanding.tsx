'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Star, Users, DollarSign, BookOpen, TrendingUp, Award, CheckCircle, ChevronDown, Upload, Youtube, BarChart2, MessageCircle, Shield, Zap, Globe, Clock } from 'lucide-react'

// ── Veri ─────────────────────────────────────────────
const STATS = [
  { value: 47, suffix: '+', label: 'Aktif Eğitmen' },
  { value: 1240, suffix: '+', label: 'Kayıtlı Öğrenci' },
  { value: 75, suffix: '%', label: 'Gelir Payın' },
  { value: 0, suffix: '₺', label: 'Başlangıç Ücreti', prefix: true },
]

const STEPS = [
  { n: '01', emoji: '✍️', title: 'Kayıt ol', desc: 'Eğitmen hesabı oluştur, profilini doldur. 2 dakika sürer.' },
  { n: '02', emoji: '🎬', title: 'Kurs oluştur', desc: 'Bölüm ve derslerini ekle. YouTube linki veya direkt video yükle.' },
  { n: '03', emoji: '🚀', title: 'Yayınla', desc: 'Tek tıkla yayına al. CampusWe topluluğu kursunu keşfeder.' },
  { n: '04', emoji: '💰', title: 'Kazan', desc: 'Her kayıt için otomatik %75 gelir. Aylık analitik takibi.' },
]

const FEATURES = [
  { icon: Youtube, title: 'YouTube veya Direkt Upload', desc: 'YouTube "listelenmemiş" linki kullan ya da videoyu direkt platforma yükle. İstediğini seç.' },
  { icon: Award, title: 'Otomatik Sertifika', desc: 'Öğrenciler kursu tamamlayınca otomatik sertifika alıyor. Ek iş yok.' },
  { icon: BarChart2, title: 'Gelir Analitik', desc: 'Aylık gelir grafiği, öğrenci takibi, tamamlanma oranı. Her şeyi gör.' },
  { icon: MessageCircle, title: 'Öğrenci Mesajlaşma', desc: 'Öğrencilerinle direkt iletişim. Soru-cevap, motivasyon, topluluk.' },
  { icon: Globe, title: 'Türkiye Odaklı', desc: 'Türkçe platform, Türk girişimci topluluğu. Hedef kitlen tam burada.' },
  { icon: Shield, title: 'İçerik Koruması', desc: 'Kursların sadece kayıtlı öğrencilere açık. İzinsiz paylaşım yok.' },
  { icon: Clock, title: 'Pasif Gelir', desc: 'Bir kez oluştur, sonsuza kadar kazan. Uyurken bile öğrencin olabilir.' },
  { icon: Zap, title: 'Hızlı Başlangıç', desc: 'Kayıttan ilk derse 30 dakika. Karmaşık onay süreci yok.' },
]

const COMPARISON = [
  { feature: 'Eğitmen gelir payı', campuswe: '%75', udemy: '%37', youtube: '%55' },
  { feature: 'Türkçe platform', campuswe: '✅', udemy: '❌', youtube: '❌' },
  { feature: 'Girişimci topluluğu', campuswe: '✅', udemy: '❌', youtube: '❌' },
  { feature: 'Otomatik sertifika', campuswe: '✅', udemy: '✅', youtube: '❌' },
  { feature: 'Başlangıç ücreti', campuswe: '₺0', udemy: '₺0', youtube: '₺0' },
  { feature: 'Co-founder ağı', campuswe: '✅', udemy: '❌', youtube: '❌' },
  { feature: 'Gelir analitik', campuswe: '✅', udemy: '✅', youtube: '✅' },
  { feature: 'Demo Day erişimi', campuswe: '✅', udemy: '❌', youtube: '❌' },
]

const TESTIMONIALS = [
  { name: 'Mert Aydın', role: 'Full Stack Developer', area: 'Web Geliştirme', students: 89, rating: 4.9, quote: 'İlk ayda 89 öğrencim oldu. CampusWe topluluğu tam hedef kitlem.' },
  { name: 'Selin Kaya', role: 'Ürün Müdürü', area: 'Ürün Yönetimi', students: 124, rating: 5.0, quote: 'Udemy\'de aynı kursum vardı, burada 2x daha fazla kazanıyorum.' },
  { name: 'Burak Şahin', role: 'Girişimci', area: 'Girişimcilik', students: 203, rating: 4.8, quote: 'Başlangıç noktası sıfırdı. Şimdi pasif gelirim var.' },
]

const FAQS = [
  { q: 'Ödeme ne zaman alınır?', a: 'Şu an ödeme sistemi entegrasyonu geliştirme aşamasında. İyzico entegrasyonu tamamlandığında her ay otomatik ödeme alacaksın.' },
  { q: 'Video nasıl yüklenir?', a: 'İki seçeneğin var: YouTube\'a "listelenmemiş" olarak yükleyip linki yapıştır, veya MP4 dosyasını direkt platforma yükle (maks. 500MB).' },
  { q: 'Kurs onayı gerekiyor mu?', a: 'Hayır! Kursunu oluşturup tek tıkla yayınlayabilirsin. Ön onay süreci yok.' },
  { q: '%75 gelir payı nasıl hesaplanır?', a: 'Örnek: ₺199 kurs × 50 öğrenci = ₺9.950. Bunun %75\'i = ₺7.462 senin. Platform %25 = ₺2.487 alır.' },
  { q: 'Kaç kurs oluşturabilirim?', a: 'Sınırsız kurs oluşturabilirsin. Her kurs için ayrı fiyat, kategori ve içerik belirleyebilirsin.' },
  { q: 'Öğrencilerle nasıl iletişim kurarım?', a: 'Platform içi mesajlaşma sistemiyle öğrencilerinle doğrudan iletişim kurabilirsin.' },
]

// ── Count-up hook ─────────────────────────────────────
function useCountUp(target: number, duration = 1500, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress === 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

// ── Intersection observer hook ────────────────────────
function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return inView
}

export default function EgitmenLanding() {
  const [students, setStudents] = useState(50)
  const [price, setPrice] = useState(199)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef as React.RefObject<Element>)

  const s0 = useCountUp(STATS[0].value, 1500, statsInView)
  const s1 = useCountUp(STATS[1].value, 1500, statsInView)
  const s2 = useCountUp(STATS[2].value, 1500, statsInView)

  const monthly = Math.round(students * price * 0.75)
  const yearly = monthly * 12
  const threeYear = yearly * 3
  const udemyMonthly = Math.round(students * price * 0.37)
  const youtubeMonthly = Math.round(students * price * 0.55)

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#faf9f6', color: '#1a1a18' }}>

      {/* ── CSS ── */}
      <style>{`
        @keyframes float1 { 0%,100% { transform: translateY(0px) rotate(0deg); opacity: .3; } 50% { transform: translateY(-20px) rotate(180deg); opacity: .6; } }
        @keyframes float2 { 0%,100% { transform: translateY(0px) rotate(0deg); opacity: .2; } 50% { transform: translateY(-30px) rotate(-180deg); opacity: .5; } }
        @keyframes float3 { 0%,100% { transform: translateY(0px); opacity: .15; } 50% { transform: translateY(-15px); opacity: .4; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(250,249,246,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,26,24,.08)', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<span style={{ color: '#C4500A' }}>We</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/auth/login" style={{ fontSize: 14, color: '#1a1a18', opacity: 0.6, textDecoration: 'none', padding: '8px 16px' }}>Giriş yap</Link>
          <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', fontSize: 14, fontWeight: 600, textDecoration: 'none', padding: '10px 20px', borderRadius: 10 }}>
            Ücretsiz başla →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: '#1a1a18', padding: '100px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Arka plan desen */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(196,80,10,.04) 60px, rgba(196,80,10,.04) 120px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,80,10,.15), transparent 70%)', pointerEvents: 'none' }} />

        {/* Animasyonlu partiküller */}
        {[
          { top: '10%', left: '3%', size: 6, anim: 'float1 4s infinite' },
          { top: '25%', left: '8%', size: 4, anim: 'float2 5s infinite 1s' },
          { top: '60%', left: '5%', size: 8, anim: 'float3 6s infinite 2s' },
          { top: '80%', left: '12%', size: 3, anim: 'float1 4s infinite 3s' },
          { top: '15%', right: '5%', size: 5, anim: 'float2 5s infinite' },
          { top: '45%', right: '3%', size: 7, anim: 'float3 6s infinite 1s' },
          { top: '70%', right: '8%', size: 4, anim: 'float1 4s infinite 2s' },
          { top: '35%', left: '50%', size: 5, anim: 'float2 7s infinite 0.5s' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: p.top, left: (p as any).left, right: (p as any).right,
            width: p.size, height: p.size, borderRadius: '50%',
            background: '#C4500A', animation: p.anim, pointerEvents: 'none'
          }} />
        ))}

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(196,80,10,.15)', border: '1px solid rgba(196,80,10,.3)', borderRadius: 100, padding: '6px 14px', marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A', animation: 'pulse 2s infinite' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 2 }}>47 EĞİTMEN AKTIF</span>
              </div>

              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
                Bilgini paylaş,<br />
                <em style={{ color: '#C4500A', fontStyle: 'normal' }}>para kazan.</em>
              </h1>

              <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
                CampusWe'de kurs oluştur. Türkiye'nin en büyük girişimci topluluğuna öğret. Her satıştan %75 kazan.
              </p>

              <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
                <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', fontSize: 15, fontWeight: 700, textDecoration: 'none', padding: '14px 28px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Eğitmen olarak başla <ArrowRight size={16} />
                </Link>
                <Link href="/kurslar" style={{ background: 'rgba(255,255,255,.08)', color: 'white', fontSize: 15, textDecoration: 'none', padding: '14px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,.12)' }}>
                  <Play size={14} /> Kurslara bak
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 32 }}>
                {[
                  { value: '%75', label: 'Gelir payın' },
                  { value: '₺0', label: 'Başlangıç' },
                  { value: '∞', label: 'Pasif gelir' },
                ].map((s, i) => (
                  <div key={i}>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: '#C4500A', margin: 0 }}>{s.value}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: 1, margin: '2px 0 0' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating kurs kartları */}
            <div style={{ position: 'relative', height: 380 }}>
              {[
                { top: 0, left: 20, title: 'React ile SaaS Kur', cat: '💻 Teknoloji', students: 89, rating: 4.9, price: '₺199', rotate: '-3deg' },
                { top: 80, left: 180, title: 'Girişimcilik 101', cat: '🚀 Girişimcilik', students: 203, rating: 5.0, price: '₺149', rotate: '2deg' },
                { top: 200, left: 40, title: 'Pazarlama Temelleri', cat: '📈 Pazarlama', students: 124, rating: 4.8, price: '₺299', rotate: '-1deg' },
              ].map((card, i) => (
                <div key={i} style={{ position: 'absolute', top: card.top, left: card.left, width: 220, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: 16, transform: `rotate(${card.rotate})`, backdropFilter: 'blur(10px)' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#C4500A', marginBottom: 6 }}>{card.cat}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 8, lineHeight: 1.3 }}>{card.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={11} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.5)' }}>{card.rating} · {card.students} öğrenci</span>
                    </div>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700, color: '#C4500A' }}>{card.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SAYAÇLAR ── */}
      <section ref={statsRef} style={{ padding: '60px 48px', borderBottom: '1px solid rgba(26,26,24,.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { value: statsInView ? s0 : 0, suffix: '+', label: 'Aktif Eğitmen' },
            { value: statsInView ? s1 : 0, suffix: '+', label: 'Kayıtlı Öğrenci' },
            { value: statsInView ? s2 : 0, suffix: '%', label: 'Gelir Payın' },
            { value: 0, suffix: '₺', label: 'Başlangıç Ücreti', prefix: true },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 44, fontWeight: 800, color: '#C4500A', margin: 0 }}>
                {s.prefix ? s.suffix : ''}{s.value}{!s.prefix ? s.suffix : ''}
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 1, margin: '4px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KAZANÇ SİMÜLATÖRÜ ── */}
      <section style={{ padding: '100px 48px', background: '#1a1a18' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 12 }}>KAZANÇ SİMÜLATÖRÜ</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, color: 'white', letterSpacing: -1.5, margin: 0 }}>
              Ne kadar kazanırsın?
            </h2>
          </div>

          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 40 }}>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: 2, display: 'block', marginBottom: 16 }}>
                  AYLIK ÖĞRENCİ SAYISI: <span style={{ color: '#C4500A' }}>{students}</span>
                </label>
                <input type="range" min={1} max={500} value={students} onChange={e => setStudents(+e.target.value)}
                  style={{ width: '100%', accentColor: '#C4500A', height: 4 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>1</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>500</span>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: 2, display: 'block', marginBottom: 16 }}>
                  KURS FİYATI: <span style={{ color: '#C4500A' }}>₺{price}</span>
                </label>
                <input type="range" min={49} max={1999} step={50} value={price} onChange={e => setPrice(+e.target.value)}
                  style={{ width: '100%', accentColor: '#C4500A', height: 4 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>₺49</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>₺1999</span>
                </div>
              </div>
            </div>

            {/* Kazanç gösterimi */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Aylık kazanç', value: `₺${monthly.toLocaleString('tr-TR')}`, sub: 'her ay' },
                { label: 'Yıllık kazanç', value: `₺${yearly.toLocaleString('tr-TR')}`, sub: 'yılda bir' },
                { label: '3 yıllık projeksiyon', value: `₺${threeYear.toLocaleString('tr-TR')}`, sub: '3 yılda' },
              ].map((e, i) => (
                <div key={i} style={{ background: 'rgba(196,80,10,.1)', border: '1px solid rgba(196,80,10,.2)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(196,80,10,.7)', letterSpacing: 1, marginBottom: 8 }}>{e.label.toUpperCase()}</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: '#C4500A', margin: 0 }}>{e.value}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', marginTop: 4 }}>{e.sub}</p>
                </div>
              ))}
            </div>

            {/* Karşılaştırma */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 24 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 2, marginBottom: 16 }}>DİĞER PLATFORMLARLA KARŞILAŞTIR</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { name: 'CampusWe', value: monthly, pct: '75', highlight: true },
                  { name: 'YouTube', value: youtubeMonthly, pct: '55', highlight: false },
                  { name: 'Udemy', value: udemyMonthly, pct: '37', highlight: false },
                ].map((p, i) => (
                  <div key={i} style={{ background: p.highlight ? 'rgba(196,80,10,.15)' : 'rgba(255,255,255,.03)', border: `1px solid ${p.highlight ? 'rgba(196,80,10,.3)' : 'rgba(255,255,255,.06)'}`, borderRadius: 10, padding: 16, textAlign: 'center' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: 11, color: p.highlight ? '#C4500A' : 'rgba(255,255,255,.3)', marginBottom: 6 }}>{p.name} (%{p.pct})</p>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: p.highlight ? '#C4500A' : 'rgba(255,255,255,.4)', margin: 0 }}>
                      ₺{p.value.toLocaleString('tr-TR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NASIL ÇALIŞIR ── */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 12 }}>NASIL ÇALIŞIR</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, letterSpacing: -1.5, margin: 0 }}>
              4 adımda eğitmen ol.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 28, left: '60%', width: '80%', height: 1, background: 'rgba(196,80,10,.2)', zIndex: 0 }} />
                )}
                <div style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 16, padding: 24, position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(196,80,10,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {step.emoji}
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', fontWeight: 700 }}>{step.n}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÖZELLİKLER ── */}
      <section style={{ padding: '100px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 12 }}>ÖZELLİKLER</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, letterSpacing: -1.5, margin: 0 }}>
              İhtiyacın olan her şey var.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#faf9f6', border: '1.5px solid rgba(26,26,24,.06)', borderRadius: 14, padding: 24, transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(196,80,10,.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(26,26,24,.06)')}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(196,80,10,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <f.icon size={18} color="#C4500A" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 12, color: 'rgba(26,26,24,.5)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KARŞILAŞTIRMA TABLOSU ── */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 12 }}>KARŞILAŞTIRMA</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, letterSpacing: -1.5, margin: 0 }}>
              Neden CampusWe?
            </h2>
          </div>

          <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1.5px solid rgba(26,26,24,.08)' }}>
            {/* Tablo başlığı */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#1a1a18', padding: '16px 24px' }}>
              <div />
              {['CampusWe', 'Udemy', 'YouTube'].map((p, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: i === 0 ? '#C4500A' : 'rgba(255,255,255,.4)', margin: 0 }}>{p}</p>
                </div>
              ))}
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 24px', borderBottom: i < COMPARISON.length - 1 ? '1px solid rgba(26,26,24,.05)' : 'none', background: i % 2 === 0 ? 'white' : '#faf9f6' }}>
                <p style={{ fontSize: 13, color: 'rgba(26,26,24,.7)', margin: 0 }}>{row.feature}</p>
                {[row.campuswe, row.udemy, row.youtube].map((val, j) => (
                  <p key={j} style={{ textAlign: 'center', fontSize: 13, fontWeight: j === 0 ? 700 : 400, color: j === 0 ? '#C4500A' : val === '❌' ? 'rgba(26,26,24,.25)' : 'rgba(26,26,24,.6)', margin: 0 }}>{val}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YORUMLAR ── */}
      <section style={{ padding: '100px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 12 }}>EĞİTMEN HİKAYELERİ</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, letterSpacing: -1.5, margin: 0 }}>
              Onlar başardı, sen de başarırsın.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#faf9f6', border: '1.5px solid rgba(26,26,24,.06)', borderRadius: 16, padding: 28 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= Math.round(t.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(26,26,24,.7)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontWeight: 700, color: '#C4500A' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{t.name}</p>
                      <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', margin: '2px 0 0' }}>{t.role}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: '#C4500A', margin: 0 }}>{t.students} öğrenci</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', margin: '2px 0 0' }}>{t.area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SSS ── */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 12 }}>SIKÇA SORULAN SORULAR</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, letterSpacing: -1.5, margin: 0 }}>
              Aklındaki sorular.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 14, overflow: 'hidden', transition: 'border-color .2s', ...(openFaq === i ? { borderColor: 'rgba(196,80,10,.2)' } : {}) }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', margin: 0 }}>{faq.q}</p>
                  <ChevronDown size={16} color="rgba(26,26,24,.4)" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px' }}>
                    <p style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SON CTA ── */}
      <section style={{ padding: '100px 48px', background: '#1a1a18', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -150, left: -150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,80,10,.2), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,80,10,.1), transparent 70%)', pointerEvents: 'none' }} />
        {[
          { top: '20%', left: '5%', size: 5, anim: 'float1 4s infinite' },
          { top: '70%', left: '10%', size: 3, anim: 'float2 5s infinite 1s' },
          { top: '30%', right: '5%', size: 6, anim: 'float3 6s infinite 0.5s' },
          { top: '60%', right: '12%', size: 4, anim: 'float1 4s infinite 2s' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: p.top, left: (p as any).left, right: (p as any).right,
            width: p.size, height: p.size, borderRadius: '50%',
            background: '#C4500A', animation: p.anim, pointerEvents: 'none'
          }} />
        ))}

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 20 }}>HEMEN BAŞLA</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 800, color: 'white', letterSpacing: -2, lineHeight: 1.1, marginBottom: 20 }}>
            İlk kursunu bu<br />
            <em style={{ color: '#C4500A', fontStyle: 'normal' }}>hafta yayınla.</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Kaydol, kursunu oluştur, yayınla. Tüm süreç 30 dakika sürer.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', fontSize: 16, fontWeight: 700, textDecoration: 'none', padding: '16px 36px', borderRadius: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Ücretsiz başla <ArrowRight size={18} />
            </Link>
            <Link href="/auth/login" style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', fontSize: 16, textDecoration: 'none', padding: '16px 28px', borderRadius: 14, border: '1px solid rgba(255,255,255,.1)' }}>
              Giriş yap
            </Link>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.2)', marginTop: 24, letterSpacing: 1 }}>
            KAYIT ÜCRETSİZ · KREDİ KARTI GEREKMİYOR · HEMEN BAŞLA
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '32px 48px', borderTop: '1px solid rgba(26,26,24,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<span style={{ color: '#C4500A' }}>We</span>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Ana Sayfa', '/'], ['Kurslar', '/kurslar'], ['Giriş', '/auth/login'], ['Kayıt', '/auth/register']].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: 'rgba(26,26,24,.45)', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.25)' }}>© 2026 CampusWe</p>
      </footer>
    </div>
  )
}