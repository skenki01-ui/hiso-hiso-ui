export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).end()
  }

  try {

    const { user_id, amount } = req.body

    // 仮処理（テスト用）
    console.log("ポイント消費:", user_id, amount)

    return res.status(200).json({
      success: true,
      point: 999 // 仮
    })

  } catch (e) {

    return res.status(500).json({
      success: false
    })

  }
}