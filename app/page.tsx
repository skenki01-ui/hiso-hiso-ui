"use client";

import { useEffect, useState } from "react";

/* ===== 型 ===== */
type Message = {
  role: "user" | "assistant";
  content: string;
};

type Persona =
  | "theo"
  | "rei"
  | "sora"
  | "niko"
  | "akina"
  | "mio";

/* ===== 表示名 ===== */
const PERSONA_LABEL: Record<Persona, string> = {
  theo: "テオ",
  rei: "レイ",
  sora: "ソラ",
  niko: "にこ ✨",
  akina: "アキナ",
  mio: "みお",
};

/* ===== 初回メッセージ ===== */
const FIRST_LINE: Record<Persona, string> = {
  theo: "来てくれてありがとう。少し話そう。",
  rei: "…遅い時間だね。無理しなくていいよ。",
  sora: "そっか。ここ、静かだよ。",
  niko: "え、来てくれたの？今日ちょっと楽しくしよ✨\nね、なにから話す？",
  akina: "こんばんは。今日はどんな一日でしたか？",
  mio: "わっ！来てくれたんだ！なに話す？",
};

/* ===== ミッドナイト時間（20:00〜05:00） ===== */
const isMidnightTime = () => {
  const hour = new Date().getHours();
  return hour >= 20 || hour < 5;
};

export default function Page() {
  const [persona, setPersona] = useState<Persona>("rei");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [isNight, setIsNight] = useState(false);
  const [wasNight, setWasNight] = useState(false);

  /* ===== 人格切替 or 初回 ===== */
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: FIRST_LINE[persona],
      },
    ]);
  }, [persona]);

  /* ===== 時間監視 ===== */
  useEffect(() => {
    const checkTime = () => {
      const nowNight = isMidnightTime();
      setIsNight(nowNight);

      // 🌙 夜に切り替わった瞬間
      if (!wasNight && nowNight) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "……ミッドナイトの時間だよ。おかえり。",
          },
        ]);
      }

      setWasNight(nowNight);
    };

    checkTime();
    const timer = setInterval(checkTime, 60 * 1000);
    return () => clearInterval(timer);
  }, [wasNight]);

  /* ===== 送信 ===== */
  const sendMessage = async () => {
    if (!input.trim() || loading || !isNight) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          messages: nextMessages,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "……ごめん、今ちょっと静か。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* ヘッダー */}
      <div style={styles.header}>
        {PERSONA_LABEL[persona]}
      </div>

      {/* 人格選択 */}
      <div style={styles.selector}>
        {(Object.keys(PERSONA_LABEL) as Persona[]).map((p) => (
          <button
            key={p}
            onClick={() => setPersona(p)}
            style={{
              ...styles.selectBtn,
              ...(persona === p ? styles.selectActive : {}),
            }}
          >
            {PERSONA_LABEL[p]}
          </button>
        ))}
      </div>

      {/* チャット */}
      <div style={styles.chatArea}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              ...(m.role === "user"
                ? styles.userBubble
                : styles.aiBubble),
            }}
          >
            {m.content}
          </div>
        ))}

        {!isNight && (
          <div
            style={{
              ...styles.bubble,
              ...styles.aiBubble,
              opacity: 0.7,
            }}
          >
            今はミッドナイトの時間じゃないみたい。
            <br />
            また夜に話そう。
          </div>
        )}

        {loading && (
          <div
            style={{
              ...styles.bubble,
              ...styles.aiBubble,
            }}
          >
            …
          </div>
        )}
      </div>

      {/* 入力 */}
      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isNight
              ? "話しかけて…"
              : "ミッドナイトは20:00〜05:00"
          }
          disabled={!isNight}
          style={{
            ...styles.input,
            opacity: isNight ? 1 : 0.5,
          }}
          onKeyDown={(e) =>
            e.key === "Enter" && isNight && sendMessage()
          }
        />
        <button
          onClick={sendMessage}
          disabled={!isNight}
          style={{
            ...styles.button,
            opacity: isNight ? 1 : 0.5,
            cursor: isNight ? "pointer" : "not-allowed",
          }}
        >
          送信
        </button>
      </div>
    </div>
  );
}

/* ===== styles ===== */
const styles: Record<string, React.CSSProperties> = {
  page: {
    height: "100vh",
    background: "#0f0f14",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "12px",
    textAlign: "center",
    fontWeight: "bold",
    background: "#14141c",
    borderBottom: "1px solid #222",
  },
  selector: {
    display: "flex",
    gap: 8,
    padding: "8px 10px",
    background: "#14141c",
    borderBottom: "1px solid #222",
    overflowX: "auto",
  },
  selectBtn: {
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid #333",
    background: "#1f2937",
    color: "#fff",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  selectActive: {
    background: "#2563eb",
    borderColor: "#2563eb",
  },
  chatArea: {
    flex: 1,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },
  bubble: {
    padding: "10px 14px",
    borderRadius: 18,
    maxWidth: "75%",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "#2563eb",
  },
  aiBubble: {
    alignSelf: "flex-start",
    background: "#1f2937",
  },
  inputArea: {
    display: "flex",
    gap: 8,
    padding: 10,
    background: "#14141c",
    borderTop: "1px solid #222",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: 8,
    border: "none",
    outline: "none",
    background: "#1f2937",
    color: "#fff",
  },
  button: {
    padding: "0 16px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
};