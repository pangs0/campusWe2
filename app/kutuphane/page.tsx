import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import KutuphaneClient from '@/app/kutuphane/KutuphaneClient'

export default async function KutuphanePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const today = new Date().toISOString().split('T')[0]
  const { data: goals } = await supabase
    .from('daily_goals').select('*').eq('user_id', user.id).eq('date', today).order('created_at')

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const { data: sessions } = await supabase
    .from('pomodoro_sessions').select('*').eq('user_id', user.id)
    .gte('completed_at', weekAgo).order('completed_at', { ascending: false })

  const { count } = await supabase
    .from('pomodoro_sessions').select('*', { count: 'exact', head: true })
    .gte('completed_at', weekAgo)

  return (
    <AppLayout user={user} profile={profile}>
      <KutuphaneClient
        userId={user.id}
        initialGoals={goals || []}
        initialSessions={sessions || []}
        communityCount={count || 0}
      />
    </AppLayout>
  )
}