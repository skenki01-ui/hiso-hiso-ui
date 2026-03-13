export default function SubscriptionPurchase() {

  async function buy(priceId: string) {

    try {

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
        alert("決済URL取得失敗");
        return;
      }

      // Stripe決済ページへ移動
      window.location.href = data.url;

    } catch (e) {
      alert("決済ページの作成に失敗しました");
    }

  }

  return (
    <div>

      <h2>サブスク購入</h2>

      <button onClick={() => buy("price_XXXX")}>
        月額1200円（夜 unlimited）
      </button>

      <button onClick={() => buy("price_YYYY")}>
        月額1900円（24h unlimited）
      </button>

    </div>
  );
}