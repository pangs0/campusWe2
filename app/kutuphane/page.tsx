'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { createClient } from '@/lib/supabase/client'
import { Play, Pause, RotateCcw, Plus, Check, X, BookOpen, Users, Music, Target, BarChart2, Zap } from 'lucide-react'

const FOCUS_TIMES = [25, 45, 60, 90]

const MUSIC_CHANNELS = [
  { label: 'Lo-fi Hip Hop', emoji: '🎵', url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1' },
  { label: 'Doğa Sesleri', emoji: '🌿', url: 'https://www.youtube.com/embed/eKFTSSKCzWA?autoplay=1' },
  { label: 'Beyaz Gürültü', emoji: '🌊', url: 'https://www.youtube.com/embed/nMfPqeZjc2c?autoplay=1' },
  { label: 'Klasik Müzik', emoji: '🎻', url: 'https://www.youtube.com/embed/mDX8QrcDI_g?autoplay=1' },
  { label: 'Sessiz', emoji: '🔇', url: null },
]

export default function KutuphhanePage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  // Timer
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTime, setSelectedTime] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [completed, setCompleted] = useState(false)
  const [task, setTask] = useState('')
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [sessionNote, setSessionNote] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Müzik
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  const [showMusic, setShowMusic] = useState(false)

  // Hedefler
  const [goals, setGoals] = useState<any[]>([])
  const [newGoal, setNewGoal] = useState('')
  const [addingGoal, setAddingGoal] = useState(false)

  // İstatistikler
  const [sessions, setSessions] = useState<any[]>([])
  const [weeklyCount, setWeeklyCount] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)

  // Aktif kullanıcılar
  const [activeUsers, setActiveUsers] = useState<any[]>([])

  // Topluluk stats
  const [communityPomodoros, setCommunityPomodoros] = useState(0)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
      if (prof) setProfile(prof)

      // Günlük hedefler
      const today = new Date().toISOString().split('T')[0]
      const { data: goalData } = await supabase.from('daily_goals').select('*').eq('user_id', user.id).eq('date', today).order('created_at')
      setGoals(goalData || [])

      // İstatistikler
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
      const { data: sessionData } = await supabase.from('pomodoro_sessions').select('*').eq('user_id', user.id).gte('completed_at', weekAgo).order('completed_at', { ascending: false })
      setSessions(sessionData || [])
      setWeeklyCount(sessionData?.length || 0)
      setTotalMinutes(sessionData?.reduce((sum: number, s: any) => sum + s.duration_minutes, 0) || 0)

      // Topluluk pomodoro
      const { count } = await supabase.from('pomodoro_sessions').select('*', { count: 'exact', head: true }).gte('completed_at', new Date(Date.now() - 7 * 86400000).toISOString())
      setCommunityPomodoros(count || 0)

      // Aktif kullanıcılar
      loadActiveUsers()

      // Realtime aktif kullanıcılar
      const channel = supabase.channel('study_status')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'study_status' }, () => loadActiveUsers())
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }
    load()
  }, [])

  async function loadActiveUsers() {
    const { data } = await supabase
      .from('study_status')
      .select('*, profile:profiles(full_name, avatar_url)')
      .eq('is_active', true)
      .gte('updated_at', new Date(Date.now() - 3 * 3600000).toISOString())
    setActiveUsers(data || [])
  }

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            setCompleted(true)
            setShowNoteModal(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning])

  async function handleStart() {
    if (!user) return
    setCompleted(false)
    setIsRunning(true)
    // Aktif durumu güncelle
    await supabase.from('study_status').upsert({
      user_id: user.id,
      task_description: task || 'Çalışıyor',
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    loadActiveUsers()
  }

  async function handlePause() {
    setIsRunning(false)
  }

  function handleReset() {
    setIsRunning(false)
    setCompleted(false)
    setTimeLeft(selectedTime * 60)
  }

  function handleTimeSelect(mins: number) {
    setSelectedTime(mins)
    setTimeLeft(mins * 60)
    setIsRunning(false)
    setCompleted(false)
  }

  async function saveSession() {
    if (!user) return
    await supabase.from('pomodoro_sessions').insert({
      user_id: user.id,
      duration_minutes: selectedTime,
      task_description: task,
      note: sessionNote,
    })
    await supabase.from('study_status').upsert({ user_id: user.id, is_active: false, updated_at: new Date().toISOString() })
    setWeeklyCount(p => p + 1)
    setTotalMinutes(p => p + selectedTime)
    setCommunityPomodoros(p => p + 1)
    setShowNoteModal(false)
    setSessionNote('')
    setTask('')
    handleReset()
    loadActiveUsers()
  }

  async function addGoal(e: React.FormEvent) {
    e.preventDefault()
    if (!newGoal.trim() || !user) return
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase.from('daily_goals').insert({ user_id: user.id, title: newGoal.trim(), date: today }).select().single()
    if (data) setGoals(prev => [...prev, data])
    setNewGoal('')
    setAddingGoal(false)
  }

  async function toggleGoal(id: string, isDone: boolean) {
    await supabase.from('daily_goals').update({ is_done: !isDone }).eq('id', id)
    setGoals(prev => prev.map(g => g.id === id ? { ...g, is_done: !isDone } : g))
  }

  async function deleteGoal(id: string) {
    await supabase.from('daily_goals').delete().eq('id', id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100
  const doneGoals = goals.filter(g => g.is_done).length

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <div className="mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">SANAL KÜTÜPHANE</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Deep Work modu.</h1>
          <p className="text-sm text-ink/45 mt-1">{activeUsers.length} kişi şu an odaklanmış çalışıyor.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Sol — Timer + Müzik */}
          <div className="space-y-4">

            {/* Pomodoro Timer */}
            <div className="card text-center">
              <p className="mono text-xs text-ink/35 tracking-widest mb-4">POmodoro TİMER</p>

              {/* Dairesel timer */}
              <div className="relative w-36 h-36 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(26,26,24,.08)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="54" fill="none"
                    stroke={completed ? '#22c55e' : isRunning ? '#C4500A' : 'rgba(26,26,24,.2)'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif text-3xl font-bold text-ink">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                  {completed && <span className="text-xs text-green-600 font-medium mt-1">Tamamlandı!</span>}
                </div>
              </div>

              {/* Süre seçimi */}
              <div className="flex gap-1.5 justify-center mb-4">
                {FOCUS_TIMES.map(t => (
                  <button key={t} onClick={() => handleTimeSelect(t)}
                    className={`mono text-xs px-2.5 py-1 rounded border transition-colors ${selectedTime === t ? 'bg-ink text-cream border-ink' : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/40'}`}>
                    {t}dk
                  </button>
                ))}
              </div>

              {/* Görev */}
              <input type="text" className="input text-sm mb-3" placeholder="Ne üzerinde çalışıyorsun?"
                value={task} onChange={e => setTask(e.target.value)} />

              {/* Kontroller */}
              <div className="flex gap-2 justify-center">
                {!isRunning ? (
                  <button onClick={handleStart} className="btn-primary flex items-center gap-1.5 text-sm px-5">
                    <Play size={13} /> {timeLeft === selectedTime * 60 ? 'Başla' : 'Devam'}
                  </button>
                ) : (
                  <button onClick={handlePause} className="btn-secondary flex items-center gap-1.5 text-sm px-5">
                    <Pause size={13} /> Duraklat
                  </button>
                )}
                <button onClick={handleReset} className="btn-secondary px-3">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Müzik */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Music size={13} className="text-ink/40" />
                  <p className="mono text-xs text-ink/35 tracking-widest">ODAKLANMA MÜZİĞİ</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {MUSIC_CHANNELS.map(m => (
                  <button key={m.label} onClick={() => setSelectedMusic(selectedMusic === m.url ? null : m.url)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm transition-colors text-left ${selectedMusic === m.url ? 'bg-brand/8 border-brand/20 text-brand' : 'bg-white border-neutral-200 text-ink/60 hover:border-brand/20'}`}>
                    <span>{m.emoji}</span>
                    <span className="text-xs">{m.label}</span>
                    {selectedMusic === m.url && <span className="ml-auto mono text-xs text-brand">▶ Çalıyor</span>}
                  </button>
                ))}
              </div>
              {selectedMusic && (
                <iframe src={selectedMusic} className="hidden" allow="autoplay" />
              )}
            </div>
          </div>

          {/* Orta — Hedefler + İstatistikler */}
          <div className="space-y-4">

            {/* Günlük hedefler */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Target size={13} className="text-ink/40" />
                  <p className="mono text-xs text-ink/35 tracking-widest">GÜNLÜK HEDEFLER</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mono text-xs text-brand">{doneGoals}/{goals.length}</span>
                  <button onClick={() => setAddingGoal(true)} className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center hover:bg-brand/20 transition-colors">
                    <Plus size={11} className="text-brand" />
                  </button>
                </div>
              </div>

              {goals.length > 0 && (
                <div className="h-1.5 bg-neutral-100 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-brand rounded-full transition-all" style={{ width: goals.length > 0 ? `${(doneGoals / goals.length) * 100}%` : '0%' }} />
                </div>
              )}

              <div className="space-y-2">
                {goals.map(g => (
                  <div key={g.id} className="flex items-center gap-2 group">
                    <button onClick={() => toggleGoal(g.id, g.is_done)}
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${g.is_done ? 'bg-brand border-brand' : 'border-neutral-300 hover:border-brand'}`}>
                      {g.is_done && <Check size={10} className="text-white" />}
                    </button>
                    <span className={`text-sm flex-1 ${g.is_done ? 'line-through text-ink/35' : 'text-ink/75'}`}>{g.title}</span>
                    <button onClick={() => deleteGoal(g.id)} className="opacity-0 group-hover:opacity-100 text-ink/20 hover:text-red-500 transition-all">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {addingGoal && (
                <form onSubmit={addGoal} className="flex gap-2 mt-2">
                  <input type="text" className="input text-sm flex-1 py-1.5" placeholder="Yeni hedef..." value={newGoal}
                    onChange={e => setNewGoal(e.target.value)} autoFocus />
                  <button type="submit" className="btn-primary px-3 py-1.5 text-xs">Ekle</button>
                  <button type="button" onClick={() => setAddingGoal(false)} className="btn-secondary px-2 py-1.5"><X size={13} /></button>
                </form>
              )}

              {goals.length === 0 && !addingGoal && (
                <button onClick={() => setAddingGoal(true)} className="w-full text-xs text-ink/35 hover:text-brand transition-colors py-2 border border-dashed border-neutral-200 rounded-lg">
                  + Hedef ekle
                </button>
              )}
            </div>

            {/* İstatistikler */}
            <div className="card">
              <div className="flex items-center gap-1.5 mb-3">
                <BarChart2 size={13} className="text-ink/40" />
                <p className="mono text-xs text-ink/35 tracking-widest">BU HAFTA</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { n: weeklyCount, l: 'Pomodoro', emoji: '🍅' },
                  { n: `${totalMinutes}dk`, l: 'Toplam süre', emoji: '⏱️' },
                ].map(s => (
                  <div key={s.l} className="bg-neutral-50 border border-neutral-100 rounded-xl p-3 text-center">
                    <span className="text-lg">{s.emoji}</span>
                    <p className="font-serif text-xl font-bold text-ink mt-1">{s.n}</p>
                    <p className="mono text-xs text-ink/35">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Son oturumlar */}
              {sessions.length > 0 && (
                <div>
                  <p className="mono text-xs text-ink/25 tracking-widest mb-2">SON OTURUMLAR</p>
                  <div className="space-y-1.5">
                    {sessions.slice(0, 4).map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between text-xs">
                        <span className="text-ink/60 truncate flex-1">{s.task_description || 'Odaklanma seansı'}</span>
                        <span className="mono text-ink/35 flex-shrink-0 ml-2">{s.duration_minutes}dk</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Topluluk */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #faf9f6, #f5f0e8)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={13} className="text-brand" />
                <p className="mono text-xs text-brand tracking-widest">TOPLULUK</p>
              </div>
              <p className="font-serif text-2xl font-bold text-ink">{communityPomodoros}</p>
              <p className="text-xs text-ink/45">topluluk bu hafta Pomodoro tamamladı</p>
            </div>
          </div>

          {/* Sağ — Aktif kullanıcılar */}
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="mono text-xs text-ink/35 tracking-widest">ŞU AN ÇALIŞANLAR</p>
                <span className="mono text-xs text-green-600 ml-auto">{activeUsers.length} aktif</span>
              </div>

              {activeUsers.length > 0 ? (
                <div className="space-y-3">
                  {activeUsers.map((u: any) => (
                    <div key={u.user_id} className="flex items-center gap-2.5">
                      <div className="relative flex-shrink-0">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-sm">
                          {u.profile?.avatar_url ? <img src={u.profile.avatar_url} alt="" className="w-full h-full object-cover" /> : u.profile?.full_name?.[0]}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{u.profile?.full_name}</p>
                        <p className="text-xs text-ink/40 truncate">{u.task_description || 'Odaklanıyor'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen size={24} className="text-ink/15 mx-auto mb-2" />
                  <p className="text-sm text-ink/35">Şu an kimse çalışmıyor.</p>
                  <p className="text-xs text-ink/25 mt-1">İlk odaklanan sen ol!</p>
                </div>
              )}
            </div>

            {/* Çalışma notları — son oturum */}
            {sessions.length > 0 && sessions[0].note && (
              <div className="card">
                <p className="mono text-xs text-ink/35 tracking-widest mb-3">SON OTURUM NOTU</p>
                <p className="text-sm text-ink/60 leading-relaxed italic">"{sessions[0].note}"</p>
                <p className="mono text-xs text-ink/25 mt-2">{sessions[0].task_description} · {sessions[0].duration_minutes}dk</p>
              </div>
            )}

            {/* İpuçları */}
            <div className="card" style={{ background: '#faf9f6', border: '1px solid rgba(26,26,24,.08)' }}>
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">DEEP WORK İPUÇLARI</p>
              <div className="space-y-2.5">
                {[
                  '📵 Telefonu sessize al',
                  '🎯 Tek bir göreve odaklan',
                  '⏰ 25 dakika çalış, 5 dakika mola',
                  '💧 Su iç, ayakta dur',
                  '🚫 Sosyal medyayı kapat',
                ].map((tip, i) => (
                  <p key={i} className="text-xs text-ink/50 leading-relaxed">{tip}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Oturum tamamlama modal */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-6" onClick={() => setShowNoteModal(false)}>
            <div className="bg-cream rounded-xl max-w-sm w-full p-6 shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-4">
                <span className="text-4xl">🍅</span>
                <h2 className="font-serif text-xl font-bold text-ink mt-2">Harika iş!</h2>
                <p className="text-sm text-ink/45">{selectedTime} dakikalık oturum tamamlandı.</p>
              </div>
              <div>
                <label className="label">Bu sefer ne yaptın?</label>
                <textarea className="input resize-none" rows={3} placeholder="Kısa bir not bırak..." value={sessionNote} onChange={e => setSessionNote(e.target.value)} autoFocus />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setShowNoteModal(false); handleReset() }} className="btn-secondary flex-1 text-sm">
                  Atla
                </button>
                <button onClick={saveSession} className="btn-primary flex-1 text-sm">
                  Kaydet ✓
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  )
}