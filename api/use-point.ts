export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ success: false })
  }

  try {

    const { user_id, amount } = req.body

    if (!user_id || !amount) {
      return res.status(400).json({ success: false })
    }

    const { createClient } = await import("@supabase/supabase-js")

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 現在ポイント取得
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("point")
      .eq("id", user_id)
      .single()

    if (fetchError || !user) {
      return res.status(500).json({ success: false })
    }

    if (user.point < amount) {
      return res.status(200).json({
        success: false,
        point: user.point
      })
    }

    const newPoint = user.point - amount

    // 更新
    const { error: updateError } = await supabase
      .from("users")
      .update({ point: newPoint })
      .eq("id", user_id)

    if (updateError) {
      return res.status(500).json({ success: false })
    }

    return res.status(200).json({
      success: true,
      point: newPoint
    })

  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false })
  }
}