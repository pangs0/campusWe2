'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Check, ArrowLeft, Star } from 'lucide-react'

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
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (success) return (
    <AppLayout user={null}>
      <main className="px-8 py-20 text-center max-w-lg mx-auto">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">Pro'ya hoş geldin!</h1>
        <p className="text-ink/45">Dashboard'a yönlendiriliyorsun...</p>
      </main>
    </AppLayout>
  )

  return (
    <AppLayout user={null}>
      <main className="px-8 py-10 max-w-lg mx-auto">
        <Link href="/fiyatlandirma" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} />
          Fiyatlandırmaya dön
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-3">
            <Star size={24} className="text-brand" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink">Pro'ya geç</h1>
          <p className="text-sm text-ink/45 mt-1">Tüm özelliklere sınırsız erişim.</p>
        </div>

        {/* Plan seçimi */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { key: 'monthly', label: 'Aylık', price: '₺99', sub: 'ay' },
            { key: 'yearly', label: 'Yıllık', price: '₺899', sub: 'yıl · 2 ay ücretsiz', badge: 'İNDİRİM' },
          ].map(p => (
            <button key={p.key} onClick={() => setPlan(p.key as any)}
              className={`card text-center transition-colors relative ${plan === p.key ? 'border-brand bg-brand/3' : 'hover:border-brand/30'}`}
            >
              {p.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-mono px-2 py-0.5 rounded-full">
                  {p.badge}
                </span>
              )}
              <p className="font-medium text-ink text-sm mb-1">{p.label}</p>
              <p className="font-serif text-2xl font-bold text-ink">{p.price}</p>
              <p className="mono text-xs text-ink/35">/{p.sub}</p>
            </button>
          ))}
        </div>

        {/* Özellikler özeti */}
        <div className="card mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-3">PRO'DA NE VAR</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Sınırsız takas', 'Öncelikli Demo Day',
              'Pro rozeti', 'Yatırımcı mesajı',
              'Gelişmiş eşleştirme', 'Haftalık rapor',
            ].map(f => (
              <div key={f} className="flex items-center gap-1.5">
                <Check size={12} className="text-green-500 flex-shrink-0" />
                <span className="text-xs text-ink/65">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleUpgrade} disabled={loading}
          className="btn-primary w-full justify-center text-base py-3 disabled:opacity-60">
          {loading ? 'İşleniyor...' : `${plan === 'monthly' ? '₺99/ay' : '₺899/yıl'} ile Pro'ya geç →`}
        </button>

        <p className="text-xs text-ink/35 text-center mt-3">
          İstediğin zaman iptal edebilirsin. SSL ile güvenli ödeme.
        </p>
      </main>
    </AppLayout>
  )
}