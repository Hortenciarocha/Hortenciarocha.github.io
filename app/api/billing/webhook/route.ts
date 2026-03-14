import { NextRequest, NextResponse } from 'next/server'
import { StripeBillingService } from '@/services/stripe-billing-service'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') || ''
    const secret = process.env.STRIPE_WEBHOOK_SECRET || ''

    if (!secret) {
      console.error('[v0] STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const event = StripeBillingService.verifyWebhookSignature(
      body,
      signature,
      secret
    )

    if (!event) {
      console.error('[v0] Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log(`[v0] Processing Stripe webhook: ${event.type}`)

    switch (event.type) {
      case 'customer.subscription.created':
        await StripeBillingService.handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        )
        break

      case 'customer.subscription.updated':
        await StripeBillingService.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        )
        break

      case 'customer.subscription.deleted':
        await StripeBillingService.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        )
        break

      case 'invoice.payment_succeeded':
        console.log('[v0] Payment succeeded')
        break

      case 'invoice.payment_failed':
        console.error('[v0] Payment failed')
        break

      default:
        console.log(`[v0] Unhandled webhook event: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
