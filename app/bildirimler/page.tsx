import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { Bell, Users, Star, MessageCircle, BookOpen, Award, Zap } from 'lucide-react'

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  enrollment: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  review:     { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  message:    { icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
  course:     { icon: BookOpen, color: 'text-brand', bg: 'bg-brand/8' },
  certificate:{ icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
  karma:      { icon: Zap, color: 'text-brand', bg: 'bg-brand/8' },
  default:    { icon: Bell, color: 'text-ink/50', bg: 'bg-neutral-100' },
}

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

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Az önce'
    if (mins < 60) return `${mins} dk önce`
    if (hours < 24) return `${hours} saat önce`
    return `${days} gün önce`
  }

  // Tarihe göre grupla
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  const grouped = (notifications || []).reduce((acc: any, n) => {
    const d = new Date(n.created_at).toDateString()
    const label = d === today ? 'Bugün' : d === yesterday ? 'Dün' : new Date(n.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
    if (!acc[label]) acc[label] = []
    acc[label].push(n)
    return acc
  }, {})

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">BİLDİRİMLER</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Bildirimler.</h1>
          </div>
          {unreadCount > 0 && (
            <span className="mono text-xs bg-brand text-white rounded-full px-3 py-1">
              {unreadCount} yeni
            </span>
          )}
        </div>

        {notifications && notifications.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(grouped).map(([label, items]: [string, any]) => (
              <div key={label}>
                <p className="mono text-xs text-ink/30 tracking-widest mb-3">{label.toUpperCase()}</p>
                <div className="space-y-2">
                  {items.map((n: any) => {
                    const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.default
                    const Icon = config.icon
                    return (
                      <div key={n.id} className={`card flex items-start gap-3 transition-colors ${!n.is_read ? 'border-brand/20' : ''}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                          <Icon size={15} className={config.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ink leading-relaxed">{n.message}</p>
                          <p className="mono text-xs text-ink/30 mt-0.5">{timeAgo(n.created_at)}</p>
                        </div>
                        {!n.is_read && (
                          <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-2" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
            <Bell size={40} className="text-brand/20 mx-auto mb-3" />
            <p className="font-serif text-xl font-bold text-ink mb-2">Bildirim yok.</p>
            <p className="text-sm text-ink/40 max-w-xs mx-auto">
              Öğrenci kayıtları, yorumlar ve mesajlar için bildirimler burada görünecek.
            </p>
          </div>
        )}
      </main>
    </AppLayout>
  )
}