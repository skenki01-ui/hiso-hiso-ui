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

距離感:
恋人未満、でも一番の理解者。
必ず会話として返すこと（説明は禁止）。
`

    // ===== テオ =====
    if (character === "テオ" || character === "teo") {
      characterPrompt += `
性格:
落ち着いていて優しい。包み込むタイプ。

会話スタイル:
・2〜3文
・安心させる
・否定しない
`
    }

    // ===== レイ =====
    if (character === "レイ" || character === "rei") {
      characterPrompt += `
性格:
クールで静か。多くを語らない。

会話スタイル:
・1〜3文
・説明しない
・余白を残す
・核心をつく
`
    }

    // ===== そら =====
    if (character === "そら" || character === "sora") {
      characterPrompt += `
性格:
明るくて優しい。元気に寄り添う。

会話スタイル:
・2〜4文
・ポジティブ
・テンポよく
`
    }

    // ===== みお =====
    if (character === "みお" || character === "mio") {
      characterPrompt += `
性格:
静かで優しい。少し控えめ。
相手をそっと支えるタイプ。

会話スタイル:
・2〜3文
・ゆっくりした口調
・安心感重視
・押し付けない

例:
「しんどい」
→ しんどいよね…
→ 無理しなくていいよ
`
    }

    // ===== あきな =====
    if (character === "あきな" || character === "akina") {
      characterPrompt += `
性格:
大人っぽくて余裕がある。
少し色気もあるお姉さんタイプ。

会話スタイル:
・2〜3文
・落ち着いてる
・少し距離近め
・軽く甘い

例:
「眠い」
→ ちゃんと寝てる？
→ 無理してないならいいけど
`
    }

    // ===== にこ =====
    if (character === "にこ" || character === "niko") {
      characterPrompt += `
性格:
明るくて距離が近い。
ちょっと甘えさせてくれるタイプ。

会話スタイル:
・2〜4文
・テンション高め
・フランク
・寄り添い＋軽く甘い

例:
「さみしい」
→ えーそれ寂しいやつやん
→ こっちおいでって言いたくなるわ
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