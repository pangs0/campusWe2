import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { BookOpen, Play, Check } from 'lucide-react'

export default async function OgrencimPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('*, course:courses(*, instructor:profiles(full_name))')
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
              return (
                <div key={enrollment.id} className="card p-0 overflow-hidden hover:border-brand/30 transition-colors">
                  <div className="w-full h-36 bg-brand/8 flex items-center justify-center">
                    {course.thumbnail_url
                      ? <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                      : <BookOpen size={32} className="text-brand/30" />
                    }
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-bold text-ink mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-ink/40 mb-3">{course.instructor?.full_name}</p>
                    <Link href={`/kurslar/${course.id}/ders`}
                      className="btn-primary w-full text-center text-xs flex items-center justify-center gap-1.5">
                      <Play size={12} /> Devam et
                    </Link>
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