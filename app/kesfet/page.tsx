import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { Search, TrendingUp } from 'lucide-react'
import type { Startup } from '@/types'

const SECTORS = ['Tümü', 'EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'CleanTech', 'E-ticaret', 'SaaS', 'Yapay Zeka', 'Oyun', 'Diğer']
const STAGES = ['Tümü', 'fikir', 'mvp', 'traction', 'büyüme']

const stageColors: Record<string, string> = {
  fikir: 'bg-amber-50 text-amber-700 border-amber-200',
  mvp: 'bg-blue-50 text-blue-700 border-blue-200',
  traction: 'bg-purple-50 text-purple-700 border-purple-200',
  büyüme: 'bg-green-50 text-green-700 border-green-200',
}

export default async function KesfetPage({
  searchParams,
}: {
  searchParams: { sektor?: string; asama?: string; q?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('startups')
    .select('*, founder:profiles(full_name, username, university)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (searchParams.sektor && searchParams.sektor !== 'Tümü') {
    query = query.eq('sector', searchParams.sektor)
  }
  if (searchParams.asama && searchParams.asama !== 'Tümü') {
    query = query.eq('stage', searchParams.asama)
  }
  if (searchParams.q) {
    query = query.ilike('name', `%${searchParams.q}%`)
  }

  const { data: startups } = await query

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">TOPLULUK</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Startupları keşfet.</h1>
          <p className="text-sm text-ink/45 mt-1">
            {startups?.length || 0} startup bulundu
          </p>
        </div>

        {/* Arama */}
        <form method="GET" className="mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              name="q"
              type="text"
              defaultValue={searchParams.q}
              placeholder="Startup ara..."
              className="input pl-9"
            />
          </div>
        </form>

        {/* Filtreler */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">SEKTÖR</p>
            <div className="flex flex-wrap gap-1.5">
              {SECTORS.map(s => (
                <Link
                  key={s}
                  href={`/kesfet?sektor=${s}${searchParams.asama ? `&asama=${searchParams.asama}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                  className={`mono text-xs px-3 py-1 rounded border transition-colors ${
                    (searchParams.sektor || 'Tümü') === s
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/40'
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-2">AŞAMA</p>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map(s => (
                <Link
                  key={s}
                  href={`/kesfet?asama=${s}${searchParams.sektor ? `&sektor=${searchParams.sektor}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                  className={`mono text-xs px-3 py-1 rounded border transition-colors ${
                    (searchParams.asama || 'Tümü') === s
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/40'
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Startup listesi */}
        {startups && startups.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {startups.map((startup: Startup & { founder: any }) => (
              <Link
                key={startup.id}
                href={`/startup/${startup.slug}`}
                className="card block hover:border-brand/40 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-serif text-xl font-bold text-ink group-hover:text-brand transition-colors">
                    {startup.name}
                  </h2>
                  <span className={`mono text-xs border rounded px-2 py-0.5 ml-3 whitespace-nowrap ${stageColors[startup.stage] || 'bg-neutral-50 text-neutral-500 border-neutral-200'}`}>
                    {startup.stage}
                  </span>
                </div>

                {startup.description && (
                  <p className="text-sm text-ink/55 line-clamp-2 leading-relaxed mb-4">
                    {startup.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-brand/15 flex items-center justify-center text-xs font-bold text-brand">
                      {startup.founder?.full_name?.[0]}
                    </div>
                    <span className="text-xs text-ink/40">
                      {startup.founder?.full_name}
                      {startup.founder?.university && ` · ${startup.founder.university}`}
                    </span>
                  </div>
                  {startup.sector && (
                    <span className="mono text-xs text-ink/30">{startup.sector}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <TrendingUp size={40} className="text-ink/15 mx-auto mb-4" />
            <p className="text-ink/40 font-serif text-xl mb-2">Henüz startup yok.</p>
            <p className="text-sm text-ink/30 mb-6">İlk startup'ı sen oluştur.</p>
            <Link href="/startup/new" className="btn-primary inline-flex text-xs">
              Startup oluştur →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}