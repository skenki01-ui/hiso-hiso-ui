// src/pages/select/BoySelect.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import "../Boys.css";

type Boy = {
  id: "teo" | "rei" | "sora";
  name: string;
  line: string;
  img: string;
};

export default function BoySelect() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const boys: Boy[] = useMemo(
    () => [
      { id: "teo", name: "テオ", line: "落ち着いて寄り添う", img: "/boys/teo_free.png" },
      { id: "rei", name: "レイ", line: "整理して導く", img: "/boys/rei_free.png" },
      { id: "sora", name: "そら", line: "明るく話しやすい", img: "/boys/sora_free.png" },
    ],
    []
  );

  return (
    <>
      <div className="page-bg">
        <div className="main-panel">
          {/* ヘッダー */}
          <div className="top-header">
            <button className="header-btn" onClick={() => navigate("/register")}>
              ◀︎
            </button>

            <div className="header-title">お相手を選ぶ</div>

            <button className="header-menu" onClick={() => setMenuOpen(true)}>
              ≡
            </button>
          </div>

          {/* セレクト */}
          <div className="panel-list">
            {boys.map((b) => (
              <button
                key={b.id}
                className="select-panel"
                onClick={() => navigate(`/chat/boy/${b.id}`)}
              >
                <img className="avatar-circle" src={b.img} alt={b.name} />
                <div className="panel-one-line">
                  <span className="panel-name">{b.name}</span>
                  <span className="panel-line">{b.line}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ page-bg の外に出す */}
      <MenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}