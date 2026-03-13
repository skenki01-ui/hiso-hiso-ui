import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { priceId } = body;

    if (!priceId) {
      return res.status(400).json({ error: "priceId is required" });
    }

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

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.log("STRIPE ERROR", error);

    return res.status(500).json({
      error: error?.message || "Stripe session failed",
    });
  }
}