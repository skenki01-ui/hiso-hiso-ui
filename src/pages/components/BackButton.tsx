import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        marginBottom: 16,
        padding: "8px 12px",
        fontSize: 14,
      }}
    >
      ← 戻る
    </button>
  );
}