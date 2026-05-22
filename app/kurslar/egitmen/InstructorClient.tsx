'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, X, BookOpen, Users, TrendingUp, Edit, Eye, EyeOff, Star, Upload, Award, Copy, Check, DollarSign, BarChart2, Gift, Filter } from 'lucide-react'

const CATEGORIES = ['girisimcilik', 'teknoloji', 'pazarlama', 'finans', 'tasarim', 'kisisel_gelisim', 'diger']
const LEVELS = ['başlangıç', 'orta', 'ileri']

type Props = {
  userId: string
  username: string
  courses: any[]
  totalStudents: number
  totalEarnings: number
  monthlyEarnings: number
  avgRating: number
  totalReviews: number
  totalCertificates: number
  monthlyData: { month: string; earnings: number; students: number }[]
  recentEnrollments: any[]
}

export default function InstructorClient({
  userId, username, courses: initialCourses, totalStudents, totalEarnings,
  monthlyEarnings, avgRating, totalReviews, totalCertificates, monthlyData, recentEnrollments
}: Props) {
  const supabase = createClient()
  const [courses, setCourses] = useState(initialCourses)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'students' | 'earnings' | 'reviews'>('dashboard')
  const [courseFilter, setCourseFilter] = useState<'tumu' | 'yayinda' | 'taslak'>('tumu')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [monthlyGoal, setMonthlyGoal] = useState(50)
  const [editingGoal, setEditingGoal] = useState(false)

  const referralLink = `https://campuswe.com/egitmen/${username || userId}`
  const currentMonthStudents = recentEnrollments?.length || 0
  const goalProgress = Math.min(Math.round((currentMonthStudents / monthlyGoal) * 100), 100)
  const maxEarning = Math.max(...(monthlyData?.map(m => m.earnings) || [1]))

  // Kurs filtresi
  const filteredCourses = courses.filter(c => {
    if (courseFilter === 'yayinda') return c.is_published
    if (courseFilter === 'taslak') return !c.is_published
    return true
  })

  const publishedCount = courses.filter(c => c.is_published).length
  const draftCount = courses.filter(c => !c.is_published).length

  function getCourseRating(reviews: any[]) {
    if (!reviews?.length) return null
    return (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
  }

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function togglePublish(courseId: string, current: boolean) {
    setLoading(true)
    await supabase.from('courses').update({ is_published: !current }).eq('id', courseId)
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_published: !current } : c))
    setLoading(false)
  }

  const TABS = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { key: 'courses', label: 'Kurslarım', icon: BookOpen },
    { key: 'students', label: 'Öğrenciler', icon: Users },
    { key: 'earnings', label: 'Gelir', icon: DollarSign },
    { key: 'reviews', label: 'Yorumlar', icon: Star },
  ]

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">EĞİTMEN PANELİ</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Eğitmen Paneli.</h1>
        </div>
        <Link href="/kurslar/egitmen/yeni" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yeni Kurs
        </Link>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-neutral-200 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg mono text-xs transition-colors whitespace-nowrap ${
              activeTab === tab.key ? 'bg-ink text-white' : 'text-ink/50 hover:text-ink'
            }`}>
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════ DASHBOARD ══════════ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {[
              { icon: BookOpen, label: 'Yayında/Toplam', value: `${publishedCount}/${courses.length}`, color: 'text-brand', bg: 'bg-brand/8' },
              { icon: Users, label: 'Öğrenci', value: totalStudents, color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Star, label: 'Ort. Puan', value: avgRating > 0 ? `${avgRating}/5` : '—', color: 'text-amber-500', bg: 'bg-amber-50' },
              { icon: Award, label: 'Sertifika', value: totalCertificates, color: 'text-green-600', bg: 'bg-green-50' },
              { icon: TrendingUp, label: 'Bu ay', value: `₺${monthlyEarnings.toLocaleString('tr-TR')}`, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((s, i) => (
              <div key={i} className="card flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div>
                  <p className={`font-serif text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="mono text-xs text-ink/35">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-4">AYLIK GELİR TRENDİ</p>
              {monthlyData && monthlyData.length > 0 ? (
                <div style={{ height: 128, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  {monthlyData.map((m, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                      <p className="mono text-ink/30" style={{ fontSize: 9 }}>₺{m.earnings > 999 ? (m.earnings/1000).toFixed(1)+'k' : m.earnings}</p>
                      <div style={{
                        width: '100%',
                        height: `${Math.max((m.earnings / maxEarning) * 100, 4)}px`,
                        background: i === monthlyData.length - 1 ? '#C4500A' : 'rgba(196,80,10,.2)',
                        borderRadius: '4px 4px 0 0',
                      }} />
                      <p className="mono text-ink/30" style={{ fontSize: 9 }}>{m.month}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-sm text-ink/30">Henüz veri yok.</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <p className="mono text-xs text-ink/35 tracking-widest">AYLIK HEDEF</p>
                  <button onClick={() => setEditingGoal(!editingGoal)} className="text-xs text-brand hover:underline">
                    {editingGoal ? 'Kaydet' : 'Düzenle'}
                  </button>
                </div>
                {editingGoal ? (
                  <input type="number" className="input text-center font-bold" value={monthlyGoal}
                    onChange={e => setMonthlyGoal(+e.target.value)} min={1} />
                ) : (
                  <div className="text-center mb-2">
                    <p className="font-serif text-3xl font-bold text-brand">{currentMonthStudents}<span className="text-ink/30 text-lg">/{monthlyGoal}</span></p>
                    <p className="mono text-xs text-ink/35">öğrenci</p>
                  </div>
                )}
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${goalProgress}%` }} />
                </div>
                <p className="mono text-xs text-ink/35 text-center mt-1">%{goalProgress} tamamlandı</p>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Gift size={13} className="text-brand" />
                  <p className="mono text-xs text-ink/35 tracking-widest">PROFİL LİNKİM</p>
                </div>
                <p className="text-xs text-ink/50 mb-2 break-all leading-relaxed">{referralLink}</p>
                <button onClick={copyLink}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                    copied ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-brand/8 text-brand border border-brand/15 hover:bg-brand/15'
                  }`}>
                  {copied ? <><Check size={12} /> Kopyalandı!</> : <><Copy size={12} /> Linki Kopyala</>}
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-4">SON AKTİVİTELER</p>
            {recentEnrollments && recentEnrollments.length > 0 ? (
              <div className="space-y-3">
                {recentEnrollments.slice(0, 8).map((e: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand text-sm flex-shrink-0 overflow-hidden">
                      {e.student?.avatar_url
                        ? <img src={e.student.avatar_url} alt="" className="w-full h-full object-cover" />
                        : e.student?.full_name?.[0] || '?'
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">
                        <span className="font-medium">{e.student?.full_name || 'Anonim'}</span>
                        <span className="text-ink/45"> · {e.course?.title}</span>
                      </p>
                    </div>
                    <span className="mono text-xs text-ink/30 flex-shrink-0">
                      {new Date(e.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink/35 text-center py-6">Henüz kayıt yok.</p>
            )}
          </div>
        </div>
      )}

      {/* ══════════ KURSLARIM ══════════ */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {/* Filtre + sayaç */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-ink/30" />
              <div className="flex gap-1 bg-white border border-neutral-200 rounded-lg p-1">
                {[
                  { key: 'tumu', label: `Tümü (${courses.length})` },
                  { key: 'yayinda', label: `🟢 Yayında (${publishedCount})` },
                  { key: 'taslak', label: `🟡 Taslak (${draftCount})` },
                ].map(f => (
                  <button key={f.key} onClick={() => setCourseFilter(f.key as any)}
                    className={`px-3 py-1.5 rounded-md mono text-xs transition-colors ${
                      courseFilter === f.key ? 'bg-ink text-white' : 'text-ink/50 hover:text-ink'
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <Link href="/kurslar/egitmen/yeni" className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
              <Plus size={13} /> Yeni Kurs
            </Link>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-xl">
              <BookOpen size={40} className="text-ink/15 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink/40 mb-2">
                {courseFilter === 'yayinda' ? 'Yayında kurs yok.' : courseFilter === 'taslak' ? 'Taslak kurs yok.' : 'Henüz kurs yok.'}
              </p>
              <Link href="/kurslar/egitmen/yeni" className="btn-primary text-sm px-6 mt-2 inline-flex items-center gap-2">
                <Plus size={14} /> İlk kursunu oluştur
              </Link>
            </div>
          ) : filteredCourses.map(course => {
            const rating = getCourseRating(course.course_reviews)
            const students = course.course_enrollments?.length || 0
            const earnings = Math.round((course.price || 0) * students * 0.75)
            return (
              <div key={course.id} className="card hover:border-brand/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-brand/8 flex items-center justify-center flex-shrink-0">
                    {course.thumbnail_url
                      ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      : <BookOpen size={20} className="text-brand/30" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif font-bold text-ink">{course.title}</h3>
                      <span className={`mono text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                        course.is_published
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {course.is_published ? '● Yayında' : '○ Taslak'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-ink/40"><Users size={11} /> {students} öğrenci</span>
                      {rating && <span className="flex items-center gap-1 text-xs text-amber-500"><Star size={11} className="fill-amber-500" /> {rating}</span>}
                      {!course.is_free && <span className="mono text-xs text-green-600">₺{earnings.toLocaleString('tr-TR')} kazanç</span>}
                      <span className="mono text-xs text-ink/30">{course.is_free ? 'Ücretsiz' : `₺${course.price}`}</span>
                      {course.level && <span className="mono text-xs text-ink/25 border border-neutral-200 rounded px-1.5 py-0.5">{course.level}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/kurslar/${course.id}`} className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1">
                      <Eye size={11} />
                    </Link>
                    <Link href={`/kurslar/egitmen/${course.id}/duzenle`} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                      <Edit size={12} /> Düzenle
                    </Link>
                    <button onClick={() => togglePublish(course.id, course.is_published)} disabled={loading}
                      className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-colors disabled:opacity-50 ${
                        course.is_published
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      }`}>
                      {course.is_published ? <><EyeOff size={12} /> Gizle</> : <><Eye size={12} /> Yayınla</>}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ══════════ ÖĞRENCİLER ══════════ */}
      {activeTab === 'students' && (
        <div className="card">
          <p className="mono text-xs text-ink/35 tracking-widest mb-4">TÜM ÖĞRENCİLER ({recentEnrollments?.length || 0})</p>
          {recentEnrollments && recentEnrollments.length > 0 ? (
            <div className="space-y-3">
              {recentEnrollments.map((e: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/50 hover:bg-brand/3 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand flex-shrink-0 overflow-hidden">
                    {e.student?.avatar_url
                      ? <img src={e.student.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                      : e.student?.full_name?.[0] || '?'
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{e.student?.full_name || 'Anonim'}</p>
                    <p className="mono text-xs text-ink/35 truncate">{e.course?.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="mono text-xs text-ink/40">
                      {new Date(e.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="mono text-xs text-green-600">+₺{Math.round((e.course?.price || 0) * 0.75)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink/35 text-center py-8">Henüz öğrenci yok.</p>
          )}
        </div>
      )}

      {/* ══════════ GELİR ══════════ */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Toplam Kazanç', value: `₺${totalEarnings.toLocaleString('tr-TR')}`, sub: 'Tüm zamanlar', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Bu Ay', value: `₺${monthlyEarnings.toLocaleString('tr-TR')}`, sub: 'Bu ay', color: 'text-brand', bg: 'bg-brand/8' },
              { label: 'Kayıt Başına', value: totalStudents > 0 ? `₺${Math.round(totalEarnings / totalStudents)}` : '₺0', sub: 'Ort. gelir', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((s, i) => (
              <div key={i} className={`card ${s.bg}`}>
                <p className="mono text-xs text-ink/35 mb-1">{s.label}</p>
                <p className={`font-serif text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mono text-xs text-ink/30 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-4">KURS BAZLI GELİR</p>
            <div className="space-y-3">
              {courses.map(course => {
                const students = course.course_enrollments?.length || 0
                const earnings = Math.round((course.price || 0) * students * 0.75)
                return (
                  <div key={course.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50/50">
                    <div>
                      <p className="text-sm font-medium text-ink">{course.title}</p>
                      <p className="mono text-xs text-ink/35">{students} öğrenci · {course.is_free ? 'Ücretsiz' : `₺${course.price}`}</p>
                    </div>
                    <p className="font-serif font-bold text-green-600">₺{earnings.toLocaleString('tr-TR')}</p>
                  </div>
                )
              })}
              {courses.length === 0 && <p className="text-sm text-ink/35 text-center py-4">Henüz kurs yok.</p>}
            </div>
          </div>
          <div className="card bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <DollarSign size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Ödeme sistemi yakında aktif!</p>
                <p className="text-xs text-amber-700 mt-0.5">İyzico entegrasyonu tamamlandığında kazancını doğrudan hesabına çekebileceksin.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ YORUMLAR ══════════ */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {courses.flatMap(c => (c.course_reviews || []).map((r: any) => ({ ...r, courseTitle: c.title }))).length > 0 ? (
            courses.flatMap(c =>
              (c.course_reviews || []).map((r: any, i: number) => (
                <div key={`${c.id}-${i}`} className="card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="mono text-xs text-brand mb-1">{c.title}</p>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={13} className={s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'} />
                        ))}
                      </div>
                    </div>
                    <span className="mono text-xs text-ink/30">
                      {new Date(r.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-ink/60 leading-relaxed">{r.comment}</p>}
                </div>
              ))
            )
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-xl">
              <Star size={36} className="text-ink/15 mx-auto mb-3" />
              <p className="text-sm text-ink/35">Henüz değerlendirme yok.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}