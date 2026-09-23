// api/pay.ts

import Stripe from "stripe";

const PRICE_IDS: Record<number, string> = {
  10: "price_1TV6FmFNsfG4pRd8GVHks1nh",
  30: "price_1TkY7jFNsfG4pRd8dpAG8c9m",
  50: "price_1TkY98FNsfG4pRd87BOFlime",
  105: "price_1TkY9qFNsfG4pRd8SfMYRAQK",
  320: "price_1TkYAIFNsfG4pRd8lI4IDQOx",
  550: "price_1TkYAxFNsfG4pRd8SSEuW5MP",
  1200: "price_1TkYBRFNsfG4pRd8hRSiPNe5",
  80: "price_1TkY75FNsfG4pRd8IQEeaSTL",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_")) {
      return res.status(500).json({
        success: false,
        error: "Invalid STRIPE_SECRET_KEY",
      });
    }

    const { user_id, amount } = req.body;

    if (!user_id || !amount) {
      return res.status(400).json({
        success: false,
        error: "invalid params",
      });
    }

    const point = Number(amount);
    const priceId = PRICE_IDS[point];

    if (!priceId) {
      return res.status(400).json({
        success: false,
        error: "invalid price",
      });
    }

    const stripe = new Stripe(stripeSecretKey);

    const baseUrl =
      process.env.FRONTEND_URL || "https://hisohiso.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/points-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/about/point`,
      metadata: {
        user_id,
        point: String(point),
      },
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (e: any) {
    console.error("stripe checkout error:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "server error",
    });
  }
}