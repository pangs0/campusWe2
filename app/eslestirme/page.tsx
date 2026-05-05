import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import MatchClient from '@/app/eslestirme/MatchClient'

export default async function MatchPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, user_skills(*)')
    .eq('id', user.id)
    .single()

  const { data: myStartups } = await supabase
    .from('startups')
    .select('id, name')
    .eq('founder_id', user.id)

  const { data: candidates } = await supabase
    .from('profiles')
    .select('*, user_skills(*)')
    .neq('id', user.id)
    .order('karma_tokens', { ascending: false })
    .limit(20)

  const { data: sentRequests } = await supabase
    .from('cofounder_requests')
    .select('receiver_id, status')
    .eq('sender_id', user.id)

  const { data: receivedRequests } = await supabase
    .from('cofounder_requests')
    .select('*, sender:profiles(full_name, avatar_url, university, user_skills(*)), startup:startups(name)')
    .eq('receiver_id', user.id)
    .eq('status', 'beklemede')

  const sentIds = new Set(sentRequests?.map(r => r.receiver_id) || [])

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10">
        <div className="mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">CO-FOUNDER EŞLEŞTİRME</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Doğru kurucu ortağını bul.</h1>
          <p className="text-sm text-ink/45 mt-1">Yeteneklerine göre en uygun co-founder adayları.</p>
        </div>

        <MatchClient
          currentUser={profile}
          candidates={candidates || []}
          startups={myStartups || []}
          sentIds={Array.from(sentIds)}
          receivedRequests={receivedRequests || []}
        />
      </main>
    </AppLayout>
  )
}