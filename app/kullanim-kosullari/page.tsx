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

export default function KullanimKosullariPage() {
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
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>YASAL</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 42, fontWeight: 800, color: '#1a1a18', letterSpacing: -2, margin: '0 0 0.5rem' }}>Kullanım Koşulları</h1>
          <p style={{ color: 'rgba(26,26,24,.4)', marginBottom: '2rem' }}>Son güncelleme: Mayıs 2026</p>
          <div style={{ height: 3, width: 48, background: '#C4500A', borderRadius: 2, marginBottom: '2.5rem' }} />
        </div>

        <div className="fade-up" style={{ animationDelay: '0.2s', background: 'white', border: '1px solid rgba(26,26,24,.08)', borderRadius: 16, padding: '2.5rem' }}>

          <h2>1. Taraflar ve Kapsam</h2>
          <p>Bu Kullanım Koşulları, CampusWe platformunu ("Platform") kullanan tüm kullanıcılar ("Kullanıcı") ile CampusWe ("Biz") arasındaki hukuki ilişkiyi düzenler. Platforma erişim sağlayarak bu koşulları kabul etmiş sayılırsınız.</p>

          <h2>2. Hizmet Tanımı</h2>
          <p>CampusWe, üniversite öğrencileri ve girişimciler için tasarlanmış bir topluluk platformudur. Platform; startup profili oluşturma, co-founder eşleştirme, kurs paylaşımı, mesajlaşma, Demo Day ve çeşitli topluluk araçlarını kapsar.</p>

          <h2>3. Hesap Oluşturma ve Güvenlik</h2>
          <ul>
            <li>Kayıt olabilmek için 18 yaşını doldurmuş olmanız gerekmektedir</li>
            <li>Gerçek ve güncel bilgiler sağlamakla yükümlüsünüz</li>
            <li>Hesap güvenliğinizden siz sorumlusunuzdur; şifrenizi kimseyle paylaşmayın</li>
            <li>Şüpheli bir aktivite fark ettiğinizde bize bildirmeniz gerekmektedir</li>
            <li>Bir kişi adına yalnızca bir hesap açılabilir</li>
          </ul>

          <h2>4. Kullanıcı İçerikleri ve Fikri Mülkiyet</h2>
          <h3>4.1 Sizin içerikleriniz</h3>
          <p>Platforma yüklediğiniz içeriklerin (metin, görsel, video) fikri mülkiyet hakları size aittir. Ancak bu içerikleri platforma yükleyerek, CampusWe'ye söz konusu içerikleri platform dahilinde kullanma, gösterme ve dağıtma konusunda ücretsiz, dünya genelinde ve münhasır olmayan bir lisans tanımış olursunuz.</p>

          <h3>4.2 Platform içerikleri</h3>
          <p>CampusWe'nin logosu, tasarımı, kodu ve diğer özgün içerikleri CampusWe'ye aittir. İzinsiz kopyalanamaz, çoğaltılamaz veya dağıtılamaz.</p>

          <h2>5. Yasaklı Kullanımlar</h2>
          <p>Aşağıdaki kullanımlar kesinlikle yasaktır:</p>
          <ul>
            <li>Sahte kimlik veya yanıltıcı bilgi kullanmak</li>
            <li>Spam, reklam veya istenmeyen mesaj göndermek</li>
            <li>Başkalarını taciz etmek, tehdit etmek veya ayrımcılık yapmak</li>
            <li>Zararlı yazılım veya kod yaymak</li>
            <li>Platform altyapısına zarar vermek veya yetkisiz erişim denemek</li>
            <li>Telif hakkı ihlali gerçekleştirmek</li>
            <li>Yasadışı içerik paylaşmak</li>
            <li>Başka kullanıcıların verilerini izinsiz toplamak</li>
          </ul>

          <h2>6. Kurs Sistemi ve Komisyon</h2>
          <ul>
            <li>Eğitmenler platforma kurs yükleyerek gelir elde edebilir</li>
            <li>Her kurs satışından %25 platform komisyonu kesilir; %75'i eğitmene ödenir</li>
            <li>Pro üyelerde komisyon oranı %15'e düşer</li>
            <li>Ödemeler aylık olarak hesaplanır ve aktarılır</li>
            <li>Yanlış veya yanıltıcı kurs içerikleri kaldırılabilir</li>
          </ul>

          <h2>7. Demo Day ve Yatırım</h2>
          <p>CampusWe, yatırım tavsiyesi vermez ve yatırımcı ile girişimciler arasındaki anlaşmalardan sorumlu değildir. Demo Day etkinlikleri yalnızca bir buluşma zemini sunar; finansal sonuçlar için herhangi bir garanti verilmez.</p>

          <h2>8. Ücretli Hizmetler ve İade</h2>
          <ul>
            <li>Pro üyelik ücretleri aylık veya yıllık olarak tahsil edilir</li>
            <li>İptal işlemi, bir sonraki dönem faturalandırmasından önce yapılmalıdır</li>
            <li>Dijital hizmet niteliği nedeniyle genel kural olarak iade yapılmaz; ancak teknik sorun kaynaklı şikayetler değerlendirmeye alınır</li>
            <li>Yıllık planlar için ilk 30 gün içinde iptal taleplerinde orantılı iade yapılır</li>
          </ul>

          <h2>9. Hesap Askıya Alma ve Kapatma</h2>
          <p>Aşağıdaki durumlarda hesabınız uyarısız askıya alınabilir veya kapatılabilir:</p>
          <ul>
            <li>Bu koşulların ihlali</li>
            <li>Sahte kimlik kullanımı</li>
            <li>Diğer kullanıcılara zarar verici davranışlar</li>
            <li>Yasal zorunluluklar</li>
          </ul>

          <h2>10. Sorumluluk Sınırı</h2>
          <p>CampusWe, kullanıcılar arasındaki anlaşmazlıklardan, takas işlemlerinin sonuçlarından, yatırım kararlarından veya üçüncü taraf hizmetlerinden doğan zararlardan sorumlu tutulamaz. Platform "olduğu gibi" sunulmaktadır ve kesintisiz hizmet garantisi verilmez.</p>

          <h2>11. Uygulanacak Hukuk</h2>
          <p>Bu sözleşme Türk hukukuna tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.</p>

          <h2>12. Değişiklikler</h2>
          <p>Bu koşullarda yapılacak önemli değişiklikler, kayıtlı e-posta adresinize en az 30 gün önceden bildirilir. Platformu kullanmaya devam etmeniz değişiklikleri kabul ettiğiniz anlamına gelir.</p>

          <h2>13. İletişim</h2>
          <p>Sorularınız için: <strong>legal@campuswe.com</strong></p>

        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link href="/gizlilik" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none' }}>Gizlilik Politikası →</Link>
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