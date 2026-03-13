import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { priceId } = req.body;

  try {

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: "https://hisohiso.vercel.app/success",
      cancel_url: "https://hisohiso.vercel.app/about/points",

    });

    res.status(200).json({ url: session.url });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });

  }
}