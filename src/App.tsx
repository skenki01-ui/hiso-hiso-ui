import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ===== 基本 ===== */
import Register from "./pages/Register";

/* ===== 説明 ===== */
import About from "./pages/about/About";
import SubscriptionAbout from "./pages/purchase/SubscriptionAbout";

/* ===== セレクト ===== */
import BoySelect from "./pages/select/BoySelect";
import GirlSelect from "./pages/select/GirlSelect";
import FreeSelect from "./pages/select/FreeSelect";

/* ===== チャット ===== */
import BoyChat from "./pages/chat/BoyChat";
import GirlChat from "./pages/chat/GirlChat";
import FreeChat from "./pages/chat/FreeChat";
import LoungeChat from "./pages/chat/LoungeChat";

/* ===== ラウンジ ===== */
import LoungeEnter from "./pages/select/LoungeEnter";

/* ===== 購入 ===== */
import PointsPurchase from "./pages/purchase/PointsPurchase";
import SubscriptionPurchase from "./pages/purchase/SubscriptionPurchase";

/* ===== 共有 ===== */
import SharePage from "./pages/share/Share";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== レジスタ ===== */}
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />

        {/* ===== 説明 ===== */}
        <Route path="/about" element={<About />} />
        <Route path="/about/subscription" element={<SubscriptionAbout />} />

        {/* ===== セレクト ===== */}
        <Route path="/select/boy" element={<BoySelect />} />
        <Route path="/select/girl" element={<GirlSelect />} />
        <Route path="/select/free" element={<FreeSelect />} />

        {/* ===== チャット ===== */}
        <Route path="/chat/boy/:id" element={<BoyChat />} />
        <Route path="/chat/girl/:id" element={<GirlChat />} />
        <Route path="/chat/free" element={<FreeChat />} />
        <Route path="/chat/lounge" element={<LoungeChat />} />

        {/* ===== ラウンジ導線 ===== */}
        <Route path="/lounge" element={<LoungeEnter />} />

        {/* ===== 購入 ===== */}
        <Route path="/purchase/points" element={<PointsPurchase />} />
        <Route
          path="/purchase/subscription"
          element={<SubscriptionPurchase />}
        />

        {/* ===== 共有 ===== */}
        <Route path="/share" element={<SharePage />} />
      </Routes>
    </BrowserRouter>
  );
}