import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { BookOpen, Plus, Star, Users, Clock, Play } from 'lucide-react'

const CATEGORIES = [
  { key: 'tumu', label: 'Tümü' },
  { key: 'girisimcilik', label: 'Girişimcilik' },
  { key: 'teknoloji', label: 'Teknoloji' },
  { key: 'pazarlama', label: 'Pazarlama' },
  { key: 'finans', label: 'Finans' },
  { key: 'tasarim', label: 'Tasarım' },
  { key: 'kisisel_gelisim', label: 'Kişisel Gelişim' },
  { key: 'diger', label: 'Diğer' },
]

export default async function KurslarPage({ searchParams }: { searchParams: { category?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  let query = supabase
    .from('courses')
    .select('*, instructor:profiles(full_name, avatar_url), course_enrollments(id), course_reviews(rating)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (searchParams.category && searchParams.category !== 'tumu') {
    query = query.eq('category', searchParams.category)
  }

  const { data: courses } = await query

  const { data: myEnrollments } = await supabase
    .from('course_enrollments').select('course_id').eq('student_id', user.id)

  const enrolledIds = new Set(myEnrollments?.map(e => e.course_id) || [])

  function avgRating(reviews: any[]) {
    if (!reviews?.length) return null
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    return avg.toFixed(1)
  }

  const levelColors: Record<string, string> = {
    başlangıç: 'bg-green-50 text-green-700 border-green-200',
    orta: 'bg-amber-50 text-amber-700 border-amber-200',
    ileri: 'bg-red-50 text-red-600 border-red-200',
  }

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">EĞİTİM</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Kurslar.</h1>
            <p className="text-sm text-ink/45 mt-1">Topluluğun oluşturduğu kurslarla öğren ve büyü.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/kurslar/ogrencim" className="btn-secondary text-xs flex items-center gap-1.5">
              <BookOpen size={13} /> Kurslarım
            </Link>
            <Link href="/kurslar/egitmen" className="btn-primary text-xs flex items-center gap-1.5">
              <Plus size={13} /> Kurs oluştur
            </Link>
          </div>
        </div>

        {/* Kategori filtreleri */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <Link key={cat.key} href={`/kurslar?category=${cat.key}`}
              className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                (searchParams.category || 'tumu') === cat.key
                  ? 'bg-ink text-cream border-ink'
                  : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/40'
              }`}>
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Kurs grid */}
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-3 gap-5">
            {courses.map((course: any) => {
              const rating = avgRating(course.course_reviews)
              const enrolled = enrolledIds.has(course.id)
              const studentCount = course.course_enrollments?.length || 0

              return (
                <Link key={course.id} href={`/kurslar/${course.id}`}
                  className="card p-0 overflow-hidden hover:border-brand/30 transition-colors group block">
                  {/* Thumbnail */}
                  <div className="w-full h-40 bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={40} className="text-brand/30" />
                    )}
                    {course.is_free && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white mono text-xs px-2 py-0.5 rounded">
                        ÜCRETSİZ
                      </span>
                    )}
                    {enrolled && (
                      <span className="absolute top-3 right-3 bg-brand text-white mono text-xs px-2 py-0.5 rounded">
                        KAYITLI
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`mono text-xs border rounded px-1.5 py-0.5 ${levelColors[course.level] || ''}`}>
                        {course.level}
                      </span>
                      {course.category && (
                        <span className="mono text-xs text-ink/30">{course.category}</span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-ink mb-1 group-hover:text-brand transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-xs flex-shrink-0">
                        {course.instructor?.avatar_url
                          ? <img src={course.instructor.avatar_url} alt="" className="w-full h-full object-cover" />
                          : course.instructor?.full_name?.[0]
                        }
                      </div>
                      <span className="text-xs text-ink/45 truncate">{course.instructor?.full_name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-ink/35">
                        {rating && (
                          <span className="flex items-center gap-1 text-amber-500">
                            <Star size={11} className="fill-amber-500" />
                            {rating}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {studentCount}
                        </span>
                      </div>
                      <span className="font-serif font-bold text-ink">
                        {course.is_free ? 'Ücretsiz' : `₺${course.price}`}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="py-20 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
            <BookOpen size={40} className="text-brand/25 mx-auto mb-4" />
            <p className="font-serif text-2xl font-bold text-ink mb-2">Henüz kurs yok.</p>
            <p className="text-sm text-ink/45 mb-6">İlk kursu oluşturan sen ol. Topluluğa değer kat, kazanç elde et.</p>
            <Link href="/kurslar/egitmen" className="btn-primary inline-flex items-center gap-1.5 text-sm">
              <Plus size={14} /> Kurs oluştur
            </Link>
          </div>
        )}
      </main>
    </AppLayout>
  )
}