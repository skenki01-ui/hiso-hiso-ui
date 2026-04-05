import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import { supabase } from "../../lib/supabase";

const SESSION_KEY = "hs_lounge_session_time";

export default function EnterLounge() {

  const nav = useNavigate();

  const userId = localStorage.getItem("user_id") || "";

  const [ok20, setOk20] = useState(false);
  const [point, setPoint] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const ENTRY_COST = 100;
  const SESSION_TIME = 60 * 60 * 1000; // 60分

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

    const res = await fetch("http://localhost:3000/use-point", {
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
     入店処理（時間管理）
  =============================== */
  const enterLounge = async () => {

    if (!ok20) return;

    const now = Date.now();

    const saved = localStorage.getItem(SESSION_KEY);
    const sessionTime = saved ? Number(saved) : 0;

    const stillActive = sessionTime && (now - sessionTime < SESSION_TIME);

    // 🔥 セッション有効なら無料
    if (stillActive) {
      nav("/lounge/chat");
      return;
    }

    // 🔥 新規入店（課金）
    const ok = await usePoint(ENTRY_COST);
    if (!ok) return;

    localStorage.setItem(SESSION_KEY, String(now));

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
          alert("ミッドナイトラウンジは大人の会話空間です。\n入店に100pが必要です。");
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
        <button style={styles.back} onClick={() => nav("/register")}>
          ◀︎
        </button>

        <div style={styles.title}>
          🌙 ミッドナイトラウンジ
        </div>

        <button style={styles.menu} onClick={() => setMenuOpen(true)}>
          ≡
        </button>
      </div>

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