import { useState } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Payjp: any;
  }
}

export default function SubscriptionPurchase() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function startSubscription(planId: string) {

    if (loading) return;

    setLoading(true);

    try {

      let user_id = localStorage.getItem("user_id");

      if (!user_id) {
        user_id = crypto.randomUUID();
        localStorage.setItem("user_id", user_id);
      }

      const payjp = window.Payjp(import.meta.env.VITE_PAYJP_PUBLIC_KEY);

      const tokenRes = await payjp.createToken({
        number: "4242424242424242",
        cvc: "123",
        exp_month: "12",
        exp_year: "2030"
      });

      if (!tokenRes || !tokenRes.id) {
        alert("カードエラー");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/chat/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: tokenRes.id,
          planId,
          user_id
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert("サブスク失敗");
        setLoading(false);
        return;
      }

      // 🔥 ここ追加（超重要）
      if (planId === "pln_24c2483b10511126e64280ae40b0") {
        localStorage.setItem("hs_sub_type", "full");
      } else {
        localStorage.setItem("hs_sub_type", "night");
      }

      alert("サブスク登録成功🔥");

      navigate(-1);

    } catch (e) {
      alert("通信エラー");
    }

    setLoading(false);
  }

  return (

    <div style={{
      padding: 20,
      background: "#eaf3ff",
      minHeight: "100vh"
    }}>

      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 10
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: 18,
            cursor: "pointer",
            marginRight: 10
          }}
        >
          ◀︎
        </button>

        <div style={{ fontWeight: "bold" }}>
          サブスク
        </div>
      </div>

      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        maxWidth: 500,
        margin: "0 auto",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>

        <button
          style={btn}
          onClick={() => startSubscription("pln_aee82ead6147d80c45dad384dca3")}
        >
          夜プラン（20:00-5:00）1200円/月
        </button>

        <button
          style={btn}
          onClick={() => startSubscription("pln_24c2483b10511126e64280ae40b0")}
        >
          フルプラン（24時間）1900円/月
        </button>

      </div>

    </div>

  );
}

const btn: React.CSSProperties = {
  padding: "14px",
  borderRadius: 10,
  border: "none",
  background: "#4da3ff",
  color: "#fff",
  fontWeight: "bold",
  fontSize: 14,
  cursor: "pointer"
};