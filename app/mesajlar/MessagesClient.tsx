'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import TypewriterInput from '@/components/ui/TypewriterInput'
import { Send, Plus, Search, MessageCircle, X } from 'lucide-react'

type Props = {
  currentUserId: string
  initialConversations: any[]
  allProfiles: any[]
}

export default function MessagesClient({ currentUserId, initialConversations, allProfiles }: Props) {
  const supabase = createClient()
  const [conversations, setConversations] = useState<any[]>(initialConversations)
  const [selectedConv, setSelectedConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [showNewMsg, setShowNewMsg] = useState(false)
  const [search, setSearch] = useState('')
  const [profileSearch, setProfileSearch] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Konuşma listesini realtime dinle
    const convChannel = supabase
      .channel('conversations-list')
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'conversations',
      }, async (payload) => {
        const updatedId = payload.new.id
        if (conversations.find(c => c.id === updatedId)) {
          setConversations(prev => prev.map(c =>
            c.id === updatedId
              ? { ...c, last_message: payload.new.last_message, last_message_at: payload.new.last_message_at }
              : c
          ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()))
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(convChannel) }
  }, [conversations])

  useEffect(() => {
    if (!selectedConv) return
    loadMessages(selectedConv.id)

    const channel = supabase
      .channel(`conv-${selectedConv.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${selectedConv.id}`
      }, async (payload) => {
        // Kendi gönderdiğimiz mesajı tekrar ekleme
        if (payload.new.sender_id === currentUserId) return
        const { data } = await supabase
          .from('messages').select('*, sender:profiles(full_name, avatar_url)')
          .eq('id', payload.new.id).single()
        if (data) setMessages(prev => [...prev, data])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedConv])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages(convId: string) {
    const { data } = await supabase
      .from('messages').select('*, sender:profiles(full_name, avatar_url)')
      .eq('conversation_id', convId).order('created_at', { ascending: true })
    if (data) setMessages(data)
    await supabase.from('messages').update({ is_read: true })
      .eq('conversation_id', convId).neq('sender_id', currentUserId)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMsg.trim() || !selectedConv) return
    setSending(true)
    const msgContent = newMsg.trim()
    setNewMsg('')

    // Optimistic — hemen ekranda göster
    const tempMsg = {
      id: 'temp-' + Date.now(),
      conversation_id: selectedConv.id,
      sender_id: currentUserId,
      content: msgContent,
      created_at: new Date().toISOString(),
      sender: { full_name: 'Sen', avatar_url: null },
    }
    setMessages(prev => [...prev, tempMsg])

    // Veritabanına kaydet
    const { data: savedMsg } = await supabase.from('messages')
      .insert({ conversation_id: selectedConv.id, sender_id: currentUserId, content: msgContent })
      .select('*, sender:profiles(full_name, avatar_url)').single()

    // Temp mesajı gerçekle değiştir
    if (savedMsg) {
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? savedMsg : m))
    }

    await supabase.from('conversations').update({
      last_message: msgContent,
      last_message_at: new Date().toISOString(),
    }).eq('id', selectedConv.id)

    // Karşı tarafa bildirim
    const other = selectedConv.participant1_id === currentUserId
      ? selectedConv.participant2
      : selectedConv.participant1

    if (other?.id) {
      await supabase.from('notifications').insert({
        user_id: other.id,
        sender_id: currentUserId,
        type: 'message',
        content: `Sana yeni bir mesaj gönderdi.`,
        link: '/mesajlar',
      })
    }

    setConversations(prev => prev.map(c =>
      c.id === selectedConv.id
        ? { ...c, last_message: msgContent, last_message_at: new Date().toISOString() }
        : c
    ))

    setSending(false)
  }

  async function startConversation(otherUserId: string) {
    const p1 = currentUserId < otherUserId ? currentUserId : otherUserId
    const p2 = currentUserId < otherUserId ? otherUserId : currentUserId

    const { data: existing } = await supabase
      .from('conversations').select('*,participant1:profiles!conversations_participant1_id_fkey(id,full_name,avatar_url,university),participant2:profiles!conversations_participant2_id_fkey(id,full_name,avatar_url,university)')
      .eq('participant1_id', p1).eq('participant2_id', p2).single()

    if (existing) {
      setSelectedConv(existing)
      setShowNewMsg(false)
      return
    }

    const { data: newConv } = await supabase
      .from('conversations')
      .insert({ participant1_id: p1, participant2_id: p2 })
      .select('*,participant1:profiles!conversations_participant1_id_fkey(id,full_name,avatar_url,university),participant2:profiles!conversations_participant2_id_fkey(id,full_name,avatar_url,university)')
      .single()

    if (newConv) {
      setConversations(prev => [newConv, ...prev])
      setSelectedConv(newConv)
    }
    setShowNewMsg(false)
  }

  function getOther(conv: any) {
    return conv.participant1_id === currentUserId ? conv.participant2 : conv.participant1
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    if (mins < 1) return 'Şimdi'
    if (mins < 60) return `${mins} dk`
    if (hours < 24) return `${hours} sa`
    return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
  }

  const filteredConvs = conversations.filter(c => {
    const other = getOther(c)
    return other?.full_name?.toLowerCase().includes(search.toLowerCase())
  })

  const filteredProfiles = allProfiles.filter(p =>
    p.full_name?.toLowerCase().includes(profileSearch.toLowerCase()) ||
    p.username?.toLowerCase().includes(profileSearch.toLowerCase())
  )

  const selectedOther = selectedConv ? getOther(selectedConv) : null

  return (
    <div className="flex h-screen">
      {/* Sol — Konuşma listesi */}
      <div className="w-72 border-r border-neutral-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif font-bold text-ink">Mesajlar</h2>
            <button onClick={() => setShowNewMsg(true)}
              className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center hover:bg-brand/20 transition-colors">
              <Plus size={14} className="text-brand" />
            </button>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30" />
            <input type="text" className="w-full bg-neutral-100 rounded-lg pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-ink/35 focus:outline-none"
              placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length > 0 ? filteredConvs.map(conv => {
            const other = getOther(conv)
            const isSelected = selectedConv?.id === conv.id
            return (
              <button key={conv.id} onClick={() => setSelectedConv(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors text-left ${isSelected ? 'bg-brand/5 border-l-2 border-l-brand' : ''}`}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
                  {other?.avatar_url ? <img src={other.avatar_url} alt="" className="w-full h-full object-cover" /> : other?.full_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-ink text-sm truncate">{other?.full_name}</p>
                    <p className="mono text-xs text-ink/25 flex-shrink-0 ml-1">{timeAgo(conv.last_message_at)}</p>
                  </div>
                  {conv.last_message && (
                    <p className="text-xs text-ink/40 truncate">{conv.last_message}</p>
                  )}
                </div>
              </button>
            )
          }) : (
            <div className="py-10 text-center px-4">
              <MessageCircle size={24} className="text-ink/15 mx-auto mb-2" />
              <p className="text-xs text-ink/35">
                {search ? 'Bulunamadı.' : 'Henüz konuşma yok.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sağ — Chat alanı */}
      <div className="flex-1 flex flex-col">
        {selectedConv && selectedOther ? (
          <>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-200 flex-shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
                {selectedOther?.avatar_url ? <img src={selectedOther.avatar_url} alt="" className="w-full h-full object-cover" /> : selectedOther?.full_name?.[0]}
              </div>
              <div>
                <p className="font-medium text-ink text-sm">{selectedOther?.full_name}</p>
                <p className="mono text-xs text-ink/35">{selectedOther?.university || 'Girişimci'}</p>
              </div>
            </div>

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
                        {selectedOther?.avatar_url ? <img src={selectedOther.avatar_url} alt="" className="w-full h-full object-cover" /> : selectedOther?.full_name?.[0]}
                      </div>
                    )}
                    <div className={`max-w-sm flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-brand text-white rounded-tr-sm' : 'bg-white border border-neutral-200 text-ink rounded-tl-sm'}`}>
                        {msg.content}
                      </div>
                      <p className="mono text-xs text-ink/25 mt-1 px-1">{timeAgo(msg.created_at)}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-3 px-6 py-4 border-t border-neutral-200 flex-shrink-0">
              <TypewriterInput
                className="input flex-1"
                placeholders={[
                  `${selectedOther?.full_name}'e mesaj gönder...`,
                  'Merhaba! 👋',
                  'Bir şey sormak istiyorum...',
                  'Seninle tanışmak güzeldi!',
                ]}
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
              />
              <button type="submit" disabled={sending || !newMsg.trim()}
                className="btn-primary px-4 py-2.5 flex items-center gap-1.5 disabled:opacity-40">
                <Send size={14} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={48} className="text-ink/10 mx-auto mb-4" />
              <p className="font-serif text-xl font-bold text-ink/30 mb-1">Bir konuşma seç</p>
              <p className="text-sm text-ink/25 mb-4">veya yeni bir mesaj başlat</p>
              <button onClick={() => setShowNewMsg(true)} className="btn-primary text-sm flex items-center gap-1.5 mx-auto">
                <Plus size={14} /> Yeni mesaj
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Yeni mesaj modal */}
      {showNewMsg && (
        <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-6" onClick={() => setShowNewMsg(false)}>
          <div className="bg-cream rounded-xl w-full max-w-sm overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <p className="font-medium text-ink text-sm">Yeni mesaj</p>
              <button onClick={() => setShowNewMsg(false)} className="text-ink/30 hover:text-ink"><X size={16} /></button>
            </div>
            <div className="p-4">
              <div className="relative mb-3">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30" />
                <input type="text" className="w-full bg-neutral-100 rounded-lg pl-8 pr-3 py-2 text-xs text-ink placeholder:text-ink/35 focus:outline-none"
                  placeholder="İsim veya kullanıcı adı ara..." value={profileSearch}
                  onChange={e => setProfileSearch(e.target.value)} autoFocus />
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {filteredProfiles.map(p => (
                  <button key={p.id} onClick={() => startConversation(p.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors text-left">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-xs">
                      {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : p.full_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">{p.full_name}</p>
                      <p className="mono text-xs text-ink/35">@{p.username}{p.university && ` · ${p.university}`}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}