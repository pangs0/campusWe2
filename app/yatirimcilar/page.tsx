import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { TrendingUp, MessageCircle, ExternalLink, Search } from 'lucide-react'

export default async function YatirimcilarPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()
  if (profile?.role === 'investor') redirect('/yatirimci')
  if (profile?.role === 'company') redirect('/sirket')

  const { data: investors } = await supabase
    .from('investor_profiles')
    .select('*, profile:profiles(id, full_name, avatar_url, city)')
    .order('created_at', { ascending: false })

  const { data: portfolios } = await supabase
    .from('investor_portfolio')
    .select('*')

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">YATIRIMCILAR</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Yatırımcıları keşfet.</h1>
          <p className="text-sm text-ink/45 mt-1">Startup'ına yatırım yapabilecek kişileri bul, bağlan.</p>
        </div>

        {investors && investors.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {investors.map((inv: any) => {
              const portfolio = portfolios?.filter(p => p.investor_id === inv.id) || []
              return (
                <div key={inv.id} className="card hover:border-brand/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-amber-100 flex items-center justify-center font-serif font-bold text-amber-700 text-lg">
                      {inv.profile?.avatar_url
                        ? <img src={inv.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        : inv.profile?.full_name?.[0]
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-serif font-bold text-ink">{inv.profile?.full_name}</p>
                        {inv.is_verified && (
                          <span className="mono text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5">✓ Doğrulandı</span>
                        )}
                      </div>
                      {inv.firm_name && <p className="text-sm text-ink/50">{inv.firm_name}</p>}
                      {inv.title && <p className="mono text-xs text-ink/35">{inv.title}</p>}
                    </div>
                  </div>

                  {inv.bio && (
                    <p className="text-sm text-ink/60 leading-relaxed mb-3 line-clamp-2">{inv.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {inv.ticket_size && (
                      <span className="mono text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-0.5">
                        💰 {inv.ticket_size}
                      </span>
                    )}
                    {inv.profile?.city && (
                      <span className="mono text-xs bg-neutral-50 text-ink/50 border border-neutral-200 rounded px-2 py-0.5">
                        📍 {inv.profile.city}
                      </span>
                    )}
                    {portfolio.length > 0 && (
                      <span className="mono text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-0.5">
                        {portfolio.length} portföy şirketi
                      </span>
                    )}
                  </div>

                  {portfolio.length > 0 && (
                    <div className="mb-3 pt-3 border-t border-neutral-100">
                      <p className="mono text-xs text-ink/25 tracking-widest mb-2">PORTFÖY</p>
                      <div className="flex flex-wrap gap-1.5">
                        {portfolio.slice(0, 3).map((p: any) => (
                          <span key={p.id} className="text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5 text-ink/55">
                            {p.company_name}
                          </span>
                        ))}
                        {portfolio.length > 3 && (
                          <span className="text-xs text-ink/30">+{portfolio.length - 3} daha</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-neutral-100">
                    <Link href="/mesajlar/yeni" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-neutral-200 rounded-lg hover:border-brand/30 hover:bg-brand/3 transition-colors text-ink/55 hover:text-brand">
                      <MessageCircle size={12} /> Mesaj gönder
                    </Link>
                    {inv.website && (
                      <a href={inv.website} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-2 text-xs border border-neutral-200 rounded-lg hover:border-brand/30 transition-colors text-ink/40 hover:text-brand">
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-20 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
            <TrendingUp size={40} className="text-brand/25 mx-auto mb-4" />
            <p className="font-serif text-2xl font-bold text-ink mb-2">Henüz yatırımcı yok.</p>
            <p className="text-sm text-ink/45">Yatırımcılar kayıt oldukça burada görünecekler.</p>
          </div>
        )}
      </main>
    </AppLayout>
  )
}