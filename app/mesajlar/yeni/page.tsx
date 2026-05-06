import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import NewMessageClient from '@/app/mesajlar/yeni/NewMessageClient'

export default async function NewMessagePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, university')
    .neq('id', user.id)
    .order('full_name')

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10 max-w-xl">
        <div className="mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">YENİ MESAJ</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Kime yazıyorsun?</h1>
        </div>
        <NewMessageClient userId={user.id} profiles={profiles || []} />
      </main>
    </AppLayout>
  )
}