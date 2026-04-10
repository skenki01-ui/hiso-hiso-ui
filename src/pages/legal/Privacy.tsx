import React from "react";

export default function Privacy() {
  return (
    <div style={{
      maxWidth:"600px",
      margin:"0 auto",
      padding:"20px",
      lineHeight:"1.8",
      minHeight:"100vh",
      background:"#fff"
    }}>

      {/* 戻る */}
      <div style={{
        display:"flex",
        alignItems:"center",
        marginBottom:"10px"
      }}>
        <div
          onClick={()=>window.history.back()}
          style={{
            cursor:"pointer",
            fontSize:"18px",
            marginRight:"10px"
          }}
        >
          ◀︎
        </div>
        <div style={{fontWeight:"bold"}}>プライバシー</div>
      </div>

      <h2>プライバシーポリシー</h2>

      <p>
        ひそひそ運営事務局（以下、「当事業者」といいます。）は、
        本サービスにおけるユーザーの個人情報の取り扱いについて、
        以下のとおりプライバシーポリシーを定めます。
      </p>

      <p>
        <b>■取得する情報</b><br/>
        ・ニックネーム<br/>
        ・メールアドレス（必要な場合）<br/>
        ・サービス利用履歴
      </p>

      <p>
        <b>■利用目的</b><br/>
        ・サービスの提供および運営<br/>
        ・ユーザーサポート<br/>
        ・サービス改善<br/>
        ・不正利用防止
      </p>

      <p>
        <b>■第三者提供</b><br/>
        法令に基づく場合を除き、ユーザーの同意なく第三者に提供することはありません。
      </p>

      <p>
        <b>■外部サービスの利用</b><br/>
        本サービスでは以下の外部サービスを利用する場合があります。<br/>
        ・Supabase（データベース管理）<br/>
        ・OpenAI（AI応答生成）<br/>
        ・Pay.jp（決済処理）
      </p>

      <p>
        <b>■安全管理</b><br/>
        個人情報の漏洩、滅失、毀損の防止その他の安全管理のために、
        必要かつ適切な措置を講じます。
      </p>

      <p>
        <b>■お問い合わせ</b><br/>
        メール：s_kenki@yahoo.co.jp
      </p>

      <p>
        <b>■改定</b><br/>
        本ポリシーの内容は必要に応じて変更することがあります。
      </p>

    </div>
  );
}