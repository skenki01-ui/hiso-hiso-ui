import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import "./FreeSelect.css";

type Genre = {
  title: string;
  sub: string;
};

const GENRES: Genre[] = [
  { title: "恋愛", sub: "浮気／片思い／本音" },
  { title: "仕事", sub: "職場／転職／ストレス" },
  { title: "人間関係", sub: "友だち／家族／心のこと" },
  { title: "健康・体", sub: "体調／メンタル／妊娠" },
  { title: "子育て・家庭", sub: "育児／家のこと／今日のごはん" },
  { title: "言えないこと", sub: "ひとりで抱えてること" },
];

const MODES = [
  "とことん甘やかして",
  "褒めちぎって",
  "普通にせっして",
  "元気にさせて",
  "ポジティブに返して",
  "厳しくして",
];

export default function FreeSelect() {
  const navigate = useNavigate();

  const [genre, setGenre] = useState(GENRES[0].title);
  const [mode, setMode] = useState(MODES[0]);

  /* ===== メニュー ===== */
  const [menuOpen, setMenuOpen] = useState(false);

  const query = useMemo(() => {
    return `?genre=${encodeURIComponent(genre)}&mode=${encodeURIComponent(
      mode
    )}`;
  }, [genre, mode]);

  return (
    <div className="free-select-page">
      {/* ===== Header ===== */}
      <header className="free-select-header">
        <button
          className="icon-btn"
          onClick={() => navigate("/register")}
          aria-label="戻る"
        >
          ◀︎
        </button>

        <div className="free-select-title">💬 自由におしゃべり</div>

        <button
          className="icon-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="メニュー"
        >
          ≡
        </button>
      </header>

      {/* ===== ジャンル ===== */}
      <section className="free-select-section">
        <div className="section-title">ジャンル</div>
        <div className="genre-grid">
          {GENRES.map((g) => (
            <button
              key={g.title}
              className={`genre-card ${
                genre === g.title ? "active" : ""
              }`}
              onClick={() => setGenre(g.title)}
            >
              <div className="genre-title">{g.title}</div>
              <div className="genre-sub">{g.sub}</div>
            </button>
          ))}
        </div>
      </section>

      {/* ===== モード ===== */}
      <section className="free-select-section">
        <div className="section-title">モード</div>
        <div className="mode-grid">
          {MODES.map((m) => (
            <button
              key={m}
              className={`mode-btn ${mode === m ? "active" : ""}`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      {/* ===== Start ===== */}
      <footer className="free-select-footer">
        <button
          className="start-btn"
          onClick={() => navigate(`/chat/free${query}`)}
        >
          これで始める
        </button>
      </footer>

      {/* ===== 共通メニュー ===== */}
      <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}