import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import EgitmenOlClient from './EgitmenOlClient'

export default async function EgitmenOlPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens, bio, university').eq('id', user.id).single()

  const { data: skills } = await supabase
    .from('user_skills').select('skill_name').eq('user_id', user.id)

  const { data: existingCourses } = await supabase
    .from('courses').select('id').eq('instructor_id', user.id).limit(1)

  const isInstructor = profile?.role === 'instructor'

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <EgitmenOlClient
          userId={user!.id}
          profile={profile}
          skills={skills || []}
          isInstructor={isInstructor}
        />
      </main>
    </AppLayout>
  )
}