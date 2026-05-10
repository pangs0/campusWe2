import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import MentorListClient from './MentorListClient'

export default async function OfficeHoursPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: sessions } = await supabase
    .from('office_hours')
    .select('*, mentor:profiles!office_hours_mentor_id_fkey(id, full_name, username, university, department, bio, avatar_url, karma_tokens, user_skills(skill_name))')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const { data: mySession } = await supabase
    .from('office_hours').select('id').eq('mentor_id', user.id).single()

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <MentorListClient
          userId={user!.id}
          sessions={sessions || []}
          isMentor={!!mySession}
        />
      </main>
    </AppLayout>
  )
}