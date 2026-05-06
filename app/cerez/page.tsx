'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Ana sayfa' },
  { href: '/kurslar', label: 'Kurslar' },
  { href: '/fiyatlandirma', label: 'Fiyatlandırma' },
  { href: '/kurumsal', label: 'Kurumsal' },
]

export default function CerezPage() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .nav-link { transition: color 0.15s; position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1.5px; background: #C4500A; transition: width 0.2s; }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #1a1a18 !important; }
        h2 { font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #1a1a18; margin: 2rem 0 0.75rem; letter-spacing: -0.5px; }
        h3 { font-family: Georgia, serif; font-size: 16px; font-weight: 700; color: #1a1a18; margin: 1.5rem 0 0.5rem; }
        p { font-size: 14px; color: rgba(26,26,24,.65); line-height: 1.8; margin: 0 0 1rem; }
        ul { font-size: 14px; color: rgba(26,26,24,.65); line-height: 1.8; margin: 0 0 1rem; padding-left: 1.5rem; }
        li { margin-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 13px; }
        th { background: rgba(26,26,24,.06); padding: 10px 12px; text-align: left; font-weight: 600; color: #1a1a18; border: 1px solid rgba(26,26,24,.08); }
        td { padding: 10px 12px; color: rgba(26,26,24,.65); border: 1px solid rgba(26,26,24,.08); vertical-align: top; }
        tr:nth-child(even) td { background: rgba(26,26,24,.02); }
      `}</style>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 4rem', borderBottom: '1px solid rgba(26,26,24,.1)', background: 'rgba(245,240,232,.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>{link.label}</Link>
          ))}
          <Link href="/auth/login" className="nav-link" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Giriş yap</Link>
          <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', padding: '8px 20px', borderRadius: 6, fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>Kayıt ol →</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 2rem', opacity: visible ? 1 : 0, transition: 'opacity 0.6s' }}>
        <div className="fade-up">
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>GİZLİLİK</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 42, fontWeight: 800, color: '#1a1a18', letterSpacing: -2, margin: '0 0 0.5rem' }}>Çerez Politikası</h1>
          <p style={{ color: 'rgba(26,26,24,.4)', marginBottom: '2rem' }}>Son güncelleme: Mayıs 2026</p>
          <div style={{ height: 3, width: 48, background: '#C4500A', borderRadius: 2, marginBottom: '2.5rem' }} />
        </div>

        <div className="fade-up" style={{ animationDelay: '0.2s', background: 'white', border: '1px solid rgba(26,26,24,.08)', borderRadius: 16, padding: '2.5rem' }}>

          <h2>1. Çerez Nedir?</h2>
          <p>Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız tarafından cihazınıza kaydedilen küçük metin dosyalarıdır. Oturumunuzu hatırlamak, tercihlerinizi kaydetmek ve platformun düzgün çalışmasını sağlamak için kullanılırlar.</p>

          <h2>2. Kullandığımız Çerezler</h2>
          <table>
            <thead>
              <tr>
                <th>Çerez Adı</th>
                <th>Tür</th>
                <th>Amaç</th>
                <th>Süre</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>sb-auth-token</td><td>Zorunlu</td><td>Kullanıcı oturumu ve kimlik doğrulama</td><td>7 gün</td></tr>
              <tr><td>sb-refresh-token</td><td>Zorunlu</td><td>Oturum yenileme</td><td>30 gün</td></tr>
              <tr><td>campuswe-prefs</td><td>İşlevsel</td><td>Kullanıcı tercihleri (dil, tema)</td><td>1 yıl</td></tr>
              <tr><td>_vercel_analytics</td><td>Analitik</td><td>Sayfa görüntüleme istatistikleri</td><td>30 gün</td></tr>
            </tbody>
          </table>

          <h2>3. Çerez Türleri</h2>
          <h3>Zorunlu Çerezler</h3>
          <p>Bu çerezler platformun çalışması için gereklidir. Oturum yönetimi ve güvenlik için kullanılır. Devre dışı bırakılamaz.</p>

          <h3>İşlevsel Çerezler</h3>
          <p>Tercihlerinizi (dil seçimi, arayüz ayarları gibi) hatırlamak için kullanılır. Devre dışı bırakılabilir ancak bazı özellikler düzgün çalışmayabilir.</p>

          <h3>Analitik Çerezler</h3>
          <p>Platformun nasıl kullanıldığını anlamamıza yardımcı olur. Tüm veriler anonim ve toplu haldedir. Vercel Analytics altyapısı kullanılmaktadır.</p>

          <h2>4. Üçüncü Taraf Çerezleri</h2>
          <p>Platform aşağıdaki üçüncü taraf hizmetlerini kullanmaktadır:</p>
          <ul>
            <li><strong>Supabase:</strong> Kimlik doğrulama ve veritabanı — zorunlu oturum çerezleri</li>
            <li><strong>Vercel:</strong> Hosting ve analitik — performans ve hata izleme</li>
          </ul>
          <p>Reklam veya pazarlama amaçlı üçüncü taraf çerezleri kullanılmamaktadır.</p>

          <h2>5. Çerezleri Kontrol Etme</h2>
          <p>Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz:</p>
          <ul>
            <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
            <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler</li>
            <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezleri yönet</li>
            <li><strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</li>
          </ul>
          <p>Zorunlu çerezleri devre dışı bırakmanız halinde platforma giriş yapamayabilirsiniz.</p>

          <h2>6. Çerez Onayı</h2>
          <p>Platformu ilk ziyaretinizde çerez tercihlerinizi ayarlayabilirsiniz. Onay banner'ını kapatarak veya platformu kullanmaya devam ederek zorunlu çerezlerin kullanımını kabul etmiş olursunuz.</p>

          <h2>7. Değişiklikler</h2>
          <p>Bu politika güncellenebilir. Önemli değişiklikler platform üzerinden duyurulur.</p>

          <h2>8. İletişim</h2>
          <p>Çerezlerle ilgili sorularınız için: <strong>privacy@campuswe.com</strong></p>

        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link href="/gizlilik" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none' }}>Gizlilik Politikası →</Link>
          <Link href="/kullanim-kosullari" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none' }}>Kullanım Koşulları →</Link>
        </div>
      </main>

      <div style={{ borderTop: '1px solid rgba(26,26,24,.08)', padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 800, color: 'rgba(26,26,24,.4)', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/gizlilik" style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', textDecoration: 'none' }}>Gizlilik</Link>
          <Link href="/kullanim-kosullari" style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', textDecoration: 'none' }}>Kullanım Koşulları</Link>
          <Link href="/cerez" style={{ fontSize: 13, color: 'rgba(26,26,24,.4)', textDecoration: 'none' }}>Çerez Politikası</Link>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.2)', letterSpacing: 1 }}>© 2026 CAMPUSWE</span>
      </div>
    </div>
  )
}