import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {

  try {

    const { priceId } = await req.json();

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

    return Response.json({ id: session.id });

  } catch (error: any) {

    console.log("STRIPE ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );

  }

}