import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function createCheckout(priceId: string) {

  let point = 0;

  if (priceId === import.meta.env.VITE_STRIPE_PRICE_100) point = 10;
  if (priceId === import.meta.env.VITE_STRIPE_PRICE_300) point = 30;
  if (priceId === import.meta.env.VITE_STRIPE_PRICE_500) point = 50;
  if (priceId === import.meta.env.VITE_STRIPE_PRICE_1000) point = 105;
  if (priceId === import.meta.env.VITE_STRIPE_PRICE_3000) point = 320;
  if (priceId === import.meta.env.VITE_STRIPE_PRICE_5000) point = 550;
  if (priceId === import.meta.env.VITE_STRIPE_PRICE_10000) point = 1200;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    mode: "payment",

    success_url:
      window.location.origin + "/purchase/points-success?p=" + point,

    cancel_url:
      window.location.origin + "/purchase/points",
  });

  return session.url;
}