import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import SettingsClient from '@/app/ayarlar/SettingsClient'
import SettingsSidebar from '@/app/ayarlar/SettingsSidebar'

export default async function AyarlarPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  // AppLayout için role garantisi
  const sidebarProfile = { id: user.id, role: profile?.role || 'founder', full_name: profile?.full_name, avatar_url: profile?.avatar_url }

  const { data: skills } = await supabase
    .from('user_skills').select('id').eq('user_id', user.id)

  const { data: startups } = await supabase
    .from('startups').select('id').eq('founder_id', user.id)

  const { data: posts } = await supabase
    .from('posts').select('id').eq('user_id', user.id)

  const { data: postLikes } = await supabase
    .from('post_likes')
    .select('id, post:posts!inner(user_id)')
    .eq('post.user_id', user.id)

  const { data: takas } = await supabase
    .from('takas_offers').select('id').eq('owner_id', user.id)

  const { data: cofounders } = await supabase
    .from('cofounder_requests')
    .select('id, status')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

  const { data: allPosts } = await supabase
    .from('posts')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  let { data: settings } = await supabase
    .from('user_settings').select('*').eq('id', user.id).single()

  if (!settings) {
    await supabase.from('user_settings').insert({ id: user.id })
    const { data: newSettings } = await supabase
      .from('user_settings').select('*').eq('id', user.id).single()
    settings = newSettings
  }

  const stats = {
    posts: posts?.length || 0,
    likes: postLikes?.length || 0,
    startups: startups?.length || 0,
    skills: skills?.length || 0,
    takas: takas?.length || 0,
    cofounders: cofounders?.filter(c => c.status === 'kabul').length || 0,
  }

  const completion = {
    name: !!profile?.full_name,
    university: !!profile?.university,
    bio: !!profile?.bio,
    skills: (skills?.length || 0) > 0,
    startup: (startups?.length || 0) > 0,
  }
  const completionPercent = Math.round((Object.values(completion).filter(Boolean).length / 5) * 100)

  return (
    <AppLayout user={user} profile={sidebarProfile}>
      <main className="px-8 py-10">
        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">AYARLAR</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Hesap ayarları.</h1>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <SettingsClient
              userId={user.id}
              email={user.email || ''}
              settings={settings}
            />
          </div>

          <div>
            <SettingsSidebar
              profile={profile}
              stats={stats}
              completionPercent={completionPercent}
              email={user.email || ''}
              createdAt={user.created_at || ''}
              activityDates={allPosts?.map(p => p.created_at) || []}
            />
          </div>
        </div>
      </main>
    </AppLayout>
  )
}