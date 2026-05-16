'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Star, Users, DollarSign, BookOpen, TrendingUp, Award, CheckCircle, ChevronDown, Upload, Youtube, BarChart2, MessageCircle, Shield, Zap, Globe, Clock, Mail } from 'lucide-react'

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
  { icon: Youtube, title: 'YouTube veya Direkt Upload', desc: 'YouTube "listelenmemiş" linki kullan ya da videoyu direkt platforma yükle.' },
  { icon: Award, title: 'Otomatik Sertifika', desc: 'Öğrenciler kursu tamamlayınca otomatik sertifika alıyor. Ek iş yok.' },
  { icon: BarChart2, title: 'Gelir Analitik', desc: 'Aylık gelir grafiği, öğrenci takibi, tamamlanma oranı.' },
  { icon: MessageCircle, title: 'Öğrenci Mesajlaşma', desc: 'Öğrencilerinle direkt iletişim. Soru-cevap, motivasyon.' },
  { icon: Globe, title: 'Türkiye Odaklı', desc: 'Türkçe platform, Türk girişimci topluluğu. Hedef kitlen tam burada.' },
  { icon: Shield, title: 'İçerik Koruması', desc: 'Kursların sadece kayıtlı öğrencilere açık.' },
  { icon: Clock, title: 'Pasif Gelir', desc: 'Bir kez oluştur, sonsuza kadar kazan.' },
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
  { name: 'Selin Kaya', role: 'Ürün Müdürü', area: 'Ürün Yönetimi', students: 124, rating: 5.0, quote: "Udemy'de aynı kursum vardı, burada 2x daha fazla kazanıyorum." },
  { name: 'Burak Şahin', role: 'Girişimci', area: 'Girişimcilik', students: 203, rating: 4.8, quote: 'Başlangıç noktası sıfırdı. Şimdi pasif gelirim var.' },
]

const FAQS = [
  { q: 'Ödeme ne zaman alınır?', a: 'İyzico entegrasyonu tamamlandığında her ay otomatik ödeme alacaksın.' },
  { q: 'Video nasıl yüklenir?', a: "YouTube'a 'listelenmemiş' yükleyip linki yapıştır, veya MP4 direkt platforma yükle (maks. 500MB)." },
  { q: 'Kurs onayı gerekiyor mu?', a: 'Hayır! Kursunu oluşturup tek tıkla yayınlayabilirsin.' },
  { q: '%75 gelir payı nasıl hesaplanır?', a: "₺199 × 50 öğrenci = ₺9.950. Bunun %75'i = ₺7.462 senin." },
  { q: 'Kaç kurs oluşturabilirim?', a: 'Sınırsız kurs. Her kurs için ayrı fiyat ve içerik.' },
  { q: 'Öğrencilerle nasıl iletişim kurarım?', a: 'Platform içi mesajlaşma ile öğrencilerinle doğrudan iletişim.' },
]

// Floating daireler — her section için
function FloatingBubbles({ count = 6, dark = false }: { count?: number; dark?: boolean }) {
  const positions = [
    { top: '10%', left: '2%', size: 80, anim: 'bubble1 8s infinite', opacity: 0.04 },
    { top: '60%', left: '1%', size: 120, anim: 'bubble2 10s infinite 2s', opacity: 0.03 },
    { top: '30%', right: '2%', size: 60, anim: 'bubble1 7s infinite 1s', opacity: 0.05 },
    { top: '75%', right: '3%', size: 100, anim: 'bubble2 9s infinite 3s', opacity: 0.03 },
    { top: '50%', left: '50%', size: 40, anim: 'bubble1 6s infinite 0.5s', opacity: 0.04 },
    { top: '20%', right: '20%', size: 50, anim: 'bubble2 8s infinite 4s', opacity: 0.03 },
  ].slice(0, count)
  const color = dark ? '196,80,10' : '196,80,10'
  return (
    <>
      {positions.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: p.top, left: (p as any).left, right: (p as any).right,
          width: p.size, height: p.size, borderRadius: '50%',
          border: `1px solid rgba(${color},${p.opacity * 8})`,
          background: `radial-gradient(circle, rgba(${color},${p.opacity}), transparent 70%)`,
          animation: p.anim, pointerEvents: 'none'
        }} />
      ))}
    </>
  )
}

// Nokta partiküller
function Particles({ count = 8 }: { count?: number }) {
  const dots = [
    { top: '10%', left: '3%', size: 5, anim: 'float1 4s infinite' },
    { top: '25%', left: '8%', size: 3, anim: 'float2 5s infinite 1s' },
    { top: '60%', left: '4%', size: 6, anim: 'float3 6s infinite 2s' },
    { top: '80%', left: '10%', size: 3, anim: 'float1 4s infinite 3s' },
    { top: '15%', right: '4%', size: 4, anim: 'float2 5s infinite' },
    { top: '45%', right: '2%', size: 6, anim: 'float3 6s infinite 1s' },
    { top: '70%', right: '6%', size: 3, anim: 'float1 4s infinite 2s' },
    { top: '35%', right: '15%', size: 4, anim: 'float2 7s infinite 0.5s' },
  ].slice(0, count)
  return (
    <>
      {dots.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: p.top, left: (p as any).left, right: (p as any).right,
          width: p.size, height: p.size, borderRadius: '50%',
          background: '#C4500A', animation: p.anim, pointerEvents: 'none'
        }} />
      ))}
    </>
  )
}

function useCountUp(target: number, duration = 1500, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = Date.now()
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress === 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return inView
}

const PAD = '100px 48px'
const PAD_SMALL = '64px 48px'

export default function EgitmenLanding() {
  const [students, setStudents] = useState(50)
  const [price, setPrice] = useState(199)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef as React.RefObject<Element>)
  const s0 = useCountUp(47, 1500, statsInView)
  const s1 = useCountUp(1240, 1500, statsInView)
  const s2 = useCountUp(75, 1500, statsInView)

  const monthly = Math.round(students * price * 0.75)
  const yearly = monthly * 12
  const threeYear = yearly * 3

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#faf9f6', color: '#1a1a18', overflowX: 'hidden' }}>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg);opacity:.4} 50%{transform:translateY(-22px) rotate(180deg);opacity:.7} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg);opacity:.3} 50%{transform:translateY(-32px) rotate(-180deg);opacity:.6} }
        @keyframes float3 { 0%,100%{transform:translateY(0);opacity:.2} 50%{transform:translateY(-16px);opacity:.5} }
        @keyframes bubble1 { 0%,100%{transform:translateY(0) scale(1);opacity:.6} 50%{transform:translateY(-30px) scale(1.1);opacity:1} }
        @keyframes bubble2 { 0%,100%{transform:translateY(0) scale(1);opacity:.4} 50%{transform:translateY(-20px) scale(0.9);opacity:.8} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(250,249,246,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,26,24,.08)', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<span style={{ color: '#C4500A' }}>We</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none', padding: '8px 14px' }}>Ana Sayfa</Link>
          <Link href="/kurslar" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none', padding: '8px 14px' }}>Kurslar</Link>
          <Link href="/fiyatlandirma" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none', padding: '8px 14px' }}>Fiyatlandırma</Link>
          <Link href="/kurumsal" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none', padding: '8px 14px' }}>Kurumsal</Link>
          <Link href="/egitmen" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none', padding: '8px 14px', border: '1px solid rgba(196,80,10,.3)', borderRadius: 6, marginLeft: 4 }}>Eğitmen Ol</Link>
          <Link href="/auth/login" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none', padding: '8px 14px', marginLeft: 4 }}>Giriş yap</Link>
          <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none', padding: '9px 18px', borderRadius: 8, marginLeft: 4 }}>
            Kayıt ol →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: '#1a1a18', padding: '100px 48px 90px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(196,80,10,.035) 60px, rgba(196,80,10,.035) 120px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -80, right: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,80,10,.18), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -50, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,80,10,.08), transparent 70%)', pointerEvents: 'none' }} />
        <Particles count={8} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(196,80,10,.15)', border: '1px solid rgba(196,80,10,.3)', borderRadius: 100, padding: '6px 14px', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 2 }}>47 EĞİTMEN AKTİF</span>
            </div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 56, fontWeight: 800, color: 'white', lineHeight: 1.08, letterSpacing: -2.5, marginBottom: 22 }}>
              Bilgini paylaş,<br />
              <em style={{ color: '#C4500A', fontStyle: 'normal' }}>para kazan.</em>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
              CampusWe'de kurs oluştur. Türkiye'nin girişimci topluluğuna öğret. Her satıştan <strong style={{ color: 'rgba(255,255,255,.75)' }}>%75</strong> kazan.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
              <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', fontSize: 15, fontWeight: 700, textDecoration: 'none', padding: '14px 28px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                Eğitmen olarak başla <ArrowRight size={16} />
              </Link>
              <Link href="/kurslar" style={{ background: 'rgba(255,255,255,.08)', color: 'white', fontSize: 15, textDecoration: 'none', padding: '14px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,.12)' }}>
                <Play size={14} /> Kurslara bak
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
              {[{ v: '%75', l: 'Gelir payın' }, { v: '₺0', l: 'Başlangıç' }, { v: '∞', l: 'Pasif gelir' }].map((s, i) => (
                <div key={i}>
                  <p style={{ fontFamily: 'Georgia,serif', fontSize: 30, fontWeight: 800, color: '#C4500A', margin: 0 }}>{s.v}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: 1, margin: '3px 0 0' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating kurs kartları */}
          <div style={{ position: 'relative', height: 420 }}>
            {[
              { top: 0, left: 20, title: 'React ile SaaS Kur', cat: '💻 Teknoloji', students: 89, rating: 4.9, price: '₺199', rotate: '-3deg' },
              { top: 100, left: 200, title: 'Girişimcilik 101', cat: '🚀 Girişimcilik', students: 203, rating: 5.0, price: '₺149', rotate: '2deg' },
              { top: 230, left: 30, title: 'Pazarlama Temelleri', cat: '📈 Pazarlama', students: 124, rating: 4.8, price: '₺299', rotate: '-1.5deg' },
              { top: 310, left: 240, title: 'Yapay Zeka Kursu', cat: '🤖 Yapay Zeka', students: 67, rating: 4.7, price: '₺399', rotate: '1deg' },
            ].map((card, i) => (
              <div key={i} style={{ position: 'absolute', top: card.top, left: card.left, width: 230, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: 16, transform: `rotate(${card.rotate})`, backdropFilter: 'blur(10px)' }}>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#C4500A', marginBottom: 6 }}>{card.cat}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 8, lineHeight: 1.3 }}>{card.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.4)' }}>⭐ {card.rating} · {card.students} öğrenci</span>
                  <span style={{ fontFamily: 'Georgia,serif', fontSize: 14, fontWeight: 700, color: '#C4500A' }}>{card.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAYAÇLAR */}
      <section ref={statsRef} style={{ padding: '64px 48px', borderBottom: '1px solid rgba(26,26,24,.06)', position: 'relative', overflow: 'hidden' }}>
        <FloatingBubbles count={4} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { value: statsInView ? s0 : 0, suffix: '+', label: 'Aktif Eğitmen' },
            { value: statsInView ? s1 : 0, suffix: '+', label: 'Kayıtlı Öğrenci' },
            { value: statsInView ? s2 : 0, suffix: '%', label: 'Gelir Payın' },
            { value: 0, suffix: '', label: 'Başlangıç Ücreti', prefix: '₺' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Georgia,serif', fontSize: 48, fontWeight: 800, color: '#C4500A', margin: 0 }}>
                {(s as any).prefix || ''}{s.value}{s.suffix}
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 1, margin: '4px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KAZANÇ SİMÜLATÖRÜ */}
      <section style={{ padding: '100px 48px', background: '#1a1a18', position: 'relative', overflow: 'hidden' }}>
        <FloatingBubbles count={6} dark />
        <Particles count={6} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'center' }}>
          {/* Sol açıklama */}
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 16 }}>KAZANÇ SİMÜLATÖRÜ</p>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 42, fontWeight: 800, color: 'white', letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20 }}>
              Ne kadar<br />kazanırsın?
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', lineHeight: 1.75, marginBottom: 32 }}>
              Öğrenci sayısı ve kurs fiyatına göre anlık hesapla. CampusWe, Udemy ve YouTube ile karşılaştır.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { emoji: '💸', text: '%75 her zaman senin' },
                { emoji: '📅', text: 'Aylık otomatik ödeme' },
                { emoji: '📊', text: 'Gelir analitik paneli' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ simülatör */}
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 36 }}>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: 2, display: 'block', marginBottom: 16 }}>
                  AYLIK ÖĞRENCİ: <span style={{ color: '#C4500A' }}>{students}</span>
                </label>
                <input type="range" min={1} max={500} value={students} onChange={e => setStudents(+e.target.value)} style={{ width: '100%', accentColor: '#C4500A' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>1</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>500</span>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: 2, display: 'block', marginBottom: 16 }}>
                  KURS FİYATI: <span style={{ color: '#C4500A' }}>₺{price}</span>
                </label>
                <input type="range" min={49} max={1999} step={50} value={price} onChange={e => setPrice(+e.target.value)} style={{ width: '100%', accentColor: '#C4500A' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>₺49</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.2)' }}>₺1999</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
              {[
                { label: 'AYLIK', value: monthly },
                { label: 'YILLIK', value: yearly },
                { label: '3 YILLIK', value: threeYear },
              ].map((e, i) => (
                <div key={i} style={{ background: 'rgba(196,80,10,.12)', border: '1px solid rgba(196,80,10,.2)', borderRadius: 12, padding: '16px 12px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(196,80,10,.7)', marginBottom: 8 }}>{e.label}</p>
                  <p style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 800, color: '#C4500A', margin: 0 }}>₺{e.value.toLocaleString('tr-TR')}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 20 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: 2, marginBottom: 12 }}>DİĞER PLATFORMLAR</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { name: 'CampusWe (%75)', value: monthly, hi: true },
                  { name: 'YouTube (%55)', value: Math.round(students * price * 0.55), hi: false },
                  { name: 'Udemy (%37)', value: Math.round(students * price * 0.37), hi: false },
                ].map((p, i) => (
                  <div key={i} style={{ background: p.hi ? 'rgba(196,80,10,.15)' : 'rgba(255,255,255,.03)', border: `1px solid ${p.hi ? 'rgba(196,80,10,.3)' : 'rgba(255,255,255,.06)'}`, borderRadius: 8, padding: 12, textAlign: 'center' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: 9, color: p.hi ? '#C4500A' : 'rgba(255,255,255,.3)', marginBottom: 4 }}>{p.name}</p>
                    <p style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 700, color: p.hi ? '#C4500A' : 'rgba(255,255,255,.35)', margin: 0 }}>₺{p.value.toLocaleString('tr-TR')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section style={{ padding: '100px 48px', position: 'relative', overflow: 'hidden' }}>
        <FloatingBubbles count={4} />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 12 }}>NASIL ÇALIŞIR</p>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 42, fontWeight: 800, letterSpacing: -1.5, margin: 0 }}>4 adımda eğitmen ol.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.07)', borderRadius: 18, padding: 28, position: 'relative' }}>
                {i < STEPS.length - 1 && <div style={{ position: 'absolute', top: 36, left: '62%', width: '75%', height: 1, background: 'linear-gradient(90deg, rgba(196,80,10,.3), transparent)', zIndex: 0 }} />}
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(196,80,10,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 22 }}>
                  {step.emoji}
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', fontWeight: 700 }}>{step.n}</span>
                <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, margin: '8px 0' }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section style={{ padding: '100px 48px', background: 'white', position: 'relative', overflow: 'hidden' }}>
        <FloatingBubbles count={4} />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
            <div style={{ position: 'sticky', top: 100 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 16 }}>ÖZELLİKLER</p>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 42, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20 }}>İhtiyacın olan her şey var.</h2>
              <p style={{ fontSize: 14, color: 'rgba(26,26,24,.5)', lineHeight: 1.75, marginBottom: 32 }}>
                Video yüklemeden sertifika sistemine, gelir analitiğinden öğrenci yönetimine kadar her şey dahil.
              </p>
              <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none', padding: '12px 24px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Hepsini kullan <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ background: '#faf9f6', border: '1.5px solid rgba(26,26,24,.06)', borderRadius: 14, padding: 22, transition: 'all .2s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,80,10,.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,24,.06)'; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(196,80,10,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <f.icon size={17} color="#C4500A" />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 12, color: 'rgba(26,26,24,.5)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KARŞILAŞTIRMA */}
      <section style={{ padding: '100px 48px', position: 'relative', overflow: 'hidden' }}>
        <FloatingBubbles count={4} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 16 }}>KARŞILAŞTIRMA</p>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 42, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20 }}>Neden CampusWe?</h2>
            <p style={{ fontSize: 14, color: 'rgba(26,26,24,.5)', lineHeight: 1.75, marginBottom: 28 }}>
              Türkiye'nin tek bütünleşik girişimci ekosistemi. Sadece kurs değil, topluluk, co-founder, yatırımcı ağı.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { emoji: '🏆', text: 'En yüksek gelir payı: %75' },
                { emoji: '🇹🇷', text: 'Tamamen Türkçe platform' },
                { emoji: '🤝', text: '1200+ girişimci topluluğu' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1.5px solid rgba(26,26,24,.07)', borderRadius: 10, padding: '10px 14px' }}>
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <span style={{ fontSize: 13, color: 'rgba(26,26,24,.7)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1.5px solid rgba(26,26,24,.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#1a1a18', padding: '16px 24px' }}>
              <div />
              {['CampusWe', 'Udemy', 'YouTube'].map((p, i) => (
                <p key={i} style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: i === 0 ? '#C4500A' : 'rgba(255,255,255,.3)', textAlign: 'center', margin: 0 }}>{p}</p>
              ))}
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 24px', borderBottom: i < COMPARISON.length - 1 ? '1px solid rgba(26,26,24,.05)' : 'none', background: i % 2 === 0 ? 'white' : '#faf9f6' }}>
                <p style={{ fontSize: 13, color: 'rgba(26,26,24,.7)', margin: 0 }}>{row.feature}</p>
                {[row.campuswe, row.udemy, row.youtube].map((val, j) => (
                  <p key={j} style={{ textAlign: 'center', fontSize: 13, fontWeight: j === 0 ? 700 : 400, color: j === 0 ? '#C4500A' : val === '❌' ? 'rgba(26,26,24,.2)' : 'rgba(26,26,24,.55)', margin: 0 }}>{val}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YORUMLAR */}
      <section style={{ padding: '100px 48px', background: 'white', position: 'relative', overflow: 'hidden' }}>
        <FloatingBubbles count={4} />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 12 }}>EĞİTMEN HİKAYELERİ</p>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 42, fontWeight: 800, letterSpacing: -1.5, margin: 0 }}>Onlar başardı.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#faf9f6', border: '1.5px solid rgba(26,26,24,.07)', borderRadius: 18, padding: 30 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= Math.round(t.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(26,26,24,.65)', lineHeight: 1.75, marginBottom: 22, fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif', fontWeight: 700, color: '#C4500A', fontSize: 16 }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{t.name}</p>
                      <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', margin: '2px 0 0' }}>{t.role}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 700, color: '#C4500A', margin: 0 }}>{t.students} öğrenci</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.3)', margin: '2px 0 0' }}>{t.area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section style={{ padding: '100px 48px', position: 'relative', overflow: 'hidden' }}>
        <FloatingBubbles count={4} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 16 }}>SSS</p>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 42, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20 }}>Aklındaki sorular.</h2>
            <p style={{ fontSize: 14, color: 'rgba(26,26,24,.5)', lineHeight: 1.75, marginBottom: 28 }}>
              Bulamadığın sorun için bize ulaş.
            </p>
            <a href="mailto:destek@campuswe.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#C4500A', textDecoration: 'none', border: '1.5px solid rgba(196,80,10,.3)', borderRadius: 10, padding: '10px 16px' }}>
              <Mail size={14} /> destek@campuswe.com
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: 'white', border: `1.5px solid ${openFaq === i ? 'rgba(196,80,10,.25)' : 'rgba(26,26,24,.07)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color .2s' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', margin: 0 }}>{faq.q}</p>
                  <ChevronDown size={16} color="rgba(26,26,24,.4)" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px' }}>
                    <p style={{ fontSize: 13, color: 'rgba(26,26,24,.55)', lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SON CTA */}
      <section style={{ padding: '100px 48px', background: '#1a1a18', position: 'relative', overflow: 'hidden' }}>
        <FloatingBubbles count={6} dark />
        <Particles count={8} />
        <div style={{ position: 'absolute', top: -100, left: -100, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,80,10,.18), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,80,10,.1), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', letterSpacing: 3, marginBottom: 20 }}>HEMEN BAŞLA</p>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 52, fontWeight: 800, color: 'white', letterSpacing: -2, lineHeight: 1.08, marginBottom: 24 }}>
              İlk kursunu bu<br />
              <em style={{ color: '#C4500A', fontStyle: 'normal' }}>hafta yayınla.</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.4)', lineHeight: 1.75, marginBottom: 36 }}>
              Kaydol, kursunu oluştur, yayınla. Tüm süreç 30 dakika sürer.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', fontSize: 15, fontWeight: 700, textDecoration: 'none', padding: '14px 28px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Ücretsiz başla <ArrowRight size={16} />
              </Link>
              <Link href="/auth/login" style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', fontSize: 15, textDecoration: 'none', padding: '14px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,.1)' }}>
                Giriş yap
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { emoji: '🎓', title: 'Eğitmen rozeti', desc: 'Profilinde öne çıkan "Eğitmen" rozeti kazan.' },
              { emoji: '💰', title: '%75 gelir payı', desc: 'Her satıştan %75 otomatik hesabına geçiyor.' },
              { emoji: '📊', title: 'Gelir analitik', desc: 'Aylık gelir, öğrenci sayısı, tamamlanma oranı.' },
              { emoji: '🤝', title: 'Topluluk erişimi', desc: '1200+ girişimcinin olduğu ağa tam erişim.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '16px 20px' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'white', margin: 0 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', margin: '3px 0 0' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px 48px', borderTop: '1px solid rgba(26,26,24,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<span style={{ color: '#C4500A' }}>We</span>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Ana Sayfa', '/'], ['Kurslar', '/kurslar'], ['Giriş', '/auth/login'], ['Kayıt', '/auth/register']].map(([l, h]) => (
            <Link key={h} href={h} style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.2)' }}>© 2026 CampusWe</p>
      </footer>
    </div>
  )
}