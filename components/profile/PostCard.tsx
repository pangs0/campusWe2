'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react'

type PostCardProps = {
  post: any
  currentUserId: string | null
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [likes, setLikes] = useState<number>(post.post_likes?.length || 0)
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
    if (mins < 60) return `${mins} dk önce`
    if (hours < 24) return `${hours} saat önce`
    return `${days} gün önce`
  }

  async function handleLike() {
    if (!currentUserId) return
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', currentUserId)
      setLikes(l => l - 1)
      setLiked(false)
    } else {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: currentUserId })
      setLikes(l => l + 1)
      setLiked(true)
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim() || !currentUserId) return
    setCommenting(true)

    const { data } = await supabase
      .from('post_comments')
      .insert({ post_id: post.id, user_id: currentUserId, content: newComment.trim() })
      .select('*, author:profiles(full_name, avatar_url)')
      .single()

    if (data) setComments(prev => [...prev, data])
    setNewComment('')
    setCommenting(false)
  }

  async function handleDelete() {
    await supabase.from('posts').delete().eq('id', post.id)
    router.refresh()
  }

  return (
    <div className="card mb-4">
      {/* Post başlık */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            {post.author?.avatar_url ? (
              <img src={post.author.avatar_url} alt={post.author.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
                {post.author?.full_name?.[0]}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-ink text-sm">{post.author?.full_name}</p>
            <div className="flex items-center gap-1.5">
              <p className="mono text-xs text-ink/35">{timeAgo(post.created_at)}</p>
              {post.startup && (
                <>
                  <span className="text-ink/20">·</span>
                  <span className="mono text-xs text-brand">{post.startup.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {currentUserId === post.user_id && (
          <button onClick={handleDelete} className="text-ink/20 hover:text-red-500 transition-colors p-1">
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* İçerik */}
      <p className="text-sm text-ink/80 leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

      {/* Görsel */}
      {post.image_url && (
        <div className="rounded-xl overflow-hidden mb-3 border border-neutral-100">
          <img src={post.image_url} alt="Post görseli" className="w-full max-h-96 object-cover" />
        </div>
      )}

      {/* Aksiyonlar */}
      <div className="flex items-center gap-4 pt-3 border-t border-neutral-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-red-500' : 'text-ink/40 hover:text-red-400'}`}
        >
          <Heart size={14} className={liked ? 'fill-red-500' : ''} />
          {likes > 0 && <span>{likes}</span>}
          <span>{liked ? 'Beğenildi' : 'Beğen'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs text-ink/40 hover:text-ink transition-colors"
        >
          <MessageCircle size={14} />
          {comments.length > 0 && <span>{comments.length}</span>}
          <span>Yorum</span>
        </button>
      </div>

      {/* Yorumlar */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-neutral-100">
          {comments.length > 0 && (
            <div className="space-y-3 mb-3">
              {comments.map((c: any) => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    {c.author?.avatar_url ? (
                      <img src={c.author.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand/10 flex items-center justify-center font-bold text-brand text-xs">
                        {c.author?.full_name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 bg-neutral-50 rounded-lg px-3 py-2">
                    <p className="font-medium text-ink text-xs mb-0.5">{c.author?.full_name}</p>
                    <p className="text-xs text-ink/65 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentUserId && (
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                className="input text-xs py-1.5 flex-1"
                placeholder="Yorum yaz..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="btn-primary px-3 py-1.5 text-xs disabled:opacity-40"
              >
                <Send size={12} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}