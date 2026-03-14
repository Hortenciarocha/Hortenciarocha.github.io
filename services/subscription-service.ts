import { db } from '@/lib/db'
import { AppError } from '@/lib/error-handler'
import type { Subscription } from '@prisma/client'

export class SubscriptionService {
  /**
   * Get subscription by workspace ID
   */
  static async getSubscriptionByWorkspace(workspaceId: string): Promise<Subscription | null> {
    return db.subscription.findFirst({
      where: { workspaceId },
    })
  }

  /**
   * Create subscription for workspace
   */
  static async createSubscription(
    workspaceId: string,
    planId: string,
    stripeCustomerId?: string
  ): Promise<Subscription> {
    return db.subscription.create({
      data: {
        workspaceId,
        planId,
        stripeCustomerId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })
  }

  /**
   * Update subscription status
   */
  static async updateSubscriptionStatus(
    subscriptionId: string,
    status: string
  ): Promise<Subscription> {
    return db.subscription.update({
      where: { id: subscriptionId },
      data: { status },
    })
  }

  /**
   * Upgrade subscription plan
   */
  static async upgradeplan(
    subscriptionId: string,
    newPlanId: string
  ): Promise<Subscription> {
    const subscription = await db.subscription.findUniqueOrThrow({
      where: { id: subscriptionId },
    })

    if (subscription.planId === newPlanId) {
      throw new AppError('INVALID_REQUEST', 'O novo plano é igual ao plano atual')
    }

    return db.subscription.update({
      where: { id: subscriptionId },
      data: { planId: newPlanId },
    })
  }

  /**
   * Get subscription usage
   */
  static async getSubscriptionUsage(subscriptionId: string) {
    const subscription = await db.subscription.findUniqueOrThrow({
      where: { id: subscriptionId },
      include: { workspace: true },
    })

    const workspaceMembersCount = await db.workspaceMember.count({
      where: { workspaceId: subscription.workspaceId },
    })

    return {
      subscriptionId,
      workspaceId: subscription.workspaceId,
      plan: subscription.planId,
      members: workspaceMembersCount,
      status: subscription.status,
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    return db.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
      },
    })
  }

  /**
   * Get all plans
   */
  static async getAllPlans() {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        maxMembers: 3,
        maxWorkspaces: 1,
        features: ['Basic features', '3 membros', '1 workspace'],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 29,
        maxMembers: 50,
        maxWorkspaces: 10,
        features: ['Todos recursos Pro', '50 membros', '10 workspaces', 'Suporte prioritário'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: null,
        maxMembers: -1,
        maxWorkspaces: -1,
        features: ['Customizado', 'Membros ilimitados', 'Suporte 24/7', 'SLA'],
      },
    ]
  }
}
