import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import InstructorClient from '@/app/kurslar/egitmen/InstructorClient'

export const dynamic = 'force-dynamic'

export default async function EgitmenPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens, username').eq('id', user.id).single()

  if (profile?.role !== 'instructor') redirect('/kurslar/egitmen-ol')

  // Admin client — RLS bypass, eğitmenin tüm kurslarını çeker
  const admin = createAdminClient()

  const { data: courses, error: coursesError } = await admin
    .from('courses')
    .select('*, course_enrollments(id, created_at), course_reviews(id, rating, review, created_at)')
    .eq('instructor_id', user.id)
    .order('created_at', { ascending: false })

  console.log('DEBUG instructor_id:', user.id)
  console.log('DEBUG courses count:', courses?.length)
  console.log('DEBUG courses error:', coursesError?.message)

  const { data: recentEnrollments } = await admin
    .from('course_enrollments')
    .select('*, student:profiles(id, full_name, avatar_url), course:courses(title, price, is_free)')
    .in('course_id', courses?.map(c => c.id) || ['none'])
    .order('created_at', { ascending: false })
    .limit(50)

  const totalStudents = courses?.reduce((sum, c) => sum + (c.course_enrollments?.length || 0), 0) || 0
  const totalEarnings = courses?.reduce((sum, c) => {
    if (c.is_free || !c.price) return sum
    return sum + (c.price * (c.course_enrollments?.length || 0) * 0.75)
  }, 0) || 0

  const thisMonth = new Date()
  thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0)
  const monthlyEarnings = courses?.reduce((sum, c) => {
    if (c.is_free || !c.price) return sum
    const count = c.course_enrollments?.filter((e: any) => new Date(e.created_at) >= thisMonth).length || 0
    return sum + (c.price * count * 0.75)
  }, 0) ?? 0

  const allReviews = courses?.flatMap((c: any) => c.course_reviews || []) || []
  const avgRating = allReviews.length > 0
    ? allReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / allReviews.length : 0

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0)
    const monthEnrollments = recentEnrollments?.filter(e => {
      const date = new Date(e.created_at)
      return date >= monthStart && date <= monthEnd
    }) || []
    const earnings = monthEnrollments.reduce((sum, e) => {
      const price = (e.course as any)?.price || 0
      const isFree = (e.course as any)?.is_free
      return sum + (isFree ? 0 : price * 0.75)
    }, 0)
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
          totalCertificates={0}
          monthlyData={monthlyData}
          recentEnrollments={recentEnrollments || []}
        />
      </main>
    </AppLayout>
  )
}