import { useNavigate } from "react-router-dom";
import "./MenuModal.css";

type MenuItem = {
  label: string;
  path: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MenuModal({ open, onClose }: Props) {
  const navigate = useNavigate();

  if (!open) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const items: MenuItem[] = [
    // ✅ 説明（ここが間違ってた）
    { label: "説明", path: "/about" },

    // ✅ ポイント
    { label: "ポイントについて", path: "/about/points" },
    { label: "ポイント購入", path: "/purchase/points" },

    // ✅ サブスク
    { label: "サブスクについて", path: "/about/subscription" },
    { label: "サブスク購入", path: "/purchase/subscription" },

    // ✅ 共有
    { label: "友だちに教える", path: "/share" },
  ];

  return (
    <div className="menu-overlay" onClick={onClose}>
      <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
        {items.map((item) => (
          <button
            key={item.label}
            className="menu-item"
            onClick={() => go(item.path)}
          >
            {item.label}
          </button>
        ))}

        <button className="menu-close" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}