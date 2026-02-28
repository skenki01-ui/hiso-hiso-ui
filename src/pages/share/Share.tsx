import { useNavigate } from "react-router-dom";

export default function Share() {
  const navigate = useNavigate();
  const url = window.location.origin;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>← 戻る</button>

      <h2>友だちに教える</h2>

      <button
        onClick={() =>
          window.open(`https://line.me/R/msg/text/?${encodeURIComponent(url)}`)
        }
      >
        LINEで共有
      </button>

      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          alert("URLをコピーしました");
        }}
      >
        URLコピー
      </button>

      <div style={{ marginTop: 12 }}>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
            url
          )}`}
          alt="QR"
        />
      </div>
    </div>
  );
}