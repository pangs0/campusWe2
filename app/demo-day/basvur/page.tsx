import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import DemoDayBasvurClient from './DemoDayBasvurClient'

export default async function DemoDayBasvurPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: startups } = await supabase
    .from('startups').select('*').eq('founder_id', user.id)

  const { data: existing } = await supabase
    .from('demo_day_applications').select('id, status').eq('applicant_id', user.id).single()

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <DemoDayBasvurClient
          userId={user.id}
          startups={startups || []}
          existingApplication={existing}
        />
      </main>
    </AppLayout>
  )
}