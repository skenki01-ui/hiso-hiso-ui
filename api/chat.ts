export default async function handler(req: any, res: any) {
  try {
    const { messages } = req.body

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.8
      })
    })

    const data = await response.json()

    // 👇 ここ追加
    console.log("OPENAI RESPONSE:", data)

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        reply: "OpenAIエラー"
      })
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    })

  } catch (e) {
    console.error(e)
    res.status(500).json({ reply: "エラー" })
  }
}