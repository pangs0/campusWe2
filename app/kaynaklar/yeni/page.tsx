import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import KaynaklarYeniClient from './KaynaklarYeniClient'

export default async function YeniKaynakPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  return (
    <AppLayout user={user} profile={profile}>
      <KaynaklarYeniClient userId={user!.id} />
    </AppLayout>
  )
}