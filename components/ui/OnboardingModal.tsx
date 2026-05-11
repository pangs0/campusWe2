'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X, CheckCircle, ArrowRight, User, TrendingUp, Users, BookOpen, Zap } from 'lucide-react'

type Step = {
  id: string
  icon: any
  title: string
  desc: string
  action: string
  href: string
  check: (profile: any) => boolean
}

const FOUNDER_STEPS: Step[] = [
  {
    id: 'avatar',
    icon: User,
    title: 'Profil fotoğrafı ekle',
    desc: 'Topluluk seni tanısın. Fotoğraflı profiller 3x daha fazla bağlantı kuruyor.',
    action: 'Fotoğraf ekle →',
    href: '/profile/edit',
    check: (p) => !!p?.avatar_url,
  },
  {
    id: 'bio',
    icon: User,
    title: 'Hakkında bölümünü doldur',
    desc: 'Kendini anlat. Co-founder ve yatırımcılar kim olduğunu bilmek istiyor.',
    action: 'Profili düzenle →',
    href: '/profile/edit',
    check: (p) => !!p?.bio && p.bio.length > 10,
  },
  {
    id: 'startup',
    icon: TrendingUp,
    title: 'İlk startup sayfanı oluştur',
    desc: 'Fikrin ne kadar erken olursa olsun. Başlamak için mükemmel zamanı bekleme.',
    action: 'Startup oluştur →',
    href: '/startup/new',
    check: (p) => !!(p as any)?._hasStartup,
  },
  {
    id: 'cofounder',
    icon: Users,
    title: 'Co-founder ara',
    desc: 'Tamamlayıcı yetenekler ekibini güçlendirir. Şimdi bak.',
    action: 'Co-founder bul →',
    href: '/eslestirme',
    check: () => false,
  },
  {
    id: 'feed',
    icon: Zap,
    title: 'İlk paylaşımını yap',
    desc: 'Topluluğa katıl. Fikrini paylaş, geri bildirim al.',
    action: 'Akışa git →',
    href: '/feed',
    check: () => false,
  },
]

export default function OnboardingModal({ userId, profile }: { userId: string; profile: any }) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasStartup, setHasStartup] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Daha önce kapatıldı mı
    const key = `onboarding-dismissed-${userId}`
    if (localStorage.getItem(key)) return

    // Startup var mı
    supabase.from('startups').select('id').eq('founder_id', userId).single()
      .then(({ data }) => {
        setHasStartup(!!data)
        // Profil tamamlanmamışsa göster
        if (!profile?.avatar_url || !profile?.bio) {
          setTimeout(() => setOpen(true), 1500)
        }
      })
  }, [userId])

  function dismiss() {
    localStorage.setItem(`onboarding-dismissed-${userId}`, '1')
    setDismissed(true)
    setOpen(false)
  }

  const enrichedProfile = { ...profile, _hasStartup: hasStartup }
  const steps = FOUNDER_STEPS
  const completedCount = steps.filter(s => s.check(enrichedProfile)).length
  const progress = Math.round((completedCount / steps.length) * 100)

  if (!open || dismissed) return null

  const step = steps[currentStep]
  const isCompleted = step.check(enrichedProfile)

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-lg px-4">
        <div className="bg-cream rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">

          {/* Header */}
          <div style={{ background: '#1a1a18', padding: '24px 24px 20px' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#C4500A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                  HOŞ GELDİN 👋
                </p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>
                  Profilini tamamla
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>
                  {completedCount}/{steps.length} adım tamamlandı
                </p>
              </div>
              <button onClick={dismiss} style={{ background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'rgba(255,255,255,.5)' }}>
                <X size={14} />
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: 'rgba(255,255,255,.1)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#C4500A', borderRadius: 99, width: `${progress}%`, transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Steps */}
          <div className="p-4 space-y-2">
            {steps.map((s, i) => {
              const done = s.check(enrichedProfile)
              const active = i === currentStep
              return (
                <button key={s.id} onClick={() => setCurrentStep(i)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                    active ? 'border-brand/30 bg-brand/5' : 'border-transparent hover:bg-neutral-100/50'
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    done ? 'bg-green-100' : active ? 'bg-brand/10' : 'bg-neutral-100'
                  }`}>
                    {done
                      ? <CheckCircle size={14} className="text-green-600" />
                      : <s.icon size={14} className={active ? 'text-brand' : 'text-ink/30'} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${done ? 'line-through text-ink/30' : active ? 'text-ink' : 'text-ink/60'}`}>
                      {s.title}
                    </p>
                    {active && !done && (
                      <p className="text-xs text-ink/45 mt-0.5 leading-relaxed">{s.desc}</p>
                    )}
                  </div>
                  {done && <span className="mono text-xs text-green-600 flex-shrink-0">✓</span>}
                  {!done && active && (
                    <span className="mono text-xs bg-brand text-white rounded px-2 py-0.5 flex-shrink-0">Şimdi</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 flex items-center gap-3">
            {!isCompleted && (
              <button
                onClick={() => { dismiss(); router.push(step.href) }}
                className="btn-primary flex-1 justify-center py-2.5 flex items-center gap-2">
                {step.action} <ArrowRight size={14} />
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button onClick={() => setCurrentStep(p => p + 1)}
                className="flex-1 py-2.5 rounded-lg border border-neutral-200 text-sm text-ink/50 hover:text-ink hover:border-neutral-300 transition-colors">
                Sonraki adım
              </button>
            )}
            <button onClick={dismiss} className="text-xs text-ink/25 hover:text-ink/50 transition-colors px-2">
              Daha sonra
            </button>
          </div>
        </div>
      </div>
    </>
  )
}