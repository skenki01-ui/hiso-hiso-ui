import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SubSuccess() {

  const navigate = useNavigate();

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (type === "midnight") {
      localStorage.setItem("sub_midnight", "true");
    }

    if (type === "full") {
      localStorage.setItem("sub_full", "true");
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

      <h2>サブスク購入ありがとうございます</h2>

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