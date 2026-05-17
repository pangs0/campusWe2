import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Play } from 'lucide-react'

export default async function KurslarimPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('*, course:courses(id, title, thumbnail_url, price, instructor:profiles(full_name), course_lessons(id))')
    .eq('student_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: completions } = await supabase
    .from('lesson_completions').select('lesson_id, course_id').eq('student_id', user!.id)

  const completionMap = (completions || []).reduce((acc: any, c) => {
    acc[c.course_id] = (acc[c.course_id] || 0) + 1
    return acc
  }, {})

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 2, marginBottom: 4 }}>ÖĞRENCİ PANELİ</p>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', letterSpacing: -1, margin: 0 }}>Kurslarım.</h1>
        <p style={{ fontSize: 14, color: 'rgba(26,26,24,.45)', marginTop: 6 }}>{enrollments?.length || 0} kursa kayıtlısın.</p>
      </div>

      {enrollments && enrollments.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {enrollments.map((e: any) => {
            const total = e.course?.course_lessons?.length || 0
            const done = completionMap[e.course_id] || 0
            const pct = total > 0 ? Math.round((done / total) * 100) : 0
            return (
              <Link key={e.id} href={`/kurslar/${e.course_id}`} style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.08)', borderRadius: 14, overflow: 'hidden', textDecoration: 'none', display: 'block' }}>
                <div style={{ height: 140, background: 'rgba(196,80,10,.06)', overflow: 'hidden' }}>
                  {e.course?.thumbnail_url
                    ? <img src={e.course.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={32} color="rgba(196,80,10,.2)" /></div>
                  }
                </div>
                <div style={{ padding: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 6, lineHeight: 1.3 }}>{e.course?.title}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', marginBottom: 12 }}>{e.course?.instructor?.full_name}</p>
                  <div style={{ height: 4, background: 'rgba(26,26,24,.08)', borderRadius: 2, marginBottom: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: pct === 100 ? '#22c55e' : '#C4500A', width: `${pct}%`, borderRadius: 2 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)' }}>%{pct} · {done}/{total} ders</p>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#C4500A', fontWeight: 600 }}>
                      <Play size={11} /> Devam et
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: 16, border: '1.5px dashed rgba(26,26,24,.1)' }}>
          <BookOpen size={40} color="rgba(196,80,10,.2)" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 8 }}>Henüz kurs yok.</p>
          <Link href="/kurslar" style={{ background: '#C4500A', color: 'white', padding: '10px 24px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginTop: 8 }}>
            Kurslara göz at →
          </Link>
        </div>
      )}
    </div>
  )
}