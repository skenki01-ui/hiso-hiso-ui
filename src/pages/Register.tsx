import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AskLaterModal from "./components/modal/Question";
import ShareBox from "../components/ShareBox";
import { ensureUser } from "../lib/user";
import { loadPoint } from "../utils/loadPoint";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [askOpen, setAskOpen] = useState(false);

  const [agree, setAgree] = useState(false);
  const [adult, setAdult] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nickname");

    if (saved) {
      setName(saved);
    }

    initUserSafe();
  }, []);

  async function initUserSafe() {
    try {
      const nickname = (localStorage.getItem("nickname") || "").trim();

      const userId = await ensureUser(nickname);

      if (userId) {
        localStorage.setItem("user_id", userId);
      }

      await loadPoint();
    } catch (e) {
      console.error("initUser error:", e);
    }
  }

  async function go(path: string) {
    if (!agree) {
      alert("利用規約に同意してください");
      return;
    }

    if (!adult) {
      alert("18歳以上であることを確認してください");
      return;
    }

    const nickname = name.trim();

    if (nickname) {
      localStorage.setItem("nickname", nickname);
    }

    try {
      const userId = await ensureUser(nickname);

      if (userId) {
        localStorage.setItem("user_id", userId);
      }
    } catch (e) {
      console.error("go error:", e);
    }

    navigate(path);
  }

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
              fontWeight: 800,
            }}
          >
            💬ひそひそ
          </h1>

          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              lineHeight: 1.7,
              marginTop: 12,
              marginBottom: 16,
            }}
          >
            AIキャラクターと会話しながら、
            <br />
            気持ちや考えを少し整理できる
            <br />
            チャットサービスです。
          </p>

          <div
            style={{
              fontSize: 12,
              marginBottom: 18,
              background: "#ffffff",
              padding: 14,
              borderRadius: 14,
              lineHeight: 1.8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              color: "#334155",
            }}
          >
            本サービスはAIによる会話表示サービスです。
            <br />
            医療行為・診断・効果保証を行うものではありません。
            <br />
            有料機能ではアプリ内ポイントを使用します。
          </div>

          <div
            style={{
              fontSize: 12,
              marginBottom: 6,
              color: "#666",
            }}
          >
            ニックネーム（未入力OK）
          </div>

          <input
            placeholder="なんて呼んだらいい？"
            value={name}
            onChange={(e) => {
              setName(e.target.value);

              localStorage.setItem("nickname", e.target.value);
            }}
            style={{
              width: "100%",
              height: 48,
              padding: "0 14px",
              borderRadius: 12,
              border: "1px solid #d7deea",
              background: "#ffffff",
              fontSize: 16,
              outline: "none",
              marginBottom: 18,
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              fontSize: 13,
              marginBottom: 12,
              lineHeight: 1.6,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />

              <span>
                <Link to="/terms">利用規約</Link> に同意する
              </span>
            </label>
          </div>

          <div
            style={{
              fontSize: 13,
              marginBottom: 22,
              lineHeight: 1.6,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={adult}
                onChange={(e) => setAdult(e.target.checked)}
              />

              <span>
                18歳以上です
              </span>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <button style={panelStyle} onClick={() => go("/select/free")}>
              自由におしゃべり
            </button>

            <button style={panelStyle} onClick={() => go("/select/boy")}>
              男性キャラクターと話す
            </button>

            <button style={panelStyle} onClick={() => go("/select/girl")}>
              女性キャラクターと話す
            </button>

            <button style={panelStyle} onClick={() => go("/lounge")}>
              ラウンジを見る
            </button>

            <button style={panelStyle} onClick={() => setAskOpen(true)}>
              そのうち教えて
            </button>
          </div>

          <ShareBox />

          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              fontSize: 12,
              color: "#666",
              lineHeight: 2,
            }}
          >
            <Link to="/terms">利用規約</Link>
            {" ｜ "}
            <Link to="/privacy">プライバシーポリシー</Link>
            {" ｜ "}
            <Link to="/tokushoho">特定商取引法</Link>
            {" ｜ "}
            <Link to="/contact">お問い合わせ</Link>
          </div>
        </div>
      </div>

      <AskLaterModal open={askOpen} onClose={() => setAskOpen(false)} />
    </>
  );
}

const panelStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 18,
  padding: 18,
  textAlign: "center",
  fontSize: 18,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  color: "#1d4ed8",
  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
};