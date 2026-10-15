// 公開前に設定してください。未設定のリンクは遷移せず、GAS未設定時はデモモードになります。
window.CONFIG={
  SITE_URL:"", INSTAGRAM_URL:"", LINE_URL:"", X_URL:"",
  GAS_WEB_APP_URL:"",   // GASデプロイURL（空欄＝デモモード）
  GA_ID:"",             // GA4測定ID
  FEE_TEXT:"入場無料（暫定）", // 入場料確定後に変更
  MAX_COMPANIONS:2,     // 同伴人数上限（暫定・要確認。GAS側 MAX_COMPANIONS と一致させる）
  LAST_SLOT:"18:30",    // 最終受付枠の開始時刻（暫定・要確認。GAS側と一致させる）
  CLOSED_DATES:[], CLOSED_BOOKING:[] // 追加の休廊日／受付終了日（YYYY-MM-DD）
};
