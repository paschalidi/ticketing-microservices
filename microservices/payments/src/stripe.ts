import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY_TEST!, {
  apiVersion: '2023-08-16',

})