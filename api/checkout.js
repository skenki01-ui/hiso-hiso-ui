import Payjp from "payjp";

const payjp = Payjp(process.env.PAYJP_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { token } = req.body; // ←これ追加

    const charge = await payjp.charges.create({
      amount: 500,
      currency: "jpy",
      card: token, // ←ここ変える
      description: "テスト課金"
    });

    res.status(200).json({ success: true, charge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}