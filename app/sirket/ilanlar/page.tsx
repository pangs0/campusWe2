import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import JobListingsClient from '@/app/sirket/ilanlar/JobListingsClient'

export default async function JobListingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
  if (profile?.role !== 'company') redirect('/sirketler')

  const { data: jobs } = await supabase
    .from('job_listings')
    .select('*, applications:job_applications(id, status)')
    .eq('company_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <JobListingsClient userId={user.id} initialJobs={jobs || []} />
      </main>
    </AppLayout>
  )
}