'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number | null
  maxMembers: number
  maxWorkspaces: number
  features: string[]
  current?: boolean
}

interface PricingCardProps {
  plan: Plan
  workspaceId: string
  onSelectPlan: (planId: string) => Promise<void>
  isLoading?: boolean
}

function PricingCard({ plan, onSelectPlan, isLoading }: PricingCardProps) {
  const [loading, setLoading] = useState(false)

  const handleSelectPlan = async () => {
    setLoading(true)
    try {
      await onSelectPlan(plan.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`p-6 flex flex-col ${plan.current ? 'border-primary' : ''}`}>
      <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
      <div className="mb-4">
        {plan.price === null ? (
          <p className="text-sm text-muted-foreground">Preço customizado</p>
        ) : (
          <>
            <p className="text-3xl font-bold">R$ {plan.price}</p>
            <p className="text-sm text-muted-foreground">/mês</p>
          </>
        )}
      </div>

      <div className="mb-6 flex-1">
        <p className="text-sm font-medium mb-3">Inclui:</p>
        <ul className="space-y-2">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={handleSelectPlan}
        disabled={loading || isLoading || plan.current}
        className="w-full"
        variant={plan.current ? 'outline' : 'default'}
      >
        {loading ? 'Processando...' : plan.current ? 'Plano Atual' : 'Escolher'}
      </Button>
    </Card>
  )
}

export function PricingPlans({ plans, workspaceId }: { plans: Plan[]; workspaceId: string }) {
  const [loading, setLoading] = useState(false)

  const handleSelectPlan = async (planId: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/billing/checkout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao processar checkout')
      }

      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          workspaceId={workspaceId}
          onSelectPlan={handleSelectPlan}
          isLoading={loading}
        />
      ))}
    </div>
  )
}
