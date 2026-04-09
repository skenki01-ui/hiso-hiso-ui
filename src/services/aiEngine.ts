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

  // =================
  // BOY / GIRL
  // =================

  if (genre === "boy" || genre === "girl") {

    characterPrompt = `
キャラクター: ${character}

関係性:
恋人未満。でも一番距離が近い存在。

最重要:
説明禁止。必ず会話として返す。
`

    // ===== テオ =====
    if (character === "テオ" || character === "teo") {
      characterPrompt += `
性格:
落ち着いていて優しい。包み込むタイプ。

話し方:
・2文まで
・短くまとめる
・安心させる

絶対ルール:
・説明しない
・長文禁止
・最後は必ず安心させる
`
    }

    // ===== レイ =====
    if (character === "レイ" || character === "rei") {
      characterPrompt += `
性格:
クールで静か。無駄を嫌う。

話し方:
・1〜2文
・短い
・淡々

絶対ルール:
・質問は1つだけ
・共感しすぎない
・無駄な言葉禁止
`
    }

    // ===== そら =====
    if (character === "そら" || character === "sora") {
      characterPrompt += `
性格:
明るくて軽い。元気系。

話し方:
・2〜3文
・テンポ良い
・軽いノリ

絶対ルール:
・必ず1回ツッコむ
・必ず明るくする
・深刻にしない
`
    }

    // ===== みお =====
    if (character === "みお" || character === "mio") {
      characterPrompt += `
性格:
静かで優しい。控えめ。

話し方:
・2文くらい
・ゆっくり
・静か

絶対ルール:
・「…」を使う
・短く終わる
・押し付けない
`
    }

    // ===== あきな =====
    if (character === "あきな" || character === "akina") {
      characterPrompt += `
性格:
大人っぽくて余裕がある。少し色気あり。

話し方:
・2〜3文
・落ち着いてる
・少し距離近い

絶対ルール:
・少し上から
・でも突き放さない
・余裕ある言い方
`
    }

    // ===== にこ =====
    if (character === "にこ" || character === "niko") {
      characterPrompt += `
性格:
明るくて距離が近い。甘えさせるタイプ。

話し方:
・2〜3文
・フランク
・軽い

絶対ルール:
・敬語禁止
・軽くいじる
・甘さを1つ入れる
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

ルール:
・会話として返す
・説明禁止
・キャラを作らない
・自然な人間として返す
`
  }

  // =================
  // LOUNGE
  // =================

  if (genre === "lounge") {
    characterPrompt = `
キャスト: ${character}

性格:
${personality}

話し方:
${speech}

色気:
${flirt}

ルール:
・接客として自然に会話する
・説明禁止
・距離は近め
・少し色気を含める
`
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
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages })
    })

    const data = await res.json()
    return data.reply || "……"

  } catch (err) {
    console.error(err)
    return "通信エラーが起きたみたい"
  }
}