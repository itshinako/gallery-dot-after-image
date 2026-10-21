// 公開前に設定してください。未設定のリンクは遷移せず、GAS未設定時はデモモードになります。
window.CONFIG={
  SITE_URL:"https://itshinako.github.io/gallery-dot-after-image/", INSTAGRAM_URL:"", LINE_URL:"", X_URL:"",
  GAS_WEB_APP_URL:"https://script.google.com/macros/s/AKfycbzG7epOE3D3mw7_YJZh4lSNd7o2C4bKmXWmJSfzYyptjtH_z_SFo_Gbb-eGwE4kvXd2/exec",   // GASデプロイURL（空欄＝デモモード）
  GA_ID:"",             // GA4測定ID
  FEE_TEXT:"入場無料",
  MAX_COMPANIONS:2,     // 同伴者は最大2名（予約者と合計3名）。GAS側の上限も2に設定
  LAST_SLOT:"18:30",    // 最終受付枠の開始時刻（暫定・要確認。GAS側と一致させる）
  CLOSED_DATES:[], CLOSED_BOOKING:[] // 追加の休廊日／受付終了日（YYYY-MM-DD）
};
