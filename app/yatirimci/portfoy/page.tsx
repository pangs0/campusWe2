import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import PortfolioClient from '@/app/yatirimci/portfoy/PortfolioClient'

export default async function PortfolioPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'investor') redirect('/yatirimcilar')

  const { data: portfolio } = await supabase
    .from('investor_portfolio')
    .select('*')
    .eq('investor_id', user.id)
    .order('year', { ascending: false })

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <PortfolioClient userId={user.id} initialPortfolio={portfolio || []} />
      </main>
    </AppLayout>
  )
}