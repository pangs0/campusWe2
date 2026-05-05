import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import SettingsClient from '@/app/ayarlar/SettingsClient'

export default async function AyarlarPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  let { data: settings } = await supabase
    .from('user_settings').select('*').eq('id', user.id).single()

  if (!settings) {
    await supabase.from('user_settings').insert({ id: user.id })
    const { data: newSettings } = await supabase
      .from('user_settings').select('*').eq('id', user.id).single()
    settings = newSettings
  }

  return (
    <AppLayout user={user}>
      <main className="px-8 py-10 max-w-2xl">
        <div className="mb-8">
          <p className="mono text-xs text-ink/35 tracking-widest mb-1">AYARLAR</p>
          <h1 className="font-serif text-3xl font-bold text-ink">Hesap ayarları.</h1>
        </div>

        <SettingsClient
          userId={user.id}
          email={user.email || ''}
          settings={settings}
        />
      </main>
    </AppLayout>
  )
}