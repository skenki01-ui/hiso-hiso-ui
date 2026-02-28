import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AskLaterModal from "./components/modal/Question";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [askOpen, setAskOpen] = useState(false);

  // ▼ 初回のみ仮ポイント付与
  useEffect(() => {
    const p = localStorage.getItem("point");
    if (p === null) {
      localStorage.setItem("point", "1000"); // 仮ポイント
    }
  }, []);

  const go = (path: string) => {
    if (name.trim()) {
      localStorage.setItem("nickname", name.trim());
    }
    navigate(path);
  };

  return (
    <>
      <div
        style={{
          minHeight: "100svh",
          background: "#eaf3ff",
          display: "flex",
          justifyContent: "center",
          paddingTop: 40,
          paddingBottom: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 16,
          }}
        >
          <h1
            style={{
              margin: 0,
              textAlign: "center",
              fontSize: 28,
              lineHeight: 1.2,
            }}
          >
            💬ひそひそ
          </h1>

          <p
            style={{
              margin: "4px 0 12px",
              textAlign: "center",
              fontSize: 14,
              opacity: 0.8,
            }}
          >
            夜のひととき雑談アプリ
          </p>

          <div style={{ fontSize: 12, marginBottom: 4 }}>未記入OK</div>

          <input
            placeholder="なんて呼んだらいい？"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              boxSizing: "border-box",
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "#f5f8ff",
              marginBottom: 16,
            }}
          />

          {/* メイン導線 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button style={panelStyle} onClick={() => go("/select/free")}>
              自由におしゃべり
            </button>

            <button style={panelStyle} onClick={() => go("/select/boy")}>
              男の子としゃべる
            </button>

            <button style={panelStyle} onClick={() => go("/select/girl")}>
              女の子としゃべる
            </button>

            <button style={panelStyle} onClick={() => go("/lounge")}>
              🌙ミッドナイトラウンジへ
            </button>

            {/* クエスチョン（遷移しない） */}
            <button
              style={panelStyle}
              onClick={() => setAskOpen(true)}
            >
              そのうち教えて
            </button>
          </div>
        </div>
      </div>

      {/* 任意アンケートモーダル */}
      <AskLaterModal
        open={askOpen}
        onClose={() => setAskOpen(false)}
      />
    </>
  );
}

const panelStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 10,
  padding: 14,
  textAlign: "center",
  fontSize: 16,
  border: "none",
  cursor: "pointer",
};