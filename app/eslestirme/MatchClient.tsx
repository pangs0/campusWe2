'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Check, X, Send, Star } from 'lucide-react'

type Props = {
  currentUser: any
  candidates: any[]
  startups: { id: string; name: string }[]
  sentIds: string[]
  receivedRequests: any[]
}

export default function MatchClient({ currentUser, candidates, startups, sentIds, receivedRequests }: Props) {
  const supabase = createClient()
  const [sent, setSent] = useState<Set<string>>(new Set(Array.from(sentIds)))
  const [requests, setRequests] = useState<any[]>(receivedRequests)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [selectedStartup, setSelectedStartup] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  async function sendRequest() {
    if (!selectedCandidate || !selectedStartup) return
    setSending(true)

    await supabase.from('cofounder_requests').insert({
      sender_id: currentUser.id,
      receiver_id: selectedCandidate.id,
      startup_id: selectedStartup,
      message,
      status: 'beklemede',
    })

    await supabase.from('notifications').insert({
      user_id: selectedCandidate.id,
      sender_id: currentUser.id,
      type: 'match',
      content: `${currentUser.full_name} seni co-founder olarak davet etti.`,
      link: '/eslestirme',
    })

    setSent(prev => new Set(Array.from(prev).concat(selectedCandidate.id)))
    setSelectedCandidate(null)
    setMessage('')
    setSending(false)
  }

  async function respondRequest(requestId: string, status: 'kabul' | 'red') {
    await supabase.from('cofounder_requests').update({ status }).eq('id', requestId)
    setRequests(prev => prev.filter(r => r.id !== requestId))
  }

  const mySkills = new Set(currentUser?.user_skills?.map((s: any) => s.skill_name.toLowerCase()) || [])

  function matchScore(candidate: any) {
    const theirSkills = candidate.user_skills?.map((s: any) => s.skill_name.toLowerCase()) || []
    const complementary = theirSkills.filter((s: string) => !mySkills.has(s)).length
    return complementary
  }

  const sorted = [...candidates].sort((a, b) => matchScore(b) - matchScore(a))

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        {requests.length > 0 && (
          <div className="mb-6">
            <h2 className="font-serif text-lg font-bold text-ink mb-3">Gelen istekler</h2>
            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="card flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand">
                      {req.sender?.avatar_url ? <img src={req.sender.avatar_url} alt="" className="w-full h-full object-cover" /> : req.sender?.full_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">{req.sender?.full_name}</p>
                      <p className="text-xs text-ink/45">{req.startup?.name} için co-founder arıyor</p>
                      {req.message && <p className="text-xs text-ink/55 mt-1 italic">"{req.message}"</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => respondRequest(req.id, 'kabul')} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                      <Check size={12} /> Kabul
                    </button>
                    <button onClick={() => respondRequest(req.id, 'red')} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1">
                      <X size={12} /> Reddet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="font-serif text-lg font-bold text-ink mb-3">Önerilen adaylar</h2>
        <div className="grid grid-cols-2 gap-4">
          {sorted.map(candidate => {
            const score = matchScore(candidate)
            const isSent = sent.has(candidate.id)
            return (
              <div key={candidate.id} className={`card hover:border-brand/30 transition-colors ${selectedCandidate?.id === candidate.id ? 'border-brand' : ''}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand">
                    {candidate.avatar_url ? <img src={candidate.avatar_url} alt="" className="w-full h-full object-cover" /> : candidate.full_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm">{candidate.full_name}</p>
                    <p className="mono text-xs text-ink/35 truncate">{candidate.university}</p>
                  </div>
                  {score > 0 && (
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star size={11} className="fill-amber-500" />
                      <span className="mono text-xs">{score}</span>
                    </div>
                  )}
                </div>

                {candidate.user_skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {candidate.user_skills.slice(0, 4).map((s: any) => (
                      <span key={s.id} className={`mono text-xs rounded px-2 py-0.5 border ${mySkills.has(s.skill_name.toLowerCase()) ? 'bg-neutral-50 text-ink/30 border-neutral-100' : 'bg-brand/8 text-brand border-brand/15'}`}>
                        {s.skill_name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 text-brand text-xs">
                    <span>⚡</span>
                    <span className="mono">{candidate.karma_tokens}</span>
                  </div>
                  <div className="flex-1" />
                  {isSent ? (
                    <span className="mono text-xs text-ink/35 flex items-center gap-1"><Check size={11} /> Gönderildi</span>
                  ) : (
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="btn-primary py-1 px-3 text-xs"
                    >
                      Davet et
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {sorted.length === 0 && (
          <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
            <Users size={36} className="text-brand/25 mx-auto mb-3" />
            <p className="font-serif text-xl font-bold text-ink mb-1">Henüz aday yok.</p>
            <p className="text-sm text-ink/45">Topluluk büyüdükçe adaylar görünecek.</p>
          </div>
        )}
      </div>

      <div>
        {selectedCandidate ? (
          <div className="card sticky top-6">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">DAVET GÖNDER</p>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-brand/15 flex items-center justify-center font-serif font-bold text-brand">
                {selectedCandidate.avatar_url ? <img src={selectedCandidate.avatar_url} alt="" className="w-full h-full object-cover" /> : selectedCandidate.full_name?.[0]}
              </div>
              <div>
                <p className="font-medium text-ink text-sm">{selectedCandidate.full_name}</p>
                <p className="mono text-xs text-ink/35">{selectedCandidate.university}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="label">Hangi startup için?</label>
                <select className="input" value={selectedStartup} onChange={e => setSelectedStartup(e.target.value)}>
                  <option value="">Seç</option>
                  {startups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Mesajın</label>
                <textarea className="input resize-none" rows={3} placeholder="Neden bu kişiyi co-founder olarak istiyorsun?" value={message} onChange={e => setMessage(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedCandidate(null)} className="btn-secondary flex-1 text-xs py-2">İptal</button>
                <button onClick={sendRequest} disabled={sending || !selectedStartup} className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5 disabled:opacity-40">
                  <Send size={12} /> {sending ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card sticky top-6">
            <p className="mono text-xs text-ink/35 tracking-widest mb-3">NASIL ÇALIŞIR</p>
            <div className="space-y-3">
              {[
                { n: '1', t: 'Aday seç', d: 'Sana tamamlayıcı yeteneklere sahip birini bul.' },
                { n: '2', t: 'Davet gönder', d: 'Hangi startup için aradığını ve mesajını yaz.' },
                { n: '3', t: 'Ekip ol', d: 'Karşı taraf kabul ederse birlikte çalışmaya başlayın.' },
              ].map(s => (
                <div key={s.n} className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center mono text-xs font-bold text-brand flex-shrink-0">{s.n}</div>
                  <div>
                    <p className="font-medium text-ink text-xs mb-0.5">{s.t}</p>
                    <p className="text-xs text-ink/45 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}