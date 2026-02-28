import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16 }}>
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

      <div style={{ marginTop: 24 }}>
        <button onClick={() => navigate("/purchase/points")}>
          ポイント購入
        </button>

        <br />

        <button
          style={{ marginTop: 8 }}
          onClick={() => navigate("/purchase/subscription")}
        >
          サブスク購入
        </button>
      </div>
    </div>
  );
}