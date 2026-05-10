import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import OfficeHoursClient from './OfficeHoursClient'

export default async function OfficeHoursPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: sessions } = await supabase
    .from('office_hours')
    .select('*, profiles(id, full_name, avatar_url, university, city)')
    .order('created_at', { ascending: false })

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <OfficeHoursClient userId={user.id} sessions={sessions || []} isInvestor={true} />
      </main>
    </AppLayout>
  )
}