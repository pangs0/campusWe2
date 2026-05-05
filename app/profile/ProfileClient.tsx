'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera, Zap } from 'lucide-react'

type Props = {
  userId: string
  avatarUrl: string | null
  fullName: string
  username: string
  university: string | null
  department: string | null
  karmaTokens: number
  role?: string
}

export default function ProfileClient({ userId, avatarUrl, fullName, username, university, department, karmaTokens, role }: Props) {
  const supabase = createClient()
  const [preview, setPreview] = useState<string | null>(avatarUrl)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = data.publicUrl + '?t=' + Date.now()
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId)
      setPreview(url)
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center text-center">
      <label className="relative group cursor-pointer mb-3">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm">
          {preview ? (
            <img src={preview} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-brand/15 flex items-center justify-center font-serif text-2xl font-bold text-brand">
              {fullName?.[0] || '?'}
            </div>
          )}
        </div>
        <div className="absolute inset-0 rounded-full bg-ink/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading
            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Camera size={18} className="text-white" />
          }
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>

      <h1 className="font-serif text-xl font-bold text-ink">{fullName}</h1>
      <p className="mono text-xs text-ink/40 mt-0.5">@{username}</p>
      {role && role !== 'founder' && (
        <span className={`mono text-xs px-2 py-0.5 rounded-full mt-1.5 inline-block ${role === 'investor' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
          {role === 'investor' ? '💼 Yatırımcı' : '🏢 Şirket'}
        </span>
      )}
      {university && <p className="text-xs text-ink/45 mt-1">{university}</p>}
      {department && <p className="text-xs text-ink/35">{department}</p>}

      <div className="flex items-center gap-1.5 mt-3 bg-brand/8 rounded-lg px-3 py-1.5">
        <Zap size={12} className="text-brand" />
        <span className="mono text-sm font-medium text-brand">{karmaTokens} Karma</span>
      </div>
    </div>
  )
}