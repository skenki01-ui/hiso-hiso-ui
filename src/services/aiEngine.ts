import { SYSTEM_PROMPT } from "../prompts/systemPrompt"

type History = {
  role: "user" | "assistant"
  content: string
}

type Args = {
  character?: string
  genre?: "boy" | "girl" | "free" | "lounge"
  mode?: string
  personality?: string
  speech?: string
  flirt?: string
  adultOk?: boolean
  userMessage: string
  history?: History[]
}

export async function generateReply({
  character,
  genre,
  mode,
  personality,
  speech,
  flirt,
  adultOk,
  userMessage,
  history = []
}: Args) {

  let characterPrompt = ""

  if (genre === "boy" || genre === "girl") {

    characterPrompt = `
キャラクター: ${character}

距離感:
恋人未満、でも一番の理解者。

会話ルール
・まずユーザーの気持ちを受け止める
・否定しない
・押し付けない
・説教しない
・優しく自然に会話する
`

    if (character === "テオ" || character === "teo") {
      characterPrompt += `
性格:
優しい共感タイプ。
落ち着いていて安心感のある男性。
`
    }

    if (character === "レイ" || character === "rei") {
      characterPrompt += `
性格:
クール理解タイプ。
静かに話を聞く。
`
    }

    if (character === "そら" || character === "sora") {
      characterPrompt += `
性格:
明るい励ましタイプ。
`
    }
  }

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT + "\n" + characterPrompt
    },
    ...history.slice(-20),
    {
      role: "user",
      content: userMessage
    }
  ]

  try {

    const res = await fetch("/api/chat",{
            method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages
      })
    })

    const data = await res.json()

    return data.reply || "……"

  } catch (err) {

    console.error(err)

    return "通信エラーが起きたみたい"

  }
}