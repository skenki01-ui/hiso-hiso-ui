import { useNavigate } from "react-router-dom";
import { startFullSub, startMidnightSub, cancelSub } from "../../utils/subscription";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MenuModal({ open, onClose }: Props) {

  const navigate = useNavigate();

  if (!open) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  async function buyDayPass() {

    const userId = localStorage.getItem("user_id") || "guest";

    const res = await fetch("/api/use-point", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        amount: 80
      })
    });

    const data = await res.json();

    if (!data.success) {
      alert("ポイントが足りません");
      return;
    }

    const until = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("hs_day_pass_until", String(until));

    alert("1DAYパス購入しました");

    onClose();
  }

  function buyMidnightSub() {
    startMidnightSub();
    alert("夜サブスク開始（20:00〜5:00無制限）");
    onClose();
  }

  function buyFullSub() {
    startFullSub();
    alert("全時間サブスク開始（24時間無制限）");
    onClose();
  }

  function cancelSubscription() {
    cancelSub();
    alert("サブスク解約しました");
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999
      }}
      onClick={onClose}
    >

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          width: 260,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >

        <button onClick={buyDayPass}>
          1DAYパス（80p）
        </button>

        <button onClick={buyMidnightSub}>
          夜サブスク（1200円）
        </button>

        <button onClick={buyFullSub}>
          全時間サブスク（1900円）
        </button>

        <button onClick={cancelSubscription}>
          サブスク解約
        </button>

        <button onClick={() => go("/about")}>
          説明
        </button>

        <button onClick={() => go("/about/point")}>
          ポイントについて
        </button>

        <button onClick={() => go("/share")}>
          友だちに教える
        </button>

        <button onClick={() => navigate(-1)}>
          戻る
        </button>

        <button onClick={onClose}>
          閉じる
        </button>

      </div>
    </div>
  );
}