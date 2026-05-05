import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import ChatClient from '@/app/mesajlar/[id]/ChatClient'

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: conv } = await supabase
    .from('conversations')
    .select('*, participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url), participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url)')
    .eq('id', params.id)
    .single()

  if (!conv) notFound()
  if (conv.participant1_id !== user.id && conv.participant2_id !== user.id) notFound()

  const other = conv.participant1_id === user.id ? conv.participant2 : conv.participant1

  const { data: messages } = await supabase
    .from('messages')
    .select('*, sender:profiles(full_name, avatar_url)')
    .eq('conversation_id', params.id)
    .order('created_at', { ascending: true })

  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', params.id)
    .neq('sender_id', user.id)

  return (
    <AppLayout user={user}>
      <ChatClient
        conversationId={params.id}
        currentUserId={user.id}
        other={other}
        initialMessages={messages || []}
      />
    </AppLayout>
  )
}