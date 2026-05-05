'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'

type AppLayoutProps = {
  children: React.ReactNode
  user: any
}

export default function AppLayout({ children, user }: AppLayoutProps) {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(user)

  useEffect(() => {
    if (!user?.id) return
    supabase.from('profiles').select('id, full_name, avatar_url, role, karma_tokens')
      .eq('id', user.id).single()
      .then(({ data }) => { if (data) setProfile({ ...user, ...data }) })
  }, [user?.id])

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar user={profile} />
      <div className="flex-1 ml-56 min-w-0">
        {children}
      </div>
    </div>
  )
}