'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check } from 'lucide-react'

type Props = {
  lesson: any
  userId: string
  courseId: string
  isCompleted: boolean
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  return match?.[1] || null
}

export default function LessonClient({ lesson, userId, courseId, isCompleted }: Props) {
  const supabase = createClient()
  const [completed, setCompleted] = useState(isCompleted)
  const [loading, setLoading] = useState(false)

  async function markComplete() {
    if (completed) return
    setLoading(true)
    await supabase.from('lesson_completions').insert({ lesson_id: lesson.id, student_id: userId })
    setCompleted(true)
    setLoading(false)
  }

  const youtubeId = lesson.video_url ? getYoutubeId(lesson.video_url) : null

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <h1 className="font-serif text-2xl font-bold text-ink mb-2">{lesson.title}</h1>
      {lesson.duration_minutes > 0 && (
        <p className="mono text-xs text-ink/35 mb-6">{lesson.duration_minutes} dakika</p>
      )}

      {/* Video */}
      {lesson.video_url && (
        <div className="mb-6 rounded-xl overflow-hidden bg-ink" style={{ aspectRatio: '16/9' }}>
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={lesson.video_url} controls className="w-full h-full" />
          )}
        </div>
      )}

      {/* İçerik */}
      {lesson.content && (
        <div className="prose prose-sm max-w-none mb-8">
          <div className="text-sm text-ink/70 leading-relaxed whitespace-pre-wrap">{lesson.content}</div>
        </div>
      )}

      {/* Tamamla butonu */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
        <div />
        <button onClick={markComplete} disabled={completed || loading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            completed
              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
              : 'btn-primary'
          }`}>
          <Check size={14} />
          {completed ? 'Tamamlandı' : loading ? 'Kaydediliyor...' : 'Dersi tamamla'}
        </button>
      </div>
    </div>
  )
}