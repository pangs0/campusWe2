'use client'

import Link from 'next/link'
import { BookOpen, Award, TrendingUp, Clock, Play, ChevronRight } from 'lucide-react'

export default function OgrenciDashboard({ profile, enrollments, completionMap }: {
  profile: any; enrollments: any[]; completionMap: Record<string, number>
}) {
  const totalCourses = enrollments.length
  const totalCompleted = enrollments.filter(e => {
    const total = e.course?.course_lessons?.length || 0
    const done = completionMap[e.course_id] || 0
    return total > 0 && done >= total
  }).length
  const totalLessons = Object.values(completionMap).reduce((sum: number, v) => sum + (v as number), 0)

  return (
    <div style={{ padding: '40px 48px' }}>
      {/* Başlık */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.35)', letterSpacing: 2, marginBottom: 4 }}>HOŞ GELDİN</p>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', letterSpacing: -1, margin: 0 }}>
          Merhaba, {profile?.full_name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(26,26,24,.45)', marginTop: 6 }}>Öğrenmeye devam et.</p>
      </div>

      {/* İstatistikler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { icon: BookOpen, label: 'Kayıtlı Kurs', value: totalCourses, color: '#3b82f6', bg: '#eff6ff' },
          { icon: Award, label: 'Tamamlanan', value: totalCompleted, color: '#22c55e', bg: '#f0fdf4' },
          { icon: Play, label: 'İzlenen Ders', value: totalLessons, color: '#C4500A', bg: 'rgba(196,80,10,.08)' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.07)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div>
              <p style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', margin: '2px 0 0', letterSpacing: 1 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Devam eden kurslar */}
      {enrollments.length > 0 ? (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 700, color: '#1a1a18', margin: 0 }}>Kurslarım</h2>
            <Link href="/ogrenci/kurslarim" style={{ fontSize: 13, color: '#C4500A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Tümünü gör <ChevronRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {enrollments.slice(0, 6).map((e: any) => {
              const total = e.course?.course_lessons?.length || 0
              const done = completionMap[e.course_id] || 0
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <Link key={e.id} href={`/kurslar/${e.course_id}`} style={{ background: 'white', border: '1.5px solid rgba(26,26,24,.07)', borderRadius: 14, overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'border-color .2s' }}
                  onMouseEnter={el => (el.currentTarget.style.borderColor = 'rgba(196,80,10,.3)')}
                  onMouseLeave={el => (el.currentTarget.style.borderColor = 'rgba(26,26,24,.07)')}>
                  <div style={{ height: 100, background: 'rgba(196,80,10,.06)', overflow: 'hidden' }}>
                    {e.course?.thumbnail_url
                      ? <img src={e.course.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={28} color="rgba(196,80,10,.25)" /></div>
                    }
                  </div>
                  <div style={{ padding: 14 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18', marginBottom: 8, lineHeight: 1.3 }}>{e.course?.title}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.4)', marginBottom: 8 }}>{e.course?.instructor?.full_name}</p>
                    <div style={{ height: 4, background: 'rgba(26,26,24,.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                      <div style={{ height: '100%', background: pct === 100 ? '#22c55e' : '#C4500A', borderRadius: 2, width: `${pct}%`, transition: 'width .3s' }} />
                    </div>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)' }}>%{pct} tamamlandı · {done}/{total} ders</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 40px', background: 'white', borderRadius: 16, border: '1.5px dashed rgba(26,26,24,.1)', marginBottom: 40 }}>
          <BookOpen size={40} color="rgba(196,80,10,.25)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 8 }}>Henüz kurs yok.</h2>
          <p style={{ fontSize: 14, color: 'rgba(26,26,24,.45)', marginBottom: 20 }}>İlk kursuna kayıt ol, öğrenmeye başla.</p>
          <Link href="/kurslar" style={{ background: '#C4500A', color: 'white', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Kurslara göz at →
          </Link>
        </div>
      )}

      {/* Keşfet CTA */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a18, #2a1a10)', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 700, color: 'white', margin: '0 0 6px' }}>Yeni bir şeyler öğren.</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', margin: 0 }}>Yüzlerce kurs seni bekliyor.</p>
        </div>
        <Link href="/kurslar" style={{ background: '#C4500A', color: 'white', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Kurslara git →
        </Link>
      </div>
    </div>
  )
}