import { useNavigate } from "react-router-dom";

export default function SubscriptionPurchase() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>← 戻る</button>

      <h1>サブスク購入</h1>

      <div style={{ marginBottom: 24 }}>
        <h2>🌙 ミッドナイト無制限</h2>
        <p>20:00〜5:00 無制限</p>
        <p>1200円 / 月</p>
        <button onClick={() => alert("ミッドナイト購入（仮）")}>
          購入する
        </button>
      </div>

      <div>
        <h2>⏰ 24時間無制限</h2>
        <p>いつでも無制限</p>
        <p>1900円 / 月</p>
        <button onClick={() => alert("24時間購入（仮）")}>
          購入する
        </button>
      </div>
    </div>
  );
}