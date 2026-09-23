// api/confirm-payment.ts

import Stripe from "stripe";

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

    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        error: "session_id is missing",
      });
    }

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        error: "payment not completed",
      });
    }

    const userId = session.metadata?.user_id;
    const point = Number(session.metadata?.point || 0);

    if (!userId || !point) {
      return res.status(400).json({
        success: false,
        error: "metadata missing",
      });
    }

    const { createClient } = await import("@supabase/supabase-js");

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("point")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({
        success: false,
        error: "user not found",
      });
    }

    const currentPoint = Number(user.point || 0);
    const newPoint = currentPoint + point;

    const { error: updateError } = await supabase
      .from("users")
      .update({ point: newPoint })
      .eq("id", userId);

    if (updateError) {
      return res.status(500).json({
        success: false,
        error: "point update failed",
      });
    }

    return res.status(200).json({
      success: true,
      point: newPoint,
      addPoint: point,
      user_id: userId,
    });
  } catch (e: any) {
    console.error("confirm payment error:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "server error",
    });
  }
}