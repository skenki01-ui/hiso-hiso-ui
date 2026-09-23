import { isDayPassActive } from "../../utils/daypass";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import { supabase } from "../../lib/supabase";
import { generateReply } from "../../services/aiEngine";
import "./Chat.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  room_id?: string;
  created_at?: string;
};

const TYPE_SPEED = 140;

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function isNightTime() {
  const h = new Date().getHours();
  return h >= 20 || h < 5;
}

function getTurnAllowance() {
  return isNightTime() ? 6 : 3;
}

function getWindowStart() {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const h = d.getHours();

  if (h >= 20) return new Date(y, m, day, 20).getTime();
  if (h < 5) return new Date(y, m, day - 1, 20).getTime();

  return new Date(y, m, day, 5).getTime();
}

function loadTurnState() {
  const allowance = getTurnAllowance();
  const start = getWindowStart();

  const savedStart = Number(
    localStorage.getItem("hs_turn_window_start") || "0"
  );

  const savedRemaining = Number(
    localStorage.getItem("hs_turn_remaining") || allowance
  );

  if (savedStart !== start) {
    localStorage.setItem("hs_turn_window_start", String(start));
    localStorage.setItem("hs_turn_remaining", String(allowance));

    return allowance;
  }

  return savedRemaining;
}

function saveRemaining(n: number) {
  localStorage.setItem("hs_turn_remaining", String(n));
}

function getNextRecoveryText() {
  const h = new Date().getHours();

  if (h >= 20 || h < 5) {
    return "次の回復は 5:00 です";
  }

  return "次の回復は 20:00 です";
}

function getIntroMessage(from: string, intro: string) {
  if (from === "otoshirube") {
    return `来てくれたんだね。

おとしるべの結果、ちゃんと受け取ったよ。

この名前について、もう少し一緒に見ていこうか。

気になったところや、
「これってどういう意味？」って思ったところがあれば、
そこから話してみて。

おとしるべの結果も、ここに残ってるから大丈夫。

${intro}`;
  }

  if (from === "kazamuki") {
    return `来てくれたんだね。

かざむきの結果、ちゃんと受け取ったよ。

${intro}

このカードを見て、
今いちばん気になったことはある？

恋愛でも、仕事でも、人間関係でも、
そのまま話してくれて大丈夫。`;
  }

  if (from === "yomitori") {
    return `来てくれたんだね。

${intro}

今ちょっと、
心の奥で引っかかってることある？

よかったら、
そのまま話してみて。`;
  }

  return `来てくれたんだね。

${intro}

この内容について、
もう少し話してみる？

今の気持ちをそのまま書いてくれて大丈夫。`;
}

export default function FreeChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const genre = searchParams.get("genre") || "";
  const mode = searchParams.get("mode") || "";

  const intro = searchParams.get("intro") || "";
  const from = searchParams.get("from") || "";

  const userId = localStorage.getItem("user_id") || "guest";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [remaining, setRemaining] = useState(0);
  const [point, setPoint] = useState(0);

  const [aiName, setAiName] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const introKey = intro
    ? btoa(
        unescape(
          encodeURIComponent(`${from}_${intro}`)
        )
      ).slice(0, 20)
    : "normal";

  const roomId = `free_${genre}_${mode}_${introKey}_${userId}`;

  const subType = localStorage.getItem("hs_sub_type");

  const unlimited =
    subType === "full" ||
    (subType === "night" && isNightTime()) ||
    isDayPassActive();

  useEffect(() => {
    setRemaining(loadTurnState());

    async function loadPoint() {
      const { data } = await supabase
        .from("users")
        .select("point")
        .eq("id", userId)
        .single();

      if (data) {
        setPoint(data.point || 0);
      }
    }

    loadPoint();

    const saved = localStorage.getItem("hs_free_ai_name") || "";
    setAiName(saved);
  }, [location, userId]);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      if (intro) {
        const introText = getIntroMessage(from, intro);

        const introMessage: Message = {
          id: `intro_${roomId}`,
          role: "assistant",
          content: introText,
        };

        setMessages((prev) => {
          if (prev.length > 0) {
            return prev;
          }

          return [introMessage];
        });
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("messages取得エラー:", error);
        return;
      }

      if (data && data.length > 0) {
        setMessages(data as Message[]);
        return;
      }

      if (intro) {
        const introText = getIntroMessage(from, intro);

        await supabase.from("messages").insert([
          {
            room_id: roomId,
            user_id: userId,
            role: "assistant",
            content: introText,
          },
        ]);
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [roomId, intro, from, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  async function typeAssistantMessage(full: string) {
    setIsTyping(true);

    const id = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id,
        role: "assistant",
        content: "",
      },
    ]);

    for (let i = 0; i < full.length; i++) {
      await sleep(TYPE_SPEED);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                content: full.slice(0, i + 1),
              }
            : m
        )
      );
    }

    setIsTyping(false);
  }

  async function sendMessage() {
    const text = input.trim();

    if (!text || isTyping) return;

    const currentRemaining = loadTurnState();

    if (unlimited || currentRemaining > 0) {
      if (!unlimited) {
        const next = currentRemaining - 1;

        saveRemaining(next);
        setRemaining(next);
      }
    } else {
      const API_BASE =
        (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
        "http://localhost:3000";

      const res = await fetch(`${API_BASE}/api/use-point`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          amount: 5,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `無料ターンを使い切りました

${getNextRecoveryText()}

または5pで続けられます`,
          },
        ]);

        return;
      }

      setPoint(data.point);
    }

    setInput("");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    await supabase.from("messages").insert([
      {
        room_id: roomId,
        user_id: userId,
        role: "user",
        content: text,
      },
    ]);

    const historyForAI: {
      role: "user" | "assistant";
      content: string;
    }[] = [];

    if (from === "otoshirube" && intro) {
      historyForAI.push({
        role: "assistant",
        content: `【おとしるべから引き継いだ名前の結果】

${intro}

この結果を前提として、ユーザーとの会話に活用してください。
ただし、結果をそのまま繰り返すのではなく、ユーザーが聞いたことに合わせて自然に会話してください。`,
      });
    }

    historyForAI.push(
      ...messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }))
    );

    historyForAI.push({
      role: "user",
      content: text,
    });

    const aiText = await generateReply({
      character: aiName,
      genre,
      mode,
      userMessage: text,
      history: historyForAI,
    });

    await typeAssistantMessage(aiText);

    await supabase.from("messages").insert([
      {
        room_id: roomId,
        user_id: userId,
        role: "assistant",
        content: aiText,
      },
    ]);
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button
          type="button"
          className="header-btn"
          onClick={() => {
            if (
              from === "yomitori" ||
              from === "kazamuki" ||
              from === "otoshirube"
            ) {
              navigate("/");
              return;
            }

            navigate(-1);
          }}
        >
          ◀︎
        </button>

        <input
          value={aiName}
          placeholder="呼びたい名前つけて"
          onChange={(e) => {
            const v = e.target.value;

            setAiName(v);

            localStorage.setItem("hs_free_ai_name", v);
          }}
          className="free-name-input"
        />

        <div className="header-right">
          <span className="header-remaining">
            {unlimited ? "残り ♾️" : `残り ${remaining}`} | {point}p
          </span>

          <button
            type="button"
            className="header-btn"
            onClick={() => setMenuOpen(true)}
          >
            三
          </button>
        </div>
      </div>

      <div className="chat-list">
        {messages.map((m) =>
          m.role === "assistant" ? (
            <div key={m.id} className="row ai">
              <div className="bubble ai">{m.content}</div>
            </div>
          ) : (
            <div key={m.id} className="row me">
              <div className="bubble me">{m.content}</div>
            </div>
          )
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-footer">
        <input
          className="chat-input"
          value={input}
          placeholder="ここだけの話、してみる？"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          type="button"
          className="chat-send"
          onClick={() => {
            sendMessage();
          }}
        >
          送信
        </button>
      </div>

      <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}