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

    if (!membership) {
      throw new AppError('FORBIDDEN', 'Sem acesso a este workspace', 403)
    }

    const baseUrl = new URL(req.url).origin

    const portalSession = await StripeBillingService.createPortalSession(
      params.workspaceId,
      `${baseUrl}/dashboard/workspace/${params.workspaceId}/billing`
    )

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    return handleError(error)
  }
}
