import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import StartupEditClient from './StartupEditClient'

export default async function EditStartupPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: startup } = await supabase
    .from('startups').select('*').eq('slug', params.slug).single()

  if (!startup || startup.founder_id !== user.id) redirect('/dashboard')

  const { data: members } = await supabase
    .from('startup_members')
    .select('*, profile:profiles(full_name, avatar_url, user_skills(skill_name))')
    .eq('startup_id', startup.id)

  return (
    <AppLayout user={user} profile={profile}>
      <StartupEditClient
        params={params}
        userId={user!.id}
        startup={startup}
        members={members || []}
      />
    </AppLayout>
  )
}