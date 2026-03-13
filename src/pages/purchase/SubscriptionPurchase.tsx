export default function SubscriptionPurchase() {

  async function buy(priceId: string) {

    try {

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ priceId })
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }

    } catch (e) {
      alert("決済ページの作成に失敗しました");
    }

  }

}