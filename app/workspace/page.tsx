import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WorkspacePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Önce kurucusu olduğu startupı bul
  const { data: ownStartup } = await supabase
    .from('startups')
    .select('slug')
    .eq('founder_id', user.id)
    .single()

  if (ownStartup?.slug) redirect(`/workspace/${ownStartup.slug}`)

  // Sonra üye olduğu startupı bul
  const { data: membership } = await supabase
    .from('startup_members')
    .select('startup:startups(slug)')
    .eq('user_id', user.id)
    .single()

  const memberSlug = (membership?.startup as any)?.slug
  if (memberSlug) redirect(`/workspace/${memberSlug}`)

  // İkisi de yoksa startup oluşturma sayfasına yönlendir
  redirect('/startup/new')
}