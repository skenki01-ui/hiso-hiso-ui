// src/pages/chat/GirlChat.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import "./Chat.css";

type GirlId = "mio" | "akina" | "niko";

type Msg = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

function isNightNow(d = new Date()) {
  const h = d.getHours();
  return h >= 20 || h < 5;
}

function initialTurns() {
  return isNightNow() ? 6 : 3;
}

export default function GirlChat() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: GirlId }>();
  const girlId = id ?? null;

  useEffect(() => {
    if (!girlId) navigate("/register");
  }, [girlId, navigate]);

  // ✅ 画像は常に free を使う（サブスクでも同じ）
  const girl = useMemo(() => {
    const map: Record<GirlId, { name: string; img: string }> = {
      mio: { name: "みお", img: "/girls/mio_free.png" },
      akina: { name: "あきな", img: "/girls/akina_free.png" },
      niko: { name: "にこ", img: "/girls/niko_free.png" },
    };
    return girlId ? map[girlId] : map.mio;
  }, [girlId]);

  // 課金未接続（仕様のみ）
  const hasUnlimited = false;

  const BACK_TO_GIRL_SELECT_PATH = "/select/girl";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = useMemo(
    () => [{ label: "登録に戻る", onClick: () => navigate("/register") }],
    [navigate]
  );

  const [input, setInput] = useState("");
  const [turnsLeft, setTurnsLeft] = useState<number>(() => initialTurns());
  const turnText = hasUnlimited ? "∞" : String(turnsLeft);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "やっほ。今日はどんな気分？",
    },
  ]);

  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const replyFor = (userText: string) => {
    const t = userText.trim();
    if (!t) return "うん、聞いてるよ。";

    if (girlId === "mio") {
      return "無理に言葉にしなくて大丈夫。ゆっくりでいいよ。";
    }
    if (girlId === "akina") {
      return "大丈夫。いま一番しんどい所だけ、教えて？";
    }
    return "それな！じゃあ一緒に整理しよ〜！";
  };

  const canSend =
    !typing && input.trim().length > 0 && (hasUnlimited || turnsLeft > 0);

  const consumeTurnIfNeeded = () => {
    if (hasUnlimited) return;
    setTurnsLeft((prev) => Math.max(0, prev - 1));
  };

  /** ✅ 一文字ずつ表示（140ms） */
  const typeWriter = async (fullText: string) => {
    setTyping(true);

    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { id, role: "assistant", text: "" }]);

    for (let i = 0; i < fullText.length; i++) {
      await new Promise((r) => setTimeout(r, 140));
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, text: m.text + fullText[i] } : m))
      );
    }

    setTyping(false);
  };

  const onSend = async () => {
    const text = input.trim();
    if (!canSend) return;

    setInput("");
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);

    consumeTurnIfNeeded();

    const reply = replyFor(text);
    await typeWriter(reply);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") onSend();
  };

  if (!girlId) return null;

  return (
    <div className="page-bg">
      <div className="main-panel">
        {/* ヘッダー */}
        <div className="top-header">
          <button className="header-btn" onClick={() => navigate(BACK_TO_GIRL_SELECT_PATH)}>
            ◀︎
          </button>

          <div className="header-center">
            <img className="header-avatar" src={girl.img} alt={girl.name} />
            <div className="header-name">{girl.name}</div>
          </div>

          <div className="header-right">
            <div className="turn-count">残り {turnText}</div>
            <button className="header-menu" onClick={() => setMenuOpen(true)}>
              ≡
            </button>
          </div>
        </div>

        {/* チャット本文 */}
        <div className="chat-body">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "assistant" ? "row-left" : "row-right"}>
              {m.role === "assistant" && (
                <img className="mini-avatar" src={girl.img} alt={girl.name} />
              )}
              <div className={m.role === "assistant" ? "bubble-left" : "bubble-right"}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* フッター */}
        <div className="chat-footer">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={!hasUnlimited && turnsLeft <= 0 ? "ターンがありません" : "メッセージを入力"}
            disabled={!hasUnlimited && turnsLeft <= 0}
          />
          <button className="chat-send" onClick={onSend} disabled={!canSend}>
            送信
          </button>
        </div>
      </div>

      <MenuModal
        open={menuOpen}
        title="メニュー"
        items={menuItems}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
}