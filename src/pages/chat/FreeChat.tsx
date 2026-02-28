import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import "./Chat.css";

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

const TYPE_SPEED = 140;

export default function FreeChat() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const genre = params.get("genre") ?? "";
  const mode = params.get("mode") ?? "";

  /* ===== 名前（未記入OK） ===== */
  const [aiName, setAiName] = useState("");

  /* ===== メニュー ===== */
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = useMemo(
    () => [{ label: "閉じる", onClick: () => setMenuOpen(false) }],
    []
  );

  /* ===== ターン ===== */
  const [turnsLeft, setTurnsLeft] = useState<number>(() => initialTurns());

  /* ===== チャット ===== */
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "私の名前、つけてくれる？未記入でもいいよ。",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const canSend = !typing && input.trim().length > 0 && turnsLeft > 0;

  const replyBase = () => {
    const name = aiName.trim();
    if (name) return `${name}はちゃんと聞いてるよ。`;
    return "うん、聞いてるよ。";
  };

  /* ===== 一文字演出 ===== */
  const typeWriter = async (text: string) => {
    setTyping(true);
    const id = crypto.randomUUID();
    setMessages((p) => [...p, { id, role: "assistant", text: "" }]);

    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, TYPE_SPEED));
      setMessages((p) =>
        p.map((m) => (m.id === id ? { ...m, text: m.text + text[i] } : m))
      );
    }
    setTyping(false);
  };

  const onSend = async () => {
    if (!canSend) return;

    const text = input.trim();
    setInput("");

    setMessages((p) => [...p, { id: crypto.randomUUID(), role: "user", text }]);
    setTurnsLeft((p) => Math.max(0, p - 1));

    const reply = replyBase();
    await typeWriter(reply);
  };

  return (
    <div className="page-bg">
      <div className="main-panel">
        {/* ===== ヘッダー ===== */}
        <div className="top-header">
          <button className="header-btn" onClick={() => navigate("/select/free")}>
            ◀︎
          </button>

          <div className="header-center">
            <input
              className="header-ai-name"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              placeholder="なまえをつけてあげて"
              maxLength={10}
            />
          </div>

          <div className="header-right">
            <div className="turn-count">残り {turnsLeft}</div>
            <button className="header-menu" onClick={() => setMenuOpen(true)}>
              ≡
            </button>
          </div>
        </div>

        {/* ===== 本文 ===== */}
        <div className="chat-body">
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === "assistant" ? "row-left" : "row-right"}
            >
              <div
                className={
                  m.role === "assistant" ? "bubble-left" : "bubble-right"
                }
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* ===== 入力 ===== */}
        <div className="chat-footer">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder={
              turnsLeft <= 0 ? "ターンがありません" : "メッセージを入力"
            }
            disabled={turnsLeft <= 0}
          />
          <button className="chat-send" onClick={onSend} disabled={!canSend}>
            送信
          </button>
        </div>
      </div>

      {/* ===== メニュー ===== */}
      <MenuModal
        open={menuOpen}
        title="メニュー"
        items={menuItems}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
}