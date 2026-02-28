import { useNavigate } from "react-router-dom";

export default function SubscriptionAbout() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>← 戻る</button>

      <h1>サブスクについて</h1>

      <p>
        サブスクに加入すると、<br />
        チャットのターン制限が解除されます。
      </p>

      <p>
        🌙 ミッドナイト無制限：1200円　（20:00〜5:00）<br />
        ⏰ 24時間無制限：1900円　いつでも
      </p>

      <p>
        ※ ラウンジはサブスク対象外です。<br />
        ラウンジは「ポイントのみ」で利用します。
      </p>

      <hr />

      <button onClick={() => navigate("/purchase/subscription")}>
        サブスクを購入する
      </button>
    </div>
  );
}