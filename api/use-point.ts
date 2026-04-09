export default function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { user_id, amount } = req.body

  console.log("use-point:", user_id, amount)

  return res.status(200).json({
    success: true,
    point: 999
  })
}