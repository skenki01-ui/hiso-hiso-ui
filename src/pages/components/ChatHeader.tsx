import { useNavigate } from "react-router-dom";

type Props = {
  turns?: string;
  point?: number;
  onMenu?: () => void;
};

export default function ChatHeader({
  turns,
  point,
  onMenu
}: Props) {

  const navigate = useNavigate();

  return (
    <div
      style={{
        height: 48,
        background: "#3B58FF",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px"
      }}
    >

      {/* 戻る */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 18
        }}
      >
        ◀
      </button>

      {/* 名前入力 */}
      <input
        placeholder="名前つけて"
        style={{
          border: "none",
          textAlign: "center",
          fontSize: 16,
          outline: "none",
          background: "transparent",
          color: "#fff",
          width: 140
        }}
      />

      {/* 右側 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10
        }}
      >

        <span style={{ fontSize: 12 }}>
          {turns}
        </span>

        <span style={{ fontSize: 12 }}>
          {point}p
        </span>

        <button
          onClick={onMenu}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 18
          }}
        >
          ☰
        </button>

      </div>

    </div>
  );
}