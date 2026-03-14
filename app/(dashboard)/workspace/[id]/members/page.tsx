'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Trash2 } from 'lucide-react'

export default function MembersPage() {
  const params = useParams()
  const workspaceId = params.id as string

  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/members`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao adicionar membro')
      }

      setEmail('')
      setRole('member')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      // Reload members list would go here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Remover este membro?')) return

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/members/${memberId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Erro ao remover membro')
      }

      // Reload members list would go here
    } catch (err) {
      setError('Erro ao remover membro')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Membros do Workspace</h1>
        <p className="text-muted-foreground">
          Gerencie os membros do seu workspace
        </p>
      </div>

      {error && (
        <Card className="p-4 border-red-500 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </Card>
      )}

      {success && (
        <Card className="p-4 border-green-500 bg-green-50">
          <p className="text-green-800">Membro adicionado com sucesso!</p>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Adicionar Novo Membro</h2>
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="novo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Função</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Membro</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Adicionando...' : 'Adicionar Membro'}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Membros Atuais</h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Lista de membros carregada dinamicamente
          </p>
          <div className="border rounded-lg p-4 text-center text-muted-foreground">
            Nenhum membro adicionado ainda
          </div>
        </div>
      </Card>
    </div>
  )
}
