import React from "react";

export default function Tokushoho() {
  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      lineHeight: "1.8",
      minHeight: "100vh",
      background: "#fff"
    }}>

      {/* 戻る */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px"
      }}>
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
          特定商取引法
        </div>
      </div>

      <h2>特定商取引法に基づく表記</h2>

      <p><b>事業者名</b><br/>ひそひそ運営事務局</p>

      <p><b>運営責任者</b><br/>角谷 勝徳</p>

      <p><b>所在地</b><br/>大阪市住之江区御崎8-2-28</p>

      <p><b>電話番号</b><br/>080-5127-7084</p>

      <p><b>メールアドレス</b><br/>s_kenki@yahoo.co.jp</p>

      <p><b>販売価格</b><br/>各商品ページに記載</p>

      <p><b>商品代金以外の必要料金</b><br/>
        インターネット接続にかかる通信費等はお客様のご負担となります
      </p>

      <p><b>支払方法</b><br/>クレジットカード決済</p>

      <p><b>支払時期</b><br/>クレジットカード決済：購入時</p>

      <p><b>サービス提供時期</b><br/>決済完了後、即時利用可能</p>

      <p><b>返品・キャンセルについて</b><br/>
        デジタルコンテンツの特性上、購入後の返金・キャンセルはお受けできません
      </p>

      <p><b>動作環境</b><br/>インターネット接続が可能な環境でご利用ください</p>

      <p><b>特別条件</b><br/>未成年の方は保護者の同意を得た上でご利用ください</p>

    </div>
  );
}