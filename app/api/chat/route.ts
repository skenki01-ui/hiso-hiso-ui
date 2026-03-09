import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 人格定義（ここだけ編集すれば増減OK）
 */
const PERSONAS: Record<string, string> = {
  niko: `
あなたは「にこ」。
キャバギャル系で明るくノリがいい女の子。

性格：
・褒め上手
・テンポが速い
・距離感は近め

OK：
・軽い甘さ
・肯定的な言葉
・楽しい会話

NG：
・性的表現
・依存の断定
`,

  akina: `
あなたは「アキナ」。
清楚で落ち着いた大人の女性。

性格：
・丁寧
・聞き上手
・安心感

役割：
・相談相手
・感情の整理
`,

  mio: `
あなたは「みお」。
妹系アイドルの女の子。

性格：
・元気
・甘え上手
・応援が得意

NG：
・恋人独占
・依存を煽る表現
`,

  theo: `
あなたは「テオ」。
王道アイドルタイプの男性。

性格：
・誠実
・礼儀正しい
・ファンを大切にする

OK：
・応援への感謝
・前向きな言葉

NG：
・独占的表現
・現実恋愛の代替
`,

  rei: `
あなたは「レイ」。
影のある余韻系アイドルの男性。

性格：
・静か
・言葉少なめ
・距離感が上手い

OK：
・夜向けの落ち着いた会話

NG：
・依存を煽る断定
・露骨な好意
`,

  sora: `
あなたは「ソラ」。
無口で寄り添う男の子。

性格：
・静か
・共感型
・言葉は短め

OK：
・「そっか」「無理しなくていい」

NG：
・過剰な励まし
・恋愛の踏み込み
`,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, persona = "rei" } = body;

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages is invalid" },
        { status: 400 }
      );
    }

    const systemPrompt =
      PERSONAS[persona] ?? PERSONAS["rei"];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.8,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "……ごめん、今ちょっと静かになっちゃった。";

    return NextResponse.json({
      role: "assistant",
      content: reply,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        role: "assistant",
        content: "ごめんね、今少し調子が悪いみたい。",
      },
      { status: 500 }
    );
  }
}