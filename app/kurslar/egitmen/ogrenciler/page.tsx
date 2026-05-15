import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Users, ArrowLeft, Award, MessageCircle, BookOpen } from 'lucide-react'

export default async function OgrencilerPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: courses } = await supabase
    .from('courses').select('id, title, price').eq('instructor_id', user.id)

  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('*, student:profiles(id, full_name, avatar_url, university), course:courses(id, title, price)')
    .in('course_id', courses?.map(c => c.id) || ['none'])
    .order('created_at', { ascending: false })

  // Her öğrenci için tamamlanan ders sayısı
  const { data: completions } = await supabase
    .from('lesson_completions')
    .select('student_id, lesson_id')
    .in('student_id', enrollments?.map(e => e.student_id) || ['none'])

  const completionMap = (completions || []).reduce((acc: any, c) => {
    acc[c.student_id] = (acc[c.student_id] || 0) + 1
    return acc
  }, {})

  const totalStudents = enrollments?.length || 0
  const totalEarnings = enrollments?.reduce((sum, e) => sum + ((e.course?.price || 0) * 0.75), 0) || 0

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <Link href="/kurslar/egitmen" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} /> Panele dön
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">EĞİTMEN PANELİ</p>
            <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Öğrencilerim.</h1>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: 'Toplam Öğrenci', value: totalStudents, color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: BookOpen, label: 'Kurs Sayısı', value: courses?.length || 0, color: 'text-brand', bg: 'bg-brand/8' },
            { icon: Award, label: 'Toplam Kazanç', value: `₺${Math.round(totalEarnings).toLocaleString('tr-TR')}`, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((s, i) => (
            <div key={i} className="card flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={18} className={s.color} />
              </div>
              <div>
                <p className={`font-serif text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mono text-xs text-ink/35">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Öğrenci listesi */}
        <div className="card">
          <p className="mono text-xs text-ink/35 tracking-widest mb-4">TÜM ÖĞRENCİLER</p>
          {enrollments && enrollments.length > 0 ? (
            <div className="space-y-3">
              {enrollments.map((e: any, i: number) => {
                const lessonsCompleted = completionMap[e.student_id] || 0
                const earnings = Math.round((e.course?.price || 0) * 0.75)
                return (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50/50 hover:bg-brand/3 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand flex-shrink-0 overflow-hidden">
                      {e.student?.avatar_url
                        ? <img src={e.student.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                        : e.student?.full_name?.[0] || '?'
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">{e.student?.full_name || 'Anonim'}</p>
                      <p className="mono text-xs text-ink/40">{e.student?.university || ''}</p>
                    </div>
                    <div className="text-center px-3">
                      <p className="text-xs text-ink/40 mb-0.5">{e.course?.title}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full" style={{ width: `${Math.min(lessonsCompleted * 10, 100)}%` }} />
                        </div>
                        <span className="mono text-xs text-ink/30">{lessonsCompleted} ders</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="mono text-xs text-green-600 font-bold">+₺{earnings}</p>
                      <p className="mono text-xs text-ink/30">
                        {new Date(e.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <Link href={`/mesajlar/yeni?to=${e.student_id}`}
                      className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-brand/10 flex items-center justify-center transition-colors flex-shrink-0">
                      <MessageCircle size={14} className="text-ink/40 hover:text-brand" />
                    </Link>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
              <Users size={36} className="text-ink/15 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink/40 mb-1">Henüz öğrenci yok.</p>
              <p className="text-sm text-ink/30 mb-4">Kurslarını yayınladıktan sonra öğrenciler burada görünecek.</p>
              <Link href="/kurslar/egitmen" className="btn-primary text-sm px-6">Kurslara git →</Link>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  )
}