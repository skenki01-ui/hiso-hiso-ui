import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AskLaterModal from "./components/modal/Question";
import ShareBox from "../components/ShareBox";
import { ensureUser } from "../lib/user";
import { loadPoint } from "../utils/loadPoint";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [askOpen, setAskOpen] = useState(false);

  // 🔥 追加
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

    // 🔥 チェック追加
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
        <div style={{ width: "100%", maxWidth: 420, padding: 16 }}>

          <h1 style={{ margin: 0, textAlign: "center", fontSize: 28 }}>
            💬ひそひそ
          </h1>

          <p style={{ textAlign: "center", fontSize: 14 }}>
            AIキャラクターと会話を楽しめるチャットサービスです。
          </p>

          <div
            style={{
              fontSize: 12,
              marginTop: 10,
              marginBottom: 16,
              background: "#fff",
              padding: 10,
              borderRadius: 8,
              lineHeight: 1.6
            }}
          >
            ポイントについて：
            <br />
            ・1ターン＝5ポイント<br />
            ・1ポイント＝10円<br />
            ・1DAYパス＝80ポイント<br />
            ・サブスクあり（1200円 / 1900円）
          </div>

          <div style={{ fontSize: 12, marginBottom: 4 }}>
            未記入OK
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
              height: 36,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "#f5f8ff",
              marginBottom: 16,
            }}
          />

          {/* 🔥 同意チェック */}
          <div style={{ fontSize: 12, marginBottom: 10 }}>
            <label>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />{" "}
              <a href="/terms">利用規約</a> に同意する
            </label>
          </div>

          <div style={{ fontSize: 12, marginBottom: 16 }}>
            <label>
              <input
                type="checkbox"
                checked={adult}
                onChange={(e) => setAdult(e.target.checked)}
              />{" "}
              18歳以上です
            </label>
          </div>

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
              lineHeight: 1.8,
            }}
          >
            <a href="/terms">利用規約</a> ｜{" "}
            <a href="/privacy">プライバシーポリシー</a> ｜{" "}
            <a href="/tokushoho">特定商取引法</a> ｜{" "}
            <a href="/contact">お問い合わせ</a>
          </div>

        </div>
      </div>

      <AskLaterModal open={askOpen} onClose={() => setAskOpen(false)} />

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