import { useNavigate } from "react-router-dom";

export default function SubSuccess() {

  const navigate = useNavigate();

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#eaf3ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          borderRadius: 16,
          padding: 28,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}
      >

        <div
          style={{
            fontSize: 48,
            marginBottom: 10
          }}
        >
          🌙
        </div>

        <h2
          style={{
            marginTop: 0,
            marginBottom: 14
          }}
        >
          ご登録ありがとうございます
        </h2>

        <p
          style={{
            lineHeight: 1.8,
            fontSize: 14,
            color: "#555",
            marginBottom: 24
          }}
        >
          サブスクリプションの登録が完了しました。
          <br />
          これからも、ひそひそで
          ゆっくりお話しできます。
        </p>

        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 10,
            border: "none",
            background: "#4da3ff",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer"
          }}
        >
          ひそひそへ戻る
        </button>

      </div>

    </div>
  );
}