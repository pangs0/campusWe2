import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Bell, MessageCircle, TrendingUp, Star, Users, Zap } from 'lucide-react'

export default async function BildirimlerPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Okunmamışları okundu yap
  await supabase.from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  const typeIcons: Record<string, any> = {
    message: MessageCircle,
    startup: TrendingUp,
    like: Star,
    follow: Users,
    karma: Zap,
  }

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10 max-w-2xl">
        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">BİLDİRİMLER</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Bildirimler.</h1>
        </div>

        {notifications && notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((n: any) => {
              const Icon = typeIcons[n.type] || Bell
              return (
                <div key={n.id} className={`card flex items-start gap-3 ${!n.is_read ? 'border-brand/20 bg-brand/3' : ''}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${!n.is_read ? 'bg-brand/10' : 'bg-neutral-100'}`}>
                    <Icon size={15} className={!n.is_read ? 'text-brand' : 'text-ink/40'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink">{n.message}</p>
                    <p className="mono text-xs text-ink/30 mt-0.5">
                      {new Date(n.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-1.5" />
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
            <Bell size={36} className="text-brand/25 mx-auto mb-3" />
            <p className="font-serif text-xl font-bold text-ink mb-2">Bildirim yok.</p>
            <p className="text-sm text-ink/45">Yeni bildirimler burada görünecek.</p>
          </div>
        )}
      </main>
    </AppLayout>
  )
}