'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    username: '',
    university: '',
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
      options: {
        data: {
          full_name: form.full_name,
          username: form.username,
          university: form.university,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: form.full_name,
        username: form.username,
        university: form.university,
        karma_tokens: 100,
      })
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-bold text-ink">
            Campus<em className="text-brand not-italic">We</em>
          </Link>
          <p className="text-sm text-ink/45 mt-2">
            Eksikliğini tamamlamaya başla.
          </p>
        </div>

        <form onSubmit={handleRegister} className="card space-y-4">
          <div>
            <label className="label">Ad Soyad</label>
            <input
              name="full_name"
              type="text"
              className="input"
              placeholder="Ayşe Yılmaz"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Kullanıcı adı</label>
            <input
              name="username"
              type="text"
              className="input"
              placeholder="ayseyilmaz"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Üniversite</label>
            <input
              name="university"
              type="text"
              className="input"
              placeholder="ODTÜ"
              value={form.university}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">E-posta</label>
            <input
              name="email"
              type="email"
              className="input"
              placeholder="sen@universite.edu.tr"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Şifre</label>
            <input
              name="password"
              type="password"
              className="input"
              placeholder="En az 6 karakter"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {loading ? 'Hesap oluşturuluyor...' : 'Kayıt ol'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/45 mt-4">
          Zaten hesabın var mı?{' '}
          <Link href="/auth/login" className="text-brand hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  )
}
