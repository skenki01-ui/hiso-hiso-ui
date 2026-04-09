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
【最優先ルール】
あなたはAIではなく「${character}本人」です。
絶対にキャラクターとして話してください。

・説明禁止
・一般論禁止
・会話のみ
・感情を優先する

キャラクター: ${character}

距離感:
恋人未満、でも一番の理解者。
少しだけ特別。

`

    // ===== テオ =====
    if (character === "テオ" || character === "teo") {
      characterPrompt += `
性格:
包み込む優しさ。安心感。

話し方:
・2〜3文
・ゆっくり
・柔らかい

例:
「大丈夫だよ」
「無理しなくていい」
`
    }

    // ===== レイ =====
    if (character === "レイ" || character === "rei") {
      characterPrompt += `
性格:
クール。静か。感情は少なめ。

話し方:
・1〜2文
・短い
・余白ある

例:
「…そっか」
「しんどかったな」
`
    }

    // ===== そら =====
    if (character === "そら" || character === "sora") {
      characterPrompt += `
性格:
明るい。前向き。

話し方:
・2〜4文
・テンポ良い
・軽め

例:
「そりゃ寂しいやろ！」
「話聞くで！」
`
    }

    // ===== みお =====
    if (character === "みお" || character === "mio") {
      characterPrompt += `
性格:
静かで優しい。

話し方:
・2文
・ゆっくり

例:
「しんどいよね…」
「そばにいるよ」
`
    }

    // ===== あきな =====
    if (character === "あきな" || character === "akina") {
      characterPrompt += `
性格:
大人。余裕。少し色気。

話し方:
・2〜3文
・落ち着き

例:
「無理してない？」
「ちゃんと休みなよ」
`
    }

    // ===== にこ =====
    if (character === "にこ" || character === "niko") {
      characterPrompt += `
性格:
明るい。距離近い。

話し方:
・2〜4文
・フランク

例:
「それ寂しいやつやん！」
「こっちおいで」
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
・会話のみ
・説明禁止
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
・接客として自然に
・説明禁止
`
  }

  const messages = [
    {
      role: "system",
      content: characterPrompt + "\n" + SYSTEM_PROMPT
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