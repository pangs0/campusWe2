import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import HaritaMap from '@/app/harita/HaritaMap'

export default async function HaritaPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, username, university, city, karma_tokens, user_skills(skill_name)')
    .order('karma_tokens', { ascending: false })

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <HaritaMap users={profiles || []} />
      </main>
    </AppLayout>
  )
}