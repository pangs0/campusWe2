'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { BookOpen, Users, Star, TrendingUp, Edit, MapPin } from 'lucide-react'

export default function InstructorProfile({ user, profile, courses, totalStudents, avgRating }: {
  user: any, profile: any, courses: any[], totalStudents: number, avgRating: number
}) {
  const supabase = createClient()
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(profile?.bio || '')
  const [saving, setSaving] = useState(false)

  const publishedCourses = courses.filter(c => c.is_published)
  const totalEarnings = courses.reduce((sum, c) => {
    if (c.is_free || !c.price) return sum
    return sum + ((c.course_enrollments?.length || 0) * c.price * 0.75)
  }, 0)

  async function saveBio() {
    setSaving(true)
    await supabase.from('profiles').update({ bio }).eq('id', user.id)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profil kartı — mobilde dikey */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-brand/10 flex items-center justify-center flex-shrink-0">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              : <span className="font-serif text-2xl sm:text-3xl font-bold text-brand">{profile?.full_name?.[0]}</span>
            }
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-ink">{profile?.full_name}</h1>
                <p className="mono text-xs text-ink/40 mt-0.5">@{profile?.username}</p>
                {profile?.university && (
                  <p className="text-sm text-ink/50 mt-1 flex items-center gap-1">
                    <MapPin size={12} /> {profile.university}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <span className="mono text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-1">Eğitmen</span>
                <Link href="/kurslar/egitmen" className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1">
                  <BookOpen size={11} /> Panel
                </Link>
              </div>
            </div>
            <div className="mt-3">
              {editing ? (
                <div className="space-y-2">
                  <textarea className="input resize-none text-sm w-full" rows={3}
                    value={bio} onChange={e => setBio(e.target.value)} placeholder="Kendini tanıt..." />
                  <div className="flex gap-2">
                    <button onClick={saveBio} disabled={saving} className="btn-primary text-xs px-4 py-1.5">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                    <button onClick={() => setEditing(false)} className="btn-secondary text-xs px-4 py-1.5">İptal</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <p className="text-sm text-ink/60 leading-relaxed flex-1">{profile?.bio || 'Henüz bir bio eklenmemiş.'}</p>
                  <button onClick={() => setEditing(true)} className="text-ink/30 hover:text-brand flex-shrink-0"><Edit size={14} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* İstatistikler — mobilde 2 kolon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { icon: BookOpen, label: 'Yayında Kurs', value: publishedCourses.length, color: 'text-brand', bg: 'bg-brand/8' },
          { icon: Users, label: 'Öğrenci', value: totalStudents, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Star, label: 'Ort. Puan', value: avgRating > 0 ? `${avgRating}/5` : '—', color: 'text-amber-500', bg: 'bg-amber-50' },
          { icon: TrendingUp, label: 'Kazanç', value: `₺${Math.round(totalEarnings).toLocaleString('tr-TR')}`, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((s, i) => (
          <div key={i} className="card flex items-center gap-2 md:gap-3 p-3">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={15} className={s.color} />
            </div>
            <div className="min-w-0">
              <p className={`font-serif text-base md:text-xl font-bold ${s.color} truncate`}>{s.value}</p>
              <p className="mono text-xs text-ink/35 truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kurslar */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="mono text-xs text-ink/35 tracking-widest">KURSLARIM ({publishedCourses.length})</p>
          <Link href="/kurslar/egitmen/yeni" className="btn-primary text-xs px-3 py-1.5">+ Yeni Kurs</Link>
        </div>
        {publishedCourses.length > 0 ? (
          <div className="space-y-3">
            {publishedCourses.map((c: any) => {
              const students = c.course_enrollments?.length || 0
              const reviews = c.course_reviews || []
              const rating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null
              return (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/50 hover:bg-brand/3 transition-colors">
                  <div className="w-12 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden bg-brand/8 flex items-center justify-center flex-shrink-0">
                    {c.thumbnail_url ? <img src={c.thumbnail_url} alt="" className="w-full h-full object-cover" /> : <BookOpen size={14} className="text-brand/30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="mono text-xs text-ink/35 flex items-center gap-1"><Users size={10} /> {students}</span>
                      {rating && <span className="mono text-xs text-amber-500 flex items-center gap-1"><Star size={10} className="fill-amber-400" /> {rating}</span>}
                      <span className="mono text-xs text-ink/30">{c.is_free ? 'Ücretsiz' : `₺${c.price}`}</span>
                    </div>
                  </div>
                  <Link href={`/kurslar/egitmen/${c.id}/duzenle`} className="btn-secondary text-xs px-2.5 py-1.5 flex-shrink-0">Düzenle</Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-neutral-200 rounded-xl">
            <BookOpen size={32} className="text-ink/15 mx-auto mb-3" />
            <p className="text-sm text-ink/35 mb-3">Henüz yayında kurs yok.</p>
            <Link href="/kurslar/egitmen/yeni" className="btn-primary text-sm px-6">İlk kursunu oluştur</Link>
          </div>
        )}
      </div>
    </div>
  )
}