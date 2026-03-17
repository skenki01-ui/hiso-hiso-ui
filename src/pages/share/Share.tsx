import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

export default function Share() {

  const navigate = useNavigate();
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {

    let code = localStorage.getItem("ref_code");

    if (!code) {
      code = crypto.randomUUID().slice(0, 8);
      localStorage.setItem("ref_code", code);
    }

    // registerページ固定
    const origin = window.location.origin;
    const invite = `${origin}/register?ref=${code}`;

    setInviteUrl(invite);

  }, []);

  const copy = async () => {

    if (!inviteUrl) return;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      alert("リンクをコピーしました");
    } catch {
      alert("コピーできませんでした");
    }

  };

  const share = async () => {

    if (!inviteUrl) return;

    if (navigator.share) {

      try {
        await navigator.share({
          title: "ひそひそ",
          text: "このアプリ一緒に使おう",
          url: inviteUrl
        });
      } catch {}

    } else {
      copy();
    }

  };

  return (

    <div style={{
      minHeight: "100svh",
      background: "#eaf3ff",
      display: "flex",
      justifyContent: "center",
      paddingTop: 30
    }}>

      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: 20
      }}>

        <button onClick={() => navigate(-1)}>
          ← 戻る
        </button>

        <h2 style={{
          textAlign: "center",
          marginTop: 10
        }}>
          友だちを招待
        </h2>

        <p style={{
          textAlign: "center",
          fontSize: 14
        }}>
          QRかリンクで招待できます　100P贈呈
        </p>

        {inviteUrl && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20
          }}>
            <QRCodeSVG value={inviteUrl} size={160} />
          </div>
        )}

        <div style={{
          marginTop: 16,
          fontSize: 13,
          wordBreak: "break-all",
          textAlign: "center"
        }}>
          {inviteUrl}
        </div>

        <button
          style={{
            marginTop: 16,
            width: "100%",
            height: 48,
            borderRadius: 10,
            border: "none"
          }}
          onClick={copy}
        >
          リンクをコピー
        </button>

        <button
          style={{
            marginTop: 10,
            width: "100%",
            height: 48,
            borderRadius: 10,
            border: "none"
          }}
          onClick={share}
        >
          共有する
        </button>

      </div>

    </div>

  );

}