import Stripe from 'stripe'

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined
}

// Use the version string that matches the installed stripe package
const stripeInstance =
  globalForStripe.stripe ??
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (Stripe as any)(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

export const stripe = stripeInstance as Stripe

if (process.env.NODE_ENV !== 'production') globalForStripe.stripe = stripe
