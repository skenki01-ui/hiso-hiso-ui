import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PointSuccess() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("ポイントを反映しています...");
  const [addedPoint, setAddedPoint] = useState(0);
  const [totalPoint, setTotalPoint] = useState(0);

  useEffect(() => {
    async function confirmPayment() {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        setMessage("決済情報が見つかりませんでした");
        return;
      }

      try {
        const res = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.success) {
          setMessage(`ポイント反映に失敗しました：${data?.error || "unknown"}`);
          return;
        }

        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("point", String(data.point));
        localStorage.setItem("points", String(data.point));

        setAddedPoint(Number(data.addPoint || 0));
        setTotalPoint(Number(data.point || 0));
        setMessage("ポイントを反映しました");
      } catch (e) {
        console.error(e);
        setMessage("通信エラーでポイントを反映できませんでした");
      }
    }

    confirmPayment();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eaf3ff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        padding: 20,
        textAlign: "center",
      }}
    >
      <h2>ポイント購入ありがとうございます</h2>

      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 20,
          width: "100%",
          maxWidth: 360,
          fontWeight: "bold",
          lineHeight: 1.8,
        }}
      >
        <div>{message}</div>

        {addedPoint > 0 && (
          <>
            <div>追加ポイント：+{addedPoint}p</div>
            <div>現在のポイント：{totalPoint}p</div>
          </>
        )}
      </div>

      <button
        onClick={() => navigate("/select/boy")}
        style={{
          padding: "12px 20px",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          background: "#222",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        チャットに戻る
      </button>
    </div>
  );
}