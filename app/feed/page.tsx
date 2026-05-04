import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import PostCard from '@/components/profile/PostCard'
import NewPostForm from '@/components/profile/NewPostForm'
import { Users } from 'lucide-react'

export default async function FeedPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: startups } = await supabase
    .from('startups').select('id, name').eq('founder_id', user.id)

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(full_name, avatar_url, username),
      startup:startups(name, slug),
      post_likes(user_id),
      post_comments(*, author:profiles(full_name, avatar_url))
    `)
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10 max-w-2xl">
        <div className="mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">TOPLULUK</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Akış</h1>
          <p className="text-sm text-ink/45 mt-1">Topluluktan son paylaşımlar.</p>
        </div>

        <NewPostForm
          userId={user.id}
          avatarUrl={profile?.avatar_url || null}
          fullName={profile?.full_name || '?'}
          startups={startups?.map(s => ({ id: s.id, name: s.name })) || []}
        />

        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <PostCard key={post.id} post={post} currentUserId={user.id} />
          ))
        ) : (
          <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
            <Users size={36} className="text-brand/25 mx-auto mb-3" />
            <p className="font-serif text-xl font-bold text-ink mb-1">Akış henüz boş.</p>
            <p className="text-sm text-ink/45 leading-relaxed">
              İlk paylaşımı yapan sen ol. Topluluk seni dinliyor.
            </p>
          </div>
        )}
      </main>
    </AppLayout>
  )
}