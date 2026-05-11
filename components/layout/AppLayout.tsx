import Sidebar from '@/components/layout/Sidebar'

type AppLayoutProps = {
  children: React.ReactNode
  user: any
  profile?: any
}

export default function AppLayout({ children, user, profile }: AppLayoutProps) {
  const sidebarUser = {
    ...user,
    ...profile,
    id: user?.id || profile?.id,
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar user={sidebarUser} />
      <div className="flex-1 md:ml-56 min-w-0 transition-none">
        {children}
      </div>
    </div>
  )
}