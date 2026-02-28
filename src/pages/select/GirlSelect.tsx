// src/pages/select/GirlSelect.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import "../Girls.css";

type Girl = {
  id: "mio" | "akina" | "niko";
  name: string;
  line: string;
  img: string;
};

export default function GirlSelect() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ 画像は常に free を使う（サブスクでも同じ）
  const girls: Girl[] = useMemo(
    () => [
      { id: "mio", name: "みお", line: "静かに寄り添うタイプ", img: "/girls/mio_free.png" },
      { id: "akina", name: "あきな", line: "はっきり優しいお姉さん", img: "/girls/akina_free.png" },
      { id: "niko", name: "にこ", line: "明るくて話しやすい", img: "/girls/niko_free.png" },
    ],
    []
  );

  const menuItems = useMemo(
    () => [{ label: "登録に戻る", onClick: () => navigate("/register") }],
    [navigate]
  );

  const onPick = (girlId: Girl["id"]) => {
    navigate(`/chat/girl/${girlId}`);
  };

  return (
    <div className="page-bg">
      <div className="main-panel">
        {/* ヘッダー */}
        <div className="top-header">
          <button className="header-btn" onClick={() => navigate("/register")}>
            ◀︎
          </button>

          <div className="header-title">お相手を選ぶ</div>

          <button className="header-menu" onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        </div>

        {/* セレクトパネル */}
        <div className="panel-list">
          {girls.map((g) => (
            <button
              key={g.id}
              className="select-panel"
              onClick={() => onPick(g.id)}
            >
              <img className="avatar-circle" src={g.img} alt={g.name} />
              <div className="panel-one-line">
                <span className="panel-name">{g.name}</span>
                <span className="panel-line">{g.line}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <MenuModal
        open={menuOpen}
        title="メニュー"
        items={menuItems}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
}