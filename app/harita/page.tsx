'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/client'

export default function HaritaPage() {
  const router = useRouter()
  const supabase = createClient()
  const svgRef = useRef<SVGSVGElement>(null)
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [totalTR, setTotalTR] = useState(0)
  const [panelOpen, setPanelOpen] = useState(false)
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
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (loading) return

    function loadScript(src: string, onload: () => void) {
      const s = document.createElement('script')
      s.src = src
      s.onload = onload
      document.head.appendChild(s)
    }

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js', () => {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js', drawMap)
    })
  }, [loading])

  function drawMap() {
    const d3 = (window as any).d3
    const topojson = (window as any).topojson
    if (!d3 || !topojson || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const projection = d3.geoNaturalEarth1().scale(145).translate([450, 230])
    const pathGen = d3.geoPath(projection)
    const TR_ID = '792'

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((world: any) => {
      const countries = topojson.feature(world, world.objects.countries).features

      svg.selectAll('path')
        .data(countries)
        .join('path')
        .attr('d', pathGen)
        .attr('fill', (d: any) => d.id == TR_ID ? '#2a1a10' : '#1e1e22')
        .attr('stroke', (d: any) => d.id == TR_ID ? '#C4500A' : '#2a2a2e')
        .attr('stroke-width', (d: any) => d.id == TR_ID ? 0.8 : 0.4)
        .style('cursor', (d: any) => d.id == TR_ID ? 'pointer' : 'default')
        .on('mouseover', function(this: any, _: any, d: any) {
          if (d.id == TR_ID) d3.select(this).attr('fill', '#3a2010')
        })
        .on('mouseout', function(this: any, _: any, d: any) {
          if (d.id == TR_ID) d3.select(this).attr('fill', '#2a1a10')
        })
        .on('click', (_: any, d: any) => {
          if (d.id == TR_ID) setPanelOpen(true)
        })

      const trCenter = projection([35.2433, 38.9637])

      ;[0, 1, 2].forEach(i => {
        const c = svg.append('circle')
          .attr('cx', trCenter[0]).attr('cy', trCenter[1])
          .attr('r', 4).attr('fill', 'none')
          .attr('stroke', '#C4500A').attr('stroke-width', 1.2).attr('opacity', 0)
        c.append('animate').attr('attributeName', 'r').attr('values', '4;20;4').attr('dur', '2.4s').attr('begin', `${i * 0.8}s`).attr('repeatCount', 'indefinite')
        c.append('animate').attr('attributeName', 'opacity').attr('values', '0.7;0;0.7').attr('dur', '2.4s').attr('begin', `${i * 0.8}s`).attr('repeatCount', 'indefinite')
      })

      svg.append('circle')
        .attr('cx', trCenter[0]).attr('cy', trCenter[1])
        .attr('r', 5).attr('fill', '#C4500A')
        .attr('stroke', '#fff').attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('click', () => setPanelOpen(true))

      svg.append('text')
        .attr('x', trCenter[0] + 9).attr('y', trCenter[1] - 7)
        .attr('fill', '#C4500A').attr('font-size', '11').attr('font-family', 'monospace')
        .text(`${users.length} girişimci`)

      svg.append('text')
        .attr('x', trCenter[0] + 9).attr('y', trCenter[1] + 5)
        .attr('fill', 'rgba(255,255,255,0.35)').attr('font-size', '9').attr('font-family', 'monospace')
        .text('Türkiye · Aktif')

      const others = [
        { coords: [-74.006, 40.7128] as [number, number] },
        { coords: [13.405, 52.52] as [number, number] },
        { coords: [139.69, 35.69] as [number, number] },
        { coords: [-46.63, -23.55] as [number, number] },
        { coords: [72.88, 19.07] as [number, number] },
        { coords: [3.38, 6.45] as [number, number] },
        { coords: [116.38, 39.90] as [number, number] },
        { coords: [151.20, -33.86] as [number, number] },
      ]
      others.forEach(c => {
        const pos = projection(c.coords)
        if (!pos) return
        svg.append('circle')
          .attr('cx', pos[0]).attr('cy', pos[1]).attr('r', 2.5)
          .attr('fill', 'rgba(255,255,255,0.05)')
          .attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 0.5)
      })
    })
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">GLOBAL AĞ</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Dünyadaki girişimciler.</h1>
          <p className="text-sm text-ink/45 mt-1">Türkiye'deki kurucuları keşfet. Diğer ülkeler yakında açılıyor.</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { n: totalTR, l: 'Türkiye girişimcisi' },
            { n: '100', l: 'Başlangıç Karma' },
            { n: '1', l: 'Aktif ülke' },
            { n: 'Yakında', l: 'Global açılım' },
          ].map((s, i) => (
            <div key={i} className="card text-center py-3">
              <div className="font-serif text-2xl font-bold text-ink">{s.n}</div>
              <div className="mono text-xs text-ink/35 mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#0f0f11', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.5)', fontFamily: 'monospace', letterSpacing: 2 }}>
              CAMPUSWE — DÜNYA HARİTASI
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontFamily: 'monospace' }}>CANLI</span>
            </div>
          </div>

          <div style={{ position: 'relative', minHeight: 300 }}>
            {loading && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f11', zIndex: 10 }}>
                <div style={{ width: 28, height: 28, border: '2px solid #C4500A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </div>
            )}
            <svg ref={svgRef} viewBox="0 0 900 460" style={{ width: '100%', display: 'block' }} />
          </div>

          <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', fontFamily: 'monospace' }}>
              Türkiye'ye tıkla → girişimcileri gör
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', fontFamily: 'monospace' }}>
              {totalTR} aktif kullanıcı
            </span>
          </div>
        </div>
      </main>

      {panelOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setPanelOpen(false)}
        >
          <div
            style={{ background: '#F5F0E8', borderRadius: 16, maxWidth: 580, width: '100%', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(26,26,24,.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🇹🇷</span>
                <div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#1a1a18', margin: 0 }}>Türkiye Girişimcileri</h2>
                  <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', margin: 0 }}>{totalTR} aktif kurucu</p>
                </div>
              </div>
              <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, color: 'rgba(26,26,24,.3)', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', paddingBottom: 12 }}>
              {users.length > 0 ? users.map((u: any) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderBottom: '1px solid rgba(26,26,24,.06)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(196,80,10,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#C4500A', flexShrink: 0 }}>
                    {u.full_name?.[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18', margin: 0 }}>{u.full_name}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', margin: 0 }}>
                      {u.city || 'Türkiye'}{u.university && ` · ${u.university}`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {u.user_skills?.slice(0, 2).map((s: any, i: number) => (
                      <span key={i} style={{ fontFamily: 'monospace', fontSize: 10, background: 'rgba(26,26,24,.06)', color: 'rgba(26,26,24,.5)', border: '0.5px solid rgba(26,26,24,.1)', borderRadius: 4, padding: '2px 6px' }}>
                        {s.skill_name}
                      </span>
                    ))}
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', fontWeight: 500 }}>
                      {u.karma_tokens} ⚡
                    </span>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                  <p style={{ color: 'rgba(26,26,24,.4)', fontSize: 14 }}>Henüz kayıtlı kullanıcı yok.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}