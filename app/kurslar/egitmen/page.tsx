import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import InstructorClient from '@/app/kurslar/egitmen/InstructorClient'

export default async function EgitmenPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens, username').eq('id', user.id).single()

  const { data: courses } = await supabase
    .from('courses')
    .select('*, course_enrollments(id, created_at), course_reviews(id, rating, review, created_at)')
    .eq('instructor_id', user.id)
    .order('created_at', { ascending: false })

  // Son kayıtlar — öğrenci bilgileriyle
  const { data: recentEnrollments } = await supabase
    .from('course_enrollments')
    .select('*, student:profiles(id, full_name, avatar_url), course:courses(title, price)')
    .in('course_id', courses?.map(c => c.id) || ['none'])
    .order('created_at', { ascending: false })
    .limit(50)

  const totalStudents = courses?.reduce((sum, c) => sum + (c.course_enrollments?.length || 0), 0) || 0
  const totalEarnings = courses?.reduce((sum, c) => sum + (c.price * (c.course_enrollments?.length || 0) * 0.75), 0) || 0

  // Bu ay kazanç
  const thisMonth = new Date()
  thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0)
  const monthlyEarnings = courses?.reduce((sum, c) => {
    const monthEnrollments = c.course_enrollments?.filter((e: any) => new Date(e.created_at) >= thisMonth).length || 0
    return sum + (c.price * monthEnrollments * 0.75)
  }, 0) ?? 0

  const allReviews = courses?.flatMap((c: any) => c.course_reviews || []) || []
  const avgRating = allReviews.length > 0
    ? allReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / allReviews.length : 0

  // Sertifika sayısı — lesson_completions üzerinden tahmin
  const totalCertificates = 0 // TODO: gerçek veri

  // Aylık gelir trend — son 6 ay
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0)
    const monthEnrollments = recentEnrollments?.filter(e => {
      const date = new Date(e.created_at)
      return date >= monthStart && date <= monthEnd
    }) || []
    const earnings = monthEnrollments.reduce((sum, e) => sum + ((e.course?.price || 0) * 0.75), 0)
    return {
      month: d.toLocaleDateString('tr-TR', { month: 'short' }),
      earnings: Math.round(earnings),
      students: monthEnrollments.length
    }
  })

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <InstructorClient
          userId={user.id}
          username={profile?.username || ''}
          courses={courses || []}
          totalStudents={totalStudents}
          totalEarnings={Math.round(totalEarnings)}
          monthlyEarnings={Math.round(monthlyEarnings)}
          avgRating={Math.round(avgRating * 10) / 10}
          totalReviews={allReviews.length}
          totalCertificates={totalCertificates}
          monthlyData={monthlyData}
          recentEnrollments={recentEnrollments || []}
        />
      </main>
    </AppLayout>
  )
}