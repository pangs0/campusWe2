'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/client'
import { Users, Globe, ArrowRight } from 'lucide-react'

const TR_CITIES: Record<string, { x: number; y: number }> = {
  'İstanbul': { x: 52.5, y: 38.5 },
  'Ankara': { x: 55.5, y: 40.5 },
  'İzmir': { x: 51, y: 42 },
  'Bursa': { x: 53, y: 39.5 },
  'Antalya': { x: 54.5, y: 44 },
  'Adana': { x: 57, y: 43 },
  'Konya': { x: 55.5, y: 42.5 },
  'Gaziantep': { x: 57.5, y: 43.5 },
  'Trabzon': { x: 59, y: 38 },
  'Kayseri': { x: 57, y: 41 },
  'Eskişehir': { x: 53.5, y: 40 },
  'Samsun': { x: 57, y: 38 },
  'Diğer': { x: 56, y: 41 },
}

export default function HaritaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [cityStats, setCityStats] = useState<Record<string, number>>({})
  const [totalTR, setTotalTR] = useState(0)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [showTRPanel, setShowTRPanel] = useState(false)
  const [trUsers, setTrUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username, university, city, karma_tokens, user_skills(skill_name)')
        .order('karma_tokens', { ascending: false })

      if (profiles) {
        setUsers(profiles)
        setTotalTR(profiles.length)

        const stats: Record<string, number> = {}
        profiles.forEach((p: any) => {
          const city = p.city || 'Diğer'
          const key = Object.keys(TR_CITIES).find(c =>
            city.toLowerCase().includes(c.toLowerCase())
          ) || 'Diğer'
          stats[key] = (stats[key] || 0) + 1
        })
        setCityStats(stats)
        setTrUsers(profiles)
      }
      setLoading(false)
    }
    load()
  }, [])

  function getCityRadius(count: number) {
    if (count === 0) return 4
    if (count < 3) return 6
    if (count < 10) return 9
    return 13
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">GLOBAL AĞ</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Dünyadaki girişimciler.</h1>
            <p className="text-sm text-ink/45 mt-1">Şu an aktif olan kurucuları keşfet, bağlan.</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-4 py-2.5">
            <Globe size={14} className="text-brand" />
            <span className="mono text-sm font-medium text-ink">{totalTR} girişimci</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="card p-0 overflow-hidden relative" style={{ background: '#1a1a18' }}>
              {/* Başlık */}
              <div className="absolute top-4 left-4 z-10">
                <span className="mono text-xs text-white/30 tracking-widest">DÜNYA HARİTASI</span>
              </div>

              <svg
                viewBox="0 0 100 60"
                className="w-full"
                style={{ background: 'linear-gradient(180deg, #0f0f10 0%, #1a1a18 100%)' }}
              >
                {/* Okyanus deseni */}
                <defs>
                  <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                    <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2"/>
                  </pattern>
                  <radialGradient id="trGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C4500A" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#C4500A" stopOpacity="0"/>
                  </radialGradient>
                  <filter id="blur">
                    <feGaussianBlur stdDeviation="0.5"/>
                  </filter>
                </defs>
                <rect width="100" height="60" fill="url(#grid)"/>

                {/* Kıtalar — basit SVG şekilleri */}
                {/* Kuzey Amerika */}
                <path d="M8 12 L20 10 L24 14 L22 20 L18 24 L14 28 L10 26 L8 20 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>
                {/* Güney Amerika */}
                <path d="M18 30 L24 28 L26 32 L24 40 L20 44 L16 40 L16 34 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>
                {/* Avrupa */}
                <path d="M42 10 L50 8 L52 12 L50 16 L46 18 L42 16 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>
                {/* Afrika */}
                <path d="M44 20 L52 18 L54 24 L52 34 L48 38 L44 34 L42 28 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>
                {/* Asya */}
                <path d="M52 8 L72 6 L76 12 L74 18 L68 20 L60 18 L54 16 L52 12 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>
                {/* Türkiye highlight */}
                <path d="M53 37 L60 36 L62 38 L60 41 L54 42 L52 40 Z"
                  fill="rgba(196,80,10,0.15)"
                  stroke="rgba(196,80,10,0.5)"
                  strokeWidth="0.4"
                />
                {/* Avustralya */}
                <path d="M72 36 L82 34 L84 40 L80 44 L74 44 L72 40 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>

                {/* Türkiye glow efekti */}
                <ellipse cx="57" cy="39" rx="6" ry="3" fill="url(#trGlow)" filter="url(#blur)"/>

                {/* Türkiye Türkiye butonu */}
                <g
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowTRPanel(true)}
                >
                  {/* Pulse animasyonu */}
                  <circle cx="57" cy="39" r="5" fill="none" stroke="rgba(196,80,10,0.3)" strokeWidth="0.5">
                    <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="57" cy="39" r="3" fill="none" stroke="rgba(196,80,10,0.5)" strokeWidth="0.4">
                    <animate attributeName="r" values="2;5;2" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="57" cy="39" r="1.8" fill="#C4500A"/>
                  <circle cx="57" cy="39" r="1" fill="white"/>
                </g>

                {/* Şehir noktaları */}
                {Object.entries(cityStats).map(([city, count]) => {
                  const pos = TR_CITIES[city]
                  if (!pos) return null
                  const r = getCityRadius(count)
                  return (
                    <g key={city}>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={r * 0.15}
                        fill="rgba(196,80,10,0.6)"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowTRPanel(true)}
                      >
                        <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + Math.random()}s`} repeatCount="indefinite"/>
                      </circle>
                    </g>
                  )
                })}

                {/* Diğer ülkeler — soluk göster */}
                {[
                  { label: 'ABD', cx: 16, cy: 18 },
                  { label: 'Almanya', cx: 47, cy: 13 },
                  { label: 'Japonya', cx: 78, cy: 18 },
                  { label: 'Brezilya', cx: 22, cy: 36 },
                  { label: 'Hindistan', cx: 66, cy: 28 },
                ].map(c => (
                  <g key={c.label}>
                    <circle cx={c.cx} cy={c.cy} r="0.8" fill="rgba(255,255,255,0.12)"/>
                    <text x={c.cx + 1.2} y={c.cy + 0.5} fontSize="1.2" fill="rgba(255,255,255,0.15)" fontFamily="monospace">
                      {c.label} — yakında
                    </text>
                  </g>
                ))}

                {/* Türkiye etiketi */}
                <text x="58" y="37" fontSize="1.4" fill="rgba(196,80,10,0.9)" fontFamily="monospace" fontWeight="bold">
                  TÜRKİYE
                </text>
                <text x="58" y="38.8" fontSize="1.1" fill="rgba(255,255,255,0.5)" fontFamily="monospace">
                  {totalTR} girişimci
                </text>
              </svg>

              {/* Alt bilgi */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="mono text-xs text-white/25">Diğer ülkeler yakında açılıyor</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse"/>
                  <span className="mono text-xs text-white/40">Canlı</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ panel */}
          <div className="space-y-4">
            {/* Türkiye kartı */}
            <div
              className="card cursor-pointer hover:border-brand/40 transition-colors group"
              onClick={() => setShowTRPanel(true)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇹🇷</span>
                  <div>
                    <p className="font-serif font-bold text-ink">Türkiye</p>
                    <p className="mono text-xs text-ink/35">Aktif</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-ink/30 group-hover:text-brand transition-colors"/>
              </div>
              <div className="flex items-center gap-1.5 bg-brand/8 rounded px-3 py-2">
                <Users size={12} className="text-brand"/>
                <span className="mono text-sm font-medium text-brand">{totalTR} girişimci</span>
              </div>
            </div>

            {/* Şehir dağılımı */}
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">ŞEHİRLER</p>
              <div className="space-y-2">
                {Object.entries(cityStats)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([city, count]) => (
                    <div key={city} className="flex items-center justify-between">
                      <span className="text-sm text-ink/60">{city}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full"
                            style={{ width: `${Math.min((count / Math.max(...Object.values(cityStats))) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="mono text-xs text-ink/40 w-4 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Yakında */}
            <div className="card bg-neutral-50">
              <p className="mono text-xs text-ink/25 tracking-widest mb-2">YAKINDA</p>
              {['🇺🇸 ABD', '🇩🇪 Almanya', '🇯🇵 Japonya', '🇧🇷 Brezilya'].map(c => (
                <div key={c} className="flex items-center justify-between py-1.5 border-b border-neutral-100 last:border-0">
                  <span className="text-sm text-ink/30">{c}</span>
                  <span className="mono text-xs text-ink/20">—</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Türkiye panel */}
        {showTRPanel && (
          <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-6" onClick={() => setShowTRPanel(false)}>
            <div className="bg-cream rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇹🇷</span>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-ink">Türkiye Girişimcileri</h2>
                    <p className="mono text-xs text-ink/35">{totalTR} aktif kurucu</p>
                  </div>
                </div>
                <button onClick={() => setShowTRPanel(false)} className="text-ink/30 hover:text-ink text-xl">✕</button>
              </div>

              <div className="overflow-y-auto p-6 space-y-3" style={{ maxHeight: '60vh' }}>
                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto"/>
                  </div>
                ) : trUsers.length > 0 ? (
                  trUsers.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-xl hover:border-brand/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand/15 flex items-center justify-center text-sm font-bold text-brand font-serif">
                          {u.full_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-ink text-sm">{u.full_name}</p>
                          <p className="mono text-xs text-ink/35">
                            {u.city || 'Türkiye'}
                            {u.university && ` · ${u.university}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {u.user_skills?.slice(0, 2).map((s: any, i: number) => (
                          <span key={i} className="mono text-xs bg-neutral-100 text-ink/50 border border-neutral-200 rounded px-2 py-0.5">
                            {s.skill_name}
                          </span>
                        ))}
                        <div className="flex items-center gap-1 text-brand">
                          <span className="mono text-xs font-medium">{u.karma_tokens}</span>
                          <span className="text-xs">⚡</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-ink/40">Henüz kayıtlı kullanıcı yok.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}