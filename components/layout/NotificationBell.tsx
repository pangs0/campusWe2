'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import Link from 'next/link'

export default function NotificationBell({ userId }: { userId: string }) {
  const supabase = createClient()
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!userId) return
    loadNotifications()

    // Her 5 saniyede kontrol et
    const interval = setInterval(loadNotifications, 5000)

    // Realtime da dene
    const channel = supabase
      .channel(`notif-${userId}-${Date.now()}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, () => loadNotifications())
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [userId])

  async function loadNotifications() {
    const { data } = await supabase
      .from('notifications')
      .select('*, sender:profiles(full_name, avatar_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) {
      setNotifications(data)
      setCount(data.filter(n => !n.is_read).length)
    }
  }

  async function markAllRead() {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
    setCount(0)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
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

  function typeIcon(type: string) {
    const icons: Record<string, string> = {
      like: '❤️', comment: '💬', match: '🤝', message: '✉️', takas: '⚡'
    }
    return icons[type] || '🔔'
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open && count > 0) markAllRead() }}
        className="relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink/55 hover:bg-neutral-100 hover:text-ink transition-colors w-full"
      >
        <Bell size={15} className="text-ink/40" />
        <span>Bildirimler</span>
        {count > 0 && (
          <span className="ml-auto bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-56 bottom-20 w-80 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
            <span className="font-medium text-ink text-sm">Bildirimler</span>
            {count > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand hover:underline">
                Tümünü okundu işaretle
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${!n.is_read ? 'bg-brand/3' : ''}`}
                >
                  <span className="text-lg flex-shrink-0">{typeIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink/80 leading-relaxed">{n.content}</p>
                    <p className="mono text-xs text-ink/35 mt-0.5">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-1.5" />}
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <Bell size={24} className="text-ink/15 mx-auto mb-2" />
                <p className="text-sm text-ink/35">Henüz bildirim yok.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}