import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { BookOpen, Play, Check, Award } from 'lucide-react'

export default async function OgrencimPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('*, course:courses(*, instructor:profiles(full_name), sections:course_sections(lessons:course_lessons(id)))')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  const { data: completions } = await supabase
    .from('lesson_completions').select('lesson_id').eq('student_id', user.id)

  const completedIds = new Set(completions?.map(c => c.lesson_id) || [])

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">ÖĞRENCİ PANELİ</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Kurslarım.</h1>
          </div>
          <Link href="/kurslar" className="btn-secondary text-xs">Kurs keşfet →</Link>
        </div>

        {enrollments && enrollments.length > 0 ? (
          <div className="grid grid-cols-3 gap-5">
            {enrollments.map((enrollment: any) => {
              const course = enrollment.course
              const courseLessons = course.sections?.flatMap((s: any) => s.lessons || []) || []
              const totalLessons = courseLessons.length
              const completedCount = courseLessons.filter((l: any) => completedIds.has(l.id)).length
              const isCompleted = totalLessons > 0 && completedCount === totalLessons
              const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

              return (
                <div key={enrollment.id} className="card p-0 overflow-hidden hover:border-brand/30 transition-colors">
                  <div className="w-full h-36 bg-brand/8 flex items-center justify-center relative">
                    {course.thumbnail_url
                      ? <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                      : <BookOpen size={32} className="text-brand/30" />
                    }
                    {isCompleted && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Check size={10} />
                        <span className="mono text-xs">Tamamlandı</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-bold text-ink mb-0.5 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-ink/40 mb-2">{course.instructor?.full_name}</p>

                    {/* İlerleme çubuğu */}
                    {totalLessons > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-ink/35 mb-1">
                          <span>{completedCount}/{totalLessons} ders</span>
                          <span>%{progress}</span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full transition-all"
                            style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/kurslar/${course.id}/ders`}
                        className="btn-primary flex-1 text-center text-xs flex items-center justify-center gap-1.5">
                        <Play size={12} /> Devam et
                      </Link>
                      <Link href={`/kurslar/${course.id}/sertifika`}
                        className={`text-xs px-3 py-2 rounded-lg border flex items-center gap-1 transition-colors ${
                          isCompleted
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-neutral-50 text-ink/30 border-neutral-200 cursor-not-allowed pointer-events-none'
                        }`}>
                        <Award size={12} />
                        {isCompleted ? 'Sertifika' : '🔒'}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
            <BookOpen size={36} className="text-brand/25 mx-auto mb-3" />
            <p className="font-serif text-xl font-bold text-ink mb-1">Henüz kayıtlı kurs yok.</p>
            <p className="text-sm text-ink/45 mb-5">Topluluğun kurslarını keşfet ve öğrenmeye başla.</p>
            <Link href="/kurslar" className="btn-primary inline-flex text-sm">Kursları keşfet →</Link>
          </div>
        )}
      </main>
    </AppLayout>
  )
}