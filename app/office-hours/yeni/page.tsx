import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import MentorBasvurClient from './MentorBasvurClient'

export default async function YeniOfficeHoursPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens, bio, university').eq('id', user.id).single()

  const { data: skills } = await supabase
    .from('user_skills').select('skill_name').eq('user_id', user.id)

  const { data: existing } = await supabase
    .from('office_hours').select('id').eq('mentor_id', user.id).single()

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <MentorBasvurClient
          userId={user!.id}
          profile={profile}
          skills={skills || []}
          existing={existing}
        />
      </main>
    </AppLayout>
  )
}