import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import CompanyEventsClient from '@/app/sirket/etkinlikler/CompanyEventsClient'

export default async function CompanyEventsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
  if (profile?.role !== 'company') redirect('/sirketler')

  const { data: events } = await supabase
    .from('company_events')
    .select('*')
    .eq('company_id', user.id)
    .order('event_date', { ascending: false })

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <CompanyEventsClient userId={user.id} initialEvents={events || []} />
      </main>
    </AppLayout>
  )
}