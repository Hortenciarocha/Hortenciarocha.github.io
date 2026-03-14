'use client'

import { useWorkspaces } from '@/hooks/use-workspace'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export function WorkspaceSwitcher() {
  const { workspaces, isLoading, activeWorkspace } = useWorkspaces()

  if (isLoading || workspaces.length === 0) {
    return (
      <Link href="/dashboard/workspaces">
        <Button variant="outline" size="sm">
          Workspaces
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {activeWorkspace?.name || workspaces[0]?.name || 'Workspaces'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Meus Workspaces ({workspaces.length})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((workspace) => (
          <Link key={workspace.id} href={`/dashboard/workspace/${workspace.id}`}>
            <DropdownMenuItem>
              <div className="flex items-center justify-between w-full">
                <span>{workspace.name}</span>
                {workspace.id === activeWorkspace?.id && (
                  <span className="text-xs text-primary">Ativo</span>
                )}
              </div>
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <Link href="/dashboard/workspaces">
          <DropdownMenuItem>Ver todos</DropdownMenuItem>
        </Link>
        <Link href="/dashboard/workspaces/new">
          <DropdownMenuItem>Novo workspace</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
