// src/pages/pay.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pay() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("user_id") || "guest";

  async function handlePay(amount: number) {

    setLoading(true);

    try {

      const res = await fetch("http://localhost:3000/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          amount
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert("ポイント追加失敗");
        setLoading(false);
        return;
      }

      alert(`ポイント追加成功🔥 +${amount}p（合計 ${data.point}）`);

      navigate(-1);

    } catch {
      alert("通信エラー");
    }

    setLoading(false);
  }

  return (

    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>

      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        💳 ポイント購入
      </h2>

      <button onClick={() => handlePay(10)}>100円 → 10p</button>
      <button onClick={() => handlePay(30)}>300円 → 30p</button>
      <button onClick={() => handlePay(50)}>500円 → 50p</button>
      <button onClick={() => handlePay(105)}>1000円 → 105p</button>
      <button onClick={() => handlePay(320)}>3000円 → 320p</button>
      <button onClick={() => handlePay(550)}>5000円 → 550p</button>
      <button onClick={() => handlePay(1200)}>10000円 → 1200p</button>

    </div>

  );

}

// fix2