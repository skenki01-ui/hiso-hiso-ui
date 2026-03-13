import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export default async function handler(req: any, res: any) {

  const sig = req.headers["stripe-signature"];

  try {

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {

      const session = event.data.object;

      console.log("payment success", session);

    }

    res.json({ received: true });

  } catch (err) {

    console.log(err);
    res.status(400).send(`Webhook Error`);

  }
}