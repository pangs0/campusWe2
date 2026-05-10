import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import TakasClient from './TakasClient'

export default async function TakasPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: offers } = await supabase
    .from('takas_offers')
    .select('*, owner:profiles!takas_offers_owner_id_fkey(id, full_name, username, university, karma_tokens, avatar_url)')
    .eq('status', 'acik')
    .order('created_at', { ascending: false })

  const { data: myOffers } = await supabase
    .from('takas_offers')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <TakasClient
          userId={user.id}
          myKarma={profile?.karma_tokens || 0}
          offers={offers || []}
          myOffers={myOffers || []}
        />
      </main>
    </AppLayout>
  )
}