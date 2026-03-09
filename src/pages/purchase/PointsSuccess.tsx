import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PointsSuccess() {

  const navigate = useNavigate();

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");

    if (p) {

      const current = Number(localStorage.getItem("points") || 0);

      const add = Number(p);

      const total = current + add;

      localStorage.setItem("points", String(total));

    }

  }, []);

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20
      }}
    >

      <h2>ポイント購入ありがとうございます</h2>

      <button
        onClick={() => navigate("/select/boy")}
        style={{
          padding: "12px 20px",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          background: "#222",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        チャットに戻る
      </button>

    </div>
  );
}