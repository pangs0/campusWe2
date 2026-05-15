'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, X, BookOpen, Users, TrendingUp, Edit, Eye, EyeOff, Star, Upload, Target, Award, Copy, Check, MessageCircle, DollarSign, BarChart2, Gift } from 'lucide-react'

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
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [monthlyGoal, setMonthlyGoal] = useState(50)
  const [editingGoal, setEditingGoal] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '', description: '', category: 'girisimcilik', level: 'başlangıç',
    price: 0, is_free: true, thumbnail_url: '',
  })

  const referralLink = `https://campuswe.com/egitmen/${username || userId}`
  const currentMonthStudents = recentEnrollments?.length || 0
  const goalProgress = Math.min(Math.round((currentMonthStudents / monthlyGoal) * 100), 100)

  const maxEarning = Math.max(...(monthlyData?.map(m => m.earnings) || [1]))

  function getCourseRating(reviews: any[]) {
    if (!reviews?.length) return null
    return (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
  }

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbnailFile(file)
    const reader = new FileReader()
    reader.onload = () => setThumbnailPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function createCourse(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    let thumbnail_url = form.thumbnail_url
    if (thumbnailFile) {
      const cleanName = thumbnailFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const path = `${userId}/${Date.now()}-${cleanName}`
      const { error: uploadError } = await supabase.storage.from('course-thumbnails').upload(path, thumbnailFile)
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('course-thumbnails').getPublicUrl(path)
        thumbnail_url = urlData.publicUrl
      }
    }
    const { data } = await supabase.from('courses').insert({
      instructor_id: userId, ...form, thumbnail_url, is_published: false,
    }).select().single()
    if (data) {
      setCourses(prev => [{ ...data, course_enrollments: [], course_reviews: [] }, ...prev])
      setShowForm(false)
      setForm({ title: '', description: '', category: 'girisimcilik', level: 'başlangıç', price: 0, is_free: true, thumbnail_url: '' })
      setThumbnailFile(null); setThumbnailPreview(null)
    }
    setLoading(false)
  }

  async function togglePublish(courseId: string, current: boolean) {
    await supabase.from('courses').update({ is_published: !current }).eq('id', courseId)
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_published: !current } : c))
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
        <button onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yeni Kurs
        </button>
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

          {/* İstatistik kartları */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { icon: BookOpen, label: 'Kurs', value: courses.length, color: 'text-brand', bg: 'bg-brand/8' },
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
            {/* Gelir grafiği */}
            <div className="col-span-2 card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-4">AYLIK GELİR TRENDİ</p>
              {monthlyData && monthlyData.length > 0 ? (
                <div className="flex items-end gap-2 h-32">
                  {monthlyData.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <p className="mono text-xs text-ink/30" style={{ fontSize: 9 }}>₺{m.earnings > 999 ? (m.earnings/1000).toFixed(1)+'k' : m.earnings}</p>
                      <div className="w-full rounded-t-md bg-brand/20 hover:bg-brand/40 transition-colors relative group"
                        style={{ height: `${Math.max((m.earnings / maxEarning) * 100, 4)}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-white rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {m.students} öğrenci
                        </div>
                      </div>
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

            {/* Hedef + Referral */}
            <div className="space-y-4">
              {/* Aylık hedef */}
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

              {/* Referral link */}
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

          {/* Son aktiviteler */}
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
          {courses.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-xl">
              <BookOpen size={40} className="text-ink/15 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink/40 mb-2">Henüz kurs yok.</p>
              <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-6 mt-2">
                + İlk kursunu oluştur
              </button>
            </div>
          ) : courses.map(course => {
            const rating = getCourseRating(course.course_reviews)
            const students = course.course_enrollments?.length || 0
            const earnings = Math.round(course.price * students * 0.75)
            const completionRate = students > 0 ? Math.round((course.course_reviews?.length || 0) / students * 100) : 0
            return (
              <div key={course.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-brand/8 flex items-center justify-center flex-shrink-0">
                    {course.thumbnail_url
                      ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      : <BookOpen size={20} className="text-brand/30" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-ink">{course.title}</h3>
                      <span className={`mono text-xs px-2 py-0.5 rounded flex-shrink-0 ${course.is_published ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {course.is_published ? '● Yayında' : '○ Taslak'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-ink/40"><Users size={11} /> {students} öğrenci</span>
                      {rating && <span className="flex items-center gap-1 text-xs text-amber-500"><Star size={11} className="fill-amber-500" /> {rating}</span>}
                      <span className="mono text-xs text-green-600">₺{earnings.toLocaleString('tr-TR')}</span>
                      <span className="mono text-xs text-ink/30">{course.is_free ? 'Ücretsiz' : `₺${course.price}`}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/kurslar/egitmen/${course.id}/duzenle`} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                      <Edit size={12} /> Düzenle
                    </Link>
                    <button onClick={() => togglePublish(course.id, course.is_published)}
                      className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                      {course.is_published ? <EyeOff size={12} /> : <Eye size={12} />}
                      {course.is_published ? 'Gizle' : 'Yayınla'}
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
        <div className="space-y-4">
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
        </div>
      )}

      {/* ══════════ GELİR ══════════ */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Toplam Kazanç', value: `₺${totalEarnings.toLocaleString('tr-TR')}`, sub: 'Tüm zamanlar', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Bu Ay', value: `₺${monthlyEarnings.toLocaleString('tr-TR')}`, sub: 'Mayıs 2026', color: 'text-brand', bg: 'bg-brand/8' },
              { label: 'Ort. Ders Başı', value: totalStudents > 0 ? `₺${Math.round(totalEarnings / totalStudents)}` : '₺0', sub: 'Kayıt başına', color: 'text-purple-600', bg: 'bg-purple-50' },
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
                const earnings = Math.round(course.price * students * 0.75)
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
          {courses.flatMap(c =>
            (c.course_reviews || []).map((r: any) => ({
              ...r, courseTitle: c.title
            }))
          ).length > 0 ? (
            courses.flatMap(c =>
              (c.course_reviews || []).map((r: any, i: number) => (
                <div key={i} className="card">
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
                  {r.review && <p className="text-sm text-ink/60 leading-relaxed">{r.review}</p>}
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

      {/* ══════════ YENİ KURS FORMU ══════════ */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4">
            <div className="bg-cream rounded-2xl shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl font-bold text-ink">Yeni Kurs Oluştur</h2>
                  <button onClick={() => setShowForm(false)} className="text-ink/30 hover:text-ink"><X size={18} /></button>
                </div>
                <form onSubmit={createCourse} className="space-y-4">
                  {/* Thumbnail yükleme */}
                  <div>
                    <label className="label mb-2">Kapak Görseli</label>
                    {thumbnailPreview ? (
                      <div className="relative h-32 rounded-xl overflow-hidden">
                        <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(null) }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                          <X size={13} color="white" />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-neutral-200 rounded-xl h-24 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand/30 hover:bg-brand/2 transition-colors">
                        <Upload size={16} className="text-brand/40" />
                        <p className="text-xs text-ink/40">Görsel yükle</p>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                  </div>

                  <div>
                    <label className="label">Kurs Adı *</label>
                    <input className="input" placeholder="Sıfırdan Startup Kurmak" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="label">Açıklama</label>
                    <textarea className="input resize-none" rows={3} placeholder="Kurs hakkında kısa bilgi..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Kategori</label>
                      <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Seviye</label>
                      <select className="input" value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50">
                    <input type="checkbox" id="is_free" checked={form.is_free} onChange={e => setForm(p => ({ ...p, is_free: e.target.checked, price: e.target.checked ? 0 : p.price }))} className="accent-brand w-4 h-4" />
                    <label htmlFor="is_free" className="text-sm text-ink cursor-pointer">Ücretsiz kurs</label>
                  </div>
                  {!form.is_free && (
                    <div>
                      <label className="label">Fiyat (₺)</label>
                      <input type="number" className="input" min={1} value={form.price} onChange={e => setForm(p => ({ ...p, price: +e.target.value }))} />
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
                    {loading ? 'Oluşturuluyor...' : 'Kurs Oluştur →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}