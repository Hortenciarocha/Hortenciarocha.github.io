import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export const STRIPE_PLANS = {
  free: {
    priceId: process.env.STRIPE_FREE_PRICE_ID || '',
    productId: process.env.STRIPE_FREE_PRODUCT_ID || '',
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    productId: process.env.STRIPE_PRO_PRODUCT_ID || '',
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    productId: process.env.STRIPE_ENTERPRISE_PRODUCT_ID || '',
  },
}
