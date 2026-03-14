import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { UserService } from '@/services/user-service'
import { AppError, handleError } from '@/lib/error-handler'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      throw new AppError('UNAUTHORIZED', 'Não autenticado', 401)
    }

    const user = await UserService.getUserById(session.user?.id || '')

    if (!user) {
      throw new AppError('NOT_FOUND', 'Usuário não encontrado', 404)
    }

    return NextResponse.json(user)
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      throw new AppError('UNAUTHORIZED', 'Não autenticado', 401)
    }

    const body = await req.json()

    const updatedUser = await UserService.updateUser(session.user?.id || '', {
      name: body.name,
      image: body.image,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return handleError(error)
  }
}
