import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_live_51SqO64C778tZKUAv2iDnpc95ZJLLe8wX6Q6fqKrnrZyzJx62hhjSlOYfDCYfgRaQpaHncnfDUweQ9n1GeF0cVmdR004sK2Ulju"
);

export default function PointsAbout() {
  const buy = async (priceId: string) => {
    try {
      await stripePromise;

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(JSON.stringify(data));
        return;
      }

      if (!data.url) {
        alert("決済URLが作成できませんでした");
        return;
      }

      window.location.href = data.url;
    } catch (e: any) {
      alert(JSON.stringify(e));
    }
  };

  return (
    <div className="points-card">
      <h2>ポイントについて</h2>

      <p>1ターン = 5p</p>
      <p>キャラクターと1回会話できます</p>
      <p>1DAYパス = 80p</p>
      <p>24時間ターン無制限</p>

      <h3>ポイント購入</h3>

      <button onClick={() => buy("price_1T9tibC778tZKUAvqldVGh8m")}>
        100円 → 10p
      </button>
      <button onClick={() => buy("price_1T9tkMC778tZKUAv5eCB0JdW")}>
        300円 → 30p
      </button>
      <button onClick={() => buy("price_1T9tkjC778tZKUAvOPXawcq7")}>
        500円 → 50p
      </button>
      <button onClick={() => buy("price_1T9tleC778tZKUAvAUYGAwN60")}>
        1000円 → 105p
      </button>
      <button onClick={() => buy("price_1T9tnnC778tZKUAvdVmBlKgu")}>
        3000円 → 320p
      </button>
      <button onClick={() => buy("price_1T9toTC778tZKUAvh4LzRn1i")}>
        5000円 → 550p
      </button>
      <button onClick={() => buy("price_1T9tosC778tZKUAvfUNHcR7q")}>
        10000円 → 1200p
      </button>
    </div>
  );
}