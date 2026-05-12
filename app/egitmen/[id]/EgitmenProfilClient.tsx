'use client'

import Link from 'next/link'
import { BookOpen, Users, Star, Globe, Linkedin, Award, TrendingUp } from 'lucide-react'

type Props = {
  instructor: any
  courses: any[]
  totalStudents: number
  avgRating: number
  totalReviews: number
  isOwn: boolean
}

function getCourseRating(reviews: any[]) {
  if (!reviews?.length) return null
  return (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
}

export default function EgitmenProfilClient({ instructor, courses, totalStudents, avgRating, totalReviews, isOwn }: Props) {
  return (
    <div>
      {/* Kapak */}
      <div style={{ height: 140, background: 'linear-gradient(135deg, #1a1a18 0%, #2a1a10 100%)', borderRadius: '12px 12px 0 0', marginBottom: -60, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(196,80,10,.06) 35px, rgba(196,80,10,.06) 70px)', borderRadius: '12px 12px 0 0' }} />
        {isOwn && (
          <Link href="/kurslar/egitmen" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>
            Eğitmen paneli →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sol kolon */}
        <div className="col-span-1 space-y-4">
          <div className="card" style={{ paddingTop: 72 }}>
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-3xl mb-4 border-4 border-white shadow-sm" style={{ marginTop: -60 }}>
              {instructor.avatar_url
                ? <img src={instructor.avatar_url} alt="" className="w-full h-full object-cover" />
                : instructor.full_name?.[0]
              }
            </div>
            <h1 className="font-serif text-xl font-bold text-ink">{instructor.full_name}</h1>
            {instructor.university && (
              <p className="text-sm text-ink/45 mt-0.5">{instructor.university}</p>
            )}
            <div className="flex items-center gap-1.5 mt-2">
              <Award size={13} className="text-brand" />
              <span className="mono text-xs text-brand">Eğitmen</span>
            </div>

            {/* Sosyal linkler */}
            <div className="flex gap-2 mt-3">
              {instructor.linkedin_url && (
                <a href={instructor.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="text-ink/30 hover:text-brand transition-colors">
                  <Linkedin size={16} />
                </a>
              )}
              {instructor.youtube_url && (
                <a href={instructor.youtube_url} target="_blank" rel="noopener noreferrer"
                  className="text-ink/30 hover:text-brand transition-colors">
                  <Globe size={16} />
                </a>
              )}
              {instructor.website_url && (
                <a href={instructor.website_url} target="_blank" rel="noopener noreferrer"
                  className="text-ink/30 hover:text-brand transition-colors">
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>

          {/* İstatistikler */}
          <div className="card">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">İSTATİSTİKLER</p>
            <div className="space-y-3">
              {[
                { icon: BookOpen, label: 'Kurs', value: courses.length, color: 'text-brand' },
                { icon: Users, label: 'Öğrenci', value: totalStudents, color: 'text-blue-600' },
                { icon: Star, label: 'Ortalama puan', value: avgRating > 0 ? `${avgRating} / 5` : '—', color: 'text-amber-500' },
                { icon: TrendingUp, label: 'Değerlendirme', value: totalReviews, color: 'text-green-600' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <s.icon size={13} className={s.color} />
                    <span className="text-sm text-ink/55">{s.label}</span>
                  </div>
                  <span className={`font-serif font-bold text-sm ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hakkında */}
          {instructor.bio && (
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-2">HAKKINDA</p>
              <p className="text-sm text-ink/60 leading-relaxed">{instructor.bio}</p>
            </div>
          )}

          {/* Yetenekler */}
          {instructor.user_skills?.length > 0 && (
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-2">UZMANLIK ALANLARI</p>
              <div className="flex flex-wrap gap-1.5">
                {instructor.user_skills.map((s: any, i: number) => (
                  <span key={i} className="mono text-xs bg-neutral-100 text-ink/60 border border-neutral-200 rounded px-2 py-0.5">
                    {s.skill_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ kolon — kurslar */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl font-bold text-ink">Kurslar</h2>
            <span className="mono text-xs text-ink/35">{courses.length} kurs</span>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {courses.map(course => {
                const rating = getCourseRating(course.course_reviews)
                const students = course.course_enrollments?.length || 0
                return (
                  <Link key={course.id} href={`/kurslar/${course.id}`}
                    className="card hover:border-brand/25 transition-colors group block">
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-brand/8 flex items-center justify-center mb-3">
                      {course.thumbnail_url
                        ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        : <BookOpen size={28} className="text-brand/30" />
                      }
                    </div>

                    <div className="flex items-start justify-between mb-1">
                      <span className="mono text-xs bg-neutral-100 text-ink/50 border border-neutral-200 rounded px-1.5 py-0.5">
                        {course.category}
                      </span>
                      <span className="mono text-xs font-bold text-brand">
                        {course.is_free ? 'Ücretsiz' : `₺${course.price}`}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-ink text-sm mt-2 group-hover:text-brand transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-ink/40">
                        <Users size={11} /> {students}
                      </span>
                      {rating && (
                        <span className="flex items-center gap-1 text-xs text-amber-500">
                          <Star size={11} className="fill-amber-500" /> {rating}
                        </span>
                      )}
                      <span className="mono text-xs text-ink/30">{course.level}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
              <BookOpen size={32} className="text-ink/15 mx-auto mb-3" />
              <p className="text-sm text-ink/35">Henüz yayınlanmış kurs yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}