import { useNavigate } from "react-router-dom";
import "./Purchase.css";

export default function PointsPurchase() {
  const navigate = useNavigate();

  const buy = (yen: number, point: number) => {
    alert(`${yen}円で ${point}p を購入しました`);
    navigate(-1);
  };

  return (
    <div className="purchase-page">
      <div className="purchase-title">ポイント購入</div>

      <div className="purchase-desc">
        1ターン = 5p<br />
        1DAYパス = 80p（24時間）
      </div>

      <div className="purchase-list">
        <button className="purchase-btn" onClick={() => buy(100, 10)}>100円 / 10p</button>
        <button className="purchase-btn" onClick={() => buy(300, 30)}>300円 / 30p</button>
        <button className="purchase-btn" onClick={() => buy(500, 50)}>500円 / 50p</button>
        <button className="purchase-btn" onClick={() => buy(1000, 105)}>1000円 / 105p</button>
        <button className="purchase-btn" onClick={() => buy(3000, 320)}>3000円 / 320p</button>
        <button className="purchase-btn" onClick={() => buy(5000, 550)}>5000円 / 550p</button>
        <button className="purchase-btn" onClick={() => buy(10000, 1200)}>10000円 / 1200p</button>
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        戻る
      </button>
    </div>
  );
}