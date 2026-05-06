import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import InstructorClient from '@/app/kurslar/egitmen/InstructorClient'

export default async function EgitmenPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: courses } = await supabase
    .from('courses')
    .select('*, course_enrollments(id), course_reviews(rating)')
    .eq('instructor_id', user.id)
    .order('created_at', { ascending: false })

  const totalStudents = courses?.reduce((sum, c) => sum + (c.course_enrollments?.length || 0), 0) || 0
  const totalEarnings = courses?.reduce((sum, c) => {
    return sum + (c.price * (c.course_enrollments?.length || 0) * 0.75)
  }, 0) || 0

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <InstructorClient
          userId={user.id}
          courses={courses || []}
          totalStudents={totalStudents}
          totalEarnings={Math.round(totalEarnings)}
        />
      </main>
    </AppLayout>
  )
}