import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OgrenciLayout from '../OgrenciLayout'
import Link from 'next/link'
import { Award } from 'lucide-react'

export default async function SertifikalarPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/register/ogrenci')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect('/dashboard')

  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('*, course:courses(id, title, thumbnail_url, instructor:profiles(full_name), course_lessons(id))')
    .eq('student_id', user.id)

  const { data: completions } = await supabase
    .from('lesson_completions').select('course_id').eq('student_id', user.id)

  const completionMap = (completions || []).reduce((acc: any, c) => {
    acc[c.course_id] = (acc[c.course_id] || 0) + 1
    return acc
  }, {})

  const completedCourses = (enrollments || []).filter(e => {
    const total = e.course?.course_lessons?.length || 0
    return total > 0 && (completionMap[e.course_id] || 0) >= total
  })

  return (
    <OgrenciLayout user={user} profile={profile}>
      <div style={{ padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 2, marginBottom: 4 }}>ÖĞRENCİ PANELİ</p>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', letterSpacing: -1, margin: 0 }}>Sertifikalarım.</h1>
          <p style={{ fontSize: 14, color: 'rgba(26,26,24,.45)', marginTop: 6 }}>{completedCourses.length} kurs tamamlandı.</p>
        </div>

        {completedCourses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {completedCourses.map((e: any) => (
              <div key={e.id} style={{ background: 'white', border: '1.5px solid rgba(34,197,94,.2)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Award size={26} color="#22c55e" />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>{e.course?.title}</p>
                <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', marginBottom: 16 }}>{e.course?.instructor?.full_name}</p>
                <Link href={`/kurslar/${e.course_id}/sertifika`}
                  style={{ background: '#22c55e', color: 'white', padding: '8px 20px', borderRadius: 8, fontSize: 13, textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
                  Sertifikayı görüntüle
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: 16, border: '1.5px dashed rgba(26,26,24,.1)' }}>
            <Award size={40} color="rgba(26,26,24,.15)" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 8 }}>Henüz sertifika yok.</p>
            <p style={{ fontSize: 14, color: 'rgba(26,26,24,.45)', marginBottom: 20 }}>Bir kursu tamamla, sertifikanı kazan.</p>
            <Link href="/ogrenci/kurslarim" style={{ background: '#C4500A', color: 'white', padding: '10px 24px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
              Kurslarıma git →
            </Link>
          </div>
        )}
      </div>
    </OgrenciLayout>
  )
}