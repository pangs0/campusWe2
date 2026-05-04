import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Edit, Zap, TrendingUp, ArrowRight } from 'lucide-react'
import AvatarUpload from '@/components/profile/AvatarUpload'
import NewPostForm from '@/components/profile/NewPostForm'
import PostCard from '@/components/profile/PostCard'
import type { Startup } from '@/types'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: skills } = await supabase
    .from('user_skills').select('*').eq('user_id', user.id)

  const { data: startups } = await supabase
    .from('startups').select('*').eq('founder_id', user.id).order('created_at', { ascending: false })

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(full_name, avatar_url),
      startup:startups(name, slug),
      post_likes(user_id),
      post_comments(*, author:profiles(full_name, avatar_url))
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10">
        <div className="grid grid-cols-3 gap-6">

          {/* Sol kolon — profil bilgileri */}
          <div className="col-span-1 space-y-4">

            {/* Profil kartı */}
            <div className="card">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="mb-3">
                  <AvatarUpload
                    userId={user.id}
                    currentUrl={profile?.avatar_url || null}
                    fullName={profile?.full_name || '?'}
                    onUpload={() => {}}
                  />
                </div>
                <h1 className="font-serif text-xl font-bold text-ink">{profile?.full_name}</h1>
                <p className="mono text-xs text-ink/40 mt-1">@{profile?.username}</p>
                {profile?.university && (
                  <p className="text-xs text-ink/45 mt-1">{profile.university}</p>
                )}
                {profile?.department && (
                  <p className="text-xs text-ink/35">{profile.department}</p>
                )}

                <div className="flex items-center gap-1.5 mt-3 bg-brand/8 rounded-lg px-3 py-1.5">
                  <Zap size={12} className="text-brand" />
                  <span className="mono text-sm font-medium text-brand">{profile?.karma_tokens || 0} Karma</span>
                </div>
              </div>

              <Link href="/profile/edit" className="btn-secondary w-full flex items-center justify-center gap-1.5 text-xs py-2">
                <Edit size={12} />
                Profili düzenle
              </Link>
            </div>

            {/* Hakkında */}
            {profile?.bio && (
              <div className="card">
                <p className="mono text-xs text-ink/35 tracking-widest mb-2">HAKKINDA</p>
                <p className="text-sm text-ink/60 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Yetenekler */}
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">YETENEKLERİM</p>
              {skills && skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill: any) => (
                    <span key={skill.id} className="mono text-xs bg-neutral-100 text-ink/60 border border-neutral-200 rounded px-2 py-0.5">
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink/35 mb-2">Henüz yetenek eklenmedi.</p>
              )}
              <Link href="/profile/edit" className="text-xs text-brand hover:underline mt-2 block">
                + Yetenek ekle
              </Link>
            </div>

            {/* Startuplar */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="mono text-xs text-ink/35 tracking-widest">STARTUPLARIM</p>
                <Link href="/startup/new" className="text-xs text-brand hover:underline">+ Yeni</Link>
              </div>
              {startups && startups.length > 0 ? (
                <div className="space-y-2">
                  {startups.map((s: Startup) => (
                    <Link key={s.id} href={`/startup/${s.slug}`}
                      className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg hover:bg-brand/5 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink group-hover:text-brand transition-colors">{s.name}</p>
                        <p className="mono text-xs text-ink/35">{s.stage}</p>
                      </div>
                      <ArrowRight size={12} className="text-ink/20 group-hover:text-brand transition-colors" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <TrendingUp size={24} className="text-ink/15 mx-auto mb-2" />
                  <p className="text-xs text-ink/35 mb-2">Henüz startup yok.</p>
                  <Link href="/startup/new" className="text-xs text-brand hover:underline">Oluştur →</Link>
                </div>
              )}
            </div>
          </div>

          {/* Sağ kolon — paylaşımlar */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-ink">Paylaşımlar</h2>
              <span className="mono text-xs text-ink/35">{posts?.length || 0} paylaşım</span>
            </div>

            <NewPostForm
              userId={user.id}
              avatarUrl={profile?.avatar_url || null}
              fullName={profile?.full_name || '?'}
              startups={startups?.map(s => ({ id: s.id, name: s.name })) || []}
            />

            {posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user.id}
                />
              ))
            ) : (
              <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
                <p className="font-serif text-lg font-bold text-ink mb-1">Henüz paylaşım yok.</p>
                <p className="text-sm text-ink/45 leading-relaxed max-w-xs mx-auto">
                  Girişim yolculuğundan bir şey paylaş. Topluluk seni dinliyor.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  )
}