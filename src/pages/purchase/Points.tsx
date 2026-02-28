// src/pages/purchase/Points.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Pack = {
  label: string;
  price: number;
  point: number;
};

const PACKS: Pack[] = [
  { label: "100円 = 10p", price: 100, point: 10 },
  { label: "300円 = 30p", price: 300, point: 30 },
  { label: "500円 = 50p", price: 500, point: 50 },
  { label: "1000円 = 105p", price: 1000, point: 105 },
  { label: "3000円 = 320p", price: 3000, point: 320 },
  { label: "5000円 = 550p", price: 5000, point: 550 },
  { label: "10000円 = 1200p", price: 10000, point: 1200 },
];

export default function PointsPurchase() {
  const nav = useNavigate();
  const [point, setPoint] = useState(0);

  // 初期ポイント取得（なければ仮1000p）
  useEffect(() => {
    const p = localStorage.getItem("point");
    if (p === null) {
      localStorage.setItem("point", "1000");
      setPoint(1000);
    } else {
      setPoint(Number(p));
    }
  }, []);

  const buy = (add: number) => {
    const next = point + add;
    localStorage.setItem("point", String(next));
    setPoint(next);
    alert(`ポイントを購入しました（+${add}p）`);
  };

  return (
    <div style={{ padding: 16 }}>
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <button onClick={() => nav(-1)}>◀︎</button>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 700 }}>
          ポイント購入
        </div>
        <div style={{ width: 24 }} />
      </div>

      {/* 所持ポイント */}
      <div style={{ marginBottom: 16 }}>
        現在のポイント：<b>{point}p</b>
      </div>

      {/* ポイント仕様 */}
      <div style={{ fontSize: 14, marginBottom: 12 }}>
        <div>・1ターン = 5p</div>
        <div>・1DAYパス = 80p（24時間無制限）</div>
      </div>

      {/* 購入ボタン */}
      <div style={{ display: "grid", gap: 10 }}>
        {PACKS.map((p) => (
          <button
            key={p.price}
            onClick={() => buy(p.point)}
            style={{
              padding: "12px 10px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}