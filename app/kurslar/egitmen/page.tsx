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
    .select('*, course_enrollments(id, created_at), course_reviews(id, rating)')
    .eq('instructor_id', user.id)
    .order('created_at', { ascending: false })

  const totalStudents = courses?.reduce((sum, c) => sum + (c.course_enrollments?.length || 0), 0) || 0
  const totalEarnings = courses?.reduce((sum, c) => {
    return sum + (c.price * (c.course_enrollments?.length || 0) * 0.75)
  }, 0) || 0

  // Bu ay kazanç
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)
  const monthlyEarnings: number = courses?.reduce((sum, c) => {
    const monthEnrollments = c.course_enrollments?.filter((e: any) =>
      new Date(e.created_at) >= thisMonth
    ).length || 0
    return sum + (c.price * monthEnrollments * 0.75)
  }, 0) ?? 0

  // Toplam puan ortalaması
  const allReviews = courses?.flatMap((c: any) => c.course_reviews || []) || []
  const avgRating = allReviews.length > 0
    ? allReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / allReviews.length
    : 0

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <InstructorClient
          userId={user.id}
          courses={courses || []}
          totalStudents={totalStudents}
          totalEarnings={Math.round(totalEarnings)}
          monthlyEarnings={Math.round(monthlyEarnings)}
          avgRating={Math.round(avgRating * 10) / 10}
          totalReviews={allReviews.length}
        />
      </main>
    </AppLayout>
  )
}