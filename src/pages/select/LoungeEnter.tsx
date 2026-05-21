import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import { supabase } from "../../lib/supabase";

const SESSION_KEY = "hs_lounge_session_time";

export default function EnterLounge() {

  const nav = useNavigate();

  const userId = localStorage.getItem("user_id") || "guest";

  const [ok20, setOk20] = useState(false);
  const [point, setPoint] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const ENTRY_COST = 100;
  const SESSION_TIME = 60 * 60 * 1000;

  /* ===============================
     ポイント取得
  =============================== */
  async function loadPoint() {

    if (!userId) return;

    const { data } = await supabase
      .from("users")
      .select("point")
      .eq("id", userId)
      .single();

    if (data) {
      setPoint(data.point || 0);
    }

  }

  useEffect(() => {
    loadPoint();
  }, []);

  /* ===============================
     ポイント消費
  =============================== */
  async function usePoint(cost: number) {

    const API_BASE =
      (import.meta.env.VITE_API_BASE_URL as string | undefined)
      || "http://localhost:3000";

    const res = await fetch(`${API_BASE}/api/use-point`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        amount: cost,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("ポイントが足りません");
      return false;
    }

    setPoint(data.point || 0);

    return true;
  }

  /* ===============================
     入店処理
  =============================== */
  const enterLounge = async () => {

    if (!ok20) return;

    const now = Date.now();

    const saved = localStorage.getItem(SESSION_KEY);

    const sessionTime = saved
      ? Number(saved)
      : 0;

    const stillActive =
      sessionTime &&
      (now - sessionTime < SESSION_TIME);

    // 🔥 セッション有効なら無料
    if (stillActive) {

      nav("/lounge/chat");

      return;
    }

    // 🔥 新規入店
    const ok = await usePoint(ENTRY_COST);

    if (!ok) return;

    localStorage.setItem(
      SESSION_KEY,
      String(now)
    );

    nav("/lounge/chat");

  };

  /* ===============================
     メニュー
  =============================== */
  const menuItems = useMemo(
    () => [
      {
        label: "説明",
        onClick: () => {

          setMenuOpen(false);

          alert(
            "落ち着いた静かな会話空間です。\n入店に100pが必要です。"
          );
        }
      },
      {
        label: "ポイント購入",
        onClick: () => {

          setMenuOpen(false);

          nav("/purchase/point");
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

      <div style={styles.header}>

        <button
          style={styles.back}
          onClick={() => nav("/register")}
        >
          ◀︎
        </button>

        <div style={styles.title}>
          🌙 BAR
        </div>

        <button
          style={styles.menu}
          onClick={() => setMenuOpen(true)}
        >
          ≡
        </button>

      </div>

      <div style={styles.body}>

        <div style={styles.card}>

          <div style={styles.desc}>
            夜のひととき、
            <br />
            落ち着いた会話を。
            <br />
            <br />
            落ち着いた静かな空間です。
          </div>

          <div style={styles.point}>
            所持ポイント：{point}p
          </div>

          <label style={styles.check}>

            <input
              type="checkbox"
              checked={ok20}
              onChange={(e) =>
                setOk20(e.target.checked)
              }
            />

            20歳以上です

          </label>

          <button
            style={{
              ...styles.enter,
              opacity: ok20 ? 1 : 0.45
            }}
            disabled={!ok20}
            onClick={enterLounge}
          >
            🌙 BARに入る（100p）
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

const styles: Record<string, React.CSSProperties> = {

  screen: {
    minHeight: "100dvh",
    background:
      "radial-gradient(circle at top, #1d1638 0%, #0b0717 72%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column"
  },

  header: {
    height: 54,
    minHeight: 54,
    display: "grid",
    gridTemplateColumns: "42px 1fr 42px",
    alignItems: "center",
    padding: "0 10px",
    background: "rgba(15,11,31,0.82)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    flexShrink: 0
  },

  back: {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    opacity: 0.92
  },

  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: "0.04em",
    opacity: 0.96
  },

  menu: {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    opacity: 0.92
  },

  body: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    boxSizing: "border-box"
  },

  card: {
    width: "100%",
    maxWidth: 360,
    background: "rgba(31,24,64,0.72)",
    borderRadius: 22,
    padding: "22px 18px",
    display: "grid",
    gap: 18,
    backdropFilter: "blur(18px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.34)",
    border: "1px solid rgba(255,255,255,0.06)"
  },

  desc: {
    lineHeight: 1.9,
    opacity: 0.9,
    fontSize: 14,
    textAlign: "center"
  },

  point: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.88
  },

  check: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    opacity: 0.92
  },

  enter: {
    height: 46,
    borderRadius: 16,
    border: "none",
    background:
      "linear-gradient(135deg, #7867ff 0%, #4c8dff 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(92,118,255,0.28)"
  }
};