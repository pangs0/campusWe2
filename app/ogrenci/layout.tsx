import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OgrenciLayout from './OgrenciLayout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/register/ogrenci')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  if (profile?.role !== 'student') redirect('/dashboard')

  return <OgrenciLayout user={user} profile={profile}>{children}</OgrenciLayout>
}