import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function About() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#eaf3ff",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <BackButton />

      <h1>ひそひそについて</h1>

      <p>
        ひそひそは、
        <br />
        話すことを目的にした静かな会話アプリです。
      </p>

      <p>
        ひとりの時も、1人じゃない。
        <br />
        あなたの味方、理解者として、
        <br />
        どんなことでも話してください。
      </p>

      <p>
        無料でも楽しめますが、
        <br />
        物足りないと感じたら有料機能が使えます。
      </p>

      <p>
        登録すると、
        <br />
        次に話しかけたとき、少しだけ前の会話を覚えています。
        <br />
        <br />
        登録しなくても遊べますが、
        <br />
        登録するとポイントが付与されるので、
        <br />
        ポイントを使った楽しみ方も試せます。
      </p>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={() => navigate("/register")}>
          登録する
        </button>

        <button onClick={() => navigate("/purchase/points")}>
          ポイント購入
        </button>

        <button onClick={() => navigate("/purchase/subscription")}>
          サブスク購入
        </button>
      </div>
    </div>
  );
}