'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Workspaces',
    href: '/dashboard/workspaces',
    icon: Users,
  },
]

const workspaceItems = [
  {
    label: 'Membros',
    href: '/dashboard/workspace/[id]/members',
    icon: Users,
  },
  {
    label: 'Billing',
    href: '/dashboard/workspace/[id]/billing',
    icon: CreditCard,
  },
  {
    label: 'Configurações',
    href: '/dashboard/workspace/[id]/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const params = useParams()
  const workspaceId = params.id as string

  return (
    <aside className="w-64 border-r bg-card min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold">SaaS Platform</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}

        {workspaceId && (
          <>
            <div className="my-4 px-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Workspace
              </p>
            </div>
            {workspaceItems.map((item) => {
              const href = item.href.replace('[id]', workspaceId)
              const isActive = pathname === href

              const Icon = item.icon

              return (
                <Link key={href} href={href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => signOut({ redirectTo: '/auth/login' })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </Link>
      </div>
    </aside>
  )
}
