'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Check, ArrowLeft, Star, Zap } from 'lucide-react'

export default function ProUpgradePage() {
  const router = useRouter()
  const supabase = createClient()
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const endsAt = new Date()
    endsAt.setMonth(endsAt.getMonth() + (plan === 'yearly' ? 12 : 1))

    await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan: 'pro',
      status: 'aktif',
      ends_at: endsAt.toISOString(),
    })

    await supabase.from('profiles').update({ is_pro: true }).eq('id', user.id)

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  const proFeatures = [
    'Sınırsız takas teklifi',
    'Öncelikli Demo Day başvurusu',
    'Gelişmiş co-founder eşleştirme',
    'Pro rozeti profilde',
    'Yatırımcılarla direkt mesaj',
    'Çalışma alanı — sınırsız dosya',
    'Haftalık girişim raporu',
    'Öncelikli destek',
  ]

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 3rem', borderBottom: '1px solid rgba(26,26,24,.1)', background: '#F5F0E8', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <Link href="/fiyatlandirma" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>← Fiyatlandırma</Link>
      </nav>

      <main style={{ maxWidth: 520, margin: '0 auto', padding: '4rem 2rem' }}>
        {success ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', margin: '0 0 12px' }}>
              Pro'ya hoş geldin!
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(26,26,24,.5)' }}>Dashboard'a yönlendiriliyorsun...</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Star size={26} color="#C4500A" />
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 800, color: '#1a1a18', letterSpacing: -1.5, margin: '0 0 8px' }}>
                Pro'ya geç
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(26,26,24,.45)', margin: 0 }}>
                Tüm özelliklere sınırsız erişim.
              </p>
            </div>

            {/* Plan seçimi */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { key: 'monthly', label: 'Aylık', price: '₺99', sub: '/ay' },
                { key: 'yearly', label: 'Yıllık', price: '₺899', sub: '/yıl', badge: '2 ay ücretsiz' },
              ].map(p => (
                <button key={p.key} onClick={() => setPlan(p.key as any)}
                  style={{
                    background: plan === p.key ? 'rgba(196,80,10,.06)' : 'white',
                    border: plan === p.key ? '2px solid #C4500A' : '1px solid rgba(26,26,24,.12)',
                    borderRadius: 12, padding: '1.25rem', cursor: 'pointer', textAlign: 'center', position: 'relative'
                  }}>
                  {p.badge && (
                    <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#C4500A', color: 'white', fontSize: 10, fontFamily: 'monospace', padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                      {p.badge}
                    </span>
                  )}
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 6px' }}>{p.label}</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 800, color: '#1a1a18', margin: 0 }}>{p.price}</p>
                  <p style={{ fontSize: 12, color: 'rgba(26,26,24,.35)', margin: '2px 0 0' }}>{p.sub}</p>
                </button>
              ))}
            </div>

            {/* Özellikler */}
            <div style={{ background: 'white', border: '1px solid rgba(26,26,24,.1)', borderRadius: 12, padding: '1.5rem', marginBottom: 20 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 14px' }}>PRO'DA NE VAR</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                {proFeatures.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Check size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'rgba(26,26,24,.65)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleUpgrade} disabled={loading}
              style={{
                width: '100%', background: '#C4500A', color: 'white', padding: '14px',
                borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              <Zap size={16} />
              {loading ? 'İşleniyor...' : `${plan === 'monthly' ? '₺99/ay' : '₺899/yıl'} ile Pro'ya geç`}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(26,26,24,.3)', marginTop: 12 }}>
              İstediğin zaman iptal edebilirsin. SSL ile güvenli.
            </p>
          </>
        )}
      </main>
    </div>
  )
}