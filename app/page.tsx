import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.2rem 3rem', borderBottom: '1px solid rgba(26,26,24,.1)',
        background: '#F5F0E8', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 800, color: '#1a1a18' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <Link href="/dashboard" style={btnPrimary}>Dashboard →</Link>
          ) : (
            <>
              <Link href="/auth/login" style={btnSecondary}>Giriş yap</Link>
              <Link href="/auth/register" style={btnPrimary}>Kayıt ol</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid rgba(26,26,24,.1)',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.05) 79px,rgba(26,26,24,.05) 80px)',
      }}>
        <div style={{
          padding: '5rem 3rem 4rem',
          borderRight: '1px solid rgba(26,26,24,.1)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: 520,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C4500A' }} />
              <span style={{ fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 3, textTransform: 'uppercase' as const }}>
                Türkiye'nin girişimci platformu
              </span>
            </div>
            <h1 style={{
              fontFamily: 'Georgia, serif', fontSize: 54, fontWeight: 800,
              lineHeight: 1.05, letterSpacing: -2, color: '#1a1a18', margin: 0,
            }}>
              Her büyük<br />startup bir<br />
              <em style={{ color: '#C4500A' }}>eksiklikle</em><br />başladı.
            </h1>
            <div style={{ width: 0, height: 2, background: '#1a1a18', margin: '2rem 0', animation: 'lineGrow 1s ease forwards' }} id="divider" />
            <p style={{ fontSize: 14, color: 'rgba(26,26,24,.5)', lineHeight: 1.7, maxWidth: 320, margin: 0 }}>
              CampusWe, eksik olduğun her şeyi sana getirir. Co-founder, yetenek, mentor, yatırımcı — hepsi tek bir platformda.
            </p>
          </div>
          <Link href="/auth/register" style={{ ...btnPrimary, marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '13px 28px' }}>
            Başla →
          </Link>
        </div>

        <div style={{ padding: '5rem 3rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.3)', letterSpacing: 2, marginBottom: '1.5rem' }}>
              CAMPUSWE — 2026 / TÜRKİYE
            </p>
            <div style={{ borderLeft: '3px solid #C4500A', paddingLeft: '1.2rem' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, lineHeight: 1.3, color: '#1a1a18', margin: 0 }}>
                "Eksiklik,<br />
                <em style={{ color: '#C4500A' }}>başlangıçtır.</em>"
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(26,26,24,.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {[
                { n: '12K+', l: 'Aktif kurucu' },
                { n: '340+', l: 'Üniversite' },
                { n: '2.4K+', l: 'Tamamlanan takas' },
                { n: '86+', l: 'Demo Day pitch' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: '1.2rem 0',
                  borderRight: i % 2 === 0 ? '1px solid rgba(26,26,24,.1)' : 'none',
                  borderTop: i >= 2 ? '1px solid rgba(26,26,24,.1)' : 'none',
                  paddingLeft: i % 2 === 1 ? '1.2rem' : 0,
                  paddingRight: i % 2 === 0 ? '1.2rem' : 0,
                }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800, color: '#1a1a18', letterSpacing: -1 }}>
                    {s.n.replace('+', '')}<span style={{ color: '#C4500A' }}>+</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(26,26,24,.4)', marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manifesto */}
      <div style={{ borderBottom: '1px solid rgba(26,26,24,.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
          <div style={{
            borderRight: '1px solid rgba(26,26,24,.1)', padding: '4rem 2rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{
              fontFamily: 'monospace', fontSize: 9, color: 'rgba(26,26,24,.3)',
              letterSpacing: 3, textTransform: 'uppercase' as const,
              writingMode: 'vertical-rl' as const, transform: 'rotate(180deg)',
            }}>Manifesto</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 80, fontWeight: 800, color: 'rgba(26,26,24,.06)', lineHeight: 1, letterSpacing: -4 }}>01</div>
          </div>
          <div style={{ padding: '4rem 3rem' }}>
            {[
              { text: '"Her yıl binlerce fikir ölüyor."', small: true },
              { text: 'Sadece doğru insanı bulamadığı için.', small: true },
              { text: <>Kod yazamıyorsun. <em style={{ color: '#C4500A', fontStyle: 'italic' }}>Birini bul.</em></>, small: false },
              { text: <>Tasarım bilmiyorsun. <em style={{ color: '#C4500A', fontStyle: 'italic' }}>Takas et.</em></>, small: false },
              { text: <>Yatırımcı tanımıyorsun. <em style={{ color: '#C4500A', fontStyle: 'italic' }}>Pitch yap.</em></>, small: false },
            ].map((line, i) => (
              <p key={i} style={{
                fontFamily: line.small ? 'Inter, sans-serif' : 'Georgia, serif',
                fontSize: line.small ? 16 : 28,
                fontWeight: line.small ? 400 : 700,
                lineHeight: 1.3,
                letterSpacing: line.small ? 0 : -0.8,
                color: line.small ? 'rgba(26,26,24,.45)' : '#1a1a18',
                marginBottom: '1rem',
              }}>{line.text}</p>
            ))}
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 800, letterSpacing: -1.5, color: '#1a1a18', marginTop: '2rem' }}>
              Eksiklik, <em style={{ color: '#C4500A' }}>başlangıçtır.</em>
            </p>
          </div>
        </div>
      </div>

      {/* Özellikler */}
      <div style={{ borderBottom: '1px solid rgba(26,26,24,.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', borderBottom: '1px solid rgba(26,26,24,.1)' }}>
          <div style={{ borderRight: '1px solid rgba(26,26,24,.1)', padding: '2rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase' as const, margin: 0 }}>Ne sunuyoruz</p>
          </div>
          <div style={{ padding: '2rem 3rem' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1a1a18', margin: 0, letterSpacing: -1 }}>
              Girişimin için ihtiyacın olan her şey.
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { n: '01', t: 'Co-founder eşleşmesi', d: 'MatchMaker AI en uygun kurucu ortağını bulur.' },
            { n: '02', t: 'Karma Token takası', d: 'Para gerekmez. Yeteneğini takas et, projeni ilerlet.' },
            { n: '03', t: 'Startup sayfası', d: 'İlerlemeyi GitHub gibi herkese göster.' },
            { n: '04', t: 'Demo Day', d: 'Ayda bir kez gerçek yatırımcılara pitch yap.' },
            { n: '05', t: 'Office Hours', d: 'Sektör profesyonellerinden haftada bir saat öğren.' },
            { n: '06', t: 'Dijital Garaj', d: 'Açık etkinlikler ve özel ekip çalışma odaları.' },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '2.5rem 1.5rem',
              borderRight: (i + 1) % 3 !== 0 ? '1px solid rgba(26,26,24,.08)' : 'none',
              borderBottom: i < 3 ? '1px solid rgba(26,26,24,.08)' : 'none',
            }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#C4500A', letterSpacing: 2, marginBottom: '1rem' }}>{f.n}</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 700, color: '#1a1a18', marginBottom: '.5rem', letterSpacing: -.3 }}>{f.t}</p>
              <p style={{ fontSize: 13, color: 'rgba(26,26,24,.45)', lineHeight: 1.6, margin: 0 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hikayeler */}
      <div style={{ borderBottom: '1px solid rgba(26,26,24,.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', borderBottom: '1px solid rgba(26,26,24,.1)' }}>
          <div style={{ borderRight: '1px solid rgba(26,26,24,.1)', padding: '2rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase' as const, margin: 0 }}>Hikayeler</p>
          </div>
          <div style={{ padding: '2rem 3rem' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1a1a18', margin: 0, letterSpacing: -1 }}>
              Gerçek insanlar, gerçek büyüme.
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { q: '"Kod yazamıyordum. Bir geliştiriciyle UI takas yaptım. 3 ayda MVP\'ye ulaştık."', n: 'Zeynep Arslan', m: 'BİLKENT · EDUTECH' },
            { q: '"Demo Day\'de tanıştığım yatırımcı şu an benim seed round liderlerimden biri."', n: 'Kaan Demir', m: 'İTÜ · AGRITECH' },
            { q: '"Kahve Molası\'nda tanıştığım kişi şu an co-founder\'ım. Hiç planlamadım bunu."', n: 'Selin Yıldız', m: 'BOĞAZİÇİ · HEALTHTECH' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '2.5rem',
              borderRight: i < 2 ? '1px solid rgba(26,26,24,.08)' : 'none',
            }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontStyle: 'italic', color: '#1a1a18', lineHeight: 1.7, marginBottom: '1.5rem' }}>{s.q}</p>
              <div style={{ width: 24, height: 2, background: '#C4500A', marginBottom: '1rem' }} />
              <p style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18', margin: 0 }}>{s.n}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', marginTop: 2 }}>{s.m}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '6rem 3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', borderBottom: '1px solid rgba(26,26,24,.1)' }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(26,26,24,.35)', letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: '2rem' }}>Başlamaya hazır mısın</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: '#1a1a18', margin: 0 }}>
            Her büyük startup bir{' '}
            <em style={{ color: '#C4500A' }}>eksiklikle</em> başladı.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: 15, color: 'rgba(26,26,24,.5)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Seninki de burada başlasın. CampusWe, eksik olduğun her şeyi sana getirir. Ücretsiz başla, istediğin zaman büyü.
          </p>
          <Link href="/auth/register" style={{ ...btnPrimary, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '13px 28px', width: 'fit-content' }}>
            Ücretsiz başla →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '1.8rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 800, color: 'rgba(26,26,24,.4)' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.25)', letterSpacing: 1 }}>
          © 2026 CAMPUSWE
        </span>
      </div>
    </div>
  )
}

const btnPrimary: React.CSSProperties = {
  background: '#C4500A',
  color: '#F5F0E8',
  padding: '7px 18px',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 500,
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  letterSpacing: 0.3,
}

const btnSecondary: React.CSSProperties = {
  background: 'transparent',
  color: 'rgba(26,26,24,.6)',
  border: '1px solid rgba(26,26,24,.2)',
  padding: '7px 18px',
  borderRadius: 4,
  fontSize: 12,
  textDecoration: 'none',
  cursor: 'pointer',
  letterSpacing: 0.3,
}