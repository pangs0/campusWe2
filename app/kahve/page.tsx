import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import KahveClient from '@/app/kahve/KahveClient'

export default async function KahvePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: skills } = await supabase
    .from('user_skills').select('skill_name').eq('user_id', user.id)

  const { count } = await supabase
    .from('profiles').select('*', { count: 'exact', head: true })

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <KahveClient
          userId={user.id}
          mySkills={skills?.map((s: any) => s.skill_name) || []}
          totalCount={count || 0}
        />
      </main>
    </AppLayout>
  )
}