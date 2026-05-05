import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { MessageCircle, Plus } from 'lucide-react'

export default async function MessagesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*, participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url), participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url)')
    .or(`participant1_id.eq.${user!.id},participant2_id.eq.${user!.id}`)
    .order('last_message_at', { ascending: false })

  function getOther(conv: any) {
    return conv.participant1_id === user!.id ? conv.participant2 : conv.participant1
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Şimdi'
    if (mins < 60) return `${mins} dk`
    if (hours < 24) return `${hours} sa`
    return `${days} gün`
  }

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">MESAJLAR</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Konuşmalar.</h1>
          </div>
          <Link href="/mesajlar/yeni" className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus size={13} />
            Yeni mesaj
          </Link>
        </div>

        {conversations && conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((conv: any) => {
              const other = getOther(conv)
              return (
                <Link key={conv.id} href={`/mesajlar/${conv.id}`}
                  className="card flex items-center gap-3 hover:border-brand/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand">
                    {other?.avatar_url
                      ? <img src={other.avatar_url} alt="" className="w-full h-full object-cover" />
                      : other?.full_name?.[0]
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm group-hover:text-brand transition-colors">{other?.full_name}</p>
                    {conv.last_message && (
                      <p className="text-xs text-ink/40 truncate">{conv.last_message}</p>
                    )}
                  </div>
                  <p className="mono text-xs text-ink/30 flex-shrink-0">{timeAgo(conv.last_message_at)}</p>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
            <MessageCircle size={36} className="text-brand/25 mx-auto mb-3" />
            <p className="font-serif text-xl font-bold text-ink mb-1">Henüz mesaj yok.</p>
            <p className="text-sm text-ink/45 mb-5">Keşfet'ten bir kullanıcıya mesaj gönder.</p>
            <Link href="/kesfet" className="btn-primary inline-flex text-xs">Kullanıcıları keşfet →</Link>
          </div>
        )}
      </main>
    </AppLayout>
  )
}