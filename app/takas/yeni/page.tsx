import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import YeniTakasClient from './YeniTakasClient'

export default async function YeniTakasPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <YeniTakasClient userId={user!.id} myKarma={profile?.karma_tokens || 0} />
      </main>
    </AppLayout>
  )
}