// src/pages/chat/LoungeChat.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoungeChat.css";

/* =========================
= Types
========================= */
type Role = "me" | "cast" | "system";
type Msg = { id: string; role: Role; text: string };

type Blood = "A" | "B" | "O" | "AB";

type Cast = {
  id: string;
  name: string;
  img: string; // /girls/xxx.png（public配下）
  birthday: string; // "M/D"
  blood: Blood;
  drunkCoef: 0.7 | 1.0 | 1.3 | 1.5;
};

/* =========================
= Utils
========================= */
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** 連続同文防止（直前と同じなら弾く） */
function pushMsgSafe(prev: Msg[], next: Msg): Msg[] {
  const last = prev[prev.length - 1];
  if (last && last.role === next.role && last.text === next.text) return prev;
  return [...prev, next];
}

/* =========================
= Casts（女の子のみ / 20人）
========================= */
const CASTS: Cast[] = [
  { id: "rio", name: "りお", img: "/girls/rio.png", birthday: "3/12", blood: "A", drunkCoef: 1.0 },
  { id: "saya", name: "さや", img: "/girls/saya.png", birthday: "8/7", blood: "O", drunkCoef: 1.3 },
  { id: "yuna", name: "ゆな", img: "/girls/yuna.png", birthday: "5/21", blood: "B", drunkCoef: 0.7 },
  { id: "mahiro", name: "まひろ", img: "/girls/mahiro.png", birthday: "10/2", blood: "AB", drunkCoef: 1.0 },
  { id: "rena", name: "れな", img: "/girls/rena.png", birthday: "1/28", blood: "A", drunkCoef: 1.3 },
  { id: "hina", name: "ひな", img: "/girls/hina.png", birthday: "6/14", blood: "O", drunkCoef: 1.5 },
  { id: "tsumugi", name: "つむぎ", img: "/girls/tsumugi.png", birthday: "11/9", blood: "B", drunkCoef: 1.0 },
  { id: "aoi", name: "あおい", img: "/girls/aoi.png", birthday: "2/3", blood: "A", drunkCoef: 0.7 },
  { id: "kaede", name: "かえで", img: "/girls/kaede.png", birthday: "9/19", blood: "O", drunkCoef: 1.0 },
  { id: "mitsuki", name: "みつき", img: "/girls/mitsuki.png", birthday: "4/30", blood: "AB", drunkCoef: 1.3 },
  { id: "koharu", name: "こはる", img: "/girls/koharu.png", birthday: "12/1", blood: "A", drunkCoef: 1.0 },
  { id: "suzu", name: "すず", img: "/girls/suzu.png", birthday: "7/26", blood: "B", drunkCoef: 0.7 },
  { id: "honoka", name: "ほのか", img: "/girls/honoka.png", birthday: "5/5", blood: "O", drunkCoef: 1.3 },
  { id: "rin", name: "りん", img: "/girls/rin.png", birthday: "8/31", blood: "A", drunkCoef: 1.0 },

  { id: "nagisa", name: "なぎさ", img: "/girls/nagisa.png", birthday: "6/6", blood: "AB", drunkCoef: 1.0 },
  { id: "shion", name: "しおん", img: "/girls/shion.png", birthday: "9/2", blood: "B", drunkCoef: 1.3 },
  { id: "kanon", name: "かのん", img: "/girls/kanon.png", birthday: "3/3", blood: "O", drunkCoef: 0.7 },
  { id: "crea", name: "くれあ", img: "/girls/crea.png", birthday: "1/17", blood: "A", drunkCoef: 1.5 },
  { id: "momo", name: "もも", img: "/girls/momo.png", birthday: "10/10", blood: "O", drunkCoef: 1.0 },
  { id: "maika", name: "まいか", img: "/girls/maika.png", birthday: "4/4", blood: "B", drunkCoef: 1.3 },
];

/* =========================
= Drink Power（強さ順）
========================= */
const DRINK_POWER = {
  castDrink: 6,
  tequila: 10,
  bomb: 14,
  champagne: 18,
};

export default function LoungeChat() {
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* =========================
  = Time / Set
  ========================= */
  const SET_MS = 60 * 60 * 1000; // 60分
  const CHANGE_MS = 30 * 60 * 1000; // 指名なしのみ 30分チェンジ

  const [setStartedAt] = useState(() => Date.now()); // 指名しても残り時間は維持（触らない）
  const [now, setNow] = useState(() => Date.now());
  const elapsed = now - setStartedAt;
  const remainingMs = Math.max(0, SET_MS - elapsed);

  /* =========================
  = Seat / Pin
  ========================= */
  const [seatCast, setSeatCast] = useState<Cast>(() => CASTS[Math.floor(Math.random() * CASTS.length)]);
  const [pinnedCastId, setPinnedCastId] = useState<string | null>(null);
  const pinned = !!pinnedCastId;

  /* =========================
  = Core state
  ========================= */
  const [menuOpen, setMenuOpen] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    { id: uid(), role: "cast", text: "……いらっしゃい。" },
  ]);
  const messagesRef = useRef<Msg[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const [input, setInput] = useState("");

  // 1文字タイピング（140ms）
  const TYPE_MS = 140;
  const [typingText, setTypingText] = useState("");
  const typingCancelRef = useRef(false);

  // gauges
  const [drunkGauge, setDrunkGauge] = useState(0); // 0..100
  const [drinkGauge, setDrinkGauge] = useState(0); // 0..100（最初0）

  // points
  const [point, setPoint] = useState(0);

  // purchases
  const [champagneOrdered, setChampagneOrdered] = useState(false);
  const [wheelRemaining, setWheelRemaining] = useState<number | null>(null); // 10..0
  const [towerRemaining, setTowerRemaining] = useState<number | null>(null); // 10..0

  // end / help
  const [ended, setEnded] = useState(false);
  const helpLockRef = useRef(false);

  const canPin = !ended;

  const seatImg = seatCast.img;
  const seatName = seatCast.name;

  /* =========================
  = バーン演出（2秒）
  ========================= */
  const [burstImg, setBurstImg] = useState<string | null>(null);
  function showBurst(img: string) {
    setBurstImg(img);
    window.setTimeout(() => setBurstImg(null), 2000);
  }

  /* =========================
  = Init: point (仮1000)
  ========================= */
  useEffect(() => {
    const p = localStorage.getItem("point");
    if (p === null) {
      localStorage.setItem("point", "1000");
      setPoint(1000);
    } else {
      setPoint(Number(p));
    }
  }, []);

  const addPoint = (delta: number) => {
    const next = Math.max(0, point + delta);
    setPoint(next);
    localStorage.setItem("point", String(next));
  };

  const usePoint = (cost: number) => {
    if (point < cost) {
      alert("ポイントが足りません");
      return false;
    }
    const next = point - cost;
    setPoint(next);
    localStorage.setItem("point", String(next));
    return true;
  };

  /* =========================
  = Clock tick
  ========================= */
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  /* =========================
  = Auto scroll
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText, menuOpen]);

  /* =========================
  = Drink gauge decay
  ========================= */
  useEffect(() => {
    if (drinkGauge <= 0) return;
    const id = window.setInterval(() => setDrinkGauge((p) => Math.max(0, p - 2)), 500);
    return () => window.clearInterval(id);
  }, [drinkGauge]);

  /* =========================
  = Set end by time
  ========================= */
  useEffect(() => {
    if (ended) return;
    if (remainingMs > 0) return;
    setEnded(true);
    setMessages((p) => pushMsgSafe(p, { id: uid(), role: "system", text: "……今日はここまで。" }));
  }, [remainingMs, ended]);

  /* =========================
  = 30min change（指名なしのみ）
  ========================= */
  useEffect(() => {
    if (ended) return;
    if (pinned) return;
    if (elapsed < CHANGE_MS) return;

    const next = CASTS[Math.floor(Math.random() * CASTS.length)];
    setSeatCast(next);
    setMessages((p) => pushMsgSafe(p, { id: uid(), role: "cast", text: "……席、変わるね。" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, pinned, ended]);

  /* =========================
  = Typing（1 char）
  ========================= */
  async function typeCast(text: string, opts?: { extraSlow?: boolean }) {
    typingCancelRef.current = false;
    const sp = opts?.extraSlow ? 280 : TYPE_MS;

    setTypingText("");
    for (let i = 0; i < text.length; i++) {
      if (typingCancelRef.current) return;
      setTypingText((prev) => prev + text[i]);
      await wait(sp);
    }

    setTypingText("");
    setMessages((p) => pushMsgSafe(p, { id: uid(), role: "cast", text }));
  }

  function cancelTyping() {
    typingCancelRef.current = true;
    setTypingText("");
  }

  /* =========================
  = Drunk increase
  ========================= */
  function addDrunk(amount: number) {
    const coef = seatCast.drunkCoef;
    const effective = amount * (1 / coef); // 0.7は増えやすい

    setDrunkGauge((p) => {
      const next = clamp(Math.round(p + effective), 0, 100);
      if (next >= 100) {
        window.setTimeout(() => doHelpCutIn(), 0);
      }
      return next;
    });
  }

  /* =========================
  = Help cut-in（100%）
  ========================= */
  async function doHelpCutIn() {
    if (helpLockRef.current) return;
    helpLockRef.current = true;
    if (ended) return;

    const helper = CASTS[Math.floor(Math.random() * CASTS.length)];
    setSeatCast(helper);

    cancelTyping();
    await wait(200);
    await typeCast("この子今日はお話し出来なさそうだね");
    await wait(160);
    await typeCast("ちょっとヘルプ入りますね");
    await wait(160);
    await typeCast("ドリンク頂いていいかしら");

    setEnded(true);
    await wait(250);
    await typeCast("今日はムリみたいなんで、ここまでにしましょうか");
  }

  /* =========================
  = Send
  ========================= */
  async function sendMessage() {
    if (ended) return;
    if (!input.trim()) return;

    const text = input;
    setInput("");

    cancelTyping();
    setMessages((p) => pushMsgSafe(p, { id: uid(), role: "me", text }));

    await wait(200);

        // pinned + 酔い：たまに演出
    if (pinned && drunkGauge >= 65) {
      const roll = Math.random();
      if (roll < 0.34) {
        const lines = ["酔ったかも…", "…気持ち良い…", "ふわふわする…"];
        const last = messagesRef.current[messagesRef.current.length - 1];
        const pool = lines.filter((s) => !(last && last.role === "cast" && last.text === s));
        const pick = (pool.length ? pool : lines)[Math.floor(Math.random() * (pool.length ? pool.length : lines.length))];
        await typeCast(pick, { extraSlow: true });
        return;
      }
    }

    const replies = ["……うん。", "それ、いいね。", "……ふふ。", "ちゃんと聞いてる。", "今の、好き。"];
    const lastCast = [...messagesRef.current].reverse().find((m) => m.role === "cast");
    const pool = replies.filter((s) => !(lastCast && lastCast.text === s));
    const pick = (pool.length ? pool : replies)[Math.floor(Math.random() * (pool.length ? pool.length : replies.length))];
    await typeCast(pick);
  }

  /* =========================
  = Drink actions（4 buttons）
  ========================= */
  async function onCastDrink() {
    if (ended) return;
    if (!usePoint(30)) return;

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.castDrink);

    cancelTyping();
    await typeCast("……ありがと。");
  }

  async function onTequila() {
    if (ended) return;

    // 観覧車購入中（10→0）※購入400pでまとめて
    if (wheelRemaining !== null) {
      const next = wheelRemaining - 1;

      setDrinkGauge(100);
      addDrunk(DRINK_POWER.tequila);

      cancelTyping();

      if (next <= 0) {
        setWheelRemaining(null);

        // ★ 完飲バーン（最後）
        showBurst("/drinks/wheel.png");

        await typeCast("……もう限界かも。", { extraSlow: true });
      } else {
        setWheelRemaining(next);
        await typeCast("……ん。");
      }
      return;
    }

    // 通常 50p
    if (!usePoint(50)) return;

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.tequila);

    cancelTyping();
    await typeCast("……ん。");
  }

  async function onCocaBomb() {
    if (ended) return;

    // タワー購入中（10→0）※購入500pでまとめて
    if (towerRemaining !== null) {
      const next = towerRemaining - 1;

      setDrinkGauge(100);
      addDrunk(DRINK_POWER.bomb);

      cancelTyping();

      // ★ ボム：10 / 6 / 3 のタイミングで2秒バーン
      if (next === 10) showBurst("/drinks/bomb_10.png"); // 最初の一杯後に「10段」
      if (next === 6) showBurst("/drinks/bomb_6.png");
      if (next === 3) showBurst("/drinks/bomb_3.png");

      if (next <= 0) {
        setTowerRemaining(null);
        await typeCast("……完全に酔っちゃった。", { extraSlow: true });
      } else {
        setTowerRemaining(next);
        await typeCast("……っ。");
      }
      return;
    }

    // 通常 80p
    if (!usePoint(80)) return;

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.bomb);

    cancelTyping();
    await typeCast("……っ。");
  }

  async function onChampagne() {
    if (ended) return;

    // 注文前だけ 500p。注文後は♾️（仕様）
    if (!champagneOrdered) {
      if (!usePoint(500)) return;
      setChampagneOrdered(true);

      // ★ シャンパン注文時に1回バーン
      showBurst("/drinks/champagne.png");
    }

    setDrinkGauge(100);
    addDrunk(DRINK_POWER.champagne);

    cancelTyping();
    await typeCast("わぁ…ありがとう。");
  }

  /* =========================
  = Menu actions
  ========================= */
  function menuClose() {
    setMenuOpen(false);
  }

  function startWheel() {
    if (ended) return;
    if (!usePoint(400)) return;

    setWheelRemaining(10);

    // ★ 最初バーン（観覧車）
    showBurst("/drinks/wheel.png");

    menuClose();
  }

  function startTower() {
    if (ended) return;
    if (!usePoint(500)) return;

    setTowerRemaining(10);

    // ★ 最初バーン（タワー10段）
    showBurst("/drinks/bomb_10.png");

    menuClose();
  }

  async function pinCast(c: Cast) {
    if (!canPin) return;
    if (!usePoint(30)) return;

    setPinnedCastId(c.id);
    setSeatCast(c);
    menuClose();

    cancelTyping();
    await wait(120);
    await typeCast("……よろしく。");
  }

  /* =========================
  = Labels
  ========================= */
  const tequilaLabel = wheelRemaining !== null ? `🥃 ${wheelRemaining}` : "🥃50p";
  const bombLabel = towerRemaining !== null ? `💣 ${towerRemaining}` : "💣80p";
  const champagneLabel = champagneOrdered ? "🍾 ♾️" : "🍾500p";

  /* =========================
  = Menu cast list
  ========================= */
  const castList = useMemo(() => CASTS, []);

  return (
    <div className="lounge-page">
      {/* ===== Header ===== */}
      <header className="lounge-header">
        <button className="lounge-back" onClick={() => navigate(-1)} aria-label="戻る">
          ◀︎
        </button>

        <div className="lounge-title">
          <img className="lounge-avatar" src={seatImg} alt={seatName} />
          <span className="lounge-name">{seatName}</span>
        </div>

        <div className="lounge-right">
          <div className="drunk-gauge" aria-hidden="true">
            <div className="drunk-fill" style={{ height: `${drunkGauge}%` }} />
          </div>

          <button className="lounge-menu" onClick={() => setMenuOpen(true)} aria-label="メニュー">
            ≡
          </button>
        </div>
      </header>

      {/* ===== Body ===== */}
      <main className="lounge-body">
        {messages.map((m) => (
          <div key={m.id} className={`lounge-row ${m.role}`}>
            {m.role === "cast" && <img className="bubble-avatar" src={seatImg} alt="" />}
            <div className={`lounge-bubble ${m.role}`}>{m.text}</div>
          </div>
        ))}

        {/* 1文字演出 */}
        {typingText && (
          <div className="lounge-row cast">
            <img className="bubble-avatar" src={seatImg} alt="" />
            <div className="lounge-bubble cast typing">{typingText}</div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* ===== 左下：ドリンクゲージ ===== */}
      <div className="drink-gauge-wrap" aria-hidden="true" title="ドリンク">
        <div className="drink-icon">🥂</div>
        <div className="drink-gauge">
          <div className="drink-fill" style={{ height: `${drinkGauge}%` }} />
        </div>
      </div>

      {/* ===== Input ===== */}
      <footer className="lounge-input">
        <input
          className="lounge-text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={ended}
        />
        <button className="lounge-send" onClick={sendMessage} disabled={ended}>
          送信
        </button>
      </footer>

      {/* ===== Drinks（4個だけ） ===== */}
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

      {/* ===== Menu ===== */}
      {menuOpen && (
        <div className="modal-backdrop" onClick={menuClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">メニュー</div>
              <button className="x-btn" onClick={menuClose} aria-label="閉じる">
                ×
              </button>
            </div>

            <div className="menu-scroll">
              {/* 説明 */}
              <div className="menu-block">
                <div className="menu-h">説明</div>
                <div className="menu-p">
                  ミッドナイトラウンジは、会話そのものを楽しむ大人の空間です。
                  <br />
                  特別扱いはありません。関係性の世界です。
                </div>
              </div>

              {/* ポイント */}
              <div className="menu-block">
                <div className="menu-h">ポイント購入</div>
                <div className="menu-p">いまのポイント：{point}p</div>

                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                  <button className="modal-item" onClick={() => addPoint(10)}>
                    100円 = 10p（仮）
                  </button>
                  <button className="modal-item" onClick={() => addPoint(30)}>
                    300円 = 30p（仮）
                  </button>
                  <button className="modal-item" onClick={() => addPoint(50)}>
                    500円 = 50p（仮）
                  </button>
                  <button className="modal-item" onClick={() => addPoint(105)}>
                    1000円 = 105p（仮）
                  </button>
                  <button className="modal-item" onClick={() => addPoint(320)}>
                    3000円 = 320p（仮）
                  </button>
                  <button className="modal-item" onClick={() => addPoint(550)}>
                    5000円 = 550p（仮）
                  </button>
                  <button className="modal-item" onClick={() => addPoint(1200)}>
                    10000円 = 1200p（仮）
                  </button>
                </div>
              </div>

              {/* 特別メニュー */}
              <div className="menu-block">
                <div className="menu-h">特別メニュー</div>
                <button className="modal-item" onClick={startWheel} disabled={ended}>
                  テキーラ観覧車（400p）
                </button>
                <button className="modal-item" onClick={startTower} disabled={ended}>
                  コカボムタワー（500p）
                </button>
                <div className="menu-note" style={{ marginTop: 10 }}>
                  ※購入後、下の🥃/💣が「10→0」でカウントダウンします
                </div>
              </div>

                            {/* キャスト一覧 */}
              <div className="menu-block">
                <div className="menu-h">キャスト一覧</div>
                <div className="menu-hint">名前を押すと指名されます（30p）</div>

                <div className="cast-list">
                  {castList.map((c) => (
                    <button
                      key={c.id}
                      className="cast-item"
                      onClick={() => pinCast(c)}
                      disabled={!canPin}
                      title={`誕生日:${c.birthday} / 血液型:${c.blood}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {!canPin && <div className="menu-note">今日はムリみたいです。</div>}
              </div>

              <button className="modal-close" onClick={menuClose}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== バーン（2秒） ===== */}
      {burstImg && (
        <div className="burst-overlay">
          <img src={burstImg} className="burst-img" alt="burst" />
        </div>
      )}
    </div>
  );
}