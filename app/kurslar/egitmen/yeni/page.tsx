import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import KursYeniClient from './KursYeniClient'

export default async function KursYeniPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  if (profile?.role !== 'instructor') redirect('/kurslar/egitmen-ol')

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <KursYeniClient userId={user.id} />
      </main>
    </AppLayout>
  )
}