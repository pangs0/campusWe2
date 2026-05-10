import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import InvestorProfile from './InvestorProfile'
import CompanyProfile from './CompanyProfile'
import FounderProfile from './FounderProfile'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const role = profile?.role || 'founder'

  // Ortak veriler
  const { data: posts } = await supabase
    .from('posts')
    .select('*, author:profiles(full_name, avatar_url), post_likes(user_id), post_comments(id)')
    .eq('user_id', user.id).order('created_at', { ascending: false })

  const { data: skills } = await supabase.from('user_skills').select('*').eq('user_id', user.id)

  // Founder
  const { data: startups } = role === 'founder'
    ? await supabase.from('startups').select('*').eq('founder_id', user.id).order('created_at', { ascending: false })
    : { data: null }

  // Investor
  const { data: investorProfile } = role === 'investor'
    ? await supabase.from('investor_profiles').select('*').eq('id', user.id).single()
    : { data: null }
  const { data: portfolio } = role === 'investor'
    ? await supabase.from('investor_portfolio').select('*').eq('investor_id', user.id).order('year', { ascending: false })
    : { data: null }
  const { data: favorites } = role === 'investor'
    ? await supabase.from('investor_favorites').select('*, startup:startups(name, slug, stage)').eq('investor_id', user.id)
    : { data: null }
  const { data: officeHours } = role === 'investor'
    ? await supabase.from('office_hours').select('*').eq('investor_id', user.id).eq('status', 'open').order('date')
    : { data: null }

  // Company
  const { data: companyProfile } = role === 'company'
    ? await supabase.from('company_profiles').select('*').eq('id', user.id).single()
    : { data: null }
  const { data: jobListings } = role === 'company'
    ? await supabase.from('job_listings').select('*').eq('company_id', user.id).eq('is_active', true)
    : { data: null }
  const { data: companyEvents } = role === 'company'
    ? await supabase.from('company_events').select('*').eq('company_id', user.id).order('event_date', { ascending: false }).limit(5)
    : { data: null }
  const { data: watchlist } = role === 'company'
    ? await supabase.from('company_watchlist').select('*, startup:startups(name, slug, stage)').eq('company_id', user.id)
    : { data: null }

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        {role === 'investor' && (
          <InvestorProfile
            user={user} profile={profile}
            investorProfile={investorProfile}
            portfolio={portfolio || []}
            favorites={favorites || []}
            officeHours={officeHours || []}
            posts={posts || []}
          />
        )}
        {role === 'company' && (
          <CompanyProfile
            user={user} profile={profile}
            companyProfile={companyProfile}
            jobListings={jobListings || []}
            companyEvents={companyEvents || []}
            watchlist={watchlist || []}
            posts={posts || []}
          />
        )}
        {role === 'founder' && (
          <FounderProfile
            user={user} profile={profile}
            skills={skills || []}
            startups={startups || []}
            posts={posts || []}
          />
        )}
      </main>
    </AppLayout>
  )
}