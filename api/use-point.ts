import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {

    const { user_id, amount } = req.body

    // 現在ポイント取得
    const { data: user } = await supabase
      .from("users")
      .select("point")
      .eq("id", user_id)
      .single()

    if (!user) {
      return res.status(400).json({ success: false })
    }

    const newPoint = user.point - amount

    if (newPoint < 0) {
      return res.status(200).json({ success: false })
    }

    // 更新
    const { data } = await supabase
      .from("users")
      .update({ point: newPoint })
      .eq("id", user_id)
      .select()
      .single()

    return res.status(200).json({
      success: true,
      point: data.point
    })

  } catch (e) {

    console.error(e)

    return res.status(500).json({
      success: false
    })

  }
}