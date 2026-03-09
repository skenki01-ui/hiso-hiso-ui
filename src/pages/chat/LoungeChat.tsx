// PART 1 / 5
// src/pages/chat/LoungeChat.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateReply } from "../../services/aiEngine";
import "./LoungeChat.css";

type Role = "me" | "cast" | "help" | "system";

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

const uid = () => crypto.randomUUID();
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

function fmtMmSs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function pushMsgSafe(prev: Msg[], next: Msg): Msg[] {
  const last = prev[prev.length - 1];
  if (
    last &&
    last.role === next.role &&
    last.text === next.text &&
    last.name === next.name
  ) {
    return prev;
  }
  return [...prev, next];
}

const SESSION_ACTIVE_KEY = "hs_lounge_session_active";
const SESSION_ELAPSED_KEY = "hs_lounge_elapsed_ms";
const SESSION_RUNNING_KEY = "hs_lounge_running_since";
const CAST_KEY = "hs_lounge_cast_id";

const SET_MS = 60 * 60 * 1000;
const SIP_AMOUNT = 12.5;

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
    speech: "絵文字少し。元気な返し。",
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
    personality: "観察力が高い。言葉を選ぶ。",
    speech: "落ち着いた言い回し。余韻。",
    flirt: "low",
  },
  {
    id: "rena",
    name: "れな",
    img: "/girls/rena.png",
    birthday: "1/28",
    blood: "A",
    drunkCoef: 1.3,
    personality: "綺麗めお姉さん。たまに毒がある。",
    speech: "『…』多め。刺さる一言。",
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
    personality: "いちばん距離が近い。甘い空気が得意。",
    speech: "ふわっと、でも芯は強い。",
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
    personality: "しっかり者。面倒見がいい。",
    speech: "丁寧。現実的アドバイス。",
    flirt: "low",
  },
  {
    id: "aoi",
    name: "あおい",
    img: "/girls/aoi.png",
    birthday: "2/3",
    blood: "A",
    drunkCoef: 0.7,
    personality: "クールで淡い。照れを隠すタイプ。",
    speech: "短文。たまにデレる。",
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
    personality: "姉御肌。背中を押す。",
    speech: "言い切り多め。テンポ良い。",
    flirt: "low",
  },
  {
    id: "mitsuki",
    name: "みつき",
    img: "/girls/mitsuki.png",
    birthday: "4/30",
    blood: "AB",
    drunkCoef: 1.3,
    personality: "小悪魔。相手の反応で遊ぶ。",
    speech: "ニヤッとする言い方。",
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
    personality: "素直でまっすぐ。肯定が多い。",
    speech: "やさしい。『うん』多め。",
    flirt: "mid",
  },
  {
    id: "suzu",
    name: "すず",
    img: "/girls/suzu.png",
    birthday: "7/26",
    blood: "B",
    drunkCoef: 0.7,
    personality: "自由人。話題がコロコロ変わる。",
    speech: "軽いノリ。笑い多め。",
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
    personality: "包容力。癒しの天才。",
    speech: "安心させる言葉選び。",
    flirt: "mid",
  },
  {
    id: "rin",
    name: "りん",
    img: "/girls/rin.png",
    birthday: "8/31",
    blood: "A",
    drunkCoef: 1.0,
    personality: "静かでミステリアス。刺さる言葉を言う。",
    speech: "余白がある。『…』",
    flirt: "low",
  },
  {
    id: "nagisa",
    name: "なぎさ",
    img: "/girls/nagisa.png",
    birthday: "6/6",
    blood: "AB",
    drunkCoef: 1.0,
    personality: "知的。会話を深くする。",
    speech: "落ち着き。丁寧で上品。",
    flirt: "low",
  },
  {
    id: "shion",
    name: "しおん",
    img: "/girls/shion.png",
    birthday: "9/2",
    blood: "B",
    drunkCoef: 1.3,
    personality: "ちょいS。相手を試す。",
    speech: "挑発は軽め。冗談っぽく。",
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
    personality: "無邪気。距離が近い。",
    speech: "明るい。『えへ』系。",
    flirt: "mid",
  },
  {
    id: "crea",
    name: "くれあ",
    img: "/girls/crea.png",
    birthday: "1/17",
    blood: "A",
    drunkCoef: 1.5,
    personality: "大人っぽい艶。余裕がある。",
    speech: "落ち着き。声が聞こえる感じ。",
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
    personality: "ふわふわ系。甘い空気が得意。",
    speech: "やわらかい。ほんのり甘える。",
    flirt: "mid",
  },
  {
    id: "maika",
    name: "まいか",
    img: "/girls/maika.png",
    birthday: "4/4",
    blood: "B",
    drunkCoef: 1.3,
    personality: "お姉さん＆攻め。場を支配する。",
    speech: "言い切り。ニヤッと。",
    flirt: "high",
    adultOk: true,
  },
];

const DRINK_POWER = {
  castDrink: 6,
  tequila: 10,
  bomb: 14,
  champagne: 18,
} as const;

const COST = {
  castDrink: 30,
  tequila: 50,
  bomb: 80,
  champagne: 500,
  wheel: 400,
  tower: 500,
  pin: 30,
} as const;
// PART 2 / 5

export default function LoungeChat() {
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [elapsedBase, setElapsedBase] = useState<number>(() => {
    const saved = Number(localStorage.getItem(SESSION_ELAPSED_KEY) || "0");
    return saved;
  });

  const [runningSince, setRunningSince] = useState<number | null>(() => {
    const saved = Number(localStorage.getItem(SESSION_RUNNING_KEY) || "0");
    return saved || null;
  });

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const active = localStorage.getItem(SESSION_ACTIVE_KEY);

    if (!active) {
      localStorage.setItem(SESSION_ACTIVE_KEY, "1");
      localStorage.setItem(SESSION_RUNNING_KEY, String(Date.now()));
      setRunningSince(Date.now());
    } else {
      const currentRunning = Number(localStorage.getItem(SESSION_RUNNING_KEY) || "0");
      if (!currentRunning) {
        localStorage.setItem(SESSION_RUNNING_KEY, String(Date.now()));
        setRunningSince(Date.now());
      }
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(t);
  }, []);

  const elapsed =
    elapsedBase +
    (runningSince ? now - runningSince : 0);

  const remainingMs = Math.max(0, SET_MS - elapsed);

  const [seatCast, setSeatCast] = useState<Cast>(() => {
    const saved = localStorage.getItem(CAST_KEY);

    if (saved) {
      const found = CASTS.find((c) => c.id === saved);
      if (found) return found;
    }

    const pick = CASTS[Math.floor(Math.random() * CASTS.length)];
    localStorage.setItem(CAST_KEY, pick.id);
    return pick;
  });

  const seatImg = seatCast.img;
  const seatName = seatCast.name;

  const [helpCast, setHelpCast] = useState<Cast | null>(null);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: uid(),
      role: "cast",
      text: "……いらっしゃい。",
      name: seatCast.name,
      img: seatCast.img,
    },
  ]);

  const messagesRef = useRef<Msg[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typingText, setTypingText] = useState("");
  const [typingRole, setTypingRole] = useState<"cast" | "help">("cast");
  const [typingName, setTypingName] = useState("");
  const [typingImg, setTypingImg] = useState("");
  const typingCancelRef = useRef(false);

  const [drunkGauge, setDrunkGauge] = useState(0);
  const [drinkGauge, setDrinkGauge] = useState(0);

  const [point, setPoint] = useState(0);

  const [champagneOrdered, setChampagneOrdered] = useState(false);
  const [wheelRemaining, setWheelRemaining] = useState<number | null>(null);
  const [towerRemaining, setTowerRemaining] = useState<number | null>(null);

  const [ended, setEnded] = useState(false);

  const nickname = (localStorage.getItem("nickname") || "").trim();

  const turnCounterRef = useRef(0);
  const lastUserActionRef = useRef<number>(Date.now());

  const sleepingLines = [
    "💤",
    "飲めるよ…",
    "ねむ…",
    "……",
  ];

  const [burstImg, setBurstImg] = useState<string | null>(null);

  function showBurst(img: string) {
    setBurstImg(img);
    setTimeout(() => setBurstImg(null), 2000);
  }

  function getTypeSpeed() {
    if (drunkGauge >= 70) return 160;
    if (drunkGauge >= 40) return 120;
    return 90;
  }

  useEffect(() => {
    const p = localStorage.getItem("point");

    if (!p) {
      localStorage.setItem("point", "1000");
      setPoint(1000);
      return;
    }

    setPoint(Number(p));
  }, []);

  const usePoint = (cost: number) => {
    if (cost <= 0) return true;

    if (point < cost) {
      alert("ポイントが足りません");
      return false;
    }

    const next = point - cost;
    localStorage.setItem("point", String(next));
    setPoint(next);

    return true;
  };

  function addPoint(delta: number) {
    const next = point + delta;
    localStorage.setItem("point", String(next));
    setPoint(next);
  }

  useEffect(() => {
    if (ended) return;
    if (remainingMs > 0) return;

    setEnded(true);

    localStorage.removeItem(SESSION_ACTIVE_KEY);
    localStorage.removeItem(SESSION_RUNNING_KEY);
    localStorage.removeItem(SESSION_ELAPSED_KEY);

    setMessages((p) =>
      pushMsgSafe(p, {
        id: uid(),
        role: "system",
        text: "……今日はここまで。",
      })
    );
  }, [remainingMs, ended]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText, menuOpen]);
  // PART 3 / 5

  async function typeCast(
    text: string,
    speaker?: Cast,
    role: "cast" | "help" = "cast",
    opts?: { extraSlow?: boolean }
  ) {
    const talker = speaker ?? seatCast;

    typingCancelRef.current = false;
    const sp = opts?.extraSlow ? Math.max(160, getTypeSpeed()) : getTypeSpeed();

    setTypingRole(role);
    setTypingName(talker.name);
    setTypingImg(talker.img);
    setTypingText("");

    for (let i = 0; i < text.length; i++) {
      if (typingCancelRef.current) return;
      setTypingText((prev) => prev + text[i]);
      await wait(sp);
    }

    setTypingText("");

    setMessages((p) =>
      pushMsgSafe(p, {
        id: uid(),
        role,
        text,
        name: talker.name,
        img: talker.img,
      })
    );
  }

  function cancelTyping() {
    typingCancelRef.current = true;
    setTypingText("");
  }

  function addDrunk(amount: number) {
    const coef = seatCast.drunkCoef;
    const effective = amount * (1 / coef);

    setDrunkGauge((p) =>
      clamp(Math.round(p + effective), 0, 100)
    );
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (drinkGauge <= 0) return;

      const gap = Date.now() - lastUserActionRef.current;

      if (gap > 40000) {
        setDrinkGauge((p) => clamp(p - SIP_AMOUNT, 0, 100));
        lastUserActionRef.current = Date.now();
      }
    }, 2000);

    return () => clearInterval(id);
  }, [drinkGauge]);

  function drinkSipFromTurn() {
    turnCounterRef.current++;

    if (turnCounterRef.current >= 3) {
      turnCounterRef.current = 0;
      setDrinkGauge((p) => clamp(p - SIP_AMOUNT, 0, 100));
    }
  }

  useEffect(() => {
    const id = setInterval(async () => {
      if (ended) return;
      if (typingText) return;
      if (helpCast) return;

      const gap = Date.now() - lastUserActionRef.current;
      if (gap < 45000) return;

      lastUserActionRef.current = Date.now();

      const lines = [
        "……ねえ。",
        "落ち着くね。",
        "……飲む？",
        nickname ? `……${nickname}、どうしたの？` : "……どうしたの？",
      ];

      const pick = lines[Math.floor(Math.random() * lines.length)];
      await typeCast(pick, seatCast, "cast", { extraSlow: true });
    }, 2000);

    return () => clearInterval(id);
  }, [ended, typingText, nickname, helpCast, seatCast]);

  useEffect(() => {
    if (drunkGauge < 100) return;
    if (helpCast) return;

    const pool = CASTS.filter((c) => c.id !== seatCast.id);
    const pick = pool[Math.floor(Math.random() * pool.length)];

    setHelpCast(pick);

    setMessages((p) => [
      ...p,
      {
        id: uid(),
        role: "help",
        text: "ちょっとヘルプ入りますね",
        name: pick.name,
        img: pick.img,
      },
      {
        id: uid(),
        role: "help",
        text: "ドリンク頂いていいかしら",
        name: pick.name,
        img: pick.img,
      },
    ]);
  }, [drunkGauge, helpCast, seatCast.id]);

  useEffect(() => {
    if (!helpCast) return;

    const id = setInterval(() => {
      if (Math.random() > 0.35) return;

      const line =
        sleepingLines[
          Math.floor(Math.random() * sleepingLines.length)
        ];

      setMessages((p) => [
        ...p,
        {
          id: uid(),
          role: "cast",
          text: line,
          name: seatCast.name,
          img: seatCast.img,
        },
      ]);
    }, 9000);

    return () => clearInterval(id);
  }, [helpCast, seatCast.name, seatCast.img]);
  // PART 4 / 5

  async function sendMessage() {
    if (ended) return;

    const text = input.trim();
    if (!text) return;

    lastUserActionRef.current = Date.now();

    drinkSipFromTurn();

    setInput("");
    cancelTyping();

    setMessages((p) =>
      pushMsgSafe(p, {
        id: uid(),
        role: "me",
        text,
      })
    );

    await wait(180);

    if (helpCast) {
      const aiText = await generateReply({
        character: helpCast.name,
        genre: "lounge",
        mode: "help",
        userMessage: text,
      });

      await typeCast(aiText, helpCast, "help");
      return;
    }

    const aiText = await generateReply({
      character: seatName,
      genre: "lounge",
      mode: `drunk:${drunkGauge} personality:${seatCast.personality} speech:${seatCast.speech} flirt:${seatCast.flirt} adultOk:${seatCast.adultOk ? "yes" : "no"}`,
      userMessage: text,
    });

    await typeCast(aiText, seatCast, "cast");
  }

  async function onCastDrink() {
    if (ended) return;
    if (!usePoint(COST.castDrink)) return;

    lastUserActionRef.current = Date.now();

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.castDrink);
    cancelTyping();

    await typeCast(
      "……ありがと。",
      helpCast ?? seatCast,
      helpCast ? "help" : "cast"
    );
  }

  async function onTequila() {
    if (ended) return;

    lastUserActionRef.current = Date.now();

    if (wheelRemaining !== null) {
      const next = wheelRemaining - 1;

      setDrinkGauge(100);
      addDrunk(DRINK_POWER.tequila);
      cancelTyping();

      if (next <= 0) {
        setWheelRemaining(null);
        showBurst("/drinks/wheel.png");
        await typeCast("……もう限界かも。", helpCast ?? seatCast, helpCast ? "help" : "cast", { extraSlow: true });
      } else {
        setWheelRemaining(next);
        await typeCast("……ん。", helpCast ?? seatCast, helpCast ? "help" : "cast");
      }

      return;
    }

    if (!usePoint(COST.tequila)) return;

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.tequila);
    cancelTyping();

    await typeCast("……ん。", helpCast ?? seatCast, helpCast ? "help" : "cast");
  }

  async function onCocaBomb() {
    if (ended) return;

    lastUserActionRef.current = Date.now();

    if (towerRemaining !== null) {
      const next = towerRemaining - 1;

      setDrinkGauge(100);
      addDrunk(DRINK_POWER.bomb);
      cancelTyping();

      const drank = 10 - next;
      if (drank === 3) showBurst("/drinks/bomb_3.png");
      if (drank === 6) showBurst("/drinks/bomb_6.png");
      if (drank === 10) showBurst("/drinks/bomb_10.png");

      if (next <= 0) {
        setTowerRemaining(null);
        await typeCast("……完全に酔っちゃった。", helpCast ?? seatCast, helpCast ? "help" : "cast", { extraSlow: true });
      } else {
        setTowerRemaining(next);
        await typeCast("……っ。", helpCast ?? seatCast, helpCast ? "help" : "cast");
      }

      return;
    }

    if (!usePoint(COST.bomb)) return;

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.bomb);
    cancelTyping();

    await typeCast("……っ。", helpCast ?? seatCast, helpCast ? "help" : "cast");
  }

  async function onChampagne() {
    if (ended) return;

    lastUserActionRef.current = Date.now();

    if (!champagneOrdered) {
      if (!usePoint(COST.champagne)) return;
      setChampagneOrdered(true);
      showBurst("/drinks/champagne.png");
    }

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.champagne);
    cancelTyping();

    await typeCast("わぁ…ありがとう。", helpCast ?? seatCast, helpCast ? "help" : "cast");
  }

  function startWheel() {
    if (ended) return;
    if (!usePoint(COST.wheel)) return;

    setWheelRemaining(10);
    showBurst("/drinks/wheel.png");
    setMenuOpen(false);
  }

  function startTower() {
    if (ended) return;
    if (!usePoint(COST.tower)) return;

    setTowerRemaining(10);
    setMenuOpen(false);
  }

  function pinCast(id: string) {
    if (!usePoint(COST.pin)) return;

    const found = CASTS.find((c) => c.id === id);
    if (!found) return;

    localStorage.setItem(CAST_KEY, id);
    setSeatCast(found);
    setHelpCast(null);
    setDrunkGauge(0);
    setDrinkGauge(0);
    turnCounterRef.current = 0;

    setMessages((p) =>
      pushMsgSafe(p, {
        id: uid(),
        role: "system",
        text: `${found.name}を指名しました。`,
      })
    );

    setMenuOpen(false);
  }

  const tequilaLabel =
    wheelRemaining !== null ? `🥃 ${wheelRemaining}` : "🥃50p";

  const bombLabel =
    towerRemaining !== null ? `💣 ${towerRemaining}` : "💣80p";

  const champagneLabel =
    champagneOrdered ? "🍾 ♾️" : "🍾500p";

  const castList = useMemo(() => CASTS, []);
  // PART 5 / 5

  return (
    <div className="lounge-page">

      <header className="lounge-header">

        <button
          className="lounge-back"
          onClick={() => {
            const running = Number(localStorage.getItem(SESSION_RUNNING_KEY) || "0");

            if (running) {
              const nextElapsed =
                Number(localStorage.getItem(SESSION_ELAPSED_KEY) || "0") +
                (Date.now() - running);

              localStorage.setItem(SESSION_ELAPSED_KEY, String(nextElapsed));
              setElapsedBase(nextElapsed);
              localStorage.removeItem(SESSION_RUNNING_KEY);
            }

            navigate(-1);
          }}
        >
          ◀︎
        </button>

        <div className="lounge-title">
          <img className="lounge-avatar" src={seatImg} alt={seatName} />
          <span className="lounge-name">{seatName}</span>
        </div>

        <div className="lounge-right">
          <div style={{ fontSize: 12, opacity: 0.9, marginRight: 10 }}>
            残り {fmtMmSs(remainingMs)}
          </div>

          <div className="drunk-gauge">
            <div
              className="drunk-fill"
              style={{ height: `${drunkGauge}%` }}
            />
          </div>

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
          <div key={m.id} className={`lounge-row ${m.role}`}>
            {(m.role === "cast" || m.role === "help") && (
              <img className="bubble-avatar" src={m.img} alt="" />
            )}

            <div className={`lounge-bubble ${m.role}`}>
              {m.name && <strong>{m.name}</strong>}
              <div>{m.text}</div>
            </div>
          </div>
        ))}

        {typingText && (
          <div className={`lounge-row ${typingRole}`}>
            <img className="bubble-avatar" src={typingImg || seatImg} alt="" />
            <div className={`lounge-bubble ${typingRole} typing`}>
              {typingName && <strong>{typingName}</strong>}
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
          {champagneLabel}
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
              <div className="modal-title">
                メニュー
              </div>

              <button
                className="x-btn"
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="menu-scroll">

              <div className="menu-block">
                <div className="menu-h">
                  現在ポイント
                </div>

                <div className="menu-p">
                  {point}p
                </div>
              </div>

              <div className="menu-block">
                <div className="menu-h">
                  ポイント購入
                </div>

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
                <div className="menu-h">
                  特別メニュー
                </div>

                <button
                  className="modal-item"
                  onClick={startWheel}
                >
                  テキーラ観覧車（400p）
                </button>

                <button
                  className="modal-item"
                  onClick={startTower}
                >
                  コカボムタワー（500p）
                </button>
              </div>

              <div className="menu-block">
                <div className="menu-h">
                  キャスト
                </div>

                <div className="cast-list">
                  {castList.map((c) => (
                    <button
                      key={c.id}
                      className="cast-item"
                      onClick={() => pinCast(c.id)}
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