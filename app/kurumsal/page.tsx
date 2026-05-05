'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Building2, Check } from 'lucide-react'

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+']
const INTERESTS = [
  'Markalı kuluçka katı',
  'Premium yetenek erişimi',
  'Sponsored Demo Day',
  'Özel etkinlik organizasyonu',
  'Stajyer ve işe alım',
  'Diğer',
]

export default function KurumsalPage() {
  const supabase = createClient()
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    company_size: '',
    interest: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase
      .from('corporate_applications')
      .insert(form)

    if (insertError) {
      setError('Bir hata oluştu. Lütfen tekrar dene.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 3rem', borderBottom: '1px solid rgba(26,26,24,.1)', background: '#F5F0E8' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <Link href="/fiyatlandirma" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>← Fiyatlandırma</Link>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Check size={28} color="#C4500A" />
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', margin: '0 0 1rem' }}>Başvurun alındı!</h1>
            <p style={{ fontSize: 16, color: 'rgba(26,26,24,.5)', marginBottom: '2rem' }}>
              24 saat içinde {form.contact_email} adresine dönüş yapacağız.
            </p>
            <Link href="/" style={{ background: '#C4500A', color: 'white', padding: '12px 28px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              Ana sayfaya dön
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

            {/* Sol — Bilgi */}
            <div>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1rem' }}>KURUMSAL</p>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, color: '#1a1a18', letterSpacing: -1.5, margin: '0 0 1rem', lineHeight: 1.1 }}>
                En iyi yetenekleri<br />
                <em style={{ color: '#C4500A' }}>mezun olmadan</em> bul.
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(26,26,24,.5)', lineHeight: 1.75, marginBottom: '2rem' }}>
                CampusWe'deki girişimci öğrenciler Türkiye'nin en yetenekli gençleri. Onları CV taramadan önce keşfet.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { emoji: '🏢', title: 'Markalı kuluçka katı', desc: 'Şirket adınla özelleştirilmiş bir alan. Öğrenciler sizin mentörlüğünüzde çalışır.' },
                  { emoji: '🎯', title: 'Yetenek avcılığı', desc: 'Projeleri takip et, en iyileri mezun olmadan stajyer veya tam zamanlı işe al.' },
                  { emoji: '⭐', title: 'Sponsored Demo Day', desc: 'Şirketin adıyla özel bir Demo Day organize et, startup ekosistemiyle buluş.' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji}</span>
                    <div>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, color: '#1a1a18', margin: '0 0 3px' }}>{item.title}</p>
                      <p style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ — Form */}
            <div style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1a1a18', margin: '0 0 1.5rem' }}>İletişim formu</h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, color: 'rgba(26,26,24,.4)', textTransform: 'uppercase', marginBottom: 6 }}>Şirket adı</label>
                    <input name="company_name" required className="input" placeholder="Trendyol, Getir..." value={form.company_name} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, color: 'rgba(26,26,24,.4)', textTransform: 'uppercase', marginBottom: 6 }}>Ad Soyad</label>
                    <input name="contact_name" required placeholder="Adınız" value={form.contact_name} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, color: 'rgba(26,26,24,.4)', textTransform: 'uppercase', marginBottom: 6 }}>E-posta</label>
                  <input name="contact_email" type="email" required placeholder="ornek@sirket.com" value={form.contact_email} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, color: 'rgba(26,26,24,.4)', textTransform: 'uppercase', marginBottom: 6 }}>Şirket büyüklüğü</label>
                    <select name="company_size" value={form.company_size} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}>
                      <option value="">Seç</option>
                      {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} çalışan</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, color: 'rgba(26,26,24,.4)', textTransform: 'uppercase', marginBottom: 6 }}>İlgi alanı</label>
                    <select name="interest" value={form.interest} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}>
                      <option value="">Seç</option>
                      {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, color: 'rgba(26,26,24,.4)', textTransform: 'uppercase', marginBottom: 6 }}>Mesajınız</label>
                  <textarea name="message" rows={3} placeholder="Nasıl yardımcı olabiliriz?" value={form.message} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(26,26,24,.15)', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', background: 'white' }} />
                </div>

                {error && <p style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '8px 12px' }}>{error}</p>}

                <button type="submit" disabled={loading} style={{ background: '#C4500A', color: 'white', padding: '12px', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Gönderiliyor...' : 'Başvuruyu gönder →'}
                </button>
              </form>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}