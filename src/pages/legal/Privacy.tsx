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
        当サービスでは、以下の情報を取得する場合があります。<br/>
        ・ニックネーム<br/>
        ・メールアドレス（必要な場合）<br/>
        ・サービス利用履歴
      </p>

      <p>
        <b>■利用目的</b><br/>
        取得した情報は以下の目的で利用します。<br/>
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