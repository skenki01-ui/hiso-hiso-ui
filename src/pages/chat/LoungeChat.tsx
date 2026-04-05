// src/pages/chat/LoungeChat.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateReply } from "../../services/aiEngine";
import { supabase } from "../../lib/supabase";
import "./LoungeChat.css";

const userId = localStorage.getItem("user_id") || "guest";

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:3000";

type Role = "user" | "cast" | "help" | "system";

type Msg = {
  id: string;
  role: Role;
  text: string;
  name?: string;
  img?: string;
};

type Blood = "A" | "B" | "O" | "AB";

type Cast = {
  id: string;
  name: string;
  img: string;
  birthday: string;
  blood: Blood;
  drunkCoef: 0.7 | 1.0 | 1.3 | 1.5;
  personality: string;
  speech: string;
  flirt: "low" | "mid" | "high";
  adultOk?: boolean;
};

const CASTS: Cast[] = [
  {
    id: "rio",
    name: "りお",
    img: "/girls/rio.png",
    birthday: "3/12",
    blood: "A",
    drunkCoef: 1.0,
    personality: "礼儀正しいのに距離が近い。聞き役が得意。",
    speech: "語尾がやわらかい。短めに返す。",
    flirt: "mid",
    adultOk: true,
  },
  {
    id: "saya",
    name: "さや",
    img: "/girls/saya.png",
    birthday: "8/7",
    blood: "O",
    drunkCoef: 1.3,
    personality: "甘え上手で、相手を肯定して安心させる。",
    speech: "『ね』が多い。やさしく寄り添う。",
    flirt: "high",
    adultOk: true,
  },
  {
    id: "yuna",
    name: "ゆな",
    img: "/girls/yuna.png",
    birthday: "5/21",
    blood: "B",
    drunkCoef: 0.7,
    personality: "テンション高めで空気を明るくする。",
    speech: "元気な返し。",
    flirt: "mid",
    adultOk: true,
  },
  {
    id: "mahiro",
    name: "まひろ",
    img: "/girls/mahiro.png",
    birthday: "10/2",
    blood: "AB",
    drunkCoef: 1.0,
    personality: "観察力が高い。",
    speech: "落ち着いた言い回し。",
    flirt: "low",
  },
  {
    id: "rena",
    name: "れな",
    img: "/girls/rena.png",
    birthday: "1/28",
    blood: "A",
    drunkCoef: 1.3,
    personality: "綺麗めお姉さん。",
    speech: "『…』多め。",
    flirt: "mid",
    adultOk: true,
  },
  {
    id: "hina",
    name: "ひな",
    img: "/girls/hina.png",
    birthday: "6/14",
    blood: "O",
    drunkCoef: 1.5,
    personality: "距離が近い。",
    speech: "ふわっと。",
    flirt: "high",
    adultOk: true,
  },
  {
    id: "tsumugi",
    name: "つむぎ",
    img: "/girls/tsumugi.png",
    birthday: "11/9",
    blood: "B",
    drunkCoef: 1.0,
    personality: "しっかり者。",
    speech: "丁寧。",
    flirt: "low",
  },
  {
    id: "aoi",
    name: "あおい",
    img: "/girls/aoi.png",
    birthday: "2/3",
    blood: "A",
    drunkCoef: 0.7,
    personality: "クール。",
    speech: "短文。",
    flirt: "mid",
    adultOk: true,
  },
  {
    id: "kaede",
    name: "かえで",
    img: "/girls/kaede.png",
    birthday: "9/19",
    blood: "O",
    drunkCoef: 1.0,
    personality: "姉御肌。",
    speech: "言い切り。",
    flirt: "low",
  },
  {
    id: "mitsuki",
    name: "みつき",
    img: "/girls/mitsuki.png",
    birthday: "4/30",
    blood: "AB",
    drunkCoef: 1.3,
    personality: "小悪魔。",
    speech: "ニヤ。",
    flirt: "high",
    adultOk: true,
  },
  {
    id: "koharu",
    name: "こはる",
    img: "/girls/koharu.png",
    birthday: "12/1",
    blood: "A",
    drunkCoef: 1.0,
    personality: "素直。",
    speech: "やさしい。",
    flirt: "mid",
  },
  {
    id: "suzu",
    name: "すず",
    img: "/girls/suzu.png",
    birthday: "7/26",
    blood: "B",
    drunkCoef: 0.7,
    personality: "自由人。",
    speech: "軽いノリ。",
    flirt: "mid",
    adultOk: true,
  },
  {
    id: "honoka",
    name: "ほのか",
    img: "/girls/honoka.png",
    birthday: "5/5",
    blood: "O",
    drunkCoef: 1.3,
    personality: "癒し。",
    speech: "安心。",
    flirt: "mid",
  },
  {
    id: "rin",
    name: "りん",
    img: "/girls/rin.png",
    birthday: "8/31",
    blood: "A",
    drunkCoef: 1.0,
    personality: "ミステリアス。",
    speech: "余白。",
    flirt: "low",
  },
  {
    id: "nagisa",
    name: "なぎさ",
    img: "/girls/nagisa.png",
    birthday: "6/6",
    blood: "AB",
    drunkCoef: 1.0,
    personality: "知的。",
    speech: "丁寧。",
    flirt: "low",
  },
  {
    id: "shion",
    name: "しおん",
    img: "/girls/shion.png",
    birthday: "9/2",
    blood: "B",
    drunkCoef: 1.3,
    personality: "ちょいS。",
    speech: "挑発。",
    flirt: "mid",
    adultOk: true,
  },
  {
    id: "kanon",
    name: "かのん",
    img: "/girls/kanon.png",
    birthday: "3/3",
    blood: "O",
    drunkCoef: 0.7,
    personality: "無邪気。",
    speech: "明るい。",
    flirt: "mid",
  },
  {
    id: "crea",
    name: "くれあ",
    img: "/girls/crea.png",
    birthday: "1/17",
    blood: "A",
    drunkCoef: 1.5,
    personality: "艶。",
    speech: "落ち着き。",
    flirt: "high",
    adultOk: true,
  },
  {
    id: "momo",
    name: "もも",
    img: "/girls/momo.png",
    birthday: "10/10",
    blood: "O",
    drunkCoef: 1.0,
    personality: "ふわふわ。",
    speech: "甘い。",
    flirt: "mid",
  },
  {
    id: "maika",
    name: "まいか",
    img: "/girls/maika.png",
    birthday: "4/4",
    blood: "B",
    drunkCoef: 1.3,
    personality: "攻め。",
    speech: "言い切り。",
    flirt: "high",
    adultOk: true,
  },
];

const COST = {
  castDrink: 30,
  tequila: 50,
  bomb: 80,
  champagne: 500,
  wheel: 400,
  tower: 500,
  pin: 30,
} as const;

const DRINK_POWER = {
  castDrink: 6,
  tequila: 10,
  bomb: 14,
  champagne: 18,
} as const;
const SIP_AMOUNT = 12;
const SET_MS = 60 * 60 * 1000;

const SESSION_RUNNING_KEY = "hs_lounge_running";
const SESSION_ELAPSED_KEY = "hs_lounge_elapsed";

const uid = () => crypto.randomUUID();
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function fmtMmSs(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

export default function LoungeChat() {
  const navigate = useNavigate();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastUserActionRef = useRef(Date.now());
  const typingCancelRef = useRef(false);
  const turnRef = useRef(0);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const [typingText, setTypingText] = useState("");
  const [typingName, setTypingName] = useState("");
  const [typingImg, setTypingImg] = useState("");
  const [typingRole, setTypingRole] = useState<"cast" | "help">("cast");

  const [seatCast, setSeatCast] = useState<Cast>(CASTS[0]);
  const [pinnedCastId, setPinnedCastId] = useState<string | null>(null);

  const [point, setPoint] = useState(0);

  const [drinkGauge, setDrinkGauge] = useState(100);
  const [drunkGauge, setDrunkGauge] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [ended, setEnded] = useState(false);

  const [burstImg, setBurstImg] = useState<string | null>(null);

  const [remainingMs, setRemainingMs] = useState(SET_MS);

  const [wheelActive, setWheelActive] = useState(false);
  const [wheelCups, setWheelCups] = useState(0);

  const [towerActive, setTowerActive] = useState(false);
  const [towerCups, setTowerCups] = useState(0);

  const userIdLocal = localStorage.getItem("user_id") || "guest";
  const roomId = `lounge_${seatCast.id}_${userIdLocal}`;

  const castList = useMemo(() => CASTS, []);

  // セッション開始
  useEffect(() => {
    const now = Date.now();
    localStorage.setItem(SESSION_RUNNING_KEY, String(now));
    localStorage.setItem(SESSION_ELAPSED_KEY, "0");
  }, []);

  // 残り時間
  useEffect(() => {
    const timer = setInterval(() => {
      const start = Number(localStorage.getItem(SESSION_RUNNING_KEY) || "0");
      const saved = Number(localStorage.getItem(SESSION_ELAPSED_KEY) || "0");

      if (!start) return;

      const passed = Date.now() - start;
      const total = saved + passed;

      const remain = clamp(SET_MS - total, 0, SET_MS);
      setRemainingMs(remain);

      if (remain <= 0 && !ended) {
        setEnded(true);

        setMessages((p) => [
          ...p,
          {
            id: uid(),
            role: "system",
            text: "……時間だね。また来てくれる？",
          },
        ]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [ended]);

  // スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // ポイント取得
  useEffect(() => {
    async function loadPoint() {
      const { data } = await supabase
        .from("users")
        .select("point")
        .eq("id", userIdLocal)
        .single();

      if (data) setPoint(data.point || 0);
    }

    loadPoint();
  }, [userIdLocal]);

  // 初期メッセージ
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: uid(),
          role: "cast",
          text: "……いらっしゃい。",
          name: seatCast.name,
          img: seatCast.img,
        },
      ]);
    }
  }, [messages, seatCast]);
    function showBurst(img: string) {
    setBurstImg(img);
    setTimeout(() => setBurstImg(null), 1800);
  }

  function cancelTyping() {
    typingCancelRef.current = true;
    setTypingText("");
  }

  function addDrunk(amount: number) {
    const coef = seatCast.drunkCoef;
    const effective = amount * (1 / coef);
    setDrunkGauge((p) => clamp(Math.round(p + effective), 0, 100));
  }

  async function saveMessage(role: "user" | "assistant", content: string) {
    await supabase.from("messages").insert([
      {
        room_id: roomId,
        user_id: userIdLocal,
        role,
        content,
      },
    ]);
  }

  async function loadHistory() {
    const { data } = await supabase
      .from("messages")
      .select("role, content")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .limit(10);

    return data || [];
  }

  async function typeReply(text: string, role: "cast" | "help" = "cast") {
    typingCancelRef.current = false;
    setTypingRole(role);
    setTypingName(seatCast.name);
    setTypingImg(seatCast.img);
    setTypingText("");

    for (let i = 0; i < text.length; i++) {
      if (typingCancelRef.current) return;
      setTypingText((prev) => prev + text[i]);
      await sleep(80);
    }

    setTypingText("");

    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role,
        text,
        name: seatCast.name,
        img: seatCast.img,
      },
    ]);

    await saveMessage("assistant", text);
  }

  async function usePoint(cost: number) {
    const res = await fetch(`${API_BASE}/use-point`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userIdLocal, amount: cost }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("ポイント不足");
      return false;
    }

    setPoint(data.point);
    return true;
  }

  async function addPoint(amount: number) {
    const res = await fetch(`${API_BASE}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userIdLocal, amount }),
    });

    const data = await res.json();

    if (data.success) {
      setPoint(data.point);
    } else {
      alert("購入失敗");
    }
  }
    function drinkSipFromTurn() {
    turnRef.current++;

    if (turnRef.current >= 3) {
      turnRef.current = 0;
      setDrinkGauge((p) => clamp(p - SIP_AMOUNT, 0, 100));
    }
  }

  useEffect(() => {
    const idleTimer = setInterval(() => {
      const diff = Date.now() - lastUserActionRef.current;

      if (diff > 40000 && !ended) {
        setDrinkGauge((p) => clamp(p - SIP_AMOUNT, 0, 100));
        lastUserActionRef.current = Date.now();
      }
    }, 2000);

    return () => clearInterval(idleTimer);
  }, [ended]);

  async function sendMessage() {
    if (!input.trim() || ended) return;

    const text = input;

    cancelTyping();

    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "user",
        text,
      },
    ]);

    setInput("");
    lastUserActionRef.current = Date.now();

    await saveMessage("user", text);

    drinkSipFromTurn();

    const history = await loadHistory();

    const reply = await generateReply({
      character: seatCast.name,
      genre: "lounge",
      mode: `drunk:${drunkGauge}`,
      userMessage: text,
      history,
    } as any);

    await typeReply(reply, "cast");
  }

  // ▼ 観覧車：1回だけ課金 → 10杯カウント
  async function startWheel() {
    if (wheelActive) return;
    if (!(await usePoint(COST.wheel))) return;

    setWheelActive(true);
    setWheelCups(10);
   showBurst("/drinks/wheel.png");
    setMenuOpen(false);
  }

  // ▼ タワー：1回だけ課金 → 10杯カウント
  async function startTower() {
    if (towerActive) return;
    if (!(await usePoint(COST.tower))) return;

    setTowerActive(true);
    setTowerCups(10);
    setMenuOpen(false);
  }

  async function onCastDrink() {
    if (ended) return;
    if (!(await usePoint(COST.castDrink))) return;

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.castDrink);

    await typeReply("……ありがと。", "cast");
  }

  async function onTequila() {
    if (ended) return;

    // 観覧車中は無料消費
    if (wheelActive) {
      const next = wheelCups - 1;
      setWheelCups(next);

      setDrinkGauge(100);
      addDrunk(DRINK_POWER.tequila);

      if (next <= 0) {
        showBurst("/drinks/wheel.png");
        setWheelActive(false);
      }

      await typeReply("……ん。", "cast");
      return;
    }

    if (!(await usePoint(COST.tequila))) return;

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.tequila);

    await typeReply("……ん。", "cast");
  }

  async function onCocaBomb() {
    if (ended) return;

    // タワー中は無料消費
    if (towerActive) {
      const next = towerCups - 1;
      setTowerCups(next);

      setDrinkGauge(100);
      addDrunk(DRINK_POWER.bomb);

      const drank = 10 - next;

      if (drank === 3) showBurst("/drinks/bomb_3.png");
      if (drank === 6) showBurst("/drinks/bomb_6.png");

      if (next <= 0) {
        showBurst("/drinks/bomb_10.png");
        setTowerActive(false);
      }

      await typeReply("……っ。", "cast");
      return;
    }

    if (!(await usePoint(COST.bomb))) return;

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.bomb);

    await typeReply("……っ。", "cast");
  }

  async function onChampagne() {
    if (ended) return;
    if (!(await usePoint(COST.champagne))) return;

    setDrinkGauge(100);
    showBurst("/drinks/champagne.png");

    await typeReply("……シャンパン？ありがとう。", "cast");
  }
    function handleBack() {
    const running = Number(localStorage.getItem(SESSION_RUNNING_KEY) || "0");

    if (running) {
      const nextElapsed =
        Number(localStorage.getItem(SESSION_ELAPSED_KEY) || "0") +
        (Date.now() - running);

      localStorage.setItem(SESSION_ELAPSED_KEY, String(nextElapsed));
      localStorage.removeItem(SESSION_RUNNING_KEY);
    }

    navigate(-1);
  }

  // src/pages/chat/LoungeChat.tsx

  const tequilaLabel = wheelActive ? `🥃 ${wheelCups}` : "🥃50p";
  const bombLabel = towerActive ? `💣 ${towerCups}` : "💣80p";

  return (
    <div className="lounge-page">

     <header className="lounge-header">
  <button className="lounge-back" onClick={handleBack}>
    ◀︎
  </button>

  <div className="lounge-title">
    <img className="lounge-avatar" src={seatCast.img} />
    <span className="lounge-name">{seatCast.name}</span>
  </div>

 <div className="lounge-right">

  {/* 残り時間 + ポイント */}
  <div style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
    <div>残り {fmtMmSs(remainingMs)}</div>
    <div style={{ fontWeight: 700 }}>{point}p</div>
  </div>

  {/* ゲージ */}
 <div
  style={{
    position: "relative",
    width: 20,
    height: 60,
    background: "#222",
    borderRadius: 10,
    overflow: "hidden"
  }}
>
  <div
    style={{
      position: "absolute",
      bottom: 0, // ←これが超重要
      width: "100%",
      height: `${drunkGauge}%`,
      background: "red"
    }}
  />
</div>
  {/* メニュー */}
  <button
    className="lounge-menu"
    onClick={() => setMenuOpen(true)}
  >
    三
  </button>

</div>
</header>

      <main className="lounge-body">
       {messages.map((m) => (
  <div
    key={m.id}
    style={{
      display: "flex",
      justifyContent: m.role === "user" ? "flex-end" : "flex-start",
      marginBottom: 10,
      paddingLeft: m.role === "user" ? 0 : 10,
      paddingRight: m.role === "user" ? 10 : 0
    }}
  >
    {(m.role === "cast" || m.role === "help") && (
      <img
        src={m.img}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          marginRight: 6
        }}
      />
    )}

    <div
      style={{
        background: m.role === "user" ? "#4da3ff" : "#444",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 16,
        maxWidth: "70%",
        textAlign: "left"
      }}
    >
      {m.name && <div style={{ fontSize: 12 }}>{m.name}</div>}
      <div>{m.text}</div>
    </div>
  </div>
))}
        {typingText && (
          <div className="lounge-row cast">
            <img className="bubble-avatar" src={seatCast.img} alt="" />
            <div className="lounge-bubble typing">
              <div>{typingText}</div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      <div className="drink-gauge-wrap">
        <div className="drink-icon">🥂</div>
        <div className="drink-gauge">
          <div
            className="drink-fill"
            style={{ height: `${drinkGauge}%` }}
          />
        </div>
      </div>

      <footer className="lounge-input">
        <input
          className="lounge-text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            lastUserActionRef.current = Date.now();
          }}
          placeholder="メッセージを入力"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          disabled={ended}
        />

        <button
          className="lounge-send"
          onClick={sendMessage}
          disabled={ended}
        >
          送信
        </button>
      </footer>

      <div className="lounge-drinks">
        <button className="drink-btn" onClick={onCastDrink} disabled={ended}>
          🍹30p
        </button>

        <button className="drink-btn" onClick={onTequila} disabled={ended}>
          {tequilaLabel}
        </button>

        <button className="drink-btn" onClick={onCocaBomb} disabled={ended}>
          {bombLabel}
        </button>

        <button className="drink-btn" onClick={onChampagne} disabled={ended}>
          🍾500p
        </button>
      </div>

      {menuOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div className="modal-title">メニュー</div>

              <button
                className="x-btn"
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="menu-scroll">
              <div className="menu-block">
                <div className="menu-h">現在ポイント</div>
                <div className="menu-p">{point}p</div>
              </div>

              <div className="menu-block">
                <div className="menu-h">ポイント購入</div>

                <button className="modal-item" onClick={() => addPoint(105)}>
                  1000円 = 105p
                </button>

                <button className="modal-item" onClick={() => addPoint(320)}>
                  3000円 = 320p
                </button>

                <button className="modal-item" onClick={() => addPoint(550)}>
                  5000円 = 550p
                </button>

                <button className="modal-item" onClick={() => addPoint(1200)}>
                  10000円 = 1200p
                </button>
              </div>

              <div className="menu-block">
                <div className="menu-h">特別メニュー</div>

                <button className="modal-item" onClick={startWheel}>
                  テキーラ観覧車（400p）
                </button>

                <button className="modal-item" onClick={startTower}>
                  コカボムタワー（500p）
                </button>
              </div>

              <div className="menu-block">
                <div className="menu-h">キャスト</div>

                <div className="cast-list">
                  {castList.map((c) => (
                    <button
                      key={c.id}
                      className="cast-item"
                      onClick={() => {
                        setSeatCast(c);
                        setMenuOpen(false);
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="modal-close"
                onClick={() => setMenuOpen(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {burstImg && (
        <div className="burst-overlay">
          <img
            src={burstImg}
            className="burst-img"
            alt=""
          />
        </div>
      )}
    </div>
  );
}