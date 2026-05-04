'use client'

import { useState, useEffect, useRef } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { BookOpen, Play, Pause, RotateCcw, Users } from 'lucide-react'

const SOUNDS = [
  { id: 'klavye', label: 'Klavye sesi', emoji: '⌨️' },
  { id: 'yagmur', label: 'Yağmur sesi', emoji: '🌧️' },
  { id: 'sessiz', label: 'Sessiz', emoji: '🔇' },
]

const FOCUS_TIMES = [25, 45, 60, 90]

export default function KutuphhanePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTime, setSelectedTime] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [selectedSound, setSelectedSound] = useState('sessiz')
  const [task, setTask] = useState('')
  const [activeUsers] = useState(Math.floor(Math.random() * 40) + 12)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            setCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, timeLeft])

  function handleStart() {
    setCompleted(false)
    setIsRunning(true)
  }

  function handlePause() {
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

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100

  return (
    <AppLayout user={null}>
      <main className="px-8 py-16">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-ink/5 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-ink/40" />
          </div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-2">SANAL KÜTÜPHANE</p>
          <h1 className="font-serif text-3xl font-bold text-ink mb-2">Deep Work modu.</h1>
          <div className="flex items-center justify-center gap-1.5 text-sm text-ink/40">
            <Users size={13} />
            <span>{activeUsers} kişi şu an çalışıyor</span>
          </div>
        </div>

        <div className="card max-w-sm mx-auto mb-6">
          <div className="text-center mb-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(26,26,24,.08)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={completed ? '#22c55e' : isRunning ? '#C4500A' : 'rgba(26,26,24,.2)'}
                  strokeWidth="8"
                  strokeLinecap="round"
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

            <div className="flex gap-2 justify-center mb-4">
              {FOCUS_TIMES.map(t => (
                <button
                  key={t}
                  onClick={() => handleTimeSelect(t)}
                  className={`mono text-xs px-2.5 py-1 rounded border transition-colors ${
                    selectedTime === t
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/40'
                  }`}
                >
                  {t}dk
                </button>
              ))}
            </div>

            <div className="flex gap-2 justify-center">
              {!isRunning ? (
                <button onClick={handleStart} className="btn-primary flex items-center gap-1.5 text-sm px-6">
                  <Play size={13} />
                  {timeLeft === selectedTime * 60 ? 'Başla' : 'Devam et'}
                </button>
              ) : (
                <button onClick={handlePause} className="btn-secondary flex items-center gap-1.5 text-sm px-6">
                  <Pause size={13} />
                  Duraklat
                </button>
              )}
              <button onClick={handleReset} className="btn-secondary px-3">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <label className="label">Ne üzerinde çalışıyorsun?</label>
            <input
              type="text"
              className="input text-sm"
              placeholder="MVP landing page, pitch deck..."
              value={task}
              onChange={e => setTask(e.target.value)}
            />
          </div>
        </div>

        <div className="card max-w-sm mx-auto">
          <p className="mono text-xs text-ink/35 tracking-widest mb-3">ORTAM SESİ</p>
          <div className="grid grid-cols-3 gap-2">
            {SOUNDS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSound(s.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs transition-colors ${
                  selectedSound === s.id
                    ? 'bg-ink text-cream border-ink'
                    : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/30'
                }`}
              >
                <span className="text-lg">{s.emoji}</span>
                <span className="mono text-xs">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
          {[
            { n: `${activeUsers}`, l: 'Şu an aktif' },
            { n: '25dk', l: 'Pomodoro süresi' },
            { n: 'Sessiz', l: 'Odaklanma ortamı' },
          ].map((s, i) => (
            <div key={i} className="card py-3">
              <div className="font-serif text-base font-bold text-ink">{s.n}</div>
              <div className="mono text-xs text-ink/35 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </main>
    </AppLayout>
  )
}