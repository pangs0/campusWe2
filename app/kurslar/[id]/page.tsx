import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Star, Users, Clock, Play, BookOpen, Check, ArrowLeft, Award, Lock } from 'lucide-react'
import CourseEnrollClient from '@/app/kurslar/[id]/CourseEnrollClient'

export default async function KursDetayPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
    : { data: null }

  const { data: course } = await supabase
    .from('courses')
    .select('*, instructor:profiles(id, full_name, avatar_url, bio, karma_tokens)')
    .eq('id', params.id)
    .single()

  if (!course) notFound()

  const { data: sections } = await supabase
    .from('course_sections')
    .select('*, lessons:course_lessons(*)')
    .eq('course_id', params.id)
    .order('order_index')

  const { data: reviews } = await supabase
    .from('course_reviews')
    .select('*, student:profiles(full_name, avatar_url)')
    .eq('course_id', params.id)
    .order('created_at', { ascending: false })

  const { data: enrollment } = user
    ? await supabase.from('course_enrollments').select('id').eq('course_id', params.id).eq('student_id', user.id).single()
    : { data: null }

  const { data: completions } = user
    ? await supabase.from('lesson_completions').select('lesson_id').eq('student_id', user.id)
    : { data: [] }

  const isEnrolled = !!enrollment
  const isInstructor = !!(user && course.instructor_id === user.id)
  const completedIds = new Set(completions?.map((c: any) => c.lesson_id) || [])
  const totalLessons = sections?.reduce((sum, s) => sum + (s.lessons?.length || 0), 0) || 0
  const avgRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null
  const enrollmentCount = await supabase
    .from('course_enrollments').select('id', { count: 'exact', head: true }).eq('course_id', params.id)
  const totalDuration = sections?.reduce((sum, s) =>
    sum + (s.lessons?.reduce((ls: number, l: any) => ls + (l.duration_minutes || 0), 0) || 0), 0) || 0

  const content = (
    <main className="px-8 py-10">
      <Link href="/kurslar" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> Kurslara dön
      </Link>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="mono text-xs bg-brand/10 text-brand border border-brand/20 rounded px-2 py-0.5">{course.level}</span>
              <span className="mono text-xs text-ink/35">{course.category}</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-ink mb-3">{course.title}</h1>
            <p className="text-sm text-ink/60 leading-relaxed mb-4">{course.description}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
                  {course.instructor?.avatar_url
                    ? <img src={course.instructor.avatar_url} alt="" className="w-full h-full object-cover" />
                    : course.instructor?.full_name?.[0]}
                </div>
                <Link href={`/egitmen/${course.instructor?.id}`} className="text-sm text-ink/60 hover:text-brand transition-colors">
                  {course.instructor?.full_name}
                </Link>
              </div>
              {avgRating && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} className="fill-amber-500" />
                  <span className="text-sm font-medium">{avgRating}</span>
                  <span className="text-xs text-ink/35">({reviews?.length} yorum)</span>
                </div>
              )}
              <span className="flex items-center gap-1 text-xs text-ink/40"><Users size={13} /> {enrollmentCount.count || 0} öğrenci</span>
              <span className="flex items-center gap-1 text-xs text-ink/40"><Play size={13} /> {totalLessons} ders</span>
              {totalDuration > 0 && <span className="flex items-center gap-1 text-xs text-ink/40"><Clock size={13} /> {Math.round(totalDuration / 60)} saat</span>}
            </div>
          </div>

          {course.what_you_learn && (
            <div className="card mb-6">
              <h2 className="font-serif text-lg font-bold text-ink mb-3">Ne öğreneceksin?</h2>
              <div className="grid grid-cols-2 gap-2">
                {course.what_you_learn.split('\n').filter(Boolean).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-ink/70">{item.replace(/^[•\-]\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="font-serif text-xl font-bold text-ink mb-4">Müfredat</h2>
            {sections && sections.length > 0 ? (
              <div className="space-y-3">
                {sections.map((section: any) => (
                  <div key={section.id} className="card p-0 overflow-hidden">
                    <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                      <p className="font-medium text-ink text-sm">{section.title}</p>
                      <p className="mono text-xs text-ink/35">{section.lessons?.length || 0} ders</p>
                    </div>
                    <div>
                      {section.lessons?.map((lesson: any, i: number) => {
                        const completed = completedIds.has(lesson.id)
                        const canView = isEnrolled || isInstructor || lesson.is_preview
                        return (
                          <div key={lesson.id} className={`flex items-center gap-3 px-4 py-3 border-b border-neutral-50 last:border-0 ${canView ? 'hover:bg-neutral-50' : 'opacity-60'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${completed ? 'bg-green-500' : 'bg-neutral-200'}`}>
                              {completed
                                ? <Check size={11} className="text-white" />
                                : <span className="mono text-xs text-ink/40">{i + 1}</span>}
                            </div>
                            <span className="text-sm text-ink/70 flex-1">{lesson.title}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {lesson.duration_minutes > 0 && <span className="mono text-xs text-ink/30">{lesson.duration_minutes} dk</span>}
                              {lesson.is_preview && !isEnrolled && <span className="mono text-xs text-brand bg-brand/8 px-1.5 py-0.5 rounded">Ücretsiz önizleme</span>}
                              {canView && lesson.video_url
                                ? <Link href={`/kurslar/${course.id}/ders/${lesson.id}`}><Play size={13} className="text-brand" /></Link>
                                : !canView && <Lock size={12} className="text-ink/20" />}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
                <p className="text-sm text-ink/35">Henüz ders eklenmemiş.</p>
              </div>
            )}
          </div>

          {course.instructor && (
            <div className="card mb-8">
              <h2 className="font-serif text-lg font-bold text-ink mb-3">Eğitmen hakkında</h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-xl flex-shrink-0">
                  {course.instructor.avatar_url
                    ? <img src={course.instructor.avatar_url} alt="" className="w-full h-full object-cover" />
                    : course.instructor.full_name?.[0]}
                </div>
                <div>
                  <Link href={`/egitmen/${course.instructor.id}`} className="font-medium text-ink hover:text-brand transition-colors">
                    {course.instructor.full_name}
                  </Link>
                  {course.instructor.bio && <p className="text-sm text-ink/55 mt-1 leading-relaxed">{course.instructor.bio}</p>}
                </div>
              </div>
            </div>
          )}

          {reviews && reviews.length > 0 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-ink mb-4">Yorumlar ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review.id} className="card">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
                        {review.student?.avatar_url
                          ? <img src={review.student.avatar_url} alt="" className="w-full h-full object-cover" />
                          : review.student?.full_name?.[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-ink text-sm">{review.student?.full_name}</p>
                          <div className="flex">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={11} className={s <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-200'} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-ink/60 leading-relaxed">{review.comment}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card sticky top-6">
            {course.thumbnail_url && (
              <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="text-center mb-4">
              <p className="font-serif text-3xl font-bold text-ink">
                {course.is_free ? <span className="text-green-600">Ücretsiz</span> : `₺${course.price}`}
              </p>
            </div>

            {user ? (
              <CourseEnrollClient
                courseId={course.id}
                userId={user.id}
                instructorId={course.instructor_id}
                courseTitle={course.title}
                studentName={profile?.full_name || 'Bir öğrenci'}
                isEnrolled={isEnrolled}
                isInstructor={isInstructor}
                isFree={course.is_free}
                price={course.price}
              />
            ) : (
              <div className="space-y-2">
                <Link href={`/auth/register/ogrenci?redirect=/kurslar/${course.id}`} className="btn-primary w-full justify-center py-3 block text-center">
                  Kayıt ol ve başla →
                </Link>
                <Link href="/auth/login" className="btn-secondary w-full justify-center py-2.5 block text-center text-sm">
                  Giriş yap
                </Link>
                <p className="mono text-xs text-ink/30 text-center mt-1">30 gün iade garantisi</p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              {[
                { icon: Play, label: `${totalLessons} ders` },
                { icon: Clock, label: 'Ömür boyu erişim' },
                { icon: BookOpen, label: 'Türkçe içerik' },
                { icon: Award, label: 'Tamamlama sertifikası' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-ink/50">
                  <item.icon size={13} className="text-ink/30" />
                  {item.label}
                </div>
              ))}
            </div>

            {isInstructor && (
              <Link href={`/kurslar/egitmen/${course.id}/duzenle`} className="btn-secondary w-full text-center text-xs mt-4 block">
                Kursu düzenle
              </Link>
            )}
            {isEnrolled && totalLessons > 0 && (
              <Link href={`/kurslar/${course.id}/sertifika`}
                className={`w-full text-center text-xs mt-3 py-2.5 rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                  completedIds.size === totalLessons
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-neutral-50 text-ink/35 border-neutral-200 cursor-not-allowed'
                }`}>
                <Award size={12} />
                {completedIds.size === totalLessons ? 'Sertifikayı görüntüle' : `${completedIds.size}/${totalLessons} ders tamamlandı`}
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  )

  if (user) return <AppLayout user={user} profile={profile}>{content}</AppLayout>

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F5F0E8', minHeight: '100vh' }}>
      <nav style={{ background: 'rgba(245,240,232,.95)', borderBottom: '1px solid rgba(26,26,24,.08)', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <Link href="/" style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 800, color: '#1a1a18', textDecoration: 'none' }}>
          Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/kurslar" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none', fontWeight: 500 }}>Kurslar</Link>
          <Link href="/auth/login" style={{ fontSize: 13, color: 'rgba(26,26,24,.5)', textDecoration: 'none' }}>Giriş yap</Link>
          <Link href="/auth/register" style={{ background: '#C4500A', color: 'white', padding: '8px 20px', borderRadius: 6, fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>Kayıt ol →</Link>
        </div>
      </nav>
      {content}
    </div>
  )
}