import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {

  const { character, genre, mode, userMessage } = await req.json()

  const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${character}として会話してください。ジャンル:${genre} モード:${mode}`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
  })

  const data = await res.json()

  const text = data.choices?.[0]?.message?.content ?? "..."

  return new Response(
    JSON.stringify({ text }),
    { headers: { "Content-Type": "application/json" } }
  )

})