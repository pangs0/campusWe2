'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera } from 'lucide-react'

type AvatarUploadProps = {
  userId: string
  currentUrl: string | null
  fullName: string
  onUpload: (url: string) => void
}

export default function AvatarUpload({ userId, currentUrl, fullName, onUpload }: AvatarUploadProps) {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (error) {
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = data.publicUrl + '?t=' + Date.now()

    await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId)

    setPreview(url)
    onUpload(url)
    setUploading(false)
  }

  return (
    <div className="relative group w-20 h-20">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm">
        {preview ? (
          <img src={preview} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-brand/15 flex items-center justify-center font-serif text-2xl font-bold text-brand">
            {fullName?.[0] || '?'}
          </div>
        )}
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 rounded-full bg-ink/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        {uploading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Camera size={18} className="text-white" />
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}