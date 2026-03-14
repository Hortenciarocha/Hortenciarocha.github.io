import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubscriptionService } from '@/services/subscription-service'
import { AppError, handleError } from '@/lib/error-handler'

export async function GET(
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

    if (!membership) {
      throw new AppError('FORBIDDEN', 'Sem acesso a este workspace', 403)
    }

    const subscription = await SubscriptionService.getSubscriptionByWorkspace(
      params.workspaceId
    )

    if (!subscription) {
      throw new AppError('NOT_FOUND', 'Subscrição não encontrada', 404)
    }

    return NextResponse.json(subscription)
  } catch (error) {
    return handleError(error)
  }
}
