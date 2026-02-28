// src/pages/chat/BoyChat.tsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import { buildCommonMenuItems } from "../components/menu/commonMenu";
import "./Chat.css";

type BoyId = "teo" | "rei" | "sora";
type Msg = { id: string; role: "assistant" | "user"; text: string };

function isNightNow() {
  const h = new Date().getHours();
  return h >= 20 || h < 5;
}

function initialTurns() {
  return isNightNow() ? 6 : 3;
}

export default function BoyChat() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: BoyId }>();
  if (!id) return null;

  const boy = useMemo(() => {
    const map: Record<BoyId, { name: string; img: string }> = {
      teo: { name: "テオ", img: "/boys/teo_free.png" },
      rei: { name: "レイ", img: "/boys/rei_free.png" },
      sora: { name: "そら", img: "/boys/sora_free.png" },
    };
    return map[id];
  }, [id]);

  /* ===== メニュー ===== */
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = useMemo(
    () => buildCommonMenuItems(navigate, () => setMenuOpen(false)),
    [navigate]
  );

  /* ===== ターン ===== */
  const [turnsLeft, setTurnsLeft] = useState<number>(() => initialTurns());

  /* ===== チャット ===== */
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: crypto.randomUUID(), role: "assistant", text: "やぁ。今日はどうする？" },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const replyFor = () => {
    if (id === "teo") return "無理しなくていい。今のままで話して。";
    if (id === "rei") return "一緒に整理しよ。どこからいく？";
    return "うんうん、聞いてるよ！";
  };

  /* ===== 一文字ずつ表示（140ms） ===== */
  const typeWriter = async (fullText: string) => {
    setTyping(true);
    const msgId = crypto.randomUUID();
    setMessages((p) => [...p, { id: msgId, role: "assistant", text: "" }]);

    for (let i = 0; i < fullText.length; i++) {
      await new Promise((r) => setTimeout(r, 140));
      setMessages((p) =>
        p.map((m) =>
          m.id === msgId ? { ...m, text: m.text + fullText[i] } : m
        )
      );
    }
    setTyping(false);
  };

  const canSend = !typing && input.trim().length > 0 && turnsLeft > 0;

  const onSend = async () => {
    if (!canSend) return;

    const text = input.trim();
    setInput("");

    setMessages((p) => [
      ...p,
      { id: crypto.randomUUID(), role: "user", text },
    ]);

    setTurnsLeft((t) => Math.max(0, t - 1));

    await typeWriter(replyFor());
  };

  return (
    <div className="page-bg">
      <div className="main-panel">
        {/* ===== ヘッダー ===== */}
        <div className="top-header">
          <button className="header-btn" onClick={() => navigate("/select/boy")}>
            ◀︎
          </button>

          <div className="header-center">
            <img className="header-avatar" src={boy.img} alt={boy.name} />
            <div className="header-name">{boy.name}</div>
          </div>

          <div className="header-right">
            <div className="turn-count">残り {turnsLeft}</div>
            <button className="header-menu" onClick={() => setMenuOpen(true)}>
              ≡
            </button>
          </div>
        </div>

        {/* ===== チャット本文 ===== */}
        <div className="chat-body">
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === "assistant" ? "row-left" : "row-right"}
            >
              {m.role === "assistant" && (
                <img className="mini-avatar" src={boy.img} alt="" />
              )}
              <div
                className={
                  m.role === "assistant"
                    ? "bubble-left"
                    : "bubble-right"
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
            placeholder={turnsLeft <= 0 ? "ターンがありません" : "メッセージを入力"}
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