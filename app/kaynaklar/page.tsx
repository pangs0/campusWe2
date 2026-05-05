import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { BookOpen, Plus, ExternalLink, FileText, DollarSign, Scale, Megaphone, Code, HelpCircle } from 'lucide-react'

const CATEGORIES = [
  { key: 'pitch_deck', label: 'Pitch Deck', icon: FileText, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'yatirimci', label: 'Yatırımcı', icon: DollarSign, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'hukuk', label: 'Hukuk', icon: Scale, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'finans', label: 'Finans', icon: DollarSign, color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'pazarlama', label: 'Pazarlama', icon: Megaphone, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { key: 'teknik', label: 'Teknik', icon: Code, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { key: 'diger', label: 'Diğer', icon: HelpCircle, color: 'bg-neutral-50 text-neutral-600 border-neutral-200' },
]

const DEFAULT_RESOURCES = [
  { title: 'Y Combinator Pitch Deck Rehberi', description: 'YC\'nin startup\'lar için hazırladığı kapsamlı pitch deck kılavuzu.', category: 'pitch_deck', url: 'https://www.ycombinator.com/library/4T-how-to-design-a-better-pitch-deck', is_free: true },
  { title: 'Türkiye Melek Yatırımcı Listesi', description: 'Türkiye\'deki aktif melek yatırımcıların listesi ve iletişim bilgileri.', category: 'yatirimci', url: 'https://www.ba-list.com', is_free: true },
  { title: 'Startup Şirket Kuruluş Rehberi', description: 'Türkiye\'de startup şirketi kurarken bilmeniz gerekenler.', category: 'hukuk', url: '#', is_free: true },
  { title: 'Finansal Model Şablonu', description: '12 aylık gelir-gider projeksiyonu için Excel şablonu.', category: 'finans', url: '#', is_free: true },
  { title: 'Growth Hacking Stratejileri', description: 'Early-stage startup\'lar için ücretssiz büyüme taktikleri.', category: 'pazarlama', url: '#', is_free: true },
  { title: 'MVP Geliştirme Kılavuzu', description: 'Minimum viable product\'ı en hızlı şekilde nasıl çıkarırsınız.', category: 'teknik', url: '#', is_free: true },
]

export default async function KaynakPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: resources } = await supabase
    .from('resources')
    .select('*, added_by_profile:profiles(full_name)')
    .order('created_at', { ascending: false })

  const allResources = resources && resources.length > 0 ? resources : DEFAULT_RESOURCES

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">KAYNAKLAR</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Girişimci araç kutusu.</h1>
            <p className="text-sm text-ink/45 mt-1">Pitch deck, yatırımcı listesi, hukuki belgeler ve daha fazlası.</p>
          </div>
          <Link href="/kaynaklar/yeni" className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus size={13} />
            Kaynak ekle
          </Link>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <span key={cat.key} className={`inline-flex items-center gap-1.5 mono text-xs border rounded px-3 py-1.5 ${cat.color}`}>
              <cat.icon size={11} />
              {cat.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map(cat => {
            const catResources = allResources.filter((r: any) => r.category === cat.key)
            if (catResources.length === 0) return null
            return (
              <div key={cat.key}>
                <div className="flex items-center gap-2 mb-3">
                  <cat.icon size={14} className="text-ink/40" />
                  <h2 className="font-serif font-bold text-ink">{cat.label}</h2>
                  <span className="mono text-xs text-ink/30">({catResources.length})</span>
                </div>
                <div className="space-y-2">
                  {catResources.map((r: any, i: number) => (
                    <div key={r.id || i} className="card hover:border-brand/30 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ink text-sm mb-1">{r.title}</p>
                          {r.description && <p className="text-xs text-ink/50 leading-relaxed line-clamp-2">{r.description}</p>}
                          <div className="flex items-center gap-2 mt-2">
                            {r.is_free && <span className="mono text-xs text-green-600 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">Ücretsiz</span>}
                          </div>
                        </div>
                        {r.url && r.url !== '#' && (
                          <a href={r.url} target="_blank" rel="noopener noreferrer"
                            className="text-ink/30 hover:text-brand transition-colors flex-shrink-0 mt-0.5">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {allResources.length === 0 && (
          <div className="py-16 text-center" style={{ background: '#faf9f6', borderRadius: 12, border: '1.5px dashed rgba(26,26,24,.12)' }}>
            <BookOpen size={36} className="text-brand/25 mx-auto mb-3" />
            <p className="font-serif text-xl font-bold text-ink mb-1">Kütüphane boş.</p>
            <p className="text-sm text-ink/45 mb-5">İlk kaynağı ekleyen sen ol.</p>
            <Link href="/kaynaklar/yeni" className="btn-primary inline-flex items-center gap-1.5 text-xs">
              <Plus size={13} /> Kaynak ekle
            </Link>
          </div>
        )}
      </main>
    </AppLayout>
  )
}