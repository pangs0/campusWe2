import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import KaynaklarClient from './KaynaklarClient'

const DEFAULT_RESOURCES = [
  { id: 'd1', title: 'Y Combinator Pitch Deck Rehberi', description: 'YC\'nin startup\'lar için hazırladığı kapsamlı pitch deck kılavuzu.', category: 'pitch_deck', url: 'https://www.ycombinator.com/library/4T-how-to-design-a-better-pitch-deck', is_free: true, likes: 24 },
  { id: 'd2', title: 'Türkiye Melek Yatırımcı Listesi', description: 'Türkiye\'deki aktif melek yatırımcıların listesi ve iletişim bilgileri.', category: 'yatirimci', url: 'https://www.ba-list.com', is_free: true, likes: 18 },
  { id: 'd3', title: 'Startup Şirket Kuruluş Rehberi', description: 'Türkiye\'de startup şirketi kurarken bilmeniz gerekenler.', category: 'hukuk', url: '#', is_free: true, likes: 12 },
  { id: 'd4', title: 'Finansal Model Şablonu', description: '12 aylık gelir-gider projeksiyonu için Excel şablonu.', category: 'finans', url: '#', is_free: true, likes: 15 },
  { id: 'd5', title: 'Growth Hacking Stratejileri', description: 'Early-stage startup\'lar için ücretsiz büyüme taktikleri.', category: 'pazarlama', url: '#', is_free: true, likes: 9 },
  { id: 'd6', title: 'MVP Geliştirme Kılavuzu', description: 'Minimum viable product\'ı en hızlı şekilde nasıl çıkarırsınız.', category: 'teknik', url: '#', is_free: true, likes: 21 },
  { id: 'd7', title: 'Notion Startup OS Şablonu', description: 'Tüm startup operasyonlarını tek yerde yönetmek için Notion şablonu.', category: 'teknik', url: '#', is_free: true, likes: 33 },
  { id: 'd8', title: 'Investor Update Email Şablonu', description: 'Yatırımcılara aylık güncelleme emaili nasıl yazılır.', category: 'yatirimci', url: '#', is_free: true, likes: 17 },
  { id: 'd9', title: 'KOSGEB Hibe Rehberi 2024', description: 'KOSGEB\'den hibe almak için başvuru süreci ve gereksinimler.', category: 'finans', url: '#', is_free: true, likes: 28 },
  { id: 'd10', title: 'Kullanıcı Görüşmesi Soru Listesi', description: 'Müşteri keşif görüşmelerinde sorulacak 30 soru.', category: 'pazarlama', url: '#', is_free: true, likes: 14 },
]

export default async function KaynakPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('id, full_name, avatar_url, role, karma_tokens').eq('id', user.id).single()

  const { data: resources } = await supabase
    .from('resources')
    .select('*, added_by_profile:profiles!resources_added_by_fkey(full_name)')
    .order('created_at', { ascending: false })

  const allResources = resources && resources.length > 0
    ? [...resources, ...DEFAULT_RESOURCES]
    : DEFAULT_RESOURCES

  return (
    <AppLayout user={user} profile={profile}>
      <main className="px-8 py-10">
        <KaynaklarClient userId={user!.id} resources={allResources} />
      </main>
    </AppLayout>
  )
}