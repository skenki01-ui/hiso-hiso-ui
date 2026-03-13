import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import "./Purchase.css";

const stripePromise = loadStripe("pk_live_51SqO64C778tZKUAv2iDnpc95ZJLLe8wX6Q6fqKrnrZyzJx62hhjSlOYfDCYfgRaQpaHncnfDUweQ9n1GeF0cVmdR004sK2Ulju");

export default function SubscriptionPurchase() {
  const navigate = useNavigate();

  async function buy(priceId: string) {
    try {
      const stripe = await stripePromise;

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      await stripe?.redirectToCheckout({
        sessionId: data.id,
      });
    } catch (e) {
      alert("決済ページの作成に失敗しました");
    }
  }

  return (
    <div className="purchase-page">
      <div className="purchase-title">サブスク</div>

      <div className="purchase-list">
        <button
          className="purchase-btn"
          onClick={() => buy(import.meta.env.VITE_STRIPE_SUB_MIDNIGHT)}
        >
          ミッドナイト無制限
          <br />
          1200円 / 月
        </button>

        <button
          className="purchase-btn"
          onClick={() => buy(import.meta.env.VITE_STRIPE_SUB_24H)}
        >
          24時間無制限
          <br />
          1900円 / 月
        </button>
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        戻る
      </button>
    </div>
  );
}