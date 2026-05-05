import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Check, Zap, Building2, Star } from 'lucide-react'

export default async function FiyatlandirmaPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: subscription } = user ? await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'aktif')
    .single() : { data: null }

  const isPro = !!subscription

  const freeFeatures = [
    'Profil oluşturma',
    'Startup sayfası',
    'Topluluk akışı',
    'Kahve Molası eşleştirme',
    '5 takas teklifi/ay',
    'Garaj etkinliklerine katılım',
    'Sanal kütüphane',
    'Temel mesajlaşma',
  ]

  const proFeatures = [
    'Tüm ücretsiz özellikler',
    'Sınırsız takas teklifi',
    'Öncelikli Demo Day başvurusu',
    'Gelişmiş co-founder eşleştirme',
    'Pro rozeti profilde',
    'Yatırımcılarla direkt mesaj',
    'Çalışma alanı — sınırsız dosya',
    'Haftalık girişim raporu',
    'Öncelikli destek',
  ]

  const corporateFeatures = [
    'Markalı kuluçka katı',
    'Premium yetenek erişimi',
    'Sponsored Demo Day',
    'Özel etkinlik organizasyonu',
    'Yetenek analitik paneli',
    'Aylık raporlama',
    'Özel account manager',
    'API erişimi',
  ]

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 3rem', borderBottom: '1px solid rgba(26,26,24,.1)', background: '#F5F0E8', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <Link href="/dashboard" style={{ background: '#C4500A', color: '#F5F0E8', padding: '7px 18px', borderRadius: 4, fontSize: 13, textDecoration: 'none' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" style={{ color: 'rgba(26,26,24,.6)', fontSize: 13, textDecoration: 'none' }}>Giriş yap</Link>
              <Link href="/auth/register" style={{ background: '#C4500A', color: '#F5F0E8', padding: '7px 18px', borderRadius: 4, fontSize: 13, textDecoration: 'none' }}>
                Kayıt ol
              </Link>
            </>
          )}
        </div>
      </nav>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '5rem 2rem' }}>

        {/* Başlık */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1rem' }}>FİYATLANDIRMA</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 44, fontWeight: 800, color: '#1a1a18', letterSpacing: -2, margin: 0, lineHeight: 1.1 }}>
            Sade ve şeffaf.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(26,26,24,.45)', marginTop: '1rem' }}>Ücretsiz başla, büyüdükçe yükselt.</p>
        </div>

        {/* Planlar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: '4rem' }}>

          {/* Ücretsiz */}
          <div style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.5rem' }}>BAŞLANGIÇ</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: '#1a1a18', margin: 0 }}>Ücretsiz</p>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', marginTop: 4 }}>Sonsuza kadar</p>
            </div>
            <div style={{ flex: 1, marginBottom: '1.5rem' }}>
              {freeFeatures.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Check size={13} color="#22c55e" />
                  <span style={{ fontSize: 13, color: 'rgba(26,26,24,.65)' }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/register" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 8, border: '1px solid rgba(26,26,24,.2)', color: '#1a1a18', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              Ücretsiz başla
            </Link>
          </div>

          {/* Pro */}
          <div style={{ background: '#1a1a18', border: '1px solid #1a1a18', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#C4500A', color: 'white', fontSize: 11, fontFamily: 'monospace', letterSpacing: 2, padding: '4px 14px', borderRadius: 999 }}>
              EN POPÜLER
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.5rem' }}>PRO</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: 'white', margin: 0 }}>₺99</p>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>/ay</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>veya ₺899/yıl — 2 ay ücretsiz</p>
            </div>
            <div style={{ flex: 1, marginBottom: '1.5rem' }}>
              {proFeatures.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Check size={13} color="#C4500A" />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,.65)' }}>{f}</span>
                </div>
              ))}
            </div>
            {isPro ? (
              <div style={{ textAlign: 'center', padding: '11px', borderRadius: 8, background: 'rgba(196,80,10,.2)', color: '#C4500A', fontSize: 14, fontWeight: 500 }}>
                ✓ Aktif Plan
              </div>
            ) : (
              <Link href={user ? '/pro/upgrade' : '/auth/register'} style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 8, background: '#C4500A', color: 'white', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
                Pro'ya geç →
              </Link>
            )}
          </div>

          {/* Kurumsal */}
          <div style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.5rem' }}>KURUMSAL</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: '#1a1a18', margin: 0 }}>Özel fiyat</p>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', marginTop: 4 }}>Şirket büyüklüğüne göre</p>
            </div>
            <div style={{ flex: 1, marginBottom: '1.5rem' }}>
              {corporateFeatures.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Check size={13} color="#22c55e" />
                  <span style={{ fontSize: 13, color: 'rgba(26,26,24,.65)' }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/kurumsal" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 8, background: '#C4500A', color: 'white', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              İletişime geç →
            </Link>
          </div>

        </div>

        {/* SSS */}
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1a1a18', textAlign: 'center', marginBottom: '2rem', letterSpacing: -1 }}>
            Sık sorulan sorular
          </h2>
          {[
            { q: 'Ücretsiz plan ne kadar süre geçerli?', a: 'Sonsuza kadar. Temel özellikler her zaman ücretsiz kalacak.' },
            { q: 'Pro planı iptal edebilir miyim?', a: 'Evet, istediğin zaman iptal edebilirsin. Kalan süren boyunca Pro özellikleri kullanmaya devam edersin.' },
            { q: 'Kurumsal plan nasıl çalışıyor?', a: 'Şirket büyüklüğüne ve ihtiyaçlara göre özel fiyatlandırma yapıyoruz. Formu doldur, 24 saat içinde dönelim.' },
            { q: 'Ödeme güvenli mi?', a: 'Tüm ödemeler SSL ile şifreleniyor. Kart bilgilerin bizde saklanmıyor.' },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(26,26,24,.08)', padding: '1.5rem 0' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: '#1a1a18', margin: '0 0 0.5rem' }}>{item.q}</p>
              <p style={{ fontSize: 14, color: 'rgba(26,26,24,.55)', margin: 0, lineHeight: 1.7 }}>{item.a}</p>
            </div>
          ))}
        </div>

      </main>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(26,26,24,.08)', padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 800, color: 'rgba(26,26,24,.4)' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.25)', letterSpacing: 1 }}>© 2026 CAMPUSWE</span>
      </div>
    </div>
  )
}