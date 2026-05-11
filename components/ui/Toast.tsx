'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type Toast = {
  id: string
  type: ToastType
  message: string
  duration?: number
}

type ToastContextType = {
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const COLORS = {
  success: { bg: '#f0fdf4', border: 'rgba(34,197,94,.25)', icon: '#22c55e', text: '#166534' },
  error: { bg: '#fef2f2', border: 'rgba(239,68,68,.25)', icon: '#ef4444', text: '#991b1b' },
  warning: { bg: '#fffbeb', border: 'rgba(245,158,11,.25)', icon: '#f59e0b', text: '#92400e' },
  info: { bg: '#eff6ff', border: 'rgba(59,130,246,.25)', icon: '#3b82f6', text: '#1e40af' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) { clearTimeout(timer); timers.current.delete(id) }
  }, [])

  const add = useCallback((type: ToastType, message: string, duration = 3500) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev.slice(-4), { id, type, message }])
    const timer = setTimeout(() => remove(id), duration)
    timers.current.set(id, timer)
  }, [remove])

  const ctx = {
    success: (m: string) => add('success', m),
    error: (m: string) => add('error', m, 5000),
    warning: (m: string) => add('warning', m),
    info: (m: string) => add('info', m),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
        {toasts.map((toast, i) => {
          const Icon = ICONS[toast.type]
          const c = COLORS[toast.type]
          return (
            <div key={toast.id} style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 280,
              maxWidth: 380,
              boxShadow: '0 8px 32px rgba(0,0,0,.12)',
              pointerEvents: 'all',
              animation: 'toastIn 0.3s ease',
            }}>
              <style>{`
                @keyframes toastIn {
                  from { opacity: 0; transform: translateX(20px) scale(0.95); }
                  to { opacity: 1; transform: translateX(0) scale(1); }
                }
              `}</style>
              <Icon size={16} color={c.icon} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: c.text, margin: 0, flex: 1, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                {toast.message}
              </p>
              <button onClick={() => remove(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0, opacity: 0.5 }}>
                <X size={13} color={c.text} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}