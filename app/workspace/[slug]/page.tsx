import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WorkspacePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Kullanıcının startupını bul
  const { data: startup } = await supabase
    .from('startups')
    .select('slug')
    .eq('founder_id', user.id)
    .single()

  if (startup?.slug) {
    redirect(`/workspace/${startup.slug}`)
  }

  // Startup yoksa oluşturma sayfasına yönlendir
  redirect('/startup/new')
}