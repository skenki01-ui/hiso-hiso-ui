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

      <p>
        <b>事業者名</b>
        <br />
        GearDock Lab
      </p>

      <p>
        <b>運営責任者</b>
        <br />
        角谷 勝徳
      </p>

      <p>
        <b>所在地</b>
        <br />
        大阪市住之江区御崎8-2-28
      </p>

      <p>
        <b>電話番号</b>
        <br />
        080-5127-7084
        <br />
        ※お問い合わせはメールにてお願いいたします
      </p>

      <p>
        <b>メールアドレス</b>
        <br />
        kunanahachi@gmail.com
      </p>

      <p>
        <b>販売価格</b>
        <br />
        ・1ポイント：10円
        <br />
        ・1ターン：5ポイント
        <br />
        ・1DAYパス：80ポイント
        <br />
        ・夜サブスクリプション：月額1200円
        <br />
        ・フルサブスクリプション：月額1900円
      </p>

      <p>
        <b>商品代金以外の必要料金</b>
        <br />
        インターネット接続にかかる通信費等は
        お客様のご負担となります
      </p>

      <p>
        <b>支払方法</b>
        <br />
        クレジットカード決済（Stripe）
      </p>

      <p>
        <b>支払時期</b>
        <br />
        クレジットカード決済：購入時に即時決済
      </p>

      <p>
        <b>サービス提供時期</b>
        <br />
        決済完了後、即時利用可能
      </p>

      <p>
        <b>返品・キャンセルについて</b>
        <br />
        デジタルコンテンツの特性上、
        購入後の返金・キャンセルは
        お受けできません
      </p>

      <p>
        <b>サブスクリプションの解約について</b>
        <br />
        次回更新日前までに解約することで、
        次回以降の請求を停止できます。
      </p>

      <p>
        <b>動作環境</b>
        <br />
        インターネット接続が可能な環境で
        ご利用ください
      </p>

      <p>
        <b>利用条件</b>
        <br />
        本サービスは18歳以上の方を対象としています。
      </p>

    </div>
  );
}