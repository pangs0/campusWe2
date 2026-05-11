import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import WorkspaceClient from '@/app/workspace/[slug]/WorkspaceClient'

export default async function WorkspacePage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: startup } = await supabase
    .from('startups')
    .select('*, founder:profiles(full_name, avatar_url)')
    .eq('slug', params.slug)
    .single()

  if (!startup) notFound()

  // Erişim kontrolü — kurucu veya üye olmalı
  const { data: members } = await supabase
    .from('startup_members')
    .select('*, profile:profiles(id, full_name, avatar_url, username)')
    .eq('startup_id', startup.id)

  const isMember = startup.founder_id === user.id || members?.some(m => m.user_id === user.id)
  if (!isMember) redirect('/dashboard')

  const { data: meetings } = await supabase
    .from('meetings')
    .select('*, creator:profiles(full_name, avatar_url)')
    .eq('startup_id', startup.id)
    .order('scheduled_at', { ascending: false })

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('startup_id', startup.id)
    .order('created_at', { ascending: false })

  const { data: notes } = await supabase
    .from('notes')
    .select('*, creator:profiles(full_name, avatar_url)')
    .eq('startup_id', startup.id)
    .order('updated_at', { ascending: false })

  const { data: files } = await supabase
    .from('startup_files')
    .select('*, uploader:profiles(full_name)')
    .eq('startup_id', startup.id)
    .order('created_at', { ascending: false })

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <WorkspaceClient
          startup={startup}
          members={members || []}
          meetings={meetings || []}
          tasks={tasks || []}
          notes={notes || []}
          files={files || []}
          currentUserId={user.id}
          isMember={true}
        />
      </main>
    </AppLayout>
  )
}