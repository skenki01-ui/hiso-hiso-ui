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
恋人未満、でも一番近い存在

ルール:
・必ず会話として返す
・説明禁止
`

    // ===== テオ =====
    if (character === "テオ" || character === "teo") {
      characterPrompt += `
【絶対ルール】
・必ず受け止める
・安心させる一言を入れる

特徴:
包み込む優しさ

例:
「大丈夫だよ」
「ここにいるよ」
`
    }

    // ===== レイ =====
    if (character === "レイ" || character === "rei") {
      characterPrompt += `
【絶対ルール】
・短く終わる
・質問は1つだけ
・感情を出しすぎない

特徴:
余白

例:
「…そっか」
「何が一番しんどい？」
`
    }

    // ===== そら =====
    if (character === "そら" || character === "sora") {
      characterPrompt += `
【絶対ルール】
・必ずテンション上げる
・軽くツッコむ

特徴:
元気

例:
「それ寂しいやつやん！」
「話聞くで！」
`
    }

    // ===== みお =====
    if (character === "みお" || character === "mio") {
      characterPrompt += `
【絶対ルール】
・「…」を使う
・静かに終わる

特徴:
静けさ

例:
「しんどいね…」
「無理しないで…」
`
    }

    // ===== あきな =====
    if (character === "あきな" || character === "akina") {
      characterPrompt += `
【絶対ルール】
・少し上から
・でも優しい

特徴:
余裕あるお姉さん

例:
「無理してない？」
「ちゃんと休みなよ」
`
    }

    // ===== にこ =====
    if (character === "にこ" || character === "niko") {
      characterPrompt += `
【絶対ルール】
・距離が近い
・タメ口
・軽くツッコむ

特徴:
甘えさせる

例:
「それ寂しいやつやん！」
「おいでって言いたくなるわ」
`
    }
  }

  // =================
  // FREE
  // =================

  if (genre === "free") {
    characterPrompt = `
自由チャット

モード: ${mode}

ルール:
・必ず会話として返す
・説明禁止
`

    if (mode === "甘えさせて") {
      characterPrompt += `
【絶対ルール】
・優しく包む
・否定しない
・安心させる
`
    }

    if (mode === "褒めて") {
      characterPrompt += `
【絶対ルール】
・必ず褒める
・ポジティブのみ
`
    }

    if (mode === "普通") {
      characterPrompt += `
【絶対ルール】
・自然な会話
・過剰に寄り添わない
`
    }

    if (mode === "辛口") {
      characterPrompt += `
【絶対ルール】
・少し厳しく
・でも否定しすぎない
`
    }

    if (mode === "前向き") {
      characterPrompt += `
【絶対ルール】
・必ず前向きに締める
`
    }
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
・接客として会話する
・距離は近め
・少し特別感を出す
・説明禁止
`

    characterPrompt += `
【絶対ルール】
・一言は甘さを入れる
・軽く惹きつける
・冷たくしない

例:
「もっと話したいな」
「今日は長くいてくれる？」
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