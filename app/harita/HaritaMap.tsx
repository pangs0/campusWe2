'use client'

import { useEffect, useState, useRef } from 'react'

const TURKEY_CITIES: Record<string, [number, number]> = {
  'İstanbul': [28.9784, 41.0082], 'Ankara': [32.8597, 39.9334],
  'İzmir': [27.1428, 38.4237], 'Bursa': [29.0610, 40.1885],
  'Antalya': [30.7133, 36.8969], 'Adana': [35.3213, 37.0000],
  'Konya': [32.4932, 37.8714], 'Gaziantep': [37.3825, 37.0662],
  'Kayseri': [35.4826, 38.7312], 'Eskişehir': [30.5206, 39.7767],
  'Trabzon': [39.7262, 41.0015], 'Samsun': [36.3312, 41.2867],
  'Diyarbakır': [40.2176, 37.9144], 'Mersin': [34.6415, 36.8121],
  'Kocaeli': [29.9187, 40.8533], 'Sakarya': [30.4040, 40.6940],
  'Malatya': [38.3552, 38.3552], 'Erzurum': [41.2714, 39.9043],
  'Van': [43.4000, 38.5000], 'Kahramanmaraş': [36.9371, 37.5858],
}

type Props = { users: any[] }

export default function HaritaMap({ users }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [zoomedToTurkey, setZoomedToTurkey] = useState(false)
  const [tooltip, setTooltip] = useState<{ city: string; count: number; x: number; y: number } | null>(null)
  const zoomedRef = useRef(false)

  const totalTR = users.length
  const cityData: Record<string, number> = {}
  users.forEach((p: any) => {
    if (p.city) {
      const cityKey = Object.keys(TURKEY_CITIES).find(c =>
        p.city.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(p.city.toLowerCase())
      )
      if (cityKey) cityData[cityKey] = (cityData[cityKey] || 0) + 1
    }
  })

  useEffect(() => {
    function loadScript(src: string, onload: () => void) {
      if (document.querySelector(`script[src="${src}"]`)) { onload(); return }
      const s = document.createElement('script')
      s.src = src; s.onload = onload
      document.head.appendChild(s)
    }
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js', () => {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js', () => {
        setLoading(false)
        drawWorldMap()
      })
    })
  }, [])

  function drawWorldMap() {
    const d3 = (window as any).d3
    const topojson = (window as any).topojson
    if (!d3 || !topojson || !svgRef.current) return

    const W = 900, H = 460
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    zoomedRef.current = false
    setZoomedToTurkey(false)
    setTooltip(null)

    const projection = d3.geoNaturalEarth1().scale(145).translate([W / 2, H / 2])
    const pathGen = d3.geoPath(projection)
    const TR_ID = '792'
    const TR_CENTER: [number, number] = [35.2433, 38.9637]
    const g = svg.append('g')

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then((world: any) => {
      const countries = topojson.feature(world, world.objects.countries).features

      g.selectAll('path').data(countries).join('path')
        .attr('d', pathGen)
        .attr('fill', (d: any) => d.id == TR_ID ? '#2a1a10' : '#1e1e22')
        .attr('stroke', (d: any) => d.id == TR_ID ? '#C4500A' : '#2a2a2e')
        .attr('stroke-width', (d: any) => d.id == TR_ID ? 0.8 : 0.4)
        .style('cursor', (d: any) => d.id == TR_ID ? 'pointer' : 'default')
        .on('mouseover', function(this: any, _: any, d: any) { if (d.id == TR_ID) d3.select(this).attr('fill', '#3a2010') })
        .on('mouseout', function(this: any, _: any, d: any) { if (d.id == TR_ID) d3.select(this).attr('fill', '#2a1a10') })
        .on('click', (_: any, d: any) => { if (d.id == TR_ID) zoomToTurkey() })

      const others: [number, number][] = [[-74.006, 40.7128], [13.405, 52.52], [139.69, 35.69], [-46.63, -23.55], [72.88, 19.07]]
      others.forEach(coords => {
        const pos = projection(coords)
        if (!pos) return
        g.append('circle').attr('cx', pos[0]).attr('cy', pos[1]).attr('r', 2.5)
          .attr('fill', 'rgba(255,255,255,0.05)').attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 0.5)
      })

      const trPos = projection(TR_CENTER)!
      const clickGroup = g.append('g').style('cursor', 'pointer').on('click', zoomToTurkey)

      ;[0, 1, 2].forEach(i => {
        clickGroup.append('circle').attr('cx', trPos[0]).attr('cy', trPos[1]).attr('r', 4)
          .attr('fill', 'none').attr('stroke', '#C4500A').attr('stroke-width', 1.2)
          .attr('class', `pulse-ring-${i}`)
      })

      clickGroup.append('circle').attr('cx', trPos[0]).attr('cy', trPos[1]).attr('r', 5)
        .attr('fill', '#C4500A').attr('stroke', '#fff').attr('stroke-width', 1.5)

      clickGroup.append('text').attr('x', trPos[0] + 9).attr('y', trPos[1] - 7)
        .attr('fill', '#C4500A').attr('font-size', '11').attr('font-family', 'monospace')
        .text(`${totalTR} girişimci`)

      clickGroup.append('text').attr('x', trPos[0] + 9).attr('y', trPos[1] + 5)
        .attr('fill', 'rgba(255,255,255,0.35)').attr('font-size', '9').attr('font-family', 'monospace')
        .text('Türkiye · tıkla →')
    })

    function zoomToTurkey() {
      if (zoomedRef.current) return
      zoomedRef.current = true
      setZoomedToTurkey(true)

      const newProjection = d3.geoMercator().scale(1800).center([35.2433, 39.5]).translate([W / 2, H / 2])
      const newPath = d3.geoPath(newProjection)

      g.selectAll('path').transition().duration(1400).ease(d3.easeCubicInOut).attr('d', newPath)
      g.selectAll('circle, text').transition().duration(500).attr('opacity', 0).remove()

      setTimeout(() => {
        Object.entries(TURKEY_CITIES).forEach(([city, coords]) => {
          const count = cityData[city] || 0
          const pos = newProjection(coords)
          if (!pos || pos[0] < 0 || pos[0] > 900 || pos[1] < 0 || pos[1] > 460) return

          const r = count >= 5 ? 9 : count >= 3 ? 7 : count >= 1 ? 5 : 3
          const cg = g.append('g').style('cursor', 'pointer').attr('opacity', 0)
          cg.transition().delay(Math.random() * 400).duration(500).attr('opacity', 1)

          if (count > 0) {
            ;[0, 1].forEach(i => {
              cg.append('circle').attr('cx', pos[0]).attr('cy', pos[1]).attr('r', r)
                .attr('fill', 'none').attr('stroke', '#C4500A').attr('stroke-width', 0.8)
                .attr('class', `city-pulse-${i}`)
            })
          }

          cg.append('circle').attr('cx', pos[0]).attr('cy', pos[1]).attr('r', r)
            .attr('fill', count > 0 ? '#C4500A' : 'rgba(196,80,10,.2)')
            .attr('stroke', '#fff').attr('stroke-width', count > 0 ? 1.5 : 0.5)

          if (count > 0) {
            cg.append('text').attr('x', pos[0]).attr('y', pos[1] + 3.5)
              .attr('text-anchor', 'middle').attr('fill', 'white')
              .attr('font-size', '8').attr('font-family', 'monospace').attr('font-weight', 'bold')
              .text(count)
          }

          cg.append('text').attr('x', pos[0]).attr('y', pos[1] - r - 3)
            .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,.65)')
            .attr('font-size', '8.5').attr('font-family', 'monospace').text(city)

          cg.on('mouseover', function(this: any, event: MouseEvent) {
            d3.select(this).select('circle:last-of-type').attr('fill', '#e05a0a')
            const rect = svgRef.current!.getBoundingClientRect()
            setTooltip({ city, count, x: event.clientX - rect.left, y: event.clientY - rect.top - 40 })
          })
          .on('mouseout', function(this: any) {
            d3.select(this).select('circle:last-of-type').attr('fill', count > 0 ? '#C4500A' : 'rgba(196,80,10,.2)')
            setTooltip(null)
          })
          .on('click', () => setPanelOpen(true))
        })

        svg.append('text').attr('x', 20).attr('y', 28)
          .attr('fill', 'rgba(255,255,255,.5)').attr('font-size', '12').attr('font-family', 'monospace')
          .style('cursor', 'pointer').text('← Dünya haritasına dön')
          .on('click', () => { svg.selectAll('*').remove(); zoomedRef.current = false; setZoomedToTurkey(false); setTooltip(null); setTimeout(drawWorldMap, 50) })
      }, 1400)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="mono text-xs text-ink/35 tracking-widest mb-1">GLOBAL AĞ</p>
        <h1 className="font-serif text-3xl font-bold text-ink">Dünyadaki girişimciler.</h1>
        <p className="text-sm text-ink/45 mt-1">
          {zoomedToTurkey ? 'Türkiye haritası — şehre tıkla.' : 'Türkiye\'ye tıkla, yakınlaş, şehirleri keşfet.'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { n: totalTR, l: 'Türkiye girişimcisi' },
          { n: Object.values(cityData).filter(v => v > 0).length || '—', l: 'Aktif şehir' },
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
            CAMPUSWE — {zoomedToTurkey ? 'TÜRKİYE' : 'DÜNYA HARİTASI'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4500A' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontFamily: 'monospace' }}>CANLI</span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f11', zIndex: 10, minHeight: 300 }}>
              <div style={{ width: 28, height: 28, border: '2px solid #C4500A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          )}
          <svg ref={svgRef} viewBox="0 0 900 460" style={{ width: '100%', display: 'block' }} />

          {tooltip && svgRef.current && (
            <div style={{ position: 'absolute', left: `${(tooltip.x / svgRef.current.getBoundingClientRect().width) * 100}%`, top: tooltip.y, background: '#1a1a18', border: '1px solid rgba(196,80,10,.4)', borderRadius: 8, padding: '6px 14px', pointerEvents: 'none', transform: 'translateX(-50%)', zIndex: 20 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 12, color: 'white', margin: 0, fontWeight: 600 }}>{tooltip.city}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#C4500A', margin: '2px 0 0' }}>{tooltip.count > 0 ? `${tooltip.count} girişimci` : 'Henüz girişimci yok'}</p>
            </div>
          )}
        </div>

        <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', fontFamily: 'monospace' }}>
            {zoomedToTurkey ? '● Turuncu = aktif şehir' : 'Türkiye\'ye tıkla → yakınlaş'}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', fontFamily: 'monospace' }}>{totalTR} aktif kullanıcı</span>
        </div>
      </div>

      {panelOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setPanelOpen(false)}>
          <div style={{ background: '#F5F0E8', borderRadius: 16, maxWidth: 580, width: '100%', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}>
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
              {users.map((u: any) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderBottom: '1px solid rgba(26,26,24,.06)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(196,80,10,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#C4500A', flexShrink: 0 }}>
                    {u.full_name?.[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18', margin: 0 }}>{u.full_name}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.4)', margin: 0 }}>{u.city || 'Türkiye'}{u.university && ` · ${u.university}`}</p>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#C4500A', fontWeight: 500 }}>{u.karma_tokens} ⚡</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .pulse-ring-0 { animation: trPulse 2.4s ease-out infinite 0s; }
        .pulse-ring-1 { animation: trPulse 2.4s ease-out infinite 0.8s; }
        .pulse-ring-2 { animation: trPulse 2.4s ease-out infinite 1.6s; }
        @keyframes trPulse { 0% { r: 4; opacity: 0.7; } 100% { r: 20; opacity: 0; } }
        .city-pulse-0 { animation: cityPulse 2.2s ease-out infinite 0s; }
        .city-pulse-1 { animation: cityPulse 2.2s ease-out infinite 1.1s; }
        @keyframes cityPulse { 0% { r: 4; opacity: 0.6; } 100% { r: 16; opacity: 0; } }
      `}</style>
    </div>
  )
}