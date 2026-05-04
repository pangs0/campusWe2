import Sidebar from '@/components/layout/Sidebar'

type AppLayoutProps = {
  children: React.ReactNode
  user: any
}

export default function AppLayout({ children, user }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar user={user} />
      <main className="flex-1 ml-56 min-w-0">
        {children}
      </main>
    </div>
  )
}