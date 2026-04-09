export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {

    const { user_id, amount } = req.body

    if (!user_id || !amount) {
      return res.status(400).json({ error: "invalid params" })
    }

    // 仮でポイント追加（後でPay.jp連携する）
    const addPoint = amount / 10

    // ここで本当はDB更新（Supabase）
    // 今は仮レス
    return res.status(200).json({
      success: true,
      addPoint
    })

  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: "server error" })
  }
}