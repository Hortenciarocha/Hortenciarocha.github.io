'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PricingPlans } from '@/components/billing/pricing-plans'
import { AlertCircle } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number | null
  maxMembers: number
  maxWorkspaces: number
  features: string[]
}

interface Subscription {
  id: string
  workspaceId: string
  planId: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
}

export default function BillingPage() {
  const params = useParams()
  const workspaceId = params.id as string

  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Check for success/cancel query params
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('success')) {
      setSuccess('Assinatura atualizada com sucesso!')
      // Clear URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    if (searchParams.get('cancelled')) {
      setError('Checkout cancelado.')
      setTimeout(() => setError(null), 5000)
    }

    // Fetch plans and subscription
    const fetchData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          fetch('/api/billing/plans'),
          fetch(`/api/workspaces/${workspaceId}/subscription`),
        ])

        if (!plansRes.ok) throw new Error('Erro ao carregar planos')
        const plansData = await plansRes.json()
        setPlans(plansData)

        if (subRes.ok) {
          const subData = await subRes.json()
          setSubscription(subData)
        }
      } catch (err) {
        setError('Erro ao carregar dados de billing')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [workspaceId])

  const handlePortal = async () => {
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/billing/portal`,
        { method: 'POST' }
      )
      const data = await response.json()
      window.location.href = data.url
    } catch (err) {
      setError('Erro ao abrir portal de billing')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Carregando informações de billing...</p>
      </div>
    )
  }

  const currentPlan = plans.find((p) => p.id === subscription?.planId)
  const plansWithCurrent = plans.map((p) => ({
    ...p,
    current: p.id === subscription?.planId,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Gerencie seu plano e assinatura
        </p>
      </div>

      {success && (
        <Card className="p-4 border-green-500 bg-green-50">
          <p className="text-green-800">{success}</p>
        </Card>
      )}

      {error && (
        <Card className="p-4 border-red-500 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </Card>
      )}

      {subscription && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Assinatura Atual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Plano</p>
              <p className="text-lg font-semibold capitalize">
                {currentPlan?.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-lg font-semibold capitalize">
                {subscription.status === 'active' ? 'Ativo' : subscription.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Renovação</p>
              <p className="text-lg font-semibold">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <Button onClick={handlePortal} variant="outline">
            Gerenciar Assinatura
          </Button>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">Escolha seu plano</h2>
        <PricingPlans plans={plansWithCurrent} workspaceId={workspaceId} />
      </div>
    </div>
  )
}
