import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import ProfileEditClient from './ProfileEditClient'

export default async function ProfileEditPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const role = profile?.role || 'founder'

  const { data: skills } = await supabase.from('user_skills').select('*').eq('user_id', user.id)

  const { data: investorProfile } = role === 'investor'
    ? await supabase.from('investor_profiles').select('*').eq('id', user.id).single()
    : { data: null }

  const { data: companyProfile } = role === 'company'
    ? await supabase.from('company_profiles').select('*').eq('id', user.id).single()
    : { data: null }

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <ProfileEditClient
          userId={user.id}
          profile={profile}
          role={role}
          skills={skills || []}
          investorProfile={investorProfile}
          companyProfile={companyProfile}
        />
      </main>
    </AppLayout>
  )
}