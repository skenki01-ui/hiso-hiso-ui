import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

import PointsPurchase from "./pages/purchase/PointsPurchase";
import SubscriptionPurchase from "./pages/purchase/SubscriptionPurchase";
import SubSuccess from "./pages/purchase/SubSuccess";
import PointsSuccess from "./pages/purchase/PointsSuccess";

import About from "./pages/about/About";
import PointsAbout from "./pages/about/PointsAbout";

import Share from "./pages/share/Share";
import Question from "./pages/components/modal/Question";

export default function App() {
  return (
    <BrowserRouter>

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
        <Route path="/purchase/points" element={<PointsPurchase />} />
        <Route path="/purchase/subscription" element={<SubscriptionPurchase />} />

        {/* Stripe成功 */}
        <Route path="/purchase/sub-success" element={<SubSuccess />} />
        <Route path="/purchase/points-success" element={<PointsSuccess />} />

        {/* 説明 */}
        <Route path="/about" element={<About />} />
        <Route path="/about/points" element={<PointsAbout />} />

        {/* その他 */}
        <Route path="/share" element={<Share />} />
        <Route path="/question" element={<Question />} />

        {/* 不正URL */}
        <Route path="*" element={<Navigate to="/register" replace />} />

      </Routes>
    </BrowserRouter>
  );
}