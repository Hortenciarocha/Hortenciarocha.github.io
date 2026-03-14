import { NextResponse } from 'next/server'
import { SubscriptionService } from '@/services/subscription-service'

export async function GET() {
  try {
    const plans = await SubscriptionService.getAllPlans()
    return NextResponse.json(plans)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}
