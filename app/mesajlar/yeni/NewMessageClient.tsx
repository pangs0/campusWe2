'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search } from 'lucide-react'

export default function NewMessageClient({ userId, profiles }: { userId: string; profiles: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const filtered = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.username?.toLowerCase().includes(search.toLowerCase())
  )

  async function startConversation(otherUserId: string) {
    setLoading(true)

    const p1 = userId < otherUserId ? userId : otherUserId
    const p2 = userId < otherUserId ? otherUserId : userId

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('participant1_id', p1)
      .eq('participant2_id', p2)
      .single()

    if (existing) {
      router.push(`/mesajlar/${existing.id}`)
      return
    }

    const { data: newConv } = await supabase
      .from('conversations')
      .insert({ participant1_id: p1, participant2_id: p2 })
      .select('id')
      .single()

    if (newConv) router.push(`/mesajlar/${newConv.id}`)
    setLoading(false)
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          type="text"
          className="input pl-9"
          placeholder="İsim veya kullanıcı adı ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => startConversation(p.id)}
            disabled={loading}
            className="w-full card flex items-center gap-3 hover:border-brand/30 transition-colors text-left disabled:opacity-60"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand">
              {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : p.full_name?.[0]}
            </div>
            <div>
              <p className="font-medium text-ink text-sm">{p.full_name}</p>
              <p className="mono text-xs text-ink/35">@{p.username}{p.university && ` · ${p.university}`}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-ink/35 py-8">Kullanıcı bulunamadı.</p>
        )}
      </div>
    </div>
  )
}