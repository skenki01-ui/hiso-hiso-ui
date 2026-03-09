import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import { buildCommonMenuItems } from "../components/menu/commonMenu";
import "./Select.css";

type BoyId = "teo" | "rei" | "sora";

type Boy = {
  id: BoyId;
  name: string;
  line: string;
  imgFree: string;
};

export default function BoySelect() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = useMemo(
    () => buildCommonMenuItems(navigate, () => setMenuOpen(false)),
    [navigate]
  );

  const boys: Boy[] = [
    { id: "teo", name: "テオ", line: "落ち着いた聞き上手", imgFree: "/boys/teo_free.png" },
    { id: "rei", name: "レイ", line: "クールで頼れる", imgFree: "/boys/rei_free.png" },
    { id: "sora", name: "そら", line: "静かに寄り添う", imgFree: "/boys/sora_free.png" },
  ];

  return (
    <div className="boys-page">
      <div className="boys-header">
        <button className="boys-back" onClick={() => navigate("/register")}>
          ◀︎
        </button>
        <div className="boys-title">男の子を選ぶ</div>
        <button className="boys-menu" onClick={() => setMenuOpen(true)}>
          ≡
        </button>
      </div>

      <div className="boys-list">
        {boys.map((b) => (
          <button
            key={b.id}
            className="boy-card"
            onClick={() => navigate(`/chat/boy/${b.id}`)}
          >
            <img className="boy-avatar" src={b.imgFree} alt={b.name} />
            <div>
              <div className="boy-name">{b.name}</div>
              <div className="boy-line">{b.line}</div>
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