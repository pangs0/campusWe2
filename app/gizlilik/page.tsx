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

export default function GizlilikPage() {
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
        .nav-link.active { color: #C4500A !important; }
        .nav-link.active::after { width: 100%; }
        h2 { font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #1a1a18; margin: 2rem 0 0.75rem; letter-spacing: -0.5px; }
        h3 { font-family: Georgia, serif; font-size: 16px; font-weight: 700; color: #1a1a18; margin: 1.5rem 0 0.5rem; }
        p { font-size: 14px; color: rgba(26,26,24,.65); line-height: 1.8; margin: 0 0 1rem; }
        ul { font-size: 14px; color: rgba(26,26,24,.65); line-height: 1.8; margin: 0 0 1rem; padding-left: 1.5rem; }
        li { margin-bottom: 4px; }
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
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 42, fontWeight: 800, color: '#1a1a18', letterSpacing: -2, margin: '0 0 0.5rem' }}>Gizlilik Politikası</h1>
          <p style={{ color: 'rgba(26,26,24,.4)', marginBottom: '2rem' }}>Son güncelleme: Mayıs 2026</p>
          <div style={{ height: 3, width: 48, background: '#C4500A', borderRadius: 2, marginBottom: '2.5rem' }} />
        </div>

        <div className="fade-up" style={{ animationDelay: '0.2s', background: 'white', border: '1px solid rgba(26,26,24,.08)', borderRadius: 16, padding: '2.5rem' }}>

          <h2>1. Veri Sorumlusu</h2>
          <p>CampusWe ("Platform", "biz") olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz. Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve haklarınızın neler olduğunu açıklamaktadır.</p>

          <h2>2. Topladığımız Veriler</h2>
          <h3>2.1 Kayıt sırasında toplanan veriler</h3>
          <ul>
            <li>Ad, soyad ve kullanıcı adı</li>
            <li>E-posta adresi</li>
            <li>Şifre (şifrelenmiş olarak saklanır, düz metin olarak tutulmaz)</li>
            <li>Üniversite, şehir ve rol bilgisi (girişimci / yatırımcı / şirket)</li>
          </ul>

          <h3>2.2 Platform kullanımı sırasında toplanan veriler</h3>
          <ul>
            <li>Profil bilgileri (biyografi, yetenekler, avatar)</li>
            <li>Startup, kurs ve içerik bilgileri</li>
            <li>Mesaj ve bildirim içerikleri</li>
            <li>Platform içi aktivite verileri (karma token, takas teklifleri)</li>
            <li>IP adresi ve cihaz bilgileri (güvenlik amaçlı)</li>
          </ul>

          <h3>2.3 Otomatik toplanan veriler</h3>
          <ul>
            <li>Çerezler ve oturum verileri</li>
            <li>Sayfa görüntüleme ve tıklama verileri</li>
            <li>Tarayıcı türü ve işletim sistemi bilgisi</li>
          </ul>

          <h2>3. Verilerin İşlenme Amaçları</h2>
          <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
          <ul>
            <li>Hesap oluşturma ve kimlik doğrulama</li>
            <li>Platform hizmetlerinin sunulması ve geliştirilmesi</li>
            <li>Kullanıcılar arası eşleştirme ve iletişim imkânı sağlanması</li>
            <li>Bildirim ve hizmet içi mesajların iletilmesi</li>
            <li>Güvenlik, dolandırıcılık önleme ve yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Analitik ve istatistiksel analizler (anonim/toplu halde)</li>
          </ul>

          <h2>4. Verilerin Paylaşımı</h2>
          <p>Kişisel verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:</p>
          <ul>
            <li><strong>Hizmet sağlayıcılar:</strong> Supabase (veritabanı), Vercel (hosting) — yalnızca hizmet sunumu için</li>
            <li><strong>Yasal zorunluluk:</strong> Mahkeme kararı veya yasal düzenleme gereği</li>
            <li><strong>Açık rıza:</strong> Sizin onayınızla üçüncü taraflarla paylaşım</li>
          </ul>
          <p>Verileriniz reklam amaçlı üçüncü taraflara satılmaz veya kiralanmaz.</p>

          <h2>5. Veri Güvenliği</h2>
          <ul>
            <li>Tüm veriler SSL/TLS şifrelemesiyle iletilir</li>
            <li>Şifreler bcrypt algoritmasıyla hashlenerek saklanır</li>
            <li>Veritabanı erişimleri Row Level Security (RLS) ile korunur</li>
            <li>Düzenli güvenlik güncellemeleri ve denetimleri yapılır</li>
          </ul>

          <h2>6. Veri Saklama Süresi</h2>
          <p>Verileriniz hesabınız aktif olduğu sürece saklanır. Hesabınızı sildiğinizde, verileriniz 30 gün içinde sistemden kalıcı olarak silinir. Yasal yükümlülükler gerektirdiği durumlarda bazı veriler daha uzun süre saklanabilir.</p>

          <h2>7. KVKK Kapsamındaki Haklarınız</h2>
          <p>6698 sayılı KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>Kişisel verilerinize ilişkin bilgi talep etme</li>
            <li>Verilerin işlenme amacını öğrenme ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri öğrenme</li>
            <li>Verilerin eksik veya yanlış işlenmesi halinde düzeltilmesini isteme</li>
            <li>Verilerin silinmesini veya yok edilmesini isteme</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
            <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme</li>
          </ul>

          <h2>8. Çocukların Gizliliği</h2>
          <p>Platform, 18 yaşın altındaki kişilere yönelik değildir. 18 yaşın altında olduğunu düşündüğümüz kullanıcıların hesaplarını kapatma hakkımız saklıdır.</p>

          <h2>9. Değişiklikler</h2>
          <p>Bu politikada yapılacak önemli değişiklikler, kayıtlı e-posta adresinize bildirilir. Platformu kullanmaya devam etmeniz, güncellenmiş politikayı kabul ettiğiniz anlamına gelir.</p>

          <h2>10. İletişim</h2>
          <p>KVKK kapsamındaki haklarınızı kullanmak veya sorularınız için: <strong>kvkk@campuswe.com</strong> adresine yazabilirsiniz.</p>

        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link href="/kullanim-kosullari" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none' }}>Kullanım Koşulları →</Link>
          <Link href="/cerez" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none' }}>Çerez Politikası →</Link>
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