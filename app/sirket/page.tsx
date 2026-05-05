import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import CompanyClient from '@/app/sirket/CompanyClient'

export default async function SirketPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  let { data: companyProfile } = await supabase
    .from('company_profiles').select('*').eq('id', user.id).single()

  if (!companyProfile) {
    await supabase.from('company_profiles').insert({ id: user.id, company_name: profile?.full_name || 'Şirket' })
    const { data } = await supabase.from('company_profiles').select('*').eq('id', user.id).single()
    companyProfile = data
  }

  const { data: talents } = await supabase
    .from('profiles')
    .select('*, user_skills(*), startups(id, name, slug, stage)')
    .neq('id', user.id)
    .order('karma_tokens', { ascending: false })
    .limit(30)

  const { data: watchlist } = await supabase
    .from('company_watchlist')
    .select('*, startup:startups(*, founder:profiles(full_name, avatar_url, university, user_skills(*)))')
    .eq('company_id', user.id)

  const { data: startups } = await supabase
    .from('startups')
    .select('*, founder:profiles(full_name, avatar_url, university, user_skills(*))')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const watchlistIds = new Set(watchlist?.map(w => w.startup_id) || [])

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10">
        <CompanyClient
          userId={user.id}
          profile={profile}
          companyProfile={companyProfile}
          talents={talents || []}
          watchlist={watchlist || []}
          watchlistIds={Array.from(watchlistIds)}
          startups={startups || []}
        />
      </main>
    </AppLayout>
  )
}