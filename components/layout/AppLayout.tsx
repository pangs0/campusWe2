import Sidebar from '@/components/layout/Sidebar'
import OnboardingModal from '@/components/ui/OnboardingModal'

type AppLayoutProps = {
  children: React.ReactNode
  user: any
  profile?: any
}

const SidebarComponent = Sidebar as any

export default function AppLayout({ children, user, profile }: AppLayoutProps) {
  const sidebarUser = {
    ...user,
    ...profile,
    id: user?.id || profile?.id,
  }

  const isFounder = profile?.role === 'founder' || !profile?.role

  return (
    <div className="flex min-h-screen bg-cream">
      <SidebarComponent user={sidebarUser} />
      {/* Mobilde pt-16 — hamburger butonunun altına içerik gelsin */}
      <div className="flex-1 md:ml-56 min-w-0 pt-14 md:pt-0">
        {children}
      </div>
      {isFounder && user?.id && (
        <OnboardingModal userId={user.id} profile={profile} />
      )}
    </div>
  )
}