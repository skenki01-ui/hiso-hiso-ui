export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const { user_id, point } = req.body;

    if (!user_id || !point) {
      return res.status(400).json({
        success: false,
        error: "invalid params",
      });
    }

    const addPoint = Number(point);

    if (!Number.isFinite(addPoint) || addPoint <= 0) {
      return res.status(400).json({
        success: false,
        error: "invalid point",
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
      .eq("id", user_id)
      .single();

    if (fetchError || !user) {
      return res.status(500).json({
        success: false,
        error: "user not found",
      });
    }

    const currentPoint = Number(user.point || 0);
    const newPoint = currentPoint + addPoint;

    const { error: updateError } = await supabase
      .from("users")
      .update({ point: newPoint })
      .eq("id", user_id);

    if (updateError) {
      return res.status(500).json({
        success: false,
        error: "update failed",
      });
    }

    return res.status(200).json({
      success: true,
      point: newPoint,
      addPoint,
    });
  } catch (e: any) {
    console.error("add point error:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "server error",
    });
  }
}