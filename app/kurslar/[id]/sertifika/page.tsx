import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import SertifikaClient from './SertifikaClient'

export default async function SertifikaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: course } = await supabase
    .from('courses')
    .select('*, instructor:profiles(full_name)')
    .eq('id', params.id)
    .single()

  if (!course) redirect('/kurslar')

  // Kayıtlı mı?
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('id, created_at')
    .eq('course_id', params.id)
    .eq('student_id', user.id)
    .single()

  if (!enrollment) redirect(`/kurslar/${params.id}`)

  // Tüm dersler tamamlandı mı?
  const { data: sections } = await supabase
    .from('course_sections')
    .select('lessons(id)')
    .eq('course_id', params.id)

  const allLessonIds = sections?.flatMap(s => (s.lessons as any[])?.map((l: any) => l.id) || []) || []

  const { data: completions } = await supabase
    .from('lesson_completions')
    .select('lesson_id')
    .eq('student_id', user.id)
    .in('lesson_id', allLessonIds.length > 0 ? allLessonIds : ['none'])

  const completedIds = new Set(completions?.map(c => c.lesson_id) || [])
  const isCompleted = allLessonIds.length > 0 && allLessonIds.every(id => completedIds.has(id))

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <SertifikaClient
          course={course}
          studentName={profile?.full_name || user.email || ''}
          completionDate={enrollment.created_at}
          isCompleted={isCompleted}
          totalLessons={allLessonIds.length}
          completedLessons={completedIds.size}
        />
      </main>
    </AppLayout>
  )
}