import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Star, ArrowLeft, MessageCircle } from 'lucide-react'

export default async function YorumlarPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: courses } = await supabase
    .from('courses').select('id, title').eq('instructor_id', user.id)

  const { data: reviews } = await supabase
    .from('course_reviews')
    .select('*, student:profiles(full_name, avatar_url), course:courses(title)')
    .in('course_id', courses?.map(c => c.id) || ['none'])
    .order('created_at', { ascending: false })

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews?.filter(r => r.rating === star).length || 0,
    pct: reviews?.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }))

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <Link href="/kurslar/egitmen" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} /> Panele dön
        </Link>

        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">EĞİTMEN PANELİ</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Değerlendirmeler.</h1>
        </div>

        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {/* Sol — özet */}
            <div className="space-y-4">
              <div className="card text-center">
                <p className="mono text-xs text-ink/35 tracking-widest mb-3">ORTALAMA PUAN</p>
                <p className="font-serif text-6xl font-bold text-amber-500">{avgRating.toFixed(1)}</p>
                <div className="flex justify-center gap-1 my-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} className={s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'} />
                  ))}
                </div>
                <p className="mono text-xs text-ink/35">{reviews.length} değerlendirme</p>
              </div>

              <div className="card">
                <p className="mono text-xs text-ink/35 tracking-widest mb-3">PUAN DAĞILIMI</p>
                <div className="space-y-2">
                  {ratingDist.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 flex-shrink-0 w-14">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={9} className={s <= star ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'} />
                        ))}
                      </div>
                      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="mono text-xs text-ink/35 w-4 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ — yorumlar */}
            <div className="col-span-2 space-y-3">
              {reviews.map((r: any, i: number) => (
                <div key={i} className="card hover:border-brand/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand flex-shrink-0 overflow-hidden">
                      {r.student?.avatar_url
                        ? <img src={r.student.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                        : r.student?.full_name?.[0] || '?'
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-ink">{r.student?.full_name || 'Anonim'}</p>
                        <span className="mono text-xs text-ink/30">
                          {new Date(r.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={12} className={s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'} />
                          ))}
                        </div>
                        <span className="mono text-xs text-brand/60">{r.course?.title}</span>
                      </div>
                      {r.review && (
                        <p className="text-sm text-ink/60 leading-relaxed">{r.review}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
            <Star size={40} className="text-ink/15 mx-auto mb-3" />
            <p className="font-serif text-xl font-bold text-ink/40 mb-2">Henüz değerlendirme yok.</p>
            <p className="text-sm text-ink/30 mb-4">Öğrenciler kurslarını tamamladıkça değerlendirmeleri burada görünecek.</p>
            <Link href="/kurslar/egitmen" className="btn-primary text-sm px-6">Kurslara git →</Link>
          </div>
        )}
      </main>
    </AppLayout>
  )
}