'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Props = {
  conversationId: string
  currentUserId: string
  other: any
  initialMessages: any[]
}

export default function ChatClient({ conversationId, currentUserId, other, initialMessages }: Props) {
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>(initialMessages)
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const channel = supabase
      .channel(`conv-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, async (payload) => {
        const { data } = await supabase
          .from('messages')
          .select('*, sender:profiles(full_name, avatar_url)')
          .eq('id', payload.new.id)
          .single()
        if (data) setMessages(prev => [...prev, data])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [conversationId])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMsg.trim()) return
    setSending(true)

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: newMsg.trim(),
    })

    await supabase.from('conversations').update({
      last_message: newMsg.trim(),
      last_message_at: new Date().toISOString(),
    }).eq('id', conversationId)

    setNewMsg('')
    setSending(false)
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    if (mins < 1) return 'Şimdi'
    if (mins < 60) return `${mins} dk`
    if (hours < 24) return `${hours} sa`
    return new Date(date).toLocaleDateString('tr-TR')
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-200 bg-cream flex-shrink-0">
        <Link href="/mesajlar" className="text-ink/40 hover:text-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
          {other?.avatar_url
            ? <img src={other.avatar_url} alt="" className="w-full h-full object-cover" />
            : other?.full_name?.[0]
          }
        </div>
        <div>
          <p className="font-medium text-ink text-sm">{other?.full_name}</p>
          <p className="mono text-xs text-ink/35">Çevrimiçi</p>
        </div>
      </div>

      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-ink/35">Konuşmayı başlat.</p>
          </div>
        )}
        {messages.map((msg: any) => {
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-xs">
                  {other?.avatar_url ? <img src={other.avatar_url} alt="" className="w-full h-full object-cover" /> : other?.full_name?.[0]}
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-brand text-white rounded-tr-sm'
                    : 'bg-white border border-neutral-200 text-ink rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                <p className="mono text-xs text-ink/25 mt-1 px-1">{timeAgo(msg.created_at)}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Mesaj gönder */}
      <form onSubmit={handleSend} className="flex items-center gap-3 px-6 py-4 border-t border-neutral-200 bg-cream flex-shrink-0">
        <input
          type="text"
          className="input flex-1"
          placeholder={`${other?.full_name}'e mesaj gönder...`}
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          disabled={sending || !newMsg.trim()}
          className="btn-primary px-4 py-2.5 flex items-center gap-1.5 text-sm disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  )
}