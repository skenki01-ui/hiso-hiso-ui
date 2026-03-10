//import { createCheckout } from "../api/createCheckout.tsdisabled";
import { useNavigate } from "react-router-dom";

export default function PointsAbout() {

  const navigate = useNavigate();

  const buy = async (priceId: string, point: number) => {

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("ユーザーIDがありません");
      return;
    }

   // const url = await createCheckout(priceId, userId, point);

    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"#eaf3ff",
      display:"flex",
      justifyContent:"center",
      paddingTop:30
    }}>

      <div style={{
        width:"100%",
        maxWidth:420,
        background:"#fff",
        borderRadius:12,
        padding:20
      }}>

        <button
          onClick={() => navigate("/register")}
          style={{
            border:"none",
            background:"none",
            fontSize:20,
            cursor:"pointer"
          }}
        >
          ←
        </button>

        <h2 style={{marginTop:10}}>ポイントについて</h2>

        <p>1ターン = 5p</p>
        <p>キャラクターと1回会話できます</p>

        <p>1DAYパス = 80p</p>
        <p>24時間ターン無制限</p>

        <h3>ポイント購入</h3>

        <div style={{
          display:"flex",
          flexDirection:"column",
          gap:10
        }}>

          <button onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_100,10)}>100円 → 10p</button>
          <button onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_300,30)}>300円 → 30p</button>
          <button onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_500,50)}>500円 → 50p</button>
          <button onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_1000,105)}>1000円 → 105p</button>
          <button onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_3000,320)}>3000円 → 320p</button>
          <button onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_5000,550)}>5000円 → 550p</button>
          <button onClick={() => buy(import.meta.env.VITE_STRIPE_PRICE_10000,1200)}>10000円 → 1200p</button>

        </div>

      </div>

    </div>
  );
}