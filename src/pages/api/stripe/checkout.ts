import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

export async function createCheckout(priceId: string, userId: string, point: number) {

  const session = await stripe.checkout.sessions.create({

    mode: "payment",

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    metadata: {
      userId: userId,
      point: point.toString()
    },

    success_url: window.location.origin + "/about/points",
    cancel_url: window.location.origin + "/about/points",
  });

  return session.url;

}