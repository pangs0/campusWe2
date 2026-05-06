import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Play } from 'lucide-react'
import LessonClient from '@/app/kurslar/[id]/ders/[lessonId]/LessonClient'

export default async function LessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: enrollment } = await supabase
    .from('course_enrollments').select('id').eq('course_id', params.id).eq('student_id', user.id).single()

  const { data: course } = await supabase
    .from('courses').select('*, instructor_id').eq('id', params.id).single()

  if (!course) notFound()
  if (!enrollment && course.instructor_id !== user.id) redirect(`/kurslar/${params.id}`)

  const { data: lesson } = await supabase
    .from('course_lessons').select('*').eq('id', params.lessonId).single()

  if (!lesson) notFound()

  const { data: sections } = await supabase
    .from('course_sections')
    .select('*, lessons:course_lessons(id, title, duration_minutes, order_index)')
    .eq('course_id', params.id)
    .order('order_index')

  const { data: completion } = await supabase
    .from('lesson_completions').select('id').eq('lesson_id', params.lessonId).eq('student_id', user.id).single()

  const { data: allCompletions } = await supabase
    .from('lesson_completions').select('lesson_id').eq('student_id', user.id)

  const completedIds = new Set(allCompletions?.map(c => c.lesson_id) || [])
  const totalLessons = sections?.reduce((sum, s) => sum + (s.lessons?.length || 0), 0) || 0

  return (
    <AppLayout user={user} profile={profile}>
      <div className="flex h-screen overflow-hidden">
        {/* Sol — Ders listesi */}
        <div className="w-72 border-r border-neutral-200 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-neutral-200">
            <Link href={`/kurslar/${params.id}`} className="flex items-center gap-1.5 text-xs text-ink/45 hover:text-ink mb-2">
              <ArrowLeft size={12} /> Kursa dön
            </Link>
            <p className="font-medium text-ink text-sm line-clamp-2">{course.title}</p>
            <p className="mono text-xs text-ink/35 mt-1">{completedIds.size}/{totalLessons} tamamlandı</p>
            <div className="h-1 bg-neutral-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-brand rounded-full" style={{ width: `${totalLessons > 0 ? (completedIds.size / totalLessons) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sections?.map((section: any) => (
              <div key={section.id}>
                <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
                  <p className="text-xs font-medium text-ink">{section.title}</p>
                </div>
                {section.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((l: any) => {
                  const isActive = l.id === params.lessonId
                  const isDone = completedIds.has(l.id)
                  return (
                    <Link key={l.id} href={`/kurslar/${params.id}/ders/${l.id}`}
                      className={`flex items-center gap-2.5 px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${isActive ? 'bg-brand/5 border-l-2 border-l-brand' : ''}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-500' : isActive ? 'bg-brand' : 'bg-neutral-200'}`}>
                        {isDone ? <Check size={10} className="text-white" /> : <Play size={8} className="text-white" />}
                      </div>
                      <p className={`text-xs flex-1 ${isActive ? 'font-medium text-brand' : 'text-ink/60'}`}>{l.title}</p>
                      {l.duration_minutes > 0 && <span className="mono text-xs text-ink/25">{l.duration_minutes}dk</span>}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Sağ — Ders içeriği */}
        <div className="flex-1 overflow-y-auto">
          <LessonClient
            lesson={lesson}
            userId={user.id}
            courseId={params.id}
            isCompleted={!!completion}
          />
        </div>
      </div>
    </AppLayout>
  )
}