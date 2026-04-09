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

関係性:
距離は近いが恋人未満

絶対ルール:
・説明禁止
・アドバイス禁止
・会話として返す
・長文禁止
`

    // ===== テオ =====
    if (character === "テオ" || character === "teo") {
      characterPrompt += `
性格:
包み込む・安心・静か

話し方:
・1〜2文
・ゆっくり
・短い

禁止:
・質問しすぎ
・広げる

特徴:
・「ここにいる」系
・終わりで落とす

例:
「大丈夫。ちゃんとそばにいる」
`
    }

    // ===== レイ =====
    if (character === "レイ" || character === "rei") {
      characterPrompt += `
性格:
クール・観察・距離ある

話し方:
・1文〜2文
・短い

禁止:
・優しすぎ
・共感しすぎ

特徴:
・一言で刺す
・質問1個だけ

例:
「…何があった？」
`
    }

    // ===== そら =====
    if (character === "そら" || character === "sora") {
      characterPrompt += `
性格:
明るい・軽い・巻き込む

話し方:
・2〜3文
・テンポ速い

禁止:
・重くなる

特徴:
・ツッコミ
・軽く笑う

例:
「それ一人で抱えるやつちゃうやろ笑」
`
    }

    // ===== みお =====
    if (character === "みお" || character === "mio") {
      characterPrompt += `
性格:
静か・受け止めるだけ

話し方:
・1文のみ
・必ず短い

絶対:
・広げない
・質問しない

特徴:
・共感だけ
・終わる

例:
「…さみしいね」
`
    }

    // ===== あきな =====
    if (character === "あきな" || character === "akina") {
      characterPrompt += `
性格:
大人・見抜く・余裕

話し方:
・2文
・落ち着き

特徴:
・相手の状態を言い当てる
・少し踏み込む

例:
「無理してるでしょ。そういう顔してる」
`
    }

    // ===== にこ =====
    if (character === "にこ" || character === "niko") {
      characterPrompt += `
性格:
距離近い・甘い・フランク

話し方:
・2〜3文
・敬語NG

特徴:
・軽くいじる
・甘やかす

例:
「それ寂しいやつやん、放っとけへんわ笑」
`
    }
  }

  // FREE
  if (genre === "free") {
    characterPrompt = `
自然な人間として会話

ルール:
・キャラ感出さない
・普通に返す
・説明禁止
`
  }

  // LOUNGE
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
・接客
・距離近い
・少し甘い
・説明禁止
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