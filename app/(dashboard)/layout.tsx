import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <WorkspaceSwitcher />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session.user?.email}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
