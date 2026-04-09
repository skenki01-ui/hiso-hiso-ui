import { useNavigate } from "react-router-dom";

export default function PointsAbout() {

  const navigate = useNavigate();

  const handleBuy = async (amount: number, point: number) => {

    try {

      let user_id = localStorage.getItem("user_id");

      if (!user_id) {
        user_id = crypto.randomUUID();
        localStorage.setItem("user_id", user_id);
      }

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id,
          amount: point
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert("決済失敗");
        return;
      }

      alert(`ポイント購入成功🔥 +${point}p`);

      navigate(-1);

    } catch (e) {
      alert("通信エラー");
    }

  };

  return (
    <div style={{
      padding: 20,
      background: "#eaf3ff",
      minHeight: "100vh"
    }}>

      {/* 🔥 ヘッダー */}
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
          ポイント
        </div>
      </div>

      {/* 🔥 本体 */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        maxWidth: 500,
        margin: "0 auto",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>

        <h2 style={{ marginBottom: 10 }}>ポイントについて</h2>

        <p>1ターン = 5p</p>
        <p>キャラクターと1回会話できます</p>
        <p>1DAYパス = 80p</p>
        <p>24時間ターン無制限</p>

        <h3 style={{ marginTop: 20 }}>カード情報</h3>

        <input defaultValue="4242424242424242" style={inputStyle} />
        <input defaultValue="123" style={inputStyle} />
        <input defaultValue="12" style={inputStyle} />
        <input defaultValue="2030" style={inputStyle} />

        <h3 style={{ marginTop: 20 }}>ポイント購入</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
          marginTop: 10
        }}>

          <button onClick={() => handleBuy(100, 10)} style={btn}>100円 → 10p</button>
          <button onClick={() => handleBuy(300, 30)} style={btn}>300円 → 30p</button>
          <button onClick={() => handleBuy(500, 50)} style={btn}>500円 → 50p</button>
          <button onClick={() => handleBuy(1000, 105)} style={btn}>1000円 → 105p</button>
          <button onClick={() => handleBuy(3000, 320)} style={btn}>3000円 → 320p</button>
          <button onClick={() => handleBuy(5000, 550)} style={btn}>5000円 → 550p</button>
          <button onClick={() => handleBuy(10000, 1200)} style={btn}>10000円 → 1200p</button>

        </div>

      </div>

    </div>
  );
}

const btn: React.CSSProperties = {
  padding: "12px 10px",
  borderRadius: 8,
  border: "none",
  background: "#4da3ff",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer"
};

const inputStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 14,
  marginBottom: 8
};