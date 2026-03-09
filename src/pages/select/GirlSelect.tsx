import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import { buildCommonMenuItems } from "../components/menu/commonMenu";
import "./Select.css";

type GirlId = "mio" | "akina" | "niko";

type Girl = {
  id: GirlId;
  name: string;
  line: string;
  imgFree: string;
};

export default function GirlSelect() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = useMemo(
    () => buildCommonMenuItems(navigate, () => setMenuOpen(false)),
    [navigate]
  );

  const girls: Girl[] = [
    { id: "mio", name: "みお", line: "静かに寄り添うタイプ", imgFree: "/girls/mio_free.png" },
    { id: "akina", name: "あきな", line: "はっきり優しいお姉さん", imgFree: "/girls/akina_free.png" },
    { id: "niko", name: "にこ", line: "明るくノリがいい", imgFree: "/girls/niko_free.png" },
  ];

  return (
    <div className="girls-page">
      <div className="girls-header">
        <button className="boys-back" onClick={() => navigate("/register")}>
          ◀︎
        </button>
        <div className="girls-title">女の子を選ぶ</div>
        <button className="boys-menu" onClick={() => setMenuOpen(true)}>
          ≡
        </button>
      </div>

      <div className="girls-list">
        {girls.map((g) => (
          <button
            key={g.id}
            className="girl-card"
            onClick={() => navigate(`/chat/girl/${g.id}`)}
          >
            <img className="girl-avatar" src={g.imgFree} alt={g.name} />
            <div>
              <div className="girl-name">{g.name}</div>
              <div className="girl-line">{g.line}</div>
            </div>
          </button>
        ))}
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