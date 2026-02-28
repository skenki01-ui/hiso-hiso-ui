import { useState } from "react";
import MenuModal from "../components/MenuModal";
import { useNavigate } from "react-router-dom";

type Props = { title: string };

export default function ChatHeader({ title }: Props) {
 const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={styles.header}>
      <button style={styles.back} onClick={() => navigate(-1)}>◀︎</button>
      <div style={styles.title}>{title}</div>
      <div style={styles.menu}>≡</div>
    </div>
  );
}

const styles = {
  header: {
    height: 48,
    background: "#5B5BFF",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
  },
  back: { marginRight: 8 },
  title: { flex: 1, textAlign: "center", fontWeight: 700 },
  menu: { width: 24, textAlign: "right" },
};