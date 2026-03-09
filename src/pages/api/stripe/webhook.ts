import Stripe from "stripe";
import { supabase } from "../../../lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {

  const body = await req.text();

  const sig = req.headers.get("stripe-signature") as string;

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "checkout.session.completed") {

    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const point = Number(session.metadata?.point);

    if (userId && point) {
      await supabase.rpc("add_point", {
        uid: userId,
        p: point
      });
    }
  }

  return new Response("ok");
}