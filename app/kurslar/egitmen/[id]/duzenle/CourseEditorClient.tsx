'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp, Trash2, GripVertical, Upload, Youtube, Video, Check, Eye, EyeOff } from 'lucide-react'

type VideoSource = 'url' | 'upload'

export default function CourseEditorClient({ course, initialSections }: { course: any; initialSections: any[] }) {
  const supabase = createClient()
  const [sections, setSections] = useState(initialSections)
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [addingSection, setAddingSection] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [newLesson, setNewLesson] = useState<Record<string, any>>({})
  const [addingLesson, setAddingLesson] = useState<string | null>(null)
  const [videoSource, setVideoSource] = useState<Record<string, VideoSource>>({})
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const videoRefs = useRef<Record<string, HTMLInputElement>>({})

  function getYoutubeId(url: string) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    return match?.[1] || null
  }

  function getVimeoId(url: string) {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match?.[1] || null
  }

  async function handleVideoUpload(sectionId: string, file: File) {
    if (file.size > 500 * 1024 * 1024) {
      alert('Video 500MB\'dan küçük olmalı.')
      return
    }
    setUploading(prev => ({ ...prev, [sectionId]: true }))
    setUploadProgress(prev => ({ ...prev, [sectionId]: 0 }))

    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const path = `${course.id}/${sectionId}/${Date.now()}-${cleanName}`

    const { error } = await supabase.storage.from('course-videos').upload(path, file, {
      upsert: true,
      contentType: file.type,
    })

    if (error) {
      alert('Video yüklenemedi: ' + error.message)
      setUploading(prev => ({ ...prev, [sectionId]: false }))
      return
    }

    const { data: urlData } = supabase.storage.from('course-videos').getPublicUrl(path)
    setNewLesson(prev => ({ ...prev, [sectionId]: { ...prev[sectionId], video_url: urlData.publicUrl, video_type: 'upload' } }))
    setUploading(prev => ({ ...prev, [sectionId]: false }))
    setUploadProgress(prev => ({ ...prev, [sectionId]: 100 }))
  }

  async function addSection(e: React.FormEvent) {
    e.preventDefault()
    if (!newSectionTitle.trim()) return
    const { data } = await supabase.from('course_sections').insert({
      course_id: course.id,
      title: newSectionTitle,
      order_index: sections.length,
    }).select().single()
    if (data) setSections(prev => [...prev, { ...data, lessons: [] }])
    setNewSectionTitle('')
    setAddingSection(false)
    setExpandedSection(data?.id || null)
  }

  async function deleteSection(id: string) {
    if (!confirm('Bu bölümü ve içindeki tüm dersleri silmek istediğine emin misin?')) return
    await supabase.from('course_sections').delete().eq('id', id)
    setSections(prev => prev.filter(s => s.id !== id))
  }

  async function addLesson(sectionId: string) {
    const form = newLesson[sectionId]
    if (!form?.title?.trim()) return
    setLoading(true)
    const section = sections.find(s => s.id === sectionId)
    const { data } = await supabase.from('course_lessons').insert({
      course_id: course.id,
      section_id: sectionId,
      title: form.title,
      content: form.content || '',
      video_url: form.video_url || '',
      video_type: form.video_type || 'url',
      duration_minutes: parseInt(form.duration_minutes) || 0,
      is_preview: form.is_preview || false,
      order_index: section?.lessons?.length || 0,
    }).select().single()
    if (data) {
      setSections(prev => prev.map(s => s.id === sectionId
        ? { ...s, lessons: [...(s.lessons || []), data] }
        : s
      ))
    }
    setNewLesson(prev => ({ ...prev, [sectionId]: {} }))
    setVideoSource(prev => ({ ...prev, [sectionId]: 'url' }))
    setAddingLesson(null)
    setLoading(false)
  }

  async function deleteLesson(sectionId: string, lessonId: string) {
    await supabase.from('course_lessons').delete().eq('id', lessonId)
    setSections(prev => prev.map(s => s.id === sectionId
      ? { ...s, lessons: s.lessons.filter((l: any) => l.id !== lessonId) }
      : s
    ))
  }

  async function togglePublish() {
    await supabase.from('courses').update({ is_published: !course.is_published }).eq('id', course.id)
    course.is_published = !course.is_published
    window.location.reload()
  }

  const totalLessons = sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0)
  const totalDuration = sections.reduce((sum, s) => sum + s.lessons?.reduce((ls: number, l: any) => ls + (l.duration_minutes || 0), 0), 0)

  return (
    <div className="max-w-3xl">
      <Link href="/kurslar/egitmen" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> Eğitmen paneline dön
      </Link>

      {/* Başlık */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">KURS İÇERİĞİ</p>
          <h1 className="font-serif text-2xl font-bold text-ink">{course.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="mono text-xs text-ink/35">{totalLessons} ders</span>
            <span className="text-ink/20">·</span>
            <span className="mono text-xs text-ink/35">{totalDuration} dk</span>
            <span className="text-ink/20">·</span>
            <span className={`mono text-xs ${course.is_published ? 'text-green-600' : 'text-amber-600'}`}>
              {course.is_published ? '● Yayında' : '○ Taslak'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/kurslar/${course.id}`} className="btn-secondary text-xs flex items-center gap-1.5">
            <Eye size={12} /> Önizle
          </Link>
          <button onClick={togglePublish}
            className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              course.is_published
                ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
            }`}>
            {course.is_published ? <><EyeOff size={12} /> Yayından Kaldır</> : <><Eye size={12} /> Yayınla</>}
          </button>
        </div>
      </div>

      {/* Bölümler */}
      <div className="space-y-3 mb-4">
        {sections.map((section: any) => (
          <div key={section.id} className="card p-0 overflow-hidden">
            {/* Bölüm başlığı */}
            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
              <GripVertical size={14} className="text-ink/20" />
              <p className="font-medium text-ink text-sm flex-1">{section.title}</p>
              <span className="mono text-xs text-ink/35">{section.lessons?.length || 0} ders</span>
              <button onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}>
                {expandedSection === section.id
                  ? <ChevronUp size={15} className="text-ink/40" />
                  : <ChevronDown size={15} className="text-ink/40" />
                }
              </button>
              <button onClick={() => deleteSection(section.id)} className="text-ink/20 hover:text-red-500 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>

            {expandedSection === section.id && (
              <div className="p-4">
                {/* Ders listesi */}
                {section.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => (
                  <div key={lesson.id} className="flex items-center gap-3 py-2.5 border-b border-neutral-50 last:border-0">
                    <GripVertical size={12} className="text-ink/15" />
                    <div className="flex-1">
                      <p className="text-sm text-ink/70">{lesson.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {lesson.duration_minutes > 0 && (
                          <span className="mono text-xs text-ink/30">{lesson.duration_minutes} dk</span>
                        )}
                        {lesson.is_preview && (
                          <span className="mono text-xs text-brand bg-brand/8 px-1.5 py-0.5 rounded">Ücretsiz önizleme</span>
                        )}
                        {lesson.video_url && (
                          <span className={`mono text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${
                            lesson.video_type === 'upload' ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50'
                          }`}>
                            {lesson.video_type === 'upload' ? <><Upload size={9} /> Yüklenmiş</> : <><Youtube size={9} /> YouTube</>}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => deleteLesson(section.id, lesson.id)} className="text-ink/20 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                {/* Ders ekle formu */}
                {addingLesson === section.id ? (
                  <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3">
                    <input className="input text-sm" placeholder="Ders başlığı *"
                      value={newLesson[section.id]?.title || ''}
                      onChange={e => setNewLesson(prev => ({ ...prev, [section.id]: { ...prev[section.id], title: e.target.value } }))} />

                    {/* Video kaynak seçimi */}
                    <div>
                      <label className="label mb-2">Video Kaynağı</label>
                      <div className="flex gap-2 mb-3">
                        {[
                          { key: 'url', icon: Youtube, label: 'YouTube / Vimeo URL' },
                          { key: 'upload', icon: Upload, label: 'Video Yükle' },
                        ].map(opt => (
                          <button key={opt.key} type="button"
                            onClick={() => setVideoSource(prev => ({ ...prev, [section.id]: opt.key as VideoSource }))}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs flex-1 justify-center transition-colors ${
                              (videoSource[section.id] || 'url') === opt.key
                                ? 'border-brand/40 bg-brand/5 text-brand font-medium'
                                : 'border-neutral-200 text-ink/50 hover:border-neutral-300'
                            }`}>
                            <opt.icon size={13} /> {opt.label}
                          </button>
                        ))}
                      </div>

                      {/* URL girişi */}
                      {(videoSource[section.id] || 'url') === 'url' && (
                        <div>
                          <input className="input text-sm"
                            placeholder="https://youtube.com/watch?v=... veya https://vimeo.com/..."
                            value={newLesson[section.id]?.video_url || ''}
                            onChange={e => setNewLesson(prev => ({ ...prev, [section.id]: { ...prev[section.id], video_url: e.target.value, video_type: 'url' } }))} />

                          {/* Önizleme */}
                          {newLesson[section.id]?.video_url && (() => {
                            const url = newLesson[section.id].video_url
                            const ytId = getYoutubeId(url)
                            const vimeoId = getVimeoId(url)
                            if (ytId) return (
                              <div className="mt-2 rounded-lg overflow-hidden border border-neutral-200" style={{ aspectRatio: '16/9' }}>
                                <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full" allowFullScreen title="YouTube önizleme" />
                              </div>
                            )
                            if (vimeoId) return (
                              <div className="mt-2 rounded-lg overflow-hidden border border-neutral-200" style={{ aspectRatio: '16/9' }}>
                                <iframe src={`https://player.vimeo.com/video/${vimeoId}`} className="w-full h-full" allowFullScreen title="Vimeo önizleme" />
                              </div>
                            )
                            if (url.length > 10) return <p className="mono text-xs text-red-500 mt-1">⚠️ Geçerli bir YouTube veya Vimeo linki değil</p>
                            return null
                          })()}

                          <p className="mono text-xs text-ink/30 mt-1.5">
                            💡 YouTube videonu "Listelenmemiş" yaparak sadece bu kurs üzerinden izlenebilir hale getirebilirsin.
                          </p>
                        </div>
                      )}

                      {/* Video yükleme */}
                      {videoSource[section.id] === 'upload' && (
                        <div>
                          {newLesson[section.id]?.video_url && newLesson[section.id]?.video_type === 'upload' ? (
                            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Check size={14} className="text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-green-700">Video yüklendi!</p>
                                <p className="mono text-xs text-green-600/60">Platforma yüklendi</p>
                              </div>
                              <button type="button" onClick={() => setNewLesson(prev => ({ ...prev, [section.id]: { ...prev[section.id], video_url: '', video_type: 'url' } }))}
                                className="text-green-600/50 hover:text-red-500 transition-colors">
                                <X size={14} />
                              </button>
                            </div>
                          ) : uploading[section.id] ? (
                            <div className="p-4 border border-neutral-200 rounded-xl">
                              <p className="text-sm text-ink/60 mb-2">Video yükleniyor...</p>
                              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full bg-brand rounded-full animate-pulse" style={{ width: '60%' }} />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div onClick={() => videoRefs.current[section.id]?.click()}
                                className="border-2 border-dashed border-neutral-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-brand/30 hover:bg-brand/2 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-brand/8 flex items-center justify-center">
                                  <Video size={20} className="text-brand/50" />
                                </div>
                                <p className="text-sm text-ink/50">Video dosyası seç</p>
                                <p className="mono text-xs text-ink/25">MP4, MOV, AVI · Maks. 500MB</p>
                              </div>
                              <input
                                ref={el => { if (el) videoRefs.current[section.id] = el }}
                                type="file" accept="video/*" className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0]
                                  if (file) handleVideoUpload(section.id, file)
                                }}
                              />
                              <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <p className="mono text-xs text-amber-700">
                                  ⚠️ Büyük videolar için YouTube "Listelenmemiş" seçeneği daha hızlıdır. Video yükleme 500MB ile sınırlıdır.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <textarea className="input text-sm resize-none" rows={3} placeholder="Ders açıklaması (opsiyonel)"
                      value={newLesson[section.id]?.content || ''}
                      onChange={e => setNewLesson(prev => ({ ...prev, [section.id]: { ...prev[section.id], content: e.target.value } }))} />

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <input type="number" className="input text-sm w-20" placeholder="Dk"
                          value={newLesson[section.id]?.duration_minutes || ''}
                          onChange={e => setNewLesson(prev => ({ ...prev, [section.id]: { ...prev[section.id], duration_minutes: e.target.value } }))} />
                        <span className="text-xs text-ink/40">dakika</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id={`preview-${section.id}`}
                          checked={newLesson[section.id]?.is_preview || false}
                          onChange={e => setNewLesson(prev => ({ ...prev, [section.id]: { ...prev[section.id], is_preview: e.target.checked } }))}
                          className="accent-brand w-4 h-4" />
                        <label htmlFor={`preview-${section.id}`} className="text-xs text-ink/60 cursor-pointer">Ücretsiz önizleme</label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setAddingLesson(null); setVideoSource(prev => ({ ...prev, [section.id]: 'url' })) }}
                        className="btn-secondary flex-1 text-xs">İptal</button>
                      <button type="button" onClick={() => addLesson(section.id)}
                        disabled={loading || uploading[section.id]}
                        className="btn-primary flex-1 text-xs disabled:opacity-60">
                        {loading ? 'Kaydediliyor...' : 'Ders ekle'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setAddingLesson(section.id); setVideoSource(prev => ({ ...prev, [section.id]: 'url' })) }}
                    className="mt-3 w-full text-xs text-brand hover:underline flex items-center gap-1.5 justify-center py-2.5 border border-dashed border-brand/20 rounded-lg hover:border-brand/40 transition-colors">
                    <Plus size={12} /> Ders ekle
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bölüm ekle */}
      {addingSection ? (
        <form onSubmit={addSection} className="flex gap-2">
          <input className="input flex-1 text-sm" placeholder="Bölüm başlığı (örn: Giriş, React Temelleri)"
            value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} autoFocus />
          <button type="submit" className="btn-primary text-xs px-4">Ekle</button>
          <button type="button" onClick={() => setAddingSection(false)} className="btn-secondary px-3"><X size={14} /></button>
        </form>
      ) : (
        <button onClick={() => setAddingSection(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-neutral-200 rounded-xl text-sm text-ink/45 hover:border-brand/30 hover:text-brand transition-colors">
          <Plus size={15} /> Bölüm ekle
        </button>
      )}
    </div>
  )
}