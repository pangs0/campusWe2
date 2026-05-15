import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { DollarSign, ArrowLeft, TrendingUp, BookOpen, Users, ArrowUp, ArrowDown } from 'lucide-react'

export default async function GelirPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, price, is_free, is_published, course_enrollments(id, created_at)')
    .eq('instructor_id', user.id)

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const totalEarnings = courses?.reduce((sum, c) => sum + ((c.price || 0) * (c.course_enrollments?.length || 0) * 0.75), 0) || 0
  const thisMonthEarnings = courses?.reduce((sum, c) => {
    const count = c.course_enrollments?.filter((e: any) => new Date(e.created_at) >= thisMonthStart).length || 0
    return sum + ((c.price || 0) * count * 0.75)
  }, 0) || 0
  const lastMonthEarnings = courses?.reduce((sum, c) => {
    const count = c.course_enrollments?.filter((e: any) => {
      const d = new Date(e.created_at)
      return d >= lastMonthStart && d <= lastMonthEnd
    }).length || 0
    return sum + ((c.price || 0) * count * 0.75)
  }, 0) || 0

  const growthRate = lastMonthEarnings > 0
    ? Math.round(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100)
    : thisMonthEarnings > 0 ? 100 : 0

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const start = new Date(d.getFullYear(), d.getMonth(), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
    const earnings = courses?.reduce((sum, c) => {
      const count = c.course_enrollments?.filter((e: any) => {
        const date = new Date(e.created_at)
        return date >= start && date <= end
      }).length || 0
      return sum + ((c.price || 0) * count * 0.75)
    }, 0) || 0
    return {
      month: d.toLocaleDateString('tr-TR', { month: 'short' }),
      earnings: Math.round(earnings),
    }
  })

  const maxEarning = Math.max(...monthlyData.map(m => m.earnings), 1)

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <Link href="/kurslar/egitmen" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} /> Panele dön
        </Link>

        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">EĞİTMEN PANELİ</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Gelir Takibi.</h1>
        </div>

        {/* Özet kartlar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card bg-green-50 border-green-100">
            <p className="mono text-xs text-green-600/60 mb-1">TOPLAM KAZANÇ</p>
            <p className="font-serif text-3xl font-bold text-green-700">₺{Math.round(totalEarnings).toLocaleString('tr-TR')}</p>
            <p className="mono text-xs text-green-600/50 mt-1">Tüm zamanlar</p>
          </div>
          <div className="card bg-brand/5 border-brand/15">
            <p className="mono text-xs text-brand/60 mb-1">BU AY</p>
            <p className="font-serif text-3xl font-bold text-brand">₺{Math.round(thisMonthEarnings).toLocaleString('tr-TR')}</p>
            <div className="flex items-center gap-1 mt-1">
              {growthRate >= 0
                ? <ArrowUp size={12} className="text-green-500" />
                : <ArrowDown size={12} className="text-red-500" />
              }
              <p className={`mono text-xs ${growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                %{Math.abs(growthRate)} geçen aya göre
              </p>
            </div>
          </div>
          <div className="card bg-purple-50 border-purple-100">
            <p className="mono text-xs text-purple-600/60 mb-1">GEÇEN AY</p>
            <p className="font-serif text-3xl font-bold text-purple-700">₺{Math.round(lastMonthEarnings).toLocaleString('tr-TR')}</p>
            <p className="mono text-xs text-purple-600/50 mt-1">{new Date(lastMonthStart).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Gelir grafiği */}
        <div className="card mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-4">AYLIK GELİR TRENDİ</p>
          <div className="flex items-end gap-3 h-40 mb-2">
            {monthlyData.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <p className="mono text-xs text-ink/30" style={{ fontSize: 10 }}>
                  ₺{m.earnings > 999 ? (m.earnings / 1000).toFixed(1) + 'k' : m.earnings}
                </p>
                <div className="w-full rounded-t-lg transition-all relative group"
                  style={{ height: `${Math.max((m.earnings / maxEarning) * 100, 3)}%`, background: i === monthlyData.length - 1 ? '#C4500A' : 'rgba(196,80,10,.2)' }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-white rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ₺{m.earnings}
                  </div>
                </div>
                <p className="mono text-ink/40" style={{ fontSize: 10 }}>{m.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kurs bazlı gelir */}
        <div className="card mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-4">KURS BAZLI GELİR</p>
          {courses && courses.length > 0 ? (
            <div className="space-y-3">
              {courses.map((c: any) => {
                const students = c.course_enrollments?.length || 0
                const earnings = Math.round((c.price || 0) * students * 0.75)
                const percentage = totalEarnings > 0 ? Math.round((earnings / totalEarnings) * 100) : 0
                return (
                  <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-ink truncate">{c.title}</p>
                        <p className="font-serif font-bold text-green-600 flex-shrink-0 ml-2">₺{earnings.toLocaleString('tr-TR')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="mono text-xs text-ink/30 flex-shrink-0">{students} öğrenci · {c.is_free ? 'Ücretsiz' : `₺${c.price}`}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-ink/35 text-center py-6">Henüz kurs yok.</p>
          )}
        </div>

        {/* Ödeme yakında */}
        <div className="card border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <DollarSign size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">Ödeme sistemi yakında aktif!</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                İyzico entegrasyonu tamamlandığında kazancını doğrudan hesabına çekebileceksin. Her satışın %75'i otomatik hesaplanacak.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}