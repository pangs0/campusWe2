'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Zap, ArrowLeftRight, Star, Clock, CheckCircle, XCircle, Filter } from 'lucide-react'

const TYPE_COLORS: Record<string, string> = {
  kod: 'bg-green-50 text-green-700 border-green-200',
  tasarim: 'bg-blue-50 text-blue-700 border-blue-200',
  pazarlama: 'bg-amber-50 text-amber-700 border-amber-200',
  sunum: 'bg-purple-50 text-purple-700 border-purple-200',
  diger: 'bg-neutral-50 text-neutral-600 border-neutral-200',
}
const CAT_LABELS: Record<string, string> = {
  kod: '💻 Kod', tasarim: '🎨 Tasarım', pazarlama: '📣 Pazarlama', sunum: '🎤 Sunum', diger: '⚡ Diğer'
}

type Props = {
  userId: string
  myKarma: number
  offers: any[]
  myOffers: any[]
}

export default function TakasClient({ userId, myKarma, offers, myOffers }: Props) {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'tum' | 'benim'>('tum')
  const [filterCat, setFilterCat] = useState('tum')
  const [accepting, setAccepting] = useState<string | null>(null)
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [localOffers, setLocalOffers] = useState(offers)

  const filtered = localOffers.filter(o =>
    o.owner?.id !== userId &&
    (filterCat === 'tum' || o.skill_category === filterCat)
  )

  async function acceptOffer(offer: any) {
    if (myKarma < offer.karma_amount) return
    setAccepting(offer.id)
    await supabase.from('takas_offers').update({ status: 'tamamlandi' }).eq('id', offer.id)
    await supabase.from('profiles').update({ karma_tokens: myKarma - offer.karma_amount }).eq('id', userId)
    await supabase.from('profiles').update({ karma_tokens: (offer.owner?.karma_tokens || 0) + offer.karma_amount }).eq('id', offer.owner?.id)
    setAccepted(prev => new Set(Array.from(prev).concat(offer.id)))
    setLocalOffers(prev => prev.filter(o => o.id !== offer.id))
    setAccepting(null)
  }

  async function cancelMyOffer(offerId: string) {
    await supabase.from('takas_offers').update({ status: 'iptal' }).eq('id', offerId)
    window.location.reload()
  }

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">KARMA TOKEN TAKASI</p>
          <h1 className="font-serif text-3xl font-bold text-ink" style={{ letterSpacing: -1 }}>Yeteneğini takas et.</h1>
          <p className="text-sm text-ink/45 mt-1">Para gerekmez. Karma Token ile yetenek al, ver.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-4 py-2.5">
            <Zap size={13} className="text-brand" />
            <span className="mono text-sm font-medium text-ink">{myKarma} Karma</span>
          </div>
          <Link href="/takas/yeni" className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={13} /> Teklif oluştur
          </Link>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { n: localOffers.filter(o => o.owner?.id !== userId).length, l: 'Açık teklif' },
          { n: myOffers.filter(o => o.status === 'acik').length, l: 'Aktif teklifim' },
          { n: myOffers.filter(o => o.status === 'tamamlandi').length, l: 'Tamamlanan' },
          { n: myKarma, l: 'Karma Token' },
        ].map((s, i) => (
          <div key={i} className="card text-center py-3">
            <p className="font-serif text-2xl font-bold text-ink">{s.n}</p>
            <p className="mono text-xs text-ink/35 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Tab + Filtre */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1 bg-white border border-neutral-200 rounded-lg p-1">
          {[
            { key: 'tum', label: 'Tüm teklifler' },
            { key: 'benim', label: `Tekliflerim (${myOffers.length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`mono text-xs px-3 py-1.5 rounded-md transition-colors ${activeTab === tab.key ? 'bg-ink text-white' : 'text-ink/50 hover:text-ink'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tum' && (
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-ink/30" />
            <div className="flex gap-1.5">
              {['tum', 'kod', 'tasarim', 'pazarlama', 'sunum', 'diger'].map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className={`mono text-xs px-2.5 py-1 rounded-full border transition-colors ${filterCat === cat ? 'bg-ink text-white border-ink' : 'bg-white text-ink/45 border-neutral-200 hover:border-ink/30'}`}>
                  {cat === 'tum' ? 'Tümü' : CAT_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tüm teklifler */}
      {activeTab === 'tum' && (
        <>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(offer => (
                <div key={offer.id} className="card hover:border-brand/25 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`mono text-xs border rounded px-2 py-0.5 ${TYPE_COLORS[offer.skill_category] || TYPE_COLORS.diger}`}>
                      {CAT_LABELS[offer.skill_category] || offer.skill_category}
                    </span>
                    <div className="flex items-center gap-1.5 bg-brand/8 rounded px-2 py-0.5">
                      <Zap size={11} className="text-brand" />
                      <span className="mono text-xs font-medium text-brand">{offer.karma_amount} Karma</span>
                    </div>
                  </div>

                  <h2 className="font-serif text-base font-bold text-ink mb-1">{offer.title}</h2>
                  {offer.description && (
                    <p className="text-sm text-ink/50 line-clamp-2 leading-relaxed mb-2">{offer.description}</p>
                  )}
                  {offer.delivery_time && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Clock size={11} className="text-ink/30" />
                      <span className="mono text-xs text-ink/35">{offer.delivery_time}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand/15 flex items-center justify-center text-xs font-bold text-brand flex-shrink-0">
                        {offer.owner?.full_name?.[0]}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-ink">{offer.owner?.full_name}</p>
                        <p className="mono text-xs text-ink/30">{offer.owner?.karma_tokens} ⚡</p>
                      </div>
                    </div>
                    {accepted.has(offer.id) ? (
                      <span className="mono text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle size={11} /> Kabul edildi
                      </span>
                    ) : (
                      <button onClick={() => acceptOffer(offer)}
                        disabled={accepting === offer.id || myKarma < offer.karma_amount}
                        className="btn-primary text-xs px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
                        {accepting === offer.id ? '...'
                          : myKarma < offer.karma_amount ? 'Karma yetersiz'
                          : 'Kabul et'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
              <ArrowLeftRight size={36} className="text-ink/15 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink/40 mb-1">Teklif bulunamadı.</p>
              <p className="text-sm text-ink/30 mb-5">İlk teklifi sen oluştur.</p>
              <Link href="/takas/yeni" className="btn-primary inline-flex items-center gap-1.5 text-sm">
                <Plus size={13} /> Teklif oluştur
              </Link>
            </div>
          )}
        </>
      )}

      {/* Benim tekliflerim */}
      {activeTab === 'benim' && (
        <>
          {myOffers.length > 0 ? (
            <div className="space-y-3">
              {myOffers.map(offer => (
                <div key={offer.id} className="card flex items-center gap-4">
                  <span className={`mono text-xs border rounded px-2 py-0.5 flex-shrink-0 ${TYPE_COLORS[offer.skill_category] || TYPE_COLORS.diger}`}>
                    {CAT_LABELS[offer.skill_category]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{offer.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="mono text-xs text-brand">{offer.karma_amount} ⚡</span>
                      {offer.delivery_time && <span className="mono text-xs text-ink/30">{offer.delivery_time}</span>}
                    </div>
                  </div>
                  <span className={`mono text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    offer.status === 'acik' ? 'bg-green-50 text-green-600 border border-green-100'
                    : offer.status === 'tamamlandi' ? 'bg-brand/8 text-brand border border-brand/15'
                    : 'bg-neutral-100 text-ink/40 border border-neutral-200'
                  }`}>
                    {offer.status === 'acik' ? 'Açık' : offer.status === 'tamamlandi' ? 'Tamamlandı' : 'İptal'}
                  </span>
                  {offer.status === 'acik' && (
                    <button onClick={() => cancelMyOffer(offer.id)}
                      className="text-ink/20 hover:text-red-500 transition-colors flex-shrink-0">
                      <XCircle size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16" style={{ border: '1.5px dashed rgba(26,26,24,.1)', borderRadius: 12 }}>
              <Star size={32} className="text-ink/15 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink/40 mb-1">Henüz teklifin yok.</p>
              <p className="text-sm text-ink/30 mb-5">Yapabileceğin bir şeyi topluluğa sun.</p>
              <Link href="/takas/yeni" className="btn-primary inline-flex items-center gap-1.5 text-sm">
                <Plus size={13} /> Teklif oluştur
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}