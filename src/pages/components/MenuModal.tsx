import { useNavigate } from "react-router-dom";

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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999
      }}
      onClick={onClose}
    >

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          width: 260,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >

        <button onClick={() => go("/about")}>
          説明
        </button>

        <button onClick={() => go("/about/points")}>
          ポイントについて
        </button>

        <button onClick={() => go("/purchase/subscription")}>
          サブスクについて
        </button>

        <button onClick={() => go("/share")}>
          友だちに教える
        </button>

        <button onClick={onClose}>
          閉じる
        </button>

      </div>
    </div>
  );
}