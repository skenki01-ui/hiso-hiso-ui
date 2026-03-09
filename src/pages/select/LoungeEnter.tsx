import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../components/MenuModal";

/* ラウンジセッションキー */
const SESSION_ACTIVE_KEY = "hs_lounge_session_active";

export default function EnterLounge() {

  const nav = useNavigate();

  const [ok20, setOk20] = useState(false);
  const [point, setPoint] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const ENTRY_COST = 100;

  /* 初回ポイント取得 */

  useEffect(() => {

    const p = localStorage.getItem("point");

    if (p === null) {

      localStorage.setItem("point", "1000");
      setPoint(1000);

    } else {

      const n = Number(p);
      setPoint(Number.isFinite(n) ? n : 0);

    }

  }, []);

  /* 入店処理 */

  const enterLounge = () => {

    if (!ok20) return;

    const sessionActive = localStorage.getItem(SESSION_ACTIVE_KEY);

    /* 既に入店済みなら無料再入店 */

    if (sessionActive) {

      nav("/lounge/chat");
      return;

    }

    /* 初回入店 */

    if (point < ENTRY_COST) {
      alert("ポイントが足りません");
      return;
    }

    const next = point - ENTRY_COST;

    localStorage.setItem("point", String(next));
    setPoint(next);

    /* セッション開始 */

    localStorage.setItem(SESSION_ACTIVE_KEY, "1");

    nav("/lounge/chat");

  };

  const menuItems = useMemo(
    () => [
      {
        label: "説明",
        onClick: () => {
          setMenuOpen(false);
          alert("ミッドナイトラウンジは大人の会話空間です。\n入店に100pが必要です。");
        }
      },
      {
        label: "ポイント購入",
        onClick: () => {
          setMenuOpen(false);
          nav("/purchase/points");
        }
      },
      {
        label: "サブスク購入",
        onClick: () => {
          setMenuOpen(false);
          nav("/purchase/subscription");
        }
      },
      {
        label: "登録に戻る",
        onClick: () => {
          setMenuOpen(false);
          nav("/register");
        }
      }
    ],
    [nav]
  );

  return (

    <div style={styles.screen}>

      {/* Header */}
      <div style={styles.header}>

        <button
          style={styles.back}
          onClick={() => nav("/register")}
        >
          ◀︎
        </button>

        <div style={styles.title}>
          🌙 ミッドナイトラウンジ
        </div>

        <button
          style={styles.menu}
          onClick={() => setMenuOpen(true)}
        >
          ≡
        </button>

      </div>

      {/* Body */}
      <div style={styles.body}>

        <div style={styles.card}>

          <div style={styles.desc}>
            夜のひととき、落ち着いた会話を。
            <br />
            大人のためのラウンジです。
          </div>

          <div style={{ opacity: 0.85 }}>
            所持ポイント：{point}p
          </div>

          <label style={styles.check}>
            <input
              type="checkbox"
              checked={ok20}
              onChange={(e) => setOk20(e.target.checked)}
            />
            20歳以上です
          </label>

          <button
            style={{
              ...styles.enter,
              opacity: ok20 ? 1 : 0.5
            }}
            disabled={!ok20}
            onClick={enterLounge}
          >
            🌙 ミッドナイトラウンジ入店（100p）
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

/* styles */

const styles: Record<string, React.CSSProperties> = {

  screen: {
    minHeight: "100vh",
    background: "#0f0b1f",
    color: "#fff"
  },

  header: {
    display: "grid",
    gridTemplateColumns: "48px 1fr 48px",
    alignItems: "center",
    padding: "12px 14px",
    background: "#1a1433"
  },

  back: {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: 18,
    cursor: "pointer"
  },

  title: {
    textAlign: "center",
    fontWeight: 800
  },

  menu: {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: 20,
    cursor: "pointer"
  },

  body: {
    padding: 16
  },

  card: {
    background: "#1f1840",
    borderRadius: 12,
    padding: 16,
    display: "grid",
    gap: 16
  },

  desc: {
    lineHeight: 1.6,
    opacity: 0.9
  },

  check: {
    display: "flex",
    gap: 8,
    alignItems: "center"
  },

  enter: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    background: "#6b5cff",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer"
  }

};