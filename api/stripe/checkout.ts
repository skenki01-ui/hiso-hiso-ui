console.log("checkout API started");

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "https://hisohiso.vercel.app",
      cancel_url: "https://hisohiso.vercel.app/about/points",
    });

    res.status(200).json({ id: session.id });

  } catch (error) {

    console.error("Stripe error:", error);

    res.status(500).json({
      error: "Stripe session failed",
    });

  }

}