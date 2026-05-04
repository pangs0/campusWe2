import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { Plus, Zap, ArrowLeftRight } from 'lucide-react'

export default async function TakasPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: offers } = await supabase
    .from('takas_offers')
    .select('*, owner:profiles(full_name, username, university, karma_tokens)')
    .eq('status', 'acik')
    .order('created_at', { ascending: false })

  const { data: myProfile } = user ? await supabase
    .from('profiles')
    .select('karma_tokens')
    .eq('id', user.id)
    .single() : { data: null }

  const typeColors: Record<string, string> = {
    sunum: 'bg-purple-50 text-purple-700 border-purple-200',
    tasarim: 'bg-blue-50 text-blue-700 border-blue-200',
    kod: 'bg-green-50 text-green-700 border-green-200',
    pazarlama: 'bg-amber-50 text-amber-700 border-amber-200',
    diger: 'bg-neutral-50 text-neutral-600 border-neutral-200',
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">KARMA TOKEN TAKASI</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Yeteneğini takas et.</h1>
            <p className="text-sm text-ink/45 mt-1">Para gerekmez. Karma Token ile yetenek al, ver.</p>
          </div>
          <div className="flex items-center gap-3">
            {user && myProfile && (
              <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-4 py-2">
                <Zap size={13} className="text-brand" />
                <span className="mono text-sm font-medium text-ink">{myProfile.karma_tokens} Karma</span>
              </div>
            )}
            {user && (
              <Link href="/takas/yeni" className="btn-primary flex items-center gap-1.5 text-xs">
                <Plus size={13} />
                Teklif oluştur
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { n: offers?.length || 0, l: 'Açık teklif' },
            { n: '100', l: 'Başlangıç Karma' },
            { n: 'Sınırsız', l: 'Takas imkanı' },
          ].map((s, i) => (
            <div key={i} className="card text-center py-4">
              <div className="font-serif text-2xl font-bold text-ink">{s.n}</div>
              <div className="mono text-xs text-ink/35 mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {offers && offers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {offers.map((offer: any) => (
              <div key={offer.id} className="card hover:border-brand/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className={`mono text-xs border rounded px-2 py-0.5 ${typeColors[offer.skill_category] || typeColors.diger}`}>
                    {offer.skill_category}
                  </span>
                  <div className="flex items-center gap-1.5 bg-brand/8 rounded px-2 py-0.5">
                    <Zap size={11} className="text-brand" />
                    <span className="mono text-xs font-medium text-brand">{offer.karma_amount} Karma</span>
                  </div>
                </div>

                <h2 className="font-serif text-lg font-bold text-ink mb-1">{offer.title}</h2>
                {offer.description && (
                  <p className="text-sm text-ink/50 line-clamp-2 leading-relaxed mb-3">
                    {offer.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-brand/15 flex items-center justify-center text-xs font-bold text-brand">
                      {offer.owner?.full_name?.[0]}
                    </div>
                    <span className="text-xs text-ink/40">{offer.owner?.full_name}</span>
                  </div>
                  {user && user.id !== offer.owner_id && (
                    <TakasButton offerId={offer.id} offerOwnerId={offer.owner_id} karmaAmount={offer.karma_amount} userId={user.id} myKarma={myProfile?.karma_tokens || 0} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ArrowLeftRight size={40} className="text-ink/15 mx-auto mb-4" />
            <p className="text-ink/40 font-serif text-xl mb-2">Henüz teklif yok.</p>
            <p className="text-sm text-ink/30 mb-6">İlk teklifi sen oluştur.</p>
            {user && (
              <Link href="/takas/yeni" className="btn-primary inline-flex items-center gap-1.5 text-xs">
                <Plus size={13} />
                Teklif oluştur
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function TakasButton({ offerId, offerOwnerId, karmaAmount, userId, myKarma }: any) {
  const canAfford = myKarma >= karmaAmount
  return (
    <form action="/api/takas/kabul" method="POST">
      <input type="hidden" name="offer_id" value={offerId} />
      <input type="hidden" name="offer_owner_id" value={offerOwnerId} />
      <input type="hidden" name="karma_amount" value={karmaAmount} />
      <button
        type="submit"
        disabled={!canAfford}
        className="btn-primary py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        title={!canAfford ? 'Yeterli Karma Token yok' : ''}
      >
        {canAfford ? 'Kabul et' : 'Karma yetersiz'}
      </button>
    </form>
  )
}