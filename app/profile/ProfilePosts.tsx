'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, MessageCircle, Send, Image, X, Trash2, Users } from 'lucide-react'

type Props = {
  userId: string
  avatarUrl: string | null
  fullName: string
  startups: { id: string; name: string }[]
  initialPosts: any[]
}

export default function ProfilePosts({ userId, avatarUrl, fullName, startups, initialPosts }: Props) {
  const supabase = createClient()
  const [posts, setPosts] = useState<any[]>(initialPosts)
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedStartup, setSelectedStartup] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)

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

    const { data: newPost } = await supabase
      .from('posts')
      .insert({ user_id: userId, content: content.trim(), image_url: imageUrl, startup_id: selectedStartup || null })
      .select(`*, author:profiles(full_name, avatar_url), startup:startups(name, slug), post_likes(user_id), post_comments(*, author:profiles(full_name, avatar_url))`)
      .single()

    if (newPost) setPosts(prev => [newPost, ...prev])
    setContent('')
    setImageFile(null)
    setImagePreview(null)
    setSelectedStartup('')
    setSubmitting(false)
  }

  return (
    <div>
      {/* Yeni post formu */}
      <form onSubmit={handleSubmit} className="card mb-4">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
            {avatarUrl ? <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" /> : fullName?.[0]}
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
                <img src={imagePreview} alt="" className="w-full max-h-64 object-cover" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }}
                  className="absolute top-2 right-2 bg-ink/60 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-ink/45 hover:text-brand transition-colors px-2 py-1 rounded">
                  <Image size={14} />
                  Görsel
                </button>
                {startups.length > 0 && (
                  <select value={selectedStartup} onChange={e => setSelectedStartup(e.target.value)}
                    className="text-xs text-ink/45 border-none bg-transparent focus:outline-none cursor-pointer">
                    <option value="">Startup etiketle</option>
                    {startups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                )}
              </div>
              <button type="submit" disabled={submitting || !content.trim()}
                className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5 disabled:opacity-40">
                <Send size={12} />
                {submitting ? 'Paylaşılıyor...' : 'Paylaş'}
              </button>
            </div>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
      </form>

      {/* Post listesi */}
      {posts.length > 0 ? (
        posts.map(post => <PostItem key={post.id} post={post} currentUserId={userId} onDelete={id => setPosts(prev => prev.filter(p => p.id !== id))} />)
      ) : (
        <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
          <Users size={32} className="text-brand/25 mx-auto mb-3" />
          <p className="font-serif text-lg font-bold text-ink mb-1">Henüz paylaşım yok.</p>
          <p className="text-sm text-ink/45">Girişim yolculuğundan bir şey paylaş.</p>
        </div>
      )}
    </div>
  )
}

function PostItem({ post, currentUserId, onDelete }: { post: any; currentUserId: string; onDelete: (id: string) => void }) {
  const supabase = createClient()
  const [likes, setLikes] = useState(post.post_likes?.length || 0)
  const [liked, setLiked] = useState(post.post_likes?.some((l: any) => l.user_id === currentUserId) || false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>(post.post_comments || [])
  const [newComment, setNewComment] = useState('')
  const [commenting, setCommenting] = useState(false)

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

  async function handleLike() {
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', currentUserId)
      setLikes((l: number) => l - 1); setLiked(false)
    } else {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: currentUserId })
      setLikes((l: number) => l + 1); setLiked(true)
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    setCommenting(true)
    const { data } = await supabase.from('post_comments')
      .insert({ post_id: post.id, user_id: currentUserId, content: newComment.trim() })
      .select('*, author:profiles(full_name, avatar_url)').single()
    if (data) setComments(prev => [...prev, data])
    setNewComment('')
    setCommenting(false)
  }

  async function handleDelete() {
    await supabase.from('posts').delete().eq('id', post.id)
    onDelete(post.id)
  }

  return (
    <div className="card mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
            {post.author?.avatar_url
              ? <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
              : post.author?.full_name?.[0]
            }
          </div>
          <div>
            <p className="font-medium text-ink text-sm">{post.author?.full_name}</p>
            <div className="flex items-center gap-1.5">
              <p className="mono text-xs text-ink/35">{timeAgo(post.created_at)}</p>
              {post.startup && <><span className="text-ink/20 text-xs">·</span><span className="mono text-xs text-brand">{post.startup.name}</span></>}
            </div>
          </div>
        </div>
        {currentUserId === post.user_id && (
          <button onClick={handleDelete} className="text-ink/20 hover:text-red-500 transition-colors p-1">
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <p className="text-sm text-ink/80 leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

      {post.image_url && (
        <div className="rounded-xl overflow-hidden mb-3 border border-neutral-100">
          <img src={post.image_url} alt="" className="w-full max-h-96 object-cover" />
        </div>
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-neutral-100">
        <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-red-500' : 'text-ink/40 hover:text-red-400'}`}>
          <Heart size={14} className={liked ? 'fill-red-500' : ''} />
          {likes > 0 && <span>{likes}</span>}
          <span>{liked ? 'Beğenildi' : 'Beğen'}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-xs text-ink/40 hover:text-ink transition-colors">
          <MessageCircle size={14} />
          {comments.length > 0 && <span>{comments.length}</span>}
          <span>Yorum</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-3 pt-3 border-t border-neutral-100">
          {comments.map((c: any) => (
            <div key={c.id} className="flex gap-2 mb-2">
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-brand/10 flex items-center justify-center font-bold text-brand text-xs">
                {c.author?.avatar_url ? <img src={c.author.avatar_url} alt="" className="w-full h-full object-cover" /> : c.author?.full_name?.[0]}
              </div>
              <div className="flex-1 bg-neutral-50 rounded-lg px-3 py-2">
                <p className="font-medium text-ink text-xs mb-0.5">{c.author?.full_name}</p>
                <p className="text-xs text-ink/65 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleComment} className="flex gap-2 mt-2">
            <input type="text" className="input text-xs py-1.5 flex-1" placeholder="Yorum yaz..."
              value={newComment} onChange={e => setNewComment(e.target.value)} />
            <button type="submit" disabled={commenting || !newComment.trim()} className="btn-primary px-3 py-1.5 text-xs disabled:opacity-40">
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}