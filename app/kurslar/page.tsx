import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { BookOpen, Plus, Star, Users, Search, TrendingUp, Award, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const CATEGORIES = [
  { key: 'tumu', label: 'Tümü', emoji: '🎯' },
  { key: 'girisimcilik', label: 'Girişimcilik', emoji: '🚀' },
  { key: 'teknoloji', label: 'Teknoloji', emoji: '💻' },
  { key: 'pazarlama', label: 'Pazarlama', emoji: '📈' },
  { key: 'finans', label: 'Finans', emoji: '💰' },
  { key: 'tasarim', label: 'Tasarım', emoji: '🎨' },
  { key: 'yapay_zeka', label: 'Yapay Zeka', emoji: '🤖' },
  { key: 'kisisel_gelisim', label: 'Kişisel Gelişim', emoji: '🌱' },
  { key: 'diger', label: 'Diğer', emoji: '✨' },
]

const LEVELS = ['tumu', 'başlangıç', 'orta', 'ileri']
const PRICE_FILTERS = [
  { key: 'tumu', label: 'Tümü' },
  { key: 'ucretsiz', label: 'Ücretsiz' },
  { key: 'ucretli', label: 'Ücretli' },
]

export default async function KurslarPage({
  searchParams
}: {
  searchParams: { category?: string; q?: string; level?: string; price?: string; sort?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
    : { data: null }

  let query = supabase
    .from('courses')
    .select('*, instructor:profiles(id, full_name, avatar_url, username), course_enrollments(id), course_reviews(rating)')
    .eq('is_published', true)

  if (searchParams.category && searchParams.category !== 'tumu') {
    query = query.eq('category', searchParams.category)
  }
  if (searchParams.level && searchParams.level !== 'tumu') {
    query = query.eq('level', searchParams.level)
  }
  if (searchParams.price === 'ucretsiz') {
    query = query.eq('is_free', true)
  } else if (searchParams.price === 'ucretli') {
    query = query.eq('is_free', false)
  }

  const { data: allCourses } = await query

  // Arama filtresi
  let filteredCourses = searchParams.q
    ? allCourses?.filter(c =>
        c.title?.toLowerCase().includes(searchParams.q!.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchParams.q!.toLowerCase()) ||
        c.instructor?.full_name?.toLowerCase().includes(searchParams.q!.toLowerCase())
      )
    : allCourses

  // Sıralama
  const sort = searchParams.sort || 'yeni'
  filteredCourses = [...(filteredCourses || [])].sort((a, b) => {
    if (sort === 'populer') return (b.course_enrollments?.length || 0) - (a.course_enrollments?.length || 0)
    if (sort === 'puan') {
      const aRating = a.course_reviews?.length ? a.course_reviews.reduce((s: number, r: any) => s + r.rating, 0) / a.course_reviews.length : 0
      const bRating = b.course_reviews?.length ? b.course_reviews.reduce((s: number, r: any) => s + r.rating, 0) / b.course_reviews.length : 0
      return bRating - aRating
    }
    if (sort === 'fiyat_artan') return (a.price || 0) - (b.price || 0)
    if (sort === 'fiyat_azalan') return (b.price || 0) - (a.price || 0)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  // Kayıtlı kurslar — sadece login olmuşsa
  let enrolledIds = new Set<string>()
  if (user) {
    const { data: myEnrollments } = await supabase
      .from('course_enrollments').select('course_id').eq('student_id', user.id)
    enrolledIds = new Set(myEnrollments?.map(e => e.course_id) || [])
  }

  // Öne çıkan kurslar (en çok kayıt)
  const featuredCourses = [...(allCourses || [])].sort((a, b) =>
    (b.course_enrollments?.length || 0) - (a.course_enrollments?.length || 0)
  ).slice(0, 3)

  function avgRating(reviews: any[]) {
    if (!reviews?.length) return null
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  }

  const levelColors: Record<string, string> = {
    başlangıç: 'bg-green-50 text-green-700 border-green-200',
    orta: 'bg-amber-50 text-amber-700 border-amber-200',
    ileri: 'bg-red-50 text-red-600 border-red-200',
  }

  const buildUrl = (params: Record<string, string>) => {
    const base = { category: searchParams.category || 'tumu', q: searchParams.q || '', level: searchParams.level || 'tumu', price: searchParams.price || 'tumu', sort: searchParams.sort || 'yeni', ...params }
    const qs = Object.entries(base).filter(([, v]) => v && v !== 'tumu' && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    return `/kurslar${qs ? '?' + qs : ''}`
  }

  const content = (
    <main className="px-8 py-10">
      {/* Başlık */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">EĞİTİM PLATFORMU</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Kurslar.</h1>
          <p className="text-sm text-ink/45 mt-1">{allCourses?.length || 0} kurs · Topluluğun oluşturduğu içerikler</p>
        </div>
        <div className="flex gap-2">
          {user && (
            <>
              <Link href="/kurslar/ogrencim" className="btn-secondary text-xs flex items-center gap-1.5">
                <BookOpen size={13} /> Kurslarım
              </Link>
              <Link href="/kurslar/egitmen/yeni" className="btn-primary text-xs flex items-center gap-1.5">
                <Plus size={13} /> Kurs oluştur
              </Link>
            </>
          )}
          {!user && (
            <Link href="/egitmen" className="btn-primary text-xs flex items-center gap-1.5">
              <Zap size={13} /> Eğitmen ol
            </Link>
          )}
        </div>
      </div>

      {/* Öne çıkan kurslar — sadece ana sayfada, filtre yokken */}
      {!searchParams.q && !searchParams.category && featuredCourses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-brand" />
            <p className="mono text-xs text-ink/35 tracking-widest">EN POPÜLER KURSLAR</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {featuredCourses.map((course: any, i: number) => (
              <Link key={course.id} href={`/kurslar/${course.id}`}
                className="card p-0 overflow-hidden hover:border-brand/30 transition-colors group block relative">
                <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center font-serif font-bold text-sm">
                  {i + 1}
                </div>
                <div className="w-full h-32 bg-gradient-to-br from-brand/10 to-brand/5 overflow-hidden">
                  {course.thumbnail_url
                    ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><BookOpen size={32} className="text-brand/20" /></div>
                  }
                </div>
                <div className="p-3">
                  <p className="font-serif font-bold text-ink text-sm line-clamp-1 group-hover:text-brand transition-colors">{course.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="mono text-xs text-ink/35">{course.course_enrollments?.length || 0} öğrenci</span>
                    <span className="font-serif font-bold text-brand text-sm">{course.is_free ? 'Ücretsiz' : `₺${course.price}`}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Arama + Filtreler */}
      <div className="space-y-3 mb-6">
        <form method="GET" action="/kurslar" className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
          <input type="text" name="q" defaultValue={searchParams.q || ''}
            placeholder="Kurs, eğitmen veya konu ara..."
            className="input pl-10 py-2.5 text-sm w-full" />
        </form>

        {/* Kategori */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <Link key={cat.key} href={buildUrl({ category: cat.key })}
              className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                (searchParams.category || 'tumu') === cat.key
                  ? 'bg-ink text-cream border-ink'
                  : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/40'
              }`}>
              {cat.emoji} {cat.label}
            </Link>
          ))}
        </div>

        {/* Seviye + Fiyat + Sıralama */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="mono text-xs text-ink/30">Seviye:</span>
            {LEVELS.map(l => (
              <Link key={l} href={buildUrl({ level: l })}
                className={`mono text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  (searchParams.level || 'tumu') === l
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'
                }`}>
                {l === 'tumu' ? 'Tümü' : l}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="mono text-xs text-ink/30">Fiyat:</span>
            {PRICE_FILTERS.map(p => (
              <Link key={p.key} href={buildUrl({ price: p.key })}
                className={`mono text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  (searchParams.price || 'tumu') === p.key
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'
                }`}>
                {p.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="mono text-xs text-ink/30">Sırala:</span>
            {[
              { key: 'yeni', label: 'En Yeni' },
              { key: 'populer', label: 'En Popüler' },
              { key: 'puan', label: 'En Yüksek Puan' },
              { key: 'fiyat_artan', label: 'Fiyat ↑' },
              { key: 'fiyat_azalan', label: 'Fiyat ↓' },
            ].map(s => (
              <Link key={s.key} href={buildUrl({ sort: s.key })}
                className={`mono text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  (searchParams.sort || 'yeni') === s.key
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'
                }`}>
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sonuç sayısı */}
      {searchParams.q && (
        <p className="text-sm text-ink/45 mb-4">
          <strong>"{searchParams.q}"</strong> için {filteredCourses?.length || 0} sonuç
        </p>
      )}

      {/* Kurs grid */}
      {filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-3 gap-5">
          {filteredCourses.map((course: any) => {
            const rating = avgRating(course.course_reviews)
            const enrolled = enrolledIds.has(course.id)
            const studentCount = course.course_enrollments?.length || 0
            return (
              <Link key={course.id} href={`/kurslar/${course.id}`}
                className="card p-0 overflow-hidden hover:border-brand/30 transition-all hover:-translate-y-0.5 group block">
                <div className="w-full h-40 bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center relative overflow-hidden">
                  {course.thumbnail_url
                    ? <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    : <BookOpen size={40} className="text-brand/30" />
                  }
                  {course.is_free && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white mono text-xs px-2 py-0.5 rounded font-bold">
                      ÜCRETSİZ
                    </span>
                  )}
                  {enrolled && (
                    <span className="absolute top-3 right-3 bg-brand text-white mono text-xs px-2 py-0.5 rounded">
                      KAYITLI
                    </span>
                  )}
                  {!enrolled && studentCount > 10 && (
                    <span className="absolute bottom-3 left-3 bg-black/60 text-white mono text-xs px-2 py-0.5 rounded backdrop-blur-sm">
                      🔥 Popüler
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`mono text-xs border rounded px-1.5 py-0.5 ${levelColors[course.level] || 'bg-neutral-50 text-neutral-500 border-neutral-200'}`}>
                      {course.level}
                    </span>
                    {course.category && <span className="mono text-xs text-ink/30">{course.category}</span>}
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
                        <span className="flex items-center gap-1 text-amber-500 font-medium">
                          <Star size={11} className="fill-amber-500" /> {rating}
                        </span>
                      )}
                      <span className="flex items-center gap-1"><Users size={11} /> {studentCount}</span>
                    </div>
                    <span className="font-serif font-bold text-ink">
                      {course.is_free ? <span className="text-green-600">Ücretsiz</span> : `₺${course.price}`}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="py-20 text-center" style={{ background: '#F5F0E8', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
          <BookOpen size={40} className="text-brand/25 mx-auto mb-4" />
          <p className="font-serif text-2xl font-bold text-ink mb-2">Kurs bulunamadı.</p>
          <p className="text-sm text-ink/45 mb-6">Farklı filtreler deneyin.</p>
          <Link href="/kurslar" className="btn-secondary text-sm">Filtreleri temizle</Link>
        </div>
      )}

      {/* Login olmayan kullanıcıya CTA */}
      {!user && (
        <div className="mt-12 card text-center py-10" style={{ background: 'linear-gradient(135deg, rgba(196,80,10,.04), rgba(196,80,10,.08))' }}>
          <Award size={36} className="text-brand mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-ink mb-2">Kurslara kayıt olmak için hesap oluştur</h2>
          <p className="text-sm text-ink/50 mb-6 max-w-sm mx-auto">Ücretsiz hesap aç, istediğin kurslara kayıt ol, sertifika kazan.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/register/ogrenci" className="btn-primary w-full justify-center py-3 block text-center">
                  Ücretsiz kayıt ol ve başla →
                </Link>
                <Link href="/auth/login" className="btn-secondary w-full justify-center py-2.5 block text-center text-sm">
                  Zaten hesabın var mı? Giriş yap
                </Link>
          </div>
        </div>
      )}
    </main>
  )

  if (user) {
    if (profile?.role === 'student') {
      const OgrenciLayout = (await import('@/app/ogrenci/OgrenciLayout')).default
      return <OgrenciLayout user={user} profile={profile}>{content}</OgrenciLayout>
    }
    return <AppLayout user={user} profile={profile}>{content}</AppLayout>
  }

  // Login olmayan kullanıcılar için minimal layout
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F5F0E8', minHeight: '100vh', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,.04) 79px,rgba(26,26,24,.04) 80px)' }}>
      <nav style={{ background: 'rgba(245,240,232,.95)', borderBottom: '1px solid rgba(26,26,24,.1)', padding: '1.2rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <Link href="/" style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <Link href="/kurslar" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none', fontWeight: 500 }}>Kurslar</Link>
          <Link href="/fiyatlandirma" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Fiyatlandırma</Link>
          <Link href="/kurumsal" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Kurumsal</Link>
          <Link href="/egitmen" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none', border: '1px solid rgba(196,80,10,.3)', borderRadius: 6, padding: '6px 14px' }}>Eğitmen Ol</Link>
          <Link href="/auth/login" style={{ fontSize: 13, color: 'rgba(26,26,24,.6)', textDecoration: 'none' }}>Giriş yap</Link>
          <Link href="/auth/register" style={{ background: '#C4500A', color: '#F5F0E8', padding: '8px 20px', borderRadius: 6, fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>Kayıt ol →</Link>
        </div>
      </nav>
      {content}
    </div>
  )
}