'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Video, CheckSquare, FileText, Folder,
  Plus, X, ArrowLeft, ExternalLink, Trash2,
  Calendar, User, Flag, Upload, Download
} from 'lucide-react'

type Props = {
  startup: any
  members: any[]
  meetings: any[]
  tasks: any[]
  notes: any[]
  files: any[]
  currentUserId: string
  isMember: boolean
}

const TABS = [
  { key: 'meetings', label: 'Toplantılar', icon: Video },
  { key: 'tasks', label: 'Görevler', icon: CheckSquare },
  { key: 'notes', label: 'Notlar', icon: FileText },
  { key: 'files', label: 'Dosyalar', icon: Folder },
]

export default function WorkspaceClient({ startup, members, meetings: initialMeetings, tasks: initialTasks, notes: initialNotes, files: initialFiles, currentUserId, isMember }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('meetings')
  const [meetings, setMeetings] = useState(initialMeetings)
  const [tasks, setTasks] = useState(initialTasks)
  const [notes, setNotes] = useState(initialNotes)
  const [files, setFiles] = useState(initialFiles)
  const fileRef = useRef<HTMLInputElement>(null)

  // Meeting state
  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [meetingForm, setMeetingForm] = useState({ title: '', scheduled_at: '', meet_link: '' })
  const [meetingLoading, setMeetingLoading] = useState(false)

  // Task state
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'orta', assigned_to: '', due_date: '' })
  const [taskLoading, setTaskLoading] = useState(false)

  // Note state
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [noteForm, setNoteForm] = useState({ title: '', content: '' })
  const [noteLoading, setNoteLoading] = useState(false)
  const [editingNote, setEditingNote] = useState<any>(null)

  // File state
  const [uploading, setUploading] = useState(false)

  function generateMeetLink() {
    const code = Math.random().toString(36).substring(2, 8)
    return `https://meet.google.com/${code}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`
  }

  async function createMeeting(e: React.FormEvent) {
    e.preventDefault()
    setMeetingLoading(true)
    const link = meetingForm.meet_link || generateMeetLink()
    const { data } = await supabase.from('meetings').insert({
      startup_id: startup.id,
      created_by: currentUserId,
      title: meetingForm.title,
      meet_link: link,
      scheduled_at: meetingForm.scheduled_at || null,
      status: 'planlandı',
    }).select('*, creator:profiles(full_name, avatar_url)').single()
    if (data) setMeetings(prev => [data, ...prev])
    setMeetingForm({ title: '', scheduled_at: '', meet_link: '' })
    setShowMeetingForm(false)
    setMeetingLoading(false)

    // Ekip üyelerine bildirim
    const otherMembers = members.filter(m => m.profile?.id !== currentUserId)
    for (const m of otherMembers) {
      await supabase.from('notifications').insert({
        user_id: m.profile.id,
        sender_id: currentUserId,
        type: 'message',
        content: `${startup.name} için yeni toplantı: "${meetingForm.title}"`,
        link: `/workspace/${startup.slug}`,
      })
    }
  }

  async function deleteMeeting(id: string) {
    await supabase.from('meetings').delete().eq('id', id)
    setMeetings(prev => prev.filter(m => m.id !== id))
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    setTaskLoading(true)
    const { data, error } = await supabase.from('tasks').insert({
      startup_id: startup.id,
      created_by: currentUserId,
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      assigned_to: taskForm.assigned_to || null,
      due_date: taskForm.due_date || null,
      status: 'yapılacak',
    }).select().single()
    if (data) setTasks(prev => [data, ...prev])
    setTaskForm({ title: '', description: '', priority: 'orta', assigned_to: '', due_date: '' })
    setShowTaskForm(false)
    setTaskLoading(false)
  }

  async function updateTaskStatus(id: string, status: string) {
    await supabase.from('tasks').update({ status }).eq('id', id)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  async function saveNote(e: React.FormEvent) {
    e.preventDefault()
    setNoteLoading(true)
    if (editingNote) {
      await supabase.from('notes').update({ title: noteForm.title, content: noteForm.content, updated_at: new Date().toISOString() }).eq('id', editingNote.id)
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...noteForm } : n))
      setEditingNote(null)
    } else {
      const { data } = await supabase.from('notes').insert({
        startup_id: startup.id,
        created_by: currentUserId,
        title: noteForm.title,
        content: noteForm.content,
      }).select('*, creator:profiles(full_name, avatar_url)').single()
      if (data) setNotes(prev => [data, ...prev])
    }
    setNoteForm({ title: '', content: '' })
    setShowNoteForm(false)
    setNoteLoading(false)
  }

  async function deleteNote(id: string) {
    await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    
    // Dosya adını temizle — özel karakter ve boşlukları kaldır
    const cleanName = file.name
      .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
      .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
      .replace(/[Ğ]/g, 'G').replace(/[Ü]/g, 'U').replace(/[Ş]/g, 'S')
      .replace(/[İ]/g, 'I').replace(/[Ö]/g, 'O').replace(/[Ç]/g, 'C')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
    
    const path = `${startup.id}/${Date.now()}-${cleanName}`
    const { error: uploadError } = await supabase.storage.from('startup-files').upload(path, file)
    if (uploadError) {
      console.error('Dosya yükleme hatası:', uploadError.message)
      alert('Dosya yüklenemedi: ' + uploadError.message)
      setUploading(false)
      return
    }
    const { data: urlData } = supabase.storage.from('startup-files').getPublicUrl(path)
    const { data } = await supabase.from('startup_files').insert({
      startup_id: startup.id,
      uploaded_by: currentUserId,
      name: file.name,
      file_url: urlData.publicUrl,
      file_size: file.size,
      file_type: file.type,
    }).select().single()
    if (data) setFiles(prev => [data, ...prev])
    setUploading(false)
  }

  async function deleteFile(id: string) {
    await supabase.from('startup_files').delete().eq('id', id)
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const priorityColors: Record<string, string> = {
    düşük: 'bg-green-50 text-green-700 border-green-200',
    orta: 'bg-amber-50 text-amber-700 border-amber-200',
    yüksek: 'bg-red-50 text-red-600 border-red-200',
  }

  const tasksByStatus = {
    yapılacak: tasks.filter(t => t.status === 'yapılacak'),
    devam: tasks.filter(t => t.status === 'devam'),
    tamamlandı: tasks.filter(t => t.status === 'tamamlandı'),
  }

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/startup/${startup.slug}`} className="text-ink/40 hover:text-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest">ÇALIŞMA ALANI</p>
          <h1 className="font-serif text-2xl font-bold text-ink">{startup.name}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {members.slice(0, 4).map((m: any) => (
            <div key={m.id} className="w-7 h-7 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-xs -ml-1 first:ml-0 border border-white">
              {m.profile?.avatar_url ? <img src={m.profile.avatar_url} alt="" className="w-full h-full object-cover" /> : m.profile?.full_name?.[0]}
            </div>
          ))}
          {members.length > 4 && <span className="mono text-xs text-ink/35">+{members.length - 4}</span>}
        </div>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-1 mb-6 border-b border-neutral-200">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.key ? 'border-brand text-brand' : 'border-transparent text-ink/45 hover:text-ink'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toplantılar */}
      {activeTab === 'meetings' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-bold text-ink">Toplantılar</h2>
            {isMember && (
              <button onClick={() => setShowMeetingForm(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <Plus size={13} /> Toplantı oluştur
              </button>
            )}
          </div>

          {showMeetingForm && (
            <form onSubmit={createMeeting} className="card mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink text-sm">Yeni toplantı</p>
                <button type="button" onClick={() => setShowMeetingForm(false)}><X size={15} className="text-ink/40" /></button>
              </div>
              <input className="input" placeholder="Toplantı başlığı" value={meetingForm.title} onChange={e => setMeetingForm(p => ({ ...p, title: e.target.value }))} required />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tarih ve saat</label>
                  <input type="datetime-local" className="input" value={meetingForm.scheduled_at} onChange={e => setMeetingForm(p => ({ ...p, scheduled_at: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Meet linki (opsiyonel)</label>
                  <input className="input" placeholder="Boş bırakırsan otomatik oluşturulur" value={meetingForm.meet_link} onChange={e => setMeetingForm(p => ({ ...p, meet_link: e.target.value }))} />
                </div>
              </div>
              <button type="submit" disabled={meetingLoading} className="btn-primary w-full justify-center text-sm disabled:opacity-60">
                {meetingLoading ? 'Oluşturuluyor...' : 'Toplantı oluştur →'}
              </button>
            </form>
          )}

          {meetings.length > 0 ? (
            <div className="space-y-3">
              {meetings.map((m: any) => (
                <div key={m.id} className="card flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <Video size={18} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink">{m.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {m.scheduled_at && (
                        <span className="flex items-center gap-1 text-xs text-ink/45">
                          <Calendar size={11} />
                          {formatDate(m.scheduled_at)}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-ink/45">
                        <User size={11} />
                        {m.creator?.full_name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={m.meet_link} target="_blank" rel="noopener noreferrer"
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                      <Video size={12} /> Katıl
                    </a>
                    {m.created_by === currentUserId && (
                      <button onClick={() => deleteMeeting(m.id)} className="text-ink/25 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
              <Video size={32} className="text-brand/25 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink mb-1">Henüz toplantı yok.</p>
              <p className="text-sm text-ink/45">Bir toplantı oluştur, ekip üyelerine bildirim gider.</p>
            </div>
          )}
        </div>
      )}

      {/* Görevler — Kanban */}
      {activeTab === 'tasks' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-bold text-ink">Görevler</h2>
            {isMember && (
              <button onClick={() => setShowTaskForm(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <Plus size={13} /> Görev ekle
              </button>
            )}
          </div>

          {showTaskForm && (
            <form onSubmit={createTask} className="card mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink text-sm">Yeni görev</p>
                <button type="button" onClick={() => setShowTaskForm(false)}><X size={15} className="text-ink/40" /></button>
              </div>
              <input className="input" placeholder="Görev başlığı" value={taskForm.title} onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))} required />
              <textarea className="input resize-none" rows={2} placeholder="Açıklama (opsiyonel)" value={taskForm.description} onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))} />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Öncelik</label>
                  <select className="input" value={taskForm.priority} onChange={e => setTaskForm(p => ({ ...p, priority: e.target.value }))}>
                    <option value="düşük">Düşük</option>
                    <option value="orta">Orta</option>
                    <option value="yüksek">Yüksek</option>
                  </select>
                </div>
                <div>
                  <label className="label">Atanan</label>
                  <select className="input" value={taskForm.assigned_to} onChange={e => setTaskForm(p => ({ ...p, assigned_to: e.target.value }))}>
                    <option value="">Seç</option>
                    {members.map((m: any) => <option key={m.profile?.id} value={m.profile?.id}>{m.profile?.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Son tarih</label>
                  <input type="date" className="input" value={taskForm.due_date} onChange={e => setTaskForm(p => ({ ...p, due_date: e.target.value }))} />
                </div>
              </div>
              <button type="submit" disabled={taskLoading} className="btn-primary w-full justify-center text-sm disabled:opacity-60">
                {taskLoading ? 'Ekleniyor...' : 'Görev ekle →'}
              </button>
            </form>
          )}

          <div className="grid grid-cols-3 gap-4">
            {(['yapılacak', 'devam', 'tamamlandı'] as const).map(status => (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${status === 'yapılacak' ? 'bg-neutral-400' : status === 'devam' ? 'bg-amber-500' : 'bg-green-500'}`} />
                  <p className="font-medium text-ink text-sm capitalize">{status}</p>
                  <span className="mono text-xs text-ink/30">({tasksByStatus[status].length})</span>
                </div>
                <div className="space-y-2">
                  {tasksByStatus[status].map((t: any) => (
                    <div key={t.id} className="card p-3 hover:border-brand/20 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium text-ink line-clamp-2">{t.title}</p>
                        {t.created_by === currentUserId && (
                          <button onClick={() => deleteTask(t.id)} className="text-ink/20 hover:text-red-500 transition-colors flex-shrink-0">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      {t.description && <p className="text-xs text-ink/45 mb-2 line-clamp-2">{t.description}</p>}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`mono text-xs border rounded px-1.5 py-0.5 ${priorityColors[t.priority]}`}>
                          {t.priority}
                        </span>
                        {t.assignee && (
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center text-xs font-bold text-brand">
                              {t.assignee?.avatar_url ? <img src={t.assignee.avatar_url} alt="" className="w-full h-full object-cover" /> : t.assignee?.full_name?.[0]}
                            </div>
                            <span className="text-xs text-ink/40">{t.assignee?.full_name}</span>
                          </div>
                        )}
                        {t.due_date && (
                          <span className="text-xs text-ink/35">{new Date(t.due_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                        )}
                      </div>
                      {isMember && (
                        <select
                          value={t.status}
                          onChange={e => updateTaskStatus(t.id, e.target.value)}
                          className="w-full mt-2 text-xs border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-brand text-ink/60"
                        >
                          <option value="yapılacak">Yapılacak</option>
                          <option value="devam">Devam ediyor</option>
                          <option value="tamamlandı">Tamamlandı</option>
                        </select>
                      )}
                    </div>
                  ))}
                  {tasksByStatus[status].length === 0 && (
                    <div className="text-center py-6 border border-dashed border-neutral-200 rounded-xl">
                      <p className="text-xs text-ink/25">Görev yok</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notlar */}
      {activeTab === 'notes' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-bold text-ink">Notlar</h2>
            {isMember && (
              <button onClick={() => { setShowNoteForm(true); setEditingNote(null); setNoteForm({ title: '', content: '' }) }}
                className="btn-primary text-xs flex items-center gap-1.5">
                <Plus size={13} /> Not ekle
              </button>
            )}
          </div>

          {showNoteForm && (
            <form onSubmit={saveNote} className="card mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink text-sm">{editingNote ? 'Notu düzenle' : 'Yeni not'}</p>
                <button type="button" onClick={() => { setShowNoteForm(false); setEditingNote(null) }}><X size={15} className="text-ink/40" /></button>
              </div>
              <input className="input" placeholder="Not başlığı" value={noteForm.title} onChange={e => setNoteForm(p => ({ ...p, title: e.target.value }))} required />
              <textarea className="input resize-none" rows={6} placeholder="Not içeriği..." value={noteForm.content} onChange={e => setNoteForm(p => ({ ...p, content: e.target.value }))} />
              <button type="submit" disabled={noteLoading} className="btn-primary w-full justify-center text-sm disabled:opacity-60">
                {noteLoading ? 'Kaydediliyor...' : editingNote ? 'Güncelle' : 'Not ekle →'}
              </button>
            </form>
          )}

          {notes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {notes.map((n: any) => (
                <div key={n.id} className="card hover:border-brand/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif font-bold text-ink">{n.title}</h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {isMember && (
                        <button onClick={() => { setEditingNote(n); setNoteForm({ title: n.title, content: n.content || '' }); setShowNoteForm(true) }}
                          className="text-ink/25 hover:text-brand transition-colors">
                          <FileText size={13} />
                        </button>
                      )}
                      {n.created_by === currentUserId && (
                        <button onClick={() => deleteNote(n.id)} className="text-ink/25 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  {n.content && <p className="text-sm text-ink/60 leading-relaxed line-clamp-4 whitespace-pre-wrap">{n.content}</p>}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center text-xs font-bold text-brand">
                      {n.creator?.full_name?.[0]}
                    </div>
                    <span className="text-xs text-ink/35">{n.creator?.full_name}</span>
                    <span className="text-xs text-ink/25 ml-auto">
                      {new Date(n.updated_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
              <FileText size={32} className="text-brand/25 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink mb-1">Henüz not yok.</p>
              <p className="text-sm text-ink/45">Meeting özetleri, fikirler, kararlar — hepsini buraya yaz.</p>
            </div>
          )}
        </div>
      )}

      {/* Dosyalar */}
      {activeTab === 'files' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-bold text-ink">Dosyalar</h2>
            {isMember && (
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-60">
                <Upload size={13} />
                {uploading ? 'Yükleniyor...' : 'Dosya yükle'}
              </button>
            )}
          </div>

          <input ref={fileRef} type="file" className="hidden" onChange={handleFileUpload} />

          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((f: any) => (
                <div key={f.id} className="card flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <Folder size={18} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm truncate">{f.name}</p>
                    <p className="text-xs text-ink/35">
                      {f.file_size && formatFileSize(f.file_size)} · {f.uploader?.full_name} · {new Date(f.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={f.file_url} target="_blank" rel="noopener noreferrer"
                      className="text-ink/30 hover:text-brand transition-colors">
                      <Download size={15} />
                    </a>
                    {f.uploaded_by === currentUserId && (
                      <button onClick={() => deleteFile(f.id)} className="text-ink/25 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
              <Folder size={32} className="text-brand/25 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink mb-1">Henüz dosya yok.</p>
              <p className="text-sm text-ink/45">Pitch deck, wireframe, finansal model — hepsini buraya yükle.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}