'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Award, CheckCircle, Lock } from 'lucide-react'

type Props = {
  course: any
  studentName: string
  completionDate: string
  isCompleted: boolean
  totalLessons: number
  completedLessons: number
}

export default function SertifikaClient({ course, studentName, completionDate, isCompleted, totalLessons, completedLessons }: Props) {
  const certRef = useRef<HTMLDivElement>(null)

  const date = new Date(completionDate).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  async function handleDownload() {
    const el = certRef.current
    if (!el) return

    // html2canvas'ı script olarak yükle
    if (!(window as any).html2canvas) {
      await new Promise<void>((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    }

    const canvas = await (window as any).html2canvas(el, { scale: 2, backgroundColor: '#fff' })
    const link = document.createElement('a')
    link.download = `${studentName}-${course.title}-sertifika.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/kurslar/${course.id}`}
        className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Kursa dön
      </Link>

      {!isCompleted ? (
        /* Kurs tamamlanmadı */
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-ink/25" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-ink mb-2">Sertifika henüz hazır değil</h2>
          <p className="text-sm text-ink/50 mb-4">
            Tüm dersleri tamamlaman gerekiyor.
          </p>
          <div className="max-w-xs mx-auto mb-6">
            <div className="flex justify-between text-xs text-ink/45 mb-1.5">
              <span>{completedLessons} / {totalLessons} ders</span>
              <span>{totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full transition-all"
                style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }} />
            </div>
          </div>
          <Link href={`/kurslar/${course.id}`} className="btn-primary inline-flex text-sm px-6 py-2">
            Kursa devam et →
          </Link>
        </div>
      ) : (
        /* Sertifika */
        <div>
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3"
              style={{ border: '2px solid rgba(34,197,94,.3)' }}>
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-ink mb-1">Tebrikler! 🎉</h1>
            <p className="text-sm text-ink/50">Sertifikanı indir ve paylaş.</p>
          </div>

          {/* Sertifika */}
          <div ref={certRef} style={{
            background: 'white',
            border: '2px solid #C4500A',
            borderRadius: 16,
            padding: 48,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Dekoratif köşeler */}
            <div style={{ position: 'absolute', top: 12, left: 12, width: 40, height: 40, border: '2px solid rgba(196,80,10,.2)', borderRadius: 4 }} />
            <div style={{ position: 'absolute', top: 12, right: 12, width: 40, height: 40, border: '2px solid rgba(196,80,10,.2)', borderRadius: 4 }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, width: 40, height: 40, border: '2px solid rgba(196,80,10,.2)', borderRadius: 4 }} />
            <div style={{ position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, border: '2px solid rgba(196,80,10,.2)', borderRadius: 4 }} />

            {/* Logo */}
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#1a1a18', letterSpacing: -0.5, marginBottom: 8 }}>
              Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
            </p>

            {/* Rozet */}
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(196,80,10,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Award size={32} color="#C4500A" />
            </div>

            <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
              KATILIM SERTİFİKASI
            </p>

            <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'rgba(26,26,24,.5)', marginBottom: 8 }}>
              Bu belge,
            </p>

            <p style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 800, color: '#1a1a18', letterSpacing: -1, marginBottom: 8 }}>
              {studentName}
            </p>

            <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'rgba(26,26,24,.5)', marginBottom: 12 }}>
              adlı kursiyerin
            </p>

            <div style={{ background: 'rgba(196,80,10,.06)', borderRadius: 8, padding: '12px 24px', display: 'inline-block', marginBottom: 16 }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#C4500A', margin: 0 }}>
                {course.title}
              </p>
            </div>

            <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'rgba(26,26,24,.5)', marginBottom: 24 }}>
              kursunu başarıyla tamamladığını belgelemektedir.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(196,80,10,.15)' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 1, textTransform: 'uppercase' }}>EĞİTMEN</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700, color: '#1a1a18', marginTop: 2 }}>
                  {course.instructor?.full_name}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,26,24,.35)', letterSpacing: 1, textTransform: 'uppercase' }}>TARİH</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700, color: '#1a1a18', marginTop: 2 }}>
                  {date}
                </p>
              </div>
            </div>
          </div>

          {/* İndir butonu */}
          <div className="flex gap-3 mt-6 justify-center">
            <button onClick={handleDownload}
              className="btn-primary flex items-center gap-2 px-6 py-2.5">
              <Download size={15} /> Sertifikayı indir
            </button>
            <Link href={`/kurslar/${course.id}`} className="btn-secondary flex items-center gap-2 px-6 py-2.5">
              Kursa dön
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}