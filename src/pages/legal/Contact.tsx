import React from "react";

export default function Contact() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        lineHeight: "1.8",
        minHeight: "100vh",
        background: "#fff"
      }}
    >

      {/* 戻る */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px"
        }}
      >
        <div
          onClick={() => window.history.back()}
          style={{
            cursor: "pointer",
            fontSize: "18px",
            marginRight: "10px"
          }}
        >
          ◀︎
        </div>

        <div style={{ fontWeight: "bold" }}>
          お問い合わせ
        </div>
      </div>

      <h2>お問い合わせ</h2>

      <p>
        本サービスに関するお問い合わせは、以下のメールアドレスまでご連絡ください。
      </p>

      <p>
        <b>■事業者名</b><br />
        ひそひそ運営事務局
      </p>

      <p>
        <b>■メールアドレス</b><br />
        s_kenki@yahoo.co.jp
      </p>

      <p>
        内容を確認の上、通常2〜3営業日以内にご返信いたします。
      </p>

      <p>
        ※お問い合わせ内容によっては、ご返信にお時間をいただく場合がございます。
      </p>

    </div>
  );
}