'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp, Trash2, GripVertical } from 'lucide-react'

export default function CourseEditorClient({ course, initialSections }: { course: any; initialSections: any[] }) {
  const supabase = createClient()
  const [sections, setSections] = useState(initialSections)
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [addingSection, setAddingSection] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [newLesson, setNewLesson] = useState<Record<string, any>>({})
  const [addingLesson, setAddingLesson] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="max-w-3xl">
      <Link href="/kurslar/egitmen" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> Eğitmen paneline dön
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">KURS İÇERİĞİ</p>
          <h1 className="font-serif text-2xl font-bold text-ink">{course.title}</h1>
        </div>
        <Link href={`/kurslar/${course.id}`} className="btn-secondary text-xs">Önizle →</Link>
      </div>

      {/* Bölümler */}
      <div className="space-y-3 mb-4">
        {sections.map((section: any) => (
          <div key={section.id} className="card p-0 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
              <GripVertical size={14} className="text-ink/20" />
              <p className="font-medium text-ink text-sm flex-1">{section.title}</p>
              <span className="mono text-xs text-ink/35">{section.lessons?.length || 0} ders</span>
              <button onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}>
                {expandedSection === section.id ? <ChevronUp size={15} className="text-ink/40" /> : <ChevronDown size={15} className="text-ink/40" />}
              </button>
              <button onClick={() => deleteSection(section.id)} className="text-ink/20 hover:text-red-500 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>

            {expandedSection === section.id && (
              <div className="p-4">
                {section.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => (
                  <div key={lesson.id} className="flex items-center gap-3 py-2.5 border-b border-neutral-50 last:border-0">
                    <GripVertical size={12} className="text-ink/15" />
                    <div className="flex-1">
                      <p className="text-sm text-ink/70">{lesson.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {lesson.duration_minutes > 0 && <span className="mono text-xs text-ink/30">{lesson.duration_minutes} dk</span>}
                        {lesson.is_preview && <span className="mono text-xs text-brand">Önizleme</span>}
                        {lesson.video_url && <span className="mono text-xs text-green-600">Video var</span>}
                      </div>
                    </div>
                    <button onClick={() => deleteLesson(section.id, lesson.id)} className="text-ink/20 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                {addingLesson === section.id ? (
                  <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3">
                    <input className="input text-sm" placeholder="Ders başlığı"
                      value={newLesson[section.id]?.title || ''}
                      onChange={e => setNewLesson(prev => ({ ...prev, [section.id]: { ...prev[section.id], title: e.target.value } }))} />
                    <input className="input text-sm" placeholder="YouTube linki veya video URL"
                      value={newLesson[section.id]?.video_url || ''}
                      onChange={e => setNewLesson(prev => ({ ...prev, [section.id]: { ...prev[section.id], video_url: e.target.value } }))} />
                    <textarea className="input text-sm resize-none" rows={3} placeholder="Ders içeriği (opsiyonel)"
                      value={newLesson[section.id]?.content || ''}
                      onChange={e => setNewLesson(prev => ({ ...prev, [section.id]: { ...prev[section.id], content: e.target.value } }))} />
                    <div className="flex items-center gap-4">
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
                        <label htmlFor={`preview-${section.id}`} className="text-xs text-ink/60">Ücretsiz önizleme</label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setAddingLesson(null)} className="btn-secondary flex-1 text-xs">İptal</button>
                      <button type="button" onClick={() => addLesson(section.id)} disabled={loading} className="btn-primary flex-1 text-xs disabled:opacity-60">
                        {loading ? '...' : 'Ders ekle'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingLesson(section.id)}
                    className="mt-3 w-full text-xs text-brand hover:underline flex items-center gap-1.5 justify-center py-2 border border-dashed border-brand/20 rounded-lg hover:border-brand/40 transition-colors">
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
          <input className="input flex-1 text-sm" placeholder="Bölüm başlığı" value={newSectionTitle}
            onChange={e => setNewSectionTitle(e.target.value)} autoFocus />
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