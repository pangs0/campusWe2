import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import CourseEditorClient from '@/app/kurslar/egitmen/[id]/duzenle/CourseEditorClient'

export default async function CourseEditPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: course } = await supabase
    .from('courses').select('*').eq('id', params.id).eq('instructor_id', user.id).single()

  if (!course) notFound()

  const { data: sections } = await supabase
    .from('course_sections')
    .select('*, lessons:course_lessons(*)')
    .eq('course_id', params.id)
    .order('order_index')

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <CourseEditorClient course={course} initialSections={sections || []} />
      </main>
    </AppLayout>
  )
}