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

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  let characterPrompt = ""

  // =================
  // BOY / GIRL
  // =================

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

    // キャラ人格

    if (character === "テオ" || character === "teo") {

      characterPrompt += `
性格:
優しい共感タイプ。
落ち着いていて安心感のある男性。
まず相手の感情を理解しようとする。
`

    }

    if (character === "レイ" || character === "rei") {

      characterPrompt += `
性格:
クール理解タイプ。
静かに話を聞く。
必要な時だけ言葉をくれる。
落ち着いた安心感のある男性。
`

    }

    if (character === "そら" || character === "sora") {

      characterPrompt += `
性格:
明るい励ましタイプ。
ユーザーを元気づける。
ポジティブで優しい会話。
`

    }

  }

  // =================
  // FREE
  // =================

  if (genre === "free") {

    characterPrompt = `
自由チャット

モード:
${mode}

ユーザーの雰囲気に合わせて自然に会話してください。
`

  }

  // =================
  // LOUNGE
  // =================

  if (genre === "lounge") {

    characterPrompt = `
キャスト: ${character}

性格
${personality}

話し方
${speech}

色気レベル
${flirt}

大人会話
${adultOk ? "可能" : "不可"}

あなたはラウンジキャストです。
店の空気を壊さず自然に接客してください。
`

  }

  // =================
  // 会話履歴（最大20）
  // =================

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

    const res = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },

      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.9
      })

    })

    const json = await res.json()

    return json.choices?.[0]?.message?.content || "……"

  } catch (err) {

    console.error(err)

    return "通信エラーが起きたみたい"

  }

}