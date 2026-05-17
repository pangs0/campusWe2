import { createClient } from '@/lib/supabase/server'
import OgrenciDashboard from './OgrenciDashboard'

export default async function OgrenciPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()

  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('*, course:courses(id, title, thumbnail_url, instructor:profiles(full_name), course_lessons(id))')
    .eq('student_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: completions } = await supabase
    .from('lesson_completions').select('lesson_id, course_id').eq('student_id', user!.id)

  const completionMap = (completions || []).reduce((acc: any, c) => {
    acc[c.course_id] = (acc[c.course_id] || 0) + 1
    return acc
  }, {})

  return (
    <OgrenciDashboard
      profile={profile}
      enrollments={enrollments || []}
      completionMap={completionMap}
    />
  )
}