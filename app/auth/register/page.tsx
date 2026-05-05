'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Rocket, TrendingUp, Building2, Check } from 'lucide-react'

const ROLES = [
  {
    key: 'founder',
    label: 'Girişimci',
    desc: 'Startup kuruyorum veya kurmak istiyorum',
    icon: Rocket,
    color: 'border-brand bg-brand/5 text-brand',
    activeColor: 'border-brand bg-brand/10',
  },
  {
    key: 'investor',
    label: 'Yatırımcı',
    desc: 'Startup\'lara yatırım yapıyorum',
    icon: TrendingUp,
    color: 'border-amber-500 bg-amber-50 text-amber-700',
    activeColor: 'border-amber-500 bg-amber-50',
  },
  {
    key: 'company',
    label: 'Şirket',
    desc: 'Yetenekleri keşfediyorum, etkinlik düzenliyorum',
    icon: Building2,
    color: 'border-blue-500 bg-blue-50 text-blue-700',
    activeColor: 'border-blue-500 bg-blue-50',
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [role, setRole] = useState<'founder' | 'investor' | 'company'>('founder')
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    username: '',
    university: '',
    city: '',
    company_name: '',
    firm_name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, username: form.username } },
    })

    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: form.full_name,
        username: form.username,
        university: role === 'founder' ? form.university : null,
        city: form.city,
        role,
        karma_tokens: 100,
      })

      if (role === 'investor') {
        await supabase.from('investor_profiles').insert({
          id: data.user.id,
          firm_name: form.firm_name,
        })
      }

      if (role === 'company') {
        await supabase.from('company_profiles').insert({
          id: data.user.id,
          company_name: form.company_name || form.full_name,
        })
      }
    }

    if (role === 'investor') router.push('/yatirimci')
    else if (role === 'company') router.push('/sirket')
    else router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-bold text-ink">
            Campus<em className="text-brand not-italic">We</em>
          </Link>
          <p className="text-sm text-ink/45 mt-2">Topluluğa katıl.</p>
        </div>

        {/* Rol seçimi */}
        <div className="mb-6">
          <p className="text-sm font-medium text-ink mb-3 text-center">Sen kimsin?</p>
          <div className="grid grid-cols-3 gap-3">
            {ROLES.map(r => (
              <button key={r.key} type="button" onClick={() => setRole(r.key as any)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === r.key ? `border-2 ${r.activeColor}` : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}>
                {role === r.key && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
                <r.icon size={20} className={role === r.key ? 'text-brand' : 'text-ink/40'} />
                <div className="text-center">
                  <p className="text-xs font-semibold text-ink">{r.label}</p>
                  <p className="text-xs text-ink/40 leading-tight mt-0.5">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleRegister} className="card space-y-4">
          <div>
            <label className="label">Ad Soyad</label>
            <input name="full_name" type="text" className="input" placeholder="Adınız Soyadınız"
              value={form.full_name} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Kullanıcı adı</label>
            <input name="username" type="text" className="input" placeholder="kullaniciadi"
              value={form.username} onChange={handleChange} required />
          </div>

          {role === 'founder' && (
            <>
              <div>
                <label className="label">Üniversite</label>
                <input name="university" type="text" className="input" placeholder="ODTÜ, İTÜ, Bilkent..."
                  value={form.university} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Şehir</label>
                <input name="city" type="text" className="input" placeholder="İstanbul, Ankara..."
                  value={form.city} onChange={handleChange} />
              </div>
            </>
          )}

          {role === 'investor' && (
            <>
              <div>
                <label className="label">Firma adı</label>
                <input name="firm_name" type="text" className="input" placeholder="XYZ Ventures, Angel..."
                  value={form.firm_name} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Şehir</label>
                <input name="city" type="text" className="input" placeholder="İstanbul, Ankara..."
                  value={form.city} onChange={handleChange} />
              </div>
            </>
          )}

          {role === 'company' && (
            <>
              <div>
                <label className="label">Şirket adı</label>
                <input name="company_name" type="text" className="input" placeholder="Trendyol, Getir..."
                  value={form.company_name} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Şehir</label>
                <input name="city" type="text" className="input" placeholder="İstanbul, Ankara..."
                  value={form.city} onChange={handleChange} />
              </div>
            </>
          )}

          <div>
            <label className="label">E-posta</label>
            <input name="email" type="email" className="input" placeholder="ornek@email.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Şifre</label>
            <input name="password" type="password" className="input" placeholder="En az 6 karakter"
              value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? 'Hesap oluşturuluyor...' : `${ROLES.find(r => r.key === role)?.label} olarak kayıt ol →`}
          </button>
        </form>

        <p className="text-center text-sm text-ink/45 mt-4">
          Zaten hesabın var mı?{' '}
          <Link href="/auth/login" className="text-brand hover:underline">Giriş yap</Link>
        </p>
      </div>
    </div>
  )
}