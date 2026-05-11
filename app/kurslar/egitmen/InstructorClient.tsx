'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, X, BookOpen, Users, TrendingUp, Edit, Eye, EyeOff, Star, Upload } from 'lucide-react'

const CATEGORIES = ['girisimcilik', 'teknoloji', 'pazarlama', 'finans', 'tasarim', 'kisisel_gelisim', 'diger']
const LEVELS = ['başlangıç', 'orta', 'ileri']

type Props = {
  userId: string
  courses: any[]
  totalStudents: number
  totalEarnings: number
}

export default function InstructorClient({ userId, courses: initialCourses, totalStudents, totalEarnings }: Props) {
  const supabase = createClient()
  const [courses, setCourses] = useState(initialCourses)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '', description: '', category: 'girisimcilik', level: 'başlangıç',
    price: 0, is_free: true, thumbnail_url: '',
  })

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbnailFile(file)
    const reader = new FileReader()
    reader.onload = () => setThumbnailPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function createCourse(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    let thumbnail_url = form.thumbnail_url

    // Thumbnail yükle
    if (thumbnailFile) {
      const cleanName = thumbnailFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const path = `${userId}/${Date.now()}-${cleanName}`
      const { error: uploadError } = await supabase.storage
        .from('course-thumbnails').upload(path, thumbnailFile)
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('course-thumbnails').getPublicUrl(path)
        thumbnail_url = urlData.publicUrl
      }
    }

    const { data, error } = await supabase.from('courses').insert({
      ...form,
      thumbnail_url,
      instructor_id: userId,
      is_published: false,
    }).select().single()
    if (data) setCourses(prev => [{ ...data, course_enrollments: [], course_reviews: [] }, ...prev])
    setShowForm(false)
    setThumbnailFile(null)
    setThumbnailPreview(null)
    setForm({ title: '', description: '', category: 'girisimcilik', level: 'başlangıç', price: 0, is_free: true, thumbnail_url: '' })
    setLoading(false)
  }

  async function togglePublish(id: string, isPublished: boolean) {
    await supabase.from('courses').update({ is_published: !isPublished }).eq('id', id)
    setCourses(prev => prev.map(c => c.id === id ? { ...c, is_published: !isPublished } : c))
  }

  function avgRating(reviews: any[]) {
    if (!reviews?.length) return null
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">EĞİTMEN PANELİ</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Kurslarım.</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Yeni kurs
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { n: courses.length, l: 'Kurs', icon: BookOpen },
          { n: totalStudents, l: 'Öğrenci', icon: Users },
          { n: `₺${totalEarnings.toLocaleString()}`, l: 'Kazanç (%75)', icon: TrendingUp },
        ].map(s => (
          <div key={s.l} className="card flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
              <s.icon size={18} className="text-brand" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-ink">{s.n}</p>
              <p className="mono text-xs text-ink/35">{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni kurs formu */}
      {showForm && (
        <form onSubmit={createCourse} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-ink">Yeni kurs</p>
            <button type="button" onClick={() => setShowForm(false)}><X size={15} className="text-ink/40" /></button>
          </div>
          <div>
            <label className="label">Kurs başlığı</label>
            <input className="input" placeholder="Sıfırdan Startup Kurmak" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Açıklama</label>
            <textarea className="input resize-none" rows={3} placeholder="Bu kursda ne öğrenecekler?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Kategori</label>
              <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Seviye</label>
              <select className="input" value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Fiyat (₺)</label>
              <input type="number" className="input" value={form.price} onChange={e => setForm(p => ({ ...p, price: parseInt(e.target.value) || 0 }))} disabled={form.is_free} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_free" checked={form.is_free} onChange={e => setForm(p => ({ ...p, is_free: e.target.checked }))} className="accent-brand w-4 h-4" />
            <label htmlFor="is_free" className="text-sm text-ink/60 cursor-pointer">Ücretsiz kurs</label>
          </div>
          <div>
            <label className="label">Kapak görseli</label>
            <div className="flex items-center gap-3">
              <div style={{ width: 80, height: 56, borderRadius: 8, overflow: 'hidden', border: '1.5px dashed rgba(26,26,24,.15)', background: 'rgba(26,26,24,.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {thumbnailPreview
                  ? <img src={thumbnailPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Upload size={18} className="text-ink/20" />
                }
              </div>
              <div>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                  <Upload size={12} /> Görsel yükle
                </button>
                <p className="mono text-xs text-ink/30 mt-1">PNG, JPG · Maks 2MB</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
              </div>
              {!thumbnailPreview && (
                <div className="flex-1">
                  <input className="input text-xs" placeholder="veya URL gir: https://..." value={form.thumbnail_url}
                    onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))} />
                </div>
              )}
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Oluşturuluyor...' : 'Kurs oluştur →'}
          </button>
        </form>
      )}

      {/* Kurs listesi */}
      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map(course => {
            const rating = avgRating(course.course_reviews)
            const students = course.course_enrollments?.length || 0
            const earnings = Math.round(course.price * students * 0.75)
            return (
              <div key={course.id} className="card flex items-start gap-4">
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-brand/10 flex items-center justify-center flex-shrink-0">
                  {course.thumbnail_url
                    ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    : <BookOpen size={20} className="text-brand/40" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-serif font-bold text-ink">{course.title}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="mono text-xs text-ink/35">{course.category}</span>
                        <span className="mono text-xs text-ink/35">{course.level}</span>
                        {rating && (
                          <span className="flex items-center gap-1 text-amber-500">
                            <Star size={11} className="fill-amber-500" />
                            <span className="mono text-xs">{rating}</span>
                          </span>
                        )}
                        <span className="mono text-xs text-ink/35">{students} öğrenci</span>
                        {!course.is_free && <span className="mono text-xs text-green-600">₺{earnings} kazanç</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <Link href={`/kurslar/egitmen/${course.id}/duzenle`}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                        <Edit size={11} /> Düzenle
                      </Link>
                      <button onClick={() => togglePublish(course.id, course.is_published)}
                        className={`flex items-center gap-1 text-xs py-1.5 px-3 rounded-lg border transition-colors ${course.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-neutral-50 text-ink/50 border-neutral-200 hover:border-brand/30'}`}>
                        {course.is_published ? <><Eye size={11} /> Yayında</> : <><EyeOff size={11} /> Yayınla</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
          <BookOpen size={36} className="text-brand/25 mx-auto mb-3" />
          <p className="font-serif text-xl font-bold text-ink mb-1">Henüz kurs yok.</p>
          <p className="text-sm text-ink/45 mb-4">İlk kursunu oluştur, topluluğa öğret ve kazanç elde et.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
            İlk kursu oluştur →
          </button>
        </div>
      )}
    </div>
  )
}