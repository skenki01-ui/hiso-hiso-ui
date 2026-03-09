import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./Purchase.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PointsPurchase() {

  const navigate = useNavigate();

  const buy = async (priceId: string) => {

    const stripe = await stripePromise;

    const res = await fetch("/api/stripe/createCheckout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId })
    });

    const data = await res.json();

    await stripe?.redirectToCheckout({
      sessionId: data.id
    });

  };

  return (
    <div className="purchase-page">

      <div className="purchase-title">ポイント購入</div>

      <div className="purchase-desc">
        1ターン = 5p<br />
        1DAYパス = 80p（24時間）
      </div>

      <div className="purchase-list">

        <button className="purchase-btn" onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_100)}>
          100円 / 10p
        </button>

        <button className="purchase-btn" onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_300)}>
          300円 / 30p
        </button>

        <button className="purchase-btn" onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_500)}>
          500円 / 50p
        </button>

        <button className="purchase-btn" onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_1000)}>
          1000円 / 105p
        </button>

        <button className="purchase-btn" onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_3000)}>
          3000円 / 320p
        </button>

        <button className="purchase-btn" onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_5000)}>
          5000円 / 550p
        </button>

        <button className="purchase-btn" onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_10000)}>
          10000円 / 1200p
        </button>

      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        戻る
      </button>

    </div>
  );
}