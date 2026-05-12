import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import FirsatlarClient from './FirsatlarClient'

export default async function FirsatlarPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  // Kullanıcının yetenekleri
  const { data: skills } = await supabase
    .from('user_skills').select('skill_name').eq('user_id', user.id)

  // İş ilanları
  const { data: jobs } = await supabase
    .from('job_listings')
    .select('*, company:company_profiles(company_name, sector, logo_url)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Etkinlikler
  const { data: events } = await supabase
    .from('company_events')
    .select('*, company:company_profiles(company_name, logo_url)')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })

  // Demo Day başvuruları
  const { data: demoDays } = await supabase
    .from('demo_day_applications')
    .select('id')
    .eq('applicant_id', user.id)
    .limit(1)

  const userSkills = skills?.map(s => s.skill_name.toLowerCase()) || []

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <FirsatlarClient
          userId={user!.id}
          jobs={jobs || []}
          events={events || []}
          userSkills={userSkills}
          hasAppliedDemoDay={!!(demoDays && demoDays.length > 0)}
        />
      </main>
    </AppLayout>
  )
}