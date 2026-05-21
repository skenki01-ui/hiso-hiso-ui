import { useNavigate } from "react-router-dom";

export default function SubscriptionPurchase() {

  const navigate = useNavigate();

  function openStripe(url: string) {
    window.location.href = url;
  }

  return (

    <div
      style={{
        padding: 20,
        background: "#eaf3ff",
        minHeight: "100vh"
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10
        }}
      >
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

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          maxWidth: 500,
          margin: "0 auto",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}
      >

        <button
          style={btn}
          onClick={() =>
            openStripe(
              "https://buy.stripe.com/00wbJ14Nh0Lf7j07iYgEg01"
            )
          }
        >
          夜プラン（20:00-5:00）1200円/月
        </button>

        <button
          style={btn}
          onClick={() =>
            openStripe(
              "https://buy.stripe.com/bJebJ1a7B9hLbzggTygEg00"
            )
          }
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