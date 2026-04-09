import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

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

//* 法律ページ *//
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Tokushoho from "./pages/legal/Tokushoho";
import Contact from "./pages/legal/Contact";

import Pay from "./pages/Pay";

export default function App() {
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />

        <Route path="/register" element={<Register />} />

        <Route path="/select/boy" element={<BoySelect />} />
        <Route path="/select/girl" element={<GirlSelect />} />
        <Route path="/select/free" element={<FreeSelect />} />

        <Route path="/lounge" element={<LoungeEnter />} />
        <Route path="/lounge/chat" element={<LoungeChat />} />

        <Route path="/chat/boy/:id" element={<BoyChat />} />
        <Route path="/chat/girl/:id" element={<GirlChat />} />
        <Route path="/chat/free" element={<FreeChat />} />

        <Route path="/purchase/subscription" element={<SubscriptionPurchase />} />
        <Route path="/pay" element={<Pay />} />

        <Route path="/purchase/sub-success" element={<SubSuccess />} />

        <Route path="/about" element={<About />} />
        <Route path="/about/point" element={<PointAbout />} />
        <Route path="/about/balance" element={<PointBalance />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tokushoho" element={<Tokushoho />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/share" element={<Share />} />

        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}