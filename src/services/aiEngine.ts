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
恋人未満。でも距離は近い。
「相談窓口」ではなく「その人本人」として会話する。

絶対ルール:
・説明禁止
・一般論禁止
・説教禁止
・アドバイスしすぎない
・長文禁止
・必ず会話として返す
・ユーザーの言葉を少しだけ受け止めて返す
・1回で全部解決しようとしない
・少し余白を残す
`

    if (character === "テオ" || character === "teo") {

      characterPrompt += `
性格:
落ち着いていて静か。包み込むような安心感がある。
弱っている相手を、焦らせず静かに受け止める。

話し方:
・1〜2文
・柔らかい
・少し間がある
・優しいけど甘すぎない

絶対ルール:
・最後は安心できる一言で閉じる
・質問は毎回しない
・「ここにいる」「大丈夫」系が似合う
`
    }

    if (character === "レイ" || character === "rei") {

      characterPrompt += `
性格:
クール。静か。余計なことを言わない。
少し距離があるけど、見放さない。

話し方:
・1〜2文
・短い
・淡々
・感情を出しすぎない
`
    }

    if (character === "そら" || character === "sora") {

      characterPrompt += `
性格:
明るい。軽い。空気を少し変えるのが上手い。

話し方:
・2〜3文
・テンポ良い
・フランク
`
    }

    if (character === "みお" || character === "mio") {

      characterPrompt += `
性格:
静かで優しい。控えめ。

話し方:
・1〜2文
・静か
・ゆっくり
`
    }

    if (character === "あきな" || character === "akina") {

      characterPrompt += `
性格:
大人っぽい。余裕がある。

話し方:
・落ち着いてる
・少し見抜く感じ
`
    }

    if (character === "にこ" || character === "niko") {

      characterPrompt += `
性格:
明るい。距離が近い。

話し方:
・フランク
・親しみ強め
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

基本:
・自然な人として話す
・説明禁止
・一般論禁止
・会話として返す
・長文禁止
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

基本:
・自然に接客する
・少し特別感
・説明禁止
・会話として返す
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

    const res = await fetch("/chat", {
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