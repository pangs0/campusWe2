import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import MessagesClient from '@/app/mesajlar/MessagesClient'

export default async function MessagesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*, participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url, university), participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url, university)')
    .or(`participant1_id.eq.${user!.id},participant2_id.eq.${user!.id}`)
    .order('last_message_at', { ascending: false })

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, university')
    .neq('id', user!.id)
    .order('full_name')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user!.id).single()

  return (
    <AppLayout user={user} profile={profile}>
      <MessagesClient
        currentUserId={user!.id}
        initialConversations={conversations || []}
        allProfiles={profiles || []}
      />
    </AppLayout>
  )
}