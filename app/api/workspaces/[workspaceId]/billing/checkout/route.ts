import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { StripeBillingService } from '@/services/stripe-billing-service'
import { AppError, handleError } from '@/lib/error-handler'

export async function POST(
  req: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const session = await auth()

    if (!session) {
      throw new AppError('UNAUTHORIZED', 'Não autenticado', 401)
    }

    // Verify user has access to workspace
    const membership = await db.workspaceMember.findFirst({
      where: {
        userId: session.user?.id,
        workspaceId: params.workspaceId,
      },
    })

    if (!membership || membership.role !== 'admin') {
      throw new AppError('FORBIDDEN', 'Sem permissão para gerenciar billing', 403)
    }

    const body = await req.json()
    const { planId } = body

    if (!planId || !['free', 'pro', 'enterprise'].includes(planId)) {
      throw new AppError('INVALID_REQUEST', 'planeId inválido')
    }

    const baseUrl = new URL(req.url).origin

    const checkoutSession = await StripeBillingService.createCheckoutSession(
      params.workspaceId,
      planId,
      `${baseUrl}/dashboard/workspace/${params.workspaceId}/billing?success=true`,
      `${baseUrl}/dashboard/workspace/${params.workspaceId}/billing?cancelled=true`
    )

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    return handleError(error)
  }
}
