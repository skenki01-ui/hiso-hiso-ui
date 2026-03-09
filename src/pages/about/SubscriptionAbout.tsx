// src/pages/about/SubscriptionAbout.tsx
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function SubscriptionAbout() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16 }}>
      <BackButton />

      <h1>サブスクについて</h1>

      <p>
        サブスクに登録すると、
        <br />
        ターン制限を気にせず会話できます。
      </p>

      <div style={{ fontSize: 14, marginBottom: 16 }}>
        <div>・夜時間 無制限プラン</div>
        <div>・24時間 無制限プラン</div>
      </div>

      {/* ▼ ここ */}
      <button
        style={buyButton}
        onClick={() => navigate("/purchase/subscription")}
      >
        サブスクに登録する
      </button>
    </div>
  );
}

const buyButton: React.CSSProperties = {
  marginTop: 16,
  width: "100%",
  padding: "12px 10px",
  borderRadius: 8,
  border: "none",
  background: "#4f7cff",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer",
};