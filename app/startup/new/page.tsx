import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import NewStartupClient from './NewStartupClient'

export default async function NewStartupPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user!.id).single()

  return (
    <AppLayout user={user} profile={profile}>
      <NewStartupClient userId={user!.id} profile={profile} />
    </AppLayout>
  )
}