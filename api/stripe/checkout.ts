import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    res.status(405).end();
    return;
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
      success_url: "https://your-domain.com/success",
      cancel_url: "https://your-domain.com/cancel",
    });

    res.status(200).json({ id: session.id });

  } catch (err) {
    res.status(500).json({ error: err });
  }
}