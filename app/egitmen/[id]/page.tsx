import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import EgitmenProfilClient from './EgitmenProfilClient'

export default async function EgitmenProfilPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  // Eğitmen bilgileri
  const { data: instructor } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, bio, university, karma_tokens, user_skills(skill_name)')
    .eq('id', params.id)
    .single()

  if (!instructor) redirect('/kurslar')

  // Eğitmenin kursları
  const { data: courses } = await supabase
    .from('courses')
    .select('*, course_enrollments(id), course_reviews(rating)')
    .eq('instructor_id', params.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // İstatistikler
  const totalStudents = courses?.reduce((sum, c) => sum + (c.course_enrollments?.length || 0), 0) || 0
  const allReviews = courses?.flatMap(c => c.course_reviews || []) || []
  const avgRating = allReviews.length > 0
    ? allReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / allReviews.length
    : 0

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <EgitmenProfilClient
          instructor={instructor}
          courses={courses || []}
          totalStudents={totalStudents}
          avgRating={Math.round(avgRating * 10) / 10}
          totalReviews={allReviews.length}
          isOwn={user.id === params.id}
        />
      </main>
    </AppLayout>
  )
}