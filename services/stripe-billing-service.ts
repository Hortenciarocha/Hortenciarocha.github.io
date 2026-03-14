import { stripe, STRIPE_PLANS } from '@/lib/stripe'
import { db } from '@/lib/db'
import { AppError } from '@/lib/error-handler'
import type Stripe from 'stripe'

export class StripeBillingService {
  /**
   * Create Stripe customer
   */
  static async createCustomer(email: string, name?: string) {
    return stripe.customers.create({
      email,
      name,
    })
  }

  /**
   * Get or create customer
   */
  static async getOrCreateCustomer(workspaceId: string) {
    let subscription = await db.subscription.findFirst({
      where: { workspaceId },
    })

    if (subscription?.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(subscription.stripeCustomerId)
        return customer
      } catch (error) {
        // Customer not found, create new one
      }
    }

    const workspace = await db.workspace.findUniqueOrThrow({
      where: { id: workspaceId },
      include: { owner: true },
    })

    const customer = await this.createCustomer(
      workspace.owner.email || '',
      workspace.name
    )

    // Update subscription with customer ID
    if (subscription) {
      await db.subscription.update({
        where: { id: subscription.id },
        data: { stripeCustomerId: customer.id },
      })
    }

    return customer
  }

  /**
   * Create checkout session
   */
  static async createCheckoutSession(
    workspaceId: string,
    planId: 'free' | 'pro' | 'enterprise',
    successUrl: string,
    cancelUrl: string
  ) {
    const customer = await this.getOrCreateCustomer(workspaceId)
    const priceId = STRIPE_PLANS[planId].priceId

    if (!priceId) {
      throw new AppError(
        'INVALID_REQUEST',
        `Stripe price ID not configured for plan: ${planId}`
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        workspaceId,
        planId,
      },
    })

    return session
  }

  /**
   * Create billing portal session
   */
  static async createPortalSession(
    workspaceId: string,
    returnUrl: string
  ) {
    const customer = await this.getOrCreateCustomer(workspaceId)

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl,
    })

    return session
  }

  /**
   * Handle subscription created webhook
   */
  static async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const workspaceId = subscription.metadata?.workspaceId
    const planId = subscription.metadata?.planId

    if (!workspaceId || !planId) {
      throw new AppError('INVALID_REQUEST', 'Missing metadata in subscription')
    }

    await db.subscription.upsert({
      where: { workspaceId },
      create: {
        workspaceId,
        planId: planId as 'free' | 'pro' | 'enterprise',
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        status: 'active',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      update: {
        stripeSubscriptionId: subscription.id,
        status: 'active',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    })
  }

  /**
   * Handle subscription updated webhook
   */
  static async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const workspaceId = subscription.metadata?.workspaceId

    if (!workspaceId) {
      throw new AppError('INVALID_REQUEST', 'Missing workspaceId in metadata')
    }

    const status = subscription.status === 'active' ? 'active' : 'cancelled'

    await db.subscription.update({
      where: { workspaceId },
      data: {
        status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    })
  }

  /**
   * Handle subscription deleted webhook
   */
  static async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const workspaceId = subscription.metadata?.workspaceId

    if (!workspaceId) {
      throw new AppError('INVALID_REQUEST', 'Missing workspaceId in metadata')
    }

    await db.subscription.update({
      where: { workspaceId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
      },
    })
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(
    body: string,
    signature: string,
    secret: string
  ): Stripe.Event | null {
    try {
      return stripe.webhooks.constructEvent(body, signature, secret)
    } catch (error) {
      return null
    }
  }
}
