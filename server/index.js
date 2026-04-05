require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const Payjp = require("payjp");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const payjp = Payjp(process.env.PAYJP_SECRET_KEY);

/* ===============================
   Pay.jp単発決済（ポイント）
================================= */
app.post("/payjp", async (req, res) => {
  try {
    const { amount, token } = req.body;

    if (!amount || !token) {
      return res.json({ success: false });
    }

    const charge = await payjp.charges.create({
      amount,
      currency: "jpy",
      card: token
    });

    return res.json({
      success: true,
      charge
    });

  } catch (e) {
    console.log(e);
    return res.json({ success: false });
  }
});

/* ===============================
   サブスク登録（🔥ここが今回の本命）
================================= */
app.post("/subscription", async (req, res) => {
  try {

    const { token, planId, user_id } = req.body;

    if (!token || !planId || !user_id) {
      return res.json({ success: false });
    }

    // 👤 顧客作成
    const customer = await payjp.customers.create({
      card: token
    });

    // 🔁 サブスク作成
    const sub = await payjp.subscriptions.create({
      customer: customer.id,
      plan: planId
    });

    // 💾 Supabaseに保存
    await supabase
      .from("users")
      .update({
        subscription_type:
          planId === "pln_24c2483b10511126e64280ae40b0"
            ? "full"
            : "night"
      })
      .eq("id", user_id);

    return res.json({
      success: true,
      sub
    });

  } catch (e) {
    console.log("🔥 sub error:", e);
    return res.json({ success: false });
  }
});

/* ===============================
   ポイント追加
================================= */
app.post("/pay", async (req, res) => {
  try {

    const { user_id, amount } = req.body;

    if (!user_id || !amount) {
      return res.json({ success: false });
    }

    const { data: user } = await supabase
      .from("users")
      .select("point")
      .eq("id", user_id)
      .single();

    if (!user) {
      const { data } = await supabase
        .from("users")
        .insert({
          id: user_id,
          point: amount
        })
        .select()
        .single();

      return res.json({
        success: true,
        point: data.point
      });
    }

    const nextPoint = (user.point || 0) + amount;

    const { data } = await supabase
      .from("users")
      .update({ point: nextPoint })
      .eq("id", user_id)
      .select()
      .single();

    return res.json({
      success: true,
      point: data.point
    });

  } catch (e) {
    console.log(e);
    return res.json({ success: false });
  }
});

/* ===============================
   ポイント消費
================================= */
app.post("/use-point", async (req, res) => {
  try {

    const { user_id, amount } = req.body;

    if (!user_id || !amount) {
      return res.json({ success: false });
    }

    const { data: user } = await supabase
      .from("users")
      .select("point")
      .eq("id", user_id)
      .single();

    if (!user) {
      return res.json({ success: false });
    }

    const current = user.point || 0;

    if (current < amount) {
      return res.json({ success: false });
    }

    const nextPoint = current - amount;

    const { data } = await supabase
      .from("users")
      .update({ point: nextPoint })
      .eq("id", user_id)
      .select()
      .single();

    return res.json({
      success: true,
      point: data.point
    });

  } catch (e) {
    console.log(e);
    return res.json({ success: false });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});