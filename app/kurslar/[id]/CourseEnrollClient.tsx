'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Play, Check } from 'lucide-react'

type Props = {
  courseId: string
  userId: string
  isEnrolled: boolean
  isInstructor: boolean
  isFree: boolean
  price: number
}

export default function CourseEnrollClient({ courseId, userId, isEnrolled, isInstructor, isFree, price }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [enrolled, setEnrolled] = useState(isEnrolled)
  const [loading, setLoading] = useState(false)

  async function handleEnroll() {
    setLoading(true)
    await supabase.from('course_enrollments').insert({
      course_id: courseId,
      student_id: userId,
      paid_price: isFree ? 0 : price,
    })
    setEnrolled(true)
    setLoading(false)
    router.refresh()
  }

  if (isInstructor) return (
    <div className="w-full py-2.5 text-center text-sm text-ink/40 bg-neutral-50 rounded-lg border border-neutral-200">
      Bu senin kursun
    </div>
  )

  if (enrolled) return (
    <div className="space-y-2">
      <div className="w-full py-2.5 text-center text-sm text-green-600 bg-green-50 rounded-lg border border-green-200 flex items-center justify-center gap-2">
        <Check size={14} /> Kayıtlısın
      </div>
      <button onClick={() => router.push(`/kurslar/${courseId}/ders`)}
        className="btn-primary w-full justify-center text-sm flex items-center gap-1.5">
        <Play size={14} /> Öğrenmeye devam et
      </button>
    </div>
  )

  return (
    <button onClick={handleEnroll} disabled={loading}
      className="btn-primary w-full justify-center text-sm disabled:opacity-60">
      {loading ? 'Kaydediliyor...' : isFree ? 'Ücretsiz kaydol' : `₺${price} — Kursa kaydol`}
    </button>
  )
}