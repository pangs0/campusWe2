import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import InvestorClient from '@/app/yatirimci/InvestorClient'

export default async function YatirimciPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  let { data: investorProfile } = await supabase
    .from('investor_profiles').select('*').eq('id', user.id).single()

  if (!investorProfile) {
    await supabase.from('investor_profiles').insert({ id: user.id })
    const { data } = await supabase.from('investor_profiles').select('*').eq('id', user.id).single()
    investorProfile = data
  }

  const { data: startups } = await supabase
    .from('startups')
    .select('*, founder:profiles(full_name, avatar_url, university, user_skills(skill_name)), startup_updates(id)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const { data: favorites } = await supabase
    .from('investor_favorites')
    .select('*, startup:startups(*, founder:profiles(full_name, avatar_url))')
    .eq('investor_id', user.id)

  const { data: demoApps } = await supabase
    .from('demo_day_applications')
    .select('*, startup:startups(name, slug, description, stage, sector, founder:profiles(full_name, university))')
    .eq('status', 'kabul')
    .order('created_at', { ascending: false })

  const favoriteIds = new Set(favorites?.map(f => f.startup_id) || [])

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <InvestorClient
          userId={user.id}
          profile={profile}
          investorProfile={investorProfile}
          startups={startups || []}
          favorites={favorites || []}
          favoriteIds={Array.from(favoriteIds)}
          demoApps={demoApps || []}
        />
      </main>
    </AppLayout>
  )
}