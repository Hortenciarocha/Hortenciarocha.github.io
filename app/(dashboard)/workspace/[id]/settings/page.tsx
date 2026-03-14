'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const params = useParams()
  const workspaceId = params.id as string

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description }),
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao salvar configurações')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWorkspace = async () => {
    if (!window.confirm('Tem certeza? Essa ação não pode ser desfeita.')) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Erro ao deletar workspace')
      }

      window.location.href = '/dashboard/workspaces'
    } catch (err) {
      setError('Erro ao deletar workspace')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configurações do Workspace</h1>
        <p className="text-muted-foreground">
          Gerencie as informações do seu workspace
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
          <p className="text-green-800">Configurações salvas com sucesso!</p>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Informações do Workspace</h2>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Workspace</Label>
            <Input
              id="name"
              placeholder="Meu Workspace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Descrição do seu workspace"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 border-red-500">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Zona de Perigo</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Deletar um workspace removerá permanentemente todos os seus dados.
        </p>
        <Button
          variant="destructive"
          onClick={handleDeleteWorkspace}
          disabled={loading}
        >
          {loading ? 'Deletando...' : 'Deletar Workspace'}
        </Button>
      </Card>
    </div>
  )
}
