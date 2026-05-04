'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Image, X, Send } from 'lucide-react'

type NewPostFormProps = {
  userId: string
  avatarUrl: string | null
  fullName: string
  startups: { id: string; name: string }[]
}

export default function NewPostForm({ userId, avatarUrl, fullName, startups }: NewPostFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedStartup, setSelectedStartup] = useState('')
  const [loading, setLoading] = useState(false)

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    let imageUrl = null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `${userId}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('post-images').upload(path, imageFile)
      if (!error) {
        const { data } = supabase.storage.from('post-images').getPublicUrl(path)
        imageUrl = data.publicUrl
      }
    }

    await supabase.from('posts').insert({
      user_id: userId,
      content: content.trim(),
      image_url: imageUrl,
      startup_id: selectedStartup || null,
    })

    setContent('')
    setImageFile(null)
    setImagePreview(null)
    setSelectedStartup('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
              {fullName?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1">
          <textarea
            className="w-full text-sm text-ink placeholder:text-ink/35 resize-none focus:outline-none bg-transparent leading-relaxed"
            placeholder="Girişim yolculuğundan bir şey paylaş..."
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
          />

          {imagePreview && (
            <div className="relative mt-2 rounded-lg overflow-hidden border border-neutral-200">
              <img src={imagePreview} alt="Önizleme" className="w-full max-h-64 object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-ink/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-ink transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-ink/45 hover:text-brand transition-colors px-2 py-1 rounded"
              >
                <Image size={14} />
                Görsel ekle
              </button>

              {startups.length > 0 && (
                <select
                  value={selectedStartup}
                  onChange={e => setSelectedStartup(e.target.value)}
                  className="text-xs text-ink/45 border-none bg-transparent focus:outline-none cursor-pointer hover:text-ink transition-colors"
                >
                  <option value="">Startup etiketle</option>
                  {startups.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5 disabled:opacity-40"
            >
              <Send size={12} />
              {loading ? 'Paylaşılıyor...' : 'Paylaş'}
            </button>
          </div>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
    </form>
  )
}