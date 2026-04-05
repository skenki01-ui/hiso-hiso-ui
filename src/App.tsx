import {  Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import InstallGuide from "./components/InstallGuide";

import Register from "./pages/Register";

import BoySelect from "./pages/select/BoySelect";
import GirlSelect from "./pages/select/GirlSelect";
import FreeSelect from "./pages/select/FreeSelect";
import LoungeEnter from "./pages/select/LoungeEnter";

import BoyChat from "./pages/chat/BoyChat";
import GirlChat from "./pages/chat/GirlChat";
import FreeChat from "./pages/chat/FreeChat";
import LoungeChat from "./pages/chat/LoungeChat";

import SubscriptionPurchase from "./pages/purchase/SubscriptionPurchase";
import SubSuccess from "./pages/purchase/SubSuccess";

import About from "./pages/about/About";
import PointAbout from "./pages/about/PointsAbout";
import PointBalance from "./pages/about/PointsBalance";

import Share from "./pages/share/Share";

/* 法律ページ */
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Tokushoho from "./pages/legal/Tokushoho";
import Contact from "./pages/legal/Contact";

/* 🔥 追加 */
import Pay from "./pages/Pay";

export default function App() {
  return (
    <>

      <InstallGuide />

      <Routes>

        {/* 初期 */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* 登録 */}
        <Route path="/register" element={<Register />} />

        {/* セレクト */}
        <Route path="/select/boy" element={<BoySelect />} />
        <Route path="/select/girl" element={<GirlSelect />} />
        <Route path="/select/free" element={<FreeSelect />} />

        {/* ラウンジ */}
        <Route path="/lounge" element={<LoungeEnter />} />
        <Route path="/lounge/chat" element={<LoungeChat />} />

        {/* チャット */}
        <Route path="/chat/boy/:id" element={<BoyChat />} />
        <Route path="/chat/girl/:id" element={<GirlChat />} />
        <Route path="/chat/free" element={<FreeChat />} />

        {/* 課金 */}
        <Route path="/purchase/subscription" element={<SubscriptionPurchase />} />
        <Route path="/pay" element={<Pay />} />

        {/* 成功 */}
        <Route path="/purchase/sub-success" element={<SubSuccess />} />

        {/* 説明 */}
        <Route path="/about" element={<About />} />
        <Route path="/about/point" element={<PointAbout />} />
        <Route path="/about/balance" element={<PointBalance />} />

        {/* 法律ページ */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tokushoho" element={<Tokushoho />} />
        <Route path="/contact" element={<Contact />} />

        {/* シェア */}
        <Route path="/share" element={<Share />} />

        {/* 不正URL */}
        <Route path="*" element={<Navigate to="/register" replace />} />

      </Routes>
</>
    
  );
}